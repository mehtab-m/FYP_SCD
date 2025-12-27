import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../../api/axios"; // 👈 your axios instance
import "./DocumentManagement.css";

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [newDoc, setNewDoc] = useState({
    name: "",
    committeeMaxMarks: "",
    supervisorMaxMarks: "",
  });

  // 🔹 Load all documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const res = await api.get("/admin/documents");
        setDocuments(res.data);
      } catch (err) {
        setErrorMessage("Failed to load documents");
      }
    };
    loadDocuments();
  }, []);

  // 🔹 Add new document type
  const addDocument = async () => {
    setErrorMessage("");
    if (!newDoc.name || !newDoc.committeeMaxMarks || !newDoc.supervisorMaxMarks) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const res = await api.post("/admin/documents", {
        name: newDoc.name,
        committeeMaxMarks: parseInt(newDoc.committeeMaxMarks),
        supervisorMaxMarks: parseInt(newDoc.supervisorMaxMarks),
      });
      setDocuments([...documents, res.data]);
      setNewDoc({ name: "", committeeMaxMarks: "", supervisorMaxMarks: "" });
    } catch (err) {
      setErrorMessage("Failed to add document");
    }
  };

  // 🔹 Delete document type
  // 🔹 Delete document type
const deleteDocument = async (documentId) => {
  setErrorMessage("");
  try {
    await api.delete(`/admin/documents/${documentId}`);
    setDocuments(documents.filter((doc) => doc.documentId !== documentId));
  } catch (err) {
    setErrorMessage("Failed to delete document");
  }
};
 
 

  return (
    <div className="document-container">
      <h2>Manage FYP Documents</h2>

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      {/* Add New Document */}
      <div className="add-document">
        <h3>Add New Document</h3>
        <input
          type="text"
          placeholder="Document Name (e.g. Class Diagram)"
          value={newDoc.name}
          onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Committee Max Marks"
          value={newDoc.committeeMaxMarks}
          onChange={(e) =>
            setNewDoc({ ...newDoc, committeeMaxMarks: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Supervisor Max Marks"
          value={newDoc.supervisorMaxMarks}
          onChange={(e) =>
            setNewDoc({ ...newDoc, supervisorMaxMarks: e.target.value })
          }
        />
        <button onClick={addDocument}>Add Document</button>
      </div>

      {/* Document List */}
      <div className="document-list">
        <h3>Defined Documents</h3>
        {documents.length === 0 ? (
          <p>No documents defined yet.</p>
        ) : (
          <table className="document-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Committee Max Marks</th>
                <th>Supervisor Max Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.documentId}>
                  <td>{doc.documentName}</td>
                  <td>{doc.committeeMaxMarks}</td>
                  <td>{doc.supervisorMaxMarks}</td>
                  <td>
                  <FaTrash
  className="delete-icon"
  onClick={() => deleteDocument(doc.documentId)}
/>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DocumentManagement;
