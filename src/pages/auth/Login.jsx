// src/pages/auth/Login.jsx
import React, { useState } from "react";
import "./Login.css";
import MyLogo from "../../assets/icons/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (isSignup) {
  //       console.log("sending signup api");
  //       await axios.post("/api/auth/signup", formData);
  //       alert("Signup successful!");
  //     } else {
  //       console.log("sending lgoin pai ");
  //       const res = await axios.post("/api/auth/login", {
  //         email: formData.email,
  //         password: formData.password,
  //         role: formData.role,
  //       });
  //       if (res.data.success) {
  //         setUser({ role: formData.role, ...res.data.user });
  //         navigate("/dashboard");
  //       } else {
  //         alert("Invalid credentials!");
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Authentication failed!");
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // ✅ Fake API response (always success)
    const fakeRes = {
      data: {
        success: true,
        user: { name: formData.name || "Test User", email: formData.email, role: formData.role }
      }
    };
    setUser(fakeRes.data.user);
    navigate("/dashboard");
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
        <div className={`form-box ${isSignup ? "signup-mode" : "login-mode"}`}>
          <h2>{isSignup ? "Signup" : "Login"}</h2>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input"
                value={formData.name}
                onChange={handleChange}
              />
            )}
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
            </select>

            <button type="submit" className="btn">
              {isSignup ? "Create Account" : "Login"}
            </button>
          </form>
          <p className="switch-text">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span
              className="switch-link"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? " Login" : " Signup"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
