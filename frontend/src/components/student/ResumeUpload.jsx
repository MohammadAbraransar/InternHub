import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("internhub_token");
      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setFile(null);
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage(err.response?.data?.message || "Error uploading resume");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <h3>Upload Resume (PDF only)</h3>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px", padding: "8px 15px", background: "#203a43", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>
        Upload
      </button>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ResumeUpload;
