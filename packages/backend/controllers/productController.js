const Product = require("../models/product");
const {
    getApiServices,
    createApiOrder,
} = require("../services/micyPediaService");

// @desc    Sinkronisasi layanan dari Micypedia ke DB kita
// @route   POST /api/products/sync
// @access  Admin (untuk sekarang kita buat public untuk testing)
const syncProducts = async (req, res) => {
    try {
        const services = await getApiServices();

        // LANGKAH 1: Validasi dan Log Data Mentah dari API
        if (!services || !Array.isArray(services) || services.length === 0) {
            console.error(
                "API Micypedia tidak mengembalikan array layanan yang valid."
            );
            return res
                .status(500)
                .json({
                    message:
                        "Gagal mengambil data layanan yang valid dari API.",
                });
        }

        console.log(
            `Berhasil menerima ${services.length} layanan dari API. Contoh data pertama:`,
            services[0]
        );

        const operations = services.map((service) => ({
            updateOne: {
                filter: { serviceId: service.service },
                update: {
                    $set: {
                        name: service.name,
                        type: service.type,
                        category: service.category,
                        price: parseFloat(service.rate),
                        minOrder: parseInt(service.min, 10),
                        maxOrder: parseInt(service.max, 10),
                        description: service.dripfeed
                            ? "Drip-feed available"
                            : "",
                    },
                },
                upsert: true,
            },
        }));

        console.log("Contoh operasi untuk bulkWrite:", operations[0]);

        // LANGKAH 2: Jalankan bulkWrite dan simpan hasilnya
        const result = await Product.bulkWrite(operations);
        console.log("Hasil dari operasi bulkWrite:", result);

        // LANGKAH 3: Verifikasi apakah ada data yang benar-benar ditulis
        if (
            result.upsertedCount === 0 &&
            result.modifiedCount === 0 &&
            result.deletedCount === 0
        ) {
            console.warn(
                "Peringatan: Operasi bulkWrite selesai tetapi tidak ada dokumen yang ditambahkan, diubah, atau dihapus."
            );
            // Kirim pesan sukses, tapi dengan detail bahwa tidak ada data berubah
            return res.status(200).json({
                message:
                    "Sinkronisasi selesai, namun tidak ada data baru yang ditambahkan atau data lama yang diubah.",
                details: result,
            });
        }

        // Jika sukses, kirim respons dengan detail jumlah data yang diproses
        res.status(200).json({
            message: `Sinkronisasi sukses! ${result.upsertedCount} layanan ditambahkan, ${result.modifiedCount} layanan diperbarui.`,
            details: result,
        });
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({
            message: "Terjadi error saat sinkronisasi produk dengan Micypedia.",
            errorDetails: error.message,
        });
    }
};

// ... (fungsi getProducts dan createOrder tidak perlu diubah)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ category: 1, price: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products from database.",
        });
    }
};

const createOrder = async (req, res) => {
    // ... kode yang sudah ada
    const { serviceId, target, quantity } = req.body;

    if (!serviceId || !target || !quantity) {
        return res.status(400).json({
            message: "Please provide serviceId, target, and quantity",
        });
    }

    try {
        const product = await Product.findOne({ serviceId: serviceId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const orderResult = await createApiOrder({
            serviceId,
            target,
            quantity,
        });

        if (orderResult.error) {
            return res
                .status(400)
                .json({ message: `Order failed: ${orderResult.error}` });
        }

        res.status(201).json({
            message: "Order placed successfully!",
            orderDetails: orderResult,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while creating order." });
    }
};

module.exports = {
    syncProducts,
    getProducts,
    createOrder,
};
