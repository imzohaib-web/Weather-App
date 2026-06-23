import { CONFIG } from "../config.js";

function buildUrl(endpoint, params) {
  const url = new URL(`${CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.set("appid", CONFIG.API_KEY);
  url.searchParams.set("units", "metric");
  Object.entries(params).forEach(([key, val]) => url.searchParams.set(key, val));
  return url.toString();
}

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found. Check the spelling and try again.");
    if (response.status === 401) throw new Error("Invalid API key. Update it in js/config.js.");
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  return response.json();
}

export async function fetchWeatherByCity(city) {
  return fetchJSON(buildUrl("weather", { q: city }));
}

export async function fetchWeatherByCoords(lat, lon) {
  return fetchJSON(buildUrl("weather", { lat, lon }));
}

export async function fetchForecastByCity(city) {
  return fetchJSON(buildUrl("forecast", { q: city }));
}

export async function fetchForecastByCoords(lat, lon) {
  return fetchJSON(buildUrl("forecast", { lat, lon }));
}
