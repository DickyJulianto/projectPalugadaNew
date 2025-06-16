const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user'); // Pastikan path ini benar

const app = express();
app.use(cors());
app.use(express.json());

// Register
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username ATAU email
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

        // Pastikan Anda sudah mengatur JWT_SECRET di environment variables Render
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Welcome
app.get('/', (req, res) => {
    res.send('Welcome to the authentication server!');
});

// Protected route
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Access denied');
        }

        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

app.get('/protected', auth, (req, res) => {
    res.send('This is a protected route');
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Definisikan PORT sebelum digunakan
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});