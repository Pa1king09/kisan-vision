import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scan, Activity, Satellite, Cpu, ArrowUpRight, Zap, ShieldCheck, 
  Droplets, Wind, Compass, Sparkles, Eye, Layers, Gauge
} from 'lucide-react';
import T from '../T';

const BentoGridShowcase = () => {
  const [diseaseViewMode, setDiseaseViewMode] = useState('ar'); // 'ar' | 'heatmap'

  return (
    <section className="relative py-28 bg-brand-bg overflow-hidden transition-colors duration-500">
      {/* Background ambient glow & grid styling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[650px] h-[650px] bg-emerald-500/[0.05] dark:bg-emerald-500/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.04] dark:bg-cyan-500/[0.02] rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 dark:bg-emerald-500/5 mb-5 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.25em]">
              Next-Gen Autonomous Agriculture
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-brand-text-primary tracking-tight leading-[1.05]"
          >
            <T>Precision Intelligence in Every Pixel</T>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-brand-text-secondary leading-relaxed font-sans"
          >
            <T>Seamlessly fusioning IoT field sensors, autonomous aerial robotics, sub-meter satellite spectral imaging, and Explainable AI diagnostics.</T>
          </motion.p>
        </div>

        {/* ─── Apple-Style Bento Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* =========================================================================
              CARD 1: Drone Precision Agriculture (Large 7 Columns)
             ========================================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-12 lg:col-span-7 group relative rounded-[2.5rem] overflow-hidden border border-brand-border/80 dark:border-white/10 bg-brand-surface shadow-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-emerald-500/10 min-h-[440px] flex flex-col justify-between"
          >
            {/* Photographic Background with Zoom Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/hero_precision_agri.jpg" 
                alt="Autonomous Agricultural Drone"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-108 filter brightness-[0.92] dark:brightness-[0.75] contrast-[1.05]"
              />
              {/* Gradient Scrims for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 dark:from-black/95 dark:via-black/50 dark:to-transparent" />
              
              {/* Animated HUD Laser Scanline */}
              <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500">
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scanner" />
              </div>
            </div>

            {/* Top HUD Telemetry Bar */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono tracking-wider font-semibold text-emerald-300">
                  UAV-ALPHA · ACTIVE MISSION
                </span>
              </div>

              {/* Floating Coordinates Telemetry */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/80 font-mono text-[11px]">
                <span>LAT 17.3850° N</span>
                <span className="text-white/30">|</span>
                <span>LON 78.4867° E</span>
                <span className="text-white/30">|</span>
                <span className="text-cyan-300 font-bold">ALT 15.2m</span>
              </div>
            </div>

            {/* Crosshair targeting reticle in middle */}
            <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <div className="relative w-28 h-28 border border-emerald-400/40 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-20 h-20 border border-dashed border-cyan-400/50 rounded-full" />
                <div className="absolute w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute -top-1 w-2 h-0.5 bg-emerald-400" />
                <div className="absolute -bottom-1 w-2 h-0.5 bg-emerald-400" />
                <div className="absolute -left-1 w-0.5 h-2 bg-emerald-400" />
                <div className="absolute -right-1 w-0.5 h-2 bg-emerald-400" />
              </div>
            </div>

            {/* Bottom Content & Metrics HUD */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2">
                <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Coverage
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">99.4%</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Spray Drift
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">0.02%</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Battery
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">89%</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    <T>Autonomous Aerial Spraying & Scouting</T>
                  </h3>
                  <p className="text-sm text-gray-300 mt-1 max-w-md font-sans">
                    <T>Centimeter-grade RTK positioning delivers ultra-targeted crop treatments with 65% less chemical usage.</T>
                  </p>
                </div>
                <Link 
                  to="/field-mapping"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                >
                  <T>Deploy Fleet</T>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD 2: Disease Scanner AR Lens (5 Columns)
             ========================================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-12 lg:col-span-5 group relative rounded-[2.5rem] overflow-hidden border border-brand-border/80 dark:border-white/10 bg-brand-surface shadow-2xl transition-all duration-500 hover:border-red-500/40 hover:shadow-red-500/10 min-h-[440px] flex flex-col justify-between"
          >
            {/* Photographic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/disease_scanner_ar.jpg" 
                alt="AI Leaf Disease Scanner"
                className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-108 filter brightness-[0.88] dark:brightness-[0.7] contrast-[1.1] ${diseaseViewMode === 'heatmap' ? 'hue-rotate-60 saturate-200' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

              {/* AR Bounding Box Overlay */}
              <div className="absolute top-[28%] left-[22%] right-[22%] bottom-[32%] border-2 border-red-500/80 rounded-xl pointer-events-none shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
                
                {/* Floating Tag over bounding box */}
                <div className="absolute -top-7 left-0 bg-red-600/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Scan className="w-3 h-3" />
                  <span>EARLY BLIGHT : 98.2%</span>
                </div>
              </div>
            </div>

            {/* Top Bar with View Mode Toggle */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-300 font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>AR PATHOLOGY LENS</span>
              </div>

              {/* Toggle: AR vs Grad-CAM */}
              <div className="inline-flex p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
                <button
                  type="button"
                  onClick={() => setDiseaseViewMode('ar')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${diseaseViewMode === 'ar' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  RGB-AR
                </button>
                <button
                  type="button"
                  onClick={() => setDiseaseViewMode('heatmap')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${diseaseViewMode === 'heatmap' ? 'bg-amber-500 text-black shadow font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  GRAD-CAM
                </button>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-mono font-semibold">Diagnosis Confidence</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">98.2% Optimal Match</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-red-500 to-rose-600 rounded-full w-[98.2%]" />
                </div>
                <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                  <span>Pathogen: Alternaria solani</span>
                  <span className="text-cyan-400 font-mono">Organic Protocol Ready</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-2xl font-display font-black text-white tracking-tight">
                    <T>Real-time Plant Pathology</T>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 font-sans">
                    <T>Instant diagnostic scanning with biological organic prescription.</T>
                  </p>
                </div>
                <Link 
                  to="/disease-detection"
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 hover:scale-105"
                  title="Scan Crop Now"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD 3: NDVI Satellite Spectral Map (5 Columns)
             ========================================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="md:col-span-12 lg:col-span-5 group relative rounded-[2.5rem] overflow-hidden border border-brand-border/80 dark:border-white/10 bg-brand-surface shadow-2xl transition-all duration-500 hover:border-cyan-500/40 hover:shadow-cyan-500/10 min-h-[440px] flex flex-col justify-between"
          >
            {/* Photographic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/satellite_ndvi_heatmap.jpg" 
                alt="NDVI Satellite Spectral Heatmap"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-108 filter brightness-[0.88] dark:brightness-[0.75] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
            </div>

            {/* Top Bar with Satellite Orbit Status */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-semibold">
                <Satellite className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
                <span>SENTINEL-2 L2A · MULTISPECTRAL</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-200/80 bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
                10m/px GSD
              </span>
            </div>

            {/* Bottom Content with NDVI Spectral Color Bar */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-gray-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Mean NDVI Canopy Index
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">0.82 (Vigorous)</span>
                </div>

                {/* Color Spectrum Gradient Bar */}
                <div className="space-y-1">
                  <div className="h-2 rounded-full w-full bg-gradient-to-r from-red-600 via-amber-400 via-emerald-400 to-green-600 shadow-inner" />
                  <div className="flex justify-between text-[9px] font-mono text-gray-400">
                    <span>Stress (0.1)</span>
                    <span>Moderate (0.5)</span>
                    <span className="text-emerald-300 font-bold">Dense Biomass (0.9)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-2xl font-display font-black text-white tracking-tight">
                    <T>Satellite Canopy Intelligence</T>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 font-sans">
                    <T>Sub-surface moisture and chlorophyll indices computed from space.</T>
                  </p>
                </div>
                <Link 
                  to="/field-mapping"
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 hover:scale-105"
                  title="View Satellite Map"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD 4: Soil Sensor & IoT Diagnostics (Large 7 Columns)
             ========================================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="md:col-span-12 lg:col-span-7 group relative rounded-[2.5rem] overflow-hidden border border-brand-border/80 dark:border-white/10 bg-brand-surface shadow-2xl transition-all duration-500 hover:border-amber-500/40 hover:shadow-amber-500/10 min-h-[440px] flex flex-col justify-between"
          >
            {/* Photographic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/images/xai_soil_diagnostics.jpg" 
                alt="Smart Soil IoT Probes"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-108 filter brightness-[0.85] dark:brightness-[0.7] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
            </div>

            {/* Top Bar with IoT Connectivity Telemetry */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-[11px] font-semibold">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>IOT MESH NODE · PROBE #04</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>TELEMETRY ONLINE · PING 8ms</span>
              </div>
            </div>

            {/* Bottom Content with N-P-K & Soil Telemetry Matrix */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              {/* Telemetry Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Nitrogen (N)</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">85 mg/kg</div>
                  <span className="text-[9px] text-emerald-300 font-mono">● High Fertility</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Phosphorus (P)</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">42 mg/kg</div>
                  <span className="text-[9px] text-cyan-300 font-mono">● Balanced</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Potassium (K)</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">120 mg/kg</div>
                  <span className="text-[9px] text-amber-300 font-mono">● Optimal</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Moisture / pH</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">38% · 6.8 pH</div>
                  <span className="text-[9px] text-rose-300 font-mono">● Neutral Loam</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    <T>Subterranean Soil Telemetry</T>
                  </h3>
                  <p className="text-sm text-gray-300 mt-1 max-w-md font-sans">
                    <T>Continuous electrochemical sensing of root-zone nutrients feeds our Explainable AI crop match algorithms.</T>
                  </p>
                </div>
                <Link 
                  to="/recommend"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40"
                >
                  <T>Analyze Soil</T>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BentoGridShowcase;
