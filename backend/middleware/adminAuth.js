const jwt = require('jsonwebtoken');

// Middleware ini adalah gabungan dari auth.js dan pengecekan role
module.exports = function(req, res, next) {
    // 1. Ambil token dari header
    const token = req.header('x-auth-token');

    // 2. Cek jika tidak ada token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 3. Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menambahkan payload user ke request

        // 4. VERIFIKASI PERAN (ROLE) ADMIN
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Requires admin role.' });
        }

        // Jika semua verifikasi berhasil, lanjutkan ke rute berikutnya
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};