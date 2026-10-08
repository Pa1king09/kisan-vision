import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Sprout, Plus, Layers, Activity, CloudSun, Zap, BarChart3, Shield, TrendingUp, Droplets, Thermometer, Wind, Brain, ArrowRight, Calendar, CheckCircle2, Tractor, Leaf } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CountUp from 'react-countup';
import axios from 'axios';
import { getFields, saveFields, getCrops, saveCrops, generateInsights } from '../utils/farmInsights';
import { NoFieldsSVG, NoCropsSVG, HealthyFarmBanner } from '../components/FarmIllustrations';
import { AddFieldModal, LogCropModal, SelectFarmModal } from '../components/FarmModals';
import { CardSkeleton } from '../components/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import T, { TD } from '../components/T';

const OUTCOME_COLORS = { 'Good Yield': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', 'Average': 'bg-amber-500/10 text-amber-500 border-amber-500/20', 'Poor': 'bg-red-500/10 text-red-500 border-red-500/20' };

import { getActiveApiUrl } from '../utils/mobileInit';

const apiClient = axios.create({
    timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
    const activeBase = getActiveApiUrl();
    const baseUrlWithoutApi = activeBase.replace(/\/api\/?$/, '');
    
    // Inject auth token
    try {
        const token = localStorage.getItem('cv_token') || localStorage.getItem('token');
        if (token && !config.headers?.Authorization) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {}

    if (config.url) {
        if (config.url.startsWith('/api')) {
            config.url = `${baseUrlWithoutApi}${config.url}`;
        } else if (!config.url.startsWith('http://') && !config.url.startsWith('https://')) {
            config.url = `${activeBase}/${config.url.replace(/^\//, '')}`;
        }
    }
    return config;
}, (err) => Promise.reject(err));

// Static NPK/pH estimates per soil type
const SOIL_HEALTH = {
  Clay:     { N: 85, P: 50, K: 42, ph: 6.5 },
  Sandy:    { N: 22, P: 45, K: 18, ph: 6.0 },
  Loamy:    { N: 65, P: 45, K: 28, ph: 7.0 },
  Black:    { N: 45, P: 30, K: 25, ph: 7.5 },
  Red:      { N: 25, P: 55, K: 20, ph: 5.5 },
  Alluvial: { N: 60, P: 45, K: 25, ph: 7.2 },
};

const getNPKColor = (val, max) => {
  const pct = val / max;
  if (pct >= 0.6) return 'bg-emerald-500';
  if (pct >= 0.35) return 'bg-amber-400';
  return 'bg-red-400';
};

const getRiskLevel = (fields = [], crops = []) => {
  if (!fields || !fields.length) return { level: '—', color: 'text-brand-text-secondary', bg: 'bg-brand-surface-inset border-brand-border' };
  const safeCrops = crops || [];
  const poorCount = safeCrops.filter(c => c.outcome === 'Poor').length;
  const total = safeCrops.length || 1;
  const ratio = poorCount / total;
  if (ratio > 0.4) return { level: 'High', color: 'text-brand-danger', bg: 'bg-red-500/10 border-red-500/20' };
  if (ratio > 0.15) return { level: 'Medium', color: 'text-brand-warning', bg: 'bg-amber-500/10 border-amber-500/20' };
  return { level: 'Low', color: 'text-brand-success', bg: 'bg-emerald-500/10 border-emerald-500/20' };
};

const getFieldStatus = (fieldName, crops = []) => {
  const safeCrops = crops || [];
  const fc = safeCrops.filter(c => c.fieldName === fieldName);
  if (!fc.length) return { label: 'New', color: 'text-brand-info bg-brand-info/10 border-brand-info/20' };
  const last = fc[fc.length - 1];
  if (!last) return { label: 'New', color: 'text-brand-info bg-brand-info/10 border-brand-info/20' };
  if (last.outcome === 'Poor') return { label: 'At Risk', color: 'text-brand-danger bg-brand-danger/10 border-brand-danger/20' };
  if (last.outcome === 'Good Yield') return { label: 'Healthy', color: 'text-brand-success bg-brand-success/10 border-brand-success/20' };
  return { label: 'Moderate', color: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' };
};

const AI_SUMMARIES = [
  "Your farm's soil diversity is well-balanced. Consider rotating legumes on clay fields to improve nitrogen fixation naturally.",
  "Based on crop history, your Monsoon season yields outperform other seasons by 23%. Plan high-value crops accordingly.",
  "Fields with Loamy soil show consistently better outcomes. Prioritize these for premium crops this season.",
  "Soil health indicators suggest adding organic compost to sandy fields before the next sowing cycle.",
];

const MyFarm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [showLogCrop, setShowLogCrop] = useState(false);
  const [showSelectFarm, setShowSelectFarm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      setLoading(true);
      
      // 1. Fetch real farms/fields from MongoDB Atlas
      apiClient.get(`/farms/user/${userId}`)
        .then(res => {
          const fetchedFarms = res.data.data || res.data;
          if (Array.isArray(fetchedFarms) && fetchedFarms.length > 0) {
            setFields(fetchedFarms);
            saveFields(userId, fetchedFarms);
          } else {
            setFields(getFields(userId));
          }
        })
        .catch(err => {
          console.error('Failed to fetch farms from MongoDB, using fallback:', err);
          setFields(getFields(userId));
        });

      // 2. Fetch real history and crops from MongoDB Atlas
      apiClient.get(`/history/user/${userId}`)
        .then(res => {
          const records = res.data.data || res.data;
          setHistory(records || []);
          
          if (Array.isArray(records)) {
            // Map actual recommendation records as real crop history logs
            const derivedCrops = records.map(r => ({
              id: r._id,
              cropName: r.predictionResult?.crop || 'Unknown',
              fieldName: r.farmName || r.location || 'Manual Run',
              season: r.environmentalData?.season || 'Monsoon',
              year: new Date(r.createdAt).getFullYear(),
              outcome: 'Good Yield'
            }));
            
            // Get manually logged past crops from localStorage
            const localCrops = getCrops(userId);
            // Merge both and remove duplicates
            const merged = [...localCrops];
            derivedCrops.forEach(dc => {
              const exists = merged.some(lc => lc.cropName === dc.cropName && lc.fieldName === dc.fieldName && lc.year === dc.year);
              if (!exists) merged.push(dc);
            });
            setCrops(merged);
          } else {
            setCrops(getCrops(userId));
          }
        })
        .catch(err => {
          console.error('Failed to fetch history, using fallback:', err);
          setCrops(getCrops(userId));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const addField = async (f) => { 
    const userId = user?.id || user?._id;
    if (!userId) return; 
    try {
      const res = await apiClient.post('/farms', {
        userId,
        name: f.name,
        soilType: f.soilType,
        district: f.district,
        state: f.state,
        area: f.area,
        boundary: f.boundary || [],
        latitude: f.latitude || (f.coordinates?.lat ? f.coordinates.lat : null),
        longitude: f.longitude || (f.coordinates?.lon ? f.coordinates.lon : null),
        coordinates: f.coordinates || null
      });
      const savedFarm = res.data.data || res.data;
      const nf = [...fields, { ...f, _id: savedFarm._id, id: savedFarm._id, boundary: f.boundary || savedFarm.boundary || [] }];
      setFields(nf); 
      saveFields(userId, nf);
    } catch (err) {
      console.error('Failed to save field to MongoDB, saving locally:', err);
      const nf = [...fields, f];
      setFields(nf);
      saveFields(userId, nf);
    }
  };

  const deleteField = async (id) => { 
    const userId = user?.id || user?._id;
    if (!userId) return; 
    try {
      await apiClient.delete(`/farms/${id}`);
      const nf = fields.filter(f => f._id !== id && f.id !== id); 
      setFields(nf); 
      saveFields(userId, nf);
    } catch (err) {
      console.error('Failed to delete field from MongoDB:', err);
      const nf = fields.filter(f => f.id !== id && f._id !== id); 
      setFields(nf); 
      saveFields(userId, nf);
    }
  };

  const addCrop = async (c) => { 
    const userId = user?.id || user?._id;
    if (!userId) return; 
    const targetFarm = fields.find(f => f.name === c.fieldName);
    if (targetFarm && (targetFarm._id || targetFarm.id)) {
      try {
        await apiClient.post(`/farms/${targetFarm._id || targetFarm.id}/crops`, {
          cropName: c.cropName,
          season: c.season,
          year: c.year,
          outcome: c.outcome
        });
      } catch (err) {
        console.error('Failed to log crop to MongoDB:', err);
      }
    }
    const nc = [...crops, c]; 
    setCrops(nc); 
    saveCrops(userId, nc); 
  };

  const insights = generateInsights(fields, crops);
  const totalArea = (fields || []).reduce((s, f) => s + (parseFloat(f?.area) || 0), 0);
  const uniqueSoils = [...new Set((fields || []).map(f => f?.soilType).filter(Boolean))];
  const activeCrops = [...new Set((crops || []).filter(c => c?.year >= new Date().getFullYear() - 1).map(c => c?.cropName).filter(Boolean))].length;
  const risk = getRiskLevel(fields || [], crops || []);
  const onlyPositive = (insights || []).every(i => i.color === '#4caf50' || i.color === '#1e88e5');

  // Aggregate soil health from fields
  const avgSoil = (fields && fields.length > 0)
    ? fields.reduce((acc, f) => {
        const s = (f && f.soilType && SOIL_HEALTH[f.soilType]) ? SOIL_HEALTH[f.soilType] : SOIL_HEALTH.Loamy;
        return { N: acc.N + s.N, P: acc.P + s.P, K: acc.K + s.K, ph: acc.ph + s.ph };
      }, { N: 0, P: 0, K: 0, ph: 0 })
    : null;
  if (avgSoil && fields.length > 0) { 
    avgSoil.N = Math.round(avgSoil.N / fields.length); 
    avgSoil.P = Math.round(avgSoil.P / fields.length); 
    avgSoil.K = Math.round(avgSoil.K / fields.length); 
    avgSoil.ph = +(avgSoil.ph / fields.length).toFixed(1); 
  }

  const aiSummary = AI_SUMMARIES[fields.length % AI_SUMMARIES.length];

  return (
    <motion.div className="bg-brand-bg min-h-screen pt-32 pb-20" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-ai"><span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" /><T>AI DASHBOARD</T></span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-brand-text-primary tracking-tight mb-3 uppercase">{t('myFarmTitle')}</h1>
            <p className="text-brand-text-secondary font-medium text-base max-w-xl">{t('myFarmSubtitle')}</p>
          </motion.div>
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
            <button onClick={() => setShowAddField(true)} className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
              <Plus size={14} /> {t('addField')}
            </button>
            <button onClick={() => setShowSelectFarm(true)} className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
              <Zap size={14} /> {t('runAnalysis')}
            </button>
            <Link to="/history" className="flex items-center gap-2 px-5 py-3 bg-brand-surface-elevated border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-surface-hover transition-all shadow-sm">
              <BarChart3 size={14} /> {t('viewHistory')}
            </Link>
          </motion.div>
        </div>

        {/* ═══ OVERVIEW CARDS ROW ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {loading ? (
            [...Array(5)].map((_, i) => <CardSkeleton key={i} />)
          ) : (
            [
              { labelKey: 'totalFieldsLabel', value: fields.length, icon: MapPin, color: 'text-brand-primary', bg: 'bg-brand-surface-inset border-brand-border' },
              { labelKey: 'totalAcresLabel', value: totalArea, suffix: ' ac', icon: Layers, color: 'text-brand-primary', bg: 'bg-brand-surface-inset border-brand-border' },
              { labelKey: 'activeCropsLabel', value: activeCrops, icon: Sprout, color: 'text-brand-primary', bg: 'bg-brand-surface-inset border-brand-border' },
              { labelKey: 'cropRecordsLabel', value: crops.length, icon: BarChart3, color: 'text-brand-primary', bg: 'bg-brand-surface-inset border-brand-border' },
              { labelKey: 'riskLevelLabel', value: null, icon: Shield, color: risk.color, bg: risk.bg },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-5 border shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 bg-brand-surface-inset border-brand-border`}
              >
                <card.icon size={18} className={`${card.color} mb-3`} />
                {card.value !== null ? (
                  <p className="text-3xl font-black text-brand-text-primary leading-none mb-1">
                    <CountUp end={card.value} duration={1.5} />{card.suffix || ''}
                  </p>
                ) : (
                  <p className={`text-2xl font-black leading-none mb-1 ${risk.color}`}>{t(risk.level === 'Low' ? 'goodYield' : risk.level === 'High' ? 'poorYield' : 'averageYield')}</p>
                )}
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{t(card.labelKey)}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        {loading ? (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {/* AI FARM SUMMARY */}
            {fields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-brand-surface-inset border border-brand-border rounded-3xl p-8 mb-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Brain size={24} className="text-brand-primary" />
                  </div>
                  <div>
                    <T as="p" className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-2">AI Farm Intelligence</T>
                    <TD as="p" className="text-brand-text-primary dark:text-white/90 text-base font-medium leading-relaxed" value={aiSummary} />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-12 gap-8">
              {/* ═══ LEFT: FIELDS (7 cols) ═══ */}
              <div className="lg:col-span-7 space-y-6">
                {/* SMART FIELD CARDS */}
                <div className="premium-card !p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest flex items-center gap-3">
                      <MapPin size={18} className="text-brand-primary" /> {t('myFieldsHeader')}
                    </h3>
                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-lg uppercase tracking-widest">{fields.length} <T>Fields</T></span>
                  </div>

                  {fields.length === 0 ? <NoFieldsSVG /> : (
                    <div className="space-y-4">
                      {fields.map((f, i) => {
                        const status = getFieldStatus(f.name, crops);
                        const fieldCropCount = crops.filter(c => c.fieldName === f.name).length;
                        const goodCount = crops.filter(c => c.fieldName === f.name && c.outcome === 'Good Yield').length;
                        const progressPct = fieldCropCount > 0 ? Math.round((goodCount / fieldCropCount) * 100) : 0;

                        return (
                          <motion.div key={f._id || f.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="p-6 rounded-[2rem] border border-brand-border bg-brand-surface hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="font-black text-brand-text-primary text-lg uppercase tracking-tight leading-none">{f.name}</p>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${status.color}`}><T>{status.label}</T></span>
                                </div>
                                <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest"><TD value={f.district} />{f.district && f.state ? ', ' : ''}<TD value={f.state} /></p>
                              </div>
                              <button onClick={() => deleteField(f._id || f.id)} className="w-9 h-9 flex items-center justify-center bg-brand-surface-inset text-brand-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-brand-border">
                                <Trash2 size={14} />
                              </button>
                            </div>
 
                            <div className="flex items-center gap-3 flex-wrap mb-5">
                              <span className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-xl uppercase tracking-wider">{t((f.soilType || 'Loamy').toLowerCase() + 'Soil')}</span>
                              <span className="text-[10px] text-brand-text-secondary font-black uppercase tracking-widest">{f.area || 0} <T>acres</T></span>
                              <span className="text-[10px] text-brand-text-secondary font-black uppercase tracking-widest">{fieldCropCount} <T>crops logged</T></span>
                              {(f.latitude != null || f.coordinates?.lat != null) && (
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl font-mono font-bold flex items-center gap-1">
                                  <MapPin size={11} className="text-emerald-400" />
                                  {Number(f.latitude ?? f.coordinates?.lat ?? 0).toFixed(3)}°, {Number(f.longitude ?? f.coordinates?.lon ?? 0).toFixed(3)}°
                                </span>
                              )}
                              {f.boundary && f.boundary.length >= 3 && (
                                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider flex items-center gap-1">
                                  🗺️ Land Border ({f.boundary.length} pts)
                                </span>
                              )}
                            </div>
 
                            {/* Success rate bar */}
                            {fieldCropCount > 0 && (
                              <div className="mb-5">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{t('successRate')}</span>
                                  <span className="text-[9px] font-black text-brand-text-primary">{progressPct}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, delay: 0.3 }}
                                    className={`h-full rounded-full ${progressPct >= 60 ? 'bg-emerald-500' : progressPct >= 30 ? 'bg-amber-400' : 'bg-red-400'}`} />
                                </div>
                              </div>
                            )}
 
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                              <button onClick={() => navigate(`/recommend?farmId=${f._id || f.id}&farmName=${encodeURIComponent(f.name || '')}&soil=${encodeURIComponent(f.soilType || 'Loamy')}&district=${encodeURIComponent(f.district || '')}&state=${encodeURIComponent(f.state || '')}&autorun=true`)}
                                className="w-full py-3 bg-brand-primary text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-sm group-hover:shadow-premium active:scale-[0.98] flex items-center justify-center gap-1">
                                {t('analyzeBtn')} <ArrowRight size={12} />
                              </button>
                              <button onClick={() => navigate(`/equipment?fieldId=${f._id || f.id}&fieldName=${encodeURIComponent(f.name || '')}&acres=${f.area || 1}`)}
                                className="w-full py-3 bg-brand-surface-elevated border border-brand-border text-emerald-400 hover:border-emerald-500/40 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]">
                                <Tractor size={12} /> Machinery
                              </button>
                              <button onClick={() => navigate(`/organic-recipes?fieldId=${f._id || f.id}&acres=${f.area || 1}`)}
                                className="w-full py-3 bg-brand-surface-elevated border border-brand-border text-teal-400 hover:border-teal-500/40 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]">
                                <Leaf size={12} /> ZBNF Organic
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  <button onClick={() => setShowAddField(true)}
                    className="w-full mt-6 py-5 border-2 border-dashed border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                    <Plus size={18} /> {t('addNewField')}
                  </button>
                </div>

                {/* ═══ SOIL HEALTH DASHBOARD ═══ */}
                {avgSoil && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card !p-8">
                    <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest flex items-center gap-3 mb-8">
                      <Activity size={18} className="text-brand-primary" /> {t('soilHealthOverview')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { labelKey: 'nitrogenAvg', value: avgSoil.N, max: 140, unit: '' },
                        { labelKey: 'phosphorusAvg', value: avgSoil.P, max: 145, unit: '' },
                        { labelKey: 'potassiumAvg', value: avgSoil.K, max: 205, unit: '' },
                        { labelKey: 'phAlkalinityOptimum', value: avgSoil.ph, max: 10, unit: '', isPH: true },
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                          className="p-5 bg-brand-surface-inset border border-brand-border rounded-2xl text-center">
                          <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-2">{t(item.labelKey)}</p>
                          <p className="text-3xl font-black text-brand-text-primary mb-3">
                            <CountUp end={item.value} decimals={item.isPH ? 1 : 0} duration={1.5} />
                          </p>
                          <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                              transition={{ duration: 1.2, delay: 0.6 + i * 0.1 }}
                              className={`h-full rounded-full ${getNPKColor(item.value, item.max)}`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ═══ RIGHT COLUMN (5 cols) ═══ */}
              <div className="lg:col-span-5 space-y-6">

                {/* CROP HISTORY */}
                <div className="premium-card !p-8">
                  <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Sprout size={18} className="text-brand-primary" /> {t('cropHistoryHeader')}
                  </h3>
                  {crops.length === 0 ? <NoCropsSVG /> : (
                    <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-2">
                      {crops.slice().reverse().map((c, i) => (
                        <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-brand-surface border border-brand-border hover:shadow-premium transition-all">
                          <div>
                            <p className="text-sm font-black text-brand-text-primary uppercase tracking-tight"><TD value={c.cropName} /></p>
                            <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{t((c.season || 'Kharif').toLowerCase())} {c.year} · <TD value={c.fieldName} /></p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${OUTCOME_COLORS[c.outcome] || ''}`}>
                            {t(c.outcome === 'Good Yield' ? 'goodYield' : c.outcome === 'Average' ? 'averageYield' : 'poorYield')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {fields.length > 0 && (
                    <button onClick={() => setShowLogCrop(true)}
                      className="w-full mt-6 py-4 border-2 border-dashed border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                      <Plus size={16} /> {t('logPastCrop')}
                    </button>
                  )}
                </div>

                {/* ACTIVITY TIMELINE */}
                {((fields || []).length > 0 || (crops || []).length > 0) && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card !p-8">
                    <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest flex items-center gap-3 mb-6">
                      <Calendar size={18} className="text-brand-primary" /> {t('recentActivity')}
                    </h3>
                    <div className="relative pl-6">
                      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-brand-border" />
                      {[
                        ...(fields || []).slice(-3).map(f => ({ type: 'field', text: `Added field "${f.name || 'Unnamed'}"`, sub: `${f.soilType || 'Soil'} · ${f.area || 0} acres`, date: f.updatedAt })),
                        ...(crops || []).slice(-3).map(c => ({ type: 'crop', text: `Logged ${c.cropName || 'Crop'}`, sub: `${c.season || ''} ${c.year || ''} · ${c.fieldName || ''}`, date: `${c.season || ''} ${c.year || ''}` })),
                      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="relative mb-5 last:mb-0">
                          <div className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-brand-surface shadow-sm z-10 ${item.type === 'field' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                          <div className="ml-3">
                            <TD as="p" className="text-sm font-bold text-brand-text-primary" value={item.text} />
                            <TD as="p" className="text-[10px] font-bold text-brand-text-tertiary" value={item.sub} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="bg-brand-surface-inset rounded-[2.5rem] p-8 shadow-premium border border-brand-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  <h3 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.3em] mb-6 relative z-10">{t('quickInsightsHeader')}</h3>
                  {onlyPositive && fields.length > 0 && crops.length > 0 && <HealthyFarmBanner />}
                  <div className="space-y-4 mt-4 relative z-10">
                    {insights.map((ins, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}
                        className="bg-brand-surface-elevated border border-brand-border rounded-[1.5rem] p-5 hover:bg-brand-surface-hover transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{ins.icon}</span>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ins.color }} />
                        </div>
                        <TD as="p" className="text-brand-text-secondary text-sm font-medium leading-relaxed" value={ins.msg} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* PRECISION HISTORY (NEW) */}
                <div className="premium-card !p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest flex items-center gap-3">
                      <Zap size={18} className="text-brand-primary" /> {t('precisionAnalysisHistory')}
                    </h3>
                    <Link to="/history" className="text-[10px] font-black text-brand-primary uppercase hover:underline">View All</Link>
                  </div>
                  {history.length === 0 ? (
                    <div className="text-center py-6 opacity-40">
                      <p className="text-xs font-bold"><T>No precision analyses saved yet.</T></p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.slice(0, 5).map((h, i) => (
                        <div key={h.id || i} className="p-4 rounded-2xl bg-brand-surface-inset border border-brand-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-surface-elevated rounded-xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-border">
                              <Sprout size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-brand-text-primary uppercase"><TD value={h.predictionResult?.crop || h.result?.crop || 'Unknown'} /></p>
                              <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest"><TD value={h.location} /> · <TD value="Match" prefix={`${Math.round((h.predictionResult?.confidence || h.result?.confidence || 0) * 100)}% `} /></p>
                            </div>
                          </div>
                          <Link to="/recommend" className="text-brand-primary p-2 hover:bg-brand-primary/10 rounded-lg">
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FARM OVERVIEW STATS */}
                <div className="premium-card !p-8">
                  <h3 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-6">{t('farmOverviewHeader')}</h3>
                  {uniqueSoils.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-3">{t('soilTypesLabel')}</p>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSoils.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-brand-surface-inset border border-brand-border text-brand-text-secondary text-[9px] font-black rounded-lg uppercase tracking-wider">{t((s || 'Loamy').toLowerCase() + 'Soil')}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AddFieldModal open={showAddField} onClose={() => setShowAddField(false)} onSave={addField} />
      <LogCropModal open={showLogCrop} onClose={() => setShowLogCrop(false)} onSave={addCrop} fields={fields} />
      <SelectFarmModal 
        open={showSelectFarm} 
        onClose={() => setShowSelectFarm(false)} 
        fields={fields} 
        onSelect={(f) => navigate(`/recommend?farmId=${f.id}&farmName=${encodeURIComponent(f.name || '')}&soil=${encodeURIComponent(f.soilType || 'Loamy')}&district=${encodeURIComponent(f.district || '')}&state=${encodeURIComponent(f.state || '')}&autorun=true`)} 
      />
    </motion.div>
  );
};

export default MyFarm;
