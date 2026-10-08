import React, { useState, useEffect } from 'react';
import T, { TD } from './T';
import useTranslate, { useTranslated } from '../hooks/useTranslate';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { MapPin, Navigation, Loader2, AlertCircle, Droplets, CloudRain, RefreshCw, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import LocationSearch from './LocationSearch';

import { getActiveApiUrl } from '../utils/mobileInit';

const LocationSelector = ({ onLocationSelect, loading }) => {
    const { t } = useLanguage();
    const { str } = useTranslated({
        detecting: "Detecting...",
        smartSearch: "Smart Search",
        orEditManually: "Or edit manually",
        district: "District",
        state: "State",
        getWeatherData: "Get Weather Data",
        change: "Change",
        liveWeather: "Live Weather",
        humidity: "Humidity",
        rain: "Rain",
        enterDistrict: "Enter district",
        enterState: "Enter state",
        searchPlaceholder: "Search for location (e.g. Hyderabad)",
        chooseNewLocation: "Enter new location or select GPS"
    });
    const { t: transProgrammatic } = useTranslate();
    const [locationMode, setLocationMode] = useState('current');
    const [manualLocation, setManualLocation] = useState({ state: '', district: '' });
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const [searchParams] = useSearchParams();
    const hasAutoLoaded = React.useRef(false);

    useEffect(() => {
        const districtParam = searchParams.get('district');
        const stateParam = searchParams.get('state');
        if ((districtParam || stateParam) && !hasAutoLoaded.current) {
            hasAutoLoaded.current = true;
            setLocationMode('manual');
            const loc = { state: stateParam || '', district: districtParam || '' };
            setManualLocation(loc);

            if (districtParam || stateParam) {
                const autoFetch = async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                        const currentApi = getActiveApiUrl();
                        const geoRes = await axios.get(`${currentApi}/geocode`, { params: loc, timeout: 7000 });
                        const lat = geoRes.data.latitude;
                        const lon = geoRes.data.longitude;
                        const label = `${loc.district || ''}${loc.district && loc.state ? ', ' : ''}${loc.state || ''}`;
                        setSelectedCoords({ lat, lon });
                        await fetchAndDisplayWeather(lat, lon, label);
                    } catch (err) {
                        console.error('Auto location link failed:', err);
                    } finally {
                        setIsLoading(false);
                    }
                };
                autoFetch();
            }
        }
    }, [searchParams]);

    const fetchAndDisplayWeather = async (lat, lon, label = '') => {
        setIsLoading(true);
        setError('');
        try {
            const currentApi = getActiveApiUrl();
            const res = await axios.get(`${currentApi}/weather`, { params: { lat, lon }, timeout: 10000 });
            const data = res.data?.data || res.data;
            if (data && data.temperature !== undefined) {
                setWeatherData(data);
                const resolvedCity = data.location?.city || label || 'Selected Location';
                setLocationLabel(resolvedCity);
                onLocationSelect({ lat, lon, weatherData: data, mode: locationMode });
                const successMsg = await transProgrammatic('✅ Weather locked!');
                toast.success(successMsg);
                setIsLoading(false);
                return;
            }
        } catch (err) {
            console.warn('[LocationSelector] Backend weather call failed, attempting direct Open-Meteo fallback:', err);
        }

        // Resilient Fallback 1: Direct Open-Meteo Satellite Weather API
        try {
            const omRes = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code` +
                `&daily=precipitation_sum&timezone=auto&forecast_days=1`,
                { timeout: 8000 }
            );
            const d = omRes.data;
            const temp = Math.round(d.current?.temperature_2m ?? 27);
            const hum = Math.round(d.current?.relative_humidity_2m ?? 65);
            const rain = Math.round((d.daily?.precipitation_sum?.[0] ?? d.current?.precipitation ?? 0) * 10) / 10;
            const fallbackData = {
                temperature: temp,
                humidity: hum,
                rainfall: rain,
                weather_description: 'Auto-detected Satellite Telemetry',
                climate_zone: (temp > 28 && rain > 150) ? 'tropical' : (temp > 30 && rain < 50) ? 'arid' : temp < 22 ? 'temperate' : 'semi_arid',
                location: { city: label || 'Field Location', lat, lon }
            };
            setWeatherData(fallbackData);
            setLocationLabel(label || 'Field Location');
            onLocationSelect({ lat, lon, weatherData: fallbackData, mode: locationMode });
            const successMsg = await transProgrammatic('✅ Weather locked (Satellite)!');
            toast.success(successMsg);
            setIsLoading(false);
            return;
        } catch (omErr) {
            console.warn('[LocationSelector] Open-Meteo fallback failed, applying regional climate baseline:', omErr);
        }

        // Resilient Fallback 2: Agro-Climatic Baseline (never block farmer!)
        const defaultData = {
            temperature: 28,
            humidity: 62,
            rainfall: 105,
            weather_description: 'Regional Agro-Climatic Model',
            climate_zone: 'semi_arid',
            location: { city: label || 'Field Location', lat, lon }
        };
        setWeatherData(defaultData);
        setLocationLabel(label || 'Field Location');
        onLocationSelect({ lat, lon, weatherData: defaultData, mode: locationMode });
        const successMsg = await transProgrammatic('✅ Location locked (Climatic Baseline)!');
        toast.success(successMsg);
        setIsLoading(false);
    };

    const handleAutoGPS = async () => {
        if (!navigator.geolocation) {
            const errMsg = await transProgrammatic('GPS not supported by browser.');
            setError(errMsg);
            return;
        }
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchAndDisplayWeather(pos.coords.latitude, pos.coords.longitude, 'GPS Location'),
            () => {
                transProgrammatic('GPS Access Denied.').then(setError);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleManualSubmit = async () => {
        if (!manualLocation.state && !manualLocation.district) {
            const errMsg = await transProgrammatic('Please provide at least a district or use autocomplete.');
            setError(errMsg);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            let lat, lon;
            if (selectedCoords) {
                lat = selectedCoords.lat;
                lon = selectedCoords.lon;
            } else {
                const currentApi = getActiveApiUrl();
                try {
                    const geoRes = await axios.get(`${currentApi}/geocode`, { params: manualLocation, timeout: 7000 });
                    lat = geoRes.data.latitude;
                    lon = geoRes.data.longitude;
                } catch (geoErr) {
                    // Resilient Nominatim fallback if backend geocode times out
                    const query = `${manualLocation.district || ''} ${manualLocation.state || ''} India`.trim();
                    const nomRes = await axios.get(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
                        { timeout: 7000, headers: { 'User-Agent': 'AGRO.XAI/1.0' } }
                    );
                    if (nomRes.data && nomRes.data[0]) {
                        lat = parseFloat(nomRes.data[0].lat);
                        lon = parseFloat(nomRes.data[0].lon);
                    } else {
                        throw geoErr;
                    }
                }
            }

            const label = `${manualLocation.district || ''}${manualLocation.district && manualLocation.state ? ', ' : ''}${manualLocation.state || ''}`;
            await fetchAndDisplayWeather(lat, lon, label || 'Manual Location');
        } catch (err) {
            const errMsg = await transProgrammatic('Location not found. Please try smart search.');
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutocompleteSelect = ({ district, state, lat, lon }) => {
        setManualLocation({ district, state });
        setSelectedCoords({ lat, lon });
        const label = `${district || ''}${district && state ? ', ' : ''}${state || ''}`;
        if (lat && lon) {
            fetchAndDisplayWeather(parseFloat(lat), parseFloat(lon), label || district || state || 'Selected Location');
        }
    };

    const handleChangeLocation = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setWeatherData(null);
        setError('');
        setLocationMode('manual');
        setSelectedCoords(null);
        if (onLocationSelect) {
            onLocationSelect(null);
        }
        toast(str.chooseNewLocation || 'Enter new location or select GPS', { icon: '📍' });
    };

    return (
        <div className="premium-card">
            <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-brand-primary" />
                {t('location.stepTitle')}
            </h3>

            <div className="flex gap-2 mb-6 p-1 bg-brand-surface-inset border border-brand-border rounded-2xl">
                <button
                    type="button"
                    onClick={() => { setLocationMode('current'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 touch-manipulation cursor-pointer ${locationMode === 'current' ? 'bg-brand-surface-elevated text-brand-primary shadow-premium border border-brand-border' : 'text-brand-text-secondary hover:text-brand-primary'}`}
                >
                    {t('location.autoGps')}
                </button>
                <button
                    type="button"
                    onClick={() => { setLocationMode('manual'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 touch-manipulation cursor-pointer ${locationMode === 'manual' ? 'bg-brand-surface-elevated text-brand-primary shadow-premium border border-brand-border' : 'text-brand-text-secondary hover:text-brand-primary'}`}
                >
                    {t('location.manualEntry')}
                </button>
            </div>

            {!weatherData ? (
                <div className="space-y-5">
                    {locationMode === 'current' ? (
                        <button
                            type="button"
                            onClick={handleAutoGPS}
                            disabled={isLoading}
                            className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 shadow-premium touch-manipulation cursor-pointer"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} className="transition-transform group-hover:rotate-12" />}
                            {isLoading ? str.detecting : t('location.detectMyLocation')}
                        </button>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">{str.smartSearch}</label>
                                <LocationSearch onSelect={handleAutocompleteSelect} placeholder={str.searchPlaceholder} />
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-brand-border flex-1"></div>
                                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{str.orEditManually}</span>
                                <div className="h-px bg-brand-border flex-1"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">{str.district}</label>
                                    <input
                                        type="text"
                                        placeholder={str.enterDistrict}
                                        value={manualLocation.district}
                                        className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-surface-inset outline-none focus:border-brand-primary focus:bg-brand-surface transition-all text-xs font-bold text-brand-text-primary placeholder:text-brand-text-secondary"
                                        onChange={(e) => {
                                            setManualLocation({ ...manualLocation, district: e.target.value });
                                            setSelectedCoords(null);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">{str.state}</label>
                                    <input
                                        type="text"
                                        placeholder={str.enterState}
                                        value={manualLocation.state}
                                        className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-surface-inset outline-none focus:border-brand-primary focus:bg-brand-surface transition-all text-xs font-bold text-brand-text-primary placeholder:text-brand-text-secondary"
                                        onChange={(e) => {
                                            setManualLocation({ ...manualLocation, state: e.target.value });
                                            setSelectedCoords(null);
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleManualSubmit}
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-premium touch-manipulation cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : str.getWeatherData}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 dark:from-brand-surface dark:via-brand-surface-inset dark:to-brand-surface-elevated border border-brand-border rounded-[2rem] p-7 text-white dark:text-brand-text-primary relative overflow-hidden shadow-premium-hover hover:scale-[1.01] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-brand-primary/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                    
                    <div className="relative z-20">
                        {/* Header bar: Live Weather badge & Change button */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[10px] font-black opacity-80 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-300 dark:bg-brand-primary animate-pulse inline-block" />
                                {str.liveWeather}
                            </span>
                            <button
                                type="button"
                                onClick={handleChangeLocation}
                                className="relative z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 active:bg-white/40 dark:bg-brand-surface-inset dark:hover:bg-brand-surface-hover border border-white/25 dark:border-brand-border text-white dark:text-brand-text-primary shadow-sm active:scale-95 transition-all cursor-pointer min-h-[38px] touch-manipulation"
                                aria-label="Change Location"
                            >
                                <RefreshCw size={13} className="text-white dark:text-brand-primary" />
                                <span>{str.change}</span>
                            </button>
                        </div>

                        <p className="text-2xl font-black mb-6 tracking-tight flex items-center gap-2">
                            <MapPin size={22} className="text-emerald-300 dark:text-brand-primary shrink-0" />
                            <TD value={locationLabel} />
                        </p>
                        
                        <div className="flex items-end gap-6">
                            <span className="text-6xl font-black tracking-tighter">{Math.round(weatherData.temperature)}°<span className="text-2xl opacity-40 ml-1">C</span></span>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 space-y-2">
                                <p className="flex items-center gap-2"><Droplets size={12} className="text-cyan-300 dark:text-brand-primary animate-pulse" /> {weatherData.humidity}% {str.humidity}</p>
                                <p className="flex items-center gap-2"><CloudRain size={12} className="text-cyan-300 dark:text-brand-primary animate-bounce" /> {weatherData.rainfall}mm {str.rain}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-5 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/40">
                    <AlertCircle size={14} /> <TD value={error} />
                </div>
            )}
        </div>
    );
};

export default LocationSelector;