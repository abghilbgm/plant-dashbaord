export const fetchPlantData = async () => {
  try {
    const response = await fetch("http://localhost:5000/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};