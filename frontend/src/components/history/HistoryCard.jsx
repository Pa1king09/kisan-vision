import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sprout, TrendingUp, Calendar, Trash2, ArrowRight, Star } from 'lucide-react';
import T, { TD } from '../T';
import CropImage from '../CropImage';

const HistoryCard = ({ record, onOpenDetails, onDelete, onToggleFavorite }) => {
    const crop = record.predictionResult?.crop || 'Unknown';
    const confidence = record.predictionResult?.confidence || 0;
    const date = new Date(record.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    
    // Confidence Color Logic
    let confColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    let barColor = 'bg-emerald-500';
    if (confidence < 0.75) {
        confColor = 'text-amber-500 bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
        barColor = 'bg-amber-500';
    }
    if (confidence < 0.5) {
        confColor = 'text-red-500 bg-red-500/10 border-red-200 dark:border-red-500/20';
        barColor = 'bg-red-500';
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-premium transition-all duration-300"
        >
            {/* Top row: Farm & Actions */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-brand-surface-inset rounded-lg">
                        <MapPin size={14} className="text-brand-text-tertiary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-brand-text-primary"><TD value={record.farmName || record.location || 'Unknown Farm'} /></h4>
                        <p className="text-[10px] font-medium text-brand-text-tertiary flex items-center gap-1">
                            <Calendar size={10} /> {date}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(record); }}
                        className={`p-2 rounded-xl border transition-all ${record.bookmarked ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-brand-surface-hover border-transparent text-slate-400 hover:text-amber-500 hover:border-amber-200'}`}
                    >
                        <Star size={16} className={record.bookmarked ? "fill-amber-500" : ""} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(record._id); }}
                        className="p-2 rounded-xl bg-brand-surface-hover border border-transparent text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Middle: Crop & Confidence */}
            <div className="flex items-center gap-4 mb-5">
                <CropImage 
                    crop={crop} 
                    size="md" 
                    rounded="rounded-2xl" 
                    className="shadow-md shrink-0" 
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight truncate"><TD value={crop} /></h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${confColor}`}>
                            {Math.round(confidence * 100)}% <T>Match</T>
                        </span>
                        <div className="flex-1 h-1.5 bg-brand-surface-inset rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${confidence * 100}%` }}
                                className={`h-full ${barColor}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Tags / Env Info */}
            <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-brand-surface-inset px-3 py-2 rounded-xl">
                    <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-0.5"><T>Soil</T></p>
                    <p className="text-xs font-bold text-brand-text-primary"><TD value={record.soilType} /></p>
                </div>
                <div className="bg-brand-surface-inset px-3 py-2 rounded-xl">
                    <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-0.5"><T>Season</T></p>
                    <p className="text-xs font-bold text-brand-text-primary"><TD value={record.environmentalData?.season || 'Monsoon'} /></p>
                </div>
            </div>

            {/* Action button */}
            <button 
                onClick={() => onOpenDetails(record)}
                className="w-full py-3 px-4 bg-brand-surface-inset hover:bg-brand-primary text-brand-text-secondary hover:text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
            >
                <T>View Full Analysis</T>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

export default HistoryCard;
