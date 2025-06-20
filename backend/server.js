// Memuat environment variables dari file .env di paling atas
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ambil koneksi string dari environment variable, bukan hardcode
const MONGO_URI = process.env.MONGO_URI; 
// Ambil JWT Secret dari environment variable
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

// Rute Registrasi (Tetap sama)
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ username, email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Rute Login (Sudah diperbarui dengan reCAPTCHA)
app.post('/login', async (req, res) => {
    const { username, password, recaptchaToken } = req.body;

    try {
        // Ambil Secret Key dari environment variable untuk keamanan
        const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LfXy2crAAAAALcAfVkLmoKJDTrsVxsnnPIRKeCx';
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        
        const recaptchaResponse = await axios.post(verificationURL);
        
        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ message: 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.' });
        }

        const user = await User.findOne({
            $or: [{ email: username }, { username: username }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Kredensial tidak valid' });
        }

        // Gunakan JWT_SECRET dari .env
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware auth (Tetap sama, namun lebih aman jika JWT_SECRET dari .env)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        // Gunakan JWT_SECRET dari .env
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

app.get('/protected', auth, (req, res) => {
    res.send(`Hello user ${req.user.id}, you have access. Your role is ${req.user.role}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});