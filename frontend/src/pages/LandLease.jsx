import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tractor, Search, Filter, Phone, MapPin, CheckCircle2, 
  Calendar, Clock, ShieldCheck, ChevronRight, PlusCircle, 
  Fuel, User, AlertCircle, Sparkles, ArrowRight, DollarSign,
  Layers, Check, X, PhoneCall, MessageSquare, ExternalLink,
  Eye, Droplets, Zap, Shield, FileText, Image as ImageIcon,
  Share2, RefreshCw, Compass, Building, HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import T from '../components/T';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const getApiBase = () => getActiveApiUrl();

const INDIAN_STATES = [
  'All', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Punjab', 
  'Karnataka', 'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 
  'Haryana', 'Rajasthan', 'Tamil Nadu', 'Bihar', 'West Bengal'
];

const SOIL_TYPES = [
  'All',
  'Black Soil (Regur)',
  'Red Loamy Soil',
  'Alluvial Fertile Soil',
  'Clayey Soil',
  'Sandy Loam',
  'Laterite Soil'
];

const LandLease = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'list' | 'dashboard'

  // Listings State
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSoil, setSelectedSoil] = useState('All');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterBorewell, setFilterBorewell] = useState(false);
  const [filterElectricity, setFilterElectricity] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'lowest_price' | 'largest_area' | 'alphabetical'

  // Modals
  const [selectedLand, setSelectedLand] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Enquiry Modal
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    farmerName: user?.username || user?.name || '',
    farmerPhone: user?.phone || '',
    farmerEmail: user?.email || '',
    requiredDuration: '2 Years',
    proposedCrops: 'Vegetables & Cash Crops',
    message: 'I am interested in leasing this agricultural land for farming. Please contact me to discuss terms.'
  });

  // Landowner Form State ("List Your Land")
  const [listFormSubmitting, setListFormSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [listForm, setListForm] = useState({
    title: '',
    description: '',
    address: '',
    village: '',
    district: '',
    state: 'Telangana',
    pincode: '',
    surveyNumber: '',
    area: 2.5,
    areaUnit: 'Acres',
    soilType: 'Red Loamy Soil',
    currentUsage: 'Cultivated Farm Land',
    suitableCrops: 'Paddy, Tomato, Chilli, Vegetables',
    waterAvailability: 'Perennial Borewell (2 Sources)',
    hasBorewell: true,
    hasOpenWell: false,
    hasCanalIrrigation: false,
    hasElectricity: true,
    electricityType: '3-Phase Agricultural Power',
    hasRoadAccess: true,
    hasFencing: true,
    hasStorageFacility: false,
    hasFarmEquipment: false,
    leaseDurationYears: 2,
    leasePrice: 60000,
    priceUnit: 'per year',
    isNegotiable: true,
    securityDeposit: 15000,
    ownerName: user?.username || user?.name || '',
    ownerPhone: user?.phone || '',
    ownerEmail: user?.email || '',
    preferredContactMethod: 'Phone Call',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&auto=format&fit=crop&q=80'
    ]
  });

  // Owner Dashboard State
  const [myListings, setMyListings] = useState([]);
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fetch listings on filter change
  useEffect(() => {
    fetchListings();
  }, [selectedState, selectedSoil, sortBy, filterBorewell, filterElectricity]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setEnquiryForm(prev => ({
        ...prev,
        farmerName: prev.farmerName || user.username || user.name || '',
        farmerPhone: prev.farmerPhone || user.phone || '',
        farmerEmail: prev.farmerEmail || user.email || ''
      }));
      setListForm(prev => ({
        ...prev,
        ownerName: prev.ownerName || user.username || user.name || '',
        ownerPhone: prev.ownerPhone || user.phone || '',
        ownerEmail: prev.ownerEmail || user.email || ''
      }));
    }
  }, [user]);

  // Fetch Land Listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        state: selectedState,
        soilType: selectedSoil,
        sort: sortBy,
        hasBorewell: filterBorewell ? 'true' : undefined,
        hasElectricity: filterElectricity ? 'true' : undefined,
        minArea: minArea || undefined,
        maxArea: maxArea || undefined,
        maxPrice: maxPrice || undefined,
        q: searchQuery || undefined
      };
      const res = await axios.get(`${getApiBase()}/land-lease`, { params });
      if (res.data.success) {
        setListings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching land listings:', err);
      toast.error('Could not load land listings.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Landowner Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const phone = user?.phone || listForm.ownerPhone;
      const [listingsRes, enquiriesRes] = await Promise.all([
        axios.get(`${getApiBase()}/land-lease/owner/my-listings`, { params: { ownerPhone: phone, ownerName: user?.username } }),
        axios.get(`${getApiBase()}/land-lease/owner/enquiries`, { params: { ownerPhone: phone } })
      ]);
      if (listingsRes.data.success) setMyListings(listingsRes.data.data);
      if (enquiriesRes.data.success) setMyEnquiries(enquiriesRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Calculate 2-Year Cost Helper
  const compute2YearCost = (price, unit, duration = 2) => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(duration) || 2;
    if (unit === 'per month') return p * 24;
    if (unit === 'total lease period') return Math.round((p / d) * 2);
    return p * 2;
  };

  // Handle Land Details View
  const handleOpenDetails = (land) => {
    setSelectedLand(land);
    setActiveImageIdx(0);
    setDetailsModalOpen(true);
  };

  // Handle Enquiry Open
  const handleOpenEnquiry = (land) => {
    setSelectedLand(land);
    setEnquiryModalOpen(true);
  };

  // Submit Enquiry
  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    if (!selectedLand) return;
    try {
      setEnquirySubmitting(true);
      const payload = {
        ...enquiryForm,
        farmerId: user?.id || user?._id || 'anonymous'
      };
      const res = await axios.post(`${getApiBase()}/land-lease/${selectedLand._id}/enquiry`, payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Enquiry delivered to landowner!');
        setEnquiryModalOpen(false);
        fetchListings();
      }
    } catch (err) {
      console.error('Enquiry error:', err);
      toast.error(err.response?.data?.message || 'Failed to send enquiry.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  // Submit Land Listing
  const handlePublishListing = async () => {
    try {
      setListFormSubmitting(true);
      const payload = {
        ...listForm,
        area: parseFloat(listForm.area),
        leasePrice: parseFloat(listForm.leasePrice),
        leaseDurationYears: parseFloat(listForm.leaseDurationYears),
        securityDeposit: parseFloat(listForm.securityDeposit || 0),
        suitableCrops: typeof listForm.suitableCrops === 'string'
          ? listForm.suitableCrops.split(',').map(s => s.trim()).filter(Boolean)
          : listForm.suitableCrops,
        ownerId: user?.id || user?._id || 'anonymous'
      };

      const res = await axios.post(`${getApiBase()}/land-lease`, payload);
      if (res.data.success) {
        toast.success('Your agricultural land has been successfully listed on AgroLease Connect!');
        setShowPreviewModal(false);
        setActiveTab('browse');
        fetchListings();
      }
    } catch (err) {
      console.error('Publish error:', err);
      toast.error(err.response?.data?.message || 'Failed to list land.');
    } finally {
      setListFormSubmitting(false);
    }
  };

  // Update Status in Dashboard
  const handleUpdateStatus = async (landId, newStatus) => {
    try {
      await axios.put(`${getApiBase()}/land-lease/${landId}`, { status: newStatus });
      toast.success(`Land status updated to ${newStatus}`);
      fetchDashboardData();
      fetchListings();
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status.');
    }
  };

  // Delete Listing in Dashboard
  const handleDeleteListing = async (landId) => {
    if (!window.confirm('Are you sure you want to delete this land listing?')) return;
    try {
      await axios.delete(`${getApiBase()}/land-lease/${landId}`);
      toast.success('Listing deleted successfully.');
      fetchDashboardData();
      fetchListings();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete listing.');
    }
  };

  // Add custom photo URL
  const handleAddImageUrl = () => {
    const url = window.prompt('Enter image URL of your farm land (or copy from web):');
    if (url && url.startsWith('http')) {
      setListForm(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
      toast.success('Photo added to gallery!');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-28 pb-24 text-brand-text-primary px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* ═══ HEADER HERO BANNER ═══ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border border-emerald-500/30 backdrop-blur-xl mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" />
                  AGROLEASE CONNECT
                </span>
                <span className="px-2.5 py-0.5 bg-brand-surface/60 border border-brand-border text-white/60 text-[10px] font-bold rounded-full">
                  Zero Brokerage • Direct Landowner Access
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-display">
                Agricultural Land Lease Connect
              </h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
                Find fertile agricultural land available for multi-year lease near you. Direct contact with verified landowners, borewell & power availability data, and automated 2-year cost estimations.
              </p>
            </div>

            {/* Quick Listing Action CTA */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setActiveTab('list')}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <PlusCircle size={16} />
                <span>List Your Land for Lease</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ NAVIGATION TABS ═══ */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'browse'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-white'
              }`}
            >
              <span>🌾 Browse Available Land ({listings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-white'
              }`}
            >
              <PlusCircle size={14} />
              <span>List Your Land</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-white'
              }`}
            >
              <User size={14} />
              <span>Landowner Dashboard ({myListings.length})</span>
            </button>
          </div>

          <span className="text-xs text-brand-text-tertiary font-mono hidden sm:inline">
            Verified Agricultural Land Listings across India
          </span>
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB 1: BROWSE AVAILABLE LAND (SEARCH & FILTERS & CARDS)
            ════════════════════════════════════════════════════════════ */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* Search and Filters Card */}
            <div className="bg-brand-surface border border-brand-border rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              
              {/* Search Bar + State + Sort Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search by Village, District, Crop, or Soil (e.g. Hyderabad, Red Soil, Tomato)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                    className="w-full pl-10 pr-4 py-3 bg-brand-bg rounded-2xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full py-3 px-3.5 bg-brand-bg rounded-2xl border border-brand-border text-xs text-brand-text-primary font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {INDIAN_STATES.map((st, i) => (
                      <option key={i} value={st}>State: {st}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-3 px-3.5 bg-brand-bg rounded-2xl border border-brand-border text-xs text-brand-text-primary font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="recent">Sort: Recently Added</option>
                    <option value="lowest_price">Sort: Lowest Lease Price</option>
                    <option value="largest_area">Sort: Largest Land Area</option>
                    <option value="alphabetical">Sort: Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Secondary Filters: Soil, Area, Price, Borewell, Power */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-brand-border/60">
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-tertiary block mb-1">Soil Type</label>
                  <select
                    value={selectedSoil}
                    onChange={(e) => setSelectedSoil(e.target.value)}
                    className="w-full py-2 px-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  >
                    {SOIL_TYPES.map((soil, i) => (
                      <option key={i} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-tertiary block mb-1">Min Area (Acres)</label>
                  <input
                    type="number"
                    placeholder="Min Acres"
                    value={minArea}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setMinArea(e.target.value)}
                    className="w-full py-2 px-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-tertiary block mb-1">Max Area (Acres)</label>
                  <input
                    type="number"
                    placeholder="Max Acres"
                    value={maxArea}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setMaxArea(e.target.value)}
                    className="w-full py-2 px-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-tertiary block mb-1">Max Annual Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80000"
                    value={maxPrice}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full py-2 px-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Borewell Toggle */}
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setFilterBorewell(!filterBorewell)}
                    className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      filterBorewell
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-brand-bg text-brand-text-secondary border-brand-border'
                    }`}
                  >
                    <Droplets size={13} className={filterBorewell ? 'text-cyan-400' : ''} />
                    <span>Borewell</span>
                  </button>
                </div>

                {/* Electricity Toggle */}
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setFilterElectricity(!filterElectricity)}
                    className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      filterElectricity
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-brand-bg text-brand-text-secondary border-brand-border'
                    }`}
                  >
                    <Zap size={13} className={filterElectricity ? 'text-amber-400' : ''} />
                    <span>3-Phase Power</span>
                  </button>
                </div>
              </div>

              {/* Action Filter Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={fetchListings}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95"
                >
                  <Filter size={13} /> Apply Filters
                </button>
              </div>

            </div>

            {/* ═══ LAND LISTINGS GRID ═══ */}
            {loading ? (
              <div className="py-20 text-center text-brand-text-secondary">
                <RefreshCw size={32} className="animate-spin text-emerald-400 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider">Locating available agricultural farmland...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-3xl p-12 text-center space-y-4">
                <Tractor size={48} className="text-brand-text-tertiary mx-auto" />
                <h3 className="text-lg font-black uppercase text-white">No Farm Land Found</h3>
                <p className="text-xs text-brand-text-secondary max-w-md mx-auto">
                  No listings matched your filters. Try clearing your search query or broadening the price/area range.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('All');
                    setSelectedSoil('All');
                    setMinArea('');
                    setMaxArea('');
                    setMaxPrice('');
                    setFilterBorewell(false);
                    setFilterElectricity(false);
                    fetchListings();
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((land) => (
                  <motion.div
                    key={land._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-brand-surface rounded-3xl border border-brand-border hover:border-emerald-500/40 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Photo with Badges */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                        <img
                          src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80'}
                          alt={land.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Status & Area Badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1">
                            📐 {land.area} {land.areaUnit}
                          </span>

                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${
                            land.status === 'Available'
                              ? 'bg-emerald-500 text-slate-950'
                              : land.status === 'Pending'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-rose-500 text-white'
                          }`}>
                            {land.status}
                          </span>
                        </div>

                        {/* Soil Pill on Bottom Left */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            {land.soilType}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 space-y-3.5">
                        
                        {/* Title & Location */}
                        <div>
                          <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-1">
                            🌾 {land.area} {land.areaUnit} {land.soilType.split(' ')[0]} Farmland
                          </h3>
                          <p className="text-xs text-white/50 font-bold flex items-center gap-1 mt-1 truncate">
                            <MapPin size={12} className="text-rose-400 shrink-0" />
                            <span>Village: {land.village}, Dist: {land.district}, {land.state}</span>
                          </p>
                        </div>

                        {/* Quick Spec Highlights */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-2xl bg-brand-bg border border-brand-border">
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Droplets size={13} className="text-cyan-400 shrink-0" />
                            <span className="truncate">{land.waterAvailability.split('(')[0].trim()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Zap size={13} className="text-amber-400 shrink-0" />
                            <span className="truncate">{land.hasElectricity ? 'Electricity ✓' : 'No Power'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Calendar size={13} className="text-emerald-400 shrink-0" />
                            <span>Lease: {land.leaseDurationYears} Years</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Shield size={13} className="text-teal-400 shrink-0" />
                            <span>{land.hasFencing ? 'Fenced ✓' : 'Unfenced'}</span>
                          </div>
                        </div>

                        {/* Suitable Crops Badges */}
                        <div>
                          <span className="text-[10px] font-black uppercase text-brand-text-tertiary block mb-1">
                            🌱 Suitable For:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {land.suitableCrops?.slice(0, 3).map((crop, cIdx) => (
                              <span key={cIdx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/80 font-medium">
                                {crop}
                              </span>
                            ))}
                            {land.suitableCrops?.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] text-white/40">
                                +{land.suitableCrops.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Owner Info Strip */}
                        <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-emerald-400" />
                            <span className="font-bold text-white text-[11px] truncate max-w-[120px]">{land.ownerName}</span>
                          </div>
                          <a
                            href={`tel:${land.ownerPhone}`}
                            className="text-[11px] font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Phone size={10} /> {land.ownerPhone}
                          </a>
                        </div>

                      </div>
                    </div>

                    {/* Bottom Pricing & Action Buttons */}
                    <div className="p-5 pt-3 border-t border-brand-border bg-brand-surface-elevated/40 space-y-3">
                      
                      {/* Price Strip */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase text-brand-text-tertiary block">Annual Lease Cost</span>
                          <p className="text-xl font-black text-emerald-400 leading-none">
                            ₹{land.leasePrice.toLocaleString('en-IN')} <span className="text-[10px] text-brand-text-secondary font-normal">/{land.priceUnit.replace('per ', '')}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-black uppercase text-brand-text-tertiary block">2-Year Total Cost</span>
                          <span className="text-xs font-mono font-black text-white/90">
                            ₹{land.estimated2YearCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* 3 Prominent Action Buttons: View Details | Contact Owner | Call Owner */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleOpenDetails(land)}
                          className="py-2.5 px-2 rounded-xl bg-brand-surface border border-brand-border hover:border-emerald-500/40 text-brand-text-primary text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                        >
                          <Eye size={12} /> View Details
                        </button>

                        <button
                          onClick={() => handleOpenEnquiry(land)}
                          className="py-2.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                        >
                          <MessageSquare size={12} /> Enquiry
                        </button>

                        <a
                          href={`tel:${land.ownerPhone}`}
                          className="py-2.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <PhoneCall size={12} /> Call Owner
                        </a>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: LIST YOUR LAND FOR LEASE (LANDOWNER FORM + PREVIEW)
            ════════════════════════════════════════════════════════════ */}
        {activeTab === 'list' && (
          <div className="max-w-4xl mx-auto bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-brand-border pb-5 mb-8">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase">
                DIRECT TO FARMER
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display mt-2">
                List Your Agricultural Land for Lease
              </h2>
              <p className="text-xs text-brand-text-secondary mt-1">
                Reach thousands of genuine tenant farmers looking for agricultural land. Zero commission, direct payments.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowPreviewModal(true); }} className="space-y-8">
              
              {/* Section 1: Landowner Details */}
              <div className="space-y-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <User size={14} /> 1. Landowner Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Reddy"
                      value={listForm.ownerName}
                      onChange={(e) => setListForm({ ...listForm, ownerName: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Mobile Number (Calls & WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98490 23145"
                      value={listForm.ownerPhone}
                      onChange={(e) => setListForm({ ...listForm, ownerPhone: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh.reddy@gmail.com"
                      value={listForm.ownerEmail}
                      onChange={(e) => setListForm({ ...listForm, ownerEmail: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Preferred Contact Method</label>
                    <select
                      value={listForm.preferredContactMethod}
                      onChange={(e) => setListForm({ ...listForm, preferredContactMethod: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Phone Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Any">Any Method</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Land Details */}
              <div className="space-y-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MapPin size={14} /> 2. Land Location & Specifications
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Listing Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2.5 Acres Fertile Red Soil Farmland with Borewell"
                    value={listForm.title}
                    onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                    className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">State *</label>
                    <select
                      value={listForm.state}
                      onChange={(e) => setListForm({ ...listForm, state: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    >
                      {INDIAN_STATES.filter(s => s !== 'All').map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Medchal / Hyderabad"
                      value={listForm.district}
                      onChange={(e) => setListForm({ ...listForm, district: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Village / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shamirpet"
                      value={listForm.village}
                      onChange={(e) => setListForm({ ...listForm, village: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Complete Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Survey No. 84, Beside Gram Panchayat Road"
                      value={listForm.address}
                      onChange={(e) => setListForm({ ...listForm, address: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">PIN Code & Survey No. (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={listForm.pincode}
                        onChange={(e) => setListForm({ ...listForm, pincode: e.target.value })}
                        className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Survey No. (e.g. 84/2)"
                        value={listForm.surveyNumber}
                        onChange={(e) => setListForm({ ...listForm, surveyNumber: e.target.value })}
                        className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Total Land Area *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      placeholder="e.g. 2.5"
                      value={listForm.area === '' ? '' : listForm.area}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setListForm(prev => ({ ...prev, area: val === '' ? '' : val }));
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        setListForm(prev => ({ ...prev, area: (isNaN(num) || num <= 0) ? 1 : num }));
                      }}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Area Unit</label>
                    <select
                      value={listForm.areaUnit}
                      onChange={(e) => setListForm({ ...listForm, areaUnit: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Guntas">Guntas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Soil Type *</label>
                    <select
                      value={listForm.soilType}
                      onChange={(e) => setListForm({ ...listForm, soilType: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    >
                      {SOIL_TYPES.filter(s => s !== 'All').map((soil, i) => (
                        <option key={i} value={soil}>{soil}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Suitable Crops (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Paddy, Tomato, Chilli, Cotton, Vegetables"
                    value={listForm.suitableCrops}
                    onChange={(e) => setListForm({ ...listForm, suitableCrops: e.target.value })}
                    className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 3: Facilities Toggles */}
              <div className="space-y-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Droplets size={14} /> 3. Available Farming Facilities
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Borewell', key: 'hasBorewell', icon: Droplets },
                    { label: 'Open Well', key: 'hasOpenWell', icon: Droplets },
                    { label: 'Canal Irrigation', key: 'hasCanalIrrigation', icon: Droplets },
                    { label: 'Electricity', key: 'hasElectricity', icon: Zap },
                    { label: 'Road Access', key: 'hasRoadAccess', icon: MapPin },
                    { label: 'Fencing / Boundary', key: 'hasFencing', icon: Shield },
                    { label: 'Storage Shed', key: 'hasStorageFacility', icon: Building },
                    { label: 'Farm Equipment', key: 'hasFarmEquipment', icon: Tractor }
                  ].map((facility, fIdx) => {
                    const isChecked = listForm[facility.key];
                    const Icon = facility.icon;
                    return (
                      <button
                        key={fIdx}
                        type="button"
                        onClick={() => setListForm({ ...listForm, [facility.key]: !isChecked })}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                          isChecked 
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                            : 'bg-brand-surface border-brand-border text-white/50 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon size={14} /> {facility.label}
                        </span>
                        <span>{isChecked ? '✓ Yes' : '✕ No'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Lease Terms & Pricing */}
              <div className="space-y-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <DollarSign size={14} /> 4. Lease Terms & Pricing Calculator
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Lease Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 60000"
                      value={listForm.leasePrice === '' ? '' : listForm.leasePrice}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setListForm({ ...listForm, leasePrice: val === '' ? '' : val });
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        setListForm({ ...listForm, leasePrice: isNaN(num) || num < 0 ? 0 : num });
                      }}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white font-black text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Price Unit</label>
                    <select
                      value={listForm.priceUnit}
                      onChange={(e) => setListForm({ ...listForm, priceUnit: e.target.value })}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="per year">Per Year</option>
                      <option value="per month">Per Month</option>
                      <option value="total lease period">Complete Lease Period</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Lease Duration (Years) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      placeholder="e.g. 1"
                      value={listForm.leaseDurationYears === '' ? '' : listForm.leaseDurationYears}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setListForm({ ...listForm, leaseDurationYears: val === '' ? '' : val });
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        setListForm({ ...listForm, leaseDurationYears: isNaN(num) || num <= 0 ? 1 : num });
                      }}
                      className="w-full p-3 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Auto Calculated 2-Year Cost Box */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                      Estimated 2-Year Total Lease Cost:
                    </span>
                    <p className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
                      ₹{compute2YearCost(listForm.leasePrice, listForm.priceUnit, listForm.leaseDurationYears).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-white/50 block">Security Deposit:</span>
                    <span className="text-xs font-mono font-bold text-white">₹{listForm.securityDeposit?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Photo Gallery */}
              <div className="space-y-4 p-5 rounded-2xl bg-brand-bg border border-brand-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ImageIcon size={14} /> 5. Farm Land Photos ({listForm.images.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    + Add Image URL
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {listForm.images.map((img, iIdx) => (
                    <div key={iIdx} className="relative h-24 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={img} alt="Farm preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = listForm.images.filter((_, idx) => idx !== iIdx);
                          setListForm({ ...listForm, images: filtered });
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Preview CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <Eye size={16} />
                <span>Review Listing Preview & Publish</span>
              </button>
            </form>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: LANDOWNER DASHBOARD (MY LISTINGS & ENQUIRIES)
            ════════════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight font-display">
                  Landowner Control Center
                </h2>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Manage your active land lease postings, update availability status, and review farmer rental enquiries.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('list')}
                className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl flex items-center gap-1.5 self-start"
              >
                <PlusCircle size={14} /> Add Another Land
              </button>
            </div>

            {loadingDashboard ? (
              <div className="py-20 text-center text-brand-text-secondary">
                <RefreshCw size={32} className="animate-spin text-emerald-400 mx-auto mb-3" />
                <p className="text-xs">Fetching your listings and enquiries...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: My Land Listings (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Layers size={14} /> My Land Listings ({myListings.length})
                  </h3>

                  {myListings.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border text-center space-y-3">
                      <p className="text-xs text-white/60">You have not posted any land listings yet.</p>
                      <button
                        onClick={() => setActiveTab('list')}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl"
                      >
                        List Your First Farm Land
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myListings.map((land) => (
                        <div
                          key={land._id}
                          className="p-4 rounded-2xl bg-brand-surface border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'}
                              alt=""
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white line-clamp-1">{land.title}</h4>
                              <p className="text-[11px] text-white/50">{land.village}, {land.district} • {land.area} {land.areaUnit}</p>
                              <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                                ₹{land.leasePrice.toLocaleString('en-IN')}/{land.priceUnit.replace('per ', '')}
                              </p>
                            </div>
                          </div>

                          {/* Status Actions */}
                          <div className="flex items-center gap-2">
                            <select
                              value={land.status}
                              onChange={(e) => handleUpdateStatus(land._id, e.target.value)}
                              className="py-1.5 px-2 bg-brand-bg rounded-lg border border-brand-border text-xs font-bold text-white focus:outline-none"
                            >
                              <option value="Available">🟢 Available</option>
                              <option value="Pending">🟡 Pending</option>
                              <option value="Leased">🔴 Leased</option>
                              <option value="Inactive">⚪ Inactive</option>
                            </select>

                            <button
                              onClick={() => handleDeleteListing(land._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs"
                              title="Delete Listing"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Received Farmer Enquiries (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <MessageSquare size={14} /> Received Farmer Enquiries ({myEnquiries.length})
                  </h3>

                  {myEnquiries.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border text-center text-xs text-white/50">
                      No tenant farmer enquiries received yet. Enquiries from interested farmers will show up here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myEnquiries.map((enq) => (
                        <div
                          key={enq._id}
                          className="p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                              <User size={12} className="text-emerald-400" /> {enq.farmerName}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">
                              {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <p className="text-[11px] text-white/80 bg-brand-bg p-2.5 rounded-xl border border-brand-border italic">
                            "{enq.message}"
                          </p>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-brand-border/60">
                            <span className="text-white/50">Crop: {enq.proposedCrops}</span>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${enq.farmerPhone}`}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1"
                              >
                                <PhoneCall size={10} /> Call
                              </a>
                              <a
                                href={`https://wa.me/${(enq.farmerPhone || '').replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            DETAILED LAND MODAL (HIGH-RES GALLERY, FACILITIES, MAP)
            ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {detailsModalOpen && selectedLand && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-3xl bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6"
              >
                {/* Header with Title and Close */}
                <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      {selectedLand.area} {selectedLand.areaUnit} Farmland
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                      {selectedLand.title}
                    </h3>
                    <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-rose-400" />
                      {selectedLand.address}, {selectedLand.village}, {selectedLand.district}, {selectedLand.state} - {selectedLand.pincode || ''}
                    </p>
                  </div>

                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-brand-bg text-white/60 hover:text-white flex items-center justify-center shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Photo Gallery */}
                <div className="space-y-2">
                  <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={selectedLand.images?.[activeImageIdx] || selectedLand.images?.[0]}
                      alt="Farm Gallery Large"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedLand.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedLand.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            activeImageIdx === idx ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Breakdown Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-white/50 uppercase font-black block">Annual Lease</span>
                    <p className="text-lg font-black text-emerald-400 font-mono">
                      ₹{selectedLand.leasePrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 uppercase font-black block">2-Year Total</span>
                    <p className="text-lg font-black text-white font-mono">
                      ₹{selectedLand.estimated2YearCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 uppercase font-black block">Security Deposit</span>
                    <p className="text-sm font-bold text-white/80 font-mono">
                      ₹{(selectedLand.securityDeposit || 10000).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 uppercase font-black block">Negotiable</span>
                    <p className="text-sm font-bold text-emerald-400">
                      {selectedLand.isNegotiable ? '✓ Yes, Open to Talk' : 'Fixed Rate'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedLand.description && (
                  <div>
                    <h4 className="text-xs font-black uppercase text-white/50 tracking-wider mb-1">Land Overview</h4>
                    <p className="text-xs text-white/80 leading-relaxed bg-brand-bg p-3.5 rounded-xl border border-brand-border">
                      {selectedLand.description}
                    </p>
                  </div>
                )}

                {/* Facilities Checklist Grid */}
                <div>
                  <h4 className="text-xs font-black uppercase text-white/50 tracking-wider mb-2">Farming Facilities Included</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${selectedLand.hasBorewell ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-brand-bg border-brand-border text-white/40'}`}>
                      <Droplets size={13} /> Borewell: {selectedLand.hasBorewell ? 'Available ✓' : 'No'}
                    </div>
                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${selectedLand.hasElectricity ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-brand-bg border-brand-border text-white/40'}`}>
                      <Zap size={13} /> Power: {selectedLand.hasElectricity ? '3-Phase ✓' : 'No'}
                    </div>
                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${selectedLand.hasRoadAccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-brand-bg border-brand-border text-white/40'}`}>
                      <MapPin size={13} /> Road: {selectedLand.hasRoadAccess ? 'Tar Road ✓' : 'Katcha'}
                    </div>
                    <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${selectedLand.hasFencing ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-brand-bg border-brand-border text-white/40'}`}>
                      <Shield size={13} /> Fencing: {selectedLand.hasFencing ? 'Fenced ✓' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Suitable Crops */}
                <div>
                  <h4 className="text-xs font-black uppercase text-white/50 tracking-wider mb-2">Recommended Crops</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLand.suitableCrops?.map((crop, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                        🌱 {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Map & Coordinates */}
                <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-white/50 block">Coordinates & Survey</span>
                    <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
                      Lat: {selectedLand.latitude || 17.59}° N, Long: {selectedLand.longitude || 78.57}° E • Survey: {selectedLand.surveyNumber || '84/2A'}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLand.latitude || 17.59},${selectedLand.longitude || 78.57}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Compass size={13} /> View on Map
                  </a>
                </div>

                {/* Landowner Contact Action Footer */}
                <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{selectedLand.ownerName}</p>
                      <p className="text-xs font-mono font-bold text-emerald-400">{selectedLand.ownerPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedLand.ownerPhone}`}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <PhoneCall size={13} /> Call Owner
                    </a>

                    <button
                      onClick={() => {
                        setDetailsModalOpen(false);
                        setEnquiryModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare size={13} /> Send Enquiry
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════
            FARMER ENQUIRY MODAL
            ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {enquiryModalOpen && selectedLand && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-start justify-between pb-3 border-b border-brand-border">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Direct Landowner Enquiry
                    </span>
                    <h3 className="text-base font-black text-white uppercase mt-0.5">
                      Send Enquiry to {selectedLand.ownerName}
                    </h3>
                    <p className="text-xs text-white/50">{selectedLand.title}</p>
                  </div>

                  <button
                    onClick={() => setEnquiryModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-brand-bg text-white/60 hover:text-white flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.farmerName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, farmerName: e.target.value })}
                      className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.farmerPhone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, farmerPhone: e.target.value })}
                        className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Required Lease Duration</label>
                      <select
                        value={enquiryForm.requiredDuration}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, requiredDuration: e.target.value })}
                        className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="5 Years">5 Years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Proposed Farming Purpose / Crops</label>
                    <input
                      type="text"
                      value={enquiryForm.proposedCrops}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, proposedCrops: e.target.value })}
                      className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">Enquiry Message *</label>
                    <textarea
                      rows={3}
                      required
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEnquiryModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-white/70 text-xs font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={enquirySubmitting}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      {enquirySubmitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════
            PRE-PUBLISH PREVIEW MODAL FOR LANDOWNER
            ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showPreviewModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Listing Confirmation Preview
                    </span>
                    <h3 className="text-base font-black text-white uppercase mt-0.5">
                      Review How Farmers Will See Your Land
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="w-8 h-8 rounded-full bg-brand-bg text-white/60 hover:text-white flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Preview Card */}
                <div className="p-4 rounded-2xl bg-brand-bg border border-emerald-500/40 space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-950">
                    <img
                      src={listForm.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {listForm.soilType}
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">{listForm.title}</h4>
                    <p className="text-xs text-white/60">{listForm.village}, {listForm.district}, {listForm.state}</p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-brand-border text-xs">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase font-black block">Price</span>
                      <strong className="text-emerald-400 font-mono text-base font-black">
                        ₹{listForm.leasePrice?.toLocaleString('en-IN')} /{listForm.priceUnit.replace('per ', '')}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/50 uppercase font-black block">Estimated 2-Year Total</span>
                      <strong className="text-white font-mono font-black text-sm">
                        ₹{compute2YearCost(listForm.leasePrice, listForm.priceUnit, listForm.leaseDurationYears).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Publish Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishListing}
                    disabled={listFormSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {listFormSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>✓ Publish Land Listing</span>
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default LandLease;
