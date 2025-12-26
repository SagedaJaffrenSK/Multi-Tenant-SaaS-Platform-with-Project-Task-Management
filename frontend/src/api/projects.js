const API = "http://localhost:5000/api";

const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getProjects = async (params = "") => {
  const res = await fetch(`${API}/projects${params}`, { headers: auth() });
  return res.json();
};

export const createProject = async (data) => {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProject = async (id, data) => {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "DELETE",
    headers: auth(),
  });
  return res.json();
};
