const axios = require("axios");

const API_URL = "https://micypedia.id/api/v2";
const API_KEY = process.env.MICYPEDIA_API_KEY;

// Fungsi untuk mengambil semua layanan dari Micypedia
const getApiServices = async () => {
    if (!API_KEY) {
        throw new Error("Micypedia API key is not defined in .env file");
    }
    try {
        const response = await axios.post(
            API_URL,
            new URLSearchParams({
                key: API_KEY,
                action: "services",
            })
        );

        if (response.data.status === false) {
            throw new Error("Failed to fetch services from Micypedia API.");
        }
        return response.data; // Mengembalikan data layanan
    } catch (error) {
        console.error("Error fetching services from Micypedia:", error.message);
        throw error;
    }
};

// Fungsi untuk membuat pesanan baru
const createApiOrder = async ({ serviceId, target, quantity }) => {
    if (!API_KEY) {
        throw new Error("Micypedia API key is not defined in .env file");
    }
    try {
        const response = await axios.post(
            API_URL,
            new URLSearchParams({
                key: API_KEY,
                action: "add",
                service: serviceId,
                link: target,
                quantity: quantity,
            })
        );
        return response.data; // Mengembalikan hasil order { order: 12345 } atau { error: '...' }
    } catch (error) {
        console.error("Error creating order with Micypedia:", error.message);
        throw error;
    }
};

module.exports = {
    getApiServices,
    createApiOrder,
};
