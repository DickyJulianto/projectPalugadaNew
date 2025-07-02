require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Import Models and Routes
const User = require('./models/user');
// const Product = require('./models/product'); // Tidak digunakan di file ini
// require('./models/Order'); // Tidak digunakan di file ini

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminAuth = require('./middleware/adminAuth');

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL]
}));
app.use(express.json());
// PERBAIKAN: Menambahkan kurung tutup yang hilang
app.use(passport.initialize());

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// ===============================================
// == KONFIGURASI PASSPORT.JS UNTUK SSO ==
// ===============================================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://projectpalugadanew.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) return done(null, user);
        
        const newUser = new User({
            username: profile.displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            ssoProvider: 'google',
            ssoId: profile.id
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://projectpalugadanew.onrender.com/auth/github/callback",
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) return done(new Error('Email tidak tersedia dari profil GitHub.'), false);

        let user = await User.findOne({ email: email });
        if (user) return done(null, user);

        const newUser = new User({
            username: profile.username,
            email: email,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            ssoProvider: 'github',
            ssoId: profile.id
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));


// ===============================================
// == DEFINISI SEMUA RUTE APLIKASI ==
// ===============================================

// Rute Registrasi Manual
app.post(
    '/register',
    body('email', 'Please include a valid email').isEmail(),
    body('username', 'Username is required').not().isEmpty(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            user = new User({ username, email, password });
            await user.save();
            res.status(201).json('User registered successfully');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Rute Login Manual
app.post(
    '/login',
    body('username', 'Username or email is required').not().isEmpty(),
    body('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ $or: [{ email: username }, { username: username }] });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const payload = { id: user.id, role: user.role };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Rute Otentikasi SSO
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth.html?token=${token}&role=${req.user.role}`);
    }
);
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth.html?token=${token}&role=${req.user.role}`);
    }
);

// Rute Admin
app.get('/api/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Rute untuk Produk dan Pesanan
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ===============================================
// == KONEKSI DATABASE & SERVER ==
// ===============================================
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });