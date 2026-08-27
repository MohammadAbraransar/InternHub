import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect back to forgot password
            navigate("/forgot-password");
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email, otp, newPassword });
            if (res.data.success) {
                setMessage("Password reset successfully! Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center, #1e1b4b, #020617)" }}>
            <div className="glass-panel" style={{ padding: "3rem", width: "100%", maxWidth: "400px" }}>
                <h2 className="text-gradient" style={{ marginBottom: "1rem", fontSize: "1.8rem", textAlign: "center" }}>Reset Password</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem", textAlign: "center" }}>Enter code sent to {email}</p>

                {error && <div style={{ color: "var(--error)", marginBottom: "1rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}
                {message && <div style={{ color: "var(--success)", marginBottom: "1rem", background: "rgba(16, 185, 129, 0.1)", padding: "0.5rem", borderRadius: "8px" }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>OTP Code</label>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>New Password</label>
                        <input
                            type="password"
                            className="glass-input"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button disabled={loading} className="glass-button" style={{ width: "100%", fontSize: "1rem" }}>
                        {loading ? "Verifying..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
