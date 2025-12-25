// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import EvaluationDashboard from "./pages/committee/EvaluationDashboard";
import FYPCommitteeDashboard from "./pages/admin/FYPCommitteeDashboard";

function App() {
  const [user, setUser] = useState(null);

  const getDashboard = () => {
    switch (user?.role) {
      case "Student":
        return <StudentDashboard />;
      case "Supervisor":
        return <SupervisorDashboard />;
      case "Evaluation Committee":
        return <EvaluationDashboard />;
      case "FYP Committee":
        return <FYPCommitteeDashboard />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={getDashboard()} />
      </Routes>
    </Router>
  );
}

export default App;
