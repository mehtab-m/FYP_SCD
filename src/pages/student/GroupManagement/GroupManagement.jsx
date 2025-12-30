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
      checkIfGroupFinalized(); // Check if group is already finalized
      
      // Refresh statuses every 5 seconds to catch updates
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
    if (isGroupFinalized) {
      alert("Group is already finalized. You cannot finalize it again.");
      return;
    }
    try {
      await api.post(`/student/groups/finalize?leaderId=${currentUserId}`, {
        selectedStudentIds: selected
      });
      alert("Group finalized successfully! All members will be notified.");
      // Refresh the page or update state
      fetchAvailableStudents();
      fetchAcceptedStudents();
      checkIfGroupFinalized();
      setSelected([]); // Clear selection
    } catch (error) {
      console.error("Error finalizing group:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to finalize group. Please try again.";
      alert(errorMsg);
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

      {isGroupFinalized ? (
        <div style={{ padding: "20px", backgroundColor: "#d4edda", borderRadius: "5px", marginTop: "20px" }}>
          <h3 style={{ color: "#155724", margin: "0 0 10px 0" }}>✓ Group Already Finalized</h3>
          <p style={{ color: "#155724", margin: 0 }}>Your group has been successfully finalized. You can view your group members in the dashboard.</p>
        </div>
      ) : (
        <button
          disabled={selected.length !== 3}
          onClick={finalizeGroup}
        >
          Finalize Group
        </button>
      )}
    </div>
  );
};

export default GroupManagement;
