// src/pages/student/ViewMarks/ViewMarks.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./ViewMarks.css";

const ViewMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:8080/api/marks"); // adjust to your backend
        if (!res.ok) throw new Error("Failed to fetch marks");
        const data = await res.json();
        setMarks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  const normalized = useMemo(
    () =>
      marks.map((m) => ({
        id: m.id,
        docType: m.docType,
        supervisor: Number(m.supervisor ?? 0),
        committee: Number(m.committee ?? 0),
        total:
          m.total !== undefined
            ? Number(m.total)
            : Number(m.supervisor ?? 0) + Number(m.committee ?? 0),
        maxSupervisor: Number(m.maxSupervisor ?? 0), // optional
        maxCommittee: Number(m.maxCommittee ?? 0), // optional
        maxTotal:
          m.maxTotal !== undefined
            ? Number(m.maxTotal)
            : Number(m.maxSupervisor ?? 0) + Number(m.maxCommittee ?? 0),
      })),
    [marks]
  );

  const overall = useMemo(() => {
    const sum = normalized.reduce((acc, m) => acc + m.total, 0);
    const max = normalized.reduce((acc, m) => acc + (m.maxTotal || 0), 0);
    const percent = max > 0 ? Math.round((sum / max) * 100) : null;
    return { sum, max, percent };
  }, [normalized]);

  return (
    <div className="view-marks">
      <h2>View Marks</h2>

      {loading && <div className="vm-status vm-loading">Loading marks...</div>}
      {error && <div className="vm-status vm-error">Error: {error}</div>}

      {!loading && !error && normalized.length === 0 && (
        <div className="vm-status vm-empty">No marks available yet.</div>
      )}

      {!loading && !error && normalized.length > 0 && (
        <>
          <div className="vm-summary">
            <div className="vm-card">
              <span className="vm-label">Total:</span>
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
                      {m.maxSupervisor ? (
                        <span className="vm-max"> / {m.maxSupervisor}</span>
                      ) : null}
                    </span>
                  </td>
                  <td>
                    <span className="vm-mark">
                      {m.committee}
                      {m.maxCommittee ? (
                        <span className="vm-max"> / {m.maxCommittee}</span>
                      ) : null}
                    </span>
                  </td>
                  <td>
                    <span className="vm-total">
                      {m.total}
                      {m.maxTotal ? (
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
