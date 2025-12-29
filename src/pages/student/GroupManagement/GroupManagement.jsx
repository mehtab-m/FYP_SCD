import React, { useEffect, useState } from "react";
import "./GroupManagement.css";
import api from "../../../api/axios";

const GroupManagement = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("admin/users/available_students_for_grouping");
        // add local status
        const withStatus = res.data.map(s => ({ ...s, status: null }));
        setStudents(withStatus);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  const sendInvite = async (studentId) => {
    try {
      await api.post(`/admin/groups/invite/${studentId}`);
      setStudents(prev =>
        prev.map(s =>
          s.id === studentId ? { ...s, status: "Pending" } : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group-management">
      <h2>Group Management</h2>

      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Invite</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.rollNo}</td>
              <td>{s.email}</td>

              <td>
                <button
                  disabled={s.status === "Pending"}
                  onClick={() => sendInvite(s.id)}
                >
                  +
                </button>
              </td>

              <td>
                {s.status || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupManagement;
