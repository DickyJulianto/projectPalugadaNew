// packages/backend/controllers/productController.js

const Product = require('../models/product');

// @desc    Membuat produk baru (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, apiServiceId, requiresUsername } = req.body;

        // Validasi sederhana
        if (!name || !description || !price || !category || !apiServiceId) {
            return res.status(400).json({ message: 'Harap isi semua field yang wajib diisi.' });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            apiServiceId,
            requiresUsername,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Mengambil semua produk
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        // Fitur filter berdasarkan kategori
        const filter = req.query.category ? { category: req.query.category } : {};
        
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Mengambil satu produk berdasarkan ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        console.error(`Error fetching product with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Memperbarui produk (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, apiServiceId, requiresUsername } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.apiServiceId = apiServiceId || product.apiServiceId;
            product.requiresUsername = requiresUsername !== undefined ? requiresUsername : product.requiresUsername;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        console.error(`Error updating product with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Menghapus produk (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // atau .remove() untuk versi Mongoose lama
            res.json({ message: 'Produk berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        console.error(`Error deleting product with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};