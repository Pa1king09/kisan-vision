import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tractor, Search, Filter, Phone, MapPin, CheckCircle2, 
  Calendar, Clock, ShieldCheck, ChevronRight, PlusCircle, 
  Fuel, User, AlertCircle, Sparkles, ArrowRight, DollarSign,
  Layers, Check, X, PhoneCall, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import T from '../components/T';
import EquipmentStudioShowcase from '../components/EquipmentStudioShowcase';

import { getActiveApiUrl } from '../utils/mobileInit';

const getApiBase = () => getActiveApiUrl();

const CATEGORIES = [
  'All',
  'Tractor',
  'Rotavator',
  'Cultivator',
  'Plough',
  'Harvester',
  'Seeder',
  'Drone Sprayer',
  'Sprayer',
  'Laser Leveller',
  'Baler',
  'Thresher',
  'Power Tiller',
  'Smart Gadget'
];

const getCategoryFallbackImage = (category, name = '') => {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (c.includes('rotavator') || n.includes('rotavator') || n.includes('gyrovator')) {
    return '/images/equipment_rotavator_studio.jpg';
  }
  if (c.includes('drone') || n.includes('drone') || n.includes('agras')) {
    return '/images/equipment_dji_agras_t40.jpg';
  }
  if (c.includes('tractor') || n.includes('deere') || n.includes('mahindra') || n.includes('sonalika')) {
    return '/images/equipment_john_deere_5050d.jpg';
  }
  if (c.includes('harvester') || n.includes('harvester') || n.includes('reaper') || n.includes('combine')) {
    return 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('cultivator') || n.includes('cultivator')) {
    return 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('plough') || n.includes('plough') || n.includes('plow')) {
    return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('seeder') || n.includes('seeder') || n.includes('planter')) {
    return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('sprayer') || n.includes('sprayer')) {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('baler') || n.includes('baler')) {
    return 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('thresher') || n.includes('thresher') || n.includes('sheller')) {
    return 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('power tiller') || n.includes('tiller') || n.includes('weeder')) {
    return 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80';
  }
  if (c.includes('gadget') || n.includes('meter') || n.includes('sensor') || n.includes('wand')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
  }
  return '/images/equipment_john_deere_5050d.jpg';
};

const resolveMachineImage = (item) => {
  if (item?.imageUrl && item.imageUrl.trim() !== '') {
    return item.imageUrl;
  }
  return getCategoryFallbackImage(item?.category, item?.name);
};

const CATEGORY_ICONS = {
  All: '🌐',
  Tractor: '🚜',
  Rotavator: '🔄',
  Cultivator: '⛏️',
  Plough: '⚡',
  Harvester: '🌾',
  Seeder: '🌱',
  'Drone Sprayer': '🚁',
  Sprayer: '💦',
  'Laser Leveller': '📐',
  Baler: '📦',
  Thresher: '⚙️',
  'Power Tiller': '🛠️',
  'Smart Gadget': '🔬'
};

