import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Leaf, Beaker, ShieldAlert, Calendar, CheckCircle2, 
  Layers, Clock, DollarSign, Download, Printer, ArrowRight,
  TrendingDown, Info, Flame, Droplets, Sprout, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import T from '../components/T';
import { getActiveApiUrl } from '../utils/mobileInit';

const getApiBase = () => getActiveApiUrl();

const CROPS = [
  'Rice', 'Wheat', 'Cotton', 'Tomato', 'Potato', 
  'Maize', 'Groundnut', 'Sugarcane', 'Chilli', 'Onion', 'Soybean'
];

const RECIPE_TABS = [
  { id: 'jeevamrut', label: 'Jeevamrut', icon: Droplets, color: 'text-emerald-400', badge: 'Soil Microbial Culture' },
  { id: 'neemastra', label: 'Neemastra', icon: Leaf, color: 'text-teal-400', badge: 'Sucking Pest Spray' },
  { id: 'brahmastra', label: 'Brahmastra', icon: ShieldCheck, color: 'text-cyan-400', badge: 'Caterpillar & Borer' },
  { id: 'agniastra', label: 'Agniastra', icon: Flame, color: 'text-amber-400', badge: 'Emergency Defense' },
  { id: 'beejamrut', label: 'Beejamrut', icon: Sprout, color: 'text-lime-400', badge: 'Seed Treatment' },
  { id: 'ghanJeevamrut', label: 'Ghan-Jeevamrut', icon: Layers, color: 'text-yellow-400', badge: 'Solid Granules' }
];

