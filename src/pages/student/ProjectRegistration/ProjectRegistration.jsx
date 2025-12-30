import React, { useState, useEffect } from "react";
import "./ProjectRegistration.css";
import api from "../../../api/axios";

const ProjectRegistration = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    abstractText: "",
    supervisor1: "",
    supervisor2: "",
    supervisor3: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current user ID
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
      fetchSupervisors();
      fetchGroupMembers();
      fetchProjectDetails();
    }
  }, [currentUserId]);

  const fetchSupervisors = async () => {
    try {
      const res = await api.get("/student/projects/supervisors");
      setSupervisors(res.data || []);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
      alert("User not logged in. Please refresh the page.");
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      alert("Please enter project title");
      return;
    }
    if (!formData.abstractText.trim()) {
      alert("Please enter project abstract");
      return;
    }
    if (!formData.supervisor1 || !formData.supervisor2 || !formData.supervisor3) {
      alert("Please select all 3 supervisors with preferences");
      return;
    }
    if (formData.supervisor1 === formData.supervisor2 || 
        formData.supervisor1 === formData.supervisor3 || 
        formData.supervisor2 === formData.supervisor3) {
      alert("Please select 3 different supervisors");
      return;
    }

    setLoading(true);
    try {
      const supervisorPreferences = [
        parseInt(formData.supervisor1),
        parseInt(formData.supervisor2),
        parseInt(formData.supervisor3)
      ];

      await api.post(`/student/projects/register?studentId=${currentUserId}`, {
        title: formData.title,
        abstractText: formData.abstractText,
        supervisorPreferences: supervisorPreferences
      });

      alert("Project registration submitted successfully! Waiting for FYP committee approval.");
      setFormData({
        title: "",
        abstractText: "",
        supervisor1: "",
        supervisor2: "",
        supervisor3: ""
      });
      fetchProjectDetails(); // Refresh project details
    } catch (error) {
      console.error("Error registering project:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to register project. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // If project already exists, show details
  if (projectDetails) {
    return (
      <div className="project-registration">
        <h2>Project Registration</h2>
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", marginTop: "20px" }}>
          <h3 style={{ color: "#155724", margin: "0 0 15px 0" }}>✓ Project Already Registered</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <h4>Project Title:</h4>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{projectDetails.title}</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Abstract:</h4>
            <p style={{ whiteSpace: "pre-wrap" }}>{projectDetails.abstractText}</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Status:</h4>
            <span style={{ 
              padding: "5px 15px", 
              borderRadius: "5px",
              backgroundColor: projectDetails.status === "approved" ? "#d4edda" : "#fff3cd",
              color: projectDetails.status === "approved" ? "#155724" : "#856404",
              fontWeight: "bold"
            }}>
              {projectDetails.status.charAt(0).toUpperCase() + projectDetails.status.slice(1)}
            </span>
          </div>

          {projectDetails.supervisorPreferences && projectDetails.supervisorPreferences.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4>Supervisor Preferences:</h4>
              <ol>
                {projectDetails.supervisorPreferences
                  .sort((a, b) => a.preferenceOrder - b.preferenceOrder)
                  .map((pref, idx) => (
                    <li key={idx} style={{ marginBottom: "10px" }}>
                      <strong>{pref.preferenceOrder === 1 ? "1st" : pref.preferenceOrder === 2 ? "2nd" : "3rd"} Preference:</strong> {pref.supervisorName} ({pref.supervisorEmail})
                    </li>
                  ))}
              </ol>
            </div>
          )}

          {projectDetails.assignedSupervisor && (
            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#d4edda", borderRadius: "5px" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Assigned Supervisor:</h4>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {projectDetails.assignedSupervisor.name} ({projectDetails.assignedSupervisor.email})
              </p>
            </div>
          )}

          {projectDetails.groupMembers && projectDetails.groupMembers.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>Group Members:</h4>
              <ul>
                {projectDetails.groupMembers.map((member, idx) => (
                  <li key={idx}>
                    {member.name} {member.isLeader && "👑 (Leader)"} - {member.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If group doesn't have 4 members, show message
  if (groupMembers.length > 0 && groupMembers.length !== 4) {
    return (
      <div className="project-registration">
        <h2>Project Registration</h2>
        <div style={{ padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", marginTop: "20px" }}>
          <p style={{ margin: 0, color: "#856404" }}>
            Your group must have exactly 4 members to register a project. Current members: {groupMembers.length}
          </p>
          <p style={{ margin: "10px 0 0 0", color: "#856404" }}>
            Please go to <strong>Group Management</strong> to finalize your group with 4 members.
          </p>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="project-registration">
      <h2>Project Registration</h2>
      
      {groupMembers.length === 0 ? (
        <div style={{ padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", marginTop: "20px" }}>
          <p style={{ margin: 0, color: "#856404" }}>
            You are not part of any group yet. Please finalize your group first in <strong>Group Management</strong>.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#e7f3ff", borderRadius: "5px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Your Group Members:</h4>
            <ul style={{ margin: 0 }}>
              {groupMembers.map((member, idx) => (
                <li key={idx}>
                  {member.name} {member.isLeader && "👑 (Leader)"}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Project Title: *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                placeholder="Enter project title"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="abstractText" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Project Abstract: *
              </label>
              <textarea
                id="abstractText"
                value={formData.abstractText}
                onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                required
                rows={8}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontFamily: "inherit" }}
                placeholder="Enter project abstract"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "15px" }}>Supervisor Preferences: *</h4>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                Please select 3 supervisors in order of preference (1st, 2nd, 3rd)
              </p>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="supervisor1" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  1st Preference: *
                </label>
                <select
                  id="supervisor1"
                  value={formData.supervisor1}
                  onChange={(e) => setFormData({ ...formData, supervisor1: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                >
                  <option value="">Select 1st preference supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.userId} value={supervisor.userId}>
                      {supervisor.name} ({supervisor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="supervisor2" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  2nd Preference: *
                </label>
                <select
                  id="supervisor2"
                  value={formData.supervisor2}
                  onChange={(e) => setFormData({ ...formData, supervisor2: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                >
                  <option value="">Select 2nd preference supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.userId} value={supervisor.userId}>
                      {supervisor.name} ({supervisor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="supervisor3" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  3rd Preference: *
                </label>
                <select
                  id="supervisor3"
                  value={formData.supervisor3}
                  onChange={(e) => setFormData({ ...formData, supervisor3: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                >
                  <option value="">Select 3rd preference supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.userId} value={supervisor.userId}>
                      {supervisor.name} ({supervisor.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 30px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProjectRegistration;
