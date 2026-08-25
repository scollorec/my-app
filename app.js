const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&timezone=Europe%2FLondon&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&forecast_days=8";

const weatherCodes = {
  0: ["Clear sky", "☀", "sunny"], 1: ["Mainly clear", "◌", "sunny"], 2: ["Partly cloudy", "◐", "cloudy"], 3: ["Overcast", "☁", "cloudy"],
  45: ["Foggy", "≋", "cloudy"], 48: ["Rime fog", "≋", "cloudy"], 51: ["Light drizzle", "☂", "rainy"], 53: ["Drizzle", "☂", "rainy"],
  55: ["Heavy drizzle", "☂", "rainy"], 56: ["Freezing drizzle", "☂", "rainy"], 57: ["Heavy freezing drizzle", "☂", "rainy"], 61: ["Slight rain", "☂", "rainy"],
  63: ["Rain", "☂", "rainy"], 65: ["Heavy rain", "☂", "rainy"], 66: ["Freezing rain", "☂", "rainy"], 67: ["Heavy freezing rain", "☂", "rainy"],
  71: ["Light snow", "❄", "snowy"], 73: ["Snowfall", "❄", "snowy"], 75: ["Heavy snow", "❄", "snowy"], 77: ["Snow grains", "❄", "snowy"],
  80: ["Rain showers", "☂", "rainy"], 81: ["Rain showers", "☂", "rainy"], 82: ["Heavy showers", "☂", "rainy"], 85: ["Snow showers", "❄", "snowy"],
  86: ["Heavy snow showers", "❄", "snowy"], 95: ["Thunderstorm", "ϟ", "stormy"], 96: ["Thunderstorm with hail", "ϟ", "stormy"], 99: ["Severe thunderstorm", "ϟ", "stormy"]
};
const $ = (id) => document.getElementById(id);
const safeNumber = (value, fallback = null) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const degrees = (value) => { const number = safeNumber(value); return number === null ? "—" : `${Math.round(number)}°`; };
const percent = (value) => { const number = safeNumber(value); return number === null ? "—" : `${Math.round(number)}%`; };
const condition = (code) => weatherCodes[safeNumber(code)] || ["Unavailable", "◌", "default"];
const londonDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00Z`) : null;
const timeFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "numeric", minute: "2-digit", hour12: false });
const dayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short" });
// Open-Meteo returns timestamp strings in the requested local timezone, without an offset.
const formatTime = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? value.slice(11) : "—";
const dateFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short" });

function setText(id, value) { $(id).textContent = value; }
function windDirection(value) { const degreesValue = safeNumber(value); if (degreesValue === null) return "—"; return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degreesValue / 45) % 8]; }
function updateClock() { setText("local-time", `London time ${new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())}`); }

function renderHourly(hourly, currentTime) {
  const times = Array.isArray(hourly?.time) ? hourly.time : [];
  const first = times.findIndex((time) => time >= currentTime);
  const start = first < 0 ? 0 : first;
  $("hourly-forecast").innerHTML = times.slice(start, start + 24).map((time, index) => {
    const source = start + index, info = condition(hourly.weather_code?.[source]);
    const label = index === 0 ? "Now" : formatTime(time);
    const rain = safeNumber(hourly.precipitation_probability?.[source]);
    return `<article class="hour-card${index === 0 ? " is-now" : ""}"><p class="hour-time">${label}</p><div class="weather-icon hour-icon" aria-hidden="true">${info[1]}</div><p class="hour-temp">${degrees(hourly.temperature_2m?.[source])}</p><p class="hour-rain">${rain === null ? "" : `${Math.round(rain)}% rain`}</p></article>`;
  }).join("") || '<p class="empty-copy">Hourly forecast is unavailable.</p>';
}
function renderDaily(daily) {
  const times = Array.isArray(daily?.time) ? daily.time : [];
  $("daily-forecast").innerHTML = times.slice(0, 7).map((time, index) => {
    const info = condition(daily.weather_code?.[index]), date = londonDate(time);
    const validDate = date && !Number.isNaN(date.getTime());
    return `<article class="day-card${index === 0 ? " is-today" : ""}"><p class="day-name">${index === 0 ? "Today" : validDate ? dayFormat.format(date) : "—"}</p><p class="day-date">${validDate ? dateFormat.format(date) : "—"}</p><div class="weather-icon day-icon" aria-hidden="true">${info[1]}</div><p class="day-condition">${info[0]}</p><p class="day-temperatures">${degrees(daily.temperature_2m_max?.[index])} <span>${degrees(daily.temperature_2m_min?.[index])}</span></p></article>`;
  }).join("") || '<p class="empty-copy">Seven-day forecast is unavailable.</p>';
}
function showError(message) { const status = $("status-message"); status.textContent = message; status.className = "status-message error"; }
function renderWeather(data) {
  const { current = {}, hourly = {}, daily = {} } = data || {};
  const today = 0, info = condition(current.weather_code);
  setText("current-icon", info[1]); setText("current-temperature", degrees(current.temperature_2m)); setText("feels-like", `Feels like ${degrees(current.apparent_temperature)}`);
  setText("condition-summary", `${info[0]} in London right now. A detailed outlook is ready for the day ahead.`); document.body.dataset.weather = info[2];
  setText("today-range", `${degrees(daily.temperature_2m_max?.[today])} / ${degrees(daily.temperature_2m_min?.[today])}`);
  setText("precipitation", percent(daily.precipitation_probability_max?.[today])); setText("humidity", percent(current.relative_humidity_2m));
  const speed = safeNumber(current.wind_speed_10m); setText("wind", speed === null ? "—" : `${Math.round(speed)} km/h`); setText("wind-note", windDirection(current.wind_direction_10m));
  setText("sun-times", `${formatTime(daily.sunrise?.[today])} · ${formatTime(daily.sunset?.[today])}`);
  renderHourly(hourly, current.time || ""); renderDaily(daily); setText("updated-time", `Updated ${current.time ? formatTime(current.time) : "just now"}`);
  const status = $("status-message"); status.textContent = "Weather data loaded."; status.className = "status-message";
}
async function loadWeather() {
  const button = $("refresh-button"); button.disabled = true; button.classList.add("is-loading");
  const status = $("status-message"); status.textContent = "Retrieving London weather…"; status.className = "status-message loading";
  try { const response = await fetch(API_URL, { headers: { Accept: "application/json" } }); if (!response.ok) throw new Error(`API returned ${response.status}`); const data = await response.json(); if (!data?.current || !data?.daily) throw new Error("Incomplete weather data"); renderWeather(data); }
  catch (error) { console.error("Unable to load weather:", error); showError("We couldn’t retrieve the latest weather. Check your connection and try again."); }
  finally { button.disabled = false; button.classList.remove("is-loading"); }
}
$("refresh-button").addEventListener("click", loadWeather); updateClock(); setInterval(updateClock, 60000); loadWeather();