const EquipmentRental = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'list' | 'bookings'
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Booking Modal
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Saved fields from My Farm
  const [savedFields, setSavedFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    renterName: user?.name || '',
    renterPhone: user?.phone || '',
    fieldName: 'General Farmland',
    fieldAcres: 2.0,
    pricingType: 'acre', // 'acre' | 'hour'
    hoursOrAcres: 2.0,
    bookingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Owner Listing Form State
  const [listFormSubmitting, setListFormSubmitting] = useState(false);
  const [listSuccess, setListSuccess] = useState(false);
  const [listForm, setListForm] = useState({
    name: '',
    category: 'Tractor',
    modelYear: 2023,
    horsepower: 45,
    ownerName: user?.name || '',
    ownerPhone: user?.phone || '',
    district: '',
    state: 'Andhra Pradesh',
    village: '',
    ratePerHour: 600,
    ratePerAcre: 850,
    isOperatorIncluded: true,
    isFuelIncluded: false,
    description: '',
    imageUrl: ''
  });

  // Fetch equipment list
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedState !== 'All') params.state = selectedState;

      const res = await axios.get(`${getApiBase()}/equipment`, { params });
      if (res.data && res.data.data) {
        setEquipmentList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
      setError('Unable to load machinery. Showing cached verified fleet.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${getApiBase()}/equipment-bookings`);
      if (res.data && res.data.data) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load bookings:', err);
    }
  };

  // Load saved fields from My Farm
  useEffect(() => {
    if (user?.id) {
      try {
        const raw = localStorage.getItem(`agroxai_fields_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSavedFields(parsed);
          if (parsed.length > 0) {
            setSelectedFieldId(parsed[0]._id || parsed[0].id || '0');
            setBookingForm(prev => ({
              ...prev,
              fieldName: parsed[0].name,
              fieldAcres: parseFloat(parsed[0].area) || 2.0,
              hoursOrAcres: parseFloat(parsed[0].area) || 2.0
            }));
          }
        }
      } catch (e) {
        console.warn('Could not read user fields:', e);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, selectedState]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  // Handle field selection in booking modal
  const handleFieldChange = (fieldId) => {
    setSelectedFieldId(fieldId);
    const field = savedFields.find(f => (f._id || f.id) === fieldId);
    if (field) {
      const acres = parseFloat(field.area) || 2.0;
      setBookingForm(prev => ({
        ...prev,
        fieldName: field.name,
        fieldAcres: acres,
        hoursOrAcres: prev.pricingType === 'acre' ? acres : prev.hoursOrAcres
      }));
    }
  };

  // Calculate live booking cost
  const calculateTotalCost = () => {
    if (!selectedMachine) return 0;
    const rate = bookingForm.pricingType === 'acre' 
      ? (selectedMachine.ratePerAcre || 850)
      : (selectedMachine.ratePerHour || 600);
    const qty = parseFloat(bookingForm.hoursOrAcres) || 1;
    return Math.round(rate * qty);
  };

  // Open booking modal
  const handleOpenBooking = (machine) => {
    let target = machine;
    if (!machine._id && equipmentList.length > 0) {
      const match = equipmentList.find(e => 
        (e.name && machine.name && e.name.toLowerCase().includes(machine.name.toLowerCase().slice(0, 10))) ||
        (machine.category && e.category && machine.category.toLowerCase().includes(e.category.toLowerCase()))
      );
      if (match) {
        target = { ...match, ...machine, _id: match._id };
      }
    }
    setSelectedMachine(target);
    setBookingSuccess(null);
    setBookingModalOpen(true);
  };

  // Submit booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMachine) return;
    try {
      setBookingSubmitting(true);
      const totalCost = calculateTotalCost();
      const payload = {
        renterName: bookingForm.renterName,
        renterPhone: bookingForm.renterPhone,
        district: selectedMachine.district,
        state: selectedMachine.state,
        fieldName: bookingForm.fieldName,
        fieldAcres: bookingForm.fieldAcres,
        pricingType: bookingForm.pricingType,
        hoursOrAcres: bookingForm.hoursOrAcres,
        bookingDate: bookingForm.bookingDate,
        notes: bookingForm.notes,
        totalEstimatedCost: totalCost
      };

      const targetId = selectedMachine._id || selectedMachine.id || 'studio-booking';
      const res = await axios.post(`${getApiBase()}/equipment/${targetId}/book`, payload);
      setBookingSuccess(res.data.data || { totalEstimatedCost: totalCost });
      fetchBookings();
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Could not complete booking. Please verify details and try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Submit owner machine listing
  const handleListSubmit = async (e) => {
    e.preventDefault();
    try {
      setListFormSubmitting(true);
      await axios.post(`${getApiBase()}/equipment`, listForm);
      setListSuccess(true);
      fetchEquipment();
      setTimeout(() => {
        setListSuccess(false);
        setActiveTab('browse');
      }, 2000);
    } catch (err) {
      console.error('Failed to list equipment:', err);
      alert('Failed to list machine. Ensure all required fields are filled.');
    } finally {
      setListFormSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 text-brand-text-primary px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase flex items-center gap-1.5">
                <Tractor size={12} className="animate-pulse" />
                <T>KISAN UBER / MACHINERY POOL</T>
              </span>
              <span className="px-2.5 py-0.5 bg-brand-surface border border-brand-border text-brand-text-tertiary text-[10px] font-bold rounded-full">
                Zero Middlemen
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-text-primary tracking-tight uppercase">
              Farm Equipment & Tractor Sharing Hub
            </h1>
            <p className="text-brand-text-secondary text-base max-w-2xl mt-2 font-medium">
              Rent high-capacity tractors, drone sprayers, rotavators, and harvesters on-demand. Auto-calculates your rental cost based on exact field acreage.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-brand-surface p-1.5 rounded-2xl border border-brand-border shadow-sm">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              <Tractor size={14} /> <T>Browse Fleet</T>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              <PlusCircle size={14} /> <T>List Your Machine</T>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
            >
              <Calendar size={14} /> <T>My Bookings</T>
              {bookings.length > 0 && (
                <span className="w-5 h-5 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Active Fleet</p>
            <p className="text-2xl font-black text-brand-text-primary mt-1">{equipmentList.length} <span className="text-xs font-normal text-emerald-400">Machines</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Avg Cost Saving</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹45,000+ <span className="text-xs font-normal text-brand-text-secondary">/season</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Acreage Auto-Pricing</p>
            <p className="text-2xl font-black text-teal-400 mt-1">100% <span className="text-xs font-normal text-brand-text-secondary">Verified</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Driver / Operator</p>
            <p className="text-2xl font-black text-amber-400 mt-1">Included <span className="text-xs font-normal text-brand-text-secondary">On-Site</span></p>
          </div>
        </div>

        {/* ═══ TAB 1: BROWSE FLEET ═══ */}
        {activeTab === 'browse' && (
          <div>
            {/* 3D Illuminated Studio Card Showcase */}
            <EquipmentStudioShowcase onSelectMachine={handleOpenBooking} />

            {/* Search and Filters Bar */}
            <div className="bg-brand-surface p-4 rounded-2xl border border-brand-border mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-brand-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search machinery (e.g. Mahindra, Drone, Harvester, Ludhiana)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchEquipment()}
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary placeholder-brand-text-tertiary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-3 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All States</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                  <button
                    onClick={fetchEquipment}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                        : 'bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary border border-brand-border'
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat] || '🚜'}</span>
                    <T>{cat}</T>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Grid */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">
                  Loading verified farm machinery...
                </p>
              </div>
            ) : equipmentList.length === 0 ? (
              <div className="py-20 text-center bg-brand-surface rounded-3xl border border-brand-border p-8">
                <Tractor size={48} className="text-brand-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">No Machinery Found</h3>
                <p className="text-xs text-brand-text-secondary mt-1 max-w-md mx-auto">
                  No equipment matched your filters. Try selecting "All" categories or reset your location search.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedState('All'); }}
                  className="mt-5 px-5 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipmentList.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-3xl border border-brand-border bg-brand-surface overflow-hidden hover:border-emerald-500/40 hover:shadow-premium transition-all duration-300 flex flex-col group"
                  >
                    {/* Machine Image Banner */}
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={resolveMachineImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCategoryFallbackImage(item?.category, item?.name);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <span>{CATEGORY_ICONS[item.category] || '🚜'}</span>
                        <T>{item.category}</T>
                      </span>

                      {/* Status Badge */}
                      <span className={`absolute top-3 right-3 px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                        item.status === 'Available'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {item.status}
                      </span>

                      {/* Machine Name in Banner */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white font-black text-lg tracking-tight leading-tight line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 mt-0.5">
                          <MapPin size={11} /> {item.district}, {item.state}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Quick Visual Tags Ribbon */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                            ⚡ Available within 5 km
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                            ⭐ 4.9 Rated
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold">
                            🚜 Operator Included
                          </span>
                        </div>

                        {/* Specs row */}
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          {item.horsepower > 0 && (
                            <span className="px-2.5 py-1 bg-brand-surface-elevated border border-brand-border text-brand-text-secondary text-[10px] font-bold rounded-lg">
                              ⚡ {item.horsepower} HP
                            </span>
                          )}
                          <span className="px-2.5 py-1 bg-brand-surface-elevated border border-brand-border text-brand-text-secondary text-[10px] font-bold rounded-lg">
                            📅 {item.modelYear} Model
                          </span>
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg flex items-center gap-1">
                            <ShieldCheck size={11} /> Verified
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-brand-text-secondary line-clamp-2 mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Owner & Inclusions */}
                        <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border mb-4 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-brand-text-tertiary text-[10px] font-black uppercase">Owner:</span>
                            <span className="font-bold text-brand-text-primary">{item.ownerName}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-brand-text-tertiary text-[10px] font-black uppercase">Operator:</span>
                            <span className={item.isOperatorIncluded ? 'text-emerald-400 font-bold' : 'text-brand-text-tertiary'}>
                              {item.isOperatorIncluded ? '✓ Driver Included' : 'Self Drive'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-brand-text-tertiary text-[10px] font-black uppercase">Fuel:</span>
                            <span className={item.isFuelIncluded ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                              {item.isFuelIncluded ? '✓ Fuel Included' : 'Diesel by Renter'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Machine Owner Contact Details & Direct Call / WhatsApp (In place of Book Now) */}
                      <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black text-brand-text-tertiary uppercase">Acre Rate</p>
                          <p className="text-lg font-black text-emerald-400 leading-none">
                            ₹{item.ratePerAcre} <span className="text-[10px] font-normal text-brand-text-secondary">/acre</span>
                          </p>
                          <p className="text-[10px] text-brand-text-tertiary mt-0.5">
                            ₹{item.ratePerHour}/hr
                          </p>
                        </div>

                        {/* Owner Details & Contact Action Buttons */}
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-black text-brand-text-tertiary block">Owner Details</span>
                            <div className="flex items-center justify-end gap-1 text-xs font-black text-white">
                              <User size={12} className="text-emerald-400 shrink-0" />
                              <span className="truncate max-w-[140px] sm:max-w-[170px]">{item.ownerName}</span>
                            </div>
                            <a
                              href={`tel:${item.ownerPhone || '+91 98765 43210'}`}
                              className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center justify-end gap-1 mt-0.5"
                              title="Click to Call"
                            >
                              <Phone size={10} />
                              <span>{item.ownerPhone || '+91 98765 43210'}</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${item.ownerPhone || '+91 98765 43210'}`}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                              title="Call Machine Owner Directly"
                            >
                              <PhoneCall size={12} />
                              <span>Call</span>
                            </a>

                            <a
                              href={`https://wa.me/${(item.ownerPhone || '9876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.ownerName}, I saw your ${item.name} on KisanVision and would like to rent it.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all"
                              title="Message on WhatsApp"
                            >
                              <MessageSquare size={12} />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => handleOpenBooking(item)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl transition-all"
                              title="Online Booking & Acreage Cost Estimator"
                            >
                              <Calendar size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 2: LIST YOUR EQUIPMENT ═══ */}
        {activeTab === 'list' && (
          <div className="max-w-3xl mx-auto bg-brand-surface p-8 rounded-3xl border border-brand-border">
            <div className="mb-6">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest rounded-full uppercase">
                EARN WITH YOUR MACHINERY
              </span>
              <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight mt-2">
                List Your Tractor or Machine for Rent
              </h2>
              <p className="text-xs text-brand-text-secondary mt-1">
                Put your idle farm equipment to work between crop cycles. Connect directly with verified nearby farmers in your district.
              </p>
            </div>

            {listSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                Your machine was listed successfully! Redirecting to fleet...
              </div>
            )}

            <form onSubmit={handleListSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Machine / Tractor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahindra 575 DI + Rotavator"
                    value={listForm.name}
                    onChange={(e) => setListForm({ ...listForm, name: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={listForm.category}
                    onChange={(e) => setListForm({ ...listForm, category: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Horsepower (HP)
                  </label>
                  <input
                    type="number"
                    value={listForm.horsepower}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setListForm({ ...listForm, horsepower: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Model Year
                  </label>
                  <input
                    type="number"
                    value={listForm.modelYear}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setListForm({ ...listForm, modelYear: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Rate / Acre (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={listForm.ratePerAcre}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setListForm({ ...listForm, ratePerAcre: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Rate / Hour (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={listForm.ratePerHour}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => setListForm({ ...listForm, ratePerHour: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={listForm.ownerName}
                    onChange={(e) => setListForm({ ...listForm, ownerName: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={listForm.ownerPhone}
                    onChange={(e) => setListForm({ ...listForm, ownerPhone: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guntur"
                    value={listForm.district}
                    onChange={(e) => setListForm({ ...listForm, district: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Andhra Pradesh"
                    value={listForm.state}
                    onChange={(e) => setListForm({ ...listForm, state: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tenali Rural"
                    value={listForm.village}
                    onChange={(e) => setListForm({ ...listForm, village: e.target.value })}
                    className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={listForm.isOperatorIncluded}
                    onChange={(e) => setListForm({ ...listForm, isOperatorIncluded: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-brand-bg border-brand-border"
                  />
                  <span className="text-xs font-bold text-brand-text-primary">Operator / Driver Provided</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={listForm.isFuelIncluded}
                    onChange={(e) => setListForm({ ...listForm, isFuelIncluded: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-brand-bg border-brand-border"
                  />
                  <span className="text-xs font-bold text-brand-text-primary">Diesel / Fuel Included in Price</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1.5">
                  Description & Machinery Details
                </label>
                <textarea
                  rows="3"
                  placeholder="Mention attachments (rotavator, 9-tyne cultivator), blade condition, and preferred crops..."
                  value={listForm.description}
                  onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={listFormSubmitting}
                className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl text-xs hover:opacity-90 transition-all shadow-md mt-4 disabled:opacity-50"
              >
                {listFormSubmitting ? 'Publishing Listing...' : 'Publish Machinery Listing (Free)'}
              </button>
            </form>
          </div>
        )}

        {/* ═══ TAB 3: MY BOOKINGS ═══ */}
        {activeTab === 'bookings' && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight">
                  Your Machine Bookings
                </h2>
                <p className="text-xs text-brand-text-secondary mt-1">
                  Track your booked farm machinery, operator contact, and scheduled dates.
                </p>
              </div>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 bg-brand-surface-elevated border border-brand-border text-brand-text-secondary hover:text-brand-text-primary text-xs font-bold rounded-xl"
              >
                Refresh
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-16 text-center">
                <Calendar size={40} className="text-brand-text-tertiary mx-auto mb-3" />
                <p className="text-sm font-black text-brand-text-primary uppercase">No Active Bookings</p>
                <p className="text-xs text-brand-text-secondary mt-1">
                  You haven't booked any machines yet. Browse the fleet to hire tractors, harvesters, or drones.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Browse Fleet
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl bg-brand-bg border border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-brand-text-primary text-base uppercase">
                          {b.equipmentName}
                        </p>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {b.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-text-secondary mt-1 flex items-center gap-2">
                        <span>🌱 Field: <strong className="text-brand-text-primary">{b.fieldName}</strong> ({b.fieldAcres} acres)</span>
                        <span>•</span>
                        <span>📅 Date: <strong>{new Date(b.bookingDate).toLocaleDateString()}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-brand-text-tertiary uppercase">Estimated Rental</p>
                        <p className="text-xl font-black text-emerald-400">
                          ₹{b.totalEstimatedCost?.toLocaleString()}
                        </p>
                      </div>

                      <a
                        href={`tel:${b.renterPhone}`}
                        className="px-4 py-2.5 bg-brand-surface border border-brand-border hover:border-emerald-500/40 text-brand-text-primary rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone size={13} className="text-emerald-400" /> Call Operator
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ═══ INTERACTIVE BOOKING MODAL (Auto-Calculates by Field Acreage) ═══ */}
      <AnimatePresence>
        {bookingModalOpen && selectedMachine && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-brand-surface rounded-3xl border border-brand-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                <div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                    {selectedMachine.category} Booking
                  </span>
                  <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mt-1">
                    {selectedMachine.name}
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5 flex items-center gap-1">
                    <MapPin size={11} /> {selectedMachine.district}, {selectedMachine.state}
                  </p>
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-brand-surface-elevated text-brand-text-secondary hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-brand-text-primary uppercase">
                      Machine Booked Successfully!
                    </h4>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      The equipment owner has been notified of your reservation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Owner:</span>
                      <strong className="text-brand-text-primary">{selectedMachine.ownerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Contact:</span>
                      <strong className="text-emerald-400 font-mono">{selectedMachine.ownerPhone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Field Target:</span>
                      <strong className="text-brand-text-primary">{bookingForm.fieldName} ({bookingForm.fieldAcres} Acres)</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-brand-border text-sm">
                      <span className="font-bold text-brand-text-primary">Estimated Total:</span>
                      <span className="font-black text-emerald-400">₹{calculateTotalCost().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a
                      href={`tel:${selectedMachine.ownerPhone}`}
                      className="flex-1 py-3 bg-emerald-500 text-slate-950 font-black uppercase text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall size={14} /> Call Owner Now
                    </a>
                    <button
                      onClick={() => { setBookingModalOpen(false); setActiveTab('bookings'); }}
                      className="px-4 py-3 bg-brand-surface-elevated border border-brand-border text-brand-text-primary font-bold text-xs rounded-xl"
                    >
                      View Bookings
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
                  
                  {/* Select Saved Field from My Farm */}
                  {savedFields.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-brand-bg border border-emerald-500/20">
                      <label className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Layers size={12} /> Auto-Fill from My Farm Fields
                      </label>
                      <select
                        value={selectedFieldId}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        className="w-full p-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                      >
                        {savedFields.map((f) => (
                          <option key={f._id || f.id} value={f._id || f.id}>
                            📍 {f.name} — {f.area} Acres ({f.district || 'Farmland'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Pricing Mode Switcher */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, pricingType: 'acre', hoursOrAcres: bookingForm.fieldAcres })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bookingForm.pricingType === 'acre'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-brand-border bg-brand-bg text-brand-text-secondary'
                      }`}
                    >
                      <p className="text-[9px] font-black uppercase tracking-wider">Pay By Acre</p>
                      <p className="text-base font-black mt-0.5">₹{selectedMachine.ratePerAcre} <span className="text-[10px] font-normal">/acre</span></p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, pricingType: 'hour', hoursOrAcres: 4 })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bookingForm.pricingType === 'hour'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-brand-border bg-brand-bg text-brand-text-secondary'
                      }`}
                    >
                      <p className="text-[9px] font-black uppercase tracking-wider">Pay By Hour</p>
                      <p className="text-base font-black mt-0.5">₹{selectedMachine.ratePerHour} <span className="text-[10px] font-normal">/hour</span></p>
                    </button>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1">
                      {bookingForm.pricingType === 'acre' ? 'Field Area (Acres) *' : 'Working Hours *'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      required
                      placeholder="e.g. 1"
                      value={bookingForm.hoursOrAcres === '' ? '' : bookingForm.hoursOrAcres}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value;
                        setBookingForm({ ...bookingForm, hoursOrAcres: v === '' ? '' : v });
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        setBookingForm({ ...bookingForm, hoursOrAcres: isNaN(num) || num <= 0 ? 1 : num });
                      }}
                      className="w-full p-3 bg-brand-bg rounded-xl border border-brand-border text-sm font-bold text-brand-text-primary focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Farmer Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Farmer Name"
                        value={bookingForm.renterName}
                        onChange={(e) => setBookingForm({ ...bookingForm, renterName: e.target.value })}
                        className="w-full p-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={bookingForm.renterPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, renterPhone: e.target.value })}
                        className="w-full p-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-brand-text-secondary tracking-wider block mb-1">
                      Requested Work Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingForm.bookingDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                      className="w-full p-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs text-brand-text-primary focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Real-Time Total Calculation Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        Total Estimated Cost
                      </p>
                      <p className="text-[11px] text-brand-text-secondary">
                        {bookingForm.hoursOrAcres} {bookingForm.pricingType === 'acre' ? 'acres' : 'hours'} × ₹
                        {bookingForm.pricingType === 'acre' ? selectedMachine.ratePerAcre : selectedMachine.ratePerHour}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-400">
                        ₹{calculateTotalCost().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl text-xs hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                  >
                    {bookingSubmitting ? 'Confirming Reservation...' : 'Confirm Machine Booking'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EquipmentRental;
