// src/functions.js
// Actual implementations of each tool.
// Open-Meteo and frankfurter.app are completely free — no API keys required.

async function get_weather({ city }) {
  // Open-Meteo uses a two-step approach: geocode the city first, then fetch weather.
  // Both APIs are free with no key required.
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoRes  = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results?.length) {
    return { error: `City not found: ${city}` };
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  const weatherRes  = await fetch(weatherUrl);
  const weatherData = await weatherRes.json();
  const current     = weatherData.current;

  return {
    city:        `${name}, ${country}`,
    temperature: `${current.temperature_2m}°C`,
    humidity:    `${current.relative_humidity_2m}%`,
    wind_speed:  `${current.wind_speed_10m} km/h`,
  };
}

function calculate({ expression }) {
  try {
    // Strip anything that is not a number or basic operator before eval.
    // This is not a complete sandbox — use a proper math parser like mathjs
    // in production if expressions come from untrusted users.
    const safe = expression.replace(/[^0-9+\-*/.() %]/g, '');
    if (!safe.trim()) return { error: 'Invalid or empty expression' };

    const result = Function('"use strict"; return (' + safe + ')')();
    return { expression, result };
  } catch {
    return { error: `Could not evaluate: ${expression}` };
  }
}

async function get_exchange_rate({ from, to, amount = 1 }) {
  const url  = `https://api.frankfurter.app/latest?from=${from.toUpperCase()}&to=${to.toUpperCase()}`;
  const res  = await fetch(url);
  const data = await res.json();

  if (data.error) return { error: data.error };

  const rate      = data.rates[to.toUpperCase()];
  if (!rate) return { error: `No rate found for ${from} → ${to}` };

  const converted = parseFloat((amount * rate).toFixed(4));

  return { from: from.toUpperCase(), to: to.toUpperCase(), rate, amount, converted };
}

module.exports = { get_weather, calculate, get_exchange_rate };
