// src/pages/admin/CreateStudent/CreateStudent.jsx
import React, { useState } from "react";
import axios from "axios";
import "./CreateStudent.css";

const CreateStudent = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    rollNo: "",
    semester: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/create-student", studentData);
      alert("Student created successfully!");
      setStudentData({
        name: "",
        email: "",
        rollNo: "",
        semester: "",
        cgpa: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create student!");
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
            type="text"
            name="semester"
            placeholder="Semester"
            value={studentData.semester}
            onChange={handleChange}
          />
        </label>
        <label>
          CGPA:
          <input
            type="text"
            name="cgpa"
            placeholder="CGPA"
            value={studentData.cgpa}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateStudent;
