// src/pages/student/Submissions/Submissions.jsx
import React, { useState, useEffect } from "react";
import "./Submissions.css";
import api from "../../../api/axios";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); 
  useEffect(() => {
    loadSubmissions();
  }, []);
  const loadSubmissions = async () => {
    try {
      const res = await api.get("/submissions");
      setSubmissions(res.data);
    } catch (err) {
      setErrorMessage("Failed to load submissions");
    }
  };

  return (
    <div className="submissions">
      <h2>Submissions</h2>
      <table>
        <thead>
          <tr>
            <th>Document Type</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.docType}</td>
              <td>{s.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Submissions;
