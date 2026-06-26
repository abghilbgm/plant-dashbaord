const API_BASE = "/api";

export const fetchDashboards = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboards`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const fetchDashboardData = async (name, date) => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${name}?date=${date}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const fetchTrend = async (name, date) => {
  try {
    const res = await fetch(`${API_BASE}/trend/${name}?date=${date}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};