import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { getProjects, deleteProject } from "../api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadProjects = async () => {
    const query = `?status=${filter}&search=${search}`;
    const res = await getProjects(query);
    setProjects(res.data.projects || []);
  };

  useEffect(() => {
    loadProjects();
  }, [filter, search]);

  const handleDelete = async (id) => {
    if (confirm("Delete project?")) {
      await deleteProject(id);
      loadProjects();
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h2>Projects</h2>
          <button onClick={() => setShowModal(true)}>+ New Project</button>
        </div>

        <div className="filters">
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <input
            placeholder="Search by name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {projects.length === 0 && <p>No projects found.</p>}

        <div className="grid">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {showModal && (
          <ProjectModal
            onClose={() => setShowModal(false)}
            onSaved={loadProjects}
          />
        )}
      </div>
    </>
  );
}
