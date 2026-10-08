import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import T from './T';
import { useLanguage } from '../context/LanguageContext';
import { speechService } from '../utils/speechService';

const FeaturePanel = ({ activeTab, children }) => {
    const { language } = useLanguage();
    const contentRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleReadAloud = async () => {
        if (isSpeaking) {
            await speechService.stopSpeaking();
            setIsSpeaking(false);
            return;
        }

        if (contentRef.current) {
            const textToRead = contentRef.current.innerText;
            if (!textToRead || !textToRead.trim()) return;

            setIsSpeaking(true);
            await speechService.speak({
                text: textToRead,
                language,
                onStart: () => setIsSpeaking(true),
                onEnd: () => setIsSpeaking(false),
                onError: (err) => {
                    setIsSpeaking(false);
                    console.warn('TTS error:', err);
                }
            });
        }
    };

    // Ensure speech stops safely when tab changes
    useEffect(() => {
        speechService.stopSpeaking();
        setIsSpeaking(false);
        return () => {
            speechService.stopSpeaking();
        };
    }, [activeTab]);

    return (
        <div className="flex-1 min-w-0">
            <div className="flex justify-end mb-6">
                <button 
                    onClick={handleReadAloud}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-surface-elevated text-brand-text-primary border border-brand-border rounded-xl hover:bg-brand-surface-hover transition-all shadow-premium text-[10px] font-black uppercase tracking-widest group"
                    title="Read content aloud"
                >
                    {isSpeaking ? (
                        <>
                            <VolumeX size={14} className="text-red-500 animate-pulse" />
                            <T as="span" className="text-red-500">Stop Reading</T>
                        </>
                    ) : (
                        <>
                            <Volume2 size={14} className="text-brand-primary group-hover:scale-110 transition-transform" />
                            <T as="span">Read Aloud</T>
                        </>
                    )}
                </button>
            </div>
            <div ref={contentRef} className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FeaturePanel;
