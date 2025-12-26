import React, { useState } from "react";
import api from "../../../api/axios";
import "./CreateProfessor.css";

const CreateProfessor = () => {
  const [professorData, setProfessorData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProfessorData({ ...professorData, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {
    let tempErrors = {};

    if (!professorData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!professorData.email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(professorData.email)) {
        tempErrors.email = "Invalid email format";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: professorData.name,
        email: professorData.email,
        password: "Temp@123",
        roles: ["PROFESSOR"], // 👈 changed role
      };

      await api.post("/admin/users/create", payload);
      setProfessorData({ name: "", email: "" });
      setSuccessMessage("Professor created successfully!");
      setServerError("");
    } catch (error) {
      console.error(error);
      let backendMessage = "Failed to create professor.";
      if (error.response && error.response.data) {
        backendMessage =
          error.response.data.message ||
          error.response.data.error ||
          JSON.stringify(error.response.data);
      }
      setServerError(backendMessage);
    }
  };

  return (
    <div className="create-professor-container">
      <h2>Create New Professor</h2>
      <form onSubmit={handleSubmit} className="create-professor-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={professorData.name}
            onChange={handleChange}
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={professorData.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {serverError && <div className="server-error">{serverError}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateProfessor;
