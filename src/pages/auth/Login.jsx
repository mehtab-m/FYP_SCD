// src/pages/auth/Login.jsx
import React, { useState } from "react";
import "./Login.css";
import MyLogo from "../../assets/icons/logo.png";
const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <h1 className="logo">ProjectSphere — Powering Ideas into Impact</h1>
        <img src={MyLogo} alt="Auth Illustration" className="auth-svg" />
        
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className={`form-box ${isSignup ? "signup-mode" : "login-mode"}`}>
          <h2>{isSignup ? "Signup" : "Login"}</h2>
          <form>
            {isSignup && (
              <input type="text" placeholder="Full Name" className="input" />
            )}
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
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
