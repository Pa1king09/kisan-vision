import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Volume2 } from 'lucide-react';
import axios from 'axios';
import T, { TD } from './T';
import { useLanguage } from '../context/LanguageContext';
import { useTranslated } from '../hooks/useTranslate';
import VoiceInput from './VoiceInput';
import { translateText } from '../utils/translate';

import { getActiveApiUrl } from '../utils/mobileInit';

const AgroChatbot = ({ context = {} }) => {
  const { language } = useLanguage();
  const { str } = useTranslated({
    welcomeMsg: "Hello! I'm **Kisan Vision Assistant** 🌱\nHow can I help with your farming today?",
    assistantName: "Kisan Vision Assistant",
    assistantSub: "Agricultural AI Advisor",
    thinking: "AI is thinking...",
    placeholder: "Ask about farming...",
    retry: "Retry Now",
    quotaMsg: "AI Quota Exceeded. Please wait a minute and try again.",
    unavailableMsg: "AI is temporarily unavailable.",
    suggestionLabel1: '🌾 Best crop for my soil',
    suggestionMessage1: 'What is the best crop for my current soil type?',
    suggestionLabel2: '🧪 Improve soil health',
    suggestionMessage2: 'How can I improve my soil health naturally?',
    suggestionLabel3: '💊 Fertilizer advice',
    suggestionMessage3: 'What fertilizer should I use for my crop?',
    suggestionLabel4: '🌧️ Irrigation tips',
    suggestionMessage4: 'What are the best irrigation practices for my region?'
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm **Kisan Vision Assistant** 🌱\nHow can I help with your farming today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Keep initial bot message synchronized with active language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'bot') {
        return [{ role: 'bot', text: str.welcomeMsg }];
      }
      return prev;
    });
  }, [str.welcomeMsg]);

  const dynamicSuggestions = [
    { label: str.suggestionLabel1, message: str.suggestionMessage1 },
    { label: str.suggestionLabel2, message: str.suggestionMessage2 },
    { label: str.suggestionLabel3, message: str.suggestionMessage3 },
    { label: str.suggestionLabel4, message: str.suggestionMessage4 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const getClientOfflineReply = (msg) => {
    const lower = (msg || '').toLowerCase().trim();
    if (/^(hi|hello|hey|namaste|namaskar|hola|vanakkam|namaskaram|pranam)\b/i.test(lower)) {
      return "Namaste! 🌾 I'm **Kisan Vision Assistant** — your agricultural AI advisor. How can I help you with your crops, soil, fertilizers, or farm today?";
    }
    if (/(soil|fertilizer|urea|dap|potash|npk)/i.test(lower)) {
      return "For balanced soil fertility: conduct a soil test, apply well-decomposed FYM or vermicompost @ 4-5 tonnes/acre, and follow recommended NPK ratios (typically 4:2:1 for cereals, 1:2:1 for legumes). You can also use the **Soil Testing** tab in this app for custom soil health plans!";
    }
    if (/(water|irrigate|irrigation|drip|sprinkler)/i.test(lower)) {
      return "Irrigation best practices: Water crops in early morning or late afternoon to minimize evaporation losses. Drip irrigation saves 40–60% water and is ideal for cotton, sugarcane, and vegetables.";
    }
    if (/(pest|insect|bug|spray|neem|disease|blight)/i.test(lower)) {
      return "For pest & disease control: Inspect leaf undersides regularly. For organic management, spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil @ 3ml/L. You can also use our **Instant Disease Doctor** camera feature to take a photo of the affected leaf for an instant diagnosis!";
    }
    if (/(cotton|kapas|patti)/i.test(lower)) {
      return "Cotton crop guide: Thrives in deep black cotton soils (vertisols) or loamy soils with good drainage. Monitor for whiteflies, leaf curl, and bollworms. Maintain balanced potassium to prevent premature leaf reddening.";
    }
    if (/(rice|paddy|dhan)/i.test(lower)) {
      return "Paddy management: Maintain 2–3 cm shallow standing water during tillering, apply split doses of nitrogen, and monitor for leaf blast and bacterial leaf blight during cloudy humid weather.";
    }
    if (/(scheme|pm kisan|subsidy|kcc|insurance|pmfby)/i.test(lower)) {
      return "Government Agriculture Schemes: Check our **Government Schemes** section to learn about PM-KISAN (₹6,000/yr), PM Fasal Bima Yojana (crop insurance), and Kisan Credit Card (KCC) low-interest credit.";
    }
    return "Namaste! 🌾 I'm **Kisan Vision Assistant**. I can help you with crop selection, soil health, fertilizer dosages, pest management, irrigation schedules, and government schemes. Please ask any farming question!";
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    console.log('--- Frontend Chat Request ---');
    console.log('Sending message:', userMsg);
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const payload = {
        message: userMsg,
        context: {
          crop: context.crop || null,
          soilType: context.soilType || null,
          temperature: context.weather?.temperature || null,
          humidity: context.weather?.humidity || null,
          rainfall: context.weather?.rainfall || null,
          season: context.season || null,
          location: context.location || null,
        },
      };

      const activeApi = getActiveApiUrl();
      const chatUrl = `${activeApi}/chat`;
      console.log('Target Chat URL:', chatUrl);

      let replyText = null;
      try {
        const res = await axios.post(chatUrl, payload, { timeout: 12000 });
        if (res.data?.reply) {
          replyText = res.data.reply;
        }
      } catch (networkErr) {
        console.warn('Network chat error, using offline agricultural knowledge fallback:', networkErr.message);
        // Fall back to intelligent client-side agricultural knowledge
        replyText = getClientOfflineReply(userMsg);
      }

      if (!replyText) {
        replyText = getClientOfflineReply(userMsg);
      }

      if (language && language !== 'en') {
        try {
          replyText = await translateText(replyText, language);
        } catch (e) {
          console.warn('Chat translation failed, using original:', e);
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: replyText }]);
    } catch (err) {
      console.error('--- Chat Fallback Error ---', err);
      let fallback = getClientOfflineReply(userMsg);
      if (language && language !== 'en') {
        try { fallback = await translateText(fallback, language); } catch (_) {}
      }
      setMessages(prev => [...prev, { role: 'bot', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown bold rendering
  const renderText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-brand-primary text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }} className="relative">
              <MessageCircle size={22} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 left-4 sm:left-auto z-[100] w-auto sm:w-[380px] max-h-[75vh] sm:max-h-[550px] bg-brand-surface rounded-3xl shadow-2xl border border-brand-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-surface-inset border-b border-brand-border px-6 py-5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden p-1 border border-emerald-500/30 bg-white flex items-center justify-center shrink-0">
                <img src="/kisanvision_emblem_clean.png" alt="KisanVision" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-brand-text-primary font-black text-sm uppercase tracking-wider">{str.assistantName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">{str.assistantSub}</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-brand-text-tertiary hover:text-brand-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: '350px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-brand-primary/10' : 'bg-brand-surface-inset'
                  }`}>
                    {msg.role === 'user' ? <User size={14} className="text-brand-primary" /> : <Sparkles size={14} className="text-brand-text-primary" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-md'
                      : 'bg-brand-surface-inset text-brand-text-primary border border-brand-border rounded-tl-md'
                  }`}>
                    {msg.role === 'bot' ? <TD value={msg.text} render={(translatedVal) => renderText(translatedVal || msg.text)} /> : renderText(msg.text)}
                    {msg.role === 'bot' && !msg.isError && (
                      <div className="mt-1.5 flex items-center justify-end">
                        <VoiceInput textToSpeak={msg.text} showSpeaker={true} size="sm" />
                      </div>
                    )}
                    {msg.isError && (
                      <button 
                        onClick={() => sendMessage(messages[i-1]?.text)}
                        className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider"
                      >
                        <Loader2 size={10} className="animate-spin" /> {str.retry}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-surface-inset flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-brand-text-primary" />
                  </div>
                  <div className="bg-brand-surface-inset border border-brand-border rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-primary" />
                    <span className="text-xs font-bold text-brand-text-secondary">{str.thinking}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {dynamicSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.message)}
                    className="text-[10px] font-bold text-brand-text-secondary bg-brand-surface-inset border border-brand-border px-3 py-1.5 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/20 hover:text-brand-primary transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-brand-border shrink-0">
              <div className="flex items-center gap-2 bg-brand-surface-inset rounded-2xl px-3 py-1.5 border border-brand-border focus-within:border-brand-primary/30 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={str.placeholder}
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-brand-text-primary placeholder:text-brand-text-secondary"
                  disabled={isTyping}
                />
                <VoiceInput
                  size="sm"
                  onTranscript={(transcript) => {
                    setInput(transcript);
                    sendMessage(transcript);
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center hover:bg-brand-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgroChatbot;
