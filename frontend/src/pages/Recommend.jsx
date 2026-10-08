import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Loader2, CheckCircle, ChevronDown, Play, Sun, CloudRain, Wheat } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import SoilCardSelector from '../components/SoilCardSelector';
import CropExplanationPanel from '../components/CropExplanationPanel';
import RiskAnalysisCard from '../components/RiskAnalysisCard';
import SoilTestingCard from '../components/SoilTestingCard';
import SoilImprovementCard from '../components/SoilImprovementCard';
import SoilHealthPlanCard from '../components/SoilHealthPlanCard';
import RevenueCard from '../components/RevenueCard';
import FeasibilityCard from '../components/FeasibilityCard';
import GovernmentSchemesCard from '../components/GovernmentSchemesCard';
import GrowingGuideCard from '../components/GrowingGuideCard';
import LabourPlannerCard from '../components/LabourPlannerCard';
import OrganicFarmingCard from '../components/OrganicFarmingCard';
import CropRecommendationCard from '../components/CropRecommendationCard';
import CropComparisonPanel from '../components/CropComparisonPanel';
import ProfitEstimationCard from '../components/ProfitEstimationCard';
import QuickActions from '../components/QuickActions';
import GrowingTimeline from '../components/GrowingTimeline';
import Sidebar from '../components/Sidebar';
import FeaturePanel from '../components/FeaturePanel';
import AIProcessingOverlay from '../components/AIProcessingOverlay';
import T, { TD } from '../components/T';
import { CardSkeleton } from '../components/Skeleton';
import { translateText } from '../utils/translate';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import MagneticButton from '../components/effects/MagneticButton';
import { playSuccessChime } from '../utils/soundFx';

// Demo presets for expo
const DEMO_PRESETS = [
    {
        id: 'dry',
        label: 'Dry Region',
        icon: Sun,
        iconColor: 'text-orange-500',
        color: 'bg-brand-surface border border-brand-border text-brand-text-primary hover:border-orange-200 dark:hover:border-orange-500/30 hover:bg-orange-50/50 dark:hover:bg-orange-500/10 shadow-sm',
        lat: 26.9124, lon: 70.9120,
        soil: 'Sandy',
        weather: { temperature: 38, humidity: 22, rainfall: 15, season: 'Summer', climate_zone: 'Arid', location: { city: 'Jaisalmer' } }
    },
    {
        id: 'wet',
        label: 'High Rainfall',
        icon: CloudRain,
        iconColor: 'text-blue-500',
        color: 'bg-brand-surface border border-brand-border text-brand-text-primary hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 shadow-sm',
        lat: 25.2948, lon: 91.7362,
        soil: 'Loamy',
        weather: { temperature: 22, humidity: 92, rainfall: 280, season: 'Monsoon', climate_zone: 'Tropical', location: { city: 'Cherrapunji' } }
    },
    {
        id: 'fertile',
        label: 'Fertile Plains',
        icon: Wheat,
        iconColor: 'text-emerald-500',
        color: 'bg-brand-surface border border-brand-border text-brand-text-primary hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 shadow-sm',
        lat: 30.9010, lon: 75.8573,
        soil: 'Alluvial',
        weather: { temperature: 28, humidity: 55, rainfall: 100, season: 'Monsoon', climate_zone: 'Semi-Arid', location: { city: 'Ludhiana' } }
    },
];

import { getActiveApiUrl } from '../utils/mobileInit';

const getEndpoint = (path) => {
    const base = getActiveApiUrl().replace(/\/+$/, '');
    const clean = path.replace(/^\/+/, '');
    return `${base}/${clean}`;
};

class TabErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(err) {
        console.error('Tab render error:', err);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-brand-surface border border-brand-border rounded-3xl text-center my-6">
                    <p className="text-sm font-black text-rose-500 mb-2 uppercase">Unable to display this card</p>
                    <p className="text-xs text-brand-text-secondary mb-4">Please reload this section or check your connection.</p>
                    <button 
                        type="button"
                        onClick={() => this.setState({ hasError: false })}
                        className="px-5 py-2.5 bg-brand-primary text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];

// Convert numeric weather values to descriptive levels (same logic as backend)
const toRainfallLevel  = mm  => mm  < 70  ? 'Low' : mm  < 170 ? 'Medium' : 'High';
const toHumidityLevel  = pct => pct < 35  ? 'Low' : pct < 75  ? 'Medium' : 'High';

const Recommend = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const resultsRef = useRef(null);
    const locationRef = useRef(null);
    const soilRef = useRef(null);

