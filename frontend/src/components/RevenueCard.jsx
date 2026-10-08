import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import T, { TD, TList } from './T';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Info, LandPlot, BadgeIndianRupee, Zap, Gauge, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import TiltCard from './effects/TiltCard';

import { getActiveApiUrl } from '../utils/mobileInit';

const getApiUrl = () => getActiveApiUrl();
const API = getApiUrl();

const RevenueCard = ({ crop, rainfall, season }) => {
    const { t } = useLanguage();
    const [landArea, setLandArea] = useState(1);
    const [soilQuality, setSoilQuality] = useState('Good');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const safeCrop = crop || 'Rice';
    const safeRainfall = rainfall || 'Medium';
    const safeSeason = season || 'Monsoon';

    const handleCalculate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);
        try {
            const apiBase = getActiveApiUrl().replace(/\/+$/, '');
            const response = await axios.post(`${apiBase}/revenue-prediction`, {
                crop: safeCrop,
                rainfall_level: safeRainfall,
                season: safeSeason,
                land_area_acres: Number(landArea) || 1,
                soil_quality: soilQuality
            });
            setPrediction(response.data.data);
            toast.success(t('Revenue analysis complete!') || 'Revenue analysis complete!');
        } catch (error) {
            console.error('Revenue prediction error:', error);
            toast.error(t('Prediction failed. Ensure backend is running.') || 'Prediction failed. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TiltCard maxTilt={5} glowColor="emerald" className="mt-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-card border-brand-green/10"
            >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        💰 <span className="text-brand-green"><T>Revenue</T></span> <T>Predictor</T>
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1">Estimating profitability based on market MSP (2024-25) and crop yield.</T>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-6 py-2 bg-brand-green/10 rounded-2xl border border-brand-green/20">
                        <span className="text-xs font-black text-brand-green uppercase tracking-[0.2em]"><TD value={crop} /> <T>Model</T></span>
                    </div>
                    <Link
                        to={`/market-forecast?crop=${encodeURIComponent(crop || 'Rice')}`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                        <TrendingUp size={14} /> <T>Full Market Forecast</T> →
                    </Link>
                </div>
            </div>

            <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                <div className="space-y-2">
                    <T as="label" className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2em] ml-2">Land Area (Acres)</T>
                    <div className="relative">
                        <LandPlot size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive opacity-40" />
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="e.g. 1"
                            className="input-field pl-12 focus:ring-brand-green/50"
                            value={landArea}
                            onFocus={(e) => e.target.select()}
                            onClick={(e) => e.target.select()}
                            onChange={(e) => setLandArea(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <T as="label" className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2em] ml-2">Soil Analytical Quality</T>
                    <div className="relative">
                        <Gauge size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive opacity-40" />
                        <select
                            className="input-field pl-12 focus:ring-brand-green/50"
                            value={soilQuality}
                            onChange={(e) => setSoilQuality(e.target.value)}
                        >
                            <option value="Excellent">{t('Excellent') || 'Excellent'}</option>
                            <option value="Good">{t('Good') || 'Good'}</option>
                            <option value="Average">{t('Average') || 'Average'}</option>
                            <option value="Poor">{t('Poor') || 'Poor'}</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? <T>Processing...</T> : <T>Calculate Revenue</T>} <Zap size={18} />
                </button>
            </form>

            <AnimatePresence>
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-10"
                    >
                        {/* Main Profit Display */}
                        <div className="bg-brand-surface-elevated p-10 rounded-[2.5rem] relative overflow-hidden group border border-brand-border">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <BadgeIndianRupee size={150} className="text-brand-text-primary" />
                            </div>

                            <div className="relative z-10 text-center">
                                <T as="h4" className="text-brand-green font-black uppercase tracking-[0.3em] mb-4">Estimated Net Profit</T>
                                <div className="text-6xl md:text-8xl font-black text-brand-text-primary italic tracking-tighter mb-4">
                                    ₹<CountUp end={prediction.net_profit} duration={2} separator="," />
                                </div>
                                <p className="text-brand-text-secondary text-[10px] uppercase font-bold tracking-[0.2em]">
                                    <T>Based on</T> {prediction.land_area_acres} <T>acres of</T> <TD value={prediction.crop_used} />
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-10 border-t border-brand-border pt-10 relative z-10">
                                <div className="text-center">
                                    <T as="p" className="text-brand-text-secondary text-[10px] uppercase font-black tracking-widest mb-1">Gross Revenue</T>
                                    <p className="text-xl font-bold text-brand-text-primary">₹{prediction.gross_revenue.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <T as="p" className="text-red-500 text-[10px] uppercase font-black tracking-widest mb-1 italic">Est. Input Costs</T>
                                    <p className="text-xl font-bold text-brand-text-primary">₹{prediction.input_cost.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Ranges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 block">Conservative</T>
                                <p className="text-lg font-black text-brand-dark">₹{Number(prediction.revenue_range?.conservative || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-brand-green/10 border border-brand-green/20 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-brand-green uppercase tracking-widest mb-2 block">Realistic</T>
                                <p className="text-2xl font-black text-brand-dark">₹{Number(prediction.revenue_range?.realistic || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-2 block">Optimistic</T>
                                <p className="text-lg font-black text-brand-dark">₹{Number(prediction.revenue_range?.optimistic || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Breakdown Table */}
                        <div className="space-y-6">
                            <h5 className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2rem] flex items-center gap-2">
                                <Info size={14} /> <T>Yield Breakdown</T>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(prediction.yield_breakdown || []).map((item, idx) => (
                                    <div key={idx} className="bg-brand-surface-inset p-4 rounded-2xl border border-brand-border flex justify-between items-center">
                                        <TD value={item.factor} as="span" className="text-[10px] font-bold text-brand-text-secondary uppercase" />
                                        <span className="text-sm font-black text-brand-dark">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live APMC Mandi & MSP Live Status */}
                        {prediction.live_mandi && (
                            <div className="p-5 bg-brand-surface rounded-3xl border border-brand-border space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                                            <BadgeIndianRupee size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-brand-text-primary uppercase tracking-tight">
                                                {prediction.live_mandi.primary_mandi} (eNAM / Agmarknet)
                                            </p>
                                            <span className="text-[10px] text-brand-text-secondary">
                                                Modal: ₹{prediction.live_mandi.modal_price}/qtl • Range: ₹{prediction.live_mandi.min_price} - ₹{prediction.live_mandi.max_price}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {prediction.live_mandi.msp_status === 'above_msp' && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                Above MSP: +₹{prediction.live_mandi.msp_diff}/qtl (+{prediction.live_mandi.msp_percentage}%)
                                            </span>
                                        )}
                                        {prediction.live_mandi.msp_status === 'below_msp' && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                Below MSP: -₹{Math.abs(prediction.live_mandi.msp_diff)}/qtl (-{prediction.live_mandi.msp_percentage}%)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[11px] text-brand-text-secondary leading-snug">
                                    {prediction.live_mandi.msp_advice}
                                </p>
                            </div>
                        )}

                        {/* Short-Term Harvest Timing Horizon Highlight */}
                        {prediction.harvest_horizons && (
                            <div className="p-5 bg-purple-500/5 rounded-3xl border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-0.5">
                                        Harvest Timing Strategy (60 vs 90 vs 120 Days)
                                    </span>
                                    <p className="text-xs text-brand-text-secondary leading-snug">
                                        {prediction.harvest_horizons.decision_summary}
                                    </p>
                                </div>
                                <Link
                                    to={`/market-forecast?crop=${encodeURIComponent(crop || 'Rice')}`}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shrink-0 flex items-center gap-1 shadow-sm transition-all"
                                >
                                    View Simulator →
                                </Link>
                            </div>
                        )}

                        <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                                        <Wallet size={20} />
                                    </div>
                                    <T as="p" className="text-xs font-black text-brand-text-primary uppercase">MSP Rate Used (2024-25)</T>
                                </div>
                                <span className="text-sm font-black text-brand-green">₹{prediction.msp_used} / {prediction.crop_used === 'Sugarcane' ? <T>Tonne</T> : <T>Quintal</T>}</span>
                            </div>
                            <p className="text-[10px] text-brand-text-secondary font-medium italic leading-relaxed pt-4 border-t border-brand-border">
                                * <TD value={prediction.disclaimer} />
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </motion.div>
        </TiltCard>
    );
};

export default RevenueCard;
