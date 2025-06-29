'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Impor useAuth

export default function Header() {
  const { user, logout } = useAuth(); // Ambil status user dan fungsi logout
  const [isActive, setIsActive] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <header className={isActive ? 'header header-active' : 'header'}>
        <a href="/" className="logo">
            <img src="/assets/logo/logo-favicon.png" alt="logo" />PaluGada
        </a>

        <nav className={isMenuOpen ? 'navbar nav-toggle' : 'navbar'}>
            <ul>
                <li><a href="#home" className="active">Home</a></li>
                <li><Link href="/store">Store</Link></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#joki">Joki</a></li>
                <li><a href="#jasa">Jasa</a></li>
                <li><a href="#review">Review</a></li>
                <li><a href="#contact">Contact</a></li>
                <li>
                    <Link href="/about_us.html" legacyBehavior>
                        <a target="_blank">Lainnya</a>
                    </Link>
                </li>
                {/* Tampilkan link Admin Panel jika role-nya admin */}
                {user && user.role === 'admin' && (
                  <li><a href="/admin/dashboard.html" style={{ color: '#ffc107', fontWeight: 600 }}>Admin Panel</a></li>
                )}
                <li>
                  {/* Tampilkan Logout jika ada user, atau Login jika tidak ada */}
                  {user ? (
                    <button onClick={logout} className="btn-login" style={{ background: 'none', border: 'none', color: '#39a7ff', cursor: 'pointer', fontSize: '2rem' }}>Logout</button>
                  ) : (
                    <Link href="/login" className="btn-login">Login</Link>
                  )}
                </li>
            </ul>
        </nav>

        <div 
          className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} 
          onClick={toggleMenu}
          style={{ fontSize: '2rem', cursor: 'pointer', color: '#39a7ff' }}
        ></div>
    </header>
  );
}