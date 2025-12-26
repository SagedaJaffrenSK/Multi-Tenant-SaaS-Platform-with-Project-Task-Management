const API = "http://localhost:5000/api";

const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getTasks = async (projectId) => {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    headers: auth(),
  });
  return res.json();
};

export const createTask = async (projectId, data) => {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data),
  });
  return res.json();
};
