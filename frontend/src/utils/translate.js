/**
 * Translation utility using Google Translate's free API.
 * Translations are cached in localStorage to avoid repeated API calls.
 */

const CACHE_PREFIX = 'cv_trans_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Map our language codes to Google Translate codes
const GOOGLE_LANG_MAP = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  te: 'te',
  mr: 'mr',
  ta: 'ta',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  pa: 'pa',
  or: 'or',
  as: 'as',
  ur: 'ur',
  mai: 'mai',
  sa: 'sa',
  kok: 'gom',   // Konkani → Goan Konkani in Google
  ks: 'ks',
  sd: 'sd',
  ne: 'ne',
  mni: 'mni',
  bodo: 'brx',   // Bodo in Google
  doi: 'doi',
};

function getCacheKey(text, lang) {
  // Short hash of text to avoid huge keys
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return `${CACHE_PREFIX}${lang}_${hash}`;
}

function getFromCache(text, lang) {
  try {
    const key = getCacheKey(text, lang);
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { value, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function setToCache(text, lang, translated) {
  try {
    const key = getCacheKey(text, lang);
    localStorage.setItem(key, JSON.stringify({ value: translated, timestamp: Date.now() }));
  } catch {
    // localStorage might be full — silently ignore
  }
}

import ALL_TRANSLATIONS from '../locales/index.js';

/**
 * Synchronous offline dictionary lookup.
 * Returns translated string if present in our comprehensive 22-language locales,
 * or from localStorage cache, or falls back to original text.
 */
export function getInstantTranslation(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim()) return text;
  if (!targetLang || targetLang === 'en') return text;

  const dict = ALL_TRANSLATIONS[targetLang];
  if (dict) {
    const trimmed = text.trim();
    if (dict[trimmed] !== undefined) return dict[trimmed];
    if (dict[text] !== undefined) return dict[text];
    const lower = trimmed.toLowerCase();
    if (dict[lower] !== undefined) return dict[lower];
  }

  // Check localStorage cache
  const cached = getFromCache(text, targetLang);
  if (cached) return cached;

  return text;
}

/**
 * Translate a single string to the target language.
 * Checks instant offline dictionary first, then localStorage cache,
 * and finally falls back to Google Translate API.
 */
export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim()) return text;
  if (!targetLang || targetLang === 'en') return text;

  // 1. Instant offline dictionary lookup
  const instant = getInstantTranslation(text, targetLang);
  if (instant !== text) return instant;

  // 2. Check cache
  const cached = getFromCache(text, targetLang);
  if (cached) return cached;

  const googleLang = GOOGLE_LANG_MAP[targetLang] || targetLang;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(googleLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const data = await response.json();
    // Response structure: [[["translated","original",...],...],...]
    const translated = data[0]?.map(chunk => chunk[0]).join('') || text;
    setToCache(text, targetLang, translated);
    return translated;
  } catch {
    return text;
  }
}

/**
 * Batch translate multiple strings at once.
 * Returns an array of translated strings in the same order.
 */
export async function translateBatch(texts, targetLang) {
  if (!texts || texts.length === 0) return [];
  if (!targetLang || targetLang === 'en') return texts;
  return Promise.all(texts.map(t => translateText(t, targetLang)));
}

