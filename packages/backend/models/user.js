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
        required: function() { return !this.ssoProvider; } 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    ssoProvider: {
        type: String,
        required: false
    },
    ssoId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    // Field untuk reset password ditempatkan di sini
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    // Hanya ada satu field createdAt
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Hash password sebelum menyimpan untuk pendaftaran manual
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
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