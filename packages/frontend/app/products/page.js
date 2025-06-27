// packages/frontend/app/products/page.js

import ProductCard from "../components/ProductCard";

// Fungsi untuk fetch data dari backend
async function getProducts() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/products`, {
            cache: "no-store", // Selalu ambil data terbaru
        });

        if (!res.ok) {
            throw new Error("Gagal mengambil data produk");
        }
        return res.json();
    } catch (error) {
        console.error(error);
        return []; // Kembalikan array kosong jika error
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <main className="min-h-screen bg-slate-900 text-white p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-center">
                    Pilih Layanan Anda
                </h1>
                <p className="text-slate-400 mb-8 text-center">
                    Klik pada layanan untuk melanjutkan pemesanan.
                </p>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500">
                        Saat ini tidak ada produk yang tersedia.
                    </p>
                )}
            </div>
        </main>
    );
}
