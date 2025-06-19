const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    // --- PENAMBAHAN BARU UNTUK RESET PASSWORD ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);