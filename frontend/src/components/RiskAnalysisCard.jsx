import React, { useState, useEffect } from 'react';
import T, { TD, TList } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertTriangle, CheckCircle2, FlaskConical, ArrowUpRight, Gauge, 
    X, MapPin, Wallet, Timer, Zap, Leaf, Microscope, TestTubes, 
    ArrowRight, Info, ShieldCheck, Sparkles
} from 'lucide-react';
import TiltCard from './effects/TiltCard';

const iconMap = {
    FlaskConical: <FlaskConical size={18} />,
    Zap: <Zap size={18} />,
    Leaf: <Leaf size={18} />,
    Microscope: <Microscope size={18} />
};

const DEFAULT_TEST_TYPES = [
    { id: 'ph', name: 'Soil pH & Electrical Conductivity (EC)', icon: 'FlaskConical', desc: 'Measures soil acidity/alkalinity and total dissolved salts' },
    { id: 'npk', name: 'Primary Macronutrients (NPK)', icon: 'Zap', desc: 'Available Nitrogen (N), Phosphorus (P), and Potassium (K)' },
    { id: 'oc', name: 'Organic Carbon (OC) Percentage', icon: 'Leaf', desc: 'Determines biological soil activity & organic matter reserve' },
    { id: 'micro', name: 'Secondary & Micronutrients (Zn, Fe, Cu, B, S)', icon: 'Microscope', desc: 'Detects hidden hunger and mineral deficiencies' }
];

const DEFAULT_COLLECTION_STEPS = [
    'Walk in a zigzag pattern across 8 to 10 uniform spots in the field.',
    'Scrape away surface weeds and litter; dig a V-shaped hole (15 to 20 cm deep).',
    'Slice a 1-inch thick layer of soil from top to bottom along the exposed hole face.',
    'Combine and mix all collected subsamples thoroughly in a clean plastic bucket.',
    'Air-dry the soil in shade and pack ~500 grams into a clean, labeled cloth or plastic bag.'
];

