import { useState } from "react";
import { registerTenant } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    adminPassword: "",
    confirmPassword: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.adminPassword !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!form.agree) {
      return setError("You must accept terms");
    }

    try {
      setLoading(true);
      await registerTenant(form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Register Organization</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input name="tenantName" placeholder="Organization Name" onChange={handleChange} required />
        <input name="subdomain" placeholder="Subdomain" onChange={handleChange} required />
        <small>{form.subdomain && `${form.subdomain}.yourapp.com`}</small>
        <input type="email" name="adminEmail" placeholder="Admin Email" onChange={handleChange} required />
        <input name="adminFullName" placeholder="Admin Full Name" onChange={handleChange} required />
        <input type="password" name="adminPassword" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <label>
          <input type="checkbox" name="agree" onChange={handleChange} /> I accept Terms
        </label>
        <button disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
