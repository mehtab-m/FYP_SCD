// src/pages/admin/SuperAdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyLogo from "../../assets/icons/logo.png";
import CreateStudent from "./CreateStudent/CreateStudent";
import CreateMember from "./CreateMember/CreateMember";
import CreateProfessor from "./CreateProfessor/CreateProfessor";
import ManageFYPCommittee from "./CreateFYPComittee/ManageFYPCommittee";
import ManageEvaluationCommittee from "./CreateEvaluationComittee/ManageEvaluationCommittee"
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const handleSignOut = () => {
    navigate("/"); // back to login/signup page
  };

  return (
    <div className="superadmin-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={MyLogo} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">ProjectSphere</span>
        </div>
        <div className="navbar-right">
          <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
            M
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Super Admin</h3>
        <ul>
          <li onClick={() => setActivePage("manageStudent")}>Manage Student</li>
          <li onClick={() => setActivePage("manageMember")}>Manage Supervisor</li>
          <li onClick={() => setActivePage("manageProfessor")}>Manage Professor</li>
          <li onClick={() => setActivePage("ManageFYPCommittee")}>FYP Committee</li>
          <li onClick={() => setActivePage("ManageEvaluationCommittee")}>Evaluation Committee</li>
          <li onClick={() => setActivePage("settings")}>System Settings</li>
          <li onClick={() => setActivePage("reports")}>View Reports</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activePage === "home" && (
          <>
            <h1>Welcome Super Admin</h1>
            <p>You have full control over the system.</p>
          </>
        )}
        {activePage === "manageStudent" && <CreateStudent />}
        {activePage === "manageMember" && <CreateMember />}
        {activePage === "manageProfessor" && <CreateProfessor />}
        {activePage === "ManageFYPCommittee" && <ManageFYPCommittee />}
        {activePage === "ManageEvaluationCommittee" && <ManageEvaluationCommittee />}
        {activePage === "settings" && <h2>System Settings Page</h2>}
        {activePage === "reports" && <h2>Reports Page</h2>}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
