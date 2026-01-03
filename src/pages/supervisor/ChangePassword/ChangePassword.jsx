import React, { useState } from "react";
import api from "../../../api/axios";
import "./ChangePassword.css";

const ChangePassword = ({ supervisorId }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters and contain a special character."
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirm password do not match." });
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage({ type: "error", text: "New password must be different from old password." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/supervisor/change-password", {
        supervisorId: supervisorId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to change password." });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h1>Change Password</h1>
      <p>Update your account password</p>

      <div className="password-form-container">
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password (min 8 chars, 1 special char)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

