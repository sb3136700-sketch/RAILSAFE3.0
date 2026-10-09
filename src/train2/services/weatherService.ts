/**
 * Weather Service for Destination Station
 * Uses standard OpenWeather API when WEATHER_API_KEY is configured.
 * If not configured, gracefully falls back to explicit "Weather data unavailable" state.
 */

export interface WeatherData {
  available: boolean;
  city: string;
  stationCode: string;
  temperature?: number;
  condition?: string;
  icon?: string;
  humidity?: number;
  windKmph?: number;
  todayForecast?: string;
  tomorrowForecast?: string;
  isDemo?: boolean;
  error?: string;
}

export async function getDestinationWeather(
  cityName: string,
  stationCode: string,
  enableDemoFallback: boolean = false
): Promise<WeatherData> {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.WEATHER_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { VITE_WEATHER_API_KEY?: string } }).env?.VITE_WEATHER_API_KEY);

  if (apiKey && apiKey !== 'MY_WEATHER_API_KEY') {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )},IN&units=metric&appid=${apiKey}`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          available: true,
          city: cityName,
          stationCode,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0]?.main || 'Clear',
          humidity: data.main.humidity,
          windKmph: Math.round((data.wind?.speed || 0) * 3.6),
          todayForecast: `${data.weather[0]?.description || 'Clear skies'} · High ${Math.round(
            data.main.temp_max
          )}°C`,
          tomorrowForecast: `Similar conditions · Expected ${Math.round(data.main.temp)}°C`,
          isDemo: false,
        };
      }
    } catch {
      // network failure
    }
  }

  // If demo fallback requested by user
  if (enableDemoFallback) {
    const demoTemperatures: Record<string, { temp: number; cond: string; hum: number }> = {
      delhi: { temp: 31, cond: 'Partly Cloudy', hum: 55 },
      varanasi: { temp: 33, cond: 'Sunny & Clear', hum: 62 },
      mumbai: { temp: 29, cond: 'Humid & Breezy', hum: 78 },
      chennai: { temp: 32, cond: 'Warm Coastal', hum: 75 },
      mysuru: { temp: 26, cond: 'Pleasant & Mild', hum: 65 },
      lucknow: { temp: 30, cond: 'Hazy Sun', hum: 58 },
      ahmedabad: { temp: 34, cond: 'Sunny', hum: 45 },
      coimbatore: { temp: 28, cond: 'Cloudy', hum: 70 },
      bengaluru: { temp: 24, cond: 'Pleasant & Cool', hum: 60 },
    };

    const key = cityName.toLowerCase();
    const matched = demoTemperatures[key] || { temp: 28, cond: 'Pleasant', hum: 65 };

    return {
      available: true,
      city: cityName,
      stationCode,
      temperature: matched.temp,
      condition: matched.cond,
      humidity: matched.hum,
      windKmph: 12,
      todayForecast: `Today: ${matched.cond}, Max ${matched.temp + 2}°C`,
      tomorrowForecast: `Tomorrow: Mild scattered clouds, Expected ${matched.temp}°C`,
      isDemo: true,
    };
  }

  // Strictly compliant: If no API is configured, show unavailable
  return {
    available: false,
    city: cityName,
    stationCode,
    error: 'Weather data unavailable (WEATHER_API_KEY not configured)',
  };
}
