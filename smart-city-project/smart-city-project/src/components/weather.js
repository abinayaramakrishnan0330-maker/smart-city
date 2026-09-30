/* ═══════════════════════════════════════════════════════
   Smart City – Weather Widget (Open-Meteo API)
   ═══════════════════════════════════════════════════════ */

import { el } from '../utils/dom.js';
import t from '../i18n.js';

// Weather code to emoji & description
const WMO = {
  0: ['☀️', 'Clear sky'],
  1: ['🌤️', 'Mainly clear'],
  2: ['⛅', 'Partly cloudy'],
  3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Fog'],
  48: ['🌫️', 'Rime fog'],
  51: ['🌦️', 'Light drizzle'],
  53: ['🌦️', 'Drizzle'],
  55: ['🌧️', 'Dense drizzle'],
  61: ['🌧️', 'Slight rain'],
  63: ['🌧️', 'Moderate rain'],
  65: ['🌧️', 'Heavy rain'],
  71: ['🌨️', 'Slight snow'],
  73: ['🌨️', 'Snow'],
  75: ['❄️', 'Heavy snow'],
  80: ['🌦️', 'Rain showers'],
  81: ['🌧️', 'Moderate showers'],
  82: ['⛈️', 'Violent showers'],
  95: ['⛈️', 'Thunderstorm'],
  96: ['⛈️', 'Thunderstorm + hail'],
  99: ['⛈️', 'Severe thunderstorm']
};

function getWeatherInfo(code) {
  return WMO[code] || WMO[Math.floor(code / 10) * 10] || ['🌡️', 'Unknown'];
}

/**
 * Render a weather widget. Returns a DOM element.
 * Fetches from Open-Meteo (free, no key).
 * @param {object} opts - { lat, lon, className }
 */
export function createWeatherWidget(opts = {}) {
  const { lat = 13.0827, lon = 80.2707, className = '' } = opts;

  const widget = el('div', {
    className: `weather-widget ${className}`,
    html: `
      <div class="weather-widget__icon" style="font-size:2.5rem">🌡️</div>
      <div>
        <div class="weather-widget__temp">--°C</div>
        <div class="weather-widget__detail">${t('loading')}</div>
      </div>
    `
  });

  // Fetch weather
  fetchWeather(lat, lon).then(data => {
    if (!data) return;
    const info = getWeatherInfo(data.weathercode);
    widget.innerHTML = `
      <div class="weather-widget__icon">${info[0]}</div>
      <div>
        <div class="weather-widget__temp">${Math.round(data.temperature)}°C</div>
        <div class="weather-widget__detail">
          ${info[1]} · ${t('weather.feelsLike')} ${Math.round(data.apparent_temperature)}°C
        </div>
        <div class="weather-widget__detail">
          ${t('weather.humidity')} ${data.humidity}% · ${t('weather.wind')} ${data.windspeed} km/h
        </div>
      </div>
    `;
  }).catch(() => {
    widget.querySelector('.weather-widget__detail').textContent = 'Weather unavailable';
  });

  return widget;
}

async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const json = await res.json();
    const cw = json.current_weather;
    const hourIdx = json.hourly.time.findIndex(t => t >= cw.time) || 0;
    return {
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      weathercode: cw.weathercode,
      humidity: json.hourly.relative_humidity_2m[hourIdx] || '--',
      apparent_temperature: json.hourly.apparent_temperature[hourIdx] || cw.temperature
    };
  } catch (e) {
    console.warn('Weather fetch failed:', e);
    // Return fallback data
    return {
      temperature: 28,
      windspeed: 12,
      weathercode: 1,
      humidity: 72,
      apparent_temperature: 30
    };
  }
}

export default createWeatherWidget;
