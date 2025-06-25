// Memuat environment variables dari file .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Import Models and Routes
const User = require('./models/user');
const productRoutes = require('./routes/productRoutes'); // Import product routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser
app.use(passport.initialize()); // Inisialisasi Passport

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = 'https://projectpalugada.netlify.app';

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ===============================================
// == KONFIGURASI PASSPORT.JS UNTUK SSO ==
// ===============================================
// ... (Kode Passport.js Anda tidak perlu diubah, sudah benar)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://projectpalugada.onrender.com/auth/google/callback"
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
    callbackURL: "https://projectpalugada.onrender.com/auth/github/callback",
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

// Rute Otentikasi SSO
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login_page/login.html` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth.html?token=${token}&role=${req.user.role}`);
    }
);
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login_page/login.html` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth.html?token=${token}&role=${req.user.role}`);
    }
);

// Rute Registrasi & Login Manual
app.post('/register', async (req, res) => { /* ... kode Anda ... */ });
app.post('/login', async (req, res) => { /* ... kode Anda ... */ });

// Rute Admin
const adminAuth = require('./middleware/adminAuth');
app.get('/api/users', adminAuth, async (req, res) => { /* ... kode Anda ... */ });

// Rute untuk Produk dan Pesanan (BARU)
app.use('/api/products', productRoutes); // <-- PERBAIKAN: Dipindahkan ke sini agar rapi

// ===============================================
// == MULAI SERVER ==
// ===============================================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); // <-- PERBAIKAN: Hanya ada satu app.listen