const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definisikan struktur (skema) untuk produk
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Nama produk tidak boleh kosong"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Deskripsi produk tidak boleh kosong"]
    },
    price: {
        type: Number,
        required: [true, "Harga produk tidak boleh kosong"],
        min: [0, "Harga produk tidak boleh negatif"]
    },
    category: {
        type: String,
        required: [true, "Kategori produk tidak boleh kosong"],
        enum: ["Instagram", "TikTok", "YouTube", "Lainnya"], // Contoh kategori, bisa disesuaikan
        default: "Lainnya"
    },
    // ID layanan dari API Micypedia, penting untuk transaksi nanti
    apiServiceId: {
        type: String,
        required: [true, "ID Layanan dari API pihak ketiga wajib diisi"]
    },
    // Menandakan apakah produk ini butuh input username atau link
    requiresUsername: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // timestamps akan otomatis membuat field createdAt dan updatedAt

// Buat model dari skema yang telah didefinisikan
const Product = mongoose.model('Product', productSchema);

// Ekspor model agar bisa digunakan di file lain
module.exports = Product;