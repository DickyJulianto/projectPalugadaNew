const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

// --- Rute Registrasi & Login (Dengan Sedikit Penyesuaian) ---

// Rute Registrasi (tidak ada perubahan logika, sudah benar)
app.post('/register', 
    [
        body('username', 'Username minimal 3 karakter').isLength({ min: 3 }).trim().escape(),
        body('email', 'Format email tidak valid').isEmail().normalizeEmail(),
        body('password', 'Password minimal 8 karakter').isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            res.status(201).send('User registered successfully');
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ errors: [{ msg: 'Username atau email sudah digunakan.' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan pada server: ' + error.message }] });
        }
    }
);

// Rute Login (dengan penambahan 'role' di dalam token)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
        if (!user) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // --- PERUBAHAN DI SINI ---
        // Menambahkan 'role' ke dalam data token (payload)
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Menambahkan peran pengguna ke token
            process.env.JWT_SECRET || 'your_fallback_jwt_secret',
            { expiresIn: '1h' }
        );
        
        res.json({ token, role: user.role }); // Mengirim peran juga dalam respons
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// --- Middleware & Rute Terproteksi ---

// Middleware Autentikasi (Cek apakah user sudah login)
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Akses ditolak. Token tidak ada.');
        }
        // Menambahkan 'role' saat token diverifikasi
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_jwt_secret');
        req.user = decoded; // req.user sekarang berisi { userId, role }
        next();
    } catch (error) {
        res.status(400).send('Token tidak valid.');
    }
};

// --- PENAMBAHAN BARU: MIDDLEWARE OTORISASI ADMIN ---
const adminAuth = (req, res, next) => {
    // Middleware ini harus dijalankan SETELAH middleware 'auth'
    if (req.user && req.user.role === 'admin') {
        next(); // Lanjutkan jika pengguna adalah admin
    } else {
        res.status(403).send('Akses ditolak. Hanya untuk admin.'); // Kirim error 403 Forbidden jika bukan admin
    }
};

// --- PENAMBAHAN BARU: RUTE KHUSUS ADMIN ---
// Rute ini hanya bisa diakses oleh user yang login DAN memiliki peran 'admin'
app.get('/api/admin/data', auth, adminAuth, (req, res) => {
    // Karena sudah melewati middleware, kita bisa yakin req.user adalah admin
    res.json({
        message: `Selamat datang di dasbor admin, ${req.user.userId}!`,
        secretData: 'Ini adalah data rahasia yang hanya bisa dilihat oleh admin.'
    });
});

// Contoh Rute yang hanya butuh login (tanpa harus admin)
app.get('/api/user/profile', auth, (req, res) => {
    // Di sini kita bisa mengambil data user dari database berdasarkan req.user.userId
    res.json({
        message: 'Ini adalah halaman profil Anda.',
        userData: req.user
    });
});


// ... (Rute /forgot-password dan /reset-password tidak perlu diubah) ...
app.post('/forgot-password', async (req, res) => { /* ... kode lama ... */ });
app.post('/reset-password', async (req, res) => { /* ... kode lama ... */ });


// --- Koneksi & Server ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});