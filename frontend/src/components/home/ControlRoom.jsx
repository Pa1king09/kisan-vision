import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import T from '../T';

/* ─── Futuristic Command Room — Asymmetric Floating Panels ─── */
const PANELS = [
  { title: 'Crop Health Matrix', metrics: [{l:'NDVI Score',v:'0.82'},{l:'Chlorophyll',v:'43 µg/cm²'},{l:'Stress Index',v:'LOW'}], span: 'md:col-span-2 md:row-span-2', accent: 'emerald' },
  { title: 'Climate Grid', metrics: [{l:'Temp Delta',v:'+2.1°C'},{l:'Humidity',v:'78%'},{l:'Wind',v:'12 km/h'}], span: 'md:col-span-1', accent: 'cyan' },
  { title: 'Yield Forecast', metrics: [{l:'Predicted',v:'4.2 t/ha'},{l:'Confidence',v:'94.3%'},{l:'Revenue',v:'₹68K'}], span: 'md:col-span-1', accent: 'teal' },
  { title: 'Soil Intelligence', metrics: [{l:'Nitrogen',v:'85 mg/kg'},{l:'pH Level',v:'6.8'},{l:'Potassium',v:'42 mg/kg'}], span: 'md:col-span-1', accent: 'amber' },
  { title: 'Prediction Log', metrics: [{l:'Today',v:'127 scans'},{l:'Accuracy',v:'96.7%'},{l:'Uptime',v:'99.9%'}], span: 'md:col-span-2', accent: 'emerald' },
];

const accentMap = {
  emerald: { border: 'border-emerald-500/15 dark:border-emerald-500/10', dot: 'bg-emerald-500 dark:bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400/60', bar: 'from-emerald-500 to-teal-500' },
  cyan: { border: 'border-cyan-500/15 dark:border-cyan-500/10', dot: 'bg-cyan-500 dark:bg-cyan-400', text: 'text-cyan-600 dark:text-cyan-400/60', bar: 'from-cyan-500 to-blue-500' },
  teal: { border: 'border-teal-500/15 dark:border-teal-500/10', dot: 'bg-teal-500 dark:bg-teal-400', text: 'text-teal-600 dark:text-teal-400/60', bar: 'from-teal-500 to-emerald-500' },
  amber: { border: 'border-amber-500/15 dark:border-amber-500/10', dot: 'bg-amber-500 dark:bg-amber-400', text: 'text-amber-600 dark:text-amber-400/60', bar: 'from-amber-500 to-orange-500' },
};

const ControlRoom = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-32 bg-brand-bg overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-bg-secondary/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 mb-6">
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.3em]">CONTROL.ROOM</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-text-primary tracking-tight mb-4">
            <T>Command Center</T>
          </h2>
          <p className="text-brand-text-secondary max-w-lg mx-auto text-sm">
            <T>Real-time agricultural intelligence monitoring across all active sectors and prediction models.</T>
          </p>
        </motion.div>

        {/* Panels grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {PANELS.map((panel, i) => {
            const a = accentMap[panel.accent];
            return (
              <motion.div key={i}
                initial={{opacity:0,y:30,scale:0.97}} animate={inView?{opacity:1,y:0,scale:1}:{}} transition={{duration:0.6,delay:0.15+i*0.1}}
                className={`${panel.span} group relative bg-brand-bg-secondary/40 border ${a.border} rounded-2xl p-5 backdrop-blur-sm hover:bg-brand-bg-secondary transition-all duration-700`}>
                {/* Top line accent */}
                <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r ${a.bar} opacity-10 group-hover:opacity-25 transition-opacity duration-700`} />

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.dot} animate-pulse`} />
                    <span className="text-[10px] font-mono text-brand-text-secondary tracking-wider">{panel.title.toUpperCase()}</span>
                  </div>
                  <span className={`text-[8px] font-mono ${a.text} tracking-wider`}>LIVE</span>
                </div>

                {/* Metrics */}
                <div className={`grid ${panel.metrics.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                  {panel.metrics.map((m, j) => (
                    <div key={j} className="space-y-1">
                      <span className="text-[9px] font-mono text-brand-text-tertiary block">{m.l}</span>
                      <span className="text-sm md:text-base font-display font-bold text-brand-text-primary">{m.v}</span>
                      <div className="h-0.5 bg-brand-border/30 rounded-full overflow-hidden">
                        <motion.div initial={{width:0}} animate={inView?{width:`${50+Math.random()*45}%`}:{}} transition={{duration:2,delay:0.5+j*0.15}}
                          className={`h-full rounded-full bg-gradient-to-r ${a.bar} opacity-50`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ControlRoom;
