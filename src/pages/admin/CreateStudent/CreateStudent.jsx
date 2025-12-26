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

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: studentData.name,
        email: studentData.email,
        password: "Temp@123", // default password
        semester: Number(studentData.semester), // ensure numeric
        roles: ["STUDENT"], // hardcoded role
        rollNo: studentData.rollNo, // include only if backend expects it
      };

      await api.post("/admin/users/create", payload);
      alert("Student created successfully!");
      setStudentData({
        name: "",
        email: "",
        rollNo: "",
        semester: "",
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
            type="number"
            name="semester"
            placeholder="Semester"
            value={studentData.semester}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateStudent;
