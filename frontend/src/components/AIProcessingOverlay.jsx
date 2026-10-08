import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, CloudSun, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
    { id: 0, icon: Database,  label: 'Analyzing soil composition…',        color: '#1F7A63' },
    { id: 1, icon: CloudSun,  label: 'Processing weather conditions…',     color: '#3B82F6' },
    { id: 2, icon: Cpu,       label: 'Running ML prediction model…',       color: '#8B5CF6' },
    { id: 3, icon: Sparkles,  label: 'Generating recommendation…',         color: '#F59E0B' },
    { id: 4, icon: CheckCircle2, label: 'Analysis complete!',              color: '#10B981' },
];

const AIProcessingOverlay = ({ isActive, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isReady, setIsReady] = useState(false);      // API has responded
    const [isDismissing, setIsDismissing] = useState(false);

    // Timer-driven step advancement
    useEffect(() => {
        if (!isActive) {
            setCurrentStep(0);
            setIsReady(false);
            setIsDismissing(false);
            return;
        }

        // Advance steps on a timer (800ms each for steps 0-3)
        if (currentStep < 4) {
            const timer = setTimeout(() => {
                // If API is ready and we're past step 1, jump to final
                if (isReady && currentStep >= 1) {
                    setCurrentStep(4);
                } else {
                    setCurrentStep(prev => Math.min(prev + 1, 3));
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isActive, currentStep, isReady]);

    // When API responds, mark ready
    useEffect(() => {
        if (!isActive && currentStep === 0) return;
        // The parent sets isActive to false when data arrives
        // But we want to finish the animation first
    }, [isActive]);

    // External signal: data arrived
    // The parent will call this via a ref or by changing a prop
    // We use the isActive prop going from true→false as the signal
    useEffect(() => {
        if (!isActive && currentStep > 0 && !isDismissing) {
            setIsReady(true);
            // If we're already past step 1, jump to complete
            if (currentStep >= 1) {
                setCurrentStep(4);
            }
        }
    }, [isActive]);

    // When we reach step 4 (complete), dismiss after a brief pause
    useEffect(() => {
        if (currentStep === 4 && !isDismissing) {
            const timer = setTimeout(() => {
                setIsDismissing(true);
                setTimeout(() => {
                    onComplete?.();
                    setCurrentStep(0);
                    setIsReady(false);
                    setIsDismissing(false);
                }, 500);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isDismissing, onComplete]);

    const showOverlay = isActive || currentStep > 0;
    if (!showOverlay) return null;

    const step = STEPS[currentStep] || STEPS[0];
    const StepIcon = step.icon;
    const progress = Math.min(((currentStep + 1) / STEPS.length) * 100, 100);

    return (
        <AnimatePresence>
            {!isDismissing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="relative flex flex-col items-center max-w-md w-full mx-6"
                    >
                        {/* Orbital rings */}
                        <div className="relative w-32 h-32 mb-10">
                            {/* Outer orbit */}
                            <div className="absolute inset-0 ai-orbit">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-primary/40" />
                            </div>
                            {/* Inner orbit (reverse) */}
                            <div className="absolute inset-2 ai-orbit-reverse">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-primary/60" />
                            </div>
                            {/* Center brain icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-brand-primary flex items-center justify-center ai-processing-pulse">
                                    <Brain size={36} className="text-white" />
                                </div>
                            </div>
                            {/* Orbit ring visuals */}
                            <div className="absolute inset-0 rounded-full border border-white/10 ai-orbit" />
                            <div className="absolute inset-3 rounded-full border border-white/5 ai-orbit-reverse" />
                        </div>

                        {/* Current step label */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-3 mb-8"
                            >
                                <StepIcon size={20} style={{ color: step.color }} />
                                <span className="text-white font-bold text-sm tracking-wide">
                                    {step.label}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress bar */}
                        <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
                            <motion.div
                                className="h-full bg-brand-primary rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>

                        {/* Step indicators */}
                        <div className="flex items-center gap-3">
                            {STEPS.slice(0, 4).map((s, i) => (
                                <div
                                    key={s.id}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        i < currentStep ? 'bg-brand-primary scale-100' :
                                        i === currentStep ? 'bg-white scale-125' :
                                        'bg-white/20 scale-100'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Subtle text */}
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-8">
                            KisanVision Engine Processing
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIProcessingOverlay;
