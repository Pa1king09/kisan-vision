import React from 'react';
import T, { TD, TList } from './T';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, Medal, ArrowUpRight, Gauge, Layers, Info } from 'lucide-react';

const FeasibilityCard = ({ reportData, cropName }) => {
    if (!reportData) return null;

    const { 
        overall_feasibility = 'Moderate', 
        feasibility_score = 75, 
        feasibility_color = '#22c55e', 
        feasibility_factors = [], 
        top_3_crops = [], 
        recommendation_summary = '' 
    } = reportData;

    const safeScore = Number(feasibility_score) || 75;
    const safeFactors = Array.isArray(feasibility_factors) ? feasibility_factors : [];
    const safeTop3 = Array.isArray(top_3_crops) ? top_3_crops : [];

    // Rank icons and colors
    const rankConfig = [
        { color: 'text-amber-400', icon: 'Gold', badge: 'bg-amber-400/10 border-amber-400/20' },
        { color: 'text-gray-400', icon: 'Silver', badge: 'bg-gray-400/10 border-gray-400/20' },
        { color: 'text-orange-400', icon: 'Bronze', badge: 'bg-orange-400/10 border-orange-400/20' }
    ];

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safeScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        📊 <span className="text-brand-green"><T>Feasibility</T></span> <T>Report</T>
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1 max-w-lg">
                        Comprehensive scoring of your matching algorithm results against local physical constraints.
                    </T>
                </div>

                <div className="flex items-center gap-6">
                    {/* Circle Score */}
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-brand-green/5"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r={radius}
                                stroke={feasibility_color}
                                strokeWidth="6"
                                fill="transparent"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: offset
                                }}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-brand-dark">{feasibility_score}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Factors Breakdown */}
                <div className="space-y-8">
                    <div>
                        <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60">
                            <Layers size={16} /> <T>Factor Breakdown</T>
                        </h4>
                        <div className="space-y-6">
                            {safeFactors.map((factor, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <TD value={factor.name} as="span" className="text-xs font-black text-brand-dark uppercase tracking-wide" />
                                        <span className="text-[10px] font-black text-brand-olive uppercase"><TD value={factor.status} /> • {factor.score}/{factor.max}</span>
                                    </div>
                                    <div className="h-2 w-full bg-brand-green/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(factor.score / (factor.max || 100)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                            className="h-full bg-brand-green"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-brand-green/5 border border-brand-green/10 rounded-3xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
                                <Info size={20} />
                            </div>
                            <TD value={recommendation_summary} as="p" className="text-sm text-brand-dark font-medium leading-relaxed italic opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Right: Alternatives */}
                <div className="space-y-8">
                    <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest flex items-center gap-2 opacity-60">
                        <TrendingUp size={16} /> <T>Top Alternatives</T>
                    </h4>

                    <div className="space-y-4">
                        {safeTop3.map((alt, idx) => {
                            const rank = rankConfig[idx] || rankConfig[0];
                            return (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="bg-brand-surface-inset border border-brand-border p-5 rounded-3xl flex items-center gap-6 group hover:bg-brand-surface transition-all"
                            >
                                <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl shrink-0 ${rank.badge}`}>
                                    <Medal className={rank.color} size={20} />
                                    <span className={`text-[9px] font-black uppercase ${rank.color}`}>#{alt.rank || (idx + 1)}</span>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-base font-black text-brand-dark uppercase"><TD value={alt.name} /> <span className="text-xl align-middle ml-1">{alt.emoji}</span></h5>
                                        <span className="text-xs font-black text-brand-green">{alt.match_score}% <T>Match</T></span>
                                    </div>
                                    <TD value={alt.reason} as="p" className="text-[10px] text-brand-olive font-bold italic leading-tight mb-2 opacity-70" />
                                    <div className="flex items-center justify-between">
                                        <div className="h-1 flex-grow bg-brand-green/5 rounded-full mr-4 overflow-hidden">
                                            <div className="h-full bg-brand-green/30" style={{ width: `${alt.match_score}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-brand-dark whitespace-nowrap">₹{alt.profit.toLocaleString()} <T>Net Profit</T></span>
                                    </div>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeasibilityCard;
