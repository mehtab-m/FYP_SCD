import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import "./ViewGroups.css";

const ViewGroups = ({ supervisorId, onGroupSelect }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supervisorId) {
      fetchGroups();
    }
  }, [supervisorId]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/supervisor/groups?supervisorId=${supervisorId}`);
      setGroups(res.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-groups-page">
      <h1>View Groups</h1>
      <p>Groups assigned to you as supervisor</p>

      {loading ? (
        <div className="loading-container">
          <p>Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <p>No groups assigned to you yet.</p>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group.groupId} className="group-card">
              <div className="group-header">
                <h2>{group.projectTitle || "Untitled Project"}</h2>
                <span className={`status-badge status-${group.projectStatus?.toLowerCase() || "pending"}`}>
                  {group.projectStatus || "Pending"}
                </span>
              </div>

              <div className="group-section">
                <h3>Group Members</h3>
                {group.members && group.members.length > 0 ? (
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Semester</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((member) => (
                        <tr key={member.id}>
                          <td>
                            {member.name} {member.isLeader && "👑"}
                          </td>
                          <td>{member.email}</td>
                          <td>{member.semester || "N/A"}</td>
                          <td>
                            {member.isLeader ? (
                              <span className="leader-badge">Leader</span>
                            ) : (
                              <span>Member</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No members found.</p>
                )}
              </div>

              <div className="group-actions">
                <button
                  className="btn btn-view-docs"
                  onClick={() => onGroupSelect && onGroupSelect(group.groupId)}
                >
                  View Documents
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewGroups;

