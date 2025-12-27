import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../../api/axios"; // 👈 use your axios instance
import "./ManageFYPCommittee.css";

const ManageFYPCommittee = () => {
  const [professors, setProfessors] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

 useEffect(() => {
  const loadProfessors = async () => {
    try {
      const res = await api.get("/admin/fyp-committee/available-professors");
      setProfessors(res.data);
    } catch (err) {
      setErrorMessage("Failed to load professors");
    }
  };

  const loadCommittee = async () => {
    try {
      const res = await api.get("/admin/fyp-committee");
      setCommittee(res.data);
    } catch (err) {
      setErrorMessage("Failed to load committee members");
    }
  };

  loadProfessors();
  loadCommittee();
}, []);


  // 🔹 Add professor to FYP committee
  const addToCommittee = async (professor) => {
    setErrorMessage("");
    if (committee.length >= 4) {
      setErrorMessage("You can only add up to 4 professors in the committee.");
      return;
    }
    if (committee.find((c) => c.userId === professor.userId)) return;

    try {
      await api.post("/admin/fyp-committee", { professorId: professor.userId });
      setCommittee([...committee, professor]);
    } catch (err) {
      setErrorMessage("Failed to add professor to committee");
    }
  };

  // 🔹 Remove professor from committee
  const removeFromCommittee = async (professorId) => {
    setErrorMessage("");
    try {
      await api.delete(`/admin/fyp-committee/${professorId}`);
      setCommittee(committee.filter((c) => c.userId !== professorId));
    } catch (err) {
      setErrorMessage("Failed to remove professor from committee");
    }
  };

  return (
    <div className="committee-container">
      <h2>Manage FYP Committee</h2>

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="professor-list">
        <h3>Available Professors</h3>
        {professors.length === 0 ? (
          <p>No professors found.</p>
        ) : (
          professors.map((prof) => (
            <div key={prof.userId} className="professor-card">
              <div>
                <strong>{prof.name}</strong>
                <p>{prof.email}</p>
              </div>
              <button
                onClick={() => addToCommittee(prof)}
                disabled={committee.find((c) => c.userId === prof.userId)}
              >
                {committee.find((c) => c.userId === prof.userId) ? "Added" : "Add"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="committee-list">
        <h3>FYP Committee Members</h3>
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
              {committee.map((member) => (
                <tr key={member.userId}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>
                    <FaTrash
                      className="delete-icon"
                      onClick={() => removeFromCommittee(member.userId)}
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

export default ManageFYPCommittee;
