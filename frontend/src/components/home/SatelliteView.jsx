import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import T from '../T';

/* ─── Satellite Earth Visualization — Cinematic Map Section ─── */
const ZONES = [
  { name: 'Punjab', x: '38%', y: '25%', status: 'optimal', crop: 'Wheat' },
  { name: 'Maharashtra', x: '35%', y: '55%', status: 'alert', crop: 'Cotton' },
  { name: 'Kerala', x: '32%', y: '78%', status: 'optimal', crop: 'Rice' },
  { name: 'Rajasthan', x: '28%', y: '35%', status: 'warning', crop: 'Millet' },
  { name: 'AP', x: '42%', y: '65%', status: 'optimal', crop: 'Sugarcane' },
];

const statusColors = {
  optimal: { dot: 'bg-emerald-500 dark:bg-emerald-400', ring: 'border-emerald-500/30 dark:border-emerald-400/30', text: 'text-emerald-500 dark:text-emerald-400' },
  alert: { dot: 'bg-red-500 dark:bg-red-400', ring: 'border-red-500/30 dark:border-red-400/30', text: 'text-red-500 dark:text-red-400' },
  warning: { dot: 'bg-amber-500 dark:bg-amber-400', ring: 'border-amber-500/30 dark:border-amber-400/30', text: 'text-amber-500 dark:text-amber-400' },
};

const SatelliteView = () => {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-32 bg-brand-bg overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-bg-secondary/30 to-brand-bg" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Globe visualization */}
          <motion.div initial={{opacity:0,scale:0.9}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:1}}
            className="lg:col-span-7 relative aspect-square max-h-[560px] mx-auto w-full">
            
            {/* Globe background circle */}
            <div className="absolute inset-[10%] rounded-full border border-brand-border/40 bg-gradient-to-br from-brand-bg-secondary/10 to-transparent" />
            <div className="absolute inset-[15%] rounded-full border border-brand-border/30 border-dashed" />
            <div className="absolute inset-[25%] rounded-full border border-emerald-500/[0.1] dark:border-emerald-500/[0.05]" />
            
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-[100px]" />

            {/* Meridian/parallel lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.1] dark:opacity-[0.04]" viewBox="0 0 400 400">
              <ellipse cx="200" cy="200" rx="150" ry="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-text-primary" />
              <ellipse cx="200" cy="200" rx="150" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-text-primary" />
              <ellipse cx="200" cy="200" rx="150" ry="120" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-text-primary" />
              <ellipse cx="200" cy="200" rx="40" ry="150" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-text-primary" />
              <ellipse cx="200" cy="200" rx="80" ry="150" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-text-primary" />
            </svg>

            {/* Scan beam */}
            <motion.div animate={{rotate:360}} transition={{duration:12,repeat:Infinity,ease:'linear'}}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-emerald-500/30 to-transparent origin-left" />
            </motion.div>

            {/* Zone markers */}
            {ZONES.map((zone, i) => {
              const s = statusColors[zone.status];
              return (
                <motion.div key={i} initial={{opacity:0,scale:0}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:0.8+i*0.15,duration:0.5}}
                  className="absolute group" style={{left: zone.x, top: zone.y}}>
                  {/* Ping */}
                  <div className={`absolute -inset-3 rounded-full ${s.ring} border animate-ping opacity-30`} />
                  {/* Dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${s.dot} shadow-lg relative z-10`} />
                  {/* Tooltip */}
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-brand-bg-secondary border border-brand-border shadow-premium backdrop-blur-md rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    <div className="text-[10px] font-display font-semibold text-brand-text-primary">{zone.name}</div>
                    <div className="text-[9px] font-mono text-brand-text-tertiary">{zone.crop} · <span className={s.text}>{zone.status.toUpperCase()}</span></div>
                  </div>
                </motion.div>
              );
            })}

            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-[10px] font-mono text-brand-text-muted tracking-[0.3em] mb-1">REGION</div>
              <div className="text-xl font-display font-bold text-brand-text-tertiary">INDIA</div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.8,delay:0.3}}
            className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/15 bg-cyan-500/5 mb-6">
                <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 tracking-[0.3em]">SAT.INTEL</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-text-primary tracking-tight mb-4 leading-tight">
                <T>Orbital Monitoring Network</T>
              </h2>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                <T>Coordinate-indexed agricultural zones across 28 Indian states. Real-time vegetation health, climate deviation alerts, and predictive crop signals.</T>
              </p>
            </div>

            {/* Zone status list */}
            <div className="space-y-2">
              <div className="text-[9px] font-mono text-brand-text-muted tracking-[0.2em] mb-3">ACTIVE SECTORS</div>
              {ZONES.map((zone, i) => {
                const s = statusColors[zone.status];
                return (
                  <motion.div key={i} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:1+i*0.1}}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-brand-bg-secondary/40 border border-brand-border/40 hover:bg-brand-bg-secondary transition-all">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      <span className="text-xs font-display text-brand-text-secondary">{zone.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-brand-text-tertiary">{zone.crop}</span>
                      <span className={`text-[9px] font-mono ${s.text}`}>{zone.status.toUpperCase()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SatelliteView;
