import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Loader2, Sprout, Sparkles, Cpu, 
  Shield, User, Lock, ArrowRight, CheckCircle2, Server 
} from 'lucide-react';
import T, { TD } from '../components/T';
import { useTranslated } from '../hooks/useTranslate';
import ServerModal from '../components/ServerModal';

const Register = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverModalOpen, setServerModalOpen] = useState(false);
    const { str } = useTranslated({
        usernamePlaceholder: "Choose a username",
        passwordPlaceholder: "Minimum 6 characters",
        confirmPasswordPlaceholder: "Re-enter your password"
    });

    if (user) return <Navigate to="/" replace />;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username) return setError('Please enter a username');
        if (username.length < 3) return setError('Username must be at least 3 characters');
        if (!password) return setError('Please enter a password');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        if (password !== confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        setError('');

        const result = await register(username, password);
        if (result.success) {
            console.log('Registration successful, forcing redirect...');
            window.location.href = '/language';
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    // Stagger container animation profiles
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const elementVariants = {
        hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-stretch justify-center relative overflow-hidden transition-colors duration-500 select-none">
            {/* Top-Right Floating Server Settings Button */}
            <button
                type="button"
                onClick={() => setServerModalOpen(true)}
                className="absolute top-4 right-4 z-50 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs font-bold backdrop-blur-xl shadow-xl transition-all"
                title="Configure Backend Server Connection"
            >
                <Server size={14} className="animate-pulse" />
                <span>Server Settings</span>
            </button>

            {/* Cinematic background glow orbs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '14s' }} />
                <div className="absolute bottom-[25%] right-[-10%] w-[45%] h-[45%] bg-emerald-400/5 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '11s' }} />
            </div>

            {/* Subtle global noise overlay */}
            <div className="noise-overlay pointer-events-none" />

            {/* SPLIT LAYOUT GRID */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 relative z-10">
                
                {/* ==========================================
                    LEFT COLUMN (7/12): CINEMATIC BRAND PANEL
                    ========================================== */}
                <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-16 relative border-r border-brand-border/40 overflow-hidden bg-brand-surface-inset/20">
                    {/* Floating subtle grid coordinates */}
                    <div className="absolute top-12 left-12 text-[8px] font-black text-brand-primary/20 tracking-[0.3em] uppercase">
                        SECURE_ACCESS_GATE // GRID_COGNITIVE
                    </div>
                    
                    {/* TOP BRAND EMBLEM */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center space-x-3.5 relative z-10"
                    >
                        <div className="w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-amber-500/20 border border-emerald-500/30 shadow-premium flex items-center justify-center bg-white/5">
                            <img src="/kisanvision_logo.jpg" alt="KisanVision Logo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-brand-text-primary uppercase leading-none">
                                Kisan<span className="text-amber-500">Vision</span>
                            </span>
                            <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase mt-1">
                                AI Agriculture Platform
                            </span>
                        </div>
                    </motion.div>

                    {/* CENTERPIECE STORYTELLING CONTAINER */}
                    <div className="my-auto max-w-lg space-y-10 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
                                <Sparkles size={11} className="animate-pulse" /> <T>SYSTEM_PORTAL_ACTIVE</T>
                            </span>
                            <h2 className="text-5xl font-black text-brand-text-primary leading-[1.05] tracking-tight uppercase">
                                <T>THE NEXT FRONTIER OF</T> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-400 to-teal-400 italic">
                                    <T>DECISION INTELLIGENCE</T>
                                </span>
                            </h2>
                            <p className="text-brand-text-secondary font-medium leading-relaxed text-sm">
                                <T>Precision agriculture powered by explainable intelligence. Access telemetry modeling, satellite diagnostics, and ML-engineered crop analytics inside an elite dashboard cockpit.</T>
                            </p>
                        </motion.div>

                        {/* Interactive dynamic micro indicators */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="grid grid-cols-2 gap-6 pt-6 border-t border-brand-border/40"
                        >
                            <div className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary mt-0.5">
                                    <Shield size={12} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-wide"><T>ENTERPRISE PROTOCOLS</T></h4>
                                    <p className="text-[9px] text-brand-text-secondary font-medium"><T>End-to-end telemetry encryption verified.</T></p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary mt-0.5">
                                    <Cpu size={12} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-wide"><T>XGB REASON ENGINES</T></h4>
                                    <p className="text-[9px] text-brand-text-secondary font-medium"><T>Model predictive accuracy peaks at 98.4%.</T></p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* FOOTER METADATA */}
                    <div className="flex items-center justify-between text-[9px] font-black text-brand-text-secondary/40 uppercase tracking-widest relative z-10">
                        <span>LAT_18.96 // LNG_72.82</span>
                        <span>© 2026 KisanVision COGNITIVE SYSTEMS</span>
                    </div>

                    {/* Topographic interactive mesh background lines */}
                    <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay">
                        <svg viewBox="0 0 1000 1000" className="w-full h-full">
                            <circle cx="500" cy="500" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                            <circle cx="500" cy="500" r="250" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
                        </svg>
                    </div>
                </div>

                {/* ==========================================
                    RIGHT COLUMN (5/12): REGISTER PANEL
                    ========================================== */}
                <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-8 md:p-12 relative">
                    
                    {/* Top mobile-only header badge */}
                    <div className="lg:hidden text-center mb-10 space-y-3">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-white/5 border border-emerald-500/30 mx-auto shadow-premium">
                            <img src="/kisanvision_logo.jpg" alt="KisanVision" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <h1 className="text-3xl font-black text-brand-text-primary uppercase tracking-tighter">
                            Kisan<span className="text-amber-500">Vision</span>
                        </h1>
                        <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">AI Agriculture Platform</p>
                    </div>

                    {/* AUTHENTICATION GLASS CARD CONTAINER */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-[420px] bg-brand-surface/40 border border-brand-border/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-premium relative overflow-hidden"
                    >
                        {/* High-fidelity top glossy highlight lines */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

                        {/* Title group */}
                        <motion.div variants={elementVariants} className="space-y-1 mb-6">
                            <span className="text-[8px] font-black tracking-[0.25em] text-brand-primary uppercase">
                                <T>ACCOUNT SECURITY PROTOCOL</T>
                            </span>
                            <h3 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight">
                                <T>Sign Up</T>
                            </h3>
                        </motion.div>

                        {/* Register form wrapper */}
                        <form onSubmit={handleRegister} className="space-y-4.5">
                            
                            {/* Input: Username */}
                            <motion.div variants={elementVariants} className="space-y-1.5 relative group">
                                <div className="flex justify-between items-center">
                                    <T as="label" className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">
                                        Username
                                    </T>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight"><T>3 to 20 chars</T></span>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary/40 group-focus-within:text-brand-primary transition-colors">
                                        <User size={15} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-brand-surface-inset border border-brand-border rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-brand-text-primary placeholder:text-brand-text-secondary/30 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all outline-none"
                                        placeholder={str.usernamePlaceholder}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {/* Focus bottom bar indicator */}
                                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-brand-primary scale-x-0 group-focus-within:scale-x-100 transition-transform origin-center" />
                                </div>
                            </motion.div>

                            {/* Input: Password */}
                            <motion.div variants={elementVariants} className="space-y-1.5 relative group">
                                <T as="label" className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">
                                    Password
                                </T>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary/40 group-focus-within:text-brand-primary transition-colors">
                                        <Lock size={15} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-brand-surface-inset border border-brand-border rounded-xl py-3 pl-11 pr-11 text-xs font-semibold text-brand-text-primary placeholder:text-brand-text-secondary/30 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all outline-none"
                                        placeholder={str.passwordPlaceholder}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-secondary/40 hover:text-brand-primary transition-colors focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                    {/* Focus bottom bar indicator */}
                                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-brand-primary scale-x-0 group-focus-within:scale-x-100 transition-transform origin-center" />
                                </div>
                            </motion.div>

                            {/* Input: Confirm Password */}
                            <motion.div variants={elementVariants} className="space-y-1.5 relative group">
                                <T as="label" className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">
                                    Confirm Password
                                </T>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary/40 group-focus-within:text-brand-primary transition-colors">
                                        <Lock size={15} />
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-brand-surface-inset border border-brand-border rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-brand-text-primary placeholder:text-brand-text-secondary/30 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all outline-none"
                                        placeholder={str.confirmPasswordPlaceholder}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {/* Focus bottom bar indicator */}
                                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-brand-primary scale-x-0 group-focus-within:scale-x-100 transition-transform origin-center" />
                                </div>
                            </motion.div>

                            {/* Dynamic Interactive Error Panel */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="bg-red-500/10 text-red-400 p-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 text-center flex items-center justify-center gap-2"
                                    >
                                        <span>⚠️</span> <TD value={error} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Button: Submit */}
                            <motion.button
                                variants={elementVariants}
                                type="submit"
                                disabled={loading}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-2 py-4 bg-gradient-to-r from-emerald-500 to-brand-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-premium hover:opacity-95 transition-all disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <T>Creating Account...</T>
                                    </>
                                ) : (
                                    <>
                                        <T>Create Account</T>
                                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer Switcher Options */}
                        <motion.div 
                            variants={elementVariants}
                            className="mt-8 text-center border-t border-brand-border/40 pt-6"
                        >
                            <p className="text-[11px] text-brand-text-secondary font-bold">
                                <T>Already have an account?</T>{' '}
                                <Link to="/login" className="text-brand-primary font-black hover:underline underline-offset-4 transition-all">
                                    <T>Login</T>
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Server Settings Modal */}
            <ServerModal
                isOpen={serverModalOpen}
                onClose={() => setServerModalOpen(false)}
            />
        </div>
    );
};

export default Register;
