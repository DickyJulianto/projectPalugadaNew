// packages/backend/controllers/orderController.js

const Order = require("../models/Order");
const Product = require("../models/product");
const User = require("../models/user");
// Pastikan path ke service ini benar
const { placeOrderMicypedia } = require("../services/micyPediaService");

const createOrder = async (req, res) => {
    // ==== TITIK KRUSIAL ADA DI SINI ====
    // Pastikan Anda MENGGANTI string ini dengan _id user yang BENAR-BENAR ADA di database MongoDB Anda.
    // Buka Compass/Atlas, masuk ke koleksi 'users', dan salin salah satu nilai _id.
    const DUMMY_USER_ID = "685becaa623dd94656247885"; // <-- GANTI INI!

    // Nanti, kita akan mendapatkan ID ini dari token JWT, bukan hardcode.
    // const userId = req.user.id;

    const { productId, targetId } = req.body;

    if (!productId || !targetId) {
        return res
            .status(400)
            .json({ message: "Product ID dan Target ID wajib diisi." });
    }

    try {
        // Menggunakan try-catch untuk menangkap SEMUA kemungkinan error di dalam blok ini
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan." });
        }

        // Verifikasi user dummy
        const user = await User.findById(DUMMY_USER_ID);
        if (!user) {
            // Ini akan terjadi jika DUMMY_USER_ID salah
            return res
                .status(404)
                .json({
                    message: `User dengan ID ${DUMMY_USER_ID} tidak ditemukan. Harap periksa ID yang di-hardcode di controller.`,
                });
        }

        let order = new Order({
            user: user._id,
            product: product._id,
            targetId: targetId,
            price: product.price,
            status: "Pending",
        });
        await order.save();

        order.status = "Processing";
        order.transactionId = `dummy_stripe_${new Date().getTime()}`;

        const micyResult = await placeOrderMicypedia(
            product.apiServiceId,
            targetId,
            1
        );

        if (micyResult.status) {
            order.status = "Success";
            order.providerOrderId = micyResult.data.id_order;
            await order.save();
            // Kirim respons JSON yang SUKSES
            return res.status(201).json({
                message: "Pesanan berhasil dibuat dan sedang diproses!",
                order: order,
            });
        } else {
            order.status = "Failed";
            await order.save();
            // Kirim respons JSON yang GAGAL (tapi tetap JSON)
            return res.status(400).json({
                message: `Gagal menempatkan pesanan ke provider: ${micyResult.data}`,
                order: order,
            });
        }
    } catch (error) {
        // Jika ada error tak terduga (misal, database down, ID tidak valid, dll)
        console.error("FATAL ERROR saat membuat pesanan:", error);
        // Kirim respons JSON berisi pesan error
        return res
            .status(500)
            .json({
                message: "Terjadi kesalahan internal pada server.",
                error: error.message,
            });
    }
};

module.exports = { createOrder };