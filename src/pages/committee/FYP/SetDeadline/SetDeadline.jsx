import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import "./SetDeadline.css";

const SetDeadline = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/documents");
      // normalize keys: convert deadline_time → deadlineTime
      const normalized = (res.data || []).map((doc) => ({
        ...doc,
        deadlineTime: doc.deadline_time || doc.deadlineTime || ""
      }));
      setDocuments(normalized);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDeadline = async (documentId, deadlineDate, deadlineTime) => {
    if (!deadlineDate) {
      setSuccessMessage("⚠️ Please select a date");
      return;
    }
    try {
      await api.post(`/admin/documents/${documentId}/set-deadline`, {
        deadlineDate,
        deadlineTime
      });
      setSuccessMessage("✅ Deadline updated successfully!");
      fetchDocuments(); // refresh list with updated deadlines
      setTimeout(() => setSuccessMessage(""), 3000); // auto-hide after 3s
    } catch (error) {
      console.error("Error setting deadline:", error);
      setSuccessMessage("❌ Failed to set deadline. Please try again.");
    }
  };

  return (
    <div className="set-deadline-page">
      <header className="page-header">
        <h1>📅 Document Deadlines</h1>
        <p>Manage submission dates and times for each required document.</p>
      </header>

      {successMessage && (
        <div className="success-banner">{successMessage}</div>
      )}

      {loading ? (
        <div className="loading-container">
          <p>Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <p>No documents found.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.documentId} className="document-card">
              <h2 className="doc-title">{doc.documentName}</h2>
              <div className="deadline-fields">
                <label>
                  Date:
                  <input
                    type="date"
                    value={doc.deadline ? doc.deadline : ""}
                    onChange={(e) =>
                      handleSetDeadline(doc.documentId, e.target.value, doc.deadlineTime)
                    }
                  />
                </label>
                <label>
                  Time:
                  <input
                    type="time"
                    value={doc.deadlineTime ? doc.deadlineTime : ""}
                    onChange={(e) =>
                      handleSetDeadline(doc.documentId, doc.deadline, e.target.value)
                    }
                  />
                </label>
              </div>
              {(doc.deadline || doc.deadlineTime) && (
                <p className="current-deadline">
                  Current deadline:{" "}
                  <strong>
                    {doc.deadline ? doc.deadline : "Not set"}{" "}
                    {doc.deadlineTime ? doc.deadlineTime : ""}
                  </strong>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetDeadline;
