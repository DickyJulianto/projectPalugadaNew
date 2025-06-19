const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto'); // Modul bawaan Node.js untuk kriptografi
const nodemailer = require('nodemailer'); // Library yang baru diinstal

const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Palugada authentication server!');
});


// --- Rute Registrasi dengan Validasi ---
app.post(
    '/register',
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


// --- Rute Login ---
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


// ======================================================
// == FITUR BARU: LUPA PASSWORD (Mulai) ==
// ======================================================

// --- Rute 1: Meminta Link Reset ---
app.post('/forgot-password', async (req, res) => {
    try {
        // 1. Buat token acak yang aman
        const token = crypto.randomBytes(20).toString('hex');

        // 2. Cari user berdasarkan email yang dikirim dari form
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // JANGAN beritahu jika email tidak ada demi keamanan.
            // Cukup kirim respons sukses palsu.
            return res.status(200).send('Jika email Anda terdaftar, Anda akan menerima link reset password.');
        }

        // 3. Simpan token dan waktu kedaluwarsa (misal: 1 jam) ke database
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 jam dalam milidetik
        await user.save();

        // 4. Konfigurasi transporter email menggunakan Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 5. Buat link reset (Arahkan ke halaman frontend Anda)
        // Pastikan URL frontend sudah benar
        const resetLink = `https://projectpalugada.netlify.app/reset-password.html?token=${token}`;

        // 6. Konfigurasi isi email
        const mailOptions = {
            to: user.email,
            from: `Palugada Project <${process.env.EMAIL_USER}>`,
            subject: 'Reset Password untuk Akun Palugada Anda',
            text: `Anda menerima email ini karena Anda (atau orang lain) telah meminta untuk mereset password akun Anda.\n\n` +
                    `Silakan klik link berikut, atau salin dan tempel di browser Anda untuk menyelesaikan proses:\n\n` +
                    `${resetLink}\n\n` +
                    `Jika Anda tidak meminta ini, abaikan saja email ini dan password Anda akan tetap sama.\n`
        };

        // 7. Kirim email
        await transporter.sendMail(mailOptions);

        res.status(200).send('Link reset password telah dikirim ke email Anda.');

    } catch (error) {
        console.error('Error di /forgot-password:', error);
        res.status(500).send('Error pada server.');
    }
});


// --- Rute 2: Melakukan Reset Password dengan Token ---
app.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        // Cari user dengan token yang valid dan belum kedaluwarsa
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // $gt = greater than (lebih besar dari)
        });

        if (!user) {
            return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
        }

        // Jika token valid, update password user
        user.password = await bcrypt.hash(password, 10);
        // Hapus token agar tidak bisa dipakai lagi
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send('Password berhasil direset. Silakan login dengan password baru Anda.');

    } catch (error) {
        console.error('Error di /reset-password:', error);
        res.status(500).send('Error pada server.');
    }
});
// ======================================================
// == FITUR BARU: LUPA PASSWORD (Selesai) ==
// ======================================================


// --- Rute Terproteksi (Contoh) ---
// (Tidak ada perubahan)
const auth = (req, res, next) => { /* ... */ };
app.get('/protected', auth, (req, res) => { /* ... */ });


// --- Koneksi ke MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// --- Menjalankan Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});