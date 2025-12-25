// src/pages/student/StudentDashboard.jsx
import React from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="card">
        <h3>Upload Documents</h3>
        <button className="btn">Upload Proposal</button>
        <button className="btn">Upload Design Document</button>
        <button className="btn">Upload Test Document</button>
        <button className="btn">Upload Thesis</button>
      </div>
      <div className="card">
        <h3>Feedback</h3>
        <p>View supervisor and committee feedback here.</p>
      </div>
      <div className="card">
        <h3>Deadlines</h3>
        <p>Upcoming submission deadlines will appear here.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
