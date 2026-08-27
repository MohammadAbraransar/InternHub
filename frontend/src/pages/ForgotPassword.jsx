import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            if (res.data.success) {
                // Pass email to next page state
                navigate("/reset-password", { state: { email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center, #1e1b4b, #020617)" }}>
            <div className="glass-panel" style={{ padding: "3rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
                <h2 className="text-gradient" style={{ marginBottom: "1rem", fontSize: "2rem" }}>Recover Account</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Enter your email to receive an OTP.</p>

                {error && <div style={{ color: "var(--error)", marginBottom: "1rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <input
                            type="email"
                            className="glass-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button disabled={loading} className="glass-button" style={{ width: "100%", fontSize: "1rem" }}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
                <div style={{ marginTop: "1.5rem" }}>
                    <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.9rem", textDecoration: "none" }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
