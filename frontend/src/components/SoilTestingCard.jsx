import React from 'react';
import T, { TD, TList } from './T';
import { motion } from 'framer-motion';
import { TestTubes, MapPin, Wallet, Timer, ChevronRight, Info, Lightbulb, FlaskConical, Zap, Leaf, Microscope } from 'lucide-react';

const iconMap = {
    FlaskConical: <FlaskConical size={18} />,
    Zap: <Zap size={18} />,
    Leaf: <Leaf size={18} />,
    Microscope: <Microscope size={18} />
};

const SoilTestingCard = ({ soilTestData, soilType }) => {
    if (!soilTestData) return null;
    const { 
        urgency, 
        urgency_level = 'Moderate', 
        test_types = [], 
        locations = [], 
        cost_estimate, 
        time_required, 
        collection_steps = [], 
        improvement_tips = [] 
    } = soilTestData || {};

    const safeTips = Array.isArray(improvement_tips) ? improvement_tips : [];
    const safeTests = Array.isArray(test_types) ? test_types : [];
    const safeSteps = Array.isArray(collection_steps) ? collection_steps : [];

    const getUrgencyColor = (level) => {
        if (level === 'High') return 'bg-red-500/10 border-red-500/30 text-red-600';
        if (level === 'Moderate') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700';
        return 'bg-brand-green/10 border-brand-green/30 text-brand-green';
    };

    const locList = Array.isArray(locations) ? locations : [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        🧪 <span className="text-brand-green"><T>Soil Testing</T></span> <T>Guide</T>
                    </h3>
                    <p className="text-brand-olive font-medium text-sm mt-1">
                        <T>Scientific diagnostic test recommendations & lab instructions for your</T> <TD value={soilType || 'farm'} /> <T>soil</T>.
                    </p>
                </div>
                {urgency && (
                    <div className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 ${getUrgencyColor(urgency_level)}`}>
                        <Info size={14} /> <TD value={urgency} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                    {/* Test types */}
                    <div>
                        <T as="h4" className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">Required Diagnostic Tests</T>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {test_types.map((test, idx) => (
                                <div key={test.id || idx} className="flex items-center gap-3 bg-brand-surface-inset p-3.5 rounded-2xl border border-brand-border">
                                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
                                        {iconMap[test.icon] || <TestTubes size={18} />}
                                    </div>
                                    <TD value={typeof test.name === 'object' ? test.name.title : test.name} as="span" className="text-sm font-bold text-brand-dark leading-tight" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Locations */}
                    <div>
                        <T as="h4" className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">Authorized Testing Labs</T>
                        <div className="space-y-3">
                            {locList.map((loc, idx) => {
                                const locName = typeof loc === 'object' ? (loc.name || 'District Testing Center') : loc;
                                const locType = typeof loc === 'object' ? (loc.type || 'Government Lab') : 'Government Lab';
                                const locDistance = typeof loc === 'object' ? (loc.distance || 'Local District') : 'Local District';
                                const isClickable = typeof loc === 'object' && !!loc.url;
                                return (
                                    <motion.a
                                        key={idx}
                                        href={isClickable ? loc.url : undefined}
                                        target={isClickable ? "_blank" : "_self"}
                                        rel={isClickable ? "noopener noreferrer" : ""}
                                        onClick={(e) => { if (!isClickable) e.preventDefault(); }}
                                        whileHover={{ x: 5 }}
                                        className={`flex items-center justify-between bg-brand-surface-elevated border border-brand-border p-4 rounded-2xl group transition-all shadow-sm no-underline ${isClickable ? 'cursor-pointer hover:bg-brand-surface hover:border-brand-primary/50' : 'cursor-default'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 bg-brand-surface shadow-inner rounded-xl flex items-center justify-center text-brand-text-secondary transition-colors ${isClickable ? 'group-hover:text-brand-green' : ''}`}>
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-brand-dark leading-none">{locName}</p>
                                                <div className="flex gap-3 items-center mt-1">
                                                    <TD value={locType} as="span" className="text-[10px] uppercase font-bold text-brand-olive opacity-80" />
                                                    <span className="w-1 h-1 bg-brand-green/30 rounded-full" />
                                                    <TD value={locDistance} as="span" className="text-[10px] uppercase font-bold text-brand-olive opacity-80" />
                                                </div>
                                            </div>
                                        </div>
                                        {isClickable && <ChevronRight className="text-brand-green opacity-0 group-hover:opacity-100 transition-opacity" size={20} />}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cost & Time pills */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-brand-green/10">
                        <div className="flex items-center gap-3 bg-brand-dark/5 px-5 py-3 rounded-2xl">
                            <Wallet className="text-brand-olive" size={20} />
                            <div>
                                <T as="p" className="text-[9px] uppercase font-black text-brand-olive leading-none mb-1">Estimated Cost</T>
                                <p className="text-sm font-black text-brand-dark">{cost_estimate || '₹150 - ₹400 (Govt Subsidized)'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-brand-dark/5 px-5 py-3 rounded-2xl">
                            <Timer className="text-brand-olive" size={20} />
                            <div>
                                <T as="p" className="text-[9px] uppercase font-black text-brand-olive leading-none mb-1">Processing Time</T>
                                <p className="text-sm font-black text-brand-dark">{time_required || '5 - 7 Working Days'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Collection steps */}
                    <div>
                        <T as="h4" className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">Field Soil Sampling Steps</T>
                        <div className="space-y-4">
                            <TList
                                items={collection_steps}
                                renderItem={(step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-brand-green text-brand-surface border-4 border-brand-surface shadow-md flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-brand-olive font-bold leading-relaxed">
                                            <TD value={typeof step === 'object' ? (step.text || step.desc || JSON.stringify(step)) : step} />
                                        </p>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Improvement tips */}
                    {safeTips.length > 0 && (
                        <div>
                            <T as="h4" className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">Pre-Test Diagnostic Advisory</T>
                            <div className="space-y-3">
                                <TList
                                    items={safeTips}
                                    renderItem={(tip, idx) => (
                                        <div key={idx} className="bg-brand-green/10 p-5 rounded-2xl flex items-start gap-4 border border-brand-green/10">
                                            <div className="w-8 h-8 bg-brand-surface-elevated rounded-lg flex items-center justify-center text-brand-gold shrink-0">
                                                <Lightbulb size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-brand-dark italic leading-relaxed opacity-90">
                                                <TD value={typeof tip === 'object' ? (tip.tip || tip.text || JSON.stringify(tip)) : tip} />
                                            </p>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SoilTestingCard;
