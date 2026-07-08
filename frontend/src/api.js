const API_BASE = "/api";

export function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiFetch(path, opts = {}) {
  const headers = { ...(opts.headers || {}), ...authHeaders() };
  return fetch(path, { ...opts, headers });
}

export const fetchDashboards = async () => {
  try {
    const res = await apiFetch(`${API_BASE}/dashboards`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const fetchDashboardData = async (name, date) => {
  try {
    const res = await apiFetch(`${API_BASE}/dashboard/${name}?date=${date}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const fetchTrend = async (name, date) => {
  try {
    const res = await apiFetch(`${API_BASE}/trend/${name}?date=${date}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};