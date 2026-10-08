import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, ExternalLink, ShieldCheck, CheckCircle2, 
  TrendingDown, Sparkles, Filter, Calculator, ArrowRight, Tag, Info, AlertTriangle,
  Tractor, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import EquipmentRental from './EquipmentRental';
import LandLease from './LandLease';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'fertilizer', label: '🌾 Chemical Fertilizers' },
  { id: 'bio_fertilizer', label: '🌿 Bio & Organic' },
  { id: 'pesticide', label: '🐛 Insecticides & Neem' },
  { id: 'fungicide', label: '🍄 Fungicides' },
  { id: 'micronutrient', label: '🧪 Micronutrients' },
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab') || 'inputs';
  const [commerceTab, setCommerceTab] = useState(queryTab);

  useEffect(() => {
    if (queryTab && ['inputs', 'equipment', 'land'].includes(queryTab)) {
      setCommerceTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (t) => {
    setCommerceTab(t);
    setSearchParams(t === 'inputs' ? {} : { tab: t });
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [filterOrganic, setFilterOrganic] = useState(false);
  const [filterSubsidized, setFilterSubsidized] = useState(false);

  // Calculator modal state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcAcres, setCalcAcres] = useState(2);
  const [calcCrop, setCalcCrop] = useState('Rice');
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/marketplace/products`, {
        params: {
          category: category !== 'all' ? category : undefined,
          search: search || undefined
        }
      });
      setProducts(res.data.data || []);
    } catch {
      toast.error('Failed to load marketplace products');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalcLoading(true);
    try {
      const res = await axios.post(`${API}/marketplace/calculate-basket`, {
        acres: calcAcres,
        crop: calcCrop
      });
      setCalcResult(res.data.data);
    } catch {
      toast.error('Failed to calculate basket');
    } finally {
      setCalcLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (filterOrganic && p.type !== 'organic') return false;
    if (filterSubsidized && !p.govt_subsidized) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Unified Commerce Hub Navigation Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1.5 rounded-2xl bg-gray-900/90 border border-gray-800 backdrop-blur-md shadow-2xl gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('inputs')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                commerceTab === 'inputs'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <ShoppingBag size={15} /> Agri Inputs & Seeds
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('equipment')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                commerceTab === 'equipment'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Tractor size={15} /> Machinery & Drone Pool
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('land')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                commerceTab === 'land'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Layers size={15} /> Farmland Leasing
            </button>
          </div>
        </div>

        {commerceTab === 'equipment' && <EquipmentRental />}
        {commerceTab === 'land' && <LandLease />}

        {commerceTab === 'inputs' && (
          <div className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <ShoppingBag size={14} className="text-emerald-400" />
                Agri-Input Marketplace & Price Comparator
              </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Compare Fertilizer & Pesticide Prices
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Find the lowest dealer prices across government e-stores (IFFCO e-Samridhi, AgriBazaar) and local mandis. Direct DBT subsidy tracking saves farmers up to 35% on farm inputs.
          </p>
        </motion.div>

        {/* Subsidy Info Notice & Farm Calculator Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-emerald-950/40 to-gray-900/60 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div className="text-xs space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Government DBT Subsidy Guarantee
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">Official MRP Cap</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Under the Government of India's NBS (Nutrient Based Subsidy) scheme, Urea is price-capped at <strong className="text-emerald-400">₹266.50/45kg bag</strong> and DAP at <strong className="text-emerald-400">₹1,350/50kg bag</strong>. Never pay above official MRP at local cooperative societies (PACS).
              </p>
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Calculator size={13} />
                Input Cost Calculator
              </div>
              <p className="text-xs text-gray-400">
                Calculate total bags needed & compare basket costs for your field.
              </p>
            </div>
            <button
              onClick={() => {
                setShowCalculator(true);
                handleCalculate();
              }}
              className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Calculator size={14} /> Calculate for My Farm
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search fertilizer name, brand (IFFCO, Coromandel), or crop..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Quick Toggle Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterSubsidized(!filterSubsidized)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  filterSubsidized
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                🏛️ Govt Subsidized Only
              </button>
              <button
                onClick={() => setFilterOrganic(!filterOrganic)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  filterOrganic
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                🌿 Certified Organic Only
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  category === cat.id
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-gray-900 text-gray-400 border border-gray-700/60 hover:text-white hover:border-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm animate-pulse">
            Loading real-time marketplace prices across e-Samridhi, AgriBazaar & Local Dealers...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-12 text-center text-gray-400">
            <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
            <h3 className="font-semibold text-white">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try resetting your search query or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const bestPrice = Math.min(
                product.prices.esamridhi?.price || 9999,
                product.prices.agribazaar?.price || 9999,
                product.prices.agrostar?.price || 9999
              );
              const dealerPrice = product.prices.local_dealer?.price || bestPrice;
              const savings = dealerPrice - bestPrice;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.govt_subsidized && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-semibold">
                            🏛️ Govt Subsidized
                          </span>
                        )}
                        {product.type === 'organic' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                            🌿 100% Organic
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">{product.unit}</span>
                    </div>

                    {/* Title & Brand */}
                    <h3 className="text-base font-bold text-white mb-1 leading-snug">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">Brand: <span className="text-gray-200">{product.brand}</span></p>

                    {/* Price Comparison Table */}
                    <div className="bg-gray-900/70 border border-gray-700/60 rounded-xl p-3 space-y-2 mb-4 text-xs">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Platform Comparison</span>
                        {savings > 0 && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <TrendingDown size={11} /> Save ₹{savings}
                          </span>
                        )}
                      </div>

                      {/* e-Samridhi / IFFCO */}
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          🏛️ IFFCO e-Samridhi
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">₹{product.prices.esamridhi.price}</span>
                          <a
                            href={product.prices.esamridhi.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                            title="Buy on IFFCO e-Samridhi"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      {/* AgriBazaar */}
                      <div className="flex items-center justify-between text-gray-300">
                        <span>🌾 AgriBazaar</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-200">₹{product.prices.agribazaar.price}</span>
                          <a
                            href={product.prices.agribazaar.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all"
                            title="Buy on AgriBazaar"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      {/* AgroStar */}
                      <div className="flex items-center justify-between text-gray-300">
                        <span>📦 AgroStar</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-200">₹{product.prices.agrostar.price}</span>
                          <a
                            href={product.prices.agrostar.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all"
                            title="Buy on AgroStar"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      {/* Local Mandi Dealer */}
                      <div className="flex items-center justify-between text-gray-400 pt-1 border-t border-gray-800">
                        <span>🏪 Local Mandi Dealer</span>
                        <span className="font-semibold text-yellow-400/90">₹{dealerPrice}</span>
                      </div>
                    </div>

                    {/* Dosage & Crops */}
                    <div className="space-y-1 text-xs text-gray-400 mb-3">
                      <div>💊 <strong className="text-gray-300">Dosage:</strong> {product.recommended_dose}</div>
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        <span className="text-gray-500">Crops:</span>
                        {product.crops.map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Buy / External Direct Action Button */}
                  <a
                    href={product.prices.esamridhi.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    Buy at Subsidized Price (e-Samridhi) <ExternalLink size={12} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Input Cost Calculator Modal */}
        <AnimatePresence>
          {showCalculator && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator size={18} className="text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Fertilizer Basket Cost Calculator</h3>
                  </div>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 mb-1 block">Farm Acreage (Acres)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      placeholder="e.g. 2"
                      value={calcAcres}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={e => setCalcAcres(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 mb-1 block">Crop Type</label>
                    <select
                      value={calcCrop}
                      onChange={e => setCalcCrop(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option>Rice</option>
                      <option>Wheat</option>
                      <option>Cotton</option>
                      <option>Maize</option>
                      <option>Sugarcane</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={calcLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  Recalculate Basket
                </button>

                {calcResult && (
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-semibold text-white">Recommended Basket for {calcResult.acres} Acres of {calcResult.crop}:</h4>
                    <ul className="space-y-1 text-gray-300">
                      {calcResult.basket.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium text-emerald-400">{item.quantity}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-gray-700 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-300">
                        <span>🏛️ IFFCO e-Samridhi Total:</span>
                        <span className="font-bold text-emerald-400">{calcResult.totals.esamridhi}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>🌾 AgriBazaar Total:</span>
                        <span className="font-semibold text-gray-200">{calcResult.totals.agribazaar}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>🏪 Local Dealer Total:</span>
                        <span className="font-semibold text-yellow-400">{calcResult.totals.local_dealer}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-gray-700/60">
                        <span>💰 You Save Buying Online:</span>
                        <span>{calcResult.totals.potential_savings}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
