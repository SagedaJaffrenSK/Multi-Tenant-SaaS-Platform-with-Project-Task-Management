const API_URL = "http://localhost:8000/api/auth"; // Added /auth here

export async function registerTenant(data) {
  // Now calls http://localhost:8000/api/auth/register-tenant
  const res = await fetch(`${API_URL}/register-tenant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw result;
  return result;
}

export async function loginUser(data) {
  // Now calls http://localhost:8000/api/auth/login
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw result;
  return result;
}