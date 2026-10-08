import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import T, { TD, TList } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, History, TrendingUp, DollarSign,
    ShieldCheck, Globe, CheckCircle, AlertOctagon,
    ArrowRight, Info, Zap, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const OrganicFarmingCard = ({ organicData, cropName }) => {
    const [showModal, setShowModal] = useState(false);
    const { t } = useLanguage();

    if (!organicData) return null;

    const {
        is_organic_suitable = true, 
        organic_transition_period = '2-3 years', 
        yield_comparison = 'Yield stabilizes in Year 2-3 with 20% lower input costs.',
        price_premium = '25-35%', 
        estimated_organic_profit_increase = 20, 
        organic_inputs = [],
        certification = [], 
        pest_management = [], 
        market_linkage = [], 
        do_and_dont = {}, 
        disclaimer = ''
    } = organicData || {};

    const safeInputs = Array.isArray(organic_inputs) ? organic_inputs : [];
    const safeCertification = Array.isArray(certification) ? certification : [];
    const safePestManagement = Array.isArray(pest_management) ? pest_management : [];
    const safeMarketLinkage = Array.isArray(market_linkage) ? market_linkage : [];
    const safeDos = Array.isArray(do_and_dont?.dos) ? do_and_dont.dos : [];
    const safeDonts = Array.isArray(do_and_dont?.donts) ? do_and_dont.donts : [];

    const handleSwitch = () => {
        setShowModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 glass-card border-brand-green/20 bg-gradient-to-br from-brand-surface-inset to-brand-surface"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-text-primary uppercase tracking-tight flex items-center gap-3 italic">
                        🌿 <span className="text-brand-green text-shadow-glow"><T>Organic Farming</T></span> <T>Guide</T>
                    </h3>
                    <p className="text-brand-text-secondary font-medium text-sm mt-1">
                        <T>Sustainable methods to upgrade your</T> <TD value={cropName} /> <T>cultivation to global standards.</T>
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 bg-brand-green text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg shadow-brand-green/20">
                        <CheckCircle size={14} /> <T>Highly Suitable</T>
                    </div>
                    <div className="px-4 py-2 bg-brand-olive/10 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                        <History size={14} /> <TD value={organic_transition_period} /> <T>Transition</T>
                    </div>
                    <Link
                        to={`/organic-recipes?crop=${encodeURIComponent(cropName || 'Rice')}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Leaf size={14} /> <T>ZBNF Recipe Calculator</T> →
                    </Link>
                </div>
            </div>

            {/* Economic Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-brand-surface-inset p-6 rounded-[2rem] border border-brand-border space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                            <TrendingUp size={20} />
                        </div>
                        <T as="h4" className="text-xs font-black text-brand-text-primary uppercase tracking-widest">Yield & Economics</T>
                    </div>
                    <TD value={yield_comparison} as="p" className="text-sm text-brand-text-secondary font-semibold italic leading-relaxed" />
                    <div className="flex items-center justify-between pt-2">
                        <T as="span" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Price Premium</T>
                        <span className="text-lg font-black text-brand-green">+{price_premium}</span>
                    </div>
                </div>

                <div className="bg-brand-surface-elevated border border-brand-border p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <DollarSign size={150} className="text-brand-text-primary" />
                    </div>
                    <div className="relative z-10">
                        <T as="h4" className="text-brand-green font-black uppercase tracking-[0.3em] mb-4 text-xs">Estimated Profit Delta</T>
                        <div className="text-5xl font-black text-brand-text-primary italic tracking-tighter">
                            +{estimated_organic_profit_increase}%
                        </div>
                        <T as="p" className="text-brand-text-secondary text-[10px] uppercase font-bold tracking-[0.2em] mt-2 italic">Higher margins than conventional over time.</T>
                    </div>
                </div>
            </div>

            {/* Organic Inputs */}
            <div className="mb-12">
                <T as="h4" className="text-sm font-black text-brand-text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">
                    Natural Input Matrix
                </T>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {safeInputs.map((input, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-brand-surface border border-brand-border p-6 rounded-[2rem] space-y-4 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start">
                                <TD value={input.input_name} as="h5" className="text-base font-black text-brand-text-primary uppercase" />
                                <div className="p-2 bg-brand-green/5 text-brand-green rounded-xl">
                                    <Leaf size={16} />
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                <T as="p" className="text-[9px] font-black text-red-500 uppercase tracking-widest">Replaces</T>
                                <TD value={input.replaces} as="p" className="text-xs font-bold text-brand-text-primary italic" />
                            </div>
                            <TD value={input.preparation_method} as="p" className="text-xs text-brand-text-secondary font-medium leading-relaxed flex-grow" />
                            <div className="pt-4 border-t border-brand-green/5 flex justify-between items-center text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                                <span>{input.quantity_per_acre}</span>
                                <span className="text-brand-green font-black">{input.cost_per_acre}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Certification & Pest Management */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-12">
                {/* Certification Steps */}
                <div className="space-y-6">
                    <T as="h5" className="text-[12px] font-black text-brand-text-primary uppercase tracking-[0.25em] flex items-center gap-2 opacity-60">
                        <ShieldCheck size={16} className="text-brand-green" /> Certification Blueprint
                    </T>
                    <div className="space-y-4">
                        {safeCertification.map((c, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-brand-surface-elevated text-brand-text-primary flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-brand-green group-hover:text-brand-surface transition-colors border border-brand-border">
                                    {c.step}
                                </div>
                                <div className="flex-grow pb-4 border-b border-brand-border">
                                    <TD value={c.name} as="h6" className="text-sm font-black text-brand-text-primary uppercase" />
                                    <TD value={c.desc} as="p" className="text-xs text-brand-text-secondary font-medium mt-1 italic" />
                                    <div className="flex gap-4 mt-2">
                                        <TD value={c.cost} as="span" className="text-[9px] font-black text-brand-green uppercase tracking-widest bg-brand-green/5 px-2 py-0.5 rounded-lg" />
                                        <TD value={c.time} as="span" className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest bg-brand-surface-inset px-2 py-0.5 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pest Management */}
                <div className="space-y-6">
                    <T as="h5" className="text-[12px] font-black text-brand-text-primary uppercase tracking-[0.25em] flex items-center gap-2 opacity-60">
                        Bio-Shield Protection
                    </T>
                    <div className="overflow-x-auto rounded-3xl border border-brand-border bg-brand-surface-inset">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-brand-green/5">
                                <tr>
                                    <T as="th" className="p-4 font-black uppercase tracking-widest text-[9px] text-brand-text-secondary">Pest</T>
                                    <T as="th" className="p-4 font-black uppercase tracking-widest text-[9px] text-brand-text-secondary">Organic Solution</T>
                                    <T as="th" className="p-4 font-black uppercase tracking-widest text-[9px] text-brand-text-secondary">Application</T>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {safePestManagement.map((pm, i) => (
                                    <tr key={i} className="hover:bg-brand-surface transition-colors">
                                        <td className="p-4 font-black text-brand-text-primary italic"><TD value={pm.pest} /></td>
                                        <td className="p-4 font-bold text-brand-green"><TD value={pm.solution} /></td>
                                        <td className="p-4 text-xs font-medium text-brand-text-secondary"><TD value={pm.application} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dos and Donts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-green-500/5 p-8 rounded-[2.5rem] border border-green-500/10 h-full">
                    <T as="h5" className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CheckCircle size={14} /> The Organic Commandments
                    </T>
                    <div className="space-y-3">
                        <TList
                            items={safeDos}
                            renderItem={(doItem, i) => (
                                <div key={i} className="flex gap-3">
                                    <ArrowRight size={14} className="text-green-500 mt-1 shrink-0" />
                                    <p className="text-xs font-bold text-brand-text-primary italic opacity-80 leading-relaxed">{doItem}</p>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/10 h-full">
                    <T as="h5" className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <AlertOctagon size={14} /> Critical Prohibitions
                    </T>
                    <div className="space-y-3">
                        <TList
                            items={safeDonts}
                            renderItem={(dontItem, i) => (
                                <div key={i} className="flex gap-3">
                                    <X size={14} className="text-red-500 mt-1 shrink-0" />
                                    <p className="text-xs font-bold text-brand-text-primary italic opacity-80 leading-relaxed">{dontItem}</p>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Market Linkage */}
            <div className="mb-12">
                <T as="h4" className="text-sm font-black text-brand-text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-60">
                    Verified Organic Market Linkages
                </T>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {safeMarketLinkage.map((m, i) => (
                        <a
                            key={i}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-5 bg-brand-surface border border-brand-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-brand-surface-hover transition-all group"
                        >
                            <Globe size={24} className="text-brand-green opacity-40 group-hover:opacity-100 transition-opacity" />
                            <TD value={m.name} as="span" className="text-[10px] font-black text-brand-text-primary uppercase tracking-tight text-center" />
                        </a>
                    ))}
                </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center justify-center pt-8 border-t border-brand-green/10 dark:border-white/5">
                <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest mb-6 italic opacity-60">* <TD value={disclaimer} /></p>
                <button
                    onClick={handleSwitch}
                    className="btn-primary flex items-center gap-3 px-12 py-5 bg-brand-green text-slate-950 text-lg tracking-widest shadow-2xl shadow-brand-green/30 group btn-grad-animate"
                >
                    <T>Initiate Organic Transition</T> <Zap size={24} className="fill-slate-950" />
                </button>
            </div>

            {/* Modal Popup */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-brand-surface rounded-[3rem] p-10 max-w-2xl w-full relative z-[201] shadow-2xl border-4 border-brand-border"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 p-2 hover:bg-brand-green/10 rounded-full transition-colors"
                            >
                                <X size={24} className="text-brand-text-secondary" />
                            </button>

                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Leaf className="text-brand-green" size={40} />
                                </div>
                                <h4 className="text-3xl font-black text-brand-text-primary uppercase tracking-tighter italic"><T>First Steps to</T> <span className="text-brand-green"><T>Jaivik Kheti</T></span></h4>
                                <T as="p" className="text-brand-text-secondary font-medium mt-2 italic">Follow these mission-critical actions to start your transition today.</T>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-surface-elevated text-brand-text-primary flex items-center justify-center font-black text-xl shrink-0 border border-brand-border">1</div>
                                    <div>
                                        <T as="p" className="text-xs font-black text-brand-green uppercase tracking-widest mb-1">Zero-Inertia Input</T>
                                        <T as="p" className="text-sm font-bold text-brand-text-primary italic leading-relaxed">Immediately stop purchasing synthetic urea and DAP. Start producing 10L of Jeevamrut every week using cattle waste.</T>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-surface-elevated text-brand-text-primary flex items-center justify-center font-black text-xl shrink-0 border border-brand-border">2</div>
                                    <div>
                                        <T as="p" className="text-xs font-black text-brand-green uppercase tracking-widest mb-1">Boundary Integrity</T>
                                        <T as="p" className="text-sm font-bold text-brand-text-primary italic leading-relaxed">Plant a 10ft high hedgerow of Sesbania or Napier grass around your perimeter to protect against chemical drift from neighbors.</T>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-surface-elevated text-brand-text-primary flex items-center justify-center font-black text-xl shrink-0 border border-brand-border">3</div>
                                    <div>
                                        <T as="p" className="text-xs font-black text-brand-green uppercase tracking-widest mb-1">Digital Enrolment</T>
                                        <T as="p" className="text-sm font-bold text-brand-text-primary italic leading-relaxed">Register on the 'Jaivik Kheti' government portal to join a local PGS-India cluster and unlock community subsidies.</T>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    toast.success(t("Transition Guide E-Book sent to your dashboard!") || "Transition Guide E-Book sent to your dashboard!");
                                }}
                                className="w-full mt-10 p-5 bg-brand-green text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-green/30 hover:opacity-90 transition-all"
                            >
                                <T>Get Transition Blueprint PDF</T>
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrganicFarmingCard;
