import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Server, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getActiveApiUrl, setActiveApiUrl } from '../utils/mobileInit';
import { toast } from 'react-hot-toast';

export default function ServerModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(getActiveApiUrl());
      setStatus(null);
    }
  }, [isOpen]);

  const testConnection = async (testUrl) => {
    const target = (testUrl || url).trim().replace(/\/+$/, '');
    const pingEndpoint = target.endsWith('/api') ? `${target}/disease-model-status` : `${target}/api/disease-model-status`;

    setTesting(true);
    setStatus(null);
    try {
      const res = await axios.get(pingEndpoint, { timeout: 4000 });
      if (res.status === 200) {
        setStatus({ ok: true, message: 'Server connected successfully!' });
        toast.success('Connected to Kisan Vision backend!');
      } else {
        setStatus({ ok: false, message: `Unexpected status code: ${res.status}` });
      }
    } catch (err) {
      setStatus({ ok: false, message: `Connection failed: ${err.message}. Check if backend is running.` });
      toast.error('Unable to reach backend');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setActiveApiUrl(url);
    toast.success('Backend server URL updated!');
    onClose();
  };

  const presets = [
    { label: 'Cloudflare Live Tunnel (4G/5G)', url: 'https://funny-impose-integrity-quit.trycloudflare.com/api' },
    { label: 'Local PC Wi-Fi', url: 'http://10.223.59.130:5005/api' },
    { label: 'Android Emulator', url: 'http://10.0.2.2:5005/api' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Server Connection</h3>
                  <p className="text-[10px] text-white/50">Configure Kisan Vision backend server</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">
                  Backend API URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://192.168.x.x:5005/api"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/40 block mb-1.5 uppercase tracking-wider">
                  Quick Presets
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {presets.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setUrl(p.url);
                        testConnection(p.url);
                      }}
                      className="px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-medium text-emerald-400 truncate"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {status && (
                <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                  status.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {status.ok ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                  <span className="text-[11px]">{status.message}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => testConnection()}
                  disabled={testing}
                  className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw size={13} className={testing ? 'animate-spin' : ''} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
