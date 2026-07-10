const API_BASE = "/api";

export function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, opts = {}) {
  const headers = { ...(opts.headers || {}), ...authHeaders() };
  const response = await fetch(path, { ...opts, headers });
  
  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    window.location.reload();
  }
  
  return response;
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

export const fetchActiveParameters = async () => {
  try {
    const res = await apiFetch(`${API_BASE}/active-parameters`);
    return await res.json(); // { machine_name: [param_name, ...] }
  } catch (error) {
    console.error("API Error (active-parameters):", error);
    return {};
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