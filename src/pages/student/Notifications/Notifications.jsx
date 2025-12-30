import React, { useEffect, useState } from "react";
import "./Notifications.css";
import api from "../../../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || user.userId);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
    }
  }, [currentUserId]);

  const fetchNotifications = async () => {
    if (!currentUserId) return;
    
    try {
      const res = await api.get(`/student/groups/invitations-with-leader?studentId=${currentUserId}`);
      
      // Transform invitations into notification format
      const groupInvites = res.data.map(invite => {
        let message = "";
        if (invite.type === "GROUP_CREATED") {
          const memberCount = invite.memberCount || 0;
          const leaderName = invite.leader?.name || "Group Leader";
          message = `Your group has been created successfully! You are part of a group with ${memberCount} member(s). Group leader: ${leaderName}`;
        } else if (invite.type === "PROJECT_APPROVED") {
          const title = invite.title || "Your project";
          const supervisorName = invite.supervisor?.name || "a supervisor";
          message = invite.message || `Your project '${title}' has been approved by the FYP committee! Supervisor: ${supervisorName}`;
        } else {
          message = invite.leader 
            ? `${invite.leader.name} (${invite.leader.email}) invited you to join their group.`
            : "You have received a group invitation.";
        }
        
        return {
          id: invite.invitationId || invite.projectId || `group-${invite.groupId}`,
          type: invite.type || "GROUP_INVITE",
          message: message,
          status: invite.status === "pending" ? "Pending" : 
                  invite.status === "accepted" ? "Accepted" : 
                  invite.status === "approved" ? "Approved" :
                  invite.status === "rejected" ? "Rejected" : "Accepted",
          date: new Date().toISOString().split('T')[0],
          invitationId: invite.invitationId,
          statusLower: invite.status || "accepted",
          groupId: invite.groupId,
          projectId: invite.projectId,
          title: invite.title,
          supervisor: invite.supervisor
        };
      });
      
      setNotifications(groupInvites);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const respondToInvite = async (invitationId, action) => {
    try {
      await api.post(`/student/groups/invitations/${invitationId}/${action}`);
      // Refresh notifications after responding
      await fetchNotifications();
    } catch (error) {
      console.error("Error responding to invite:", error);
      alert("Failed to respond to invitation. Please try again.");
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p className="empty">No notifications</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} className={`notification-card ${n.status}`}>
            <div className="notification-header">
              <span className="type">{n.type.replace("_", " ")}</span>
              <span className="date">{n.date}</span>
            </div>

            <p className="message">{n.message}</p>

            {n.type === "GROUP_INVITE" && n.statusLower === "pending" && (
              <div className="actions">
                <button
                  className="accept"
                  onClick={() => respondToInvite(n.invitationId, "accept")}
                >
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() => respondToInvite(n.invitationId, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
            
            {n.type === "GROUP_CREATED" && (
              <div className="actions">
                <span className="status" style={{ color: "#28a745", fontWeight: "bold" }}>
                  ✓ Group Created
                </span>
              </div>
            )}
            
            {n.type === "PROJECT_APPROVED" && (
              <div className="actions">
                <span className="status" style={{ color: "#28a745", fontWeight: "bold" }}>
                  ✓ Project Approved
                </span>
                {n.supervisor && (
                  <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#666" }}>
                    Assigned Supervisor: <strong>{n.supervisor.name}</strong> ({n.supervisor.email})
                  </p>
                )}
              </div>
            )}

            {n.statusLower !== "pending" && (
              <span className="status">{n.status}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
