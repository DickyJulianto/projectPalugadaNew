// Memuat environment variables dari file .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; // Menggunakan nama paket yang benar
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Passport
app.use(passport.initialize());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = 'https://projectpalugada.netlify.app';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ===============================================
// == KONFIGURASI PASSPORT.JS UNTUK SSO ==
// ===============================================

// -- Strategi Google --
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user); // User ditemukan, lanjutkan
        } else {
            // Jika user tidak ada, buat user baru
            const newUser = new User({
                username: profile.displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000), // Tambahkan angka acak untuk keunikan
                email: profile.emails[0].value,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Buat password acak
                ssoProvider: 'google',
                ssoId: profile.id
            });
            await newUser.save();
            return done(null, newUser); // Lanjutkan dengan user baru
        }
    } catch (error) {
        return done(error, false);
    }
}));

// -- Strategi GitHub --
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email'] // Meminta akses email
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // GitHub terkadang tidak menyediakan email publik, cari dari array emails
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
            return done(new Error('Email tidak tersedia dari profil GitHub.'), false);
        }
        
        let user = await User.findOne({ email: email });

        if (user) {
            return done(null, user);
        } else {
            const newUser = new User({
                username: profile.username,
                email: email,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                ssoProvider: 'github',
                ssoId: profile.id
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// ===============================================
// == RUTE OTENTIKASI BARU UNTUK SSO ==
// ===============================================

// Rute untuk memulai otentikasi Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rute Callback setelah otentikasi Google berhasil
app.get(
    '/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login_page/login.html` }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        // Redirect ke halaman handler di frontend dengan membawa token
        res.redirect(`${FRONTEND_URL}/auth-handler.html?token=${token}&role=${req.user.role}`);
    }
);

// Rute untuk memulai otentikasi GitHub
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Rute Callback setelah otentikasi GitHub berhasil
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login_page/login.html` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, role: req.user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${FRONTEND_URL}/auth-handler.html?token=${token}&role=${req.user.role}`);
    }
);


// ===============================================
// == RUTE LAMA (LOGIN MANUAL & REGISTRASI) ==
// ===============================================

// Rute Registrasi
app.post('/register', async (req, res) => {
    // ... (kode registrasi Anda yang sudah ada di sini)
});

// Rute Login Manual
app.post('/login', async (req, res) => {
    // ... (kode login dengan reCAPTCHA Anda yang sudah ada di sini)
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});