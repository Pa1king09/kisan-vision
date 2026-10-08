import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import T from '../T';

/* ─── Future of Agriculture — Cinematic Vision Section ─── */
const VISIONS = [
  { num: '01', title: 'Autonomous Fields', desc: 'AI-directed cultivation cycles eliminating guesswork from every planting decision across millions of hectares.', stat: '340M', statLabel: 'Hectares Addressable' },
  { num: '02', title: 'Predictive Ecosystems', desc: 'Machine learning models forecasting crop outcomes weeks before traditional methods, reshaping food security infrastructure.', stat: '6.2×', statLabel: 'Faster Than Manual' },
  { num: '03', title: 'Climate Resilience', desc: 'Adaptive agricultural intelligence that evolves with changing climate patterns, protecting yields against environmental volatility.', stat: '28%', statLabel: 'Yield Loss Prevention' },
];

const VisionSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-32 bg-brand-bg overflow-hidden transition-colors duration-500">
      {/* Cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-bg-secondary/20 via-brand-bg to-brand-bg" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[180px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}}
          className="mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 mb-6">
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.3em]">VISION.2030</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-brand-text-primary tracking-tight leading-[0.9] max-w-3xl">
            <T>The Future of Food Begins in the Soil</T>
          </h2>
        </motion.div>

        {/* Vision items */}
        <div className="space-y-0">
          {VISIONS.map((v, i) => (
            <motion.div key={i}
              initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.7,delay:0.3+i*0.15}}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center py-12 border-t border-brand-border/40 first:border-t-0 hover:bg-brand-bg-secondary/20 transition-all duration-700 px-4 -mx-4 rounded-xl">
              
              {/* Number */}
              <div className="md:col-span-1">
                <span className="text-4xl font-display font-bold text-brand-text-primary/10 group-hover:text-emerald-500/20 transition-colors duration-700">{v.num}</span>
              </div>

              {/* Title + Desc */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-xl md:text-2xl font-display font-bold text-brand-text-primary/70 group-hover:text-brand-text-primary transition-colors duration-500">
                  <T>{v.title}</T>
                </h3>
                <p className="text-sm text-brand-text-secondary/80 group-hover:text-brand-text-secondary transition-colors duration-500 leading-relaxed max-w-xl">
                  <T>{v.desc}</T>
                </p>
              </div>

              {/* Stat */}
              <div className="md:col-span-4 md:text-right">
                <div className="inline-block">
                  <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 mb-0.5">
                    {v.stat}
                  </div>
                  <div className="text-[10px] font-mono text-brand-text-tertiary tracking-wider">{v.statLabel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
