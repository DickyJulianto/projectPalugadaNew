"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "../login/login.css";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const resetToken = searchParams.get("token");
        if (resetToken) {
            setToken(resetToken);
        } else {
            toast.error(
                "Token tidak ditemukan. Silakan gunakan link dari email Anda."
            );
        }
    }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Password tidak cocok!");
        }
        if (!token) {
            return toast.error("Token tidak valid.");
        }
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, password }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw result;

            toast.success(result.message);
            router.push("/login");
        } catch (error) {
            toast.error(error.message || "Gagal mereset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body-wrapper">
            <div
                className="container"
                style={{ height: "auto", minHeight: "450px", width: "500px" }}
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
                        <h1>Create New Password</h1>
                        <p
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                marginBottom: "20px",
                                color: "#555",
                            }}
                        >
                            Masukkan password baru Anda.
                        </p>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            disabled={!token || loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}