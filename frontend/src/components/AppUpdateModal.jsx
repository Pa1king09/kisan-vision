import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, ArrowUpCircle, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getActiveApiUrl } from '../utils/mobileInit';
import { CURRENT_APP_VERSION, compareVersions } from '../config/appVersion';
import toast from 'react-hot-toast';

export default function AppUpdateModal() {
  const [updateData, setUpdateData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkForUpdate();

    const handleManualCheck = (e) => {
      const force = e?.detail?.forceShow;
      checkForUpdate(force);
    };

    window.addEventListener('kisan_check_app_update', handleManualCheck);
    return () => window.removeEventListener('kisan_check_app_update', handleManualCheck);
  }, []);

  const checkForUpdate = async (forceShow = false) => {
    try {
      const activeBase = getActiveApiUrl();
      const res = await axios.get(`${activeBase}/app-version`, { timeout: 6000 });
      if (res.data?.success && res.data?.latestVersion) {
        const hasNewer = compareVersions(res.data.latestVersion, CURRENT_APP_VERSION) > 0;
        if (hasNewer) {
          setUpdateData(res.data);
          setIsOpen(true);
          return;
        } else if (forceShow) {
          toast.success(`App is already up to date (v${CURRENT_APP_VERSION})!`, { icon: '✨' });
          return;
        }
      }
    } catch (err) {
      console.log('App update check skipped:', err.message);
    }

    if (forceShow) {
      toast.success(`App is already up to date (v${CURRENT_APP_VERSION})!`, { icon: '✨' });
    }
  };

  const handleUpdateNow = () => {
    if (!updateData?.downloadUrl) {
      toast.error('Download link unavailable. Please try again.');
      return;
    }

    setIsDownloading(true);
    setProgress(15);

    // Simulate progress animation for user feedback while browser triggers download
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      let url = updateData.directDownloadUrl || updateData.downloadUrl;
      if (url.startsWith('/')) {
        const activeBase = getActiveApiUrl().replace(/\/api\/?$/, '');
        url = `${activeBase}${url}`;
      }
      
      // Trigger download via anchor tag with download attribute
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.setAttribute('download', `KisanVision-v${updateData.latestVersion || '1.0.20'}.apk`);
      anchor.setAttribute('target', '_system');
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => {
        setProgress(100);
        setIsDownloading(false);
        toast.success('Download started! Tap the downloaded APK in your notifications to install.', {
          duration: 7000
        });
        if (!updateData.forceUpdate) {
          setIsOpen(false);
        }
      }, 2000);
    } catch (err) {
      clearInterval(progressTimer);
      setIsDownloading(false);
      window.open(updateData.downloadUrl, '_system');
    }
  };

  const isMandatory = updateData?.forceUpdate || (
    updateData?.minimumSupportedVersion && 
    compareVersions(CURRENT_APP_VERSION, updateData.minimumSupportedVersion) < 0
  );

  if (!isOpen || !updateData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white"
        >
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-br from-emerald-600/30 via-slate-900 to-teal-900/30 border-b border-white/10 relative">
            {!isMandatory && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            )}

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <ArrowUpCircle size={28} className="text-emerald-400 animate-bounce" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                {isMandatory ? 'Mandatory Update' : 'New Version Available'}
              </span>
            </div>

            <h2 className="text-xl font-black tracking-tight text-white uppercase">
              {updateData.title || 'New Version Available'}
            </h2>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              {updateData.message || 'A new version of Kisan Vision is available. Update now to get the latest features, improvements and bug fixes.'}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4 max-h-[45vh] overflow-y-auto">
            {/* Version Info Pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs">
              <div>
                <span className="text-white/40 block text-[10px] font-bold uppercase">Current Version</span>
                <span className="font-mono font-bold text-white/70">v{CURRENT_APP_VERSION}</span>
              </div>
              <div className="text-emerald-400 font-black text-sm">→</div>
              <div className="text-right">
                <span className="text-emerald-400/70 block text-[10px] font-bold uppercase">Latest Version</span>
                <span className="font-mono font-black text-emerald-400">v{updateData.latestVersion}</span>
              </div>
            </div>

            {/* Release Notes */}
            {Array.isArray(updateData.releaseNotes) && updateData.releaseNotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-white/60">
                  What's New in this Update
                </h4>
                <div className="space-y-1.5">
                  {updateData.releaseNotes.map((note, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-white/80">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar (Visible while downloading) */}
            {isDownloading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Downloading APK...
                  </span>
                  <span className="font-mono text-white/80">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-950/70 border-t border-white/10 flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleUpdateNow}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Downloading...
                </>
              ) : (
                <>
                  <Download size={14} strokeWidth={2.5} /> Update Now
                </>
              )}
            </button>

            {!isMandatory && !isDownloading && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Later
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
