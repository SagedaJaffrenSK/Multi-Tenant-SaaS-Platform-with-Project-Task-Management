import { useState } from "react";
import { addUser, updateUser } from "../api/users";

export default function UserModal({ tenantId, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    password: "",
    role: user?.role || "user",
    isActive: user?.isActive ?? true,
  });

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) {
      return alert("Required fields missing");
    }

    if (!user && !form.password) {
      return alert("Password required");
    }

    const payload = { ...form };
    if (!payload.password) delete payload.password;

    if (user) {
      await updateUser(user.id, payload);
    } else {
      await addUser(tenantId, payload);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{user ? "Edit User" : "Add User"}</h3>

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          disabled={!!user}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder={user ? "New Password (optional)" : "Password"}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={e => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
