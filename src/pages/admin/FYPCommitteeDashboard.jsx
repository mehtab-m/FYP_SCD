// src/pages/admin/FYPCommitteeDashboard.jsx
import React from "react";
import "./FYPCommitteeDashboard.css";

const FYPCommitteeDashboard = () => {
  return (
    <div className="dashboard">
      <h2>FYP Committee Dashboard</h2>
      <div className="card">
        <h3>Set Deadlines</h3>
        <button className="btn">Add Deadline</button>
      </div>
      <div className="card">
        <h3>Monitor Progress</h3>
        <p>Track student and supervisor activity.</p>
      </div>
      <div className="card">
        <h3>Release Results</h3>
        <button className="btn">Publish Final Marks</button>
      </div>
    </div>
  );
};

export default FYPCommitteeDashboard;
