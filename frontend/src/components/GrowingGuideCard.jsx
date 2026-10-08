import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import T, { TD, TList } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, CheckCircle2, Circle, Clock, Info,
    AlertTriangle, Hammer, Lightbulb, ChevronDown,
    ChevronUp, Trophy, Star, Calendar
} from 'lucide-react';

const GrowingGuideCard = ({ guideData, cropName }) => {
    const [completedStages, setCompletedStages] = useState({});
    const [expandedStages, setExpandedStages] = useState({ 0: true });

    if (!guideData) return null;

    const { 
        total_duration = '90-120 days', 
        difficulty = 'Moderate', 
        water_requirement = 'Medium', 
        best_season = 'Kharif', 
        stages = [] 
    } = guideData || {};

    const safeStages = Array.isArray(stages) ? stages : [];

    const toggleStage = (idx) => {
        setExpandedStages(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const toggleComplete = (idx, e) => {
        e.stopPropagation();
        setCompletedStages(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const totalStages = safeStages.length || 1;
    const completedCount = Object.values(completedStages).filter(v => v).length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalStages) * 100));

    const getDifficultyColor = (diff) => {
        if (diff === 'Low') return 'text-green-500 bg-green-500/10';
        if (diff === 'Medium') return 'text-yellow-500 bg-yellow-500/10';
        return 'text-red-500 bg-red-500/10';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic text-center md:text-left">
                        📖 <span className="text-brand-green"><T>Growing</T></span> <T>Guide for</T> <TD value={cropName} />
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1 text-center md:text-left">
                        Scientific end-to-end cultivation cycles for peak performance.
                    </T>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="px-4 py-2 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                        <Clock size={14} /> <TD value={total_duration} />
                    </div>
                    <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 ${getDifficultyColor(difficulty)}`}>
                        <Star size={14} /> <TD value={difficulty} /> <T>Diff</T>
                    </div>
                    <div className="px-4 py-2 bg-brand-olive/10 text-brand-olive text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                        <Info size={14} /> <TD value={water_requirement} /> <T>Water</T>
                    </div>
                    <Link 
                        to={`/farm-calendar?crop=${encodeURIComponent(cropName || 'Rice')}`}
                        className="px-4 py-2 bg-brand-green hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Calendar size={14} /> <T>Full 16-Week Calendar</T> →
                    </Link>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <T as="span" className="text-xs font-black text-brand-olive uppercase tracking-[0.2em]">Cultivation Progress</T>
                    <span className="text-sm font-black text-brand-green italic tracking-tighter">
                        {completedCount} / {totalStages} <T>Stages Completed</T>
                    </span>
                </div>
                <div className="h-4 w-full bg-brand-green/5 rounded-full overflow-hidden p-1 border border-brand-green/10 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-gradient-to-r from-brand-green/60 to-brand-green rounded-full shadow-lg relative"
                    >
                        {progressPercent > 5 && (
                            <div className="absolute top-0 right-2 bottom-0 flex items-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Vertical Stepper Timeline */}
            <div className="space-y-4">
                {safeStages.map((stage, idx) => {
                    const isCompleted = completedStages[idx];
                    const isExpanded = expandedStages[idx];

                    return (
                        <div
                            key={idx}
                            className={`rounded-[2.5rem] border transition-all duration-300 ${isCompleted
                                ? 'bg-brand-green/5 border-brand-green/20'
                                : isExpanded ? 'bg-brand-surface-elevated border-brand-border shadow-xl' : 'bg-brand-surface border-brand-border'
                                }`}
                        >
                            {/* Collapsed View / Header */}
                            <div
                                className="p-6 cursor-pointer flex items-center justify-between gap-4"
                                onClick={() => toggleStage(idx)}
                            >
                                <div className="flex items-center gap-6 flex-grow">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.08, 1] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }}
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-lg z-10 relative transition-all duration-500 ${isCompleted ? 'bg-brand-green text-white rotate-[360deg]' : 'bg-brand-surface text-brand-text-primary border-4 border-brand-green/5'
                                                }`}>
                                                {isCompleted ? <CheckCircle2 size={32} /> : stage.emoji}
                                            </div>
                                        </motion.div>
                                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-dark text-white text-[10px] font-black flex items-center justify-center border-2 border-white ${isCompleted ? 'hidden' : ''}`}>
                                            {stage.num}
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3">
                                            <TD value={stage.name} as="h4" className={`text-xl font-black uppercase tracking-tight transition-all ${isCompleted ? 'text-brand-green line-through opacity-60' : 'text-brand-dark'}`} />
                                            <TD value={stage.duration} as="span" className="text-[10px] font-black text-brand-olive uppercase tracking-widest opacity-60" />
                                        </div>
                                        <TD value={stage.desc} as="p" className={`text-sm font-medium transition-all line-clamp-1 ${isCompleted ? 'text-brand-green/60' : 'text-brand-olive'}`} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => toggleComplete(idx, e)}
                                        className={`p-3 rounded-2xl border transition-all flex items-center gap-2 group ${isCompleted ? 'bg-brand-green border-brand-green text-white' : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:border-brand-green/40'
                                            }`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                                            {isCompleted ? <T>Completed</T> : <T>Stage Done</T>}
                                        </span>
                                        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} className="group-hover:scale-110" />}
                                    </motion.button>
                                    <div className={`text-brand-green transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-10 pt-2 space-y-8 border-t border-brand-green/10">
                                            {/* Actionable Steps */}
                                            <div className="space-y-4">
                                                <T as="h5" className="text-[12px] font-black text-brand-dark uppercase tracking-[0.25em] flex items-center gap-2 opacity-60">
                                                    Actionable Checklist
                                                </T>
                                                <div className="space-y-3">
                                                    <TList
                                                        items={stage.steps}
                                                        renderItem={(step, i) => (
                                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-brand-green/5 border border-brand-green/5 hover:border-brand-green/20 transition-all">
                                                                <div className="w-8 h-8 rounded-full bg-brand-surface-elevated flex items-center justify-center text-xs font-black text-brand-green shadow-sm shrink-0">
                                                                    {i + 1}
                                                                </div>
                                                                <p className="text-sm font-bold text-brand-dark leading-relaxed italic">
                                                                    {step}
                                                                </p>
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Extra Metadata */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column: Pro Tip & Tools */}
                                                <div className="space-y-6">
                                                    <div className="bg-brand-green/10 p-6 rounded-[2rem] border border-brand-green/10 flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-brand-surface-elevated rounded-xl flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                                                            <Lightbulb size={24} />
                                                        </div>
                                                        <div>
                                                            <T as="p" className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">PRO TIP</T>
                                                            <TD value={stage.pro_tip} as="p" className="text-sm font-black text-brand-dark italic leading-relaxed opacity-90" />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <T as="h5" className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                            Tools Needed
                                                        </T>
                                                        <div className="flex flex-wrap gap-2">
                                                            <TList
                                                                items={stage.tools}
                                                                renderItem={(tool, i) => (
                                                                    <span key={i} className="px-4 py-2 bg-brand-surface rounded-xl border border-brand-border text-xs font-black text-brand-text-primary flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-brand-green/30" /> {tool}
                                                                    </span>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column: Warning */}
                                                {stage.warning && (
                                                    <div className="bg-red-500/5 p-6 rounded-[2rem] border border-red-500/10 flex flex-col justify-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle size={20} className="text-red-500 animate-bounce" />
                                                            <T as="span" className="text-[10px] font-black text-red-500 uppercase tracking-widest">Crucial Warning</T>
                                                        </div>
                                                        <TD value={stage.warning} as="p" className="text-sm font-black text-brand-text-primary italic leading-relaxed opacity-80 border-l-2 border-red-500 pl-4 bg-brand-surface p-3 rounded-lg" prefix='"' suffix='"' />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Final Completion Action */}
                                            {!isCompleted && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={(e) => toggleComplete(idx, e)}
                                                    className="w-full bg-brand-green text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-green/20 hover:bg-brand-dark transition-all group"
                                                >
                                                    <T>Finalize & Mark</T> <TD value={stage.name} /> <T>Complete</T> <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default GrowingGuideCard;
