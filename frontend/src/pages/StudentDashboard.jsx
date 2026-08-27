import React from "react";
import ResumeUpload from "../components/student/ResumeUpload";
import { useAuth } from "../context/AuthContext";
import { MOCK_DRIVES } from "../api/MockData"; // Import mock drives

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  // Using Mock Drives 
  const activeDrives = MOCK_DRIVES.filter(d => d.status === "Open");

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="text-gradient">Student Dashboard</h1>
          <p style={{ color: "var(--text-muted)" }}>Welcome back, {user?.name || "Student"}</p>
        </div>
        <button
          className="glass-button"
          onClick={logout}
          style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", boxShadow: "none" }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>

        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--secondary-glow)" }}>My Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Name</span>
              <span style={{ fontWeight: "600" }}>{user?.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Email</span>
              <span>{user?.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Enrollment</span>
              <span>{user?.enrollmentId || "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Department</span>
              <span>{user?.department || "CSE"}</span>
            </div>
          </div>
        </div>

        {/* Resume Upload Module */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--secondary-glow)" }}>Resume Center</h3>
          <ResumeUpload />
        </div>

        {/* Active Drives Card - Full Width on Mobile, Span 2 on large */}
        <div className="glass-panel" style={{ padding: "2rem", gridColumn: "1 / -1" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--secondary-glow)" }}>Active Drives (Live)</h3>

          <div style={{ overflowX: "auto" }}>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeDrives.map(drive => (
                  <tr key={drive.id}>
                    <td style={{ fontWeight: "600" }}>{drive.company}</td>
                    <td>{drive.role}</td>
                    <td>{drive.location}</td>
                    <td><span className="badge badge-warning">{drive.deadline}</span></td>
                    <td>
                      <button className="glass-button" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                        Apply Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
