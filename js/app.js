import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
} from "./api/weather.js";
import {
  getUserLocation,
  validateCityInput,
  saveRecentCity,
} from "./utils/helpers.js";
import {
  showState,
  renderCurrentWeather,
  renderForecast,
  updateTemperatureDisplay,
  setErrorMessage,
  renderRecentCities,
} from "./ui/render.js";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const emptyLocationBtn = document.getElementById("emptyLocationBtn");
const retryBtn = document.getElementById("retryBtn");
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");
const recentList = document.getElementById("recentList");

let currentData = null;
let forecastData = null;
let tempUnit = "C";
let lastRequest = null;

async function fetchWeatherPair({ byCity, city, lat, lon }) {
  if (byCity) {
    return Promise.all([
      fetchWeatherByCity(city),
      fetchForecastByCity(city),
    ]);
  }

  return Promise.all([
    fetchWeatherByCoords(lat, lon),
    fetchForecastByCoords(lat, lon),
  ]);
}

async function loadWeatherData(request) {
  lastRequest = request;
  showState("loading");

  try {
    const [current, forecast] = await fetchWeatherPair(request);

    currentData = current;
    forecastData = forecast;

    if (request.byCity) {
      saveRecentCity(current.name);
      renderRecentCities();
    }

    renderCurrentWeather(currentData, tempUnit);
    renderForecast(forecastData, tempUnit);
    showState("success");
  } catch (error) {
    setErrorMessage(error.message || "Unable to fetch weather data.");
    showState("error");
  }
}

async function handleCitySearch() {
  const city = validateCityInput(searchInput.value);

  if (!city) {
    setErrorMessage("Enter a valid city name (at least 2 characters).");
    showState("error");
    return;
  }

  await loadWeatherData({ byCity: true, city });
}

async function handleLocationDetect() {
  try {
    const { latitude, longitude } = await getUserLocation();
    await loadWeatherData({ byCity: false, lat: latitude, lon: longitude });
  } catch (error) {
    setErrorMessage(error.message);
    showState("error");
  }
}

function setTempUnit(unit) {
  tempUnit = unit;
  celsiusBtn.classList.toggle("active", unit === "C");
  fahrenheitBtn.classList.toggle("active", unit === "F");

  if (currentData && forecastData) {
    updateTemperatureDisplay(currentData, forecastData, tempUnit);
  }
}

searchBtn.addEventListener("click", handleCitySearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleCitySearch();
});

locationBtn.addEventListener("click", handleLocationDetect);
emptyLocationBtn.addEventListener("click", handleLocationDetect);

retryBtn.addEventListener("click", () => {
  if (lastRequest) loadWeatherData(lastRequest);
  else showState("empty");
});

celsiusBtn.addEventListener("click", () => setTempUnit("C"));
fahrenheitBtn.addEventListener("click", () => setTempUnit("F"));

recentList.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-city]");
  if (!chip) return;

  const city = chip.dataset.city;
  searchInput.value = city;
  loadWeatherData({ byCity: true, city });
});

renderRecentCities();
showState("empty");
