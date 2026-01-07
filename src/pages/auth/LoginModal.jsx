// src/pages/auth/LoginModal.jsx
import React, { useState } from "react";
import "./LoginModal.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const LoginModal = ({ setUser, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    password.length > 7 && /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setErrorMessage("Invalid email format!");
      return;
    }
    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be >8 characters and contain a special character!");
      return;
    }

    try {
      if (
        formData.role === "Admin" &&
        formData.email === "fypscd@gmail.com" &&
        formData.password === "fypscd@125"
      ) {
        const userData = {
          role: "SuperAdmin",
          name: "Super Admin",
          email: formData.email,
          id: 0
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        onClose();
        navigate("/superadmin");
        return;
      }

      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (res.data.success) {
        const userData = { role: formData.role, ...res.data.user };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        onClose();
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Authentication failed! Please try again.");
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="login-modal-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="login-modal-form">
          {errorMessage && (
            <div className="error-box">{errorMessage}</div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Evaluation Committee">Evaluation Committee</option>
              <option value="FYP Committee">FYP Committee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-modal-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

