import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Sprout, CloudRain, Tractor, Leaf, ShoppingBag, 
  Satellite, Bug, Calendar, Building2, TrendingUp, Users, 
  Wheat, History, Cpu, ArrowRight, CornerDownLeft, Sparkles, ShieldAlert,
  Layers
} from 'lucide-react';
import T from './T';
import { useLanguage } from '../context/LanguageContext';

const TOOLS = [
  {
    name: 'Crop Recommendation',
    path: '/recommend',
    category: 'Crop Health & Advisory',
    icon: Sprout,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'AI-driven crop selection based on NPK, soil & climate',
    keywords: ['recommend', 'crop', 'soil', 'npk', 'fertilizer', 'yield', 'prediction']
  },
  {
    name: 'Instant Disease Doctor',
    path: '/disease-detection',
    category: 'Crop Health & Advisory',
    icon: Bug,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    description: 'Photo & symptom AI diagnosis for plant diseases',
    keywords: ['disease', 'leaf', 'photo', 'doctor', 'pest', 'fungus', 'treatment']
  },
  {
    name: 'Farm Calendar (16-Week Cycle)',
    path: '/farm-calendar',
    category: 'Crop Health & Advisory',
    icon: Calendar,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Stage-by-stage farming activities and irrigation schedules',
    keywords: ['calendar', 'schedule', 'week', 'sowing', 'harvest', 'activities']
  },
  {
    name: 'ZBNF Organic Recipes',
    path: '/organic-recipes',
    category: 'Crop Health & Advisory',
    icon: Leaf,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    description: 'Subhash Palekar recipes for Jeevamrut, Neemastra & Beejamrut',
    keywords: ['organic', 'zbnf', 'jeevamrut', 'neemastra', 'brahmastra', 'agniastra', 'palekar', 'natural']
  },
  {
    name: 'Real-Time Weather Alerts',
    path: '/weather-alerts',
    category: 'Land & Satellite',
    icon: CloudRain,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: 'Live localized weather, frost, heavy rain & drought warnings',
    keywords: ['weather', 'rain', 'temperature', 'forecast', 'frost', 'alert', 'storm']
  },
  {
    name: 'Satellite NDVI Crop Health',
    path: '/satellite-mapping',
    category: 'Land & Satellite',
    icon: Satellite,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    description: 'Sentinel-2 multispectral vegetation index mapping',
    keywords: ['satellite', 'ndvi', 'sentinel', 'vigor', 'vegetation', 'map', 'space']
  },
  {
    name: 'My Farm & Land Boundary',
    path: '/my-farm',
    category: 'Land & Satellite',
    icon: Wheat,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Interactive map perimeter selection & acreage auto-calculator',
    keywords: ['my farm', 'field', 'boundary', 'border', 'polygon', 'acreage', 'area']
  },
  {
    name: 'AgroLease Connect (Farmland Lease)',
    path: '/land-lease',
    category: 'Commerce & Machinery',
    icon: Layers,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Find & lease agricultural land or list farmland for rent',
    keywords: ['lease', 'land', 'farmland', 'agrolease', 'rent land', 'borewell', 'acres', 'hectares', 'owner']
  },
  {
    name: 'Farm Equipment & Tractor Hub',
    path: '/equipment',
    category: 'Commerce & Machinery',
    icon: Tractor,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Kisan Uber: Rent tractors, harvesters & drone sprayers',
    keywords: ['tractor', 'equipment', 'rent', 'machinery', 'drone', 'harvester', 'rotavator', 'uber']
  },
  {
    name: 'Agri-Input Marketplace',
    path: '/marketplace',
    category: 'Commerce & Machinery',
    icon: ShoppingBag,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    description: 'Verified organic inputs, seeds, fertilizers & farm tools',
    keywords: ['marketplace', 'shop', 'buy', 'seeds', 'fertilizer', 'pesticide', 'store']
  },
  {
    name: 'Yield & Market Price Forecast',
    path: '/market-forecast',
    category: 'Commerce & Machinery',
    icon: TrendingUp,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Mandi price trends, profit projection & selling advice',
    keywords: ['market', 'price', 'mandi', 'forecast', 'yield', 'profit', 'apmc']
  },
  {
    name: 'Government Schemes & Loans',
    path: '/loan-eligibility',
    category: 'Finance & Community',
    icon: Building2,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    description: 'PM-KISAN, KCC loan limits & subsidy eligibility checker',
    keywords: ['scheme', 'loan', 'pm-kisan', 'kcc', 'subsidy', 'government', 'kisan credit card']
  },
  {
    name: 'PMFBY 72-Hour Crop Loss Claim',
    path: '/pmfby-claim',
    category: 'Finance & Community',
    icon: ShieldAlert,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    description: '72-Hour crop damage intimation dossier & compensation calculator',
    keywords: ['pmfby', 'claim', 'insurance', 'damage', 'hailstorm', 'flood', '72 hour', 'fasal bima', 'loss', 'compensation']
  },
  {
    name: 'Farmer Community Forum',
    path: '/forum',
    category: 'Finance & Community',
    icon: Users,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    description: 'Connect, ask questions and share farming solutions with peers',
    keywords: ['forum', 'community', 'questions', 'ask', 'answers', 'discussion']
  },
  {
    name: 'Farm History & Records',
    path: '/history',
    category: 'Finance & Community',
    icon: History,
    color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    description: 'Past prediction logs, recommendation outcomes & history',
    keywords: ['history', 'logs', 'records', 'past', 'analytics']
  },
  {
    name: 'AI Farm Intelligence',
    path: '/intelligence',
    category: 'Crop Health & Advisory',
    icon: Cpu,
    color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
    description: 'Explainable AI telemetry, SHAP feature importance & risk models',
    keywords: ['intelligence', 'ai', 'explainable', 'shap', 'xai', 'model']
  }
];

