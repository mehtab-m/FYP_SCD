import React, { useEffect, useState } from "react";
import "./GroupManagement.css";
import api from "../../../api/axios";

const GroupManagement = () => {
  const [students, setStudents] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isGroupFinalized, setIsGroupFinalized] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || user.userId);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    fetchAvailableStudents();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchAcceptedStudents();
      fetchSentInvitations();
      checkIfGroupFinalized();

      const interval = setInterval(() => {
        fetchSentInvitations();
        fetchAcceptedStudents();
        checkIfGroupFinalized();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  const fetchAvailableStudents = async () => {
    const res = await api.get("/student/groups/available");
    setStudents(res.data.map(s => ({ 
      ...s, 
      id: s.userId || s.id,
      status: null 
    })));
  };

  const fetchSentInvitations = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get(`/student/groups/sent-invitations?leaderId=${currentUserId}`);
      const statusMap = {};
      res.data.forEach(invite => {
        statusMap[invite.studentId] = invite.status;
      });
      setStudents(prev => 
        prev.map(s => {
          const studentId = s.id || s.userId;
          const status = statusMap[studentId];
          if (status) {
            const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
            return { ...s, status: displayStatus };
          }
          return s;
        })
      );
    } catch (error) {
      console.error("Error fetching sent invitations:", error);
    }
  };

  const fetchAcceptedStudents = async () => {
    if (!currentUserId) return;
    const res = await api.get(`/student/groups/accepted?leaderId=${currentUserId}`);
    setAccepted(res.data.map(s => ({ ...s, id: s.userId || s.id })));
  };

  const checkIfGroupFinalized = async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get(`/student/groups/is-finalized?leaderId=${currentUserId}`);
      setIsGroupFinalized(res.data.finalized || false);
    } catch (error) {
      console.error("Error checking if group is finalized:", error);
      setIsGroupFinalized(false);
    }
  };

  const sendInvite = async (studentId) => {
    if (!currentUserId) {
      alert("User not logged in. Please refresh the page.");
      return;
    }
    try {
      await api.post(`/student/groups/invite/${studentId}?leaderId=${currentUserId}`);
      await fetchSentInvitations();
      await fetchAvailableStudents();
      await fetchSentInvitations();
    } catch (error) {
      console.error("Error sending invite:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to send invitation. Please try again.";
      alert(errorMsg);
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const finalizeGroup = async () => {
    if (!currentUserId) {
      alert("User not logged in. Please refresh the page.");
      return;
    }
    if (isGroupFinalized) {
      alert("Group is already finalized. You cannot finalize it again.");
      return;
    }
    try {
      await api.post(`/student/groups/finalize?leaderId=${currentUserId}`, {
        selectedStudentIds: selected
      });
      alert("Group finalized successfully! All members will be notified.");
      fetchAvailableStudents();
      fetchAcceptedStudents();
      checkIfGroupFinalized();
      setSelected([]);
    } catch (error) {
      console.error("Error finalizing group:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to finalize group. Please try again.";
      alert(errorMsg);
    }
  };

  // 🔥 Show only the finalized message if group is finalized
  if (isGroupFinalized) {
    return (
      <div className="group-finalized-page" style={{ padding: "40px", backgroundColor: "#d4edda", borderRadius: "10px", marginTop: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#155724" }}>✓ Group Already Finalized</h2>
        <p style={{ color: "#155724", fontSize: "18px" }}>
          Your group has been successfully finalized. You can view your group members in the dashboard.
        </p>
      </div>
    );
  }

  // Normal page if not finalized
  return (
    <div className="group-management">
      <h2>Available Students</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>Email</th>
            <th>Invite</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const studentId = s.id || s.userId;
            return (
              <tr key={studentId}>
                <td>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>{s.email}</td>
                <td>
                  <button
                    disabled={["Pending","Accepted"].includes(s.status)}
                    onClick={() => sendInvite(studentId)}
                  >
                    +
                  </button>
                </td>
                <td>{s.status || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Accepted Students</h2>
      {accepted.map(s => {
        const studentId = s.id || s.userId;
        return (
          <div key={studentId}>
            <input
              type="checkbox"
              checked={selected.includes(studentId)}
              onChange={() => toggleSelect(studentId)}
            />
            {s.name}
          </div>
        );
      })}

      <button
        disabled={selected.length !== 3}
        onClick={finalizeGroup}
      >
        Finalize Group
      </button>
    </div>
  );
};

export default GroupManagement;
