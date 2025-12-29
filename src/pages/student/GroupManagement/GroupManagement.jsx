import React, { useEffect, useState } from "react";
import "./GroupManagement.css";
import api from "../../../api/axios";

const GroupManagement = () => {
  const [students, setStudents] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage or session
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
      fetchSentInvitations(); // Fetch invitation statuses
      
      // Refresh statuses every 5 seconds to catch updates
      const interval = setInterval(() => {
        fetchSentInvitations();
        fetchAcceptedStudents();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  const fetchAvailableStudents = async () => {
    const res = await api.get("/student/groups/available");
    // Map userId to id for consistency
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
      // Create a map of studentId -> status
      const statusMap = {};
      res.data.forEach(invite => {
        statusMap[invite.studentId] = invite.status;
      });
      
      // Update students with actual statuses
      setStudents(prev => 
        prev.map(s => {
          const studentId = s.id || s.userId;
          const status = statusMap[studentId];
          if (status) {
            // Capitalize first letter for display
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
    // Map userId to id for consistency
    setAccepted(res.data.map(s => ({ ...s, id: s.userId || s.id })));
  };

  const sendInvite = async (studentId) => {
    if (!currentUserId) {
      alert("User not logged in. Please refresh the page.");
      return;
    }
    try {
      await api.post(`/student/groups/invite/${studentId}?leaderId=${currentUserId}`);
      // Refresh invitation statuses after sending
      await fetchSentInvitations();
      // Also refresh available students to update the list
      await fetchAvailableStudents();
      await fetchSentInvitations(); // Fetch again to update statuses
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
    try {
      await api.post(`/student/groups/finalize?leaderId=${currentUserId}`, {
        selectedStudentIds: selected
      });
      alert("Group finalized successfully");
      // Refresh the page or update state
      fetchAvailableStudents();
      fetchAcceptedStudents();
    } catch (error) {
      console.error("Error finalizing group:", error);
      alert("Failed to finalize group. Please try again.");
    }
  };

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
                    disabled={s.status === "Pending" || s.status === "pending" || 
                             s.status === "Accepted" || s.status === "accepted"}
                    onClick={() => sendInvite(studentId)}
                  >
                    +
                  </button>
                </td>
                <td>
                  {s.status === "pending" || s.status === "Pending" ? "Pending" : 
                   s.status === "accepted" || s.status === "Accepted" ? "Accepted" : 
                   s.status === "rejected" || s.status === "Rejected" ? "Rejected" : 
                   s.status || "-"}
                </td>
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
