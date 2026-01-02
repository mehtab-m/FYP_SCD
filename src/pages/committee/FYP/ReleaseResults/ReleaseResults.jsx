import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import "./ReleaseResults.css";

const ReleaseResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedResults, setSelectedResults] = useState([]);

  useEffect(() => {
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
    if (!window.confirm("Are you sure you want to publish the final marks? This action cannot be undone.")) {
      return;
    }

    try {
      await api.post("/admin/results/publish", {
        resultIds: selectedResults.length > 0 ? selectedResults : results.map(r => r.id)
      });
      alert("Results published successfully!");
      setShowPublishModal(false);
      setSelectedResults([]);
      fetchResults();
    } catch (error) {
      console.error("Error publishing results:", error);
      alert("Failed to publish results. Please try again.");
    }
  };

  const handleToggleSelect = (resultId) => {
    setSelectedResults(prev => 
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  const handleSelectAll = () => {
    if (selectedResults.length === results.length) {
      setSelectedResults([]);
    } else {
      setSelectedResults(results.map(r => r.id));
    }
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
      <div className="page-header">
        <h1>Release Results</h1>
        <p>Publish final marks and results.</p>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleSelectAll}
          >
            {selectedResults.length === results.length ? "Deselect All" : "Select All"}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowPublishModal(true)}
            disabled={results.length === 0}
          >
            Publish Final Marks
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
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedResults.length === results.length && results.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Project Title</th>
                <th>Group</th>
                <th>Supervisor</th>
                <th>Total Marks</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedResults.includes(result.id)}
                      onChange={() => handleToggleSelect(result.id)}
                    />
                  </td>
                  <td>{result.projectTitle || "N/A"}</td>
                  <td>{result.groupName || "N/A"}</td>
                  <td>{result.supervisorName || "N/A"}</td>
                  <td>
                    <strong>{result.totalMarks || 0}</strong> / {result.maxMarks || 100}
                  </td>
                  <td>
                    <span className={`grade-badge grade-${result.grade?.toLowerCase() || "na"}`}>
                      {result.grade || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${result.published ? "published" : "draft"}`}>
                      {result.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-view"
                      onClick={() => {
                        // View details - can be implemented later
                        alert(`View details for ${result.projectTitle}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Publish Final Marks</h2>
              <button className="modal-close" onClick={() => setShowPublishModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>
                {selectedResults.length > 0
                  ? `You are about to publish ${selectedResults.length} result(s). This will make the marks visible to students.`
                  : `You are about to publish all ${results.length} result(s). This will make the marks visible to students.`
                }
              </p>
              <p style={{ color: "#dc3545", fontWeight: "bold" }}>
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
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseResults;

