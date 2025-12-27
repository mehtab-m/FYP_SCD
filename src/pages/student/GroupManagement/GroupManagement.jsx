// src/pages/student/GroupManagement/GroupManagement.jsx
import React, { useEffect, useState } from "react";
import "./GroupManagement.css";

const GroupManagement = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/students") // Example API
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="group-management">
      <h2>Group Management</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.rollNo}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupManagement;
