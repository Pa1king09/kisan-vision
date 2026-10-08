import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import T from '../T';

/* ─── Bloomberg-style Live AI Intelligence Ticker ─── */
const FEED_ITEMS = [
  { type: 'ALERT', text: 'Monsoon onset detected — Western Ghats region', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/8 dark:bg-amber-400/10', border: 'border-amber-500/15 dark:border-amber-400/20' },
  { type: 'PREDICTION', text: 'Rice yield +18.4% — Alluvial soil zones', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/8 dark:bg-emerald-400/10', border: 'border-emerald-500/15 dark:border-emerald-400/20' },
  { type: 'RISK', text: 'Blast disease probability 23% — Sector 7N', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/8 dark:bg-red-400/10', border: 'border-red-500/15 dark:border-red-400/20' },
  { type: 'SAT', text: 'NDVI anomaly flagged — Coordinate 17.4°N 78.5°E', color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/8 dark:bg-cyan-400/10', border: 'border-cyan-500/15 dark:border-cyan-400/20' },
  { type: 'AI', text: 'Model retrained — Accuracy improved to 97.1%', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/8 dark:bg-emerald-400/10', border: 'border-emerald-500/15 dark:border-emerald-400/20' },
  { type: 'CLIMATE', text: 'Temperature deviation +2.3°C above 30-day mean', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/8 dark:bg-orange-400/10', border: 'border-orange-500/15 dark:border-orange-400/20' },
  { type: 'YIELD', text: 'Cotton forecast revised — 42 quintals/hectare', color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-500/8 dark:bg-teal-400/10', border: 'border-teal-500/15 dark:border-teal-400/20' },
  { type: 'SAT', text: 'Chlorophyll index nominal — All monitored sectors', color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/8 dark:bg-cyan-400/10', border: 'border-cyan-500/15 dark:border-cyan-400/20' },
];

// Duplicate for seamless loop
const DOUBLED = [...FEED_ITEMS, ...FEED_ITEMS];

const IntelligenceStream = () => {
  return (
    <section className="relative py-0 bg-brand-bg border-y border-brand-border/40 overflow-hidden transition-colors duration-500">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-border/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500 dark:text-emerald-400/70 tracking-[0.25em] uppercase">LIVE INTEL STREAM</span>
          </div>
          <div className="h-3 w-px bg-brand-border" />
          <span className="text-[9px] font-mono text-brand-text-tertiary">KISANVISION.NEURAL.v4</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[9px] font-mono text-brand-text-tertiary">{FEED_ITEMS.length} ACTIVE FEEDS</span>
          <div className="w-12 h-1 bg-brand-border rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-emerald-500/40 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="relative py-3 overflow-hidden bg-brand-bg-secondary/40">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-4 w-max px-4"
        >
          {DOUBLED.map((item, i) => (
            <div key={i} className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border ${item.border} ${item.bg} backdrop-blur-sm shrink-0`}>
              <span className={`text-[8px] font-mono font-bold ${item.color} tracking-wider`}>{item.type}</span>
              <div className="h-3 w-px bg-brand-border" />
              <span className="text-[11px] font-mono text-brand-text-secondary whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default IntelligenceStream;
