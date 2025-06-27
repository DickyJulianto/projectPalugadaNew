// packages/frontend/app/products/[id]/page.js

import OrderForm from "./OrderForm"; // Import client component

async function getProductDetails(id) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const res = await fetch(`${apiUrl}/products/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default async function ProductDetailPage({ params }) {
    const product = await getProductDetails(params.id);

    if (!product) {
        return (
            <div className="text-center text-white p-10">
                Produk tidak ditemukan.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="container max-w-2xl mx-auto">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                    <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded mb-4 inline-block">
                        {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-white mb-3">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-bold text-sky-400 mb-4">
                        {formatRupiah(product.price)}
                    </p>
                    <p className="text-slate-400 mb-6">{product.description}</p>

                    <hr className="border-slate-700 my-6" />

                    {/* Render Client Component untuk form */}
                    <OrderForm product={product} />
                </div>
            </div>
        </main>
    );
}
