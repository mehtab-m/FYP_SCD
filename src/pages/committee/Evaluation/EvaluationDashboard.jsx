// src/pages/committee/Evaluation/EvaluationDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EvaluationDashboard.css";
import api from "../../../api/axios";

const EvaluationDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("groups");
  const [groups, setGroups] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingMarks, setEditingMarks] = useState({});
  const [markInputs, setMarkInputs] = useState({});
  const [currentCommitteeId, setCurrentCommitteeId] = useState(2); // Evaluation Committee ID = 2

  useEffect(() => {
    if (activePage === "groups") {
      fetchGroups();
    } else if (activePage === "documents" && selectedGroupId) {
      fetchDocuments();
    }
  }, [activePage, selectedGroupId]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/evaluation/groups");
      setGroups(res.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!selectedGroupId) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/evaluation/documents?committeeId=${currentCommitteeId}&groupId=${selectedGroupId}`);
      setDocuments(res.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    setActivePage("documents");
  };

  const handleAssignMarks = async (submissionId, marks) => {
    if (marks < 0) {
      alert("Marks must be 0 or greater");
      return;
    }

    try {
      await api.post("/evaluation/assign-marks", {
        committeeId: currentCommitteeId,
        submissionId: submissionId,
        marks: marks
      });
      alert("Marks assigned successfully!");
      setEditingMarks({ ...editingMarks, [submissionId]: false });
      fetchDocuments();
    } catch (error) {
      console.error("Error assigning marks:", error);
      alert("Failed to assign marks. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { bg: "#d4edda", color: "#155724" };
      case "rejected":
        return { bg: "#f8d7da", color: "#721c24" };
      default:
        return { bg: "#fff3cd", color: "#856404" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // If filePath already starts with http, return as is
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    
    // Get backend base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api";
    const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "");
    
    // Remove leading slash from filePath if present
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    
    // Use the file serving endpoint with proper encoding
    // Encode the entire path as a query parameter to avoid URL encoding issues
    const encodedPath = encodeURIComponent(cleanPath);
    
    // Use the file controller endpoint
    return `${backendBaseUrl}/api/files?path=${encodedPath}`;
  };

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="evaluation-committee-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-title">ProjectSphere</span>
        </div>
        <div className="navbar-right">
          <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
            E
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
        <h3>Evaluation Committee</h3>
        <ul>
          <li 
            className={activePage === "groups" ? "active" : ""}
            onClick={() => {
              setActivePage("groups");
              setSelectedGroupId(null);
            }}
          >
            All Groups
          </li>
          {selectedGroupId && (
            <li 
              className={activePage === "documents" ? "active" : ""}
              onClick={() => setActivePage("documents")}
            >
              View Documents
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-wrapper">
          {activePage === "groups" && (
            <div className="view-groups-page">
              <h1>All Groups</h1>
              <p>Select a group to grade their documents.</p>

              {loading ? (
                <div className="loading-container">
                  <p>Loading groups...</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="empty-state">
                  <p>No approved projects found.</p>
                </div>
              ) : (
                <div className="groups-list">
                  {groups.map((group) => (
                    <div key={group.groupId} className="group-card">
                      <div className="group-header">
                        <h2>{group.projectTitle || "Untitled Project"}</h2>
                        <span className={`status-badge status-${group.projectStatus?.toLowerCase() || "pending"}`}>
                          {group.projectStatus || "Pending"}
                        </span>
                      </div>

                      <div className="group-section">
                        <h3>Group Members</h3>
                        {group.members && group.members.length > 0 ? (
                          <table className="members-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Semester</th>
                                <th>Role</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.members.map((member) => (
                                <tr key={member.id}>
                                  <td>
                                    {member.name} {member.isLeader && "👑"}
                                  </td>
                                  <td>{member.email}</td>
                                  <td>{member.semester || "N/A"}</td>
                                  <td>
                                    {member.isLeader ? (
                                      <span className="leader-badge">Leader</span>
                                    ) : (
                                      <span>Member</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No members found.</p>
                        )}
                      </div>

                      <div className="group-actions">
                        <button
                          className="btn btn-view-docs"
                          onClick={() => handleGroupSelect(group.groupId)}
                        >
                          Grade Documents
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePage === "documents" && selectedGroupId && (
            <div className="view-documents-page">
              <div className="page-header">
                <button 
                  className="btn btn-back"
                  onClick={() => {
                    setActivePage("groups");
                    setSelectedGroupId(null);
                  }}
                  style={{ marginBottom: "20px" }}
                >
                  ← Back to Groups
                </button>
                <h1>Grade Documents</h1>
                <p>Review and grade documents submitted by the group.</p>
              </div>

              {loading ? (
                <div className="loading-container">
                  <p>Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="empty-state">
                  <p>No documents submitted yet.</p>
                </div>
              ) : (
                <div className="documents-list">
                  {documents.map((doc) => {
                    const statusStyle = getStatusColor(doc.status);
                    return (
                      <div key={doc.submissionId} className="document-card">
                        <div className="document-header">
                          <h2>{doc.documentName}</h2>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                              padding: "5px 15px",
                              borderRadius: "5px",
                              fontWeight: "bold",
                              fontSize: "14px"
                            }}
                          >
                            {doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1) || "Pending"}
                          </span>
                        </div>

                        <div className="document-info">
                          <div className="info-row">
                            <strong>Version:</strong> {doc.version}
                          </div>
                          <div className="info-row">
                            <strong>Submitted At:</strong> {formatDate(doc.submittedAt)}
                          </div>
                          {doc.isLate && (
                            <div className="info-row">
                              <strong className="late-indicator">⚠️ Submitted Late</strong>
                            </div>
                          )}
                          {doc.filePath && (
                            <div className="info-row">
                              <strong>File:</strong>{" "}
                              <a href={getFileUrl(doc.filePath)} target="_blank" rel="noopener noreferrer" className="file-link">
                                View File
                              </a>
                            </div>
                          )}
                          {doc.marksAwarded !== undefined && (
                            <div className="info-row">
                              <strong>Marks Awarded:</strong> {doc.marksAwarded} / {doc.maxMarks || 100}
                            </div>
                          )}
                        </div>

                        <div className="document-actions">
                          {!editingMarks[doc.submissionId] ? (
                            <button
                              className="btn btn-assign-marks"
                              onClick={() => {
                                setEditingMarks({ ...editingMarks, [doc.submissionId]: true });
                                setMarkInputs({ ...markInputs, [doc.submissionId]: doc.marksAwarded || "" });
                              }}
                            >
                              {doc.marksAwarded !== undefined ? "Edit Marks" : "Assign Marks"}
                            </button>
                          ) : (
                            <div className="marks-input-container">
                              <input
                                type="number"
                                min="0"
                                max={doc.maxMarks || 100}
                                value={markInputs[doc.submissionId] || ""}
                                onChange={(e) =>
                                  setMarkInputs({ ...markInputs, [doc.submissionId]: e.target.value })
                                }
                                placeholder={`Max: ${doc.maxMarks || 100}`}
                                className="marks-input"
                              />
                              <button
                                className="btn btn-save"
                                onClick={() => handleAssignMarks(doc.submissionId, parseInt(markInputs[doc.submissionId]))}
                              >
                                Save Marks
                              </button>
                              <button
                                className="btn btn-cancel"
                                onClick={() => {
                                  setEditingMarks({ ...editingMarks, [doc.submissionId]: false });
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EvaluationDashboard;