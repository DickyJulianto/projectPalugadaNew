const express = require('express');
const router = express.Router();
const { syncProducts, getProducts, createOrder } = require('../controllers/productController');
// const { protect } = require('../middleware/authMiddleware'); // Kita akan aktifkan ini nanti

// Endpoint untuk mengambil semua produk yang akan ditampilkan ke user
router.get('/', getProducts);

// Endpoint untuk membuat pesanan baru
// Nantinya kita akan tambahkan middleware 'protect' agar hanya user login yang bisa akses
router.post('/order', createOrder);

// Endpoint untuk admin melakukan sinkronisasi manual data produk dari Micypedia
router.post('/sync', syncProducts);


module.exports = router;