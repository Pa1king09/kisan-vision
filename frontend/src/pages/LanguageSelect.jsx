import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, CheckCircle2, ArrowRight, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelect = () => {
  const { LANGUAGES, selectLanguage, language: currentLang, t } = useLanguage();
  const [selected, setSelected] = useState(currentLang);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    lang.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    selectLanguage(selected);
    navigate('/');
  };
  const selectedLang = LANGUAGES.find(l => l.code === selected);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #1F7A63 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, #145A4A 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center shadow-premium">
              <Globe className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-brand-text-primary mb-4 tracking-tight uppercase">
            {t('selectLanguage')}
          </h1>
          <p className="text-brand-text-secondary text-lg font-medium max-w-xl mx-auto leading-relaxed">
            {t('selectSubtitle')}
          </p>
          <p className="text-slate-300 text-[10px] mt-4 font-black uppercase tracking-[0.2em]">
            Choose your preferred interface language
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card !p-0 overflow-hidden w-full"
        >
          {/* Search bar */}
          <div className="p-6 border-b border-brand-border">
            <div className="relative">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-brand-surface-inset border border-brand-border text-brand-text-primary placeholder:text-brand-text-secondary text-sm font-bold focus:outline-none focus:border-brand-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Language grid */}
          <div className="p-6 max-h-[440px] overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-300 text-sm font-black uppercase tracking-widest">
                No language found
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((lang, idx) => {
                    const isSelected = selected === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelected(lang.code)}
                        className={`relative p-5 rounded-2xl text-left transition-all duration-300 group border ${
                          isSelected 
                            ? 'bg-brand-primary text-brand-bg border-brand-primary shadow-glow' 
                            : 'bg-brand-surface-inset border-brand-border hover:border-brand-primary/30 hover:shadow-premium'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 text-brand-primary"
                          >
                            <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                          </motion.div>
                        )}
                        <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                          isSelected ? 'bg-black/20 text-brand-bg' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {lang.code === 'en' ? 'EN' : 'IN'}
                        </div>
                        <div className={`font-black text-base leading-tight uppercase tracking-tight ${isSelected ? 'text-brand-bg' : 'text-brand-text-primary'}`}>{lang.nativeName}</div>
                        <div className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${isSelected ? 'text-brand-bg/80' : 'text-brand-text-secondary'}`}>{lang.name}</div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer / Continue Button */}
          <div className="p-6 bg-brand-surface-inset border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-surface-elevated border border-brand-border flex items-center justify-center text-xs font-black text-brand-primary shadow-sm">
                {selectedLang?.code === 'en' ? 'EN' : 'IN'}
              </div>
              <div className="text-left">
                <div className="text-brand-text-primary font-black text-sm uppercase tracking-tight">{selectedLang?.nativeName}</div>
                <div className="text-brand-text-secondary text-[10px] font-bold uppercase tracking-widest">{selectedLang?.name} • {selectedLang?.region}</div>
              </div>
            </div>
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-brand-primary text-brand-bg rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:bg-brand-dark hover:text-white transition-all"
            >
              {t('continueBtn')}
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Branding footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 flex items-center justify-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <Leaf size={14} className="text-brand-primary" />
          <span>Agro<span className="italic text-brand-text-primary">XAI</span> — Precision Farming</span>
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelect;
