// src/pages/student/ProjectRegistration/ProjectRegistration.jsx
import React, { useState, useEffect } from "react";
import "./ProjectRegistration.css";

const ProjectRegistration = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/project-requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="project-registration">
      <h2>Project Registration</h2>
      <table>
        <thead>
          <tr>
            <th>Invited Student</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.studentName}</td>
              <td className={`status ${r.status.toLowerCase()}`}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectRegistration;
