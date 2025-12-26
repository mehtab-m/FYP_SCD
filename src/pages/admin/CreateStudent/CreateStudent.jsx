import React, { useState } from "react";
import api from "../../../api/axios";
import "./CreateStudent.css";

const CreateStudent = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    rollNo: "",
    semester: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: studentData.name,
        email: studentData.email,
        password: "Temp@123",
        semester: Number(studentData.semester),
        roles: ["STUDENT"],
        rollNo: studentData.rollNo,
      };

      await api.post("/admin/users/create", payload);
      setStudentData({ name: "", email: "", rollNo: "", semester: "" });
      setSuccessMessage("Student created successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      let backendMessage = "Failed to create student.";
      if (error.response && error.response.data) {
        backendMessage =
          error.response.data.message ||
          error.response.data.error ||
          JSON.stringify(error.response.data);
      }
      setErrorMessage(backendMessage);
      setSuccessMessage("");
    }
  };

  return (
    <div className="create-student-container">
      <h2>Create New Student</h2>
      <form onSubmit={handleSubmit} className="create-student-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={studentData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={studentData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Roll Number:
          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={studentData.rollNo}
            onChange={handleChange}
          />
        </label>
        <label>
          Semester:
          <input
            type="number"
            name="semester"
            placeholder="Semester"
            value={studentData.semester}
            onChange={handleChange}
          />
        </label>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && <div className="server-error">{errorMessage}</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateStudent;
