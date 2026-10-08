import React, { useState, useEffect, useRef } from 'react';
import T, { TD } from './T';
import axios from 'axios';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSearch = ({ onSelect, placeholder = "Search for location (e.g. Hyderabad)" }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Debounce timer
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const fetchSuggestions = async (searchQuery) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in`,
                {
                    headers: {
                        'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)'
                    }
                }
            );
            setSuggestions(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (value.length >= 3) {
            timeoutRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (item) => {
        const address = item.address;
        const district = address.city || address.town || address.municipality || address.district || address.state_district || '';
        const state = address.state || '';

        setQuery(item.display_name);
        setIsOpen(false);
        onSelect({ district, state, lat: item.lat, lon: item.lon });
    };

    const highlightMatch = (text, highlight) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => (
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="text-brand-green font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                ))}
            </span>
        );
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 bg-brand-surface text-brand-text-primary rounded-2xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold text-sm shadow-sm"
                    onFocus={() => query.length >= 3 && suggestions.length > 0 && setIsOpen(true)}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-brand-surface-elevated rounded-2xl shadow-2xl border border-brand-border overflow-hidden"
                    >
                        {isLoading ? (
                            <div className="p-8 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="animate-spin text-brand-green" size={24} />
                                <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider"><T>Searching locations...</T></p>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="py-2">
                                {suggestions.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelect(item)}
                                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-brand-surface-hover active:bg-brand-surface-inset transition-colors text-left border-b border-brand-border last:border-0 touch-manipulation cursor-pointer"
                                    >
                                        <div className="mt-1 bg-brand-green/10 p-2 rounded-lg text-brand-green shrink-0">
                                            <MapPin size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-brand-text-primary line-clamp-1">
                                                {highlightMatch(item.display_name, query)}
                                            </span>
                                            <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tight">
                                                <TD value={item.address.state || 'India'} />
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Search size={20} className="text-red-400" />
                                </div>
                                <p className="text-sm font-bold text-brand-text-primary"><T>No results found</T></p>
                                <p className="text-xs text-brand-text-secondary mt-1"><T>Try a different spelling or city name</T></p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationSearch;
