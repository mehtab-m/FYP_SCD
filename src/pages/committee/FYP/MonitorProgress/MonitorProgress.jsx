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

  return (
    <div className="monitor-progress-page">
      <div className="page-header">
        <h1>Monitor Progress</h1>
        <p>Track student and supervisor activity.</p>
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
          {filter === "all" || filter === "students" ? (
            <div className="progress-section">
              <h2>Student Progress</h2>
              <div className="progress-cards">
                {progressData
                  .filter(item => item.type === "student" || filter === "all")
                  .map((item, idx) => (
                    <div key={idx} className="progress-card">
                      <div className="card-header">
                        <h3>{item.projectTitle || "Project"}</h3>
                        <span className="status-badge">{item.status || "In Progress"}</span>
                      </div>
                      <div className="card-body">
                        <div className="info-row">
                          <strong>Group:</strong> {item.groupName || "N/A"}
                        </div>
                        <div className="info-row">
                          <strong>Last Activity:</strong> {item.lastActivity || "N/A"}
                        </div>
                        <div className="info-row">
                          <strong>Progress:</strong> {item.progressPercentage || 0}%
                        </div>
                        {item.milestones && (
                          <div className="milestones">
                            <strong>Milestones:</strong>
                            <ul>
                              {item.milestones.map((milestone, mIdx) => (
                                <li key={mIdx} className={milestone.completed ? "completed" : ""}>
                                  {milestone.name} - {milestone.completed ? "✓ Completed" : "Pending"}
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
          ) : null}

          {filter === "all" || filter === "supervisors" ? (
            <div className="progress-section">
              <h2>Supervisor Activity</h2>
              <div className="progress-cards">
                {progressData
                  .filter(item => item.type === "supervisor" || filter === "all")
                  .map((item, idx) => (
                    <div key={idx} className="progress-card">
                      <div className="card-header">
                        <h3>{item.supervisorName || "Supervisor"}</h3>
                        <span className="status-badge">{item.status || "Active"}</span>
                      </div>
                      <div className="card-body">
                        <div className="info-row">
                          <strong>Projects Supervised:</strong> {item.projectsCount || 0}
                        </div>
                        <div className="info-row">
                          <strong>Last Activity:</strong> {item.lastActivity || "N/A"}
                        </div>
                        <div className="info-row">
                          <strong>Response Rate:</strong> {item.responseRate || 0}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MonitorProgress;

