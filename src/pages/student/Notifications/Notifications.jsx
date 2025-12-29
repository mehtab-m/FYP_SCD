import React, { useEffect, useState } from "react";
import "./Notifications.css";
// import api from "../../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ================= REAL API (UNCOMMENT LATER) =================
    /*
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/student/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    */

    // ================= DUMMY DATA =================
    setNotifications([
      {
        id: 1,
        type: "GROUP_INVITE",
        message: "You have received a group invitation.",
        status: "Pending",
        date: "2025-02-01",
      },
      {
        id: 2,
        type: "PROJECT_STATUS",
        message: "Your project registration was approved by supervisor.",
        status: "Approved",
        date: "2025-01-29",
      },
      {
        id: 3,
        type: "PROJECT_STATUS",
        message: "Your project proposal was rejected.",
        status: "Rejected",
        date: "2025-01-25",
      },
      {
        id: 4,
        type: "LATE_SUBMISSION",
        message: "Late document submission approved by supervisor.",
        status: "Approved",
        date: "2025-01-20",
      },
    ]);
  }, []);

  const respondToInvite = async (id, action) => {
    // ================= REAL API =================
    /*
    await api.post(`/student/group-invite/${id}/${action}`);
    */

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, status: action === "accept" ? "Approved" : "Rejected" } : n
      )
    );
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

            {n.type === "GROUP_INVITE" && n.status === "Pending" && (
              <div className="actions">
                <button
                  className="accept"
                  onClick={() => respondToInvite(n.id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() => respondToInvite(n.id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}

            {n.status !== "Pending" && (
              <span className="status">{n.status}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
