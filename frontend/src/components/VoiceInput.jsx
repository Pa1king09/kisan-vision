import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, X, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { playVoiceStart, playVoiceEnd } from '../utils/soundFx';
import { speechService, SPEECH_LANG_MAP, LANG_NAMES } from '../utils/speechService';

export { SPEECH_LANG_MAP, LANG_NAMES };

export default function VoiceInput({
  onTranscript,
  textToSpeak = '',
  size = 'md', // 'sm' | 'md'
  showSpeaker = false,
  className = ''
}) {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isDebouncingRef = useRef(false);

  const langName = LANG_NAMES[language] || 'English';

  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  const toggleListening = async () => {
    // Debounce rapid mic taps (prevents race condition when tapped 2-3 times)
    if (isDebouncingRef.current) return;
    isDebouncingRef.current = true;
    setTimeout(() => { isDebouncingRef.current = false; }, 400);

    if (isListening) {
      await speechService.stopListening();
      setIsListening(false);
      playVoiceEnd();
    } else {
      setIsListening(true);
      playVoiceStart();

      await speechService.startListening({
        language,
        onStart: () => setIsListening(true),
        onEnd: () => {
          setIsListening(false);
          playVoiceEnd();
        },
        onTranscript: (transcript) => {
          setIsListening(false);
          playVoiceEnd();
          if (transcript && onTranscript) {
            onTranscript(transcript);
            toast.success(`Heard: "${transcript}"`, { id: 'voice-speech-status', duration: 3000, icon: '🎙️' });
          }
        },
        onError: (err) => {
          setIsListening(false);
          playVoiceEnd();
          const lower = String(err || '').toLowerCase();
          // Filter out user cancellation, stopped, recognizer busy, or silence/timeouts
          if (
            err &&
            !lower.includes('cancel') &&
            !lower.includes('stopped') &&
            !lower.includes('busy') &&
            !lower.includes('no-speech') &&
            !lower.includes('no speech') &&
            !lower.includes('no match')
          ) {
            toast.error(err, { id: 'voice-speech-status', duration: 3500 });
          }
        }
      });
    }
  };

  const toggleSpeak = async () => {
    if (isSpeaking) {
      await speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      if (!textToSpeak) return;
      setIsSpeaking(true);
      await speechService.speak({
        text: textToSpeak,
        language,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (err) => {
          setIsSpeaking(false);
          toast.error(err);
        }
      });
    }
  };

  const btnSize = size === 'sm' ? 'w-9 h-9 min-w-[36px] min-h-[36px]' : 'w-10 h-10 min-w-[40px] min-h-[40px]';
  const iconSize = size === 'sm' ? 16 : 18;

  // 12 Waveform bars with differing animation amplitudes for the Gemini/Siri waveform
  const waveHeights = [24, 48, 72, 36, 80, 54, 88, 42, 68, 30, 52, 28];

  return (
    <>
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {/* Microphone Button (rendered when onTranscript is supplied) */}
        {onTranscript && (
          <button
            type="button"
            onClick={toggleListening}
            title={`Speak in ${langName}`}
            aria-label={`Speak in ${langName}`}
            className={`relative ${btnSize} rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 scale-105 ring-2 ring-emerald-400'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isListening ? (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <Mic size={iconSize} className="animate-pulse" />
              </>
            ) : (
              <Mic size={iconSize} />
            )}
          </button>
        )}

        {/* Speaker Button (TTS for messages) */}
        {showSpeaker && textToSpeak && (
          <button
            type="button"
            onClick={toggleSpeak}
            title={isSpeaking ? 'Stop reading' : `Listen in ${langName}`}
            aria-label={isSpeaking ? 'Stop reading' : `Listen in ${langName}`}
            className={`relative ${btnSize} rounded-xl flex items-center justify-center transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/40 animate-pulse'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isSpeaking ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
          </button>
        )}
      </div>

      {/* ─── Animated Siri / Google Gemini-Style Voice Waveform Overlay ─── */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4"
            onClick={toggleListening}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl p-8 bg-slate-950/90 border border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Radial ambient background aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-indigo-500/25 rounded-full blur-[70px] pointer-events-none animate-pulse" />

              {/* Close Button */}
              <button
                type="button"
                onClick={toggleListening}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              {/* Top Language Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Listening in {langName}</span>
              </div>

              {/* Central Glowing Mic Ring */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/50 relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
                  <Mic size={32} />
                </div>
                {/* Rippling Pulse Rings */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" style={{ animationDuration: '1.8s' }} />
                <div className="absolute -inset-3 rounded-full border border-cyan-400/40 animate-pulse" style={{ animationDuration: '1.4s' }} />
              </div>

              {/* ── Siri / Gemini Fluid Oscillating Waveform ── */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-24 w-full px-4 mb-6">
                {waveHeights.map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scaleY: [0.2, 1, 0.4, 0.9, 0.3],
                      opacity: [0.6, 1, 0.7, 1, 0.6]
                    }}
                    transition={{
                      duration: 0.8 + (i % 4) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.08
                    }}
                    className="w-1.5 sm:w-2 rounded-full origin-center shadow-lg"
                    style={{
                      height: `${h}px`,
                      background: i % 3 === 0
                        ? 'linear-gradient(to top, #10b981, #34d399)'
                        : i % 3 === 1
                          ? 'linear-gradient(to top, #06b6d4, #38bdf8)'
                          : 'linear-gradient(to top, #6366f1, #818cf8)'
                    }}
                  />
                ))}
              </div>

              {/* Subtext Prompt */}
              <p className="text-white text-base font-semibold tracking-tight">
                "Speak your crop symptoms, soil question, or farm request..."
              </p>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                Click anywhere or press Stop when finished
              </p>

              {/* Stop Listening Button */}
              <button
                type="button"
                onClick={toggleListening}
                className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all hover:scale-105"
              >
                Done Speaking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
