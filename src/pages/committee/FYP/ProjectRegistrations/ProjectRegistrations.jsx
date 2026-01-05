import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { useNotification } from "../../../../hooks/useNotification.jsx";
import ConfirmationModal from "../../../../components/ConfirmationModal/ConfirmationModal";
import InputModal from "../../../../components/InputModal/InputModal";
import "./ProjectRegistrations.css";

const ProjectRegistrations = () => {
  const [projectRegistrations, setProjectRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSupervisorEmail, setSelectedSupervisorEmail] = useState("");
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [projectToProcess, setProjectToProcess] = useState(null);
  const { showSuccess, showError, NotificationComponent } = useNotification();

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
    fetchProjectRegistrations();
    fetchAvailableSupervisors();
  }, []);

  const fetchProjectRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/projects/registrations");
      setProjectRegistrations(res.data || []);
    } catch (error) {
      console.error("Error fetching project registrations:", error);
      setProjectRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSupervisors = async () => {
    try {
      const res = await api.get("/admin/supervisors/available");
      setAvailableSupervisors(res.data || []);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      setAvailableSupervisors([]);
    }
  };

  const handleAssignSupervisor = async () => {
    if (!selectedProject || !selectedSupervisorEmail) {
      showError("Please select a supervisor");
      return;
    }

    if (!currentUserId) {
      showError("User session not found. Please log in again.");
      return;
    }

    try {
      await api.post("/admin/projects/assign-supervisor", {
        projectId: selectedProject.id,
        supervisorEmail: selectedSupervisorEmail,
        committeeId: currentUserId
      });
      showSuccess("Supervisor assigned successfully!");
      setShowAssignModal(false);
      setSelectedSupervisorEmail("");
      setSelectedProject(null);
      fetchProjectRegistrations();
    } catch (error) {
      console.error("Error assigning supervisor:", error);
      showError("Failed to assign supervisor. Please try again.");
    }
  };

  const handleAcceptProject = (projectId) => {
    setProjectToProcess(projectId);
    setShowConfirmAccept(true);
  };

  const confirmAcceptProject = async () => {
    if (!projectToProcess) return;
    setShowConfirmAccept(false);
    
    try {
      await api.post("/admin/projects/accept", {
        projectId: projectToProcess
      });
      showSuccess("Project registration accepted!");
      setProjectToProcess(null);
      fetchProjectRegistrations();
    } catch (error) {
      console.error("Error accepting project:", error);
      showError("Failed to accept project. Please try again.");
      setProjectToProcess(null);
    }
  };

  const handleRejectProject = (projectId) => {
    setProjectToProcess(projectId);
    setShowRejectModal(true);
  };

  const confirmRejectProject = async (reason) => {
    if (!projectToProcess || !reason) {
      showError("Rejection reason is required");
      return;
    }
    setShowRejectModal(false);

    try {
      await api.post("/admin/projects/reject", {
        projectId: projectToProcess,
        reason: reason.trim()
      });
      showSuccess("Project registration rejected!");
      setProjectToProcess(null);
      fetchProjectRegistrations();
    } catch (error) {
      console.error("Error rejecting project:", error);
      showError("Failed to reject project. Please try again.");
      setProjectToProcess(null);
    }
  };

  const handleApproveProject = (projectId) => {
    setProjectToProcess(projectId);
    setShowConfirmApprove(true);
  };

  const confirmApproveProject = async () => {
    if (!projectToProcess) return;
    setShowConfirmApprove(false);

    try {
      await api.post("/admin/projects/approve", {
        projectId: projectToProcess
      });
      showSuccess("Project approved successfully!");
      setProjectToProcess(null);
      fetchProjectRegistrations();
    } catch (error) {
      console.error("Error approving project:", error);
      showError("Failed to approve project. Please try again.");
      setProjectToProcess(null);
    }
  };

  const openAssignModal = (project) => {
    setSelectedProject(project);
    setShowAssignModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#fff3cd", color: "#856404" };
      case "accepted":
        return { bg: "#d1ecf1", color: "#0c5460" };
      case "rejected":
        return { bg: "#f8d7da", color: "#721c24" };
      case "approved":
        return { bg: "#d4edda", color: "#155724" };
      default:
        return { bg: "#e9ecef", color: "#495057" };
    }
  };

  return (
    <div className="project-registrations-page">
      {NotificationComponent}
      
      <ConfirmationModal
        isOpen={showConfirmAccept}
        onClose={() => {
          setShowConfirmAccept(false);
          setProjectToProcess(null);
        }}
        onConfirm={confirmAcceptProject}
        title="Accept Project Registration"
        message="Are you sure you want to accept this project registration?"
        confirmText="Accept"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showConfirmApprove}
        onClose={() => {
          setShowConfirmApprove(false);
          setProjectToProcess(null);
        }}
        onConfirm={confirmApproveProject}
        title="Approve Project"
        message="Are you sure you want to approve this project? This will finalize the supervisor assignment."
        confirmText="Approve"
        cancelText="Cancel"
        type="warning"
      />

      <InputModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setProjectToProcess(null);
        }}
        onConfirm={confirmRejectProject}
        title="Reject Project Registration"
        message="Please provide a reason for rejection:"
        placeholder="Enter rejection reason..."
        confirmText="Reject"
        cancelText="Cancel"
        required={true}
      />
      <h1>Project Registrations</h1>
      <p>Review and manage project registrations submitted by student groups.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading project registrations...</p>
        </div>
      ) : projectRegistrations.length === 0 ? (
        <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
          <p style={{ margin: 0, color: "#856404" }}>
            No project registrations found.
          </p>
        </div>
      ) : (
        <div className="projects-list">
          {projectRegistrations.map((project) => {
            const statusStyle = getStatusColor(project.status);
            return (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h2>{project.title}</h2>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: statusStyle.bg, 
                      color: statusStyle.color,
                      padding: "5px 15px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}
                  >
                    {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || "Unknown"}
                  </span>
                </div>

                <div className="project-section">
                  <h3>Abstract</h3>
                  <p className="abstract-text">{project.abstractText}</p>
                </div>

                <div className="project-section">
                  <h3>Group Members</h3>
                  {project.groupMembers && project.groupMembers.length > 0 ? (
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
                        {project.groupMembers.map((member, idx) => (
                          <tr key={idx}>
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
                    <p>No group members found.</p>
                  )}
                </div>

                <div className="project-section">
                  <h3>Supervisor Preferences</h3>
                  {project.supervisorPreferences && project.supervisorPreferences.length > 0 ? (
                    <ol className="preferences-list">
                      {project.supervisorPreferences
                        .sort((a, b) => a.preferenceOrder - b.preferenceOrder)
                        .map((pref, idx) => (
                          <li key={idx} className="preference-item">
                            <strong>
                              {pref.preferenceOrder === 1 ? "1st" : 
                               pref.preferenceOrder === 2 ? "2nd" : "3rd"} Preference:
                            </strong>{" "}
                            {pref.supervisorName} ({pref.supervisorEmail})
                          </li>
                        ))}
                    </ol>
                  ) : (
                    <p>No supervisor preferences specified.</p>
                  )}
                </div>

           

                {project.rejectionReason && (
                  <div className="project-section rejection-reason">
                    <h3>Rejection Reason</h3>
                    <p style={{ color: "#721c24" }}>{project.rejectionReason}</p>
                  </div>
                )}

                <div className="project-actions">
                  {(project.status || "").toLowerCase() === "pending" && (
                    <>
                      <button 
                        className="btn btn-accept"
                        onClick={() => handleAcceptProject(project.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn btn-reject"
                        onClick={() => handleRejectProject(project.id)}
                      >
                        Reject
                      </button>
                      <button 
                        className="btn btn-assign"
                        onClick={() => openAssignModal(project)}
                      >
                        Assign Supervisor 
                      </button>
                    </>
                  )}
                  {(project.status || "").toLowerCase() === "accepted" && project.assignedSupervisor && (
                    <button 
                      className="btn btn-approve"
                      onClick={() => handleApproveProject(project.id)}
                    >
                      Approve (Finalize)
                    </button>
                  )}
                  {(project.status || "").toLowerCase() === "accepted" && !project.assignedSupervisor && (
                    <button 
                      className="btn btn-assign"
                      onClick={() => openAssignModal(project)}
                    >
                      Assign Supervisor
                    </button>
                  )}
                  {(project.status || "").toLowerCase() === "approved" && (
                    project.assignedSupervisor ? (
                      <div className="approved-supervisor-info">
                        <strong>Assigned Supervisor:</strong> {project.assignedSupervisor.name} ({project.assignedSupervisor.email})
                      </div>
                    ) : (
                      <div className="approved-supervisor-info">
                        <strong>Status:</strong> Project is approved. Supervisor information is being loaded...
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Supervisor Modal */}
      {showAssignModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Supervisor</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Project:</strong> {selectedProject.title}</p>
              
              <div style={{ marginTop: "20px" }}>
                <label htmlFor="supervisor-select">
                  <strong>Select Supervisor:</strong>
                </label>
                <select
                  id="supervisor-select"
                  value={selectedSupervisorEmail}
                  onChange={(e) => setSelectedSupervisorEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px"
                  }}
                >
                  <option value="">-- Select a supervisor --</option>
                  {availableSupervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.email}>
                      {supervisor.name} ({supervisor.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject.supervisorPreferences && selectedProject.supervisorPreferences.length > 0 && (
                <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                  <strong>Group's Supervisor Preferences:</strong>
                  <ol style={{ marginTop: "10px" }}>
                    {selectedProject.supervisorPreferences
                      .sort((a, b) => a.preferenceOrder - b.preferenceOrder)
                      .map((pref, idx) => (
                        <li key={idx} style={{ marginBottom: "5px" }}>
                          {pref.preferenceOrder === 1 ? "1st" : 
                           pref.preferenceOrder === 2 ? "2nd" : "3rd"}: {pref.supervisorName}
                        </li>
                      ))}
                  </ol>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-assign"
                onClick={handleAssignSupervisor}
                disabled={!selectedSupervisorEmail}
              >
                Assign Supervisor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRegistrations;

