import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Sprout, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import T from '../components/T';
import { CardSkeleton } from '../components/Skeleton';
import FarmIntelligence from './FarmIntelligence';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/translate';

// New Components
import HistoryAnalytics from '../components/history/HistoryAnalytics';
import HistoryFilterBar from '../components/history/HistoryFilterBar';
import HistoryCard from '../components/history/HistoryCard';
import HistoryDetailsModal from '../components/history/HistoryDetailsModal';
import { generateAnalytics, generateAIInsights } from '../utils/historyUtils';
import { getActiveApiUrl } from '../utils/mobileInit';

const apiClient = axios.create({
    timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
    const activeBase = getActiveApiUrl();
    const baseUrlWithoutApi = activeBase.replace(/\/api\/?$/, '');
    
    // Inject auth token
    try {
        const token = localStorage.getItem('cv_token') || localStorage.getItem('token');
        if (token && !config.headers?.Authorization) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {}

    if (config.url) {
        if (config.url.startsWith('/api')) {
            config.url = `${baseUrlWithoutApi}${config.url}`;
        } else if (!config.url.startsWith('http://') && !config.url.startsWith('https://')) {
            config.url = `${activeBase}/${config.url.replace(/^\//, '')}`;
        }
    }
    return config;
}, (err) => Promise.reject(err));

const History = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryTab = searchParams.get('tab') || 'records';
    const [viewTab, setViewTab] = useState(queryTab);

    useEffect(() => {
        if (queryTab && ['records', 'analytics'].includes(queryTab)) {
            setViewTab(queryTab);
        }
    }, [queryTab]);

    const handleTabChange = (t) => {
        setViewTab(t);
        setSearchParams(t === 'records' ? {} : { tab: t });
    };

    const { user } = useAuth();
    const { language } = useLanguage();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFavorites, setFilterFavorites] = useState(false);
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, confidence-desc, confidence-asc

    // Modal State
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        const userId = user?.id || user?._id;
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const response = await apiClient.get(`/history/user/${userId}`);
            const data = response.data.data || response.data;
            setHistory(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        try {
            await apiClient.delete(`/history/${id}`);
            setHistory(history.filter(item => item._id !== id));
            if (selectedRecord && selectedRecord._id === id) setSelectedRecord(null);
            const transMsg = await translateText('Analysis record deleted', language);
            toast.success(transMsg);
        } catch (error) {
            const transMsg = await translateText('Failed to delete record', language);
            toast.error(transMsg);
        }
    };

    const handleToggleFavorite = async (record) => {
        try {
            const newStatus = !record.bookmarked;
            await apiClient.patch(`/history/${record._id}`, { bookmarked: newStatus });
            setHistory(history.map(item => item._id === record._id ? { ...item, bookmarked: newStatus } : item));
            if (newStatus) {
                const transMsg = await translateText('Added to favorites', language);
                toast.success(transMsg, { icon: '⭐' });
            }
        } catch (error) {
            const transMsg = await translateText('Failed to update favorite status', language);
            toast.error(transMsg);
        }
    };

    const handleUpdateNotes = async (id, notes) => {
        try {
            await apiClient.patch(`/history/${id}`, { notes });
            setHistory(history.map(item => item._id === id ? { ...item, notes } : item));
            const transMsg = await translateText('Notes saved successfully', language);
            toast.success(transMsg);
        } catch (error) {
            const transMsg = await translateText('Failed to save notes', language);
            toast.error(transMsg);
        }
    };

    // Derived State
    const filteredAndSortedHistory = useMemo(() => {
        let result = [...history];

        // 1. Filter Favorites
        if (filterFavorites) {
            result = result.filter(item => item.bookmarked);
        }

        // 2. Search Query (Crop, Farm, Soil)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                const crop = (item.predictionResult?.crop || '').toLowerCase();
                const farm = (item.farmName || item.location || '').toLowerCase();
                const soil = (item.soilType || '').toLowerCase();
                return crop.includes(query) || farm.includes(query) || soil.includes(query);
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
            
            const confA = a.predictionResult?.confidence || 0;
            const confB = b.predictionResult?.confidence || 0;
            if (sortBy === 'confidence-desc') return confB - confA;
            if (sortBy === 'confidence-asc') return confA - confB;
            
            return 0;
        });

        return result;
    }, [history, filterFavorites, searchQuery, sortBy]);

    // Analytics based ONLY on filtered data (so charts update interactively)
    const analytics = useMemo(() => generateAnalytics(filteredAndSortedHistory), [filteredAndSortedHistory]);
    const insights = useMemo(() => generateAIInsights(analytics, filteredAndSortedHistory), [analytics, filteredAndSortedHistory]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-brand-bg min-h-screen pt-32 pb-20 px-6"
        >
            <div className="max-w-[90rem] mx-auto">
                
                {/* Header & View Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-border">
                    <div>
                        <T as="h1" className="text-4xl md:text-5xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Farm History & Intelligence</T>
                        <T as="p" className="text-brand-text-secondary font-medium max-w-2xl">
                            Unified log of predictive crop decisions, environmental telemetry, and field analytics.
                        </T>
                    </div>

                    <div className="flex items-center gap-2 bg-brand-surface-inset p-1.5 rounded-2xl border border-brand-border">
                        <button
                            type="button"
                            onClick={() => handleTabChange('records')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                viewTab === 'records'
                                    ? 'bg-brand-primary text-white shadow-lg'
                                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                            }`}
                        >
                            <HistoryIcon size={14} /> Records Log
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('analytics')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                viewTab === 'analytics'
                                    ? 'bg-brand-primary text-white shadow-lg'
                                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                            }`}
                        >
                            <BarChart3 size={14} /> Visual Intelligence
                        </button>
                    </div>
                </div>

                {viewTab === 'analytics' && <FarmIntelligence />}

                {viewTab === 'records' && (
                  <>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-12">
                        {/* 1. Analytics Dashboard */}
                        <HistoryAnalytics analytics={analytics} insights={insights} />

                        {/* 2. Filter Bar */}
                        <div>
                            <HistoryFilterBar 
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                filterFavorites={filterFavorites} setFilterFavorites={setFilterFavorites}
                                sortBy={sortBy} setSortBy={setSortBy}
                            />

                            {/* 3. Cards Grid */}
                            {filteredAndSortedHistory.length > 0 ? (
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {filteredAndSortedHistory.map((record) => (
                                            <HistoryCard 
                                                key={record._id} 
                                                record={record} 
                                                onOpenDetails={setSelectedRecord}
                                                onDelete={deleteItem}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="py-20 text-center bg-brand-surface rounded-3xl border border-brand-border">
                                    <SearchIcon size={48} className="mx-auto text-brand-text-tertiary mb-4 opacity-50" />
                                    <T as="h3" className="text-xl font-black text-brand-text-primary uppercase tracking-widest mb-2">No Results Found</T>
                                    <T as="p" className="text-sm font-bold text-brand-text-secondary">Try adjusting your search or filters.</T>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 premium-card max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-full mx-auto flex items-center justify-center text-brand-primary mb-8 shadow-premium">
                            <HistoryIcon size={40} />
                        </div>
                        <T as="h2" className="text-3xl md:text-4xl font-black text-brand-text-primary mb-4 uppercase tracking-tight">Data Vault Empty</T>
                        <T as="p" className="text-brand-text-secondary font-medium mb-10 max-w-md mx-auto leading-relaxed">
                            Start a new AI precision analysis to seed your dashboard with environmental data, crop mapping, and actionable insights.
                        </T>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ display: 'inline-block' }}
                        >
                            <Link to="/recommend" className="btn-primary py-4 px-8 text-sm flex items-center gap-2">
                                <Sprout size={18} />
                                <T>Start First Analysis</T>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
                  </>
                )}

            </div>

            {/* Modal Drawer */}
            <HistoryDetailsModal 
                record={selectedRecord} 
                onClose={() => setSelectedRecord(null)} 
                onUpdateNotes={handleUpdateNotes}
            />

        </motion.div>
    );
};

// Quick helper for empty search state
const SearchIcon = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export default History;
