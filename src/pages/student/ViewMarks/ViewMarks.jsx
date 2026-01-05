// src/pages/student/ViewMarks/ViewMarks.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import "./ViewMarks.css";

const ViewMarks = () => {
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || user.userId);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Error parsing user data');
        setLoading(false);
      }
    } else {
      setError('User session not found. Please log in again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMarks();
    }
  }, [currentUserId]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/student/marks?userId=${currentUserId}`);
      
      if (res.data.error) {
        setError(res.data.error);
        setMarksData(null);
      } else {
        setMarksData(res.data);
      }
    } catch (e) {
      console.error("Error fetching marks:", e);
      setError(e.response?.data?.error || e.message || "Failed to fetch marks");
      setMarksData(null);
    } finally {
      setLoading(false);
    }
  };

  const normalized = useMemo(() => {
    if (!marksData || !marksData.documentMarks) return [];
    
    return marksData.documentMarks.map((m) => ({
      id: m.documentId,
      docType: m.documentName || m.docType,
      supervisor: Number(m.supervisor ?? 0),
      committee: Number(m.committee ?? 0),
      total: Number(m.total ?? 0),
      maxSupervisor: Number(m.maxSupervisor ?? 0),
      maxCommittee: Number(m.maxCommittee ?? 0),
      maxTotal: Number(m.maxTotal ?? 0),
    }));
  }, [marksData]);

  const overall = useMemo(() => {
    if (!marksData) {
      return { sum: 0, max: 0, percent: null };
    }
    
    const sum = marksData.totalMarks || 0;
    const max = marksData.maxMarks || 0;
    const percent = max > 0 ? Math.round((sum / max) * 100) : null;
    return { sum, max, percent };
  }, [marksData]);

  const getGradeClass = (grade) => {
    if (!grade) return "vm-grade-na";
    const gradeLower = grade.toLowerCase();
    return `vm-grade-${gradeLower}`;
  };

  return (
    <div className="view-marks">
      <h2>View Marks & Grade</h2>
      {marksData && marksData.groupName && (
        <div className="vm-group-info">
          <strong>{marksData.groupName}</strong>
          {marksData.projectTitle && (
            <span className="vm-project-title"> - {marksData.projectTitle}</span>
          )}
        </div>
      )}

      {loading && <div className="vm-status vm-loading">Loading marks...</div>}
      {error && <div className="vm-status vm-error">Error: {error}</div>}

      {!loading && !error && marksData && normalized.length === 0 && (
        <div className="vm-status vm-empty">No marks available yet.</div>
      )}

      {!loading && !error && marksData && normalized.length > 0 && (
        <>
          <div className="vm-summary">
            <div className="vm-card">
              <span className="vm-label">Total Marks:</span>
              <span className="vm-value">
                {overall.sum}
                {overall.max ? ` / ${overall.max}` : ""}
              </span>
            </div>
            {overall.percent !== null && (
              <div className="vm-card">
                <span className="vm-label">Overall %:</span>
                <span className="vm-value">{overall.percent}%</span>
              </div>
            )}
            {marksData.grade && marksData.gradePublished && (
              <div className="vm-card vm-card-grade">
                <span className="vm-label">Final Grade:</span>
                <span className={`vm-value vm-grade ${getGradeClass(marksData.grade)}`}>
                  {marksData.grade}
                </span>
              </div>
            )}
            {marksData.gradePublished === false && (
              <div className="vm-card">
                <span className="vm-label">Final Grade:</span>
                <span className="vm-value vm-grade-na">Not Published</span>
              </div>
            )}
          </div>

          <table className="vm-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Supervisor</th>
                <th>Committee</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {normalized.map((m) => (
                <tr key={m.id}>
                  <td className="vm-doc">{m.docType}</td>
                  <td>
                    <span className="vm-mark">
                      {m.supervisor}
                      {m.maxSupervisor > 0 ? (
                        <span className="vm-max"> / {m.maxSupervisor}</span>
                      ) : null}
                    </span>
                  </td>
                  <td>
                    <span className="vm-mark">
                      {m.committee}
                      {m.maxCommittee > 0 ? (
                        <span className="vm-max"> / {m.maxCommittee}</span>
                      ) : null}
                    </span>
                  </td>
                  <td>
                    <span className="vm-total">
                      {m.total}
                      {m.maxTotal > 0 ? (
                        <span className="vm-max"> / {m.maxTotal}</span>
                      ) : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewMarks;
