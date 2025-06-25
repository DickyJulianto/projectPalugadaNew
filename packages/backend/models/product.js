const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        serviceId: {
            type: Number,
            required: true,
            unique: true,
            index: true, // Menambahkan index untuk pencarian yang lebih cepat
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        price: {
            // Ini adalah harga asli dari API (biasanya per 1000)
            type: Number,
            required: true,
        },
        minOrder: {
            type: Number,
            required: true,
        },
        maxOrder: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
