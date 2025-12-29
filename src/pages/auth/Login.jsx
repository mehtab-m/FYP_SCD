// src/pages/auth/Login.jsx
import React, { useState } from "react";
import "./Login.css";
import MyLogo from "../../assets/icons/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errorMessage, setErrorMessage] = useState(""); // ✅ State for errors
  
const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // clear error when user types
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    password.length > 7 && /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation checks
    if (!validateEmail(formData.email)) {
      setErrorMessage("Invalid email format!");
      return;
    }
    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be >8 characters and contain a special character!");
      return;
    }

    try {
      console.log("sending login api");
      console.log(formData);
      if (
        formData.role === "Admin" &&
        formData.email === "fypscd@gmail.com" &&
        formData.password === "fypscd@125"
      ) {
        const userData = {
          role: "SuperAdmin",
          name: "Super Admin",
          email: formData.email,
          id: 0 // Super admin ID
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
        // Store user in localStorage for access in other components
        localStorage.setItem('user', JSON.stringify(userData));
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
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="logo">ProjectSphere — Powering Ideas into Impact</h1>
        <img src={MyLogo} alt="Auth Illustration" className="auth-svg" />
      </div>

      <div className="auth-right">
        <div className="form-box login-mode">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="error-box">{errorMessage}</div> // ✅ Styled error box
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
           <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="input"
    value={formData.password}
    onChange={handleChange}
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

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

