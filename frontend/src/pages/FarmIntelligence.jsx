import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../context/LanguageContext';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Cpu, TrendingUp, Sparkles, Activity, Thermometer, Droplets, 
  CloudRain, Compass, AlertTriangle, CheckCircle2, Shield, 
  Calendar, FileText, BarChart3, ChevronRight, RefreshCw, HelpCircle, ArrowUpRight
} from 'lucide-react';
import T, { TD } from '../components/T';

// Theme styling helper colors for Recharts gradients
const CHART_COLORS = {
  emerald: ['#10b981', 'rgba(16, 185, 129, 0.1)'],
  gold: ['#f59e0b', 'rgba(245, 158, 11, 0.1)'],
  blue: ['#3b82f6', 'rgba(59, 130, 246, 0.1)'],
  red: ['#f87171', 'rgba(248, 113, 113, 0.1)'],
};

const FarmIntelligence = () => {
  const { user } = useAuth();
  const { get, loading, error } = useApi();
  const { t, language } = useLanguage();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch full prediction history for logged in user from Atlas
  const fetchUserHistory = async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    try {
      const res = await get(`/history/user/${user.id}`);
      if (res?.success && Array.isArray(res.data)) {
        setHistoryRecords(res.data);
        // Automatically select the most frequent or latest crop
        if (res.data.length > 0) {
          const crops = res.data.map(r => r.predictionResult?.crop || 'Unknown');
          const cropCounts = crops.reduce((acc, c) => {
            acc[c] = (acc[c] || 0) + 1;
            return acc;
          }, {});
          const topCrop = Object.keys(cropCounts).sort((a, b) => cropCounts[b] - cropCounts[a])[0];
          setSelectedCrop(topCrop || crops[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load user intelligence records:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, [user?.id]);

  // Group history by crop and perform multi-dimensional aggregation
  const cropSummaries = useMemo(() => {
    if (historyRecords.length === 0) return {};

    const summaries = {};
    historyRecords.forEach(record => {
      const crop = record.predictionResult?.crop || 'Unknown';
      const confidence = record.predictionResult?.confidence || 0.95;
      const confidencePercent = confidence < 1 ? Math.round(confidence * 100) : Math.round(confidence);
      
      const soil = record.soilType || 'Loamy';
      const n = record.soilMetrics?.nitrogen ?? record.soilMetrics?.n ?? 65;
      const p = record.soilMetrics?.phosphorus ?? record.soilMetrics?.p ?? 45;
      const k = record.soilMetrics?.potassium ?? record.soilMetrics?.k ?? 40;
      const ph = record.soilMetrics?.ph ?? 6.5;

      const temp = record.environmentalData?.temp || 26;
      const humidity = record.environmentalData?.humidity || 65;
      const rainfall = record.environmentalData?.rainfall || 120;
      const season = record.environmentalData?.season || 'Monsoon';

      if (!summaries[crop]) {
        summaries[crop] = {
          name: crop,
          count: 0,
          confidenceSum: 0,
          highestConfidence: 0,
          soils: {},
          seasons: {},
          nSum: 0,
          pSum: 0,
          kSum: 0,
          phSum: 0,
          tempSum: 0,
          humiditySum: 0,
          rainfallSum: 0,
          records: []
        };
      }

      const cs = summaries[crop];
      cs.count += 1;
      cs.confidenceSum += confidencePercent;
      cs.highestConfidence = Math.max(cs.highestConfidence, confidencePercent);
      cs.nSum += n;
      cs.pSum += p;
      cs.kSum += k;
      cs.phSum += ph;
      cs.tempSum += temp;
      cs.humiditySum += humidity;
      cs.rainfallSum += rainfall;
      
      cs.soils[soil] = (cs.soils[soil] || 0) + 1;
      cs.seasons[season] = (cs.seasons[season] || 0) + 1;
      
      cs.records.push({
        date: new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        confidence: confidencePercent,
        n, p, k, ph, temp, humidity, rainfall, season, soil,
        rawTimestamp: new Date(record.createdAt).getTime()
      });
    });

    // Compute averages and resolve dominant attributes
    Object.keys(summaries).forEach(crop => {
      const cs = summaries[crop];
      cs.avgConfidence = Math.round(cs.confidenceSum / cs.count);
      cs.avgN = Math.round(cs.nSum / cs.count);
      cs.avgP = Math.round(cs.pSum / cs.count);
      cs.avgK = Math.round(cs.kSum / cs.count);
      cs.avgPh = Number((cs.phSum / cs.count).toFixed(1));
      cs.avgTemp = Math.round(cs.tempSum / cs.count);
      cs.avgHumidity = Math.round(cs.humiditySum / cs.count);
      cs.avgRainfall = Math.round(cs.rainfallSum / cs.count);
      
      cs.dominantSoil = Object.keys(cs.soils).sort((a, b) => cs.soils[b] - cs.soils[a])[0];
      cs.dominantSeason = Object.keys(cs.seasons).sort((a, b) => cs.seasons[b] - cs.seasons[a])[0];

      // Sort records chronologically
      cs.records.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
    });

    return summaries;
  }, [historyRecords]);

  // Selected crop dataset
  const activeCropData = useMemo(() => {
    if (!selectedCrop || !cropSummaries[selectedCrop]) return null;
    return cropSummaries[selectedCrop];
  }, [selectedCrop, cropSummaries]);

  // List of unique crops predicted in history
  const availableCropsList = useMemo(() => {
    return Object.values(cropSummaries).sort((a, b) => b.count - a.count);
  }, [cropSummaries]);

  // Soil Chemical Radar Feed
  const radarData = useMemo(() => {
    if (!activeCropData) return [];
    return [
      { subject: 'Nitrogen (N)', value: activeCropData.avgN, fullMark: 140 },
      { subject: 'Phosphorus (P)', value: activeCropData.avgP, fullMark: 120 },
      { subject: 'Potassium (K)', value: activeCropData.avgK, fullMark: 120 },
      { subject: 'Humidity (%)', value: activeCropData.avgHumidity, fullMark: 100 },
      { subject: 'Temp (°C)', value: activeCropData.avgTemp * 2.5, fullMark: 100 }, // Scaled
      { subject: 'Soil pH (x10)', value: activeCropData.avgPh * 10, fullMark: 100 }, // Scaled
    ];
  }, [activeCropData]);

  // Dynamic Agricultural Calculation Engine (Dynamic Crop Intelligence)
  const calculatedMetrics = useMemo(() => {
    if (!activeCropData) return null;

    const { name, avgN, avgP, avgK, avgPh, avgTemp, avgHumidity, avgRainfall } = activeCropData;

    // 1. SOIL HEALTH SCORE CALCULATION
    // Calculated based on optimal ranges: N (70), P (50), K (40), pH (6.5), Humidity (55%)
    const nScore = Math.max(0, 100 - Math.abs(avgN - 70) * 1.2);
    const pScore = Math.max(0, 100 - Math.abs(avgP - 50) * 1.5);
    const kScore = Math.max(0, 100 - Math.abs(avgK - 40) * 1.5);
    const phDev = Math.abs(avgPh - 6.5);
    const phScore = Math.max(0, 100 - phDev * 25);
    const moistScore = Math.max(0, 100 - Math.abs(avgHumidity - 55) * 1.0);
    const soilHealth = Math.round((nScore + pScore + kScore + phScore + moistScore) / 5);

    // 2. YIELD PREDICTION CALCULATION
    // Dynamically maps different baseline outputs to different crops
    const cropYieldBases = {
      rice: 4.2,
      wheat: 3.5,
      maize: 4.8,
      cotton: 1.8,
      sunflower: 2.1,
      mango: 6.5,
      soybean: 2.5,
      sugarcane: 35.0,
    };
    const lowercaseCrop = name.toLowerCase();
    const baseYield = cropYieldBases[lowercaseCrop] || (Object.keys(cropYieldBases).find(k => lowercaseCrop.includes(k)) ? cropYieldBases[Object.keys(cropYieldBases).find(k => lowercaseCrop.includes(k))] : 3.0);

    const healthFactor = 0.7 + (soilHealth / 100) * 0.4; // 0.7x to 1.1x scaling
    const tempFactor = 1 - Math.max(0, Math.abs(avgTemp - 26) - 5) * 0.03; // max 15% reduction
    const rainFactor = 1 - Math.max(0, Math.abs(avgRainfall - 130) - 50) * 0.002;
    const predictedYieldVal = baseYield * healthFactor * tempFactor * rainFactor;
    const predictedYield = `${predictedYieldVal.toFixed(1)} tons/acre`;

    // 3. RISK SCORE MATRIX
    let droughtRisk = 'Low';
    if (avgRainfall < 60 || avgHumidity < 35) droughtRisk = 'High';
    else if (avgRainfall < 100 || avgHumidity < 50) droughtRisk = 'Medium';

    let floodRisk = 'Low';
    if (avgRainfall > 200) floodRisk = 'High';
    else if (avgRainfall > 150) floodRisk = 'Medium';

    let deficiencyRisk = 'Low';
    if (avgN < 40 || avgP < 30 || avgK < 30) deficiencyRisk = 'High';
    else if (avgN < 55 || avgP < 40 || avgK < 38) deficiencyRisk = 'Medium';

    const failScore = (droughtRisk === 'High' ? 40 : droughtRisk === 'Medium' ? 20 : 0) +
                     (floodRisk === 'High' ? 30 : floodRisk === 'Medium' ? 15 : 0) +
                     (deficiencyRisk === 'High' ? 30 : deficiencyRisk === 'Medium' ? 15 : 0) +
                     (phDev > 1.2 ? 15 : 0);
    const overallRisk = failScore > 60 ? 'High' : failScore > 30 ? 'Medium' : 'Low';

    // 4. CROP TIMELINE RECOMMENDATIONS
    const cropSeasons = {
      rice: { plant: 'June (Monsoon Start)', harvest: 'November (Post-Monsoon)' },
      wheat: { plant: 'November (Winter)', harvest: 'April (Spring)' },
      maize: { plant: 'June / March', harvest: 'October / July' },
      cotton: { plant: 'May (Pre-monsoon)', harvest: 'December' },
      sunflower: { plant: 'January (Rabi) / June', harvest: 'May / October' },
      mango: { plant: 'July (Monsoon)', harvest: 'May - July (Summer)' },
    };
    const seasonRec = cropSeasons[lowercaseCrop] || (Object.keys(cropSeasons).find(k => lowercaseCrop.includes(k)) ? cropSeasons[Object.keys(cropSeasons).find(k => lowercaseCrop.includes(k))] : { plant: 'June', harvest: 'October' });

    // 5. DYNAMIC AI RECOMMENDATIONS (ADVICE LIST)
    const recommendations = [];
    if (avgN < 50) {
      recommendations.push({
        action: 'Apply Nitrogenous Fertilizer',
        detail: `Nitrogen level is critically low (${avgN} mg/kg). Add Urea or Neem-coated Ammonium Nitrate to support leaf expansion.`,
        priority: 'High'
      });
    }
    if (avgP < 40) {
      recommendations.push({
        action: 'Add Phosphatic Fertilizers',
        detail: `Phosphorus is substandard (${avgP} mg/kg). Consider applying SSP or DAP for root development.`,
        priority: 'High'
      });
    }
    if (avgK < 40) {
      recommendations.push({
        action: 'Supplement Potassium (K)',
        detail: `Potassium level is low (${avgK} mg/kg). Apply Muriate of Potash (MOP) to optimize fruit quality and disease resistance.`,
        priority: 'Medium'
      });
    }
    if (avgPh < 6.0) {
      recommendations.push({
        action: 'Neutralize Acidic Soil',
        detail: `Soil pH (${avgPh}) is highly acidic. Add agricultural lime (Calcium Carbonate) to raise pH and optimize nutrient uptake.`,
        priority: 'High'
      });
    } else if (avgPh > 7.6) {
      recommendations.push({
        action: 'Amend Alkaline Soil',
        detail: `Soil pH (${avgPh}) is moderately alkaline. Apply gypsum or elemental sulfur to balance pH levels.`,
        priority: 'Medium'
      });
    }

    // Crop specific irrigation/drainage recommendations
    if (lowercaseCrop.includes('rice') || lowercaseCrop.includes('धान')) {
      if (avgRainfall < 120) {
        recommendations.push({
          action: 'Increase Irrigation Frequency',
          detail: `Rice has high water requirements. Current average rainfall is sub-optimal (${avgRainfall}mm). Supplement with canal/borewell water.`,
          priority: 'High'
        });
      } else {
        recommendations.push({
          action: 'Systematic Water Level Monitoring',
          detail: 'Maintain standing water at 2-5 cm depth until tillering, then drain before harvesting.',
          priority: 'Low'
        });
      }
    } else {
      // Non-rice crops
      if (avgRainfall > 180) {
        recommendations.push({
          action: 'Improve Field Drainage',
          detail: `Heavy rainfall (${avgRainfall}mm) detected. Non-paddy crops like ${name} are highly prone to root rot. Clear contours.`,
          priority: 'High'
        });
      }
    }

    if (recommendations.length < 3) {
      recommendations.push({
        action: 'Introduce Leguminous Crop Rotation',
        detail: `Rotate ${name} with Cowpea or Chickpea in the next cycle to biologically enrich the soil structure.`,
        priority: 'Low'
      });
    }

    return {
      soilHealth,
      predictedYield,
      overallRisk,
      droughtRisk,
      floodRisk,
      deficiencyRisk,
      seasonRec,
      recommendations
    };
  }, [activeCropData]);

  // Dynamic AI-Generated Insights compilation
  const aiInsights = useMemo(() => {
    if (!activeCropData) return [];

    const insights = [];
    const { name, avgN, avgPh, dominantSoil, dominantSeason, avgConfidence, count } = activeCropData;

    const cropTrans = t(name.toLowerCase()) || name;
    const soilTrans = t((dominantSoil || 'Loamy').toLowerCase() + 'Soil');
    const seasonTrans = t((dominantSeason || 'Kharif').toLowerCase());

    // Insight 1: Soil types correlation
    if (language === 'hi') {
      insights.push({
        id: 'insight-1',
        text: `${cropTrans} ने ${count} अलग-अलग पूर्वानुमानों में ${soilTrans} के साथ एक मजबूत प्रदर्शन पैटर्न दिखाया है।`,
        type: 'optimal',
        detail: t('insight1Detail')
      });
    } else {
      insights.push({
        id: 'insight-1',
        text: `${name} has shown a robust performance pattern with ${dominantSoil} type across ${count} distinct predictions.`,
        type: 'optimal',
        detail: t('insight1Detail')
      });
    }

    // Insight 2: Chemical levels thresholds
    if (avgN > 70) {
      if (language === 'hi') {
        insights.push({
          id: 'insight-2',
          text: `उच्च नाइट्रोजन अनुपात (औसत ${avgN} mg/kg) दृढ़ता से प्रीमियम ${cropTrans} सिफारिशों के साथ संबंध रखता है।`,
          type: 'growth',
          detail: t('insight2GrowthDetail')
        });
      } else {
        insights.push({
          id: 'insight-2',
          text: `Elevated Nitrogen ratios (averaging ${avgN} mg/kg) strongly correlate with premium ${name} recommendations.`,
          type: 'growth',
          detail: t('insight2GrowthDetail')
        });
      }
    } else {
      if (language === 'hi') {
        insights.push({
          id: 'insight-2',
          text: `उप-इष्टतम नाइट्रोजन मापदंडों का विश्लेषण किया गया। वानस्पतिक उत्पादन को स्थिर करने के लिए जैविक खाद जोड़ने पर विचार करें।`,
          type: 'warning',
          detail: t('insight2WarningDetail')
        });
      } else {
        insights.push({
          id: 'insight-2',
          text: `Sub-optimal Nitrogen parameters parsed. Consider organic compost additions to stabilize vegetative output.`,
          type: 'warning',
          detail: t('insight2WarningDetail')
        });
      }
    }

    // Insight 3: Seasonal planning suitability
    if (language === 'hi') {
      insights.push({
        id: 'insight-3',
        text: `ऐतिहासिक पूर्वानुमान विश्वसनीयता ${seasonTrans} सीजन के दौरान ${avgConfidence}% मॉडल सटीकता के साथ चरम पर है।`,
        type: 'reliability',
        detail: t('insight3Detail')
      });
    } else {
      insights.push({
        id: 'insight-3',
        text: `Historical predictive reliability peaks during the ${dominantSeason} season with ${avgConfidence}% model confidence.`,
        type: 'reliability',
        detail: t('insight3Detail')
      });
    }

    return insights;
  }, [activeCropData, language, t]);

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text-primary pt-32 pb-24 px-6 relative overflow-hidden select-none">
      <div className="noise-overlay pointer-events-none" />

      {/* Decorative cosmic background coordinates mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] right-[-5%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[45%] bg-brand-gold/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20">
              <Cpu size={11} />
              <span>{t('farmIntelligenceSystem')}</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-text-primary leading-none">
              <span>{t('cropIntelligence')}</span>
            </h1>
            <p className="text-brand-text-secondary text-sm max-w-2xl font-medium">
              <span>{t('cropIntelligenceSubtitle')}</span>
            </p>
          </div>

          {/* Sync status controller button & History link */}
          <div className="flex items-center gap-3">
            <Link
              to="/history?tab=records"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-surface border border-brand-border text-xs font-black uppercase tracking-wider hover:border-brand-primary/30 text-brand-text-primary transition-all h-fit"
            >
              <FileText size={14} className="text-brand-primary" />
              <span>Records Table</span>
            </Link>
            <button
              onClick={fetchUserHistory}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-surface border border-brand-border text-xs font-black uppercase tracking-wider hover:border-brand-primary/30 text-brand-text-primary transition-all disabled:opacity-50 h-fit"
            >
              <RefreshCw size={12} className={`${loading || isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t('syncAtlasData')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic empty state fallback */}
        {availableCropsList.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-brand-border bg-brand-surface/50 backdrop-blur-md rounded-4xl p-12 text-center max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-brand-text-primary">{t('noAnalyticsFootprint')}</h3>
            <p className="text-brand-text-secondary text-sm leading-relaxed font-medium">
              {t('noAnalyticsFootprintSubtitle')}
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <a href="/recommend" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-slate-950 font-black uppercase text-[10px] tracking-[0.25em] rounded-xl border border-brand-primary/20 shadow-premium">
                <span>{t('generateFirstRecommendation')}</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </motion.div>
        )}

        {availableCropsList.length > 0 && (
          <>
            {/* 1. PREMIUM HORIZONTAL CROP CAROUSEL / SELECTOR */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.25em] pl-1">
                {t('selectLoggedCropProfile')} ({availableCropsList.length})
              </span>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x scroll-smooth">
                {availableCropsList.map((crop) => {
                  const isActive = selectedCrop === crop.name;
                  return (
                    <button
                      key={crop.name}
                      onClick={() => setSelectedCrop(crop.name)}
                      className={`text-left p-6 rounded-[2rem] border min-w-[240px] snap-start shrink-0 relative overflow-hidden transition-all duration-300 ${
                        isActive 
                          ? 'bg-brand-surface-elevated border-brand-primary/40 shadow-premium group' 
                          : 'bg-brand-surface/60 border-brand-border hover:border-brand-primary/20 hover:bg-brand-surface-elevated/30'
                      }`}
                    >
                      {/* Active glow corner circle */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black uppercase text-sm ${
                          isActive ? 'bg-brand-primary text-slate-950 shadow-glow' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {crop.name.charAt(0)}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                          isActive ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-brand-surface-inset border border-brand-border text-brand-text-secondary'
                        }`}>
                          <TD value="Match" prefix={`${crop.avgConfidence}% `} />
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight truncate max-w-[180px]">{t(crop.name.toLowerCase()) || crop.name}</h3>
                      <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-brand-text-secondary">
                        <span><T>RECS</T>: {crop.count}</span>
                        <span><T>SOIL</T>: {t((crop.dominantSoil || 'Loamy').toLowerCase() + 'Soil')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DYNAMIC CROP SPECIFIC ANALYTICS OPERATING SYSTEM */}
            <AnimatePresence mode="wait">
              {activeCropData && (
                <motion.div
                  key={selectedCrop}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                >
                  
                  {/* LEFT COLUMN (3/12 cols): Diagnostic Soil & Environmental conditions */}
                  <div className="lg:col-span-3 flex flex-col gap-8">
                    {/* Environmental Conditions Box */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">{t('metricMatrix')}</span>
                        <h3 className="text-md font-black text-brand-text-primary uppercase tracking-tight">{t('climaticRanges')}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <Thermometer className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('averageTemp')}</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgTemp}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <Droplets className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('moistureAverage')}</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgHumidity}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <CloudRain className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('precipitation')}</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgRainfall} mm</p>
                          </div>
                        </div>
                      </div>

                      {/* Dom season index */}
                      <div className="pt-4 border-t border-brand-border/60">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">{t('dominantHarvestSeason')}</span>
                        <p className="text-lg font-black text-brand-primary uppercase tracking-tight mt-1">{t((activeCropData.dominantSeason || 'Kharif').toLowerCase())}</p>
                      </div>
                    </div>

                    {/* Soil Health, Yield Forecast & Scheduling */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-5">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]"><T>Health & Output</T></span>
                        <h3 className="text-md font-black text-brand-text-primary uppercase tracking-tight"><T>Agricultural Metrics</T></h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 p-3 bg-brand-surface-inset border border-brand-border rounded-2xl">
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase"><T>Soil Health Score</T></span>
                            <p className="text-xl font-black text-brand-primary">{calculatedMetrics?.soilHealth}%</p>
                          </div>
                          <div className="w-10 h-10 rounded-full border-2 border-brand-primary/20 border-t-brand-primary flex items-center justify-center font-black text-xs text-brand-text-primary">
                            {calculatedMetrics?.soilHealth}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 p-3 bg-brand-surface-inset border border-brand-border rounded-2xl">
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase"><T>Yield Forecast</T></span>
                            <p className="text-xs font-black text-brand-text-primary uppercase tracking-tight"><TD value={calculatedMetrics?.predictedYield} /></p>
                          </div>
                          <TrendingUp size={18} className="text-brand-primary" />
                        </div>

                        <div className="flex items-center justify-between gap-4 p-3 bg-brand-surface-inset border border-brand-border rounded-2xl">
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase"><T>Seeding Window</T></span>
                            <p className="text-[10px] font-black text-brand-text-primary uppercase tracking-tight"><TD value={calculatedMetrics?.seasonRec.plant} /></p>
                          </div>
                          <Calendar size={18} className="text-brand-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Confidence gauge card */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-brand-text-secondary">{t('aiPredictiveConsistency')}</span>
                        <span className="text-brand-primary">{activeCropData.avgConfidence}% Avg</span>
                      </div>
                      <div className="h-2 w-full bg-brand-surface-inset border border-brand-border rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeCropData.avgConfidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-brand-primary to-emerald-400"
                        />
                      </div>
                      <TD 
                        as="p" 
                        className="text-[9px] text-brand-text-secondary font-medium leading-relaxed" 
                        value={`Evaluated across ${activeCropData.count} historical prediction scenarios in user database.`} 
                      />
                    </div>
                  </div>

                  {/* CENTER COLUMN (6/12 cols): Large animated timeline and charts */}
                  <div className="lg:col-span-6 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">{t('chartProfile')}</span>
                        <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('predictionHistoricalTimeline')}</h3>
                      </div>
                      <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-black rounded-lg uppercase">
                        {t('realTimeChronoTimeline')}
                      </span>
                    </div>

                    {/* Main Recharts Area Chart */}
                    <div className="h-64 w-full my-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeCropData.records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.1)" />
                          <XAxis dataKey="date" stroke="currentColor" className="text-[9px] font-black text-brand-text-secondary uppercase opacity-60" />
                          <YAxis domain={[50, 100]} stroke="currentColor" className="text-[9px] font-black text-brand-text-secondary opacity-60" />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'var(--surface-solid-elevated)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '16px',
                              fontFamily: 'inherit',
                              fontSize: '11px',
                              color: 'var(--text-color-primary)'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="var(--accent-primary)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorConfidence)" 
                            name={t('successRate')}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Lower matrix mini comparison */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border/60">
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('nitrogenAvg')}</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgN} mg/kg</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('phosphorusAvg')}</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgP} mg/kg</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('potassiumAvg')}</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgK} mg/kg</p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (3/12 cols): Soil Health network, alerts and risks */}
                  <div className="lg:col-span-3 flex flex-col justify-between gap-8">
                    {/* Radar Chart of macronutrients health network */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">{t('sensorDiagnostic')}</span>
                        <h3 className="text-md font-black text-brand-text-primary uppercase tracking-tight">{t('macronutrientBalance')}</h3>
                      </div>

                      <div className="h-44 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="rgba(156,163,175,0.1)" />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tickFormatter={(tick) => {
                                if (tick.includes('Nitrogen')) return t('nitrogenAvg');
                                if (tick.includes('Phosphorus')) return t('phosphorusAvg');
                                if (tick.includes('Potassium')) return t('potassiumAvg');
                                if (tick.includes('Humidity')) return `${t('moistureAverage')} (%)`;
                                if (tick.includes('Temp')) return `${t('averageTemp')} (°C)`;
                                if (tick.includes('pH')) return `pH`;
                                return tick;
                              }}
                              className="text-[8px] font-black uppercase text-brand-text-secondary" 
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 120]} className="hidden" />
                            <Radar 
                              name="MACRONUTRIENTS" 
                              dataKey="value" 
                              stroke="var(--accent-primary)" 
                              fill="var(--accent-primary)" 
                              fillOpacity={0.2} 
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Optimal soil profile type */}
                      <div className="pt-4 border-t border-brand-border/60 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-brand-text-secondary uppercase">{t('optimalSoilType')}</span>
                          <p className="text-md font-black text-brand-text-primary uppercase mt-1">{t((activeCropData.dominantSoil || 'Loamy').toLowerCase() + 'Soil')}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Micro alert feedback panel */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4">
                      <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle size={10} className="text-brand-gold" /> {t('diagnosticRiskProfile')}
                      </span>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-center text-[8px] font-black uppercase mb-1">
                          <div className={`p-2 bg-brand-surface-inset border border-brand-border rounded-xl ${calculatedMetrics?.droughtRisk === 'High' ? 'text-red-500 border-red-500/20' : calculatedMetrics?.droughtRisk === 'Medium' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>
                            <TD value={`Drought: ${calculatedMetrics?.droughtRisk}`} />
                          </div>
                          <div className={`p-2 bg-brand-surface-inset border border-brand-border rounded-xl ${calculatedMetrics?.floodRisk === 'High' ? 'text-red-500 border-red-500/20' : calculatedMetrics?.floodRisk === 'Medium' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>
                            <TD value={`Flood: ${calculatedMetrics?.floodRisk}`} />
                          </div>
                          <div className={`p-2 bg-brand-surface-inset border border-brand-border rounded-xl ${calculatedMetrics?.deficiencyRisk === 'High' ? 'text-red-500 border-red-500/20' : calculatedMetrics?.deficiencyRisk === 'Medium' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>
                            <TD value={`Deficiency: ${calculatedMetrics?.deficiencyRisk}`} />
                          </div>
                          <div className={`p-2 bg-brand-surface-inset border border-brand-border rounded-xl ${calculatedMetrics?.overallRisk === 'High' ? 'text-red-500 border-red-500/20' : calculatedMetrics?.overallRisk === 'Medium' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>
                            <TD value={`Overall: ${calculatedMetrics?.overallRisk}`} />
                          </div>
                        </div>

                        {activeCropData.avgPh < 6.0 || activeCropData.avgPh > 7.5 ? (
                          <div className="p-3 bg-red-400/10 rounded-xl border border-red-400/20 text-[10px] text-red-400 font-black uppercase">
                            {t('extremePHWarning')} ({activeCropData.avgPh})
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/20 text-[10px] text-brand-primary font-black uppercase flex items-center gap-1.5">
                            <Shield size={12} /> {t('phAlkalinityOptimum')}
                          </div>
                        )}
                        <p className="text-[9px] text-brand-text-secondary font-medium leading-relaxed">
                          {t('basedOnPHCalculations')}
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. LOWER SECTION: COGNITIVE INTELLIGENCE & AI-GENERATED INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* Left Box (7/12 cols): Playable NPK chemical heatmaps */}
              <div className="lg:col-span-7 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between min-h-[360px]">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">{t('npkHeatmapIndex')}</span>
                    <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('macronutrientAllocationMatrix')}</h3>
                  </div>
                  <Compass className="text-brand-primary animate-spin" size={18} style={{ animationDuration: '10s' }} />
                </div>

                {/* Animated NPK bar distribution graph */}
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeCropData?.records || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.1)" />
                      <XAxis dataKey="date" stroke="currentColor" className="text-[8px] font-black text-brand-text-secondary uppercase opacity-60" />
                      <YAxis stroke="currentColor" className="text-[8px] font-black text-brand-text-secondary opacity-60" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'var(--surface-solid-elevated)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '16px',
                          fontSize: '11px',
                          color: 'var(--text-color-primary)'
                        }} 
                      />
                      <Bar dataKey="n" fill="var(--accent-primary)" name={`${t('nitrogenAvg')} (N)`} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="p" fill="var(--accent-gold)" name={`${t('phosphorusAvg')} (P)`} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="k" fill="#3b82f6" name={`${t('potassiumAvg')} (K)`} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] font-medium text-brand-text-secondary mt-4">
                  {t('allocatedIndicesNotice')}
                </p>
              </div>

              {/* Right Box (5/12 cols): Dynamic AI INSIGHTS panel */}
              <div className="lg:col-span-5 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={18} className="text-brand-primary animate-pulse" />
                  <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('dynamicAIInsights')}</h3>
                </div>

                <div className="space-y-4 flex-grow flex flex-col justify-center">
                  {calculatedMetrics?.recommendations.slice(0, 3).map((rec, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-brand-surface-inset border border-brand-border rounded-2xl relative overflow-hidden"
                    >
                      {/* Decorative colored glow strip based on priority */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${rec.priority === 'High' ? 'bg-red-500' : rec.priority === 'Medium' ? 'bg-brand-gold' : 'bg-brand-primary'}`} />
                      <div className="pl-2">
                        <TD as="p" className="text-xs font-black text-brand-text-primary uppercase mb-1 leading-tight" value={rec.action} />
                        <TD as="p" className="text-[10px] text-brand-text-secondary font-medium leading-relaxed" value={rec.detail} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[9px] font-black uppercase text-brand-primary tracking-widest flex items-center gap-1.5 mt-6 border-t border-brand-border/60 pt-4">
                  <Shield size={11} /> {t('aiInsightsVerified')}
                </p>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FarmIntelligence;
