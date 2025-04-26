/* Genererad med chatgpt */

import React, { useEffect, useState } from "react";

const AddProjectModal = ({ onClose, onProjectAdded }) => {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    clientId: "",
    userId: "",
    startDate: "",
    endDate: "",
    budget: "",
    statusId: 1
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("https://aw-alpha-webapp.azurewebsites.net/api/clients", {
          headers: { "x-api-key": "OTBlY2ZlMjUtYTk3My00MGNlLTgxOTgtODJjZWYxZWQwZmI2" }
        });
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Kunde inte hämta klienter:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://aw-alpha-webapp.azurewebsites.net/api/users", {
          headers: { "x-api-key": "OTBlY2ZlMjUtYTk3My00MGNlLTgxOTgtODJjZWYxZWQwZmI2" }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Kunde inte hämta användare:", err);
      }
    };

    fetchClients();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("https://aw-alpha-webapp.azurewebsites.net/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "OTBlY2ZlMjUtYTk3My00MGNlLTgxOTgtODJjZWYxZWQwZmI2"
        },
        body: JSON.stringify(form)
      });
  
      if (!res.ok) throw new Error("Misslyckades spara projekt");
  
      const text = await res.text();
      const newProject = text ? JSON.parse(text) : null;
  
      if (newProject) onProjectAdded(newProject);
      onClose();
    } catch (err) {
      console.error("Fel:", err.message);
      alert("Kunde inte spara projektet.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <header className="modal-header">
          <h2>Add Project</h2>
          <button className="btn-close" onClick={onClose}></button>
        </header>

        <main className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input name="projectName" placeholder="Project Name" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <textarea name="description" placeholder="Description" onChange={handleChange} />
            </div>
            <div className="form-group">
              <select name="clientId" onChange={handleChange} required>
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.clientName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select name="userId" onChange={handleChange} required>
                <option value="">Select Project Owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <input type="date" name="startDate" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input type="date" name="endDate" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input type="number" name="budget" placeholder="Budget (SEK)" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <select name="statusId" onChange={handleChange} defaultValue={1} required>
                <option value={3}>Not Started</option>
                <option value={1}>In Progress</option>
                <option value={2}>Completed</option>
              </select>
            </div>

            <button className="btn btn-submit" type="submit">Create Project</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProjectModal;
