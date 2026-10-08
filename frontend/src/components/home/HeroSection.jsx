import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import T from '../T';

/* ─── Cinematic Full-Screen AI Command Center Hero ─── */
const CommandCenterHero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const gY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const tick = () => { const d = new Date(); setTime(d.toTimeString().slice(0,8)); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const onMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };

  return (
    <section onMouseMove={onMove} className="relative w-full min-h-[100dvh] py-24 md:py-0 flex items-center justify-center overflow-hidden bg-brand-bg light-mesh-bg dark:bg-transparent transition-colors duration-500">
      {/* Layered ambient background */}
      <div className="absolute inset-0 z-0">
        {/* Radial core glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04] rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.02] dark:bg-cyan-500/[0.03] rounded-full blur-[150px] animate-pulse" style={{animationDuration:'8s'}} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 dark:via-emerald-400/40 to-transparent animate-scanner" />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Rotating orbital rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <motion.div animate={{rotate:360}} transition={{duration:60,repeat:Infinity,ease:'linear'}} className="w-[700px] h-[700px] border border-emerald-500/[0.08] dark:border-emerald-500/[0.06] rounded-full absolute -translate-x-1/2 -translate-y-1/2" />
        <motion.div animate={{rotate:-360}} transition={{duration:90,repeat:Infinity,ease:'linear'}} className="w-[500px] h-[500px] border border-cyan-400/[0.07] dark:border-cyan-400/[0.05] rounded-full absolute -translate-x-1/2 -translate-y-1/2 border-dashed" />
        <motion.div animate={{rotate:360}} transition={{duration:120,repeat:Infinity,ease:'linear'}} className="w-[300px] h-[300px] border border-emerald-400/[0.1] dark:border-emerald-400/[0.08] rounded-full absolute -translate-x-1/2 -translate-y-1/2" />
        {/* Orbital dots */}
        <motion.div animate={{rotate:360}} transition={{duration:60,repeat:Infinity,ease:'linear'}} className="w-[700px] h-[700px] absolute -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-glow -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <motion.div animate={{rotate:-360}} transition={{duration:90,repeat:Infinity,ease:'linear'}} className="w-[500px] h-[500px] absolute -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-400 rounded-full translate-x-1/2" />
        </motion.div>
      </div>

      {/* Cursor-reactive glow */}
      <motion.div style={{left:gX, top:gY}} className="absolute w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 hidden md:block" />

      {/* HUD Corner Brackets */}
      <div className="absolute inset-8 md:inset-16 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-emerald-500/20 dark:border-emerald-500/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-emerald-500/20 dark:border-emerald-500/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-emerald-500/20 dark:border-emerald-500/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-emerald-500/20 dark:border-emerald-500/20" />
      </div>

      {/* Floating HUD data panels */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
        {/* Top-left: System status */}
        <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{delay:1.5,duration:1}}
          className="absolute top-20 left-12 space-y-2.5 p-5 rounded-xl bg-white/40 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none border border-brand-border dark:border-transparent shadow-sm dark:shadow-none">
          <div className="text-[13px] font-mono text-emerald-500/50 dark:text-emerald-400/50 tracking-[0.3em]">SYS.STATUS</div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[15px] font-mono text-brand-text-secondary">NEURAL_CORE ONLINE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay:'0.5s'}} />
            <span className="text-[15px] font-mono text-brand-text-tertiary">SAT_FEED v4.2.1</span>
          </div>
        </motion.div>

        {/* Top-right: Clock */}
        <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:1.8,duration:1}}
          className="absolute top-20 right-12 text-right space-y-2 p-5 rounded-xl bg-white/40 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none border border-brand-border dark:border-transparent shadow-sm dark:shadow-none">
          <div className="text-[13px] font-mono text-emerald-500/50 dark:text-emerald-400/50 tracking-[0.3em]">UTC.SYNC</div>
          <div className="text-[27px] font-mono text-brand-text-secondary tabular-nums">{time}</div>
          <div className="text-[13px] font-mono text-brand-text-muted">LAT 17.385 · LON 78.487</div>
        </motion.div>

        {/* Bottom-left: Metrics */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2,duration:1}}
          className="absolute bottom-20 left-12 space-y-3.5 p-5 rounded-xl bg-white/40 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none border border-brand-border dark:border-transparent shadow-sm dark:shadow-none">
          {[
            {label:'PREDICTION.ACCURACY', value:'96.7%', color:'text-emerald-500/70 dark:text-emerald-400/70'},
            {label:'ACTIVE.MODELS', value:'2,847', color:'text-cyan-500/60 dark:text-cyan-400/60'},
            {label:'REGION.COVERAGE', value:'28 STATES', color:'text-brand-text-tertiary'},
          ].map((m,i) => (
            <div key={i} className="flex items-center gap-5">
              <span className="text-[13px] font-mono text-brand-text-muted w-48">{m.label}</span>
              <span className={`text-[16px] font-mono ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom-right: Live feed */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.2,duration:1}}
          className="absolute bottom-20 right-12 text-right p-5 rounded-xl bg-white/40 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none border border-brand-border dark:border-transparent shadow-sm dark:shadow-none">
          <div className="text-[13px] font-mono text-emerald-500/50 dark:text-emerald-400/50 tracking-[0.3em] mb-2.5">LIVE.INTEL</div>
          <div className="text-[15px] font-mono text-brand-text-tertiary space-y-2">
            <div>▸ SOIL_N₂ OPTIMAL [SECTOR 903]</div>
            <div>▸ MONSOON PATTERN DETECTED</div>
            <div className="text-emerald-500/60 dark:text-emerald-400/40">▸ YIELD FORECAST +14.2%</div>
          </div>
        </motion.div>
      </div>

      {/* Center Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Prominent Hero Brand Emblem Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: -15 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="relative group cursor-pointer">
            {/* Multi-layer ambient emerald & gold glow effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-amber-400/25 rounded-[2.2rem] blur-2xl opacity-60 group-hover:opacity-90 transition duration-700 animate-pulse" />
            
            {/* Option 2: Translucent Cyber-Glass HUD Frame */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[2rem] p-3.5 bg-emerald-950/20 dark:bg-emerald-950/30 border-2 border-emerald-400/30 shadow-glow-sm backdrop-blur-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-glow">
              <img 
                src="/kisanvision_emblem.png" 
                alt="KisanVision Official Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)]" 
              />
            </div>
          </div>

          {/* System status indicator pill */}
          <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-glow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.22em] uppercase">
              KISANVISION AI AGRICULTURE PLATFORM
            </span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:1.2,ease:[0.16,1,0.3,1]}}
          className="font-display font-bold tracking-[-0.04em] leading-[1.05] sm:leading-[0.88] mb-6">
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-brand-text-primary">
            <T>Deciphering Earth's</T>
          </span>
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
            <T>Agricultural Code</T>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8,duration:1}}
          className="text-brand-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-light">
          <T>Satellite intelligence. Predictive crop modeling. Explainable AI decisions. One unified command center.</T>
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1,duration:0.8}}
          className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/recommend"
            className="group relative px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-brand-bg font-display font-semibold text-sm rounded-xl flex items-center gap-2 hover:shadow-glow-lg transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]">
            <Zap size={15} />
            <T>Initialize Analysis</T>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#ai-pipeline"
            className="px-8 py-3.5 border border-brand-border hover:border-emerald-500/30 text-brand-text-secondary hover:text-emerald-500 font-display font-medium text-sm rounded-xl transition-all duration-500 backdrop-blur-sm">
            <T>Explore System</T>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <motion.div animate={{y:[0,8,0]}} transition={{duration:2,repeat:Infinity}} className="w-[1px] h-8 bg-gradient-to-b from-emerald-500/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default CommandCenterHero;
