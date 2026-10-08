import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import CountUp from 'react-countup';
import T from './T';
import CropImage from './CropImage';
import TiltCard from './effects/TiltCard';

const CropRecommendationCard = ({ crop, confidence, season, result }) => {
    const [barWidth, setBarWidth] = useState(0);
    const confPercent = (confidence * 100).toFixed(1);

    // Animate the confidence bar on mount
    useEffect(() => {
        const timer = setTimeout(() => setBarWidth(confidence * 100), 200);
        return () => clearTimeout(timer);
    }, [confidence]);

    return (
        <TiltCard maxTilt={5} glowColor="emerald" className="mb-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-brand-surface-elevated rounded-[3rem] p-12 relative overflow-hidden shadow-premium-hover border border-brand-border"
            >
            <div className="absolute top-8 right-8 flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
                <CheckCircle size={14} className="text-emerald-400" />
                <T as="span" className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">KISANVISION VERIFIED</T>
            </div>

            <T as="p" className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Recommended Crop</T>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-brand-text-primary tracking-tighter italic leading-none capitalize">
                        <T>{crop}</T>
                    </h2>
                </div>
                <div className="shrink-0 flex items-center">
                    <CropImage 
                        key={crop}
                        crop={crop} 
                        size="hero" 
                        rounded="rounded-3xl" 
                        showBadge={true} 
                        priority={true}
                        className="shadow-2xl ring-4 ring-brand-primary/20 hover:ring-brand-primary/40 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Animated Confidence Bar */}
            <div className="mb-10">
                <div className="flex items-end justify-between mb-3">
                    <T as="span" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">AI Confidence Score</T>
                    <span className="text-3xl font-black text-brand-text-primary tabular-nums">
                        <CountUp end={parseFloat(confPercent)} decimals={1} duration={1.5} suffix="%" />
                    </span>
                </div>
                <div className="w-full h-2.5 bg-brand-surface-inset rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full confidence-bar-fill"
                        style={{
                            width: `${barWidth}%`,
                            background: barWidth > 80
                                ? 'linear-gradient(90deg, #1F7A63, #10B981)'
                                : barWidth > 50
                                    ? 'linear-gradient(90deg, #F59E0B, #EAB308)'
                                    : 'linear-gradient(90deg, #EF4444, #F97316)'
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-2.5 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl">
                    <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                    <T>Confidence</T>: {confPercent}%
                </span>
                <span className="flex items-center gap-2.5 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl">
                    <CheckCircle size={14} className="text-brand-primary" /> <T>Soil Advice Included</T>
                </span>
                <span className="flex items-center gap-2.5 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl">
                    🗓️ <T>{season}</T>
                </span>
                {result?.total_duration && (
                    <span className="flex items-center gap-2.5 bg-brand-primary/20 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl">
                        ⏱️ <T>Growth Period</T>: {result.total_duration}
                    </span>
                )}
                {result?.climate_zone && (
                    <span className="flex items-center gap-2.5 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl">
                        🌍 <T>{result.climate_zone}</T>
                    </span>
                )}
            </div>

            {/* Alternative crops with stagger animation */}
            {result?.recommended_crops && result.recommended_crops.length > 1 && (
                <div className="mt-10 pt-8 border-t border-brand-border">
                    <T as="p" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-6">Alternative Matches</T>
                    <div className="flex gap-4 flex-wrap">
                        {result.recommended_crops.slice(1).map((c, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                                className="flex items-center gap-2.5 px-4 py-2 bg-brand-surface-inset border border-brand-border text-brand-text-secondary text-xs font-bold rounded-2xl capitalize hover:bg-brand-surface hover:border-brand-primary/30 transition-all cursor-default shadow-sm"
                            >
                                <CropImage crop={c.crop} size="xs" rounded="rounded-lg" />
                                <span className="text-brand-primary/60 font-black mr-0.5">#{i + 2}</span> <T>{c.crop}</T> — {(c.confidence * 100).toFixed(0)}%
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Soil treatment snippet */}
            {result?.mapped_values && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-10 bg-brand-surface border border-brand-border rounded-[2rem] p-8 flex items-start gap-6 group hover:bg-brand-surface-hover transition-all"
                >
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-xl">🗺️</span>
                    </div>
                    <div>
                        <T as="p" className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-2">Soil Treatment Recommendation</T>
                        <T as="p" className="text-base text-brand-text-secondary font-medium leading-relaxed">
                            {result.mapped_values.N >= 50 && result.mapped_values.P >= 40 && result.mapped_values.K >= 40
                                ? 'Soil nutrient balance is optimal for high yield. No immediate supplement required.'
                                : `Supplement soil — N: ${result.mapped_values.N}, P: ${result.mapped_values.P}, K: ${result.mapped_values.K}, pH: ${result.mapped_values.ph?.toFixed(1)}`
                            }
                        </T>
                    </div>
                </motion.div>
            )}
            </motion.div>
        </TiltCard>
    );
};

export default CropRecommendationCard;
