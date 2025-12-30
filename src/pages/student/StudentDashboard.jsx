// src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyLogo from "../../assets/icons/logo.png";
import GroupManagement from "./GroupManagement/GroupManagement";
import ProjectRegistration from "./ProjectRegistration/ProjectRegistration";
import Submissions from "./Submissions/Submissions";
import ViewMarks from "./ViewMarks/ViewMarks";
import Notifications from "./Notifications/Notifications";
import api from "../../api/axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || user.userId);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchGroupMembers();
      fetchProjectDetails();
    }
  }, [currentUserId]);

  const fetchGroupMembers = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get(`/student/groups/members?studentId=${currentUserId}`);
      setGroupMembers(res.data || []);
    } catch (error) {
      console.error("Error fetching group members:", error);
      setGroupMembers([]);
    }
  };

  const fetchProjectDetails = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get(`/student/projects/details?studentId=${currentUserId}`);
      if (res.data && res.data.exists) {
        setProjectDetails(res.data);
      } else {
        setProjectDetails(null);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setProjectDetails(null);
    }
  };

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
          <li onClick={() => setActivePage("notifications")}>Notifications</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activePage === "home" && (
          <>
            <h1>Welcome Student</h1>
            <p>Manage your group, projects, submissions, and marks here.</p>
            
            {groupMembers.length > 0 ? (
              <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h2>Your Group Members</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#e9ecef" }}>
                      <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Name</th>
                      <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Email</th>
                      <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Semester</th>
                      <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupMembers.map((member) => (
                      <tr key={member.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                        <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                          {member.name} {member.isLeader && "👑"}
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{member.email}</td>
                        <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{member.semester || "N/A"}</td>
                        <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                          {member.isLeader ? (
                            <span style={{ color: "#ffc107", fontWeight: "bold" }}>Leader</span>
                          ) : (
                            <span>Member</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
                <p style={{ margin: 0, color: "#856404" }}>
                  You are not part of any group yet. Go to <strong>Group Management</strong> to create or join a group.
                </p>
              </div>
            )}

            {projectDetails && (
              <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h2>Your Project Details</h2>
                <div style={{ marginTop: "15px" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>{projectDetails.title}</h3>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Status:</strong>{" "}
                    <span style={{ 
                      padding: "5px 15px", 
                      borderRadius: "5px",
                      backgroundColor: projectDetails.status === "approved" ? "#d4edda" : "#fff3cd",
                      color: projectDetails.status === "approved" ? "#155724" : "#856404",
                      fontWeight: "bold",
                      marginLeft: "10px"
                    }}>
                      {projectDetails.status.charAt(0).toUpperCase() + projectDetails.status.slice(1)}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Abstract:</strong>
                    <p style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>{projectDetails.abstractText}</p>
                  </div>

                  {projectDetails.supervisorPreferences && projectDetails.supervisorPreferences.length > 0 && (
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Supervisor Preferences:</strong>
                      <ol style={{ marginTop: "5px" }}>
                        {projectDetails.supervisorPreferences
                          .sort((a, b) => a.preferenceOrder - b.preferenceOrder)
                          .map((pref, idx) => (
                            <li key={idx}>
                              {pref.preferenceOrder === 1 ? "1st" : pref.preferenceOrder === 2 ? "2nd" : "3rd"}: {pref.supervisorName} ({pref.supervisorEmail})
                            </li>
                          ))}
                      </ol>
                    </div>
                  )}

                  {projectDetails.assignedSupervisor && (
                    <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#d4edda", borderRadius: "5px" }}>
                      <strong>Assigned Supervisor:</strong>
                      <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                        {projectDetails.assignedSupervisor.name} ({projectDetails.assignedSupervisor.email})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {activePage === "groupManagement" && <GroupManagement />}
        {activePage === "projectRegistration" && <ProjectRegistration />}
        {activePage === "submissions" && <Submissions />}
        {activePage === "viewMarks" && <ViewMarks />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
};

export default StudentDashboard;
