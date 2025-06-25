// Navbar
import { BiShoppingBag, BiUser } from "react-icons/bi";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar({ cart, onCartClick }) {
  const { isSignedIn } = useAuth();
  // Show Cart Quantity With Cart Icon
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white p-3 md:p-4 mt-4 flex justify-between items-center rounded-lg">
      <a
        href="/"
        className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent font-semibold text-2xl"
      >
        Store
      </a>
      <div className="flex items-center space-x-4">
        {/* Cart Icon */}
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
        {/* User Button */}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="text-black"
          >
            <BiUser size={22} className="inline" />
          </button>
        )}
      </div>
    </nav>
  );
}
