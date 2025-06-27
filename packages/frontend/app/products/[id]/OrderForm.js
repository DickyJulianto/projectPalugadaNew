// packages/frontend/app/products/[id]/OrderForm.js
"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderForm({ product }) {
    const [targetId, setTargetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOrder = async () => {
        if (!targetId) {
            toast.error("Harap masukkan User ID / Username target.");
            return;
        }
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${apiUrl}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Nanti kita tambahkan 'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    productId: product._id,
                    targetId: targetId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Jika response dari server tidak OK (4xx atau 5xx)
                throw new Error(data.message || "Terjadi kesalahan");
            }

            toast.success(data.message);
            setTargetId(""); // Kosongkan input setelah berhasil
        } catch (error) {
            console.error("Gagal membuat pesanan:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6">
            {/* Tambahkan ToastContainer di sini atau di layout utama */}
            <ToastContainer
                theme="dark"
                position="bottom-right"
                autoClose={5000}
            />

            <label
                htmlFor="targetId"
                className="block text-sm font-medium text-slate-300 mb-2"
            >
                Masukkan User ID / Username Target
            </label>
            <input
                type="text"
                id="targetId"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                disabled={isLoading}
                className="block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-white placeholder-slate-500 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
                placeholder={
                    product.category === "Instagram"
                        ? "@username_instagram"
                        : "Masukkan ID Target"
                }
            />

            <button
                onClick={handleOrder}
                disabled={isLoading}
                className="mt-4 w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 disabled:bg-sky-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Memproses...
                    </>
                ) : (
                    "Pesan Sekarang"
                )}
            </button>
        </div>
    );
}
