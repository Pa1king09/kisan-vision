import React from 'react';
import { Search, SlidersHorizontal, Star, Calendar, ArrowUpDown } from 'lucide-react';
import T, { TD } from '../T';
import { useTranslated } from '../../hooks/useTranslate';

const HistoryFilterBar = ({ 
    searchQuery, setSearchQuery, 
    filterFavorites, setFilterFavorites,
    sortBy, setSortBy
}) => {
    const { str } = useTranslated({
        placeholder: "Search by crop, farm, soil type...",
        newestFirst: "Newest First",
        oldestFirst: "Oldest First",
        highestConfidence: "Highest Confidence",
        lowestConfidence: "Lowest Confidence"
    });

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full md:max-w-md group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-tertiary group-focus-within:text-brand-primary transition-colors" />
                <input
                    type="text"
                    placeholder={str.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-border rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-brand-text-primary placeholder:text-brand-text-tertiary focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm"
                />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Favorites Toggle */}
                <button
                    onClick={() => setFilterFavorites(!filterFavorites)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                        filterFavorites 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                            : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:bg-brand-surface-hover'
                    }`}
                >
                    <Star size={14} className={filterFavorites ? "fill-amber-500" : ""} />
                    <T>Favorites</T>
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 md:flex-none">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full appearance-none bg-brand-surface border border-brand-border rounded-xl pl-10 pr-8 py-2.5 text-xs font-black text-brand-text-secondary uppercase tracking-widest outline-none focus:border-brand-primary transition-all shadow-sm cursor-pointer"
                    >
                        <option value="date-desc">{str.newestFirst}</option>
                        <option value="date-asc">{str.oldestFirst}</option>
                        <option value="confidence-desc">{str.highestConfidence}</option>
                        <option value="confidence-asc">{str.lowestConfidence}</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-tertiary pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default HistoryFilterBar;
