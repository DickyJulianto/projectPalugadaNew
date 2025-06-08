const jwt = require('jsonwebtoken');

// Kunci rahasia yang sama dengan yang ada di server.js
const JWT_SECRET = 'kunciRahasianIniTidakBolehDiketahuiOrangLain';

function auth(req, res, next) {
    // 1. Ambil token dari header permintaan
    const token = req.header('x-auth-token');

    // 2. Cek apakah token ada
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });
    }

    try {
        // 3. Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);
        // 4. Tambahkan payload (data user) dari token ke objek request
        req.user = decoded.user;
        next(); // Lanjutkan ke rute berikutnya
    } catch (e) {
        res.status(400).json({ message: 'Token tidak valid.' });
    }
}

module.exports = auth;