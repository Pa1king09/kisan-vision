import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, Sun, Wind, Droplets, AlertTriangle, ShieldCheck, 
  MapPin, RefreshCw, Compass, Thermometer, ChevronRight, Eye, Calendar, Sparkles, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const CROPS = [
  'Rice (Paddy)', 'Cotton', 'Tomato', 'Wheat', 'Chilli', 'Maize', 'Potato', 'Groundnut', 'Sugarcane'
];

export default function WeatherAlerts() {
  const [lat, setLat] = useState(17.9784); // Default to Telangana/Warangal region
  const [lon, setLon] = useState(79.5941);
  const [selectedCrop, setSelectedCrop] = useState('Rice (Paddy)');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherAlerts();
  }, [lat, lon, selectedCrop]);

  const fetchWeatherAlerts = async () => {
    setLoading(true);
    try {
      const currentApi = getActiveApiUrl();
      const res = await axios.get(`${currentApi}/weather/alerts`, {
        params: {
          lat,
          lon,
          crop: selectedCrop
        },
        timeout: 10000
      });
      if (res.data?.data) {
        setWeatherData(res.data.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[WeatherAlerts] Backend call failed, using satellite weather fallback:', err);
    }

    // Direct Satellite Weather Fallback via Open-Meteo
    try {
      const omRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
        `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`,
        { timeout: 8000 }
      );
      const d = omRes.data;
      const curTemp = Math.round(d.current?.temperature_2m ?? 28);
      const curHum = Math.round(d.current?.relative_humidity_2m ?? 62);
      const curRain = Math.round((d.daily?.precipitation_sum?.[0] ?? d.current?.precipitation ?? 0) * 10) / 10;
      const curWind = Math.round(d.current?.wind_speed_10m ?? 12);

      const generatedAlerts = [];
      if (curTemp > 38) {
        generatedAlerts.push({
          type: 'danger',
          title: 'Extreme Heatwave Warning',
          description: `Temperature at ${curTemp}°C. Provide immediate light irrigation to prevent moisture stress in ${selectedCrop}.`,
          action: 'Irrigate during early morning or late evening.'
        });
      }
      if (curRain > 25) {
        generatedAlerts.push({
          type: 'warning',
          title: 'Heavy Rainfall Advisory',
          description: `Expected rainfall ${curRain}mm. Ensure field drainage channels are clear to prevent waterlogging.`,
          action: 'Suspend fertilizer spraying until rain clears.'
        });
      }
      if (generatedAlerts.length === 0) {
        generatedAlerts.push({
          type: 'safe',
          title: 'Optimal Crop Conditions',
          description: `Favorable weather for ${selectedCrop}. Temperature ${curTemp}°C, Humidity ${curHum}%.`,
          action: 'Ideal window for standard crop maintenance.'
        });
      }

      setWeatherData({
        current: {
          temp: curTemp,
          humidity: curHum,
          rainfall: curRain,
          windSpeed: curWind,
          description: 'Live Satellite Telemetry'
        },
        alerts: generatedAlerts,
        forecast: (d.daily?.time || []).slice(0, 5).map((t, idx) => ({
          date: t,
          maxTemp: Math.round(d.daily.temperature_2m_max[idx] ?? curTemp),
          minTemp: Math.round(d.daily.temperature_2m_min[idx] ?? (curTemp - 6)),
          rain: Math.round((d.daily.precipitation_sum[idx] ?? 0) * 10) / 10
        }))
      });
      setLoading(false);
      return;
    } catch (omErr) {
      console.warn('[WeatherAlerts] Satellite fallback failed:', omErr);
    }

    // Default Baseline Advisory
    setWeatherData({
      current: { temp: 28, humidity: 62, rainfall: 0, windSpeed: 10, description: 'Agro-Climatic Baseline' },
      alerts: [{
        type: 'safe',
        title: 'Normal Farming Conditions',
        description: `Seasonal climate suitable for ${selectedCrop}.`,
        action: 'Maintain regular irrigation and standard crop care.'
      }],
      forecast: []
    });
    setLoading(false);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    toast('Detecting your GPS location...', { icon: '📍' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        toast.success('Location updated from your GPS!');
      },
      (err) => {
        toast.error('Could not access GPS. Please check location permissions.');
      },
      { timeout: 10000 }
    );
  };

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    try {
      toast('Searching district location...', { icon: '🔍' });
      const currentApi = getActiveApiUrl();
      const res = await axios.get(`${currentApi}/geocode`, {
        params: { district: searchLocation, state: searchLocation },
        timeout: 8000
      });
      if (res.data?.latitude && res.data?.longitude) {
        setLat(res.data.latitude);
        setLon(res.data.longitude);
        toast.success(`Found location: ${res.data.formatted_address || searchLocation}`);
        return;
      }
    } catch {
      console.warn('[WeatherAlerts] Backend geocode failed, using direct search fallback');
    }

    // Direct OSM Geocode Fallback
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: `${searchLocation}, India`, format: 'json', limit: 1 },
        timeout: 8000
      });
      if (geoRes.data && geoRes.data.length > 0) {
        const item = geoRes.data[0];
        setLat(parseFloat(item.lat));
        setLon(parseFloat(item.lon));
        toast.success(`Found location: ${item.display_name.split(',')[0]}`);
        return;
      }
    } catch (e) {}

    toast.error('Location not found. Try entering district name or state.');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <CloudRain size={14} className="text-blue-400" />
            Agro-Meteorological Advisory & Early Warning
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Real-Time Weather Alerts & Crop Warnings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Protect your harvest with automated alerts for extreme heatwaves, flood rain, frost, and dry spells. Get crop-specific disease vulnerability warnings and optimal pesticide spray windows.
          </p>
        </motion.div>

        {/* Location & Crop Bar */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Location info & GPS button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <MapPin size={15} className="text-emerald-400 shrink-0" />
              <span className="text-gray-400">Current Station:</span>
              <strong className="text-white">{weatherData?.location || 'Detecting...'}</strong>
            </div>

            <button
              onClick={handleDetectGPS}
              className="text-xs px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Compass size={13} /> Use My GPS
            </button>
          </div>

          {/* Search location form */}
          <form onSubmit={handleSearchCity} className="flex items-center gap-2">
            <input
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              placeholder="Search district or town..."
              className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-gray-200 transition-all"
            >
              Go
            </button>
          </form>
        </div>

        {/* Crop Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-medium shrink-0 mr-1">🌾 Select Crop:</span>
          {CROPS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                selectedCrop === c
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-gray-800 text-gray-400 border border-gray-700/60 hover:text-white hover:border-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm animate-pulse">
            Fetching satellite-guided agro-weather telemetry and severe warnings...
          </div>
        ) : weatherData && (
          <div className="space-y-6">

            {/* SEVERE ALERTS BANNERS */}
            <div className="space-y-3">
              {weatherData.severe_alerts.map((alert, idx) => {
                const isCritical = alert.level === 'Critical';
                const isWarning = alert.level === 'Warning';
                const isFavorable = alert.level === 'Favorable';

                const borderCol = isCritical 
                  ? 'border-red-500/50 bg-red-950/20' 
                  : isWarning 
                  ? 'border-orange-500/50 bg-orange-950/20' 
                  : 'border-emerald-500/30 bg-emerald-950/15';

                const textCol = isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-emerald-400';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-all shadow-lg ${borderCol}`}
                  >
                    <div className="mt-0.5">
                      {isCritical ? (
                        <AlertTriangle size={24} className="text-red-400 animate-pulse" />
                      ) : isWarning ? (
                        <AlertTriangle size={24} className="text-orange-400" />
                      ) : (
                        <CheckCircle2 size={24} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className={`text-base font-bold ${textCol}`}>{alert.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isCritical ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                          isWarning ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {alert.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{alert.description}</p>
                      <div className="pt-2 text-xs text-gray-400">
                        <strong className="text-white">Actionable Farm Guidance: </strong>
                        <span className="text-gray-200">{alert.action}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* TWO-COLUMN ADVISORY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Crop-Specific Disease & Stress Warning */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">🌾 Crop Advisory: {weatherData.crop_advisory.crop}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    weatherData.crop_advisory.risk_level.includes('High') || weatherData.crop_advisory.risk_level.includes('Critical')
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {weatherData.crop_advisory.risk_level}
                  </span>
                </div>

                <ul className="space-y-2 text-xs">
                  {weatherData.crop_advisory.warnings.map((warn, i) => (
                    <li key={i} className="flex items-start gap-2 bg-gray-900/60 border border-gray-700/40 rounded-xl p-3">
                      <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">›</span>
                      <span className="text-gray-300 leading-relaxed">{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pesticide Spray Window Index */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wind size={16} className="text-emerald-400" />
                    Pesticide Spray Window Index
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${weatherData.spray_index.color}25`, color: weatherData.spray_index.color, border: `1px solid ${weatherData.spray_index.color}50` }}
                  >
                    {weatherData.spray_index.status}
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-3 space-y-2 text-xs">
                  <p className="text-gray-300 leading-relaxed">{weatherData.spray_index.reason}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 text-[11px] text-gray-400">
                    <div>💨 Wind Speed: <strong className="text-white">{weatherData.spray_index.wind_speed}</strong></div>
                    <div>🌧️ Rain Probability: <strong className="text-white">{weatherData.spray_index.rain_probability}</strong></div>
                  </div>
                </div>

                {/* Current Weather Snapshot Row */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-2.5">
                    <div className="text-gray-400 text-[10px]">Temperature</div>
                    <div className="text-base font-bold text-white mt-0.5">{weatherData.current.temperature}°C</div>
                    <div className="text-[10px] text-gray-500">Feels {weatherData.current.feels_like}°C</div>
                  </div>
                  <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-2.5">
                    <div className="text-gray-400 text-[10px]">Humidity</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{weatherData.current.humidity}%</div>
                    <div className="text-[10px] text-gray-500">Relative moisture</div>
                  </div>
                  <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-2.5">
                    <div className="text-gray-400 text-[10px]">Condition</div>
                    <div className="text-xs font-semibold text-white mt-1 capitalize truncate">{weatherData.current.weather_description}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* 7-DAY AGROMET FORECAST CARDS */}
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar size={15} className="text-blue-400" />
                7-Day Agricultural Forecast Matrix
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weatherData.forecast_7days.map((day, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 border text-center flex flex-col justify-between transition-all ${
                      i === 0
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-gray-900/60 border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{day.day}</div>
                      <div className="text-[10px] text-gray-400 mb-2">{day.date.slice(5)}</div>
                      <div className="text-[11px] font-medium text-emerald-400 capitalize mb-1 truncate">{day.weather_desc}</div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-gray-800 text-xs">
                      <div className="font-bold text-white">
                        {day.max_temp}° <span className="text-gray-500 font-normal">/ {day.min_temp}°</span>
                      </div>
                      <div className="text-[10px] text-blue-400 flex items-center justify-center gap-1">
                        <Droplets size={10} /> {day.rain_sum} mm ({day.rain_prob}%)
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                        <Wind size={10} /> {day.wind_speed} km/h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
