// src/pages/admin/ManageEvaluationCommittee.jsx
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../../api/axios";
import "./ManageEvaluationCommittee.css";

const ManageEvaluationCommittee = () => {
  const [professors, setProfessors] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Load available professors
    api.get("/admin/evaluation-committee/available-professors")
      .then(res => setProfessors(res.data))
      .catch(() => setErrorMessage("Failed to load professors"));

    // Load current committee members
    api.get("/admin/evaluation-committee/members")
      .then(res => setCommittee(res.data))
      .catch(() => setErrorMessage("Failed to load committee members"));
  }, []);

  const addToCommittee = async (prof) => {
    if (committee.length >= 4) return;
    if (committee.find(c => c.userId === prof.userId)) return;
    await api.post("/admin/evaluation-committee", { professorId: prof.userId });
    setCommittee([...committee, prof]);
  };

  const removeFromCommittee = async (id) => {
    await api.delete(`/admin/evaluation-committee/${id}`);
    setCommittee(committee.filter(c => c.userId !== id));
  };

  return (
    <div className="committee-container">
      <h2>Manage Evaluation Committee</h2>

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      {/* Available Professors */}
      <div className="professor-list">
        <h3>Available Professors</h3>
        {professors.map(prof => (
          <div key={prof.userId} className="professor-card">
            <div>
              <strong>{prof.name}</strong>
              <p>{prof.email}</p>
            </div>
            <button
              onClick={() => addToCommittee(prof)}
              disabled={committee.find(c => c.userId === prof.userId)}
            >
              {committee.find(c => c.userId === prof.userId) ? "Added" : "Add"}
            </button>
          </div>
        ))}
      </div>

      {/* Committee Members */}
      <div className="committee-list">
        <h3>Evaluation Committee Members</h3>
        {committee.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          <table className="committee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {committee.map(m => (
                <tr key={m.userId}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>
                    <FaTrash
                      className="delete-icon"
                      onClick={() => removeFromCommittee(m.userId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageEvaluationCommittee;
