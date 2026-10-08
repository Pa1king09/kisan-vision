import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, Calendar, Crown, TrendingUp, Sprout, Scale, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import T, { TD } from './T';
import CropImage from './CropImage';

// Static crop metadata for comparison cards
const CROP_DB = {
    'rice':             { water: 'High',   climate: 'Tropical',   duration: '120-150 days', emoji: '🌾' },
    'wheat (gehun)':    { water: 'Medium', climate: 'Temperate',  duration: '100-120 days', emoji: '🌾' },
    'maize (corn)':     { water: 'Medium', climate: 'Warm',       duration: '80-110 days',  emoji: '🌽' },
    'cotton (kapash)':  { water: 'Medium', climate: 'Semi-Arid',  duration: '150-180 days', emoji: '🧶' },
    'sunflower (surajmukhi)': { water: 'Low', climate: 'Semi-Arid', duration: '80-100 days', emoji: '🌻' },
    'mung bean (green gram/moong)': { water: 'Low', climate: 'Warm', duration: '60-75 days', emoji: '🫘' },
    'pigeon peas (tur/arhar)':      { water: 'Low', climate: 'Tropical', duration: '120-180 days', emoji: '🫛' },
    'lentil (masoor)':  { water: 'Low',    climate: 'Cool',       duration: '90-110 days',  emoji: '🫘' },
    'kidney beans (rajma)': { water: 'Medium', climate: 'Cool',   duration: '90-120 days',  emoji: '🫘' },
    'papaya':           { water: 'High',   climate: 'Tropical',   duration: '270-365 days', emoji: '🍈' },
    'banana':           { water: 'High',   climate: 'Tropical',   duration: '300-365 days', emoji: '🍌' },
    'mango':            { water: 'Medium', climate: 'Tropical',   duration: '100-150 days', emoji: '🥭' },
    'grapes':           { water: 'Medium', climate: 'Temperate',  duration: '150-180 days', emoji: '🍇' },
    'pomegranate':      { water: 'Low',    climate: 'Semi-Arid',  duration: '150-180 days', emoji: '🍎' },
    'orange (santra)':  { water: 'Medium', climate: 'Subtropical', duration: '240-365 days', emoji: '🍊' },
    'coconut':          { water: 'High',   climate: 'Tropical',   duration: '365+ days',    emoji: '🥥' },
    'jute':             { water: 'High',   climate: 'Tropical',   duration: '100-120 days', emoji: '🧵' },
    'coffee':           { water: 'High',   climate: 'Tropical',   duration: '270-365 days', emoji: '☕' },
    'moth beans':       { water: 'Low',    climate: 'Arid',       duration: '60-75 days',   emoji: '🫘' },
    'soybean (soyabean)': { water: 'Medium', climate: 'Warm',     duration: '80-120 days',  emoji: '🫘' },
    'watermelon':       { water: 'Medium', climate: 'Warm',       duration: '70-90 days',   emoji: '🍉' },
    'muskmelon (kharbuja)': { water: 'Medium', climate: 'Warm',   duration: '65-85 days',   emoji: '🍈' },
    'apple':            { water: 'Medium', climate: 'Temperate',  duration: '150-180 days', emoji: '🍎' },
    'potato (aloo)':    { water: 'Medium', climate: 'Cool',       duration: '75-120 days',  emoji: '🥔' },
    'tomato (tamatar)': { water: 'Medium', climate: 'Warm',       duration: '60-85 days',   emoji: '🍅' },
    'onion (pyaaz)':    { water: 'Medium', climate: 'Cool-Warm',  duration: '90-150 days',  emoji: '🧅' },
    'garlic (lehsun)':  { water: 'Low',    climate: 'Cool',       duration: '90-150 days',  emoji: '🧄' },
    'pumpkin (kaddu)':  { water: 'Medium', climate: 'Warm',       duration: '90-120 days',  emoji: '🎃' },
    'cucumber (kheera)':{ water: 'High',   climate: 'Warm',       duration: '50-70 days',   emoji: '🥒' },
    'lady finger (okra/bhindi)': { water: 'Medium', climate: 'Warm', duration: '45-65 days', emoji: '🫛' },
    'jowar (sorghum)':  { water: 'Low',    climate: 'Semi-Arid',  duration: '90-120 days',  emoji: '🌾' },
    'bajra (pearl millet)': { water: 'Low', climate: 'Arid',      duration: '65-85 days',   emoji: '🌾' },
    'ragi (finger millet)': { water: 'Low', climate: 'Semi-Arid', duration: '90-120 days',  emoji: '🌾' },
    'rapeseed (sarson)':{ water: 'Low',    climate: 'Cool',       duration: '90-130 days',  emoji: '🌼' },
    'turmeric (haldi)': { water: 'High',   climate: 'Tropical',   duration: '240-300 days', emoji: '🟡' },
    'pineapple (ananas)':{ water: 'High',  climate: 'Tropical',   duration: '365-540 days', emoji: '🍍' },
    'sweet potato (shakarkandi)': { water: 'Medium', climate: 'Warm', duration: '90-120 days', emoji: '🍠' },
    'radish (mooli)':   { water: 'Medium', climate: 'Cool',       duration: '25-40 days',   emoji: '🫛' },
    'horse gram (kulthi)':{ water: 'Low',  climate: 'Semi-Arid',  duration: '90-120 days',  emoji: '🫘' },
    'drumstick (moringa/sahjan)': { water: 'Low', climate: 'Tropical', duration: '180-365 days', emoji: '🥬' },
    'jackfruit (kathal)':{ water: 'Medium', climate: 'Tropical',  duration: '150-180 days', emoji: '🍈' },
};

