import { useState } from "react";
import { createTask } from "../api/tasks";

export default function TaskModal({ projectId, onClose, onSaved }) {
  const [form, setForm] = useState({ title: "", priority: "medium" });

  const handleSubmit = async () => {
    if (!form.title) return alert("Title required");
    await createTask(projectId, form);
    onSaved();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Add Task</h3>

        <input
          placeholder="Task title"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <select
          onChange={e => setForm({ ...form, priority: e.target.value })}
        >
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
