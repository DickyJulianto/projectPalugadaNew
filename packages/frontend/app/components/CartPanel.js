// packages/frontend/app/components/CartPanel.js (Setelah Diperbaiki)

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Pindahkan inisialisasi Stripe ke luar agar tidak dibuat ulang terus-menerus
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CartPanel({
  cart,
  updateQuantity,
  removeFromCart,
  total,
  closeCart,
}) {
  const [loading, setLoading] = useState(false);

  // Untuk sekarang, kita anggap user sudah login jika mereka bisa checkout
  // Nanti ini bisa diintegrasikan dengan token dari localStorage
  const isSignedIn = true; // Asumsi sementara

  const checkout = async () => {
    if (!isSignedIn) {
      // Arahkan ke halaman login kustom Anda
      window.location.href = "/login_page/login.html";
      return;
    }

    // Untuk sementara, kita tidak mengirim email, atau Anda bisa menggunakan email statis
    const email = "testing@example.com"; // Email placeholder

    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, email }), // Kirim email placeholder
      });

      const session = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reletive text-white z-50 fixed top-0 right-0 w-screen sm:w-[450px] h-full shadow-lg p-6 bg-zinc-950">
      <button onClick={closeCart} className="absolute top-4 right-4 text-3xl">
        x
      </button>
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-white">Your cart is emty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt="cart image"
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-lg font-bold mt-4">
            Total: ${total.toFixed(2)}
          </div>
          {/* Checkout Button */}
          <button
            onClick={checkout}
            disabled={loading || cart.length === 0} // Nonaktifkan jika loading atau keranjang kosong
            className="mt-4 py-2 bg-green-500 text-white rounded px-6 disabled:bg-gray-500"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}