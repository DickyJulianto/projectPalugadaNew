"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductList from "./components/ProductList";
import CartPanel from "./components/CartPanel";
import { useEffect, useState } from "react";
import { products } from "./data/products";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // On add to cart or remove show toast message
  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
      setToastMessage(null);
    }
  }, [toastMessage]);

  // Add To Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setToastMessage(`${product.name} Added to cart`);
  };

  // Update Quantity
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remove From Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    setToastMessage("Item Removed From Cart");
  };

  // Total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Cart Open CLose
  const toggleCartPanel = () => {
    setCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  return (
    <div className="max-w-6xl m-auto w-[90%]">
      <Navbar cart={cart} onCartClick={toggleCartPanel} />
      <Hero />
      <div>
        <h1 className="text-3xl font-bold py-4">Products</h1>
        <ProductList addToCart={addToCart} />
      </div>
      {isCartOpen && (
        <CartPanel
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          total={total}
          closeCart={closeCart}
        />
      )}
      <ToastContainer />
      <p className="text-center py-8">&#169; Store</p>
    </div>
  );
}