    // ── Location & weather ────────────────────────────────────────────────
    const [locationData, setLocationData] = useState(null);   // { lat, lon, weatherData }

    // ── Soil ─────────────────────────────────────────────────────────────
    const [manualSoil,  setManualSoil]  = useState('Loamy');

    // ── Result ───────────────────────────────────────────────────────────
    const [loading,  setLoading]  = useState(false);
    const [result,   setResult]   = useState(null);
    const [error,    setError]    = useState('');
    const [activeTab, setActiveTab] = useState('ai');

    // ── AI Processing Overlay ────────────────────────────────────────────
    const [showProcessing, setShowProcessing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // ── Additional cards ─────────────────────────────────────────────────
    const [riskData,        setRiskData]        = useState(null);
    const [soilTestData,    setSoilTestData]    = useState(null);
    const [improvementData, setImprovementData] = useState(null);
    const [feasibilityData, setFeasibilityData] = useState(null);
    const [schemesData,     setSchemesData]     = useState(null);
    const [growingData,     setGrowingData]     = useState(null);
    const [labourData,      setLabourData]      = useState(null);
    const [organicData,     setOrganicData]     = useState(null);

    const crop       = result?.crop || result?.recommended_crops?.[0]?.crop;
    const confidence = result?.confidence ?? result?.recommended_crops?.[0]?.confidence ?? 0;
    const soilType   = result?.soil_type || manualSoil;
    const weather    = result?.weather || locationData?.weatherData || {};
    const rainfallLevel = toRainfallLevel(weather.rainfall ?? 140);
    const season     = result?.season || weather.season || 'Monsoon';

    const handleLocationSelect = (data) => {
        setLocationData(data);
        setResult(null);
        setError('');
        setShowResults(false);
    };

    const fetchAdditional = async (crop, confidence, soilType, weather) => {
        const rainfallLevel  = toRainfallLevel(weather?.rainfall ?? 140);
        const humidityLevel  = toHumidityLevel(weather?.humidity ?? 60);
        const season         = weather?.season || 'Monsoon';

        const base = { crop, confidence, soil_type: soilType,
                        rainfall_level: rainfallLevel, humidity_level: humidityLevel,
                        season, temperature: weather?.temperature ?? 28 };

        await Promise.allSettled([
            axios.post(getEndpoint('/confidence-risk'),    base).then(r => setRiskData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/soil-test-advice'),   { soil_type: soilType, crop }).then(r => setSoilTestData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/soil-improvement'),   { crop, soil_type: soilType }).then(r => setImprovementData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/feasibility-report'), { crop, soil_type: soilType, season, rainfall_level: rainfallLevel, humidity_level: humidityLevel }).then(r => setFeasibilityData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/government-schemes'), { crop }).then(r => setSchemesData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/growing-guide'),      { crop, season }).then(r => setGrowingData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/labour-requirements'),{ crop, land_area_acres: 1, season }).then(r => setLabourData(r.data.data || r.data)).catch(console.error),
            axios.post(getEndpoint('/organic-farming'),    { crop, soil_type: soilType }).then(r => setOrganicData(r.data.data || r.data)).catch(console.error),
        ]);
    };

    // On-demand fetch if a tab is opened and its data is not loaded yet
    useEffect(() => {
        if (!crop) return;
        const curSeason = result?.season || weather?.season || 'Monsoon';
        const curSoil = result?.soil_type || manualSoil || 'Loamy';
        const curRainfall = toRainfallLevel(weather?.rainfall ?? 140);
        const curHumidity = toHumidityLevel(weather?.humidity ?? 60);

        if (activeTab === 'risk' && !riskData) {
            axios.post(getEndpoint('/confidence-risk'), { crop, confidence, soil_type: curSoil, rainfall_level: curRainfall, humidity_level: curHumidity, season: curSeason, temperature: weather?.temperature ?? 28 })
                .then(r => setRiskData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'soil_test' && !soilTestData) {
            axios.post(getEndpoint('/soil-test-advice'), { soil_type: curSoil, crop })
                .then(r => setSoilTestData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'soil_improve' && !improvementData) {
            axios.post(getEndpoint('/soil-improvement'), { crop, soil_type: curSoil })
                .then(r => setImprovementData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'feasibility' && !feasibilityData) {
            axios.post(getEndpoint('/feasibility-report'), { crop, soil_type: curSoil, season: curSeason, rainfall_level: curRainfall, humidity_level: curHumidity })
                .then(r => setFeasibilityData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'schemes' && !schemesData) {
            axios.post(getEndpoint('/government-schemes'), { crop })
                .then(r => setSchemesData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'guide' && !growingData) {
            axios.post(getEndpoint('/growing-guide'), { crop, season: curSeason })
                .then(r => setGrowingData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'labour' && !labourData) {
            axios.post(getEndpoint('/labour-requirements'), { crop, land_area_acres: 1, season: curSeason })
                .then(r => setLabourData(r.data.data || r.data)).catch(console.error);
        } else if (activeTab === 'organic' && !organicData) {
            axios.post(getEndpoint('/organic-farming'), { crop, soil_type: curSoil })
                .then(r => setOrganicData(r.data.data || r.data)).catch(console.error);
        }
    }, [activeTab, crop]);

    const handleSubmit = async () => {
        if (!locationData) {
            const transError = await translateText('Please select your location first.', language);
            toast.error(transError);
            return;
        }
        setLoading(true);
        setShowProcessing(true);
        setShowResults(false);
        setError('');
        setResult(null);
        setRiskData(null); setSoilTestData(null); setImprovementData(null);
        setFeasibilityData(null); setSchemesData(null);
        setGrowingData(null); setLabourData(null); setOrganicData(null);

        const overlayStart = Date.now();
        const MIN_OVERLAY_MS = 2500; // minimum time to show the overlay

        try {
            const res = await axios.post(getEndpoint('/recommend'), {
                location: { lat: locationData.lat, lon: locationData.lon },
                soil_mode:        'manual',
                manual_soil_type: manualSoil,
            }, { timeout: 120000 });

            const data = res.data.data;
            setResult(data);
            const crop       = data.crop || data.recommended_crops?.[0]?.crop;
            const confidence = data.confidence ?? data.recommended_crops?.[0]?.confidence ?? 0.8;
            const soilType   = data.soil_type || manualSoil;
            const weather    = data.weather || locationData.weatherData || {};
            const transRec = await translateText('Recommended', language);
            const transCrop = await translateText(crop, language);
            toast.success(`🌾 ${transRec}: ${transCrop}!`);

            // Wait for the overlay to show at least MIN_OVERLAY_MS
            const elapsed = Date.now() - overlayStart;
            const remaining = Math.max(0, MIN_OVERLAY_MS - elapsed);
            await new Promise(resolve => setTimeout(resolve, remaining));

            // Dismiss overlay and reveal results
            setLoading(false);
            setShowProcessing(false);
            setShowResults(true);
            playSuccessChime();

            // Scroll to results after a brief render delay
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);

            // Auto-save to MongoDB
            try {
                const farmId = searchParams.get('farmId') || null;
                const farmName = searchParams.get('farmName') || null;
                const userId = user?.id || user?._id || 'guest';
                await axios.post(getEndpoint('/history/save'), {
                    userId,
                    farmId,
                    farmName,
                    location: locationData?.weatherData?.location?.city || 'Unknown',
                    coordinates: { lat: locationData.lat, lon: locationData.lon },
                    soilType,
                    soilMetrics: {
                        nitrogen: data.mapped_values?.N,
                        phosphorus: data.mapped_values?.P,
                        potassium: data.mapped_values?.K,
                        ph: data.mapped_values?.ph
                    },
                    environmentalData: {
                        temperature: weather.temperature,
                        humidity: weather.humidity,
                        rainfall: weather.rainfall,
                        season: data.season || weather.season || 'Monsoon'
                    },
                    predictionResult: {
                        crop,
                        confidence,
                        alternatives: data.recommended_crops || [],
                        aiReasoning: data.explanation || {},
                        mappedValues: data.mapped_values || {},
                    },
                    metadata: {
                        source: farmId ? 'farm-analysis' : 'manual'
                    }
                });
            } catch (saveErr) {
                console.error('Failed to auto-save history:', saveErr);
            }

            await fetchAdditional(crop, confidence, soilType, weather);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Recommendation failed.';
            setError(msg);
            setLoading(false);
            setShowProcessing(false);
            setShowResults(false);
            const transFail = await translateText('Recommendation failed. Check all servers are running.', language);
            toast.error(transFail);
        }
    };

    // Callback when AI overlay finishes its animation (backup path)
    const handleProcessingComplete = useCallback(() => {
        setShowProcessing(false);
        if (result) {
            setShowResults(true);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    }, [result]);

    // Deep Linking: Auto-populate soil types from query params
    useEffect(() => {
        const soilParam = searchParams.get('soil');
        if (soilParam) {
            const matched = SOIL_TYPES.find(s => s.toLowerCase() === soilParam.toLowerCase());
            if (matched) {
                setManualSoil(matched);
            }
        }
    }, [searchParams]);

    // Demo mode: auto-fill and auto-submit
    useEffect(() => {
        const isDemo = searchParams.get('demo') === 'true';
        if (isDemo && !locationData) {
            // Auto-fill with Hyderabad coordinates
            const demoWeather = {
                temperature: 32,
                humidity: 65,
                rainfall: 145,
                season: 'Monsoon',
                climate_zone: 'Tropical Wet-Dry',
                location: { city: 'Hyderabad' }
            };
            const demoLocation = {
                lat: 17.385,
                lon: 78.4867,
                weatherData: demoWeather,
                mode: 'demo'
            };
            setLocationData(demoLocation);
            setManualSoil('Loamy');
        }
    }, [searchParams]);

    // Auto-submit for demo / autorun mode once locationData is set
    const demoTriggered = useRef(false);
    useEffect(() => {
        const isDemo = searchParams.get('demo') === 'true';
        const isAutorun = searchParams.get('autorun') === 'true';
        if ((isDemo || isAutorun) && locationData && !demoTriggered.current && !result) {
            demoTriggered.current = true;
            setTimeout(() => handleSubmit(), 800);
        }
    }, [locationData, searchParams]);

    return (
        <motion.div
            className="bg-brand-bg min-h-screen pt-32 pb-20"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
            {/* AI Processing Overlay */}
            <AIProcessingOverlay
                isActive={showProcessing}
                onComplete={handleProcessingComplete}
            />

            <div className="max-w-5xl mx-auto px-6 md:px-8">

                {/* Page heading */}
                <div className="text-center mb-12 relative">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="badge-ai">
                            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                            <T>AI POWERED</T>
                        </span>
                        <span className="badge-verified">
                            <CheckCircle size={12} />
                            <T>REAL-TIME DATA</T>
                        </span>
                    </div>
                    <T as="h1" className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-gold to-brand-primary animate-gradient-x tracking-tight mb-4 uppercase">
                        PRECISION ANALYSIS
                    </T>
                    <T as="p" className="text-brand-text-secondary font-medium text-base max-w-2xl mx-auto">
                        Find the optimal crop for your field through AI-powered environmental mapping and soil data analysis.
                    </T>
                </div>

                {/* Input grid — Location + Soil */}
                <div ref={locationRef} className="space-y-6 mb-8">
                    {/* Step 1: Location (GPS or manual) */}
                    <LocationSelector onLocationSelect={handleLocationSelect} loading={loading} />

                    {/* Step 2: Photographic Soil Texture Cards */}
                    <div ref={soilRef} className="premium-card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Sprout size={18} className="text-brand-primary" />
                                    <T>Step 2 — Select Soil Type</T>
                                </h3>
                                <p className="text-xs text-brand-text-secondary mt-1">
                                    <T>Macro photographic calibration of soil texture, porosity & water retention parameters.</T>
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                    <T>Selected</T>: <T>{manualSoil} Soil</T>
                                </span>
                            </div>
                        </div>

                        {/* 6 Photographic Tactile Cards */}
                        <SoilCardSelector selectedSoil={manualSoil} onSelectSoil={setManualSoil} />

                        {/* Weather snapshot (if location selected) */}
                        {locationData?.weatherData && (
                            <div className="mt-6 p-5 bg-brand-surface-inset border border-brand-border rounded-2xl">
                                <T as="p" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-4">Environment Snapshot</T>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-brand-text-primary leading-none">{Math.round(locationData.weatherData.temperature)}°</p>
                                        <T as="p" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-tighter">Temp</T>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-brand-text-primary leading-none">{locationData.weatherData.humidity}%</p>
                                        <T as="p" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-tighter">Humidity</T>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-brand-text-primary leading-none">{locationData.weatherData.rainfall}</p>
                                        <T as="p" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-tighter">mm Rain</T>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <div className="w-full mb-4">
                  <MagneticButton className="w-full">
                      <motion.button
                          whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={loading || !locationData}
                          data-submit-btn
                          className="w-full py-5 btn-primary font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group"
                      >
                          {loading
                              ? <><Loader2 className="animate-spin" size={18} /><T>Processing…</T></>
                              : <><Sprout size={18} className="transition-transform group-hover:scale-110" /><T>Get Best Crop Match</T></>
                          }
                      </motion.button>
                  </MagneticButton>
                </div>

                {/* Demo Presets */}
                {!result && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-4"
                    >
                        <p className="text-center text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-3"><T>Quick Demo Presets</T></p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {DEMO_PRESETS.map((preset) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={async () => {
                                            setLocationData({ lat: preset.lat, lon: preset.lon, weatherData: preset.weather, mode: 'demo' });
                                            setManualSoil(preset.soil);
                                            const transLabel = await translateText(preset.label, language);
                                            const transCity = await translateText(preset.weather.location.city, language);
                                            toast(`🎬 ${transLabel} — ${transCity}`, { icon: '✨' });
                                            setTimeout(() => {
                                                document.querySelector('[data-submit-btn]')?.click();
                                            }, 300);
                                        }}
                                        className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border transition-all duration-300 ${preset.color}`}
                                    >
                                        <Icon size={14} className={preset.iconColor} />
                                        <TD value={preset.label} />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-2xl mb-8">
                        ⚠️ <TD value={error} />
                    </div>
                )}

            </div>

            {/* Results Container - Wide Layout */}
            <div ref={resultsRef} className="w-full max-w-[100rem] mx-auto px-4 md:px-8 xl:px-12">
                {/* Results */}
                <AnimatePresence>
                    {result && crop && showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <CropRecommendationCard 
                                crop={crop} 
                                confidence={confidence} 
                                season={season} 
                                result={result} 
                            />

                            {/* Quick Action Buttons */}
                            <QuickActions
                                onRetry={handleSubmit}
                                onScrollToLocation={() => locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                onScrollToSoil={() => soilRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                crop={crop}
                                confidence={confidence}
                                season={season}
                                soilType={soilType}
                                weather={weather}
                                explanation={result?.explanation}
                                mappedValues={result?.mapped_values}
                            />

                            {/* Crop Comparison Panel */}
                            {result?.recommended_crops && result.recommended_crops.length > 1 && (
                                <CropComparisonPanel 
                                    crops={result.recommended_crops} 
                                    contrastiveTradeoffs={result?.contrastive_tradeoffs} 
                                />
                            )}

                            {/* Dashboard Sidebar & Feature Panel */}
                            <div id="recommend-feature-panel" className="flex flex-col md:flex-row gap-6 md:gap-8 mt-8">
                                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                                <TabErrorBoundary key={activeTab}>
                                    <FeaturePanel activeTab={activeTab}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            >
                                                {activeTab === 'ai' && result.explanation && (
                                                    <div id="soil-explanation-panel">
                                                        <CropExplanationPanel
                                                            crop={crop}
                                                            confidence={confidence}
                                                            explanation={result.explanation}
                                                            inputs={{ soil_type: soilType, season, weather }}
                                                            mapped_values={result.mapped_values}
                                                            uncertainty_calibration={result?.uncertainty_calibration}
                                                            contrastive_tradeoffs={result?.contrastive_tradeoffs}
                                                            workflow_summary={result?.workflow_summary}
                                                        />
                                                    </div>
                                                )}
                                                {activeTab === 'risk' && (riskData ? (
                                                    <RiskAnalysisCard 
                                                        riskData={riskData} 
                                                        cropName={crop} 
                                                        soilTestData={soilTestData}
                                                        soilType={soilType}
                                                        setActiveTab={setActiveTab}
                                                    />
                                                ) : <CardSkeleton />)}
                                                {activeTab === 'soil_test' && (soilTestData ? <SoilTestingCard soilTestData={soilTestData} soilType={soilType} /> : <CardSkeleton />)}
                                                {activeTab === 'soil_improve' && (improvementData ? <SoilImprovementCard improvementData={improvementData} /> : <CardSkeleton />)}
                                                {activeTab === 'revenue' && <RevenueCard crop={crop} rainfall={rainfallLevel} season={season} />}
                                                {activeTab === 'profit' && <ProfitEstimationCard crop={crop} confidence={confidence} />}
                                                {activeTab === 'timeline' && <GrowingTimeline crop={crop} />}
                                                {activeTab === 'feasibility' && (feasibilityData ? <FeasibilityCard reportData={feasibilityData} cropName={crop} /> : <CardSkeleton />)}
                                                {activeTab === 'schemes' && (schemesData ? <GovernmentSchemesCard schemesData={schemesData} cropName={crop} /> : <CardSkeleton />)}
                                                {activeTab === 'guide' && (growingData ? <GrowingGuideCard guideData={growingData} cropName={crop} /> : <CardSkeleton />)}
                                                {activeTab === 'labour' && (labourData ? <LabourPlannerCard labourData={labourData} /> : <CardSkeleton />)}
                                                {activeTab === 'organic' && (organicData ? <OrganicFarmingCard organicData={organicData} cropName={crop} /> : <CardSkeleton />)}
                                            </motion.div>
                                        </AnimatePresence>
                                    </FeaturePanel>
                                </TabErrorBoundary>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Recommend;