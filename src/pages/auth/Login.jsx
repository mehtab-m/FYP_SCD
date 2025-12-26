// src/pages/auth/Login.jsx
import React, { useState } from "react";
import "./Login.css";
import MyLogo from "../../assets/icons/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    password.length > 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation checks
    if (!validateEmail(formData.email)) {
      alert("Invalid email format!");
      return;
    }
    if (!validatePassword(formData.password)) {
      alert("Password must be >8 characters and contain a special character!");
      return;
    }

    try {
      console.log("sending login api");
      if (
        formData.role === "Admin" &&
        formData.email === "fypscd@gmail.com" &&
        formData.password === "fypscd@125"
      ) {
        setUser({
          role: "SuperAdmin",
          name: "Super Admin",
          email: formData.email,
        });
        navigate("/superadmin");
        return;
      }
      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      if (res.data.success) {
        setUser({ role: formData.role, ...res.data.user });
        navigate("/dashboard");
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
      alert("Authentication failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="logo">ProjectSphere — Powering Ideas into Impact</h1>
        <img src={MyLogo} alt="Auth Illustration" className="auth-svg" />
      </div>

      <div className="auth-right">
        <div className="form-box login-mode">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
            />
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
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
