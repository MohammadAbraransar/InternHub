import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatsOverview from "../components/coordinator/StatsOverview";
import ManageDrives from "../components/coordinator/ManageDrives";
import BroadcastMessage from "../components/coordinator/BroadcastMessage";

const CoordinatorDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{
                width: "250px",
                margin: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px"
            }}>
                <h2 className="text-gradient" style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>InternHub</h2>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <button
                        className={`btn-secondary ${activeTab === 'overview' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab("overview")}
                        style={{
                            textAlign: "left",
                            padding: "10px",
                            borderRadius: "8px",
                            background: activeTab === 'overview' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: "none",
                            color: "var(--text-main)",
                            cursor: "pointer"
                        }}
                    >
                        Overview
                    </button>
                    <button
                        className={`btn-secondary ${activeTab === 'drives' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab("drives")}
                        style={{
                            textAlign: "left",
                            padding: "10px",
                            borderRadius: "8px",
                            background: activeTab === 'drives' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: "none",
                            color: "var(--text-main)",
                            cursor: "pointer"
                        }}
                    >
                        Manage Drives
                    </button>
                    <button
                        className={`btn-secondary ${activeTab === 'broadcast' ? 'active-tab' : ''}`}
                        onClick={() => setActiveTab("broadcast")}
                        style={{
                            textAlign: "left",
                            padding: "10px",
                            borderRadius: "8px",
                            background: activeTab === 'broadcast' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: "none",
                            color: "var(--text-main)",
                            cursor: "pointer"
                        }}
                    >
                        Broadcast
                    </button>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                        {user?.name} <br />
                        <span style={{ fontSize: "0.8rem" }}>Coordinator</span>
                    </div>
                    <button
                        className="glass-button"
                        onClick={handleLogout}
                        style={{ width: "100%", background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.5)" }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: "1rem" }}>
                <header className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    <div style={{ color: "var(--text-muted)" }}>{new Date().toDateString()}</div>
                </header>

                {activeTab === "overview" && <StatsOverview />}
                {activeTab === "drives" && <ManageDrives />}
                {activeTab === "broadcast" && <BroadcastMessage />}
            </main>
        </div>
    );
};

export default CoordinatorDashboard;
