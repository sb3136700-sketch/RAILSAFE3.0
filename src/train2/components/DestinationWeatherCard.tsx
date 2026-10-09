import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { getDestinationWeather, WeatherData } from '../services/weatherService';

interface DestinationWeatherCardProps {
  destinationCity: string;
  stationCode: string;
}

export const DestinationWeatherCard: React.FC<DestinationWeatherCardProps> = ({
  destinationCity,
  stationCode,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoAllowed, setDemoAllowed] = useState(true);

  const fetchWeather = async (allowDemo: boolean = demoAllowed) => {
    setLoading(true);
    const data = await getDestinationWeather(destinationCity, stationCode, allowDemo);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(demoAllowed);
  }, [destinationCity, stationCode, demoAllowed]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg neon-glow-cyan">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Destination Weather · {destinationCity}
          </h3>
        </div>
        <button
          onClick={() => fetchWeather(demoAllowed)}
          disabled={loading}
          className="text-slate-400 hover:text-white transition-colors"
          title="Refresh destination weather"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
          <span>Fetching weather for {destinationCity}...</span>
        </div>
      ) : weather && weather.available ? (
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-white font-mono tracking-tight neon-text-cyan">
                {weather.temperature}°C
              </div>
              <div className="text-xs font-semibold text-cyan-300 mt-0.5">
                {weather.condition}
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-end gap-1">
                <Droplets className="h-3 w-3 text-cyan-400" />
                <span>Humidity: <strong className="text-white">{weather.humidity}%</strong></span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Wind className="h-3 w-3 text-cyan-400" />
                <span>Wind: <strong className="text-white">{weather.windKmph} km/h</strong></span>
              </div>
            </div>
          </div>

          {/* Forecasts */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
            <div className="text-slate-300 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Today:</span>
              <span className="font-semibold text-slate-200">{weather.todayForecast}</span>
            </div>
            <div className="text-slate-300 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Tomorrow:</span>
              <span className="font-semibold text-slate-200">{weather.tomorrowForecast}</span>
            </div>
          </div>

          {weather.isDemo && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-amber-400/90 font-medium">
              <span>Estimated / Demo Weather Data</span>
              <button
                onClick={() => setDemoAllowed(false)}
                className="underline hover:text-amber-300"
              >
                Hide demo
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Weather data unavailable</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            Official weather API key is not configured for {destinationCity}.
          </p>
          <button
            onClick={() => {
              setDemoAllowed(true);
              fetchWeather(true);
            }}
            className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium transition-colors"
          >
            Show Estimated Forecast
          </button>
        </div>
      )}
    </div>
  );
};
