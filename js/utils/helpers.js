import { CONFIG } from "../config.js";

export function celsiusToFahrenheit(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(1);
}

export function formatTemp(celsius, unit) {
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${value}°${unit}`;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getDayName(unixSeconds) {
  return DAYS[new Date(unixSeconds * 1000).getDay()];
}

export function formatTime(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getIconUrl(iconCode, size = "2x") {
  return `${CONFIG.ICON_URL}/${iconCode}@${size}.png`;
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => resolve({ latitude, longitude }),
      (error) => {
        const messages = {
          1: "Location access denied. Please allow it in your browser settings.",
          2: "Location unavailable. Check your device's GPS or network.",
          3: "Location request timed out. Please try again.",
        };
        reject(new Error(messages[error.code] || "Could not get your location."));
      },
      { timeout: 10_000 }
    );
  });
}

const STORAGE_KEY = "weathernow_recent";
const MAX_RECENT = 5;

export function loadRecentCities() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRecentCity(city) {
  const recent = loadRecentCities().filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  recent.unshift(city);
  recent.splice(MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
}

export function validateCityInput(input) {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 100) return null;
  return trimmed;
}

export function formatWindSpeed(metersPerSecond) {
  return `${Math.round(metersPerSecond)} m/s`;
}

export function getDailyForecasts(list) {
  const seenDays = new Set();
  const dailyItems = [];

  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();
    const hour = date.getHours();
    const isToday = day === new Date().toDateString();

    if (isToday) continue;

    if (!seenDays.has(day) && hour >= 11 && hour <= 14) {
      seenDays.add(day);
      dailyItems.push(item);
    }

    if (dailyItems.length === 5) break;
  }

  if (dailyItems.length < 4) {
    const fallback = [];
    const seen = new Set();

    for (const item of list) {
      const day = new Date(item.dt * 1000).toDateString();
      const isToday = day === new Date().toDateString();
      if (!isToday && !seen.has(day)) {
        seen.add(day);
        fallback.push(item);
      }
      if (fallback.length === 5) break;
    }

    return fallback;
  }

  return dailyItems;
}
