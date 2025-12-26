// ManageEvaluationCommittee.jsx
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../../api/axios";
import "./ManageEvaluationCommittee.css";

const ManageEvaluationCommittee = () => {
  const [professors, setProfessors] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");


  // REPLACE ONLY THIS

useEffect(() => {
  api.get("/admin/evaluation-committee/available-professors")
    .then(res => setProfessors(res.data))
    .catch(() => setErrorMessage("Failed to load professors"));
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

      <div className="committee-list">
        <h3>Evaluation Committee Members</h3>
        {committee.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          <table>
            <tbody>
              {committee.map(m => (
                <tr key={m.userId}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>
                    <FaTrash onClick={() => removeFromCommittee(m.userId)} />
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
