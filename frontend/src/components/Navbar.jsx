import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const { fullName, role } = user;

  return (
    <nav className="navbar">
      <div className="logo">SaaS Platform</div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>

        {(role === "tenant_admin" || role === "super_admin") && (
          <Link to="/tasks">Tasks</Link>
        )}

        {role === "tenant_admin" && <Link to="/users">Users</Link>}
        {role === "super_admin" && <Link to="/tenants">Tenants</Link>}
      </div>

      <div className="user-menu">
        <span>{fullName} ({role})</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
