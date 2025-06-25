import { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen Card untuk menampilkan satu produk
const ProductCard = ({ product }) => (
    <div className="product-card">
        <h3>{product.name}</h3>
        <p>Kategori: {product.category}</p>
        <p>Harga: Rp {product.price.toLocaleString('id-ID')} / 1000</p>
        <p>Min/Max Pesanan: {product.minOrder} / {product.maxOrder}</p>
    </div>
);

// Halaman utama Store
const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
                const response = await axios.get(apiUrl);
                setProducts(response.data);

                const uniqueCategories = ['all', ...new Set(response.data.map(p => p.category))];
                setCategories(uniqueCategories);
            } catch (err) {
                setError('Gagal memuat produk. Silakan coba lagi nanti.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (loading) return <p>Memuat produk...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="store-container">
            <h1>Toko Layanan Kami</h1>
            <p>Silakan pilih layanan yang Anda butuhkan.</p>

            <div className="category-filter">
                <label htmlFor="category">Pilih Kategori: </label>
                <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'Semua Kategori' : cat}</option>
                    ))}
                </select>
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default StorePage;