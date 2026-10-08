import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Layers, Download, ArrowUp } from 'lucide-react';
import ReportExporter from './ReportExporter';
import T from './T';

const QuickActions = ({ onRetry, onScrollToLocation, onScrollToSoil, crop, confidence, season, soilType, weather, explanation, mappedValues }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
            <button
                onClick={onScrollToLocation}
                className="flex items-center gap-2 px-5 py-3 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-500 transition-all duration-300 shadow-sm"
            >
                <MapPin size={14} />
                <T>Try Another Location</T>
            </button>

            <button
                onClick={onScrollToSoil}
                className="flex items-center gap-2 px-5 py-3 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-500 transition-all duration-300 shadow-sm"
            >
                <Layers size={14} />
                <T>Change Soil Type</T>
            </button>

            <button
                onClick={onRetry}
                className="flex items-center gap-2 px-5 py-3 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary transition-all duration-300 shadow-sm"
            >
                <RefreshCw size={14} />
                <T>Run Again</T>
            </button>

            <ReportExporter
                crop={crop}
                confidence={confidence}
                season={season}
                soilType={soilType}
                weather={weather}
                explanation={explanation}
                mappedValues={mappedValues}
            />

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-4 py-3 bg-brand-surface-inset border border-brand-border text-brand-text-muted text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-surface-elevated transition-all duration-300"
            >
                <ArrowUp size={14} />
            </button>
        </motion.div>
    );
};

export default QuickActions;
