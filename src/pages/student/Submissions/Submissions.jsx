// src/pages/student/Submissions/Submissions.jsx
import React, { useState, useEffect } from "react";
import "./Submissions.css";
import api from "../../../api/axios";

const Submissions = () => {
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      loadDocuments();
    }
  }, [currentUserId]);

  const loadDocuments = async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/student/documents?userId=${currentUserId}`);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
      setDocuments(sorted);
    } catch (err) {
      console.error("Error loading documents:", err);
      setErrorMessage("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = (deadlineDate) => {
   
    return true;
  };

  const handleFileChange = (docId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [docId]: file }));
  };

  const handleSubmit = async (docId, deadlineDate) => {
    if (!currentUserId) {
      setErrorMessage("User session not found. Please log in again.");
      return;
    }

    if (!canSubmit(deadlineDate)) {
      setErrorMessage("Submission not allowed for this document.");
      return;
    }
    if (!selectedFiles[docId]) {
      setErrorMessage("Please select a file before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFiles[docId]);
      formData.append("userId", currentUserId);

      await api.post(`/student/submissions/${docId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("✅ Document submitted successfully!");
      setErrorMessage("");
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[docId];
        return newFiles;
      });
      setTimeout(() => setSuccessMessage(""), 3000);
      loadDocuments();
    } catch (err) {
      console.error("Error submitting document:", err);
      setErrorMessage("❌ Failed to submit document: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Not Submitted";
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending for Approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return { bg: "#e9ecef", color: "#495057" };
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "#fff3cd", color: "#856404" };
      case "approved":
        return { bg: "#d4edda", color: "#155724" };
      case "rejected":
        return { bg: "#f8d7da", color: "#721c24" };
      default:
        return { bg: "#e9ecef", color: "#495057" };
    }
  };

  if (loading) {
    return (
      <div className="submissions-page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-page">
      <header className="page-header">
        <h1>📂 Student Submissions</h1>
        <p>Upload and manage your project documents before deadlines.</p>
      </header>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="documents-grid">
        {documents.map((doc) => {
          const statusStyle = getStatusColor(doc.status);
          const statusLabel = getStatusLabel(doc.status);
          
          return (
            <div key={doc.documentId} className="document-card">
              <h2 className="doc-title">{doc.documentName}</h2>
              
              {/* Status Display */}
              {doc.status && (
                <div style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "6px 12px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      fontSize: "14px",
                      display: "inline-block"
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>
              )}

              <p className="deadline">
                Deadline:{" "}
                <strong>
                  {doc.deadline ? new Date(doc.deadline).toLocaleDateString() : "Not set"}{" "}
                  {doc.deadline_time ? doc.deadline_time : ""}
                </strong>
              </p>

              {doc.submitted && doc.submittedAt && (
                <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                  Submitted: {new Date(doc.submittedAt).toLocaleString()}
                </p>
              )}

              <div className="upload-section">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(doc.documentId, e.target.files[0])}
                  disabled={!canSubmit(doc.deadline)}
                />
                <button
                  className="submit-btn"
                  disabled={!canSubmit(doc.deadline)}
                  onClick={() => handleSubmit(doc.documentId, doc.deadline)}
                >
                  {canSubmit(doc.deadline) ? "Submit Document" : "Submission Closed"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Submissions;