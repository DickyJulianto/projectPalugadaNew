const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // --- PENAMBAHAN BARU UNTUK RBAC ---
    role: {
        type: String,
        enum: ['user', 'admin'], // Hanya mengizinkan nilai 'user' atau 'admin'
        default: 'user'         // Nilai default saat user baru mendaftar
    },

    // Field untuk reset password dari langkah sebelumnya
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);