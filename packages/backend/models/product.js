// packages/backend/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        serviceId: {
            // ID dari Micypedia
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            // Nama layanan, cth: "Instagram Followers [ REAL ]"
            type: String,
            required: true,
        },
        category: {
            // Kategori layanan, cth: "Instagram Followers"
            type: String,
            required: true,
        },
        price: {
            // Harga per 1000
            type: Number,
            required: true,
        },
        minOrder: {
            // Jumlah pesanan minimum
            type: Number,
            required: true,
        },
        maxOrder: {
            // Jumlah pesanan maksimum
            type: Number,
            required: true,
        },
        description: {
            // Deskripsi layanan
            type: String,
        },
        // tipe input yang dibutuhkan, cth: 'username' atau 'link'
        type: {
            type: String,
            enum: [
                "Default",
                "Custom Comments",
                "Mentions",
                "Subscriptions",
                "Package",
            ],
            default: "Default",
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