const CommandPalette = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Filter tools based on query
  const filteredTools = TOOLS.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const translatedName = (t(item.name) || item.name).toLowerCase();
    const translatedCat = (t(item.category) || item.category).toLowerCase();
    const translatedDesc = (t(item.description) || item.description).toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      translatedName.includes(q) ||
      item.description.toLowerCase().includes(q) ||
      translatedDesc.includes(q) ||
      item.category.toLowerCase().includes(q) ||
      translatedCat.includes(q) ||
      item.keywords.some(k => k.includes(q))
    );
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTools.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          navigate(filteredTools[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 px-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50">
              <Search size={18} className="text-emerald-600 dark:text-emerald-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={t('searchPalettePlaceholder') || "Search tools, crops, or machinery (e.g. tractor, disease, weather, rice)..."}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all ml-2"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100/70 dark:bg-slate-950/30 border-b border-slate-200 dark:border-white/5 overflow-x-auto scrollbar-none text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-wider">
              <span><T>Quick</T>:</span>
              {['Tractor', 'Disease', 'Weather', 'Organic', 'NDVI', 'Schemes'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag.toLowerCase())}
                  className="px-2.5 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-slate-600 dark:text-white/60 shadow-xs"
                >
                  <T>{tag}</T>
                </button>
              ))}
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredTools.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-white/40 text-xs">
                  <T>No features found matching</T> "<span className="text-slate-900 dark:text-white">{query}</span>"
                </div>
              ) : (
                filteredTools.map((tool, index) => {
                  const Icon = tool.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={tool.path + tool.name}
                      onClick={() => {
                        navigate(tool.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-white shadow-sm'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent text-slate-800 dark:text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tool.color}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">
                              <T>{tool.name}</T>
                            </p>
                            <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 uppercase">
                              <T>{tool.category}</T>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-white/50 mt-0.5 line-clamp-1">
                            <T>{tool.description}</T>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 dark:text-white/40">
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <T>Jump</T> <CornerDownLeft size={10} />
                          </span>
                        )}
                        <ArrowRight size={14} className={isSelected ? 'text-emerald-600 dark:text-emerald-400 translate-x-0.5' : 'text-slate-300 dark:text-white/20'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-white/40 font-mono">
              <div className="flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-slate-200/80 dark:bg-white/10 rounded text-slate-700 dark:text-white/70">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-200/80 dark:bg-white/10 rounded text-slate-700 dark:text-white/70">↓</kbd> <T>to navigate</T></span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-200/80 dark:bg-white/10 rounded text-slate-700 dark:text-white/70">↵</kbd> <T>to select</T></span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-200/80 dark:bg-white/10 rounded text-slate-700 dark:text-white/70">esc</kbd> <T>to close</T></span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400/80 font-bold uppercase"><T>KISANVISION FAST NAVIGATOR</T></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
