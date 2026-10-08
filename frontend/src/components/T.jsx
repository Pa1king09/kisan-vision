/**
 * AutoTranslate component family - handles both static and dynamic text translation.
 * 
 * T           — static string (children must be a plain string literal)
 * TD          — dynamic string (value prop is a variable/expression)
 * TList       — translates an array of strings
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText, translateBatch, getInstantTranslation } from '../utils/translate';

// ─── T: static string component ────────────────────────────────────────────
const T = ({ children, as: Tag = 'span', className, style, ...rest }) => {
  const { language } = useLanguage();
  const instant = typeof children === 'string' ? getInstantTranslation(children, language) : children;
  const [translated, setTranslated] = useState(instant);

  useEffect(() => {
    if (!children || typeof children !== 'string') { setTranslated(children); return; }
    if (language === 'en') { setTranslated(children); return; }

    const fast = getInstantTranslation(children, language);
    if (fast !== children) {
      setTranslated(fast);
      return;
    }

    let cancelled = false;
    translateText(children, language).then(r => { if (!cancelled) setTranslated(r); });
    return () => { cancelled = true; };
  }, [children, language]);

  return <Tag className={className} style={style} {...rest}>{translated}</Tag>;
};

// ─── TD: dynamic value prop ─────────────────────────────────────────────────
export const TD = ({ value, as: Tag = 'span', className, style, prefix = '', suffix = '', ...rest }) => {
  const { language } = useLanguage();
  const instant = typeof value === 'string' ? getInstantTranslation(value, language) : value;
  const [translated, setTranslated] = useState(instant);

  useEffect(() => {
    if (!value || typeof value !== 'string') { setTranslated(value); return; }
    if (language === 'en') { setTranslated(value); return; }

    const fast = getInstantTranslation(value, language);
    if (fast !== value) {
      setTranslated(fast);
      return;
    }

    let cancelled = false;
    translateText(value, language).then(r => { if (!cancelled) setTranslated(r); });
    return () => { cancelled = true; };
  }, [value, language]);

  return <Tag className={className} style={style} {...rest}>{prefix}{translated}{suffix}</Tag>;
};


// ─── TList: renders a translated array of strings ────────────────────────────
export const TList = ({ items = [], renderItem, keyExtractor }) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(items);

  useEffect(() => {
    if (!items || items.length === 0) return;
    if (language === 'en') { setTranslated(items); return; }
    let cancelled = false;
    const strings = items.map(item => typeof item === 'string' ? item : JSON.stringify(item));
    translateBatch(strings, language).then(results => {
      if (cancelled) return;
      setTranslated(results);
    });
    return () => { cancelled = true; };
  }, [items, language]);

  return <>{translated.map((item, idx) => renderItem(item, idx, keyExtractor ? keyExtractor(items[idx], idx) : idx))}</>;
};

// ─── TObj: translates string values within an object array ──────────────────
export const TObj = ({ items = [], textKey, renderItem }) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(items);

  useEffect(() => {
    if (!items || items.length === 0) return;
    if (language === 'en') { setTranslated(items); return; }
    let cancelled = false;
    const strings = items.map(item => item[textKey] || '');
    translateBatch(strings, language).then(results => {
      if (cancelled) return;
      const newItems = items.map((item, i) => ({ ...item, [textKey]: results[i] }));
      setTranslated(newItems);
    });
    return () => { cancelled = true; };
  }, [items, language, textKey]);

  return <>{translated.map((item, idx) => renderItem(item, idx))}</>;
};

export default T;
