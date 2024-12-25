import axios from "axios";

export async function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const response = await axios.get(url);
    const distance = response.data.routes[0].distance;
    return distance / 1000;
  } catch (error) {
    console.error("Error fetching distance:", error);
    throw error;
  }
}