const RiskAnalysisCard = ({ riskData, cropName, soilTestData, soilType, setActiveTab }) => {
    const [showGuideModal, setShowGuideModal] = useState(false);

    // Close modal on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowGuideModal(false);
        };
        if (showGuideModal) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showGuideModal]);

    if (!riskData) return null;
    const { 
        risk_level = 'Low', 
        risk_color = '#22c55e', 
        risk_score = 25, 
        risk_factors = [], 
        mitigations = [], 
        overall_recommendation = '', 
        should_soil_test = false 
    } = riskData || {};

    const safeFactors = Array.isArray(risk_factors) ? risk_factors : [];
    const safeMitigations = Array.isArray(mitigations) ? mitigations : [];
    const safeScore = Number(risk_score) || 0;

    const getRiskStyles = (color) => {
        if (color === '#ef4444') return 'border-red-500/20 bg-red-500/10 text-red-500';
        if (color === '#f97316') return 'border-orange-500/20 bg-orange-500/10 text-orange-500';
        if (color === '#eab308') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500';
        return 'border-brand-green/20 bg-brand-green/10 text-brand-green';
    };

    const handleOpenGuide = () => {
        setShowGuideModal(true);
    };

    const handleSwitchToTab = () => {
        setShowGuideModal(false);
        if (setActiveTab) {
            setActiveTab('soil_test');
            setTimeout(() => {
                document.getElementById('recommend-feature-panel')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safeScore / 100) * circumference;

    const testTypes = (soilTestData?.test_types && soilTestData.test_types.length > 0) 
        ? soilTestData.test_types 
        : DEFAULT_TEST_TYPES;

    const collectionSteps = (soilTestData?.collection_steps && soilTestData.collection_steps.length > 0)
        ? soilTestData.collection_steps
        : DEFAULT_COLLECTION_STEPS;

    const nearestLab = typeof soilTestData?.locations?.[0] === 'object'
        ? (soilTestData.locations[0].name || 'District Krishi Vigyan Kendra (KVK)')
        : (soilTestData?.locations?.[0] || 'District Krishi Vigyan Kendra (KVK)');
    const labFee = soilTestData?.cost_estimate || '₹150 - ₹400 per full test (Govt Subsidized)';
    const labTime = soilTestData?.time_required || '5 - 7 Working Days';
    const urgency = soilTestData?.urgency || 'High Priority Before Sowing';

    return (
        <>
            <TiltCard maxTilt={5} glowColor="amber" className="mt-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="glass-card border-brand-green/10 overflow-hidden relative"
                >
                <div className="absolute top-0 right-0 p-8 opacity-5"><Gauge size={120} /></div>

                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                    {/* Score Ring */}
                    <div className="flex flex-col items-center gap-6 shrink-0 w-full md:w-auto">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <defs>
                                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                </defs>
                                <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-green/5" />
                                <motion.circle
                                    cx="80" cy="80" r={radius}
                                    stroke="url(#riskGradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
                                    style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: offset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-brand-dark">{risk_score}</span>
                                <T as="span" className="text-[10px] font-black text-brand-olive uppercase tracking-widest">Risk Score</T>
                            </div>
                        </div>
                        <div className={`px-6 py-2 rounded-full border text-sm font-black uppercase tracking-widest flex items-center gap-2 ${getRiskStyles(risk_color)}`}>
                            <AlertTriangle size={16} />
                            <TD value={risk_level} />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-grow space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-4 flex items-center gap-3 italic">
                                <T>Confidence</T> & <span className="text-brand-green"><T>Risk Analysis</T></span>
                            </h3>
                            <TD value={overall_recommendation} as="p" className="text-brand-olive font-medium text-sm leading-relaxed max-w-xl" />
                        </div>

                        <div className="space-y-4">
                            <TList
                                items={safeFactors}
                                renderItem={(factor, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="bg-brand-surface-inset border border-brand-border rounded-2xl p-5 group hover:bg-brand-surface transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-black text-brand-dark uppercase tracking-wide">{factor}</h4>
                                                <p className="text-xs text-brand-olive font-medium leading-relaxed italic opacity-80">
                                                    💡 <T>Mitigation</T>: <TD value={safeMitigations[index] || 'Adopt recommended localized practices'} as="span" />
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                 )}
                            />

                            {safeFactors.length === 0 && (
                                <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-6 flex items-center gap-4">
                                    <CheckCircle2 className="text-brand-green" size={24} />
                                    <T as="p" className="text-sm font-bold text-brand-dark">All environmental factors within safe operating buffers.</T>
                                </div>
                            )}
                        </div>

                        {should_soil_test && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <FlaskConical size={24} />
                                    </div>
                                    <div>
                                        <T as="h4" className="text-sm font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Testing Recommended</T>
                                        <T as="p" className="text-xs text-blue-700 font-bold italic opacity-70">Physical soil testing is highly advised before cultivation.</T>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleOpenGuide}
                                    className="whitespace-nowrap bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                                >
                                    <T>See Testing Guide</T> <ArrowUpRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
                </motion.div>
            </TiltCard>

            {/* ═══ INTERACTIVE SOIL TESTING GUIDE MODAL ═══ */}
            <AnimatePresence>
                {showGuideModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowGuideModal(false)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto my-auto"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between pb-6 border-b border-brand-border gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
                                        <FlaskConical size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tight">
                                                🧪 <T>Soil Testing Guide</T>
                                            </h3>
                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-black text-[9px] uppercase tracking-wider border border-blue-500/20">
                                                {soilType || 'Soil Health'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand-olive font-medium mt-1">
                                            <T>Scientific diagnostic test protocols & field sampling manual for</T> <strong className="text-brand-dark">{cropName || 'cultivation'}</strong>.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowGuideModal(false)}
                                    className="p-2 rounded-xl text-brand-text-muted hover:text-brand-dark hover:bg-brand-surface-inset transition-colors shrink-0"
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Urgency Callout */}
                            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                                    <p className="text-xs font-bold text-brand-dark">
                                        <span className="text-amber-600 uppercase font-black tracking-wider mr-1">Advisory:</span>
                                        <TD value={urgency} />
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-700 text-[10px] font-black uppercase tracking-wider shrink-0">
                                    Pre-Sowing
                                </span>
                            </div>

                            <div className="mt-6 space-y-6">
                                {/* Section 1: Required Lab Tests */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark flex items-center gap-2 mb-3">
                                        <TestTubes size={16} className="text-blue-500" /> <T>Mandatory Laboratory Diagnostic Tests</T>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {testTypes.map((test, idx) => (
                                            <div key={test.id || idx} className="p-3.5 rounded-2xl bg-brand-surface-inset border border-brand-border flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center text-blue-500 border border-brand-border shrink-0 shadow-sm mt-0.5">
                                                    {iconMap[test.icon] || <TestTubes size={16} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-brand-dark leading-snug">
                                                        <TD value={test.name} />
                                                    </p>
                                                    {test.desc && (
                                                        <p className="text-[11px] text-brand-olive font-medium mt-0.5 leading-tight">
                                                            {test.desc}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 2: Soil Sample Collection Steps */}
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark flex items-center gap-2 mb-3">
                                        <CheckCircle2 size={16} className="text-emerald-500" /> <T>5-Step Field Sampling Instructions</T>
                                    </h4>
                                    <div className="space-y-2 bg-brand-surface-inset p-4 rounded-2xl border border-brand-border">
                                        {collectionSteps.map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-xs font-medium text-brand-dark leading-relaxed">
                                                    <TD value={step} />
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 3: Facilities, Cost & Time */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-3.5 rounded-2xl bg-brand-surface-inset border border-brand-border">
                                        <div className="flex items-center gap-2 text-brand-olive text-[10px] font-black uppercase tracking-wider mb-1">
                                            <MapPin size={13} className="text-blue-500" /> Nearest Lab
                                        </div>
                                        <p className="text-xs font-black text-brand-dark leading-snug">{nearestLab}</p>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-brand-surface-inset border border-brand-border">
                                        <div className="flex items-center gap-2 text-brand-olive text-[10px] font-black uppercase tracking-wider mb-1">
                                            <Wallet size={13} className="text-emerald-500" /> Subsidized Fee
                                        </div>
                                        <p className="text-xs font-black text-brand-dark leading-snug">{labFee}</p>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-brand-surface-inset border border-brand-border">
                                        <div className="flex items-center gap-2 text-brand-olive text-[10px] font-black uppercase tracking-wider mb-1">
                                            <Timer size={13} className="text-amber-500" /> Turnaround
                                        </div>
                                        <p className="text-xs font-black text-brand-dark leading-snug">{labTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-8 pt-5 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowGuideModal(false)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-olive hover:text-brand-dark hover:bg-brand-surface-inset transition-colors"
                                >
                                    <T>Close Guide</T>
                                </button>
                                {setActiveTab && (
                                    <button
                                        type="button"
                                        onClick={handleSwitchToTab}
                                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-green text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-brand-green/90 transition-all shadow-md active:scale-95"
                                    >
                                        <T>Open Full Soil Testing Tab</T> <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RiskAnalysisCard;
