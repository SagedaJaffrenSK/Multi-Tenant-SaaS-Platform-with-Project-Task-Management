import { useState } from "react";
import { createProject, updateProject } from "../api/projects";

export default function ProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
  });

  const handleSubmit = async () => {
    if (!form.name) return alert("Name required");

    if (project) {
      await updateProject(project.id, form);
    } else {
      await createProject(form);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{project ? "Edit Project" : "Create Project"}</h3>

        <input
          placeholder="Project Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
