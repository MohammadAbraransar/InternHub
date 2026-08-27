import React, { useState } from "react";

const EligibilityPanel = () => {
  const [criteria, setCriteria] = useState({
    cgpa: "",
    skills: "",
    branch: ""
  });

  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    setCriteria({
      ...criteria,
      [e.target.name]: e.target.value
    });
  };

  const generateList = () => {
    // Dummy data (backend + AI later)
    const dummyStudents = [
      { name: "Rahul Kumar", cgpa: 8.5, branch: "CSE", skills: "React, Node" },
      { name: "Ananya Sharma", cgpa: 9.1, branch: "CSE", skills: "Python, ML" },
      { name: "Vikram Singh", cgpa: 8.0, branch: "AIML", skills: "AI, DL" }
    ];

    setStudents(dummyStudents);
  };

  return (
    <div className="card">
      <h3>Eligibility Engine</h3>
      <p>Filter students based on company criteria</p>

      <input
        type="number"
        placeholder="Minimum CGPA"
        name="cgpa"
        value={criteria.cgpa}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Required Skills (comma separated)"
        name="skills"
        value={criteria.skills}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Branch (CSE / AIML / IT)"
        name="branch"
        value={criteria.branch}
        onChange={handleChange}
        style={inputStyle}
      />

      <button onClick={generateList} style={btnStyle}>
        Generate Eligible Students
      </button>

      {students.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Eligible Students</h4>
          <ul>
            {students.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> — {s.branch} | CGPA: {s.cgpa}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btnStyle = {
  padding: "10px",
  width: "100%",
  background: "#6a11cb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default EligibilityPanel;
