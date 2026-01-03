// src/pages/supervisor/SupervisorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SupervisorDashboard.css";
import ViewGroups from "./ViewGroups/ViewGroups";
import ViewDocuments from "./ViewDocuments/ViewDocuments";
import ChangePassword from "./ChangePassword/ChangePassword";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("viewGroups");
  const [supervisorId, setSupervisorId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setSupervisorId(user.id || user.userId);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleSignOut = () => {
    navigate("/");
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    setActivePage("viewDocuments");
  };

  return (
    <div className="supervisor-dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
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
        <h3>Supervisor</h3>
        <ul>
          <li 
            className={activePage === "viewGroups" ? "active" : ""}
            onClick={() => {
              setActivePage("viewGroups");
              setSelectedGroupId(null);
            }}
          >
            View Groups
          </li>
          <li 
            className={activePage === "viewDocuments" ? "active" : ""}
            onClick={() => {
              if (selectedGroupId) {
                setActivePage("viewDocuments");
              } else {
                alert("Please select a group first from View Groups");
              }
            }}
          >
            View Documents
          </li>
          <li 
            className={activePage === "changePassword" ? "active" : ""}
            onClick={() => setActivePage("changePassword")}
          >
            Change Password
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-wrapper">
          {activePage === "viewGroups" && (
            <ViewGroups 
              supervisorId={supervisorId} 
              onGroupSelect={handleGroupSelect}
            />
          )}
          {activePage === "viewDocuments" && (
            <ViewDocuments 
              supervisorId={supervisorId} 
              groupId={selectedGroupId}
            />
          )}
          {activePage === "changePassword" && (
            <ChangePassword supervisorId={supervisorId} />
          )}
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
