// src/pages/committee/FYP/FYPCommitteeDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import MyLogo from "../../../assets/icons/logo.png ";
import "./FYPCommitteeDashboard.css";
import ProjectRegistrations from "./ProjectRegistrations/ProjectRegistrations";
import SetDeadline from "./SetDeadline/SetDeadline";
import MonitorProgress from "./MonitorProgress/MonitorProgress";
import ReleaseResults from "./ReleaseResults/ReleaseResults";

const FYPCommitteeDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("projectRegistrations");

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="fyp-committee-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* <img src={MyLogo} alt="Logo" className="navbar-logo" /> */}
          <span className="navbar-title">ProjectSphere</span>
        </div>
        <div className="navbar-right">
          <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
            C
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
        <h3>FYP Committee</h3>
        <ul>
          <li 
            className={activePage === "projectRegistrations" ? "active" : ""}
            onClick={() => setActivePage("projectRegistrations")}
          >
            Project Registrations
          </li>
          <li 
            className={activePage === "deadlines" ? "active" : ""}
            onClick={() => setActivePage("deadlines")}
          >
            Set Deadlines
          </li>
          <li 
            className={activePage === "monitorProgress" ? "active" : ""}
            onClick={() => setActivePage("monitorProgress")}
          >
            Monitor Progress
          </li>
          <li 
            className={activePage === "releaseResults" ? "active" : ""}
            onClick={() => setActivePage("releaseResults")}
          >
            Release Results
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-wrapper">
          {activePage === "projectRegistrations" && <ProjectRegistrations />}
          {activePage === "deadlines" && <SetDeadline />}
          {activePage === "monitorProgress" && <MonitorProgress />}
          {activePage === "releaseResults" && <ReleaseResults />}
        </div>
      </main>
    </div>
  );
};

export default FYPCommitteeDashboard;
