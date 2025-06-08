const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DB_URI = 'mongodb+srv://dicky_js:renjerBiru123@cluster0.esghfyl.mongodb.net/palugada-db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
    .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

app.post('/api/register', async (req, res) => {
try {
    // Ambil data dari body request
    const { username, email, password } = req.body;

    // Mengecek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Membuat user baru
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    });

    // Menyimpan user baru ke database
    await newUser.save();

    // Mengirim respons sukses
    res.status(201).json({ message: 'Pengguna berhasil didaftarkan!' });

    } catch (error) {
    // Kalo ada masalah di server
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

// Rute Login -- BARU --
app.post('/api/login', async (req, res) => {
    try {
        // 1. Ambil email dan password dari body permintaan
        const { email, password } = req.body;

        // 2. Cek apakah pengguna dengan email tersebut ada
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email tidak ditemukan.' });
        }

        // 3. Bandingkan password yang dimasukkan dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        // 4. Jika password cocok, buat JSON Web Token (JWT)
        const payload = {
            user: {
                id: user.id // Simpan ID pengguna di dalam token
            }
        };

        jwt.sign(
            payload,
            'ap4luM4u9Uaad4', // Kunci rahasia untuk "menandatangani" token
            { expiresIn: '1h' }, // Token akan kedaluwarsa dalam 1 jam
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Kirim token ke klien
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});


// Buat testing
app.get('/', (req, res) => {
    res.send('<h1>Server PaluGada Aktif!</h1>');
});


// Menjalankan Server
app.listen(PORT, () => {
    console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});