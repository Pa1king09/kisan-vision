import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ChevronDown, Loader2, IndianRupee, Calendar, BarChart2, 
  ArrowUp, ArrowRight, ArrowDown, MapPin, Store, ShieldCheck, AlertTriangle, 
  Clock, ArrowUpRight, Scale, CheckCircle2, Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Tomato', 'Potato', 'Onion', 'Groundnut', 'Soybean', 'Sugarcane', 'Chilli', 'Mustard', 'Bajra', 'Jowar', 'Sunflower', 'Turmeric', 'Ginger', 'Lentil', 'Chickpea', 'Cucumber'];
const SOIL_TYPES = ['Loamy', 'Black (Vertisol)', 'Clay', 'Sandy', 'Red', 'Alluvial', 'Laterite'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const RAINFALL = ['Low', 'Medium', 'High'];
const STATES = [
  'Telangana', 'Punjab', 'Haryana', 'Andhra Pradesh', 'Maharashtra', 
  'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Karnataka', 
  'Tamil Nadu', 'Bihar', 'West Bengal', 'Odisha'
];

const TREND_CONFIG = {
  rising:   { icon: ArrowUp,   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  label: '↑ Rising' },
  stable:   { icon: ArrowRight,color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: '→ Stable' },
  falling:  { icon: ArrowDown, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    label: '↓ Falling' },
  volatile: { icon: BarChart2, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: '⚡ Volatile' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400">{label}</p>
        <p className="text-green-400 font-bold">₹{payload[0]?.value?.toLocaleString('en-IN')}/qtl</p>
      </div>
    );
  }
  return null;
};

