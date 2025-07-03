"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./login.css";
import { toast } from "react-toastify";

// Hanya ada SATU deklarasi fungsi komponen
export default function LoginPage() {
    const [isActive, setIsActive] = useState(false);
    const [errorLogin, setErrorLogin] = useState("");
    const [errorRegister, setErrorRegister] = useState({});
    const { login } = useAuth();

    // Efek untuk menangani toggle password
    useEffect(() => {
        const container = document.querySelector(".login-body-wrapper");
        if (!container) return;

        const handleIconClick = (event) => {
            const icon = event.target.closest(".toggle-password");
            if (!icon) return;

            const passwordInput = icon.parentElement.querySelector("input");
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("bx-hide");
                icon.classList.add("bx-show");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("bx-show");
                icon.classList.add("bx-hide");
            }
        };

        container.addEventListener("click", handleIconClick);

        return () => {
            container.removeEventListener("click", handleIconClick);
        };
    }, []);

    // Fungsi untuk handle submit form registrasi
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setErrorRegister({});
        const form = event.target;
        const username = form.registerUsername.value;
        const email = form.registerEmail.value;
        const password = form.registerPassword.value;
        const confirmPassword = form.registerConfirmPassword.value;

        if (password !== confirmPassword) {
            setErrorRegister({
                confirmPassword: "Password dan konfirmasi tidak cocok!",
            });
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw result;

            toast.success("Registrasi berhasil! Silakan login.");
            setIsActive(false);
            form.reset();
        } catch (error) {
            if (error.errors) {
                const newErrors = {};
                error.errors.forEach((err) => {
                    newErrors[err.path] = err.msg;
                });
                setErrorRegister(newErrors);
            } else {
                toast.error(
                    `Registrasi Gagal: ${
                        error.message || "Error tidak diketahui"
                    }`
                );
            }
        }
    };

    // Fungsi untuk handle submit form login
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setErrorLogin("");
        const form = event.target;
        const usernameOrEmail = form.loginEmail.value;
        const password = form.loginPassword.value;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: usernameOrEmail,
                        password,
                    }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw result;

            // Panggil fungsi 'login' dari context
            login(result.token, result.role);
        } catch (error) {
            setErrorLogin(error.message || "Kredensial tidak valid.");
            toast.error(error.message || "Kredensial tidak valid.");
        }
    };

    return (
        <div className="login-body-wrapper">
            <div className={`container ${isActive ? "active" : ""}`}>
                <div className="form-box login">
                    <form id="loginForm" onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                name="loginEmail"
                                type="text"
                                placeholder="Username or Email"
                                required
                            />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="input-box">
                            <input
                                name="loginPassword"
                                type="password"
                                placeholder="Password"
                                required
                            />
                            <i className="bx bx-hide toggle-password"></i>
                        </div>
                        <div className="error-message">
                            {errorLogin || "\u00A0"}
                        </div>
                        <div className="forgot-link">
                            <a href="/forgot-password">Forgot password?</a>
                        </div>
                        <button type="submit" className="btn">
                            Login
                        </button>
                        <p>Login With Other Method</p>
                        <div className="social-icons">
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
                            >
                                <i className="bx bxl-github"></i>
                            </a>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form id="registerForm" onSubmit={handleRegisterSubmit}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                name="registerUsername"
                                placeholder="Username"
                                required
                            />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="error-message">
                            {errorRegister.username || "\u00A0"}
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="registerEmail"
                                placeholder="Email"
                                required
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <div className="error-message">
                            {errorRegister.email || "\u00A0"}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="registerPassword"
                                placeholder="Password"
                                required
                            />
                            <i className="bx bx-hide toggle-password"></i>
                        </div>
                        <div className="error-message">
                            {errorRegister.password || "\u00A0"}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="registerConfirmPassword"
                                placeholder="Confirm Password"
                                required
                            />
                            <i className="bx bx-hide toggle-password"></i>
                        </div>
                        <div className="error-message">
                            {errorRegister.confirmPassword || "\u00A0"}
                        </div>
                        <button type="submit" className="btn">
                            Register
                        </button>
                        <p>Register With Other Method</p>
                        <div className="social-icons">
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
                            >
                                <i className="bx bxl-github"></i>
                            </a>
                        </div>
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome!</h1>
                        <p>Don't have an account?</p>
                        <button
                            className="btn register-btn"
                            onClick={() => setIsActive(true)}
                        >
                            Register
                        </button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account?</p>
                        <button
                            className="btn login-btn"
                            onClick={() => setIsActive(false)}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
