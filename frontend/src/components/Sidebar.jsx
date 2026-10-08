import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldAlert, TestTube, LeafyGreen, IndianRupee, Activity, FileText, BookOpen, Users, Leaf, CalendarDays, Wallet } from 'lucide-react';
import T from './T';

export const TABS = [
    { id: 'ai', icon: Brain, label: 'AI Reasoning' },
    { id: 'risk', icon: ShieldAlert, label: 'Risk Analysis' },
    { id: 'soil_test', icon: TestTube, label: 'Soil Testing' },
    { id: 'soil_improve', icon: LeafyGreen, label: 'Soil Improvement' },
    { id: 'revenue', icon: IndianRupee, label: 'Market & Revenue' },
    { id: 'profit', icon: Wallet, label: 'Profit Estimate' },
    { id: 'timeline', icon: CalendarDays, label: 'Growing Timeline' },
    { id: 'feasibility', icon: Activity, label: 'Feasibility Check' },
    { id: 'schemes', icon: FileText, label: 'Govt Schemes' },
    { id: 'guide', icon: BookOpen, label: 'Growing Guide' },
    { id: 'labour', icon: Users, label: 'Labour Planner' },
    { id: 'organic', icon: Leaf, label: 'Organic Farming' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-full md:w-72 shrink-0 bg-brand-surface-inset md:bg-transparent rounded-3xl md:rounded-none overflow-x-auto md:overflow-visible shadow-premium md:shadow-none p-3 md:p-0 border border-brand-border md:border-none mb-8 md:mb-0">
            <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0 md:sticky md:top-32">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative outline-none ${
                                isActive 
                                    ? 'bg-brand-primary text-brand-surface font-black shadow-premium-hover' 
                                    : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated hover:shadow-premium font-bold border border-transparent'
                            }`}
                        >
                            <Icon size={18} className={isActive ? 'text-brand-primary' : 'text-brand-text-muted group-hover:text-brand-primary'} />
                            <T as="span" className="text-xs uppercase tracking-widest whitespace-nowrap">{tab.label}</T>
                            {isActive && (
                                <motion.div 
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1.5 h-6 bg-brand-primary rounded-full hidden md:block"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    style={{ transform: 'translateX(-1.25rem)' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
