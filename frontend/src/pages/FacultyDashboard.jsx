import React from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_APPROVALS } from "../api/MockData";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "radial-gradient(circle at top right, #1e1b4b, #0f172a)", color: "var(--text-main)" }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: "260px", margin: "1rem", padding: "2rem", display: "flex", flexDirection: "column", borderRadius: "20px" }}>
        <h2 className="text-gradient" style={{ marginBottom: "3rem", fontSize: "1.8rem", textAlign: "center" }}>InternHub</h2>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <button className="nav-link active-tab">Approvals</button>
          <button className="nav-link">Students</button>
          <button className="nav-link">Reports</button>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
          <p style={{ fontWeight: "600", fontSize: "1rem" }}>{user?.name}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>{user?.role}</p>
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
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingTop: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem" }}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)" }}>Manage internships and student approvals</p>
          </div>
          <div className="glass-panel" style={{ padding: "0.5rem 1rem", borderRadius: "10px" }}>
            <span style={{ color: "var(--success)" }}>● System Active</span>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Pending Request</h3>
            <p style={{ fontSize: "2.2rem", fontWeight: "700" }}>3</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Students</h3>
            <p style={{ fontSize: "2.2rem", fontWeight: "700" }}>64</p>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Reports due</h3>
            <p style={{ fontSize: "2.2rem", fontWeight: "700" }}>12</p>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>Pending Approvals</h3>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_APPROVALS.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: "600" }}>{req.student}</td>
                  <td>{req.company}</td>
                  <td>{req.role}</td>
                  <td>
                    <span className={`badge ${req.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="glass-button" style={{ padding: "6px 12px", background: "var(--success)", fontSize: "0.8rem" }}>Approve</button>
                        <button className="glass-button" style={{ padding: "6px 12px", background: "var(--error)", fontSize: "0.8rem" }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
