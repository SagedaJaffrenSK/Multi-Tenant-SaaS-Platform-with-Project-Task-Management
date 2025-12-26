import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserModal from "../components/UserModal";
import { getUsers, deleteUser } from "../api/users";
import { getMe } from "../api/dashboard";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const loadUsers = async (tid) => {
    const query = `?search=${search}&role=${role}`;
    const res = await getUsers(tid, query);
    setUsers(res.data.users || []);
  };

  useEffect(() => {
    getMe().then(res => {
      if (res.data.role !== "tenant_admin") return;
      setTenantId(res.data.tenant.id);
      loadUsers(res.data.tenant.id);
    });
  }, [search, role]);

  const handleDelete = async (id) => {
    if (confirm("Delete user?")) {
      await deleteUser(id);
      loadUsers(tenantId);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h2>Users</h2>
          <button onClick={() => setShowModal(true)}>+ Add User</button>
        </div>

        <div className="filters">
          <input
            placeholder="Search by name/email"
            onChange={e => setSearch(e.target.value)}
          />
          <select onChange={e => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="tenant_admin">Tenant Admin</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>
                <td>{new Date(u.createdAt).toDateString()}</td>
                <td>
                  <button onClick={() => {
                    setSelectedUser(u);
                    setShowModal(true);
                  }}>Edit</button>
                  <button onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <UserModal
            tenantId={tenantId}
            user={selectedUser}
            onClose={() => {
              setShowModal(false);
              setSelectedUser(null);
            }}
            onSaved={() => loadUsers(tenantId)}
          />
        )}
      </div>
    </>
  );
}
