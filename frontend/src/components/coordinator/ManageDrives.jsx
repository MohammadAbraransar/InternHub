import React from 'react';
import { MOCK_DRIVES } from "../../api/MockData";

const ManageDrives = () => {
    return (
        <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.5rem" }}>Recruitment Drives</h3>
                <button className="glass-button" style={{ padding: "10px 24px" }}>+ New Drive</button>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Date</th>
                            <th>Deadline</th>
                            <th>Eligibility</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_DRIVES.map(drive => (
                            <tr key={drive.id}>
                                <td style={{ fontWeight: "700", color: "var(--text-main)" }}>{drive.company}</td>
                                <td>{drive.role}</td>
                                <td>{drive.date}</td>
                                <td>{drive.deadline}</td>
                                <td><span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{drive.eligibility.minCGPA}+ CGPA</span></td>
                                <td>
                                    <span className={`badge ${drive.status === "Open" ? "badge-success" : "badge-error"}`}>
                                        {drive.status}
                                    </span>
                                </td>
                                <td>
                                    <button style={{ background: "transparent", border: "none", color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600" }}>Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDrives;
