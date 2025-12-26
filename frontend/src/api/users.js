const API = "http://localhost:5000/api";

const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getUsers = async (tenantId, query = "") => {
  const res = await fetch(
    `${API}/tenants/${tenantId}/users${query}`,
    { headers: auth() }
  );
  return res.json();
};

export const addUser = async (tenantId, data) => {
  const res = await fetch(
    `${API}/tenants/${tenantId}/users`,
    {
      method: "POST",
      headers: auth(),
      body: JSON.stringify(data),
    }
  );
  return res.json();
};

export const updateUser = async (id, data) => {
  const res = await fetch(
    `${API}/users/${id}`,
    {
      method: "PUT",
      headers: auth(),
      body: JSON.stringify(data),
    }
  );
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(
    `${API}/users/${id}`,
    {
      method: "DELETE",
      headers: auth(),
    }
  );
  return res.json();
};
