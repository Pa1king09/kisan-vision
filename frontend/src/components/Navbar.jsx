import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, Home as HomeIcon, Sprout, LogOut, User, Wheat, 
  Sun, Moon, Menu, X, Bug, Calendar, Building2, TrendingUp, 
  Users, Satellite, ShoppingBag, CloudRain, Tractor, ChevronDown,
  Search, Sparkles, Command, Cpu, History, ArrowRight, ShieldAlert,
  Layers, Server, Smartphone, Download, ArrowUpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import CommandPalette from './CommandPalette';
import ServerModal from './ServerModal';
import T from './T';
import { useLanguage } from '../context/LanguageContext';

const MEGA_MENU_CATEGORIES = [
  {
    title: 'Crop Health & Advisory',
    icon: '🌾',
    badge: 'AI Agronomy',
    items: [
      {
        name: 'Instant Disease Doctor',
        path: '/disease-detection',
        icon: Bug,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        desc: 'Leaf photo & voice symptom AI diagnosis'
      },
      {
        name: 'Farm Calendar',
        path: '/farm-calendar',
        icon: Calendar,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        desc: '16-Week crop management & irrigation schedule'
      },
      {
        name: 'ZBNF Organic Recipes',
        path: '/organic-recipes',
        icon: Leaf,
        color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
        desc: 'Jeevamrut, Neemastra & natural bio-pesticides'
      }
    ]
  },
  {
    title: 'Land & Satellite',
    icon: '🛰️',
    badge: 'Remote Sensing',
    items: [
      {
        name: 'Satellite NDVI',
        path: '/satellite-mapping',
        icon: Satellite,
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        desc: 'Sentinel-2 multispectral crop vigor index'
      }
    ]
  },
  {
    title: 'Commerce & Machinery',
    icon: '🚜',
    badge: 'Equipment Pool',
    items: [
      {
        name: 'AgroLease Connect',
        path: '/land-lease',
        icon: Layers,
        badge: 'NEW',
        badgeColor: 'bg-emerald-500 text-slate-950 font-black',
        color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 shadow-sm',
        desc: 'Find & lease agricultural land directly from owners'
      },
      {
        name: 'Equipment Sharing Hub',
        path: '/equipment',
        icon: Tractor,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        desc: 'Rent tractors, harvesters & drone sprayers'
      },
      {
        name: 'Agri Marketplace',
        path: '/marketplace',
        icon: ShoppingBag,
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        desc: 'Buy organic fertilizers, seeds & bio-inputs'
      },
      {
        name: 'Market Price Forecast',
        path: '/market-forecast',
        icon: TrendingUp,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        desc: 'Mandi price trends & profit projections'
      }
    ]
  },
  {
    title: 'Finance & Community',
    icon: '🏛️',
    badge: 'Govt & Peers',
    items: [
      {
        name: 'PMFBY Crop Damage Claim',
        path: '/pmfby-claim',
        icon: ShieldAlert,
        badge: '72H NOTICE',
        badgeColor: 'bg-rose-500 text-white font-black animate-pulse',
        color: 'text-rose-400 bg-rose-500/15 border-rose-500/40 shadow-sm',
        desc: 'Hailstorm/flood 72h loss notice & claim letter'
      },
      {
        name: 'Schemes & Loans',
        path: '/loan-eligibility',
        icon: Building2,
        color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        desc: 'PM-KISAN, KCC credit & state subsidy checks'
      },
      {
        name: 'Community Forum',
        path: '/forum',
        icon: Users,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        desc: 'Farmer peer Q&A and agronomy discussion'
      },
      {
        name: 'Farm History & Records',
        path: '/history',
        icon: History,
        color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
        desc: 'Past prediction logs & recommendation records'
      }
    ]
  }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const megaMenuRef = useRef(null);

  const isHome = location.pathname === '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 4 Primary Quick Tabs
  const primaryTabs = [
    { path: '/', labelKey: 'navHome', icon: <HomeIcon size={14} /> },
    { path: '/recommend', labelKey: 'navRecommend', icon: <Sprout size={14} /> },
    { path: '/weather-alerts', labelKey: 'navWeather', icon: <CloudRain size={14} /> },
    { path: '/my-farm', labelKey: 'navMyFarm', icon: <Wheat size={14} /> }
  ];

  const navBg = isScrolled ? 'glass-panel-premium' : 'bg-transparent border-transparent';
  const textSecondary = 'text-brand-text-secondary';
  const hoverText = 'hover:text-brand-primary';
  const activeBg = 'bg-brand-primary/10 text-brand-primary font-bold';
  const btnBg = 'bg-brand-primary/5 border-brand-border hover:bg-brand-primary/10';
  const btnText = 'text-brand-text-secondary hover:text-brand-primary';

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-2.5' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`relative flex items-center justify-between transition-all duration-500 px-4 sm:px-5 py-2.5 rounded-2xl border ${navBg} shadow-sm backdrop-blur-xl`}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 mr-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden p-1 bg-white shadow-md border-2 border-emerald-500/40 shadow-glow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow flex items-center justify-center shrink-0">
                <img 
                  src="/kisanvision_emblem_clean.png" 
                  alt="KisanVision Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg sm:text-xl font-black tracking-tight hidden sm:block font-display leading-tight ${isHome ? 'text-white' : 'text-brand-text-primary'}`}>
                  Kisan<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">Vision</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.22em] text-emerald-500 dark:text-emerald-400 uppercase hidden sm:block leading-none mt-0.5">
                  AI Agriculture Platform
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation */}
            {user && (
              <div className="hidden lg:flex items-center gap-1.5" ref={megaMenuRef}>
                
                {/* 4 Core Daily Tabs */}
                {primaryTabs.map((tab) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      className={`relative text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                        isActive ? activeBg : `${textSecondary} ${hoverText} hover:bg-white/5`
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{t(tab.labelKey)}</span>
                    </Link>
                  );
                })}

                {/* ⚡ Services Mega-Menu Trigger */}
                <div>
                  <button
                    onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                    className={`relative text-xs font-black uppercase tracking-wider flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all duration-200 ${
                      megaMenuOpen
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md font-black'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    <Sparkles size={13} className={megaMenuOpen ? 'text-slate-950' : 'text-emerald-400 animate-pulse'} />
                    <span>{t('navServices') || 'Services'}</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* ═══ MEGA-MENU DROPDOWN PANEL ═══ */}
                  <AnimatePresence>
                    {megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 sm:right-2 top-full mt-3 w-[840px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl z-[150]"
                      >
                        {/* Top banner inside mega-menu */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                              KisanVision Platform Ecosystem & Services
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-white/40 font-mono">
                            Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded text-slate-700 dark:text-white/70">Ctrl+K</kbd> to search
                          </span>
                        </div>

                        {/* Emergency Quick Action Callout for PMFBY 72h Claim */}
                        <Link
                          to="/pmfby-claim"
                          onClick={() => setMegaMenuOpen(false)}
                          className="flex items-center justify-between p-3 mb-4 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-100/60 to-amber-50 dark:from-rose-950/80 dark:via-rose-900/40 dark:to-slate-900 border border-rose-300 dark:border-rose-500/50 hover:border-rose-500 dark:hover:border-rose-400 shadow-md dark:shadow-lg text-xs transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-400/40 shadow-inner">
                              <ShieldAlert size={17} className="animate-pulse" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-rose-800 dark:text-rose-300 uppercase tracking-wide text-xs">
                                  🚨 Crop Damaged by Hailstorm or Flood?
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse">
                                  72-Hour Rule
                                </span>
                              </div>
                              <p className="text-[10px] text-rose-950/80 dark:text-white/70 mt-0.5">
                                Intimate damage within 72h. Auto-calculate compensation & generate official claim intimation letter.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 group-hover:translate-x-1 transition-all shrink-0 pr-1">
                            <span>File Claim Now</span> <ArrowRight size={13} />
                          </div>
                        </Link>

                        {/* 4 Categorized Columns */}
                        <div className="grid grid-cols-4 gap-3.5 sm:gap-4">
                          {MEGA_MENU_CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="space-y-2">
                              {/* Category Header */}
                              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-1.5">
                                  <span>{cat.icon}</span>
                                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    <T>{cat.title}</T>
                                  </h4>
                                </div>
                              </div>

                              {/* Tools List */}
                              <div className="space-y-1">
                                {cat.items.map((item, itemIdx) => {
                                  const ItemIcon = item.icon;
                                  return (
                                    <Link
                                      key={itemIdx}
                                      to={item.path}
                                      onClick={() => setMegaMenuOpen(false)}
                                      className="group block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-150"
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.color} mt-0.5`}>
                                          <ItemIcon size={13} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <p className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                                              <T>{item.name}</T>
                                            </p>
                                            {item.badge && (
                                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${item.badgeColor || 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                                                {item.badge}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[9.5px] text-slate-500 dark:text-white/40 group-hover:text-slate-700 dark:group-hover:text-white/60 transition-colors line-clamp-1 leading-tight mt-0.5">
                                            <T>{item.desc}</T>
                                          </p>
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Quick Strip inside Mega-Menu */}
                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
                          <span className="text-[11px]">
                            🌾 Need agricultural assistance? <strong className="text-emerald-600 dark:text-emerald-400">Ask the AI Chatbot</strong> in the bottom right corner.
                          </span>
                          <button
                            onClick={() => {
                              setMegaMenuOpen(false);
                              setCommandPaletteOpen(true);
                            }}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider"
                          >
                            Open Fast Finder <ArrowRight size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}

            {/* Right Action Icons: Search (Ctrl+K), Language, Theme, User */}
            <div className="flex items-center gap-2">
              
              {/* Quick Search Ctrl+K Pill */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-surface-elevated hover:bg-brand-surface border border-brand-border hover:border-emerald-500/40 rounded-xl text-brand-text-secondary hover:text-brand-text-primary text-xs transition-all shadow-sm group"
                title="Search tools (Ctrl+K)"
              >
                <Search size={13} className="text-brand-text-tertiary group-hover:text-emerald-400 transition-colors" />
                <span className="text-[11px] font-medium hidden xl:inline">Search</span>
                <span className="px-1.5 py-0.2 bg-brand-bg rounded text-[9px] font-mono text-brand-text-tertiary border border-brand-border">
                  ⌘K
                </span>
              </button>

              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>

              {/* Download Mobile APK Button */}
              <Link
                to="/download"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all hover:scale-105"
                title="Download Kisan Vision Mobile APK"
              >
                <Smartphone size={13} className="animate-pulse" />
                <span>App</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 font-mono">APK</span>
              </Link>

              {/* Server Connection Config */}
              <button
                onClick={() => setServerModalOpen(true)}
                className={`no-scale w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-300 ${btnBg} ${btnText}`}
                title="Configure Backend Server Connection"
              >
                <Server size={14} className="text-emerald-400" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`no-scale w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-300 ${btnBg} ${btnText}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* User Profile */}
              {user && (
                <div className="hidden lg:flex items-center gap-1.5 pl-2 ml-1 border-l border-white/10">
                  <div className={`flex items-center gap-1.5 ${textSecondary}`}>
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <User size={13} />
                    </div>
                    <span className="text-xs font-bold text-brand-text-primary">{user?.username || user?.name || 'Farmer'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="no-scale p-1.5 hover:bg-red-500/10 text-white/30 hover:text-red-400 rounded-lg transition-all"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`no-scale lg:hidden w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${btnBg} ${btnText}`}
              >
                {mobileOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ═══ MOBILE OVERLAY DRAWER ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-slate-50 dark:bg-slate-950 flex flex-col pt-24 px-6 pb-8 lg:hidden overflow-y-auto transition-colors duration-300"
          >
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setMobileOpen(false);
                setCommandPaletteOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-700 dark:text-white/70 shadow-sm mb-6"
            >
              <span className="flex items-center gap-2">
                <Search size={15} className="text-emerald-600 dark:text-emerald-400" /> <T>Search all tools & features...</T>
              </span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-transparent rounded text-[10px] text-slate-700 dark:text-white/70">Ctrl+K</kbd>
            </button>

            {/* Categorized Mobile Navigation */}
            <div className="flex-1 space-y-6">
              {/* Core Links */}
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest mb-2">
                  <T>Quick Access</T>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {primaryTabs.map((tab) => (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      onClick={() => setMobileOpen(false)}
                      className="p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 border border-slate-200 dark:border-white/5 shadow-sm transition-colors"
                    >
                      {tab.icon} <span>{t(tab.labelKey)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Emergency PMFBY 72h Quick Banner */}
              <Link
                to="/pmfby-claim"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-100/70 to-amber-50 dark:from-rose-950/80 dark:via-rose-900/50 dark:to-slate-900 border border-rose-300 dark:border-rose-500/50 shadow-md text-xs transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-400/40">
                    <ShieldAlert size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="font-black text-rose-800 dark:text-rose-300 text-xs block">
                      <T>PMFBY 72-Hour Crop Damage Claim</T>
                    </span>
                    <span className="text-[10px] text-rose-900/70 dark:text-white/60">
                      <T>File intimation dossier & calculate claim payout</T>
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse shrink-0">
                  72H
                </span>
              </Link>

              {/* Mega Categories on Mobile */}
              {MEGA_MENU_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-500 dark:text-white/40 tracking-widest flex items-center gap-1.5">
                    <span>{cat.icon}</span> <T>{cat.title}</T>
                  </p>
                  <div className="space-y-1">
                    {cat.items.map((item, itemIdx) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-medium text-slate-800 dark:text-white/80 shadow-sm transition-colors"
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                            <ItemIcon size={13} />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white"><T>{item.name}</T></span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">

              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setServerModalOpen(true);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-white/10 shadow-sm"
                    title="Configure Backend Server"
                  >
                    <Server size={15} />
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/10 shadow-sm"
                  >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </div>
              </div>

              {user && (
                <div className="flex items-center justify-between bg-white dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-white">
                    <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold">{user?.username || user?.name || 'Farmer'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-500 dark:text-red-400 px-3 py-1 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GLOBAL COMMAND PALETTE (CTRL + K) ═══ */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* ═══ SERVER CONNECTION CONFIG MODAL ═══ */}
      <ServerModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
