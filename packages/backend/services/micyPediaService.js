// packages/backend/services/micyPediaService.js

// const axios = require('axios'); // Kita akan gunakan ini nanti

/**
 * Mensimulasikan pemesanan ke API Micypedia.
 * @param {string} apiServiceId - ID Layanan dari produk kita.
 * @param {string} target - Username/ID target.
 * @param {number} quantity - Jumlah yang dipesan.
 * @returns {Promise<object>} - Hasil dari API.
 */
const placeOrderMicypedia = async (apiServiceId, target, quantity) => {
    console.log(
        `[Micypedia Service] Mencoba memesan layanan ${apiServiceId} untuk ${target}...`
    );

    // Di sini kita akan menggunakan Axios untuk call API sebenarnya.
    // Untuk sekarang, kita SIMULASIKAN respons sukses.
    try {
        // Anggap prosesnya butuh 1.5 detik
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockResponse = {
            status: true, // Sukses
            data: {
                id_order: Math.floor(100000 + Math.random() * 900000), // Buat ID Order acak
                harga: 25000, // Contoh harga
            },
        };

        console.log(
            `[Micypedia Service] Berhasil! ID Order: ${mockResponse.data.id_order}`
        );
        return mockResponse;
    } catch (error) {
        console.error("[Micypedia Service] Gagal:", error);
        return {
            status: false,
            data: error.message,
        };
    }
};

module.exports = {
    placeOrderMicypedia,
};
