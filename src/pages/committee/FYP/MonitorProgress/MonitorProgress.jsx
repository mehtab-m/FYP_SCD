import React, { useState, useEffect, useMemo } from "react";
import api from "../../../../api/axios";
import { useNotification } from "../../../../hooks/useNotification.jsx";
import "./MonitorProgress.css";

const MonitorProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, students, supervisors
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, in-progress, behind, not-started
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, progress, name
  const { showError, showSuccess, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchProgressData();
    fetchProjectsData();
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
      showError("Failed to load progress data. Please try again.");
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsData = async () => {
    try {
      const res = await api.get("/admin/projects/registrations");
      setProjectsData(res.data || []);
    } catch (error) {
      console.error("Error fetching projects data:", error);
      // Don't show error for this as it's supplementary data
    }
  };

  const handleRefresh = () => {
    fetchProgressData();
    fetchProjectsData();
    showSuccess("Data refreshed successfully!");
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

  // Calculate statistics
  const statistics = useMemo(() => {
    const studentData = progressData.filter(item => item.type === "student");
    const supervisorData = progressData.filter(item => item.type === "supervisor");
    
    const totalProjects = studentData.length;
    const completedProjects = studentData.filter(p => 
      p.status?.toLowerCase().includes("completed") || 
      p.status?.toLowerCase().includes("up-to-date")
    ).length;
    const inProgressProjects = studentData.filter(p => 
      p.status?.toLowerCase().includes("in-progress") || 
      p.status?.toLowerCase().includes("active")
    ).length;
    const behindProjects = studentData.filter(p => 
      p.status?.toLowerCase().includes("behind") || 
      p.status?.toLowerCase().includes("delayed")
    ).length;
    
    const avgProgress = totalProjects > 0
      ? Math.round(studentData.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / totalProjects)
      : 0;
    
    const totalSupervisors = supervisorData.length;
    const activeSupervisors = supervisorData.filter(s => 
      s.status?.toLowerCase().includes("active")
    ).length;
    
    const avgResponseRate = totalSupervisors > 0
      ? Math.round(supervisorData.reduce((sum, s) => sum + (s.responseRate || 0), 0) / totalSupervisors)
      : 0;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      behindProjects,
      avgProgress,
      totalSupervisors,
      activeSupervisors,
      avgResponseRate
    };
  }, [progressData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = progressData.filter(item => {
      // Type filter
      if (filter === "students" && item.type !== "student") return false;
      if (filter === "supervisors" && item.type !== "supervisor") return false;
      
      // Status filter
      if (statusFilter !== "all") {
        const itemStatus = (item.status || "").toLowerCase();
        if (statusFilter === "completed" && !itemStatus.includes("completed") && !itemStatus.includes("up-to-date")) return false;
        if (statusFilter === "in-progress" && !itemStatus.includes("in-progress") && !itemStatus.includes("active") && !itemStatus.includes("started")) return false;
        if (statusFilter === "behind" && !itemStatus.includes("behind") && !itemStatus.includes("delayed")) return false;
        if (statusFilter === "not-started" && !itemStatus.includes("not-started")) return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          item.projectTitle,
          item.groupName,
          item.supervisorName,
          item.supervisorEmail,
          ...(item.memberNames || [])
        ].join(" ").toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return (b.progressPercentage || 0) - (a.progressPercentage || 0);
        case "name":
          const nameA = (a.projectTitle || a.supervisorName || "").toLowerCase();
          const nameB = (b.projectTitle || b.supervisorName || "").toLowerCase();
          return nameA.localeCompare(nameB);
        case "recent":
        default:
          const dateA = new Date(a.lastActivity || 0);
          const dateB = new Date(b.lastActivity || 0);
          return dateB - dateA;
      }
    });

    return filtered;
  }, [progressData, filter, statusFilter, searchQuery, sortBy]);

  const studentData = filteredAndSortedData.filter(item => item.type === "student");
  const supervisorData = filteredAndSortedData.filter(item => item.type === "supervisor");

  return (
    <div className="monitor-progress-page">
      {NotificationComponent}
      
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Monitor Progress</h1>
            <p>Track student and supervisor activity and progress.</p>
          </div>
          <button className="refresh-btn" onClick={handleRefresh} title="Refresh Data">
            <span className="refresh-icon">↻</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="statistics-dashboard">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{statistics.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{statistics.completedProjects}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{statistics.inProgressProjects}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{statistics.behindProjects}</h3>
            <p>Behind Schedule</p>
          </div>
        </div>
        <div className="stat-card stat-secondary">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{statistics.avgProgress}%</h3>
            <p>Avg Progress</p>
          </div>
        </div>
        <div className="stat-card stat-accent">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{statistics.totalSupervisors}</h3>
            <p>Supervisors</p>
          </div>
        </div>
        <div className="stat-card stat-info-light">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{statistics.activeSupervisors}</h3>
            <p>Active Supervisors</p>
          </div>
        </div>
        <div className="stat-card stat-success-light">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{statistics.avgResponseRate}%</h3>
            <p>Avg Response Rate</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="progress-filter">Type:</label>
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

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="behind">Behind Schedule</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort by:</label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recent">Most Recent</option>
            <option value="progress">Progress %</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <div className="search-group">
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search projects, groups, supervisors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading progress data...</p>
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>
            {searchQuery || statusFilter !== "all" 
              ? "No results found matching your filters. Try adjusting your search criteria."
              : "No progress data available at this time."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="progress-content">
          {(filter === "all" || filter === "students") && studentData.length > 0 && (
            <div className="progress-section">
              <div className="section-header">
                <h2>Student Progress</h2>
                <span className="section-count">{studentData.length} {studentData.length === 1 ? 'Project' : 'Projects'}</span>
              </div>
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
              <div className="section-header">
                <h2>Supervisor Activity</h2>
                <span className="section-count">{supervisorData.length} {supervisorData.length === 1 ? 'Supervisor' : 'Supervisors'}</span>
              </div>
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
