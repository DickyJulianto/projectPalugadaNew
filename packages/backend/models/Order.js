// packages/backend/models/Order.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        targetId: {
            // Ini untuk menyimpan username/ID target dari pengguna
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Processing", "Success", "Failed", "Canceled"],
            default: "Pending",
        },
        price: {
            // Harga saat transaksi terjadi
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            default: "Stripe", // Untuk saat ini kita hardcode Stripe
        },
        transactionId: {
            // Untuk menyimpan ID dari payment gateway (Stripe)
            type: String,
        },
        providerOrderId: {
            // Untuk menyimpan ID pesanan dari Micypedia
            type: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;