export default function MarketForecast() {
  const [searchParams] = useSearchParams();
  const queryCrop = searchParams.get('crop');

  const [form, setForm] = useState({ 
    crop: queryCrop ? (CROPS.find(c => c.toLowerCase() === queryCrop.toLowerCase()) || 'Rice') : 'Rice', 
    land_area_acres: 1, 
    soil_type: 'Loamy', 
    rainfall_level: 'Medium', 
    season: 'Kharif', 
    fertilizer_used: true,
    state: 'Telangana',
    district: 'Warangal'
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedHorizon, setSelectedHorizon] = useState(1); // default to 90-day index

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchForecast = async (formData) => {
    setLoading(true); setData(null);
    try {
      const res = await axios.post(`${API}/yield-forecast`, formData);
      setData(res.data.data);
    } catch { toast.error('Failed to generate forecast.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (queryCrop) {
      const matched = CROPS.find(c => c.toLowerCase() === queryCrop.toLowerCase()) || 'Rice';
      const updated = { ...form, crop: matched };
      setForm(updated);
      fetchForecast(updated);
    }
  }, [queryCrop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchForecast(form);
  };

  const trend = data ? (TREND_CONFIG[data.price_trend] || TREND_CONFIG.stable) : null;
  const liveMandi = data?.live_mandi;
  const harvestHorizons = data?.harvest_horizons;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm mb-4">
            <TrendingUp size={14} /> Yield & Live Mandi Economics
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            APMC Mandi Prices & Harvest Window Forecast
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Real-time APMC Mandi rates, MSP comparisons, and Short-Term Price Forecasting (60 vs 90 vs 120 Days)
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: '🌾 Crop', key: 'crop', options: CROPS },
              { label: '🪨 Soil Type', key: 'soil_type', options: SOIL_TYPES },
              { label: '🌦️ Season', key: 'season', options: SEASONS },
              { label: '🌧️ Rainfall Level', key: 'rainfall_level', options: RAINFALL },
              { label: '📍 State', key: 'state', options: STATES },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <div className="relative">
                  <select value={form[key]} onChange={e => setField(key, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 appearance-none focus:outline-none focus:border-green-500 transition-colors">
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-500" size={13} />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">🏢 District / APMC</label>
              <input type="text" value={form.district}
                onChange={e => setField('district', e.target.value)}
                placeholder="e.g. Warangal, Ludhiana"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">📐 Land Area (Acres)</label>
              <input 
                type="number" 
                step="0.5" 
                min="0.5" 
                placeholder="e.g. 1"
                value={form.land_area_acres === '' ? '' : form.land_area_acres}
                onFocus={(e) => e.target.select()}
                onClick={(e) => e.target.select()}
                onChange={e => {
                  const v = e.target.value;
                  setField('land_area_acres', v === '' ? '' : v);
                }}
                onBlur={e => {
                  const num = parseFloat(e.target.value);
                  setField('land_area_acres', isNaN(num) || num <= 0 ? 1 : num);
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer w-full pb-2">
                <div onClick={() => setField('fertilizer_used', !form.fertilizer_used)}
                  className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${form.fertilizer_used ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${form.fertilizer_used ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-xs text-gray-300">Using Fertilizer?</span>
              </label>
            </div>

            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Querying APMC Mandi & Forecasting...</> : <><TrendingUp size={18} /> Run Market & Harvest Forecast</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* 1. Live APMC Mandi & Government MSP Section */}
            {liveMandi && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Store size={18} className="text-green-400" /> {liveMandi.primary_mandi}
                        </h2>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> eNAM / Agmarknet
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {liveMandi.district}, {liveMandi.state} • Daily Govt Mandi Feed ({liveMandi.last_updated})
                      </p>
                    </div>
                  </div>

                  {/* MSP Status Pill */}
                  <div className="flex items-center gap-2">
                    {liveMandi.msp_status === 'above_msp' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                        <ShieldCheck size={14} /> +₹{liveMandi.msp_diff}/qtl Above Govt MSP (+{liveMandi.msp_percentage}%)
                      </span>
                    )}
                    {liveMandi.msp_status === 'below_msp' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                        <AlertTriangle size={14} /> ₹{Math.abs(liveMandi.msp_diff)}/qtl Below Govt MSP (-{liveMandi.msp_percentage}%)
                      </span>
                    )}
                    {liveMandi.msp_status === 'no_msp' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-700 text-gray-300 text-xs font-medium">
                        Market-Driven Pricing (No Official MSP)
                      </span>
                    )}
                  </div>
                </div>

                {/* Mandi Price Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
                  <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Modal Mandi Rate</span>
                    <p className="text-2xl font-black text-green-400 mt-1">₹{liveMandi.modal_price?.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-gray-400">per quintal</span>
                  </div>
                  <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Mandi Price Range</span>
                    <p className="text-lg font-bold text-gray-200 mt-1">₹{liveMandi.min_price} – ₹{liveMandi.max_price}</p>
                    <span className="text-[10px] text-gray-400">Min - Max Range</span>
                  </div>
                  <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Govt Notified MSP</span>
                    <p className="text-xl font-bold text-blue-400 mt-1">
                      {liveMandi.msp ? `₹${liveMandi.msp?.toLocaleString('en-IN')}` : 'Market Driven'}
                    </p>
                    <span className="text-[10px] text-gray-400">CACP Benchmark (2024-25)</span>
                  </div>
                  <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Market Liquidity</span>
                    <p className="text-lg font-bold text-yellow-400 mt-1">High Liquidity</p>
                    <span className="text-[10px] text-gray-400">Active Procurement</span>
                  </div>
                </div>

                {/* Mandi Advice */}
                <div className="p-3.5 bg-gray-900/50 rounded-xl border border-gray-700/40 mb-4 text-xs text-gray-300 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
                  <p>{liveMandi.msp_advice}</p>
                </div>

                {/* Nearby Mandis for Price Arbitrage */}
                {liveMandi.nearby_mandis && liveMandi.nearby_mandis.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Nearby APMC Mandis (Regional Price Arbitrage)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {liveMandi.nearby_mandis.map((nm, idx) => (
                        <div key={idx} className="p-3 bg-gray-900/40 rounded-xl border border-gray-700/30 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-gray-200">{nm.mandi}</p>
                            <span className="text-[10px] text-gray-400">~{nm.distance_km} km away</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-green-400">₹{nm.modal_price}/qtl</span>
                            <span className="block text-[9px] text-gray-400">{nm.arrival_quintals} qtl arrivals</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Short-Term Price Forecasting (60 vs 90 vs 120 Days Harvest Windows) */}
            {harvestHorizons && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">Short-Term Harvest Horizon Forecast</h2>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          ARIMA / Prophet Engine
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Predicting supply arrival gluts vs peak demand: Day 60 vs Day 90 vs Day 120
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold self-start sm:self-auto">
                    Timing Advantage: Up to {harvestHorizons.potential_timing_gain} Gain
                  </div>
                </div>

                {/* 3 Harvest Horizon Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  {harvestHorizons.horizons.map((h, idx) => {
                    const isOptimal = idx === 2 || idx === 0;
                    const isGlut = idx === 1;

                    return (
                      <div key={idx} className={`p-5 rounded-2xl border transition-all ${
                        isGlut 
                          ? 'bg-red-500/5 border-red-500/20' 
                          : 'bg-green-500/5 border-green-500/20'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-gray-300">
                            {h.label}
                          </span>
                          {isGlut ? (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                              Glut Risk
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                              Recommended
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <span className="text-2xl font-black text-white">₹{h.projected_price}</span>
                          <span className="text-xs text-gray-400"> / quintal</span>
                        </div>

                        <div className="space-y-1.5 text-xs text-gray-300 mb-4 pb-4 border-b border-gray-700/50">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Demand Regime:</span>
                            <span className="font-semibold text-gray-200">{h.demand_status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mandi Arrivals:</span>
                            <span className="font-semibold text-gray-200">{h.arrival_pressure}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Projected Revenue:</span>
                            <span className="font-bold text-green-400">₹{h.est_total_revenue?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 leading-snug">
                          {h.strategy}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/40 text-xs text-gray-300 flex items-start gap-3">
                  <Scale size={18} className="text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Strategic Harvest Timing Recommendation:</span>
                    <p>{harvestHorizons.decision_summary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Key Yield Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{data.expected_yield_per_acre}</div>
                <div className="text-xs text-gray-400 mt-1">{data.yield_unit?.split('/')[0]} per Acre</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{data.total_yield}</div>
                <div className="text-xs text-gray-400 mt-1">Total Quintals</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-yellow-400">{data.estimated_revenue}</div>
                <div className="text-xs text-gray-400 mt-1">Est. Gross Revenue</div>
              </div>
              <div className={`border rounded-xl p-4 text-center ${data.profit_value >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className={`text-xl font-bold ${data.profit_value >= 0 ? 'text-green-400' : 'text-red-400'}`}>{data.net_profit}</div>
                <div className="text-xs text-gray-400 mt-1">Net Farm Profit</div>
              </div>
            </div>

            {/* 4. Revenue Breakdown */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><IndianRupee size={14} /> Revenue & Cost Structure</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Revenue', value: data.revenue_value, color: 'bg-green-500' },
                  { label: 'Input Cost', value: data.cost_value, color: 'bg-red-400' },
                  { label: 'Net Profit', value: Math.abs(data.profit_value), color: data.profit_value >= 0 ? 'bg-emerald-500' : 'bg-orange-500' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{label}</span>
                      <span className="font-medium text-white">₹{value?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, (value / data.revenue_value) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Monthly Price Trend Chart */}
            {data.price_trend_chart && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BarChart2 size={16} className="text-green-400" /> 12-Month Price Trend (₹/quintal)
                  </h3>
                  <div className={`flex items-center gap-2 ${trend.color}`}>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${trend.bg} ${trend.border}`}>{trend.label}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.price_trend_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="price" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
