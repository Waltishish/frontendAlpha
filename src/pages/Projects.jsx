import React, { useEffect, useState } from "react";
import AddProjectModal from "../partials/components/AddProjectModal";
import EditProjectModal from "../partials/components/EditProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://aw-alpha-webapp.azurewebsites.net/api/projects", {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "OTBlY2ZlMjUtYTk3My00MGNlLTgxOTgtODJjZWYxZWQwZmI2",
          },
        });

        if (!res.ok) throw new Error("Kunde inte hämta projekt");

        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.created) - new Date(a.created));
        setProjects(sorted);
      } catch (err) {
        console.error("Fel:", err.message);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = (newProject) => {
    setProjects((prev) => {
      const updated = [newProject, ...prev];
      return updated.sort((a, b) => new Date(b.created) - new Date(a.created));
    });
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects((prev) => {
      const updatedList = prev.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      return updatedList.sort((a, b) => new Date(b.created) - new Date(a.created));
    });
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
    setMenuOpenFor(null);
  };
  const handleDelete = async (projectId) => {
    const confirm = window.confirm("Är du säker på att du vill ta bort projektet?");
    if (!confirm) return;
  
    try {
      const res = await fetch(`https://aw-alpha-webapp.azurewebsites.net/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "OTBlY2ZlMjUtYTk3My00MGNlLTgxOTgtODJjZWYxZWQwZmI2"
        }
      });
  
      if (!res.ok) throw new Error("Kunde inte ta bort projekt");
  
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setMenuOpenFor(null);
    } catch (err) {
      console.error("Fel:", err.message);
      alert("Det gick inte att ta bort projektet.");
    }
  };
  const filteredProjects =
    filter === "completed"
      ? projects.filter((project) => project.status?.statusName === "COMPLETED")
      : projects;

  return (
    <div id="projects">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <button className="btn btn-add" onClick={() => setShowAddModal(true)}>
          <span>Add Project</span>
        </button>
      </div>
      <div className="btn-group" style={{ margin: "1rem 0" }}>
        <button
          className={`btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="project-cards">
        {filteredProjects.length === 0 ? (
          <p>Inga projekt tillgängliga.</p>
        ) : (
          filteredProjects.map((project) => (
            <div className="project-card" key={project.id} style={{ position: "relative" }}>
              <div className="card-header">
                <div className="project-icon">🟦</div>
                <div className="card-main">
                  <div className="card-title-row">
                    <h3 className="project-title">{project.projectName}</h3>
                    <button
                      className="card-menu-button"
                      onClick={() =>
                        setMenuOpenFor(menuOpenFor === project.id ? null : project.id)
                      }
                    >
                      ⋯
                    </button>
                  </div>
                  <p className="project-client">{project.client?.clientName}</p>
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              
              {menuOpenFor === project.id && (
                <div className="card-menu">
                  <button className="card-menu-item" onClick={() => handleEdit(project)}>
                      <span>Edit</span>
                  </button>
                  <button className="card-menu-item delete" onClick={() => handleDelete(project.id)}>
                      <span>Delete Project</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onProjectAdded={handleAddProject}
        />
      )}
      {showEditModal && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onProjectUpdated={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default Projects;

