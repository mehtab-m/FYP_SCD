// src/pages/committee/EvaluationDashboard.jsx
import React from "react";
import "./EvaluationDashboard.css";

const EvaluationDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Evaluation Committee Dashboard</h2>
      <div className="card">
        <h3>Grade Documents</h3>
        <p>Use rubrics to grade student submissions.</p>
        <button className="btn">Open Rubric</button>
      </div>
      <div className="card">
        <h3>Request Revisions</h3>
        <p>Send revision requests to students if needed.</p>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
