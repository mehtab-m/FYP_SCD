// src/pages/supervisor/SupervisorDashboard.jsx
import React from "react";
import "./SupervisorDashboard.css";

const SupervisorDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Supervisor Dashboard</h2>
      <div className="card">
        <h3>Review Documents</h3>
        <p>Approve or request revisions for student submissions.</p>
        <button className="btn">Approve</button>
        <button className="btn">Request Revision</button>
      </div>
      <div className="card">
        <h3>Feedback</h3>
        <p>Provide feedback to students.</p>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
