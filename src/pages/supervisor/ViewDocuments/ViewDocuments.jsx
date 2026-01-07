import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import "./ViewDocuments.css";

const ViewDocuments = ({ supervisorId, groupId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMarks, setEditingMarks] = useState({});
  const [markInputs, setMarkInputs] = useState({});

  useEffect(() => {
    if (supervisorId && groupId) {
      fetchDocuments();
    }
  }, [supervisorId, groupId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/supervisor/documents?supervisorId=${supervisorId}&groupId=${groupId}`
      );
      setDocuments(res.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReject = async (submissionId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this submission?`)) return;
    try {
      await api.post("/supervisor/submission-status", {
        supervisorId,
        submissionId,
        status,
      });
      alert(`Submission ${status} successfully!`);
      fetchDocuments();
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} submission:`, error);
      alert(`Failed to ${status.toLowerCase()} submission. Please try again.`);
    }
  };

  const handleAssignMarks = async (submissionId, marks) => {
    if (marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100");
      return;
    }
    try {
      await api.post("/supervisor/assign-marks", {
        supervisorId,
        submissionId,
        marks,
      });
      alert("Marks assigned successfully!");
      setEditingMarks({ ...editingMarks, [submissionId]: false });
      fetchDocuments();
    } catch (error) {
      console.error("Error assigning marks:", error);
      alert("Failed to assign marks. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // If filePath already starts with http, return as is
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    
    // Get backend base URL (remove /api suffix if present)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api";
    const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "");
    
    // Remove leading slash from filePath if present
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    
    // Split the path and encode each segment properly
    const pathSegments = cleanPath.split("/");
    const encodedSegments = pathSegments.map(segment => encodeURIComponent(segment));
    const encodedPath = encodedSegments.join("/");
    
    // Construct full URL
    return `${backendBaseUrl}/${encodedPath}`;
  };

  if (!groupId) {
    return (
      <div className="view-documents-page">
        <div className="empty-state">
          <p>Please select a group to view documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-documents-page">
      <div className="page-header">
        <h1>View Documents</h1>
        <p>Review and evaluate documents submitted by the group.</p>
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
        <table className="documents-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Version</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Marks</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.submissionId}>
                <td>{doc.documentName}</td>
                <td>{doc.version}</td>
                <td>{formatDate(doc.submittedAt)}</td>
                <td>
                  <span className={`status-badge status-${doc.status?.toLowerCase() || "pending"}`}>
                    {doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1) || "Pending"}
                  </span>
                  {doc.isLate && <span className="late-indicator">⚠ Late</span>}
                </td>
                <td>
                  {editingMarks[doc.submissionId] ? (
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
                        onClick={() =>
                          handleAssignMarks(doc.submissionId, parseInt(markInputs[doc.submissionId]))
                        }
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() =>
                          setEditingMarks({ ...editingMarks, [doc.submissionId]: false })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      {doc.marksAwarded !== undefined ? (
                        <span>{doc.marksAwarded} / {doc.maxMarks || 100}</span>
                      ) : (
                        <span>—</span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {doc.filePath ? (
                    <a
                      href={getFileUrl(doc.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="actions-cell">
                  {!editingMarks[doc.submissionId] ? (
                    <>
                      <button
                        className="btn btn-assign-marks"
                        onClick={() => {
                          setEditingMarks({ ...editingMarks, [doc.submissionId]: true });
                          setMarkInputs({ ...markInputs, [doc.submissionId]: doc.marksAwarded || "" });
                        }}
                      >
                        {doc.marksAwarded !== undefined ? "Edit Marks" : "Assign Marks"}
                      </button>
                      {doc.status !== "approved" && (
                        <button
                          className="btn btn-accept"
                          onClick={() => handleAcceptReject(doc.submissionId, "approved")}
                        >
                          Accept
                        </button>
                      )}
                      {doc.status !== "rejected" && (
                        <button
                          className="btn btn-reject"
                          onClick={() => handleAcceptReject(doc.submissionId, "rejected")}
                        >
                          Reject
                        </button>
                      )}
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewDocuments;
