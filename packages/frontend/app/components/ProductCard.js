// packages/frontend/app/components/ProductCard.js

import Link from "next/link";

// Fungsi untuk format harga ke Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function ProductCard({ product }) {
    // Perhatikan penggunaan className.
    // Ganti 'bg-slate-800', 'border-slate-700', 'text-sky-400'
    // dengan warna dari tema desain projectPalugada Anda.
    return (
        <Link href={`/products/${product._id}`}>
            <div className="block h-full bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-white mb-2">
                    {product.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-sky-400">
                        {formatRupiah(product.price)}
                    </span>
                    <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded">
                        {product.category}
                    </span>
                </div>
            </div>
        </Link>
    );
}
