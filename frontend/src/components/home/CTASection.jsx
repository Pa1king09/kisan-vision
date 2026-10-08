import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Zap, Leaf, Shield } from 'lucide-react';
import T from '../T';

/* ─── Cinematic Immersive CTA ─── */
const CinematicCTA = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-40 bg-brand-bg overflow-hidden transition-colors duration-500">
      {/* Massive ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.04] rounded-full blur-[200px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/[0.03] rounded-full blur-[150px] animate-pulse" style={{animationDuration:'6s'}} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Orbital ring */}
      <motion.div animate={{rotate:360}} transition={{duration:80,repeat:Infinity,ease:'linear'}}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-emerald-500/[0.08] dark:border-emerald-500/[0.06] rounded-full" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div initial={{opacity:0,scale:0.9}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:1}}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.3em]">SYSTEM.READY</span>
          </div>
        </motion.div>

        <motion.h2 initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:1,delay:0.15}}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[0.9] mb-6">
          <span className="text-brand-text-primary"><T>Begin Your</T> </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400"><T>Intelligence</T></span>
        </motion.h2>

        <motion.p initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.3}}
          className="text-brand-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          <T>Connect with the most advanced agricultural prediction system. Transform data into decisions.</T>
        </motion.p>

        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay:0.45}}
          className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/recommend"
            className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-brand-bg font-display font-semibold text-sm rounded-xl flex items-center gap-2.5 hover:shadow-glow-lg transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]">
            <Zap size={16} />
            <T>Initialize Analysis</T>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Minimal Dark / Light Adaptive Footer ─── */
export const DarkFooter = () => (
  <footer className="relative bg-brand-bg border-t border-brand-border/40 py-14 transition-colors duration-500">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden p-0.5 border border-emerald-500/30 bg-white/5 flex items-center justify-center">
              <img src="/kisanvision_logo.jpg" alt="KisanVision Logo" className="w-full h-full object-cover rounded-md" />
            </div>
            <span className="text-base font-display font-bold text-brand-text-primary">Kisan<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Vision</span></span>
          </Link>
          <p className="text-brand-text-secondary text-xs leading-relaxed max-w-xs">AI-powered agricultural intelligence platform. Satellite data meets machine learning.</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-[10px] font-mono text-brand-text-muted tracking-[0.2em]">PLATFORM</h4>
          <ul className="space-y-2">
            {['/','/recommend','/my-farm','/history','/intelligence'].map((p,i) => (
              <li key={i}><Link to={p} className="text-xs text-brand-text-secondary hover:text-emerald-500 transition-colors">{['Home','Recommend','My Farm','History','Intelligence'][i]}</Link></li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-[10px] font-mono text-brand-text-muted tracking-[0.2em]">STACK</h4>
          <ul className="space-y-2 text-xs text-brand-text-secondary">
            <li>XGBoost · SHAP</li>
            <li>React · Vite</li>
            <li>MongoDB Atlas</li>
            <li>Render · Vercel</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-[10px] font-mono text-brand-text-muted tracking-[0.2em]">SECURITY</h4>
          <p className="text-brand-text-secondary text-xs leading-relaxed">End-to-end encrypted data pipelines.</p>
          <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400/50 text-[9px] font-mono">
            <Shield size={10} /> TLS 1.3
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-brand-border/40 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-[10px] font-mono text-brand-text-muted">© {new Date().getFullYear()} KISANVISION</span>
        <div className="flex gap-5 text-[10px] font-mono text-brand-text-muted">
          <span className="hover:text-brand-text-secondary cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-brand-text-secondary cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

export default CinematicCTA;
