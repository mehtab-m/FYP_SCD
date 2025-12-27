// src/pages/student/StudentDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyLogo from "../../assets/icons/logo.png";
import GroupManagement from "./GroupManagement/GroupManagement";
import ProjectRegistration from "./ProjectRegistration/ProjectRegistration";
import Submissions from "./Submissions/Submissions";
import ViewMarks from "./ViewMarks/ViewMarks";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="student-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={MyLogo} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">ProjectSphere</span>
        </div>
        <div className="navbar-right">
          <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
            S
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
        <h3>Student</h3>
        <ul>
          <li onClick={() => setActivePage("groupManagement")}>Group Management</li>
          <li onClick={() => setActivePage("projectRegistration")}>Project Registration</li>
          <li onClick={() => setActivePage("submissions")}>Submissions</li>
          <li onClick={() => setActivePage("viewMarks")}>View Marks</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activePage === "home" && (
          <>
            <h1>Welcome Student</h1>
            <p>Manage your group, projects, submissions, and marks here.</p>
          </>
        )}
        {activePage === "groupManagement" && <GroupManagement />}
        {activePage === "projectRegistration" && <ProjectRegistration />}
        {activePage === "submissions" && <Submissions />}
        {activePage === "viewMarks" && <ViewMarks />}
      </main>
    </div>
  );
};

export default StudentDashboard;
