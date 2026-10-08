import React, { useState, useEffect } from 'react';
import T, { TD } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TestTubes, MapPin, Wallet, Timer, ChevronRight, Info,
    FlaskConical, Zap, Leaf, Microscope, Sprout, Calendar,
    ArrowRight, CheckCircle2, ShieldAlert, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap = {
    FlaskConical: <FlaskConical size={18} />,
    Zap: <Zap size={18} />,
    Leaf: <Leaf size={18} />,
    Microscope: <Microscope size={18} />
};

export default function SoilHealthPlanCard({ soilTestData, improvementData, soilType, initialTab = 'roadmap' }) {
    const [activeTab, setActiveTab] = useState(initialTab); // 'roadmap' | 'tests'

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    if (!soilTestData && !improvementData) return null;

    const urgencyLevel = soilTestData?.urgency_level || 'Moderate';
    const currentGrade = improvementData?.current_grade || 'C';
    const potentialGrade = improvementData?.potential_grade || 'A';
    const duration = improvementData?.duration || '2 Seasons';
    const steps = improvementData?.steps || [];
    const testTypes = soilTestData?.test_types || [];
    const betterCrops = improvementData?.better_crops || [];

    const getUrgencyColor = (level) => {
        if (level === 'High') return 'bg-red-500/10 border-red-500/30 text-red-600';
        if (level === 'Moderate') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700';
        return 'bg-brand-green/10 border-brand-green/30 text-brand-green';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 glass-card border-brand-green/15 overflow-hidden"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        🧪 <span className="text-brand-green"><T>Soil Health & Restoration</T></span> <T>Plan</T>
                    </h3>
                    <p className="text-brand-olive font-medium text-sm mt-1">
                        <T>Unified diagnostic testing protocol and restoration roadmap for</T> <TD value={soilType || 'your'} /> <T>soil</T>.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-brand-surface-inset p-1.5 rounded-2xl border border-brand-border">
                        <button
                            type="button"
                            onClick={() => setActiveTab('roadmap')}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'roadmap'
                                    ? 'bg-brand-green text-white shadow-md'
                                    : 'text-brand-olive hover:text-brand-dark'
                            }`}
                        >
                            🌱 <T>Restoration Roadmap</T>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('tests')}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'tests'
                                    ? 'bg-brand-green text-white shadow-md'
                                    : 'text-brand-olive hover:text-brand-dark'
                            }`}
                        >
                            🔬 <T>Diagnostic Lab Tests</T>
                        </button>
                    </div>

                    {soilTestData?.urgency && (
                        <div className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 ${getUrgencyColor(urgencyLevel)}`}>
                            <Info size={14} /> <TD value={soilTestData.urgency} />
                        </div>
                    )}
                </div>
            </div>

            {/* Tab 1: Restoration Roadmap */}
            {activeTab === 'roadmap' && (
                <div className="pt-8 space-y-8">
                    {/* Grade Upgrade Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-brand-surface-inset p-6 rounded-3xl border border-brand-border">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-olive">Soil Health Target</span>
                            <h4 className="text-xl font-black text-brand-dark mt-0.5">
                                Upgrade from Grade {currentGrade} to Grade {potentialGrade}
                            </h4>
                            <p className="text-xs text-brand-olive mt-1 flex items-center gap-1.5">
                                <Calendar size={14} className="text-brand-green" /> Estimated duration: <span className="font-bold text-brand-dark">{duration}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center">
                                <span className="text-[9px] font-black uppercase text-amber-600">Current</span>
                                <span className="text-xl font-black text-brand-dark">{currentGrade}</span>
                            </div>
                            <ArrowRight size={18} className="text-brand-green" />
                            <div className="w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/20 flex flex-col items-center justify-center shadow-inner">
                                <span className="text-[9px] font-black uppercase text-brand-green">Target</span>
                                <span className="text-xl font-black text-brand-green">{potentialGrade}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-step remediation protocol */}
                    <div>
                        <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sprout size={16} className="text-brand-green" /> Step-by-Step Restoration Protocol
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {steps.map((s, idx) => (
                                <div key={idx} className="bg-brand-surface-inset p-5 rounded-2xl border border-brand-border space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-1 bg-brand-green/10 text-brand-green text-xs font-black rounded-lg">
                                            Step {s.step || idx + 1}: {s.timing || 'Ongoing'}
                                        </span>
                                        {s.quantity && (
                                            <span className="text-xs font-bold text-brand-olive">
                                                {typeof s.quantity === 'object' ? JSON.stringify(s.quantity) : s.quantity}
                                            </span>
                                        )}
                                    </div>
                                    <h5 className="font-black text-brand-dark text-base">{typeof s.action === 'object' ? s.action.name : s.action}</h5>
                                    <p className="text-xs text-brand-olive leading-relaxed">{s.benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Better Crops with Restored Soil */}
                    {betterCrops.length > 0 && (
                        <div className="bg-brand-green/5 p-6 rounded-3xl border border-brand-green/15">
                            <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Leaf size={16} className="text-brand-green" /> High-Value Crops Unlocked After Soil Restoration
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {betterCrops.map((crop, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-brand-surface p-4 rounded-2xl border border-brand-border">
                                        <span className="text-3xl">{crop.emoji || '🌾'}</span>
                                        <div>
                                            <h5 className="font-black text-brand-dark">{crop.name} <span className="text-xs text-brand-green font-bold ml-2">+{crop.yield_increase || '20%'} Yield</span></h5>
                                            <p className="text-xs text-brand-olive">{crop.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Diagnostic Lab Tests */}
            {activeTab === 'tests' && (
                <div className="pt-8 space-y-8">
                    {/* Test Types Grid */}
                    <div>
                        <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TestTubes size={16} className="text-brand-green" /> Mandatory Laboratory Tests
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {testTypes.map((test, idx) => (
                                <div key={test.id || idx} className="flex items-center gap-3 bg-brand-surface-inset p-4 rounded-2xl border border-brand-border">
                                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
                                        {iconMap[test.icon] || <TestTubes size={18} />}
                                    </div>
                                    <span className="text-sm font-bold text-brand-dark leading-tight">
                                        {typeof test.name === 'object' ? test.name.title : test.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Collection & Lab Logistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Collection steps */}
                        {soilTestData?.collection_steps && (
                            <div className="bg-brand-surface-inset p-6 rounded-3xl border border-brand-border space-y-3">
                                <h5 className="text-xs font-black uppercase tracking-wider text-brand-dark flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-brand-green" /> Field Sampling Guidelines
                                </h5>
                                <ul className="space-y-2 text-xs text-brand-olive list-disc list-inside">
                                    {soilTestData.collection_steps.map((st, i) => (
                                        <li key={i}>{typeof st === 'object' ? (st.step || st.desc || JSON.stringify(st)) : st}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Testing Centers & Costs */}
                        <div className="bg-brand-surface-inset p-6 rounded-3xl border border-brand-border space-y-4">
                            <h5 className="text-xs font-black uppercase tracking-wider text-brand-dark flex items-center gap-2">
                                <MapPin size={16} className="text-brand-green" /> Testing Facilities & Costs
                            </h5>
                            <div className="space-y-2 text-xs text-brand-olive">
                                <p>
                                    <strong className="text-brand-dark">Nearest Lab:</strong>{' '}
                                    {typeof soilTestData?.locations?.[0] === 'object' ? (
                                        soilTestData.locations[0].url ? (
                                            <a 
                                                href={soilTestData.locations[0].url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-brand-green hover:underline font-bold inline-flex items-center gap-1"
                                            >
                                                <span>{soilTestData.locations[0].name} ({soilTestData.locations[0].distance || 'Local'})</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="font-bold text-brand-dark">
                                                {soilTestData.locations[0].name} ({soilTestData.locations[0].distance || 'Local'})
                                            </span>
                                        )
                                    ) : (
                                        typeof soilTestData?.locations?.[0] === 'string'
                                            ? soilTestData.locations[0]
                                            : 'District Krishi Vigyan Kendra (KVK)'
                                    )}
                                </p>
                                <p><strong className="text-brand-dark">Estimated Fee:</strong> {soilTestData?.cost_estimate || '₹150 - ₹400 per full test (Govt Subsidized)'}</p>
                                <p><strong className="text-brand-dark">Turnaround Time:</strong> {soilTestData?.time_required || '5 - 7 Working Days'}</p>
                            </div>

                            {/* Additional testing centers if present */}
                            {Array.isArray(soilTestData?.locations) && soilTestData.locations.length > 1 && (
                                <div className="pt-3 border-t border-brand-border/60">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-olive block mb-2">Other Govt Centers:</span>
                                    <div className="space-y-1.5">
                                        {soilTestData.locations.slice(1).map((loc, idx) => {
                                            const locName = typeof loc === 'object' ? loc.name : loc;
                                            const locDist = typeof loc === 'object' ? loc.distance : null;
                                            const locUrl = typeof loc === 'object' ? loc.url : null;
                                            return (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    {locUrl ? (
                                                        <a href={locUrl} target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:text-brand-green transition-colors font-medium">
                                                            {locName} ↗
                                                        </a>
                                                    ) : (
                                                        <span className="text-brand-dark font-medium">{locName}</span>
                                                    )}
                                                    {locDist && (
                                                        <span className="text-[10px] text-brand-olive font-bold">{locDist}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
