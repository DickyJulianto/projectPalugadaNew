"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import "../login/login.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw result;
            toast.success(result.message);
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body-wrapper">
            <div
                className="container"
                style={{ height: "auto", minHeight: "400px", width: "500px" }}
            >
                <div
                    className="form-box"
                    style={{
                        position: "static",
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <h1>Forgot Password</h1>
                        <p
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                marginBottom: "20px",
                                color: "#555",
                            }}
                        >
                            Masukkan email Anda. Kami akan mengirimkan link
                            untuk mereset password Anda.
                        </p>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        <div style={{ marginTop: "20px" }}>
                            <Link
                                href="/login"
                                style={{ color: "var(--blue)" }}
                            >
                                Kembali ke Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
