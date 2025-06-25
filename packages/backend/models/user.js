const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        // Password tidak lagi wajib, karena pengguna SSO tidak memiliki password
        required: function() { return !this.ssoProvider; } 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // ===============================================
    // == FIELD BARU UNTUK SSO DITAMBAHKAN DI SINI ==
    // ===============================================
    ssoProvider: {
        type: String,
        required: false // Tidak wajib untuk pendaftaran manual
    },
    ssoId: {
        type: String,
        required: false,
        unique: true,
        sparse: true // Memungkinkan nilai null/kosong menjadi tidak unik
    },
    // ===============================================
    // == AKHIR DARI PENAMBAHAN FIELD SSO           ==
    // ===============================================
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password sebelum menyimpan untuk pendaftaran manual
UserSchema.pre('save', async function(next) {
    // Hanya hash password jika field ini diubah (atau baru) dan bukan dari SSO
    if (!this.isModified('password') || this.ssoProvider) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);