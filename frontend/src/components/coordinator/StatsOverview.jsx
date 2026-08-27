import React from 'react';
import { MOCK_STATS } from "../../api/MockData";

const StatsOverview = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            <div className="glass-panel" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "rgba(109, 40, 217, 0.3)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                <h3 style={{ color: "var(--text-muted)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Students</h3>
                <p style={{ fontSize: "3.5rem", fontWeight: "800", margin: "0.5rem 0", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{MOCK_STATS.totalStudents}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--success)", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>+12%</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>from last year</span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "rgba(6, 182, 212, 0.3)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                <h3 style={{ color: "var(--text-muted)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>Active Drives</h3>
                <p style={{ fontSize: "3.5rem", fontWeight: "800", margin: "0.5rem 0", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{MOCK_STATS.activeDrives}</p>
                <span style={{ color: "var(--warning)", fontSize: "0.9rem", display: "block" }}>● 3 closing within 24h</span>
            </div>

            <div className="glass-panel" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "rgba(16, 185, 129, 0.3)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                <h3 style={{ color: "var(--text-muted)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>Placed Students</h3>
                <p style={{ fontSize: "3.5rem", fontWeight: "800", margin: "0.5rem 0", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{MOCK_STATS.placed}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--success)", fontSize: "0.9rem" }}>Avg Package: </span>
                    <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{MOCK_STATS.avgPackage}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
