// src/pages/student/Submissions/Submissions.jsx
import React, { useState, useEffect } from "react";
import "./Submissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/submissions")
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error(err));
  }, []);

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
