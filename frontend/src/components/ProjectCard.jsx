import { Link } from "react-router-dom";

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="card">
      <h3>{project.name}</h3>
      <p>{project.description?.slice(0, 80)}</p>
      <span className={`badge ${project.status}`}>{project.status}</span>

      <p>Tasks: {project.taskCount}</p>
      <p>Created: {new Date(project.createdAt).toDateString()}</p>
      <p>By: {project.createdBy.fullName}</p>

      <div className="actions">
        <Link to={`/projects/${project.id}`}>View</Link>
        <button onClick={() => onDelete(project.id)}>Delete</button>
      </div>
    </div>
  );
}
