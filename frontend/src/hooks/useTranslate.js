import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText, translateBatch, getInstantTranslation } from '../utils/translate';

/**
 * Hook for translating text programmatically.
 *
 * Returns { t, tBatch, language } where:
 *   t(text)         — returns a Promise<string>
 *   tBatch([texts]) — returns a Promise<string[]>
 *   language        — current language code
 */
const useTranslate = () => {
  const { language } = useLanguage();

  const t = useCallback((text) => {
    return translateText(text, language);
  }, [language]);

  const tBatch = useCallback((texts) => {
    return translateBatch(texts, language);
  }, [language]);

  return { t, tBatch, language };
};

/**
 * Hook that maintains translated versions of multiple static strings,
 * instantly resolving from the offline dictionary synchronously,
 * and refreshing whenever the language changes.
 */
export const useTranslated = (strings) => {
  const { language } = useLanguage();

  const getResolved = (src, lang) => {
    if (!lang || lang === 'en') return src;
    const res = {};
    Object.keys(src).forEach(k => {
      res[k] = getInstantTranslation(src[k], lang);
    });
    return res;
  };

  const [str, setStr] = useState(() => getResolved(strings, language));

  useEffect(() => {
    setStr(getResolved(strings, language));
    if (language === 'en') return;

    let cancelled = false;
    const keys = Object.keys(strings);
    const values = Object.values(strings);
    translateBatch(values, language).then(translated => {
      if (cancelled) return;
      const result = {};
      keys.forEach((k, i) => { result[k] = translated[i]; });
      setStr(result);
    });
    return () => { cancelled = true; };
  }, [language]);

  return { str };
};

export default useTranslate;

