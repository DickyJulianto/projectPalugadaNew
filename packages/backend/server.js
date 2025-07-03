require('dotenv').config();

// ================== IMPORTS ==================
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Models & Routes
const User = require('./models/user');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminAuth = require('./middleware/adminAuth');

const app = express();

// ================== ENVIRONMENT VARIABLES ==================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ================== MIDDLEWARE ==================
app.use(cors({
    origin: [FRONTEND_URL, 'http://localhost:3000']
}));
app.use(express.json());
app.use(passport.initialize());

// ================== PASSPORT.JS SSO CONFIG ==================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) return done(null, user);
        
        const newUser = new User({
            username: profile.displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
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
    callbackURL: `${BACKEND_URL}/auth/github/callback`,
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
            ssoProvider: 'github',
            ssoId: profile.id
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));

// ================== API ROUTES ==================

// --- Rute Otentikasi Manual ---
app.post(
    '/register',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('username', 'Username is required').not().isEmpty(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ message: 'User already exists' });
            
            user = new User({ username, email, password });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

app.post(
    '/login',
    [
        body('username', 'Username or email is required').not().isEmpty(),
        body('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ $or: [{ email: username }, { username: username }] });
            if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
            
            const payload = { id: user.id, role: user.role };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// --- Rute Forgot & Reset Password ---
app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'Jika email terdaftar, link reset telah dikirim.' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 jam
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        });
        const resetURL = `${FRONTEND_URL}/reset-password?token=${token}`;
        const mailOptions = {
            to: user.email,
            from: `PaluGada Support <${EMAIL_USER}>`,
            subject: 'Reset Password Akun PaluGada Anda',
            text: `Anda telah meminta untuk mereset password.\n\nKlik link ini untuk melanjutkan:\n${resetURL}\n\nJika bukan Anda yang meminta, abaikan email ini.`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Link reset telah berhasil dikirim ke email Anda.' });
    } catch (err) {
        console.error('ERROR DI DALAM /forgot-password:', err);
        res.status(500).json({ message: 'Gagal mengirim email. Periksa log server.' });
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Token reset password tidak valid atau telah kedaluwarsa.' });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password berhasil direset. Silakan login.' });
    } catch (err) {
        console.error('ERROR DI DALAM /reset-password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Rute Otentikasi SSO ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth-success?token=${token}&role=${req.user.role}`);
    }
);
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth-success?token=${token}&role=${req.user.role}`);
    }
);

// --- Rute Lainnya ---
app.get('/api/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ================== DB CONNECTION & SERVER START ==================
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });