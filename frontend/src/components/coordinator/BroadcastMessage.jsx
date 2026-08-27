import React from 'react';

const BroadcastMessage = () => {
    return (
        <div className="glass-panel" style={{ padding: "3rem", maxWidth: "700px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "2rem", fontSize: "1.5rem", textAlign: "center" }}>Send Broadcast Message</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.8rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>Subject</label>
                    <input type="text" className="glass-input" placeholder="e.g., Upcoming Infosys Drive Details" />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.8rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>Target Audience</label>
                    <select className="glass-input" style={{ cursor: "pointer" }}>
                        <option style={{ color: "black" }}>All Students</option>
                        <option style={{ color: "black" }}>CSE Department</option>
                        <option style={{ color: "black" }}>ECE Department</option>
                        <option style={{ color: "black" }}>Unplaced Students</option>
                    </select>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <label style={{ display: "block", marginBottom: "0.8rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>Message Content</label>
                    <textarea className="glass-input" rows="6" placeholder="Type your message here..." style={{ resize: "vertical" }}></textarea>
                </div>

                <button type="submit" className="glass-button" style={{ width: "100%", fontSize: "1.1rem" }}>
                    Send Broadcast
                </button>
            </form>
        </div>
    );
};

export default BroadcastMessage;
