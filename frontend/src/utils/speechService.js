import { Capacitor, registerPlugin } from '@capacitor/core';

export const KisanSpeech = registerPlugin('KisanSpeech');

export const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
  or: 'or-IN',
  as: 'as-IN'
};

export const LANG_NAMES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  mr: 'मराठी (Marathi)',
  bn: 'বাংলা (Bengali)',
  gu: 'ગુજરાતી (Gujarati)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)'
};

let webRecognition = null;

export const speechService = {
  isNative: () => Capacitor.isNativePlatform(),

  startListening: async ({ language = 'en', onTranscript, onError, onStart, onEnd }) => {
    const langTag = SPEECH_LANG_MAP[language] || 'en-IN';

    if (Capacitor.isNativePlatform()) {
      try {
        try {
          await KisanSpeech.removeAllListeners();
        } catch (_) {}

        let isHandled = false;

        const cleanup = async () => {
          try {
            await KisanSpeech.removeAllListeners();
          } catch (_) {}
        };

        await KisanSpeech.addListener('speechResult', async (data) => {
          if (isHandled) return;
          isHandled = true;
          await cleanup();
          if (data && data.text && onTranscript) {
            onTranscript(data.text);
          }
          if (onEnd) onEnd();
        });

        await KisanSpeech.addListener('speechError', async (data) => {
          if (isHandled) return;
          isHandled = true;
          await cleanup();
          const err = data?.error || '';
          if (!err) {
            if (onEnd) onEnd();
            return;
          }
          const lower = err.toLowerCase();
          // Filter out normal user cancellations, silence, timeouts, or transient states
          if (
            !lower.includes('cancel') &&
            !lower.includes('stopped') &&
            !lower.includes('busy') &&
            !lower.includes('no-speech') &&
            !lower.includes('no speech') &&
            !lower.includes('no match')
          ) {
            if (onError) onError(err);
          }
          if (onEnd) onEnd();
        });

        await KisanSpeech.addListener('speechStart', () => {
          if (onStart) onStart();
        });

        await KisanSpeech.addListener('speechEnd', async () => {
          await cleanup();
          if (onEnd) onEnd();
        });

        const res = await KisanSpeech.startListening({ language: langTag });
        if (res && res.text && onTranscript && !isHandled) {
          isHandled = true;
          await cleanup();
          onTranscript(res.text);
          if (onEnd) onEnd();
        } else if (res && res.error && !isHandled) {
          isHandled = true;
          await cleanup();
          const err = res.error;
          const lower = err.toLowerCase();
          if (
            !lower.includes('cancel') &&
            !lower.includes('stopped') &&
            !lower.includes('busy') &&
            !lower.includes('no-speech') &&
            !lower.includes('no speech') &&
            !lower.includes('no match')
          ) {
            if (onError) onError(err);
          }
          if (onEnd) onEnd();
        }
      } catch (err) {
        console.warn('Native speech error:', err);
        const errMsg = err?.message || (typeof err === 'string' ? err : '');
        const lower = errMsg.toLowerCase();
        if (
          errMsg &&
          !lower.includes('cancel') &&
          !lower.includes('stopped') &&
          !lower.includes('busy') &&
          !lower.includes('no-speech') &&
          !lower.includes('no speech') &&
          !lower.includes('no match')
        ) {
          if (onError) onError(errMsg);
        }
        if (onEnd) onEnd();
      }
    } else {
      // Web fallback
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        if (onError) onError('Speech recognition is not supported in this browser.');
        return;
      }

      try {
        if (webRecognition) {
          try { webRecognition.abort(); } catch (_) {}
        }

        webRecognition = new SpeechRecognition();
        webRecognition.continuous = false;
        webRecognition.interimResults = false;
        webRecognition.lang = langTag;

        webRecognition.onstart = () => {
          if (onStart) onStart();
        };

        webRecognition.onresult = (e) => {
          const transcript = e.results?.[0]?.[0]?.transcript;
          if (transcript && onTranscript) {
            onTranscript(transcript);
          }
        };

        webRecognition.onerror = (e) => {
          console.warn('Web speech error:', e.error);
          let msg = 'Speech recognition error.';
          if (e.error === 'not-allowed') {
            msg = 'Microphone permission denied. Please allow microphone access.';
          } else if (e.error === 'no-speech') {
            msg = 'No speech detected. Please speak louder.';
          }
          if (onError) onError(msg);
          if (onEnd) onEnd();
        };

        webRecognition.onend = () => {
          if (onEnd) onEnd();
        };

        webRecognition.start();
      } catch (e) {
        if (onError) onError(e.message || 'Error starting speech recognition.');
        if (onEnd) onEnd();
      }
    }
  },

  stopListening: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await KisanSpeech.stopListening();
      } catch (_) {}
    } else if (webRecognition) {
      try {
        webRecognition.stop();
      } catch (_) {}
    }
  },

  speak: async ({ text, language = 'en', onStart, onEnd, onError }) => {
    if (!text || !text.trim()) return;
    const langTag = SPEECH_LANG_MAP[language] || 'en-IN';
    const cleanText = text.replace(/[*_~`#\[\]\(\)>]/g, ' ').replace(/\s+/g, ' ').trim();

    if (Capacitor.isNativePlatform()) {
      try {
        let ttsListener = null;
        ttsListener = await KisanSpeech.addListener('ttsState', (data) => {
          if (data && data.speaking) {
            if (onStart) onStart();
          } else {
            if (ttsListener) ttsListener.remove();
            if (onEnd) onEnd();
          }
        });

        if (onStart) onStart();
        await KisanSpeech.speak({ text: cleanText, language: langTag });
      } catch (err) {
        console.warn('Native TTS error:', err);
        if (onError) onError(err?.message || 'TTS Error');
        if (onEnd) onEnd();
      }
    } else {
      // Web fallback
      try {
        if (typeof window === 'undefined' || !('speechSynthesis' in window) || !window.speechSynthesis) {
          if (onError) onError('Text-to-speech is not supported on this device.');
          return;
        }

        try { window.speechSynthesis.cancel(); } catch (_) {}

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = langTag;
        utterance.rate = 0.95;

        utterance.onstart = () => { if (onStart) onStart(); };
        utterance.onend = () => { if (onEnd) onEnd(); };
        utterance.onerror = () => { if (onEnd) onEnd(); };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Web TTS error:', e);
        if (onEnd) onEnd();
      }
    }
  },

  stopSpeaking: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await KisanSpeech.stopSpeaking();
      } catch (_) {}
    } else {
      try {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
    }
  }
};

export default speechService;
