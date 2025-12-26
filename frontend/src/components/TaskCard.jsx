export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <strong>{task.title}</strong>
      <span className={`badge ${task.status}`}>{task.status}</span>
      <span className={`badge ${task.priority}`}>{task.priority}</span>
      {task.assignedTo && <span>{task.assignedTo.fullName}</span>}
      <span>{task.dueDate}</span>
    </div>
  );
}
