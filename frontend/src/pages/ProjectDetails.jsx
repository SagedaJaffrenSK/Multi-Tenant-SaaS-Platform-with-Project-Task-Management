import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { getProjects } from "../api/projects";
import { getTasks } from "../api/tasks";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    getProjects().then(res =>
      setProject(res.data.projects.find(p => p.id === projectId))
    );
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await getTasks(projectId);
    setTasks(res.data.tasks || []);
  };

  return (
    <>
      <Navbar />
      <div className="page">
        {project && (
          <>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <span className={`badge ${project.status}`}>{project.status}</span>
          </>
        )}

        <div className="page-header">
          <h3>Tasks</h3>
          <button onClick={() => setShowTaskModal(true)}>+ Add Task</button>
        </div>

        {tasks.map(t => (
          <TaskCard key={t.id} task={t} />
        ))}

        {showTaskModal && (
          <TaskModal
            projectId={projectId}
            onClose={() => setShowTaskModal(false)}
            onSaved={loadTasks}
          />
        )}
      </div>
    </>
  );
}
