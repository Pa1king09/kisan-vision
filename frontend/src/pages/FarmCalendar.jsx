import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Loader2, Droplets, Wheat, AlertTriangle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Tomato', 'Potato', 'Onion', 'Groundnut', 'Soybean', 'Sugarcane', 'Chilli', 'Mustard', 'Bajra', 'Jowar', 'Sunflower'];
const SEASONS = ['Kharif (Monsoon - June to Oct)', 'Rabi (Winter - Nov to Mar)', 'Zaid (Summer - Mar to Jun)'];

const PHASE_COLORS = {
  'Land Preparation': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Nursery & Sowing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Sowing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Transplanting': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Vegetative Growth': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Vegetative Growth (Early)': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Vegetative Growth (Late)': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Crown Root Initiation': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Tillering': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Active Tillering': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Jointing & Booting': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Flowering': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Heading & Flowering': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Grain Filling': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Fruit/Grain Development': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Maturity': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Maturity & Harvest': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Harvest': 'bg-red-600/20 text-red-300 border-red-600/30',
};

function getPhaseColor(phase) {
  for (const [key, val] of Object.entries(PHASE_COLORS)) {
    if (phase?.includes(key.split(' ')[0])) return val;
  }
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export default function FarmCalendar() {
  const [searchParams] = useSearchParams();
  const queryCrop = searchParams.get('crop');
  const [form, setForm] = useState({ 
    crop: queryCrop ? (CROPS.find(c => c.toLowerCase() === queryCrop.toLowerCase()) || 'Rice') : 'Rice', 
    season: 'Kharif (Monsoon - June to Oct)', 
    sow_date: '' 
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);

  const fetchCalendar = async (selectedCrop, selectedSeason, sowDate) => {
    setLoading(true);
    setData(null);
    try {
      const res = await axios.post(`${API}/farm-calendar`, {
        crop: selectedCrop,
        season: selectedSeason.split(' ')[0],
        sow_date: sowDate || null,
      });
      setData(res.data.data);
      setExpandedWeek(null);
    } catch {
      toast.error('Failed to generate calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryCrop) {
      const matched = CROPS.find(c => c.toLowerCase() === queryCrop.toLowerCase()) || 'Rice';
      setForm(prev => ({ ...prev, crop: matched }));
      fetchCalendar(matched, form.season, form.sow_date);
    }
  }, [queryCrop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchCalendar(form.crop, form.season, form.sow_date);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm mb-4">
            <Calendar size={14} /> Smart Farm Calendar
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Week-by-Week Farming Guide</h1>
          <p className="text-gray-400">Get a complete 16-week cultivation plan with activities, irrigation, and fertilizer schedule</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">🌾 Crop</label>
              <div className="relative">
                <select value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 appearance-none focus:outline-none focus:border-green-500 transition-colors">
                  {CROPS.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-500" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">🌦️ Season</label>
              <div className="relative">
                <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 appearance-none focus:outline-none focus:border-green-500 transition-colors">
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-500" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">📅 Sowing Date (Optional)</label>
              <input type="date" value={form.sow_date} onChange={e => setForm(f => ({ ...f, sow_date: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Generating Calendar...</> : <><Calendar size={18} /> Generate 16-Week Calendar</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Calendar Results */}
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Summary */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{data.crop} — {data.season} Season</h2>
                <p className="text-gray-400 text-sm">16-week cultivation guide • Click any week to expand details</p>
              </div>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm text-gray-300 transition-all">
                <Printer size={14} /> Print Calendar
              </button>
            </div>

            {/* Phase Legend */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Land Preparation', 'Sowing', 'Vegetative Growth', 'Flowering', 'Grain Filling', 'Maturity & Harvest'].map(phase => (
                <span key={phase} className={`text-xs px-3 py-1 rounded-full border ${getPhaseColor(phase)}`}>{phase}</span>
              ))}
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.calendar.map((week) => (
                <motion.div key={week.week} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: week.week * 0.03 }}>
                  <button onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                    className={`w-full text-left bg-gray-800/50 border rounded-xl p-4 transition-all hover:border-green-500/50 ${expandedWeek === week.week ? 'border-green-500/50 bg-gray-800' : 'border-gray-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">WEEK {week.week}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPhaseColor(week.phase)}`}>{week.phase.split(' ')[0]}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{week.title}</h3>
                    {week.date_range && <p className="text-xs text-green-400 mb-1">{week.date_range}</p>}
                    <p className="text-xs text-gray-400 line-clamp-2">{week.activities?.[0]}</p>
                  </button>

                  {/* Expanded Details */}
                  {expandedWeek === week.week && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 bg-gray-800 border border-green-500/30 rounded-xl p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-green-400 mb-1">📋 Activities</div>
                        <ul className="space-y-1">
                          {week.activities?.map((a, i) => <li key={i} className="text-xs text-gray-300 flex gap-2"><span className="text-green-500">•</span>{a}</li>)}
                        </ul>
                      </div>
                      {week.irrigation && (
                        <div>
                          <div className="text-xs font-semibold text-blue-400 mb-1 flex gap-1"><Droplets size={11} /> Irrigation</div>
                          <p className="text-xs text-gray-300">{week.irrigation}</p>
                        </div>
                      )}
                      {week.fertilizer && (
                        <div>
                          <div className="text-xs font-semibold text-yellow-400 mb-1 flex gap-1"><Wheat size={11} /> Fertilizer</div>
                          <p className="text-xs text-gray-300">{week.fertilizer}</p>
                        </div>
                      )}
                      {week.watch_out && (
                        <div className="flex gap-2 bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                          <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-300">{week.watch_out}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
