
import React, { useState } from "react";
import axios from "axios";
import "./CreateStudent.css";
import api from "../../../api/axios";

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
    console.log("handleSubmit triggered");
    try {
      console.log("near to createing studnet ");
      console.log(studentData);
      await api.post("/admin/create-student", studentData);
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
      console.log("Try block even not run its first line ");
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
         
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateStudent;
