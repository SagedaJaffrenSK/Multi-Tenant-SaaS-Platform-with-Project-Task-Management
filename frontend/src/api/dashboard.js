const API_BASE = "http://localhost:5000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects?limit=5`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getMyTasks(userId) {
  const res = await fetch(
    `${API_BASE}/projects?assignedTo=${userId}`,
    { headers: authHeaders() }
  );
  return res.json();
}
