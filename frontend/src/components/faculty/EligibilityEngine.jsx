import React, { useState } from "react";
import axios from "axios";

const EligibilityEngine = () => {
  const [cgpa, setCgpa] = useState("");
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState("");
  const [students, setStudents] = useState([]);

  const handleFilter = async () => {
    try {
      const token = localStorage.getItem("internhub_token"); // JWT from login
      const res = await axios.post(
        "http://localhost:5000/api/eligibility",
        {
          cgpaMin: cgpa ? parseFloat(cgpa) : undefined,
          branch: branch || undefined,
          skills: skills ? skills.split(",").map(s => s.trim()) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching students");
    }
  };

  return (
    <div style={{ background: "#f0f4f8", padding: "20px", borderRadius: "8px" }}>
      <h2>Eligibility Engine</h2>

      {/* Filter Form */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="number"
          step="0.01"
          placeholder="Min CGPA"
          value={cgpa}
          onChange={e => setCgpa(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        />
        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={e => setBranch(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={e => setSkills(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", flex: "1" }}
        />
        <button
          onClick={handleFilter}
          style={{
            padding: "8px 15px",
            background: "#203a43",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </div>

      {/* Students Table */}
      {students.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#203a43", color: "#fff" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Branch</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>CGPA</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Skills</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.email}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.branch}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.cgpa}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.skills ? student.skills.join(", ") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EligibilityEngine;