const OrganicRecipes = () => {
  const [searchParams] = useSearchParams();
  const queryCrop = searchParams.get('crop');
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState(() => {
    if (queryCrop) {
      const match = CROPS.find(c => c.toLowerCase() === queryCrop.toLowerCase());
      if (match) return match;
    }
    return 'Rice';
  });
  const [areaAcres, setAreaAcres] = useState(2.5);
  const [activeRecipeKey, setActiveRecipeKey] = useState('jeevamrut');
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState(null);

  // Saved fields from My Farm
  const [savedFields, setSavedFields] = useState([]);

  // Load saved fields
  useEffect(() => {
    if (user?.id) {
      try {
        const raw = localStorage.getItem(`agroxai_fields_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSavedFields(parsed);
          if (parsed.length > 0 && parsed[0].area) {
            setAreaAcres(parseFloat(parsed[0].area) || 2.5);
          }
        }
      } catch (e) {
        console.warn('Could not read user fields:', e);
      }
    }
  }, [user]);

  // Fetch ZBNF Recipes
  const fetchRecipes = async (crop = selectedCrop, acres = areaAcres) => {
    try {
      setLoading(true);
      const res = await axios.post(`${getApiBase()}/zbnf-calculator`, {
        crop,
        areaAcres: acres
      });
      if (res.data && res.data.success) {
        setRecipeData(res.data);
      }
    } catch (err) {
      console.error('Failed to load ZBNF recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(selectedCrop, areaAcres);
  }, []);

  const handleFieldSelect = (fieldId) => {
    const f = savedFields.find(field => (field._id || field.id) === fieldId);
    if (f) {
      const acres = parseFloat(f.area) || 2.5;
      setAreaAcres(acres);
      fetchRecipes(selectedCrop, acres);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(selectedCrop, areaAcres);
  };

  const currentRecipe = recipeData?.recipes?.[activeRecipeKey];

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 text-brand-text-primary px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase flex items-center gap-1.5">
                <Leaf size={12} className="animate-pulse" />
                <T>ZERO-BUDGET NATURAL FARMING (ZBNF)</T>
              </span>
              <span className="px-2.5 py-0.5 bg-brand-surface border border-brand-border text-brand-text-tertiary text-[10px] font-bold rounded-full">
                Subhash Palekar Method
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-text-primary tracking-tight uppercase">
              Natural Organic Recipe & Bio-Pesticide Engine
            </h1>
            <p className="text-brand-text-secondary text-base max-w-2xl mt-2 font-medium">
              Eliminate expensive chemical urea, DAP, and pesticides. Calculate exact ingredient quantities for Jeevamrut, Neemastra, Brahmastra, and Beejamrut scaled to your field.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start md:self-end px-4 py-3 bg-brand-surface border border-brand-border hover:border-emerald-500/40 text-brand-text-primary rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer size={14} className="text-emerald-400" /> Print Recipe Card
          </button>
        </div>

        {/* Input Controls Bar */}
        <form onSubmit={handleFormSubmit} className="bg-brand-surface p-5 sm:p-6 rounded-3xl border border-brand-border mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Target Crop */}
            <div>
              <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                Target Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500 font-bold"
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Farm Area in Acres */}
            <div>
              <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                Field Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.25"
                required
                placeholder="e.g. 1"
                value={areaAcres === '' ? '' : areaAcres}
                onFocus={(e) => e.target.select()}
                onClick={(e) => e.target.select()}
                onChange={(e) => {
                  const v = e.target.value;
                  setAreaAcres(v === '' ? '' : v);
                }}
                onBlur={(e) => {
                  const num = parseFloat(e.target.value);
                  setAreaAcres(isNaN(num) || num <= 0 ? 1 : num);
                }}
                className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
              />
            </div>

            {/* Quick Auto-Fill from My Farm */}
            <div>
              <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5 flex items-center gap-1">
                <Layers size={11} className="text-emerald-400" /> Auto-Fill Field
              </label>
              <select
                onChange={(e) => handleFieldSelect(e.target.value)}
                defaultValue=""
                className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-secondary focus:outline-none focus:border-emerald-500"
              >
                <option value="" disabled>Select from My Farm...</option>
                {savedFields.map((f) => (
                  <option key={f._id || f.id} value={f._id || f.id}>
                    {f.name} ({f.area} Acres)
                  </option>
                ))}
              </select>
            </div>

            {/* Calculate Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Recalculate Recipes'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>

        {/* Economic Savings Strip */}
        {recipeData?.economics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-3xl bg-brand-surface border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Chemical Farm Cost</p>
                <p className="text-2xl font-black text-red-400 mt-1">₹{recipeData.economics.chemicalCostTotal?.toLocaleString()}</p>
                <p className="text-[10px] text-brand-text-tertiary mt-0.5">Urea, DAP, synthetic poisons</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold">
                ✕
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-brand-surface border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">ZBNF Natural Cost</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">₹{recipeData.economics.zbnfCostTotal?.toLocaleString()}</p>
                <p className="text-[10px] text-brand-text-tertiary mt-0.5">Besan, jaggery, indigenous cows</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Estimated Farmer Savings</p>
                <p className="text-3xl font-black text-emerald-400 mt-0.5">
                  ₹{recipeData.economics.netSavings?.toLocaleString()}
                </p>
                <p className="text-[10px] text-brand-text-secondary mt-0.5 font-bold">
                  Saves {recipeData.economics.savingsPercentage}% on your {areaAcres} Acres
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                88% Saved
              </div>
            </div>
          </div>
        )}

        {/* ═══ RECIPE TABS SELECTOR ═══ */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {RECIPE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRecipeKey === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRecipeKey(tab.id)}
                className={`px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md font-black'
                    : 'bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary border-brand-border'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-slate-950' : tab.color} />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-brand-bg text-brand-text-tertiary'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ ACTIVE RECIPE DETAIL CARD ═══ */}
        {currentRecipe && (
          <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 mb-10 shadow-sm">
            
            {/* Recipe Title & Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase">
                    Scaled for {areaAcres} Acres
                  </span>
                  <span className="text-brand-text-tertiary text-xs font-bold font-hindi">
                    {currentRecipe.hindiName}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-text-primary uppercase tracking-tight">
                  {currentRecipe.name}
                </h2>
                <p className="text-xs text-brand-text-secondary mt-1 max-w-3xl leading-relaxed">
                  {currentRecipe.purpose}
                </p>
              </div>

              {/* Fermentation & Shelf Life Badges */}
              <div className="flex gap-3">
                <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-center min-w-[110px]">
                  <p className="text-[9px] font-black text-brand-text-tertiary uppercase flex items-center justify-center gap-1">
                    <Clock size={10} className="text-emerald-400" /> Fermentation
                  </p>
                  <p className="text-xs font-black text-brand-text-primary mt-1">{currentRecipe.fermentationDays}</p>
                </div>
                <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-center min-w-[110px]">
                  <p className="text-[9px] font-black text-brand-text-tertiary uppercase flex items-center justify-center gap-1">
                    <ShieldCheck size={10} className="text-teal-400" /> Shelf Life
                  </p>
                  <p className="text-xs font-black text-brand-text-primary mt-1">{currentRecipe.shelfLife}</p>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="py-6 border-b border-brand-border">
              <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Beaker size={16} className="text-emerald-400" /> Exact Scaled Ingredients ({areaAcres} Acres)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border text-[10px] font-black uppercase text-brand-text-tertiary tracking-wider">
                      <th className="pb-3 px-3">Ingredient</th>
                      <th className="pb-3 px-3">Quantity Required</th>
                      <th className="pb-3 px-3">Source & Optimal Selection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-xs">
                    {currentRecipe.ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-brand-text-primary">{ing.name}</td>
                        <td className="py-3 px-3 font-black text-emerald-400 font-mono text-sm">{ing.quantity}</td>
                        <td className="py-3 px-3 text-brand-text-secondary">{ing.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Preparation */}
            <div className="py-6 border-b border-brand-border">
              <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" /> Step-by-Step Preparation Guide
              </h3>

              <div className="space-y-3">
                {currentRecipe.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-brand-bg border border-brand-border">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-brand-text-secondary leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Method & Dosage */}
            <div className="pt-6">
              <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                <Droplets size={16} className="text-teal-400" /> How to Apply to Field
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed bg-brand-bg p-4 rounded-2xl border border-brand-border">
                {currentRecipe.applicationMethod}
              </p>
            </div>

          </div>
        )}

        {/* ═══ 120-DAY CROP SPRAYING & APPLICATION CALENDAR ═══ */}
        {recipeData?.calendar && (
          <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 mb-10 shadow-sm">
            <div className="mb-6">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase">
                SEASONAL PROTOCOL
              </span>
              <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight mt-1">
                {selectedCrop} Natural Farming Spraying Calendar
              </h2>
              <p className="text-xs text-brand-text-secondary mt-1">
                Follow this scheduled application timeline from pre-sowing to harvest to maximize natural pest resistance and yield.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipeData.calendar.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-brand-bg border border-brand-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.timing}
                      </span>
                      <span className="text-[10px] font-black text-brand-text-tertiary uppercase">
                        Stage {idx + 1}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-brand-text-primary uppercase">
                      {item.stage}
                    </h4>

                    <div className="my-2 py-1.5 px-2.5 bg-brand-surface rounded-xl border border-brand-border inline-block">
                      <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                        <Leaf size={12} /> {item.formula}
                      </p>
                    </div>

                    <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ THE 4 PILLARS OF NATURAL FARMING ═══ */}
        {recipeData?.principles && (
          <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8">
            <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              The 4 Pillars of Zero-Budget Natural Farming (ZBNF)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recipeData.principles.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-brand-bg border border-brand-border">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
                    {p.title}
                  </p>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganicRecipes;
