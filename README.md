# WeatherNow

A responsive weather dashboard built with HTML, CSS, and vanilla JavaScript. Search for a city or use your current location to view live weather conditions and a 5-day forecast.
<img width="1885" height="942" alt="image" src="https://github.com/user-attachments/assets/74b465e4-652c-47bb-9b70-ce7e5ec60b09" />


## Features

- Search weather by city name
- Detect weather from the user's current location
- Display current temperature, condition, feels-like temperature, humidity, wind speed, and last update time
- Show a 5-day forecast with daily high and low temperatures
- Toggle between Celsius and Fahrenheit without making another API request
- Save recent city searches in `localStorage`
- Includes loading, empty, and error states
- Responsive layout for desktop and mobile screens

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript with ES modules
- OpenWeatherMap API
- Browser Geolocation API

## Project Structure

```text
weather-app/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   |-- app.js
|   |-- config.js
|   |-- api/
|   |   `-- weather.js
|   |-- ui/
|   |   `-- render.js
|   `-- utils/
|       `-- helpers.js
`-- README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Add your OpenWeatherMap API key

Create a free API key from [OpenWeatherMap](https://openweathermap.org/api), then copy the example config:

```bash
cp js/config.example.js js/config.js
```

Update `js/config.js` with your API key:

```js
export const CONFIG = {
  API_KEY: "YOUR_API_KEY_HERE",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  ICON_URL: "https://openweathermap.org/img/wn",
};
```

### 3. Run the app locally

Because this project uses JavaScript modules, run it with a local server instead of opening `index.html` directly.

Using Python:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

You can also use the VS Code Live Server extension.


## How It Works

- `app.js` connects the UI events to the weather API and rendering functions.
- `weather.js` handles all OpenWeatherMap API requests.
- `render.js` updates the page for loading, error, empty, and success states.
- `helpers.js` contains reusable utility functions for validation, temperature conversion, geolocation, date formatting, and recent searches.
- `config.js` stores the API base URLs and API key.

