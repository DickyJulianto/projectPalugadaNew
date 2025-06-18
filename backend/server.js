const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const cors = require('cors');
// Import modul baru untuk validasi
const { body, validationResult } = require('express-validator');

const User = require('./models/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rute dasar
app.get('/', (req, res) => {
    res.send('Welcome to the Palugada authentication server!');
});

// --- Rute Registrasi dengan Validasi ---
app.post(
    '/register',
    // Middleware validasi ditempatkan di sini
    [
        body('username', 'Username minimal 3 karakter').isLength({ min: 3 }).trim().escape(),
        body('email', 'Format email tidak valid').isEmail().normalizeEmail(),
        body('password', 'Password minimal 8 karakter').isLength({ min: 8 })
    ],
    async (req, res) => {
        // 1. Cek hasil validasi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Jika ada error, kirim status 400 dengan daftar error
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // 2. Lanjutkan proses jika tidak ada error validasi
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


// --- Rute Login (sudah benar, tidak perlu diubah) ---
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        });
        if (!user) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_fallback_jwt_secret',
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// --- Rute Terproteksi (Contoh) ---
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) { return res.status(401).send('Access denied'); }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

app.get('/protected', auth, (req, res) => {
    res.send('This is a protected route, access granted.');
});


// --- Koneksi ke MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// --- Menjalankan Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});