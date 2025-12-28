import React, { useEffect, useState } from "react";
import "./GroupManagement.css";
import api from "../../../api/axios";

const GroupManagement = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("admin/users/available_students_for_grouping");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
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
