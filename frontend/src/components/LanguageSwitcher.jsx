import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const LanguageSwitcher = ({ compact = false }) => {
  const { currentLanguage, LANGUAGES, selectLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filtered = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    (lang.region && lang.region.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobile]);

  const handleSelect = (code) => {
    selectLanguage(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={t('changeLanguage')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 font-bold text-xs border select-none ${
          isOpen 
            ? 'bg-brand-primary/15 border-brand-primary/35 text-brand-primary shadow-sm' 
            : 'bg-brand-primary/5 hover:bg-brand-primary/10 border-brand-primary/15 text-brand-primary'
        }`}
      >
        <Globe size={15} className="shrink-0 text-emerald-400" />
        {!compact && (
          <span className="hidden sm:inline max-w-[70px] truncate">{currentLanguage.nativeName}</span>
        )}
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md text-slate-900 shrink-0" style={{ background: 'linear-gradient(135deg,#34D399,#22D3EE)' }}>
          {currentLanguage.code === 'en' ? 'EN' : currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown
          size={13}
          className="transition-transform duration-200 shrink-0"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Language Selection Dialog / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* MOBILE: Centered Modal Overlay (Prevents Horizontal Overflow & Keyboard Push) */}
            {isMobile ? (
              <div 
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
                onClick={() => { setIsOpen(false); setSearch(''); }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-sm max-h-[85vh] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Globe size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('changeLanguage')}</h3>
                        <p className="text-[10px] text-white/50">Select your preferred language</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); setSearch(''); }}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Search Bar - No autofocus on mobile so keyboard does not push layout */}
                  <div className="px-4 py-3 border-b border-white/10 bg-slate-900/80">
                    <div className="relative">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        placeholder={t('searchPlaceholder') || "Search language (English, Hindi, Telugu...)"}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-500 text-white placeholder:text-white/40 font-medium outline-none transition-colors"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Language List - Smooth Scrollable */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[50vh]" style={{ overscrollBehavior: 'contain' }}>
                    {filtered.length === 0 ? (
                      <div className="text-center py-8 text-white/40 text-xs font-medium">
                        No language found matching "{search}"
                      </div>
                    ) : (
                      filtered.map(lang => {
                        const isActive = lang.code === currentLanguage.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-left ${
                              isActive
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-white shadow-md'
                                : 'hover:bg-white/5 border border-transparent text-white/80'
                            }`}
                          >
                            <span 
                              className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-950 shadow-sm ${
                                isActive ? 'ring-2 ring-emerald-400' : ''
                              }`}
                              style={{ background: 'linear-gradient(135deg,#34D399,#14B8A6)' }}
                            >
                              {lang.code.toUpperCase()}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-white leading-tight flex items-center gap-1.5">
                                <span>{lang.nativeName}</span>
                                {isActive && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 font-bold rounded-full">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-white/50 font-medium truncate mt-0.5">
                                {lang.name} • {lang.region}
                              </div>
                            </div>
                            {isActive && (
                              <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Footer link to full language page */}
                  <div className="border-t border-white/10 px-4 py-3 bg-slate-950/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); navigate('/language'); }}
                      className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{t('allLanguages')}</span>
                      <span>→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); setSearch(''); }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* DESKTOP: Sleek Attached Dropdown */
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden z-[200] shadow-2xl bg-brand-surface border border-brand-border backdrop-blur-md"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-brand-primary" />
                    <span className="text-xs font-black text-brand-text-secondary uppercase tracking-widest">{t('changeLanguage')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-brand-text-secondary hover:text-brand-text-primary"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Search */}
                <div className="px-3 py-2 border-b border-brand-border">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-brand-surface-inset border border-brand-border focus:outline-none focus:border-brand-primary font-medium text-brand-text-primary placeholder:text-brand-text-secondary"
                    />
                  </div>
                </div>

                {/* Language List */}
                <div className="max-h-64 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent-primary) transparent' }}>
                  {filtered.length === 0 ? (
                    <div className="text-center py-6 text-brand-text-secondary text-xs font-medium">No language found</div>
                  ) : (
                    filtered.map(lang => {
                      const isActive = lang.code === currentLanguage.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelect(lang.code)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-surface-hover transition-colors text-left group"
                        >
                          <span className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg,#10B981,#14B8A6)' }}>
                            {lang.code.toUpperCase()}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-brand-text-primary leading-tight">{lang.nativeName}</div>
                            <div className="text-[10px] text-brand-text-secondary font-medium">{lang.name} • {lang.region}</div>
                          </div>
                          {isActive && (
                            <Check size={15} className="text-brand-primary flex-shrink-0" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer link to full language page */}
                <div className="border-t border-brand-border px-4 py-2.5 bg-brand-surface-inset flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); navigate('/language'); }}
                    className="text-xs text-brand-primary font-black hover:opacity-80 transition-colors uppercase tracking-wider"
                  >
                    {t('allLanguages')} →
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
