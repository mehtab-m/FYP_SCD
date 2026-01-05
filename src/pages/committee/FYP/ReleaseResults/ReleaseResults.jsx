import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { useNotification } from "../../../../hooks/useNotification.jsx";
import "./ReleaseResults.css";

const ReleaseResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showGradeAssignment, setShowGradeAssignment] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("A");
  const [selectedMarks, setSelectedMarks] = useState(80);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const { showSuccess, showError, NotificationComponent } = useNotification();

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
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/results");
      setResults(res.data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishResults = async () => {
    if (!currentUserId) {
      showError("User session not found. Please log in again.");
      return;
    }

    try {
      const res = await api.post("/admin/results/publish", {
        grade: selectedGrade,
        marks: selectedMarks,
        assignedBy: currentUserId
      });
      
      if (res.data.success) {
        showSuccess("Grades assigned successfully!");
        setShowPublishModal(false);
        setShowGradeAssignment(false);
        fetchResults();
      } else {
        showError(res.data.message || "Failed to assign grades. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing results:", error);
      showError(error.response?.data?.message || "Failed to assign grades. Please try again.");
    }
  };

  const toggleGroupExpand = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="release-results-page">
      {NotificationComponent}
      <div className="page-header">
        <h1>Release Results</h1>
        <p>View group marks breakdown and assign final grades.</p>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowGradeAssignment(true)}
            disabled={results.length === 0}
          >
            Assign Grades
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <p>No results available to publish at this time.</p>
        </div>
      ) : (
        <>
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Project Title</th>
                  <th>Supervisor</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <React.Fragment key={result.id || result.groupId}>
                    <tr>
                      <td><strong>{result.groupName || `Group ${result.groupId}`}</strong></td>
                      <td>{result.projectTitle || "N/A"}</td>
                      <td>{result.supervisorName || "N/A"}</td>
                      <td>
                        <strong>{result.totalMarks || 0}</strong> / {result.maxMarks || 100}
                      </td>
                      <td>
                        {result.grade ? (
                          <span className={`grade-badge grade-${result.grade?.toLowerCase() || "na"}`}>
                            {result.grade}
                          </span>
                        ) : (
                          <span className="grade-badge grade-na">Not Assigned</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge status-${result.published ? "published" : "draft"}`}>
                          {result.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-view"
                          onClick={() => toggleGroupExpand(result.groupId)}
                        >
                          {expandedGroup === result.groupId ? "Hide Details" : "Show Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedGroup === result.groupId && result.documentMarks && result.documentMarks.length > 0 && (
                      <tr>
                        <td colSpan="7" style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
                          <div className="document-marks-breakdown">
                            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Marks Breakdown by Document</h3>
                            <table className="marks-breakdown-table">
                              <thead>
                                <tr>
                                  <th>Document</th>
                                  <th>Supervisor Marks</th>
                                  <th>Committee Marks</th>
                                  <th>Total Marks</th>
                                  <th>Version</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.documentMarks.map((docMark, idx) => (
                                  <tr key={idx}>
                                    <td><strong>{docMark.documentName}</strong></td>
                                    <td>{docMark.supervisorMarks || 0}</td>
                                    <td>{docMark.committeeMarks || 0}</td>
                                    <td><strong>{docMark.totalMarks || 0}</strong> / {docMark.maxMarks || 0}</td>
                                    <td>v{docMark.version || 1}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Grade Assignment Modal */}
      {showGradeAssignment && (
        <div className="modal-overlay" onClick={() => setShowGradeAssignment(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Grades to All Groups</h2>
              <button className="modal-close" onClick={() => setShowGradeAssignment(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Select Base Grade:
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Marks Threshold:
                </label>
                <input
                  type="number"
                  value={selectedMarks}
                  onChange={(e) => setSelectedMarks(parseInt(e.target.value) || 80)}
                  min="0"
                  max="100"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
                <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                  Groups with marks &gt; {selectedMarks} will get grade {selectedGrade}. 
                  Grades will decrease by one for every 10 marks below the threshold.
                </small>
              </div>
              <div style={{ 
                backgroundColor: "#e7f3ff", 
                padding: "15px", 
                borderRadius: "4px",
                marginTop: "20px"
              }}>
                <strong>Grade Assignment Preview:</strong>
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  <li>Marks &gt; {selectedMarks}: Grade {selectedGrade}</li>
                  <li>Marks &gt; {selectedMarks - 10} and ≤ {selectedMarks}: Grade {getNextGrade(selectedGrade, 1)}</li>
                  <li>Marks &gt; {selectedMarks - 20} and ≤ {selectedMarks - 10}: Grade {getNextGrade(selectedGrade, 2)}</li>
                  <li>Marks &gt; {selectedMarks - 30} and ≤ {selectedMarks - 20}: Grade {getNextGrade(selectedGrade, 3)}</li>
                  <li>And so on...</li>
                </ul>
              </div>
              <p style={{ color: "#dc3545", fontWeight: "bold", marginTop: "20px" }}>
                Warning: This will assign grades to ALL groups. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-cancel" 
                onClick={() => setShowGradeAssignment(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowGradeAssignment(false);
                  setShowPublishModal(true);
                }}
              >
                Confirm and Assign Grades
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Grade Assignment</h2>
              <button className="modal-close" onClick={() => setShowPublishModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>
                You are about to assign grades to all {results.length} group(s) based on:
              </p>
              <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                <li>Base Grade: <strong>{selectedGrade}</strong></li>
                <li>Marks Threshold: <strong>{selectedMarks}</strong></li>
              </ul>
              <p style={{ color: "#dc3545", fontWeight: "bold", marginTop: "20px" }}>
                Warning: This action cannot be undone. Are you sure you want to proceed?
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-cancel" 
                onClick={() => setShowPublishModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handlePublishResults}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get next grade
const getNextGrade = (grade, offset) => {
  const grades = ["A", "B", "C", "D", "E", "F", "G"];
  const index = grades.indexOf(grade.toUpperCase());
  if (index === -1) return "F";
  const newIndex = Math.min(index + offset, grades.length - 1);
  return grades[newIndex];
};

export default ReleaseResults;
