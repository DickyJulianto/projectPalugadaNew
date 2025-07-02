"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Impor toast untuk notifikasi

// 1. Membuat Context
const AuthContext = createContext(null);

// 2. Membuat Provider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // State untuk loading awal
    const router = useRouter();

    // Cek token di localStorage saat aplikasi pertama kali dimuat
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("userRole");
            if (token) {
                // Di aplikasi nyata, Anda akan memverifikasi token ini ke backend
                setUser({ token, role });
            }
        } catch (error) {
            console.error("Gagal mengakses localStorage:", error);
        } finally {
            setLoading(false); // Selesai loading
        }
    }, []);

    // Fungsi untuk login
    const login = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        setUser({ token, role });
        toast.success("Login berhasil! Selamat datang kembali."); // Notifikasi sukses
        router.push("/");
    };

    // Fungsi untuk logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setUser(null);
        toast.info("Anda telah berhasil logout."); // Notifikasi info
        router.push("/login"); // Arahkan ke halaman login setelah logout
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Custom Hook untuk mempermudah penggunaan
export const useAuth = () => {
    return useContext(AuthContext);
};
