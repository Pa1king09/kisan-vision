import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Download, Smartphone, ShieldCheck, Sparkles, CheckCircle2, 
  Share2, ArrowLeft, QrCode, Leaf, Cpu, Bug, Satellite, 
  Check, Copy, ExternalLink, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DownloadApp() {
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin + '/download');
    }
  }, []);

  const apkUrl = '/download/KisanVision.apk';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=064e3b&bgcolor=ffffff&data=${encodeURIComponent(currentUrl || 'https://kisanvision.app')}`;

  const handleDownloadClick = () => {
    setDownloadStarted(true);
    toast.success('Download started! Check your browser notifications.', {
      duration: 6000,
      icon: '🌱'
    });
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Download link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌾 Download the official Kisan Vision Android App for AI crop predictions, disease detection, and smart agriculture:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-emerald-500/30 selection:text-white relative overflow-hidden transition-colors duration-500 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/[0.07] dark:bg-emerald-500/[0.05] rounded-full blur-[180px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 border-b border-brand-border/60 bg-brand-surface/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl p-1 bg-emerald-950/30 border border-emerald-500/30 shadow-glow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/kisanvision_emblem.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                KISAN VISION
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                OFFICIAL APK
              </span>
            </div>
          </Link>

          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-text-secondary hover:text-emerald-500 transition-colors px-3 py-1.5 rounded-xl border border-transparent hover:border-brand-border"
          >
            <ArrowLeft size={16} />
            <span>Open Web Platform</span>
          </Link>
        </div>
      </header>

      {/* Main Download Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold tracking-wide uppercase mb-4 shadow-sm"
          >
            <Smartphone size={13} className="text-emerald-500" />
            <span>Direct Android APK Download</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black tracking-tight mb-4"
          >
            Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500">Kisan Vision</span> on Your Phone
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-brand-text-secondary text-sm sm:text-base leading-relaxed"
          >
            Download and install the official native Android app. Scan crops instantly with your camera, get offline guidance, and receive automated weather and disease alerts.
          </motion.p>
        </div>

        {/* Hero Card: Download Action & Specs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl border border-emerald-500/30 bg-brand-surface/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 mb-12 relative overflow-hidden"
        >
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side: App Icon & Core Specs */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2.5 bg-emerald-950/20 dark:bg-emerald-950/40 border-2 border-emerald-400/40 shadow-glow flex items-center justify-center flex-shrink-0">
                  <img src="/kisanvision_emblem.png" alt="Kisan Vision App" className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-brand-text-primary">
                    Kisan Vision Android
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-500 font-semibold flex items-center gap-1.5 justify-center lg:justify-start mt-0.5">
                    <ShieldCheck size={15} /> Verified Safe Release Package
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 justify-center lg:justify-start text-[11px] font-mono text-brand-text-muted">
                    <span className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border">v1.0.15</span>
                    <span className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border">~26 MB</span>
                    <span className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border">Android 7.0+</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-6">
                <a
                  href={apkUrl}
                  download="KisanVision-Release.apk"
                  onClick={handleDownloadClick}
                  className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-black text-base flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                  <span>Download APK (26 MB)</span>
                </a>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  title="Share on WhatsApp"
                >
                  <Share2 size={18} />
                  <span>Share APK Link</span>
                </button>
              </div>

              {/* Status Alert if Download Clicked */}
              {downloadStarted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="w-full p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 mb-4"
                >
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <span>Download started! Pull down your phone's notification bar to view progress and tap to install.</span>
                </motion.div>
              )}

              {/* Quick Link Copy Box */}
              <div className="w-full flex items-center gap-2 bg-brand-bg/60 border border-brand-border rounded-xl p-2 text-xs font-mono text-brand-text-secondary">
                <span className="truncate flex-1 pl-2 text-brand-text-muted">{currentUrl || 'Loading URL...'}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border hover:border-emerald-500/50 text-brand-text-primary text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Right side: QR Code Scanner for Mobile */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-bg/50 border border-brand-border text-center">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-bold mb-3 uppercase tracking-wider">
                <QrCode size={15} />
                <span>Scan with Phone Camera</span>
              </div>
              
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-emerald-500/30 mb-3 hover:scale-105 transition-transform duration-300">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code to Download Kisan Vision APK" 
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>

              <p className="text-[12px] text-brand-text-muted max-w-[220px] leading-relaxed">
                Scan with any smartphone camera or Google Lens to download APK directly to your phone.
              </p>
            </div>

          </div>
        </motion.div>

        {/* 3-Step Installation Guide */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-display font-bold">
              Easy 3-Step Installation Guide
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              How to install an APK file on your Android smartphone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-brand-border bg-brand-surface/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono font-black text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-2">Tap "Download APK"</h4>
              <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
                Click the download button above or scan the QR code. If Chrome warns <i>"File might be harmful"</i>, choose <b>Download anyway</b>.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-brand-surface/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono font-black text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-2">Allow Unknown Sources</h4>
              <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
                Open the downloaded file from your notifications. If prompted by Android, tap <b>Settings</b> and toggle on <b>Allow from this source</b>.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-brand-surface/60 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono font-black text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-2">Install & Launch</h4>
              <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
                Tap <b>Install</b>. Once finished, tap <b>Open</b> to experience Kisan Vision's AI crop doctor, market forecast, and satellite mapping!
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="rounded-3xl border border-brand-border bg-brand-surface/40 p-6 sm:p-8 backdrop-blur-md">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-display font-bold">
              What's Included in the Mobile APK
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-bg/50 border border-brand-border/60">
              <Bug size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm">AI Leaf Doctor</h5>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Instant disease diagnosis from camera leaf photos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-bg/50 border border-brand-border/60">
              <Leaf size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm">Soil & Crop Advisory</h5>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Custom N-P-K nutrient matching & organic recipes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-bg/50 border border-brand-border/60">
              <Satellite size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm">Satellite Crop Health</h5>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Sentinel-2 NDVI multispectral farm vigor index.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-bg/50 border border-brand-border/60">
              <Cpu size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm">Explainable AI</h5>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Clear reasons behind every crop and revenue prediction.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
