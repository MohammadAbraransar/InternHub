import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import "../styles/login.css"; // Removing old css

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password field
  const [role, setRole] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !role) {
      setError("Please fill in all fields");
      return;
    }

    // In a real app, this would be an API call
    // For now, using the context mock/implementation
    const success = await login(email, password, role); // Assuming context login function signature might need update or supports this
    if (success) {
      if (role === "student") navigate("/student");
      if (role === "faculty") navigate("/faculty");
      if (role === "hod") navigate("/hod");
      if (role === "coordinator") navigate("/coordinator");
    } else {
      setError("Invalid credentials or role");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "1rem"
    }}>
      <div className="glass-panel" style={{
        maxWidth: "400px",
        width: "100%",
        padding: "3rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        <div style={{ textAlign: "center" }}>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>InternHub</h1>
          <p style={{ color: "var(--text-muted)" }}>Next-Gen Internship Management</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid var(--error)",
            color: "#fca5a5",
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <input
              className="glass-input"
              type="email"
              placeholder="Email Official ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              className="glass-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <select
              className="glass-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="" style={{ color: "black" }}>Select Role</option>
              <option value="student" style={{ color: "black" }}>Student</option>
              <option value="faculty" style={{ color: "black" }}>Faculty</option>
              <option value="hod" style={{ color: "black" }}>HOD</option>
              <option value="coordinator" style={{ color: "black" }}>Placement Coordinator</option>
            </select>
          </div>

          <button className="glass-button" type="submit" style={{ marginTop: "1rem" }}>
            Login to Dashboard
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1rem" }}>
          Restricted to authorized personnel only.
        </p>
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <Link to="/forgot-password" style={{ color: "var(--secondary-color)", textDecoration: "none", fontSize: "0.9rem" }}>Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
