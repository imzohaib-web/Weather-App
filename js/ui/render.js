import {
  formatTemp,
  getDayName,
  formatTime,
  getIconUrl,
  formatWindSpeed,
  getDailyForecasts,
  loadRecentCities,
} from "../utils/helpers.js";

const els = {
  loadingState: document.getElementById("loadingState"),
  errorState: document.getElementById("errorState"),
  emptyState: document.getElementById("emptyState"),
  weatherContent: document.getElementById("weatherContent"),
  errorMessage: document.getElementById("errorMessage"),
  cityName: document.getElementById("cityName"),
  weatherDesc: document.getElementById("weatherDesc"),
  temperature: document.getElementById("temperature"),
  feelsLike: document.getElementById("feelsLike"),
  humidity: document.getElementById("humidity"),
  windSpeed: document.getElementById("windSpeed"),
  lastUpdated: document.getElementById("lastUpdated"),
  weatherIcon: document.getElementById("weatherIcon"),
  forecastList: document.getElementById("forecastList"),
  recentSection: document.getElementById("recentSection"),
  recentList: document.getElementById("recentList"),
};

const STATES = ["loadingState", "errorState", "emptyState", "weatherContent"];

export function showState(state) {
  const targetId = {
    loading: "loadingState",
    error: "errorState",
    empty: "emptyState",
    success: "weatherContent",
  }[state];

  STATES.forEach((id) => {
    els[id]?.toggleAttribute("hidden", id !== targetId);
  });
}

export function renderCurrentWeather(data, unit) {
  const { name, dt, weather, main, wind } = data;
  const [{ description, icon }] = weather;
  const { temp, feels_like, humidity } = main;
  const { speed: windSpeed } = wind;

  els.cityName.textContent = name;
  els.weatherDesc.textContent = description;
  els.temperature.textContent = formatTemp(temp, unit);
  els.feelsLike.textContent = formatTemp(feels_like, unit);
  els.humidity.textContent = `${humidity}%`;
  els.windSpeed.textContent = formatWindSpeed(windSpeed);
  els.lastUpdated.textContent = formatTime(dt);
  els.weatherIcon.src = getIconUrl(icon, "4x");
  els.weatherIcon.alt = description;
}

export function renderForecast(data, unit) {
  const days = getDailyForecasts(data.list);

  els.forecastList.innerHTML = days
    .map((item) => {
      const { dt, weather, main } = item;
      const [{ description, icon }] = weather;
      const { temp_max, temp_min } = main;

      return `
        <div class="forecast-card">
          <span class="forecast-card__day">${getDayName(dt)}</span>
          <img
            class="forecast-card__icon"
            src="${getIconUrl(icon)}"
            alt="${description}"
            loading="lazy"
          />
          <span class="forecast-card__desc">${description}</span>
          <span class="forecast-card__temp-high">${formatTemp(temp_max, unit)}</span>
          <span class="forecast-card__temp-low">${formatTemp(temp_min, unit)}</span>
        </div>
      `;
    })
    .join("");
}

export function updateTemperatureDisplay(currentData, forecastData, unit) {
  renderCurrentWeather(currentData, unit);
  renderForecast(forecastData, unit);
}

export function setErrorMessage(message) {
  els.errorMessage.textContent = message;
}

export function renderRecentCities() {
  const cities = loadRecentCities();

  if (cities.length === 0) {
    els.recentSection.hidden = true;
    return;
  }

  els.recentSection.hidden = false;
  els.recentList.innerHTML = cities
    .map(
      (city) =>
        `<button class="chip" data-city="${city}" aria-label="Search ${city}">${city}</button>`
    )
    .join("");
}
