import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import "./MonitorProgress.css";

const MonitorProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, students, supervisors

  useEffect(() => {
    fetchProgressData();
  }, [filter]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const endpoint = filter === "all" 
        ? "/admin/progress/all"
        : filter === "students"
        ? "/admin/progress/students"
        : "/admin/progress/supervisors";
      
      const res = await api.get(endpoint);
      setProgressData(res.data || []);
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  const studentData = progressData.filter(item => item.type === "student");
  const supervisorData = progressData.filter(item => item.type === "supervisor");

  return (
    <div className="monitor-progress-page">
      <div className="page-header">
        <h1>Monitor Progress</h1>
        <p>Track student and supervisor activity and progress.</p>
      </div>

      <div className="filter-section">
        <label htmlFor="progress-filter">Filter by:</label>
        <select
          id="progress-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Activity</option>
          <option value="students">Student Activity</option>
          <option value="supervisors">Supervisor Activity</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading progress data...</p>
        </div>
      ) : progressData.length === 0 ? (
        <div className="empty-state">
          <p>No progress data available at this time.</p>
        </div>
      ) : (
        <div className="progress-content">
          {(filter === "all" || filter === "students") && studentData.length > 0 && (
            <div className="progress-section">
              <h2>Student Progress ({studentData.length})</h2>
              <div className="progress-cards">
                {studentData.map((item, idx) => (
                  <div key={idx} className="progress-card">
                    <div className="card-header">
                      <h3>{item.projectTitle || "Project"}</h3>
                      <span className={`status-badge status-${item.status?.toLowerCase().replace(/\s+/g, '-') || "in-progress"}`}>
                        {item.status || "In Progress"}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <strong>Group:</strong> {item.groupName || "N/A"}
                      </div>
                      <div className="info-row">
                        <strong>Supervisor:</strong> {item.supervisorName || "N/A"}
                      </div>
                      <div className="info-row">
                        <strong>Members:</strong> {item.memberNames?.join(", ") || "N/A"}
                      </div>
                      <div className="info-row">
                        <strong>Last Activity:</strong> {formatDate(item.lastActivity)}
                      </div>
                      <div className="info-row">
                        <strong>Progress:</strong> 
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${item.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{item.progressPercentage || 0}% ({item.submittedDocuments || 0}/{item.totalDocuments || 0} documents)</span>
                      </div>
                      {item.milestones && item.milestones.length > 0 && (
                        <div className="milestones">
                          <strong>Milestones:</strong>
                          <ul>
                            {item.milestones.map((milestone, mIdx) => (
                              <li key={mIdx} className={milestone.completed ? "completed" : "pending"}>
                                <span className="milestone-name">{milestone.name}</span>
                                <span className={`milestone-status ${milestone.completed ? "completed" : "pending"}`}>
                                  {milestone.completed ? "✓ Completed" : "⏳ Pending"}
                                </span>
                                {milestone.status && (
                                  <span className={`milestone-approval-status status-${milestone.status}`}>
                                    ({milestone.status})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filter === "all" || filter === "supervisors") && supervisorData.length > 0 && (
            <div className="progress-section">
              <h2>Supervisor Activity ({supervisorData.length})</h2>
              <div className="progress-cards">
                {supervisorData.map((item, idx) => (
                  <div key={idx} className="progress-card">
                    <div className="card-header">
                      <h3>{item.supervisorName || "Supervisor"}</h3>
                      <span className={`status-badge status-${item.status?.toLowerCase().replace(/\s+/g, '-') || "active"}`}>
                        {item.status || "Active"}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <strong>Email:</strong> {item.supervisorEmail || "N/A"}
                      </div>
                      <div className="info-row">
                        <strong>Projects Supervised:</strong> {item.projectsCount || 0}
                      </div>
                      <div className="info-row">
                        <strong>Last Activity:</strong> {formatDate(item.lastActivity)}
                      </div>
                      <div className="info-row">
                        <strong>Response Rate:</strong>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${item.responseRate || 0}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{item.responseRate || 0}% ({item.evaluatedSubmissions || 0}/{item.totalSubmissionsToEvaluate || 0} submissions evaluated)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonitorProgress;
