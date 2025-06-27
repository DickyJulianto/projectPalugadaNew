// packages/backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Untuk sementara, kita belum menambahkan otentikasi admin.
// Nanti kita akan menambahkan middleware di sini untuk melindungi route create, update, dan delete.
// const { protect, admin } = require('../middleware/authMiddleware');

// === Definisi Route ===

// GET /api/products -> Mengambil semua produk (bisa difilter by category)
// GET /api/products?category=Instagram
router.get('/', getAllProducts);

// GET /api/products/:id -> Mengambil satu produk
router.get('/:id', getProductById);

// --- Route Khusus Admin ---
// POST /api/products -> Membuat produk baru
router.post('/', createProduct); // Nanti ditambahkan middleware: protect, admin

// PUT /api/products/:id -> Memperbarui produk
router.put('/:id', updateProduct); // Nanti ditambahkan middleware: protect, admin

// DELETE /api/products/:id -> Menghapus produk
router.delete('/:id', deleteProduct); // Nanti ditambahkan middleware: protect, admin


module.exports = router;