const DEFAULT_META = { water: 'Medium', climate: 'Moderate', duration: '90-120 days', emoji: '🌱' };

const getWaterColor = (level) => {
    if (level === 'High') return 'text-blue-500';
    if (level === 'Low') return 'text-amber-500';
    return 'text-cyan-500';
};

const getSuitability = (conf) => {
    if (conf >= 0.75) return { label: 'Excellent', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (conf >= 0.40) return { label: 'Good', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Fair', color: 'text-orange-600 bg-orange-50 border-orange-200' };
};

const CropComparisonPanel = ({ crops, contrastiveTradeoffs }) => {
    if (!crops || crops.length < 2) return null;

    const top3 = crops.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} className="text-brand-primary" />
                    </div>
                    <div>
                        <T as="h3" className="text-lg font-black text-brand-text-primary uppercase tracking-tight">Crop Trade-Off Matrix</T>
                        <T as="p" className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Contrastive Explainable AI (Why Crop #1 over alternatives?)</T>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-surface rounded-xl border border-brand-border text-[10px] font-bold text-brand-text-secondary">
                    <Scale size={14} className="text-brand-primary" />
                    <T>Contrastive Analysis</T>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {top3.map((c, i) => {
                    const meta = CROP_DB[c.crop?.toLowerCase()] || DEFAULT_META;
                    const suit = getSuitability(c.confidence);
                    const isBest = i === 0;

                    // Match contrastive data for non-primary crops
                    const comp = contrastiveTradeoffs?.comparisons?.find(
                        item => item.crop?.toLowerCase() === c.crop?.toLowerCase()
                    ) || contrastiveTradeoffs?.comparisons?.[i - 1];

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className={`relative rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between ${
                                isBest
                                    ? 'bg-brand-primary text-brand-bg border-brand-primary/30 shadow-premium-hover scale-[1.02]'
                                    : 'bg-brand-surface-inset border-brand-border shadow-premium hover:shadow-premium-hover hover:-translate-y-1'
                            }`}
                        >
                            {isBest && (
                                <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                    <Crown size={10} /> <T>BEST MATCH</T>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3.5 mb-5">
                                    <CropImage 
                                        key={c.crop}
                                        crop={c.crop} 
                                        size="sm" 
                                        rounded="rounded-2xl" 
                                        className={`shadow-md border ${isBest ? 'border-white/30 ring-2 ring-white/20' : 'border-brand-border'}`} 
                                    />
                                    <div>
                                        <p className={`text-lg font-black capitalize ${isBest ? 'text-brand-bg' : 'text-brand-text-primary'}`}>
                                            <TD value={c.crop} />
                                        </p>
                                        <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${suit.color}`}>
                                            <TD value={suit.label} />
                                        </span>
                                    </div>
                                </div>

                                {/* Confidence bar */}
                                <div className="mb-5">
                                    <div className="flex justify-between mb-1.5">
                                        <T className={`text-[10px] font-bold uppercase tracking-widest ${isBest ? 'text-brand-bg/60' : 'text-slate-400'}`}>Confidence</T>
                                        <span className={`text-sm font-black ${isBest ? 'text-brand-bg' : 'text-brand-text-primary'}`}>
                                            <CountUp end={+(c.confidence * 100).toFixed(1)} decimals={1} duration={1.5} suffix="%" />
                                        </span>
                                    </div>
                                    <div className={`w-full h-2 rounded-full overflow-hidden ${isBest ? 'bg-black/15' : 'bg-brand-border'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${c.confidence * 100}%` }}
                                            transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }}
                                            className={`h-full rounded-full ${isBest ? 'bg-brand-bg' : 'bg-brand-primary/70'}`}
                                        />
                                    </div>
                                </div>

                                {/* Details grid */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Droplets size={14} className={isBest ? 'text-brand-bg/70' : getWaterColor(meta.water)} />
                                        <T className={`text-xs font-bold ${isBest ? 'text-brand-bg/80' : 'text-brand-text-secondary'}`}>Water Need:</T>
                                        <TD className={`text-xs font-black ${isBest ? 'text-brand-bg' : 'text-brand-text-primary'}`} value={meta.water} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Thermometer size={14} className={isBest ? 'text-brand-bg/70' : 'text-orange-400'} />
                                        <T className={`text-xs font-bold ${isBest ? 'text-brand-bg/80' : 'text-brand-text-secondary'}`}>Climate:</T>
                                        <TD className={`text-xs font-black ${isBest ? 'text-brand-bg' : 'text-brand-text-primary'}`} value={meta.climate} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={14} className={isBest ? 'text-brand-bg/70' : 'text-emerald-500'} />
                                        <T className={`text-xs font-bold ${isBest ? 'text-brand-bg/80' : 'text-brand-text-secondary'}`}>Duration:</T>
                                        <TD className={`text-xs font-black ${isBest ? 'text-brand-bg' : 'text-brand-text-primary'}`} value={meta.duration} />
                                    </div>
                                </div>
                            </div>

                            {/* Contrastive Reason / Trade-Off Explanation */}
                            {isBest ? (
                                <div className="mt-4 pt-4 border-t border-brand-bg/20">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-bg/90 mb-1">
                                        <Sparkles size={12} /> <T>Winning Agronomic Advantage</T>
                                    </div>
                                    <p className="text-xs font-semibold text-brand-bg/95 leading-snug">
                                        <TD value={contrastiveTradeoffs?.comparisons?.[0]?.primary_advantage?.interpretation || "Demonstrates highest nutrient balance & environmental resilience across all parameters."} />
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-brand-border">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
                                        <Scale size={12} /> <T>Why Ranked Below #1?</T>
                                    </div>
                                    <p className="text-xs font-semibold text-brand-text-secondary leading-snug mb-2">
                                        <TD value={comp?.contrastive_reason || `${top3[0]?.crop} was preferred due to better nutrient & moisture adaptation.`} />
                                    </p>
                                    {comp?.limiting_factors && comp.limiting_factors.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {comp.limiting_factors.map((lf, lIdx) => (
                                                <span key={lIdx} className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    <TD value={lf.shortfall_or_excess} />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default CropComparisonPanel;
