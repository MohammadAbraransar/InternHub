import React from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_STATS } from "../api/MockData";

const HodDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "radial-gradient(circle at top right, #1e1b4b, #0f172a)", color: "var(--text-main)" }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: "260px", margin: "1rem", padding: "2rem", display: "flex", flexDirection: "column", borderRadius: "20px" }}>
        <h2 className="text-gradient" style={{ marginBottom: "3rem", fontSize: "1.8rem", textAlign: "center" }}>InternHub</h2>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <button className="nav-link active-tab">Overview</button>
          <button className="nav-link">Faculty</button>
          <button className="nav-link">Analytics</button>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
          <p style={{ fontWeight: "600", fontSize: "1rem" }}>{user?.name}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>{user?.role} - {user?.department || "CSE"}</p>
          <button
            className="glass-button"
            style={{ width: "100%", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px" }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "1rem 2rem", overflowY: "auto" }}>
        <header style={{ marginBottom: "3rem", paddingTop: "1rem" }}>
          <h1 style={{ fontSize: "2.5rem" }}><span className="text-gradient">Department Overview</span></h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Computer Science & Engineering</p>
        </header>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", padding: "10px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "50%" }}></div>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Active Internships</h3>
            <p style={{ fontSize: "3rem", fontWeight: "800", color: "var(--success)" }}>128</p>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>+24 this week</div>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Placement %</h3>
            <p style={{ fontSize: "3rem", fontWeight: "800", color: "var(--secondary-glow)" }}>85%</p>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Top performing dept</div>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Faculty Active</h3>
            <p style={{ fontSize: "3rem", fontWeight: "800", color: "#a78bfa" }}>42</p>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Evaluating reports</div>
          </div>
        </div>

        {/* Faculty Performance Table */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3>Faculty Mentors</h3>
            <button className="glass-button" style={{ padding: "8px 16px" }}>Manage</button>
          </div>

          <table className="glass-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Assigned Students</th>
                <th>Pending Reviews</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. P. Ravinder</td>
                <td>12</td>
                <td>4</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
              <tr>
                <td>Mrs. Anjali Gupta</td>
                <td>15</td>
                <td>1</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
              <tr>
                <td>Mr. Suresh Reddy</td>
                <td>8</td>
                <td>6</td>
                <td><span className="badge badge-warning">On Leave</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default HodDashboard;
