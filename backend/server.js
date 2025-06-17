const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
    res.send('Welcome to the Palugada authentication server!');
});

// --- Rute Registrasi (Register) ---
app.post('/register', async (req, res) => {
    try {
        // Mengambil username, email, dan password dari body request
        const { username, email, password } = req.body;

        // Validasi dasar untuk memastikan semua data ada
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, dan password wajib diisi.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Membuat user baru dengan menyertakan email
        const user = new User({ username, email, password: hashedPassword });
        
        await user.save();
        
        // Mengirim respons sukses yang lebih konsisten
        res.status(201).send('User registered successfully');

    } catch (error) {
        // Menangani error jika username atau email sudah ada (kode error 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username atau email sudah digunakan.' });
        }
        // Menangani error server lainnya
        res.status(500).json({ message: 'Terjadi kesalahan pada server: ' + error.message });
    }
});


// --- Rute Login ---
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username ATAU email
        const user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        });

        // Jika user tidak ditemukan, kirim pesan error
        if (!user) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // Bandingkan password yang diinput dengan yang ada di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // Buat token jika login berhasil
        // Pastikan Anda sudah mengatur JWT_SECRET di environment variables Render
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_fallback_jwt_secret', // Gunakan fallback untuk keamanan
            { expiresIn: '1h' }
        );
        
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server: ' + error.message });
    }
});


// --- Rute Terproteksi (Contoh) ---
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Access denied');
        }

        // Verifikasi token dengan secret key dari environment variable
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
// Menggunakan URI dari environment variable yang sudah diatur di Render
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// --- Menjalankan Server ---
// Menggunakan PORT dari environment variable yang diberikan Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});