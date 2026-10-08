import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import T from '../T';

/* ─── AI Decision Pipeline — Animated Neural Flow ─── */
const PIPELINE = [
  { id: 'sat', label: 'Satellite Data', sub: 'NDVI · Coordinates · Imagery', icon: '◎', glow: 'from-cyan-500 to-blue-500' },
  { id: 'climate', label: 'Climate Analysis', sub: 'Temperature · Humidity · Rainfall', icon: '◈', glow: 'from-sky-500 to-cyan-500' },
  { id: 'soil', label: 'Soil Intelligence', sub: 'NPK · pH · Micronutrients', icon: '◆', glow: 'from-amber-500 to-orange-500' },
  { id: 'ai', label: 'AI Processing', sub: 'XGBoost · SHAP · Neural Nets', icon: '⬡', glow: 'from-emerald-500 to-teal-500' },
  { id: 'crop', label: 'Crop Prediction', sub: 'Match · Confidence · Ranking', icon: '◉', glow: 'from-emerald-400 to-green-500' },
  { id: 'yield', label: 'Yield Optimization', sub: 'Revenue · Cost · Schedule', icon: '✦', glow: 'from-teal-500 to-emerald-500' },
];

const AIPipeline = () => {
  const [activeNode, setActiveNode] = useState(3);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="ai-pipeline" ref={ref} className="relative py-32 bg-brand-bg overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8}}
          className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 mb-6">
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.3em]">DECISION.ENGINE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-text-primary tracking-tight mb-4">
            <T>How KisanVision Thinks</T>
          </h2>
          <p className="text-brand-text-secondary max-w-lg mx-auto text-sm">
            <T>A six-stage neural pipeline transforming raw environmental data into precise agricultural decisions.</T>
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-border/40 to-transparent" />
            <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{duration:2,delay:0.5,ease:[0.16,1,0.3,1]}}
              className="absolute inset-0 h-px bg-gradient-to-r from-cyan-500/30 via-emerald-500/40 to-teal-500/30 origin-left" />
          </div>

          {/* Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
            {PIPELINE.map((node, i) => {
              const isActive = activeNode === i;
              return (
                <motion.button key={node.id}
                  initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6,delay:0.2+i*0.1}}
                  onClick={() => setActiveNode(i)}
                  className={`no-scale relative group flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? 'bg-brand-bg-secondary/80 border-emerald-500/30 dark:border-emerald-500/25 shadow-premium'
                      : 'bg-transparent border-brand-border/40 hover:border-brand-border/80 hover:bg-brand-bg-secondary/20'
                  }`}>
                  {/* Glow dot above */}
                  <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r ${node.glow} transition-opacity duration-500 ${isActive ? 'opacity-60' : 'opacity-0'}`} />

                  {/* Icon */}
                  <div className={`text-2xl mb-3 transition-all duration-500 ${isActive ? 'text-emerald-500 scale-110' : 'text-brand-text-tertiary group-hover:text-brand-text-secondary'}`}>
                    {node.icon}
                  </div>

                  {/* Label */}
                  <span className={`text-[11px] font-display font-semibold transition-colors duration-300 ${isActive ? 'text-brand-text-primary' : 'text-brand-text-tertiary'}`}>
                    {node.label}
                  </span>
                  <span className={`text-[9px] font-mono mt-1 transition-colors duration-300 ${isActive ? 'text-emerald-600 dark:text-emerald-400/60' : 'text-brand-text-muted'}`}>
                    {node.sub}
                  </span>

                  {/* Step number */}
                  <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-500 ${
                    isActive ? 'bg-emerald-500 text-white dark:text-brand-bg' : 'bg-brand-bg-secondary text-brand-text-tertiary border border-brand-border/30'
                  }`}>
                    {i+1}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Active node detail panel */}
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:1.2}}
          className="mt-20 max-w-2xl mx-auto">
          <div className="bg-brand-bg-secondary/40 border border-brand-border/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-xl text-transparent bg-clip-text bg-gradient-to-r ${PIPELINE[activeNode].glow}`}>{PIPELINE[activeNode].icon}</div>
              <div>
                <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400/50 tracking-[0.2em]">STAGE {activeNode+1} OF 6</div>
                <div className="text-sm font-display font-semibold text-brand-text-primary">{PIPELINE[activeNode].label}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PIPELINE[activeNode].sub.split(' · ').map((param, j) => (
                <div key={j} className="bg-brand-bg/30 border border-brand-border/20 rounded-lg px-3 py-2 text-center">
                  <span className="text-[10px] font-mono text-brand-text-secondary">{param}</span>
                  <div className="mt-1 h-1 bg-brand-border/30 rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={inView?{width:`${60+Math.random()*35}%`}:{}} transition={{duration:1.5,delay:0.5+j*0.2}}
                      className={`h-full rounded-full bg-gradient-to-r ${PIPELINE[activeNode].glow}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIPipeline;
