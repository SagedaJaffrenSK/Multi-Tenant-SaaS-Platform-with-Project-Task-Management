const API_URL = "http://localhost:8000/api";

export const login = async (email, password, tenantSlug) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tenantSlug })
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};