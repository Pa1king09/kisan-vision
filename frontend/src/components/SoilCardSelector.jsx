import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Droplets, Wind, FlaskConical, Sparkles, Sprout } from 'lucide-react';
import T from './T';

export const SOIL_PROFILES = [
  {
    id: 'Alluvial',
    name: 'Alluvial Soil',
    image: '/soil_alluvial.png',
    retention: 'High',
    aeration: 'Balanced',
    ph: '6.5 – 8.0',
    description: 'Fertile river silt rich in potash & minerals.',
    badge: 'High Yield',
    accentColor: 'from-amber-700/80 to-amber-900/90',
    glowColor: 'group-hover:border-amber-500/50'
  },
  {
    id: 'Black',
    name: 'Black Cotton',
    image: '/soil_black.png',
    retention: 'Very High',
    aeration: 'Low',
    ph: '7.2 – 8.5',
    description: 'Deep clay rich in montmorillonite, cracks naturally.',
    badge: 'Moisture Rich',
    accentColor: 'from-stone-800/80 to-stone-950/90',
    glowColor: 'group-hover:border-emerald-500/50'
  },
  {
    id: 'Loamy',
    name: 'Loamy Soil',
    image: '/soil_loamy.png',
    retention: 'Ideal',
    aeration: 'High',
    ph: '6.0 – 7.2',
    description: 'Optimal humus-rich blend of sand, silt, and clay.',
    badge: 'Recommended',
    accentColor: 'from-emerald-900/80 to-stone-900/90',
    glowColor: 'group-hover:border-emerald-500/50'
  },
  {
    id: 'Red',
    name: 'Red Soil',
    image: '/soil_red.png',
    retention: 'Moderate',
    aeration: 'High',
    ph: '5.5 – 6.8',
    description: 'Iron-oxide rich porous soil from ancient crystalline rock.',
    badge: 'Porous',
    accentColor: 'from-red-900/80 to-amber-950/90',
    glowColor: 'group-hover:border-rose-500/50'
  },
  {
    id: 'Clay',
    name: 'Clay Soil',
    image: '/soil_clay.png',
    retention: 'Very High',
    aeration: 'Low',
    ph: '6.0 – 7.5',
    description: 'Ultra-fine compact particles with dense nutrient binding.',
    badge: 'Dense',
    accentColor: 'from-orange-950/80 to-stone-950/90',
    glowColor: 'group-hover:border-orange-500/50'
  },
  {
    id: 'Sandy',
    name: 'Sandy Soil',
    image: '/soil_sandy.png',
    retention: 'Low',
    aeration: 'Very High',
    ph: '6.5 – 7.5',
    description: 'Coarse granular structure with rapid free drainage.',
    badge: 'Fast Drainage',
    accentColor: 'from-yellow-900/80 to-stone-900/90',
    glowColor: 'group-hover:border-yellow-500/50'
  },
];

export default function SoilCardSelector({ selectedSoil, onSelectSoil, compact = false }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SOIL_PROFILES.map((soil) => {
          const isSelected = selectedSoil?.toLowerCase() === soil.id.toLowerCase();

          return (
            <motion.button
              key={soil.id}
              type="button"
              onClick={() => onSelectSoil(soil.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between min-h-[145px] ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/80 bg-brand-surface shadow-[0_0_24px_rgba(16,185,129,0.3)] dark:shadow-[0_0_28px_rgba(16,185,129,0.25)]'
                  : 'border-brand-border/70 dark:border-white/10 bg-brand-surface/60 hover:border-brand-primary/50 hover:bg-brand-surface shadow-sm'
              }`}
            >
              {/* Macro Photographic Texture Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={soil.image}
                  alt={soil.name}
                  className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115 filter ${
                    isSelected ? 'brightness-[0.45] saturate-110' : 'brightness-[0.3] contrast-105'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${soil.accentColor} opacity-70`} />
                <div className="absolute inset-0 bg-brand-bg/40 dark:bg-black/30 backdrop-blur-[1px]" />
              </div>

              {/* Top Header: Badge & Checkmark */}
              <div className="relative z-10 flex items-start justify-between gap-1 w-full">
                <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold backdrop-blur-md border ${
                  isSelected 
                    ? 'bg-emerald-500/90 text-slate-950 border-emerald-400' 
                    : 'bg-black/50 text-gray-200 border-white/15'
                }`}>
                  <T>{soil.badge}</T>
                </span>

                {/* Selected Checkmark Indicator */}
                <div className={`transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Center: Soil Name */}
              <div className="relative z-10 my-2">
                <h4 className="text-sm sm:text-base font-display font-black text-white tracking-tight flex items-center gap-1.5 drop-shadow">
                  <T>{soil.name}</T>
                </h4>
                <p className="text-[10px] text-gray-200 line-clamp-1 opacity-90 drop-shadow">
                  <T>{soil.description}</T>
                </p>
              </div>

              {/* Bottom Quick Specs Grid (Water Retention | Aeration | pH) */}
              <div className="relative z-10 pt-2 border-t border-white/15 grid grid-cols-3 gap-1 text-[9px] font-mono text-gray-200">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-300 flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5 text-cyan-300" /> <T>Ret.</T>
                  </span>
                  <span className="font-bold text-white text-[9px] truncate"><T>{soil.retention}</T></span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-300 flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-amber-300" /> <T>Air</T>
                  </span>
                  <span className="font-bold text-white text-[9px] truncate"><T>{soil.aeration}</T></span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-300 flex items-center gap-0.5">
                    <FlaskConical className="w-2.5 h-2.5 text-emerald-300" /> pH
                  </span>
                  <span className="font-bold text-white text-[9px] truncate">{soil.ph}</span>
                </div>
              </div>

              {/* Glowing Outline on Selected */}
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.3)] animate-pulse" style={{ animationDuration: '3s' }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
