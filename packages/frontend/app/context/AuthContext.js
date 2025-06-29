"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 1. Membuat Context
const AuthContext = createContext(null);

// 2. Membuat Provider (komponen yang akan "membungkus" aplikasi)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Cek apakah ada token di localStorage saat aplikasi pertama kali dimuat
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (token) {
            setUser({ token, role });
        }
    }, []);

    // Fungsi untuk "login" di sisi frontend
    const login = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        setUser({ token, role });
        router.push("/"); // Arahkan ke halaman utama setelah login
    };

    // Fungsi untuk logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setUser(null);
        alert("Anda telah berhasil logout.");
        router.push("/"); // Kembali ke halaman utama setelah logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Membuat Custom Hook untuk mempermudah penggunaan context
export const useAuth = () => {
    return useContext(AuthContext);
};
