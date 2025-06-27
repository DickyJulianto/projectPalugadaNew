// packages/backend/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// Nanti kita tambahkan middleware 'protect' untuk memastikan user sudah login
router.post('/', createOrder);

module.exports = router;