// packages/frontend/app/components/Navbar.js (Setelah Diperbaiki)

import { BiShoppingBag, BiUser } from "react-icons/bi";

// Untuk sementara, kita buat kondisi login statis
// Nanti ini akan diganti dengan state dari Context
const isSignedIn = false; // Ganti jadi true untuk melihat tampilan "logout"

export default function Navbar({ cart, onCartClick }) {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
      // Logika untuk logout (misal: hapus token dari localStorage)
      console.log("User logged out");
  };

  return (
    <nav className="bg-white p-3 md:p-4 mt-4 flex justify-between items-center rounded-lg">
      <a href="/" className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent font-semibold text-2xl">
        Store
      </a>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button onClick={onCartClick} className="text-black pr-2">
            <BiShoppingBag size={24} className="inline" />
            {cartQuantity > 0 && (
              <span className="absolute top-[-10px] right-[-4px] bg-orange-700 text-white text-xs px-2 py-1 rounded-full">
                {cartQuantity}
              </span>
            )}
          </button>
        </div>
        {/* Tombol Login/Logout Kustom */}
        {isSignedIn ? (
          <button onClick={handleLogout} className="text-black">
            Logout
          </button>
        ) : (
          <a href="/login-page/login.html" className="text-black"> {/* Arahkan ke halaman login Anda */}
            <BiUser size={22} className="inline" />
          </a>
        )}
      </div>
    </nav>
  );
}