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
      const res = await api.get(`/supervisor/documents?supervisorId=${supervisorId}&groupId=${groupId}`);
      setDocuments(res.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReject = async (submissionId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this submission?`)) {
      return;
    }

    try {
      await api.post("/supervisor/submission-status", {
        supervisorId: supervisorId,
        submissionId: submissionId,
        status: status
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
        supervisorId: supervisorId,
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
                      <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="file-link">
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
  );
};

export default ViewDocuments;

