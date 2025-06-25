// packages/backend/services/micypediaService.js

const axios = require("axios");

const API_URL = "https://micypedia.id/api/v2";
// Anda perlu menyimpan API Key ini di file .env
const API_KEY = process.env.MICYPEDIA_API_KEY;

const micypediaAPI = axios.create({
    baseURL: API_URL,
});

// Fungsi untuk mengambil semua layanan dari Micypedia
const getServices = async () => {
    try {
        const response = await micypediaAPI.post("", {
            key: API_KEY,
            action: "services",
        });
        // Kita akan menambahkan logika untuk menyimpan/update data ini ke database MongoDB kita
        return response.data;
    } catch (error) {
        console.error("Error fetching services from Micypedia:", error);
        throw new Error("Failed to fetch services.");
    }
};

// Fungsi untuk membuat pesanan
const createOrder = async (serviceId, target, quantity) => {
    try {
        const response = await micypediaAPI.post("", {
            key: API_KEY,
            action: "add",
            service: serviceId,
            link: target, // 'link' digunakan untuk username atau link post
            quantity: quantity,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating order with Micypedia:", error);
        throw new Error("Failed to create order.");
    }
};

module.exports = {
    getServices,
    createOrder,
};
