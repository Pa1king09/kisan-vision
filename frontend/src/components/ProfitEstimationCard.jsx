import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, Package, Coins, ArrowUpRight, BarChart3 } from 'lucide-react';
import CountUp from 'react-countup';
import T from './T';

// Static Indian agricultural market data (approx averages)
const MARKET_DATA = {
    'rice':             { yield: [18, 25], price: [2200, 2800], cost: 18000, unit: 'quintal' },
    'wheat (gehun)':    { yield: [16, 22], price: [2100, 2600], cost: 16000, unit: 'quintal' },
    'maize (corn)':     { yield: [20, 30], price: [1800, 2400], cost: 14000, unit: 'quintal' },
    'cotton (kapash)':  { yield: [8, 15],  price: [5500, 7000], cost: 25000, unit: 'quintal' },
    'sunflower (surajmukhi)': { yield: [6, 10], price: [5800, 7200], cost: 15000, unit: 'quintal' },
    'mung bean (green gram/moong)': { yield: [4, 8], price: [7000, 8500], cost: 12000, unit: 'quintal' },
    'pigeon peas (tur/arhar)':      { yield: [6, 10], price: [6000, 7500], cost: 14000, unit: 'quintal' },
    'lentil (masoor)':  { yield: [5, 9],   price: [5000, 6500], cost: 13000, unit: 'quintal' },
    'kidney beans (rajma)': { yield: [5, 8], price: [8000, 12000], cost: 15000, unit: 'quintal' },
    'papaya':           { yield: [150, 250], price: [800, 1500], cost: 40000, unit: 'quintal' },
    'banana':           { yield: [200, 350], price: [500, 1000], cost: 50000, unit: 'quintal' },
    'mango':            { yield: [40, 80],  price: [2000, 4000], cost: 30000, unit: 'quintal' },
    'grapes':           { yield: [80, 120], price: [3000, 5000], cost: 60000, unit: 'quintal' },
    'pomegranate':      { yield: [40, 70],  price: [4000, 8000], cost: 45000, unit: 'quintal' },
    'orange (santra)':  { yield: [60, 100], price: [1500, 3000], cost: 35000, unit: 'quintal' },
    'potato (aloo)':    { yield: [80, 120], price: [800, 1500],  cost: 35000, unit: 'quintal' },
    'tomato (tamatar)': { yield: [100, 200],price: [600, 2000],  cost: 30000, unit: 'quintal' },
    'onion (pyaaz)':    { yield: [80, 150], price: [800, 2500],  cost: 28000, unit: 'quintal' },
    'soybean (soyabean)': { yield: [8, 14], price: [4000, 5500], cost: 14000, unit: 'quintal' },
    'jute':             { yield: [10, 18],  price: [4500, 6000], cost: 16000, unit: 'quintal' },
    'watermelon':       { yield: [100, 200],price: [400, 1000],  cost: 25000, unit: 'quintal' },
    'jowar (sorghum)':  { yield: [10, 18],  price: [2800, 3500], cost: 12000, unit: 'quintal' },
    'bajra (pearl millet)': { yield: [8, 15], price: [2200, 2800], cost: 10000, unit: 'quintal' },
    'ragi (finger millet)': { yield: [8, 14], price: [3200, 4000], cost: 11000, unit: 'quintal' },
    'turmeric (haldi)': { yield: [25, 40],  price: [7000, 12000], cost: 35000, unit: 'quintal' },
    'garlic (lehsun)':  { yield: [30, 50],  price: [3000, 8000], cost: 25000, unit: 'quintal' },
    'pumpkin (kaddu)':  { yield: [80, 150], price: [500, 1200],  cost: 20000, unit: 'quintal' },
    'cucumber (kheera)':{ yield: [60, 120], price: [600, 1500],  cost: 18000, unit: 'quintal' },
    'moth beans':       { yield: [3, 6],    price: [5000, 7000], cost: 10000, unit: 'quintal' },
    'rapeseed (sarson)':{ yield: [6, 10],   price: [5000, 6500], cost: 12000, unit: 'quintal' },
};

const DEFAULT_DATA = { yield: [10, 20], price: [2000, 4000], cost: 15000, unit: 'quintal' };

const ProfitEstimationCard = ({ crop, confidence }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const safeCrop = (crop || 'rice').toLowerCase();
    const data = MARKET_DATA[safeCrop] || DEFAULT_DATA;
    const safeYield = Array.isArray(data?.yield) ? data.yield : [10, 20];
    const safePrice = Array.isArray(data?.price) ? data.price : [2000, 4000];
    const safeCost = Number(data?.cost) || 15000;
    const avgYield = Math.round((safeYield[0] + safeYield[1]) / 2);
    const avgPrice = Math.round((safePrice[0] + safePrice[1]) / 2);
    const grossRevenue = avgYield * avgPrice;
    const estimatedProfit = grossRevenue - safeCost;
    const roi = safeCost > 0 ? ((estimatedProfit / safeCost) * 100).toFixed(0) : '0';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <IndianRupee size={20} className="text-emerald-600" />
                </div>
                <div>
                    <T as="h3" className="text-lg font-black text-brand-text-primary uppercase tracking-tight">Profit & Yield Estimation</T>
                    <T as="p" className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Based on Indian market averages (per acre)</T>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Yield */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-premium text-center"
                >
                    <Package size={18} className="text-blue-500 mx-auto mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Est. Yield</p>
                    <p className="text-2xl font-black text-brand-text-primary">
                        {animated && <CountUp end={avgYield} duration={1.5} />}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{data.unit}/acre</p>
                </motion.div>

                {/* Market Price */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-premium text-center"
                >
                    <Coins size={18} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg Price</p>
                    <p className="text-2xl font-black text-brand-text-primary">
                        ₹{animated && <CountUp end={avgPrice} duration={1.5} separator="," />}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">per {data.unit}</p>
                </motion.div>

                {/* Revenue */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-premium text-center"
                >
                    <BarChart3 size={18} className="text-purple-500 mx-auto mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Revenue</p>
                    <p className="text-2xl font-black text-brand-text-primary">
                        ₹{animated && <CountUp end={grossRevenue} duration={1.8} separator="," />}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">gross/acre</p>
                </motion.div>

                {/* Profit */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className={`rounded-2xl p-5 shadow-premium text-center border ${
                        estimatedProfit > 0
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : 'bg-red-500/10 border-red-500/20'
                    }`}
                >
                    <TrendingUp size={18} className={estimatedProfit > 0 ? 'text-emerald-600 mx-auto mb-2' : 'text-red-500 mx-auto mb-2'} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Est. Profit</p>
                    <p className={`text-2xl font-black ${estimatedProfit > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        ₹{animated && <CountUp end={estimatedProfit} duration={2} separator="," />}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">net/acre</p>
                </motion.div>
            </div>

            {/* ROI + Cost breakdown bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-premium"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ArrowUpRight size={16} className="text-brand-primary" />
                        <T as="span" className="text-xs font-black uppercase tracking-widest text-slate-500">Return on Investment</T>
                    </div>
                    <span className={`text-xl font-black ${estimatedProfit > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {animated && <CountUp end={parseInt(roi)} duration={1.5} suffix="%" />}
                    </span>
                </div>
                <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.cost / grossRevenue) * 100}%` }}
                        transition={{ duration: 1.2, delay: 0.9 }}
                        className="bg-red-300 rounded-l-full"
                        title="Cost"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, (estimatedProfit / grossRevenue) * 100)}%` }}
                        transition={{ duration: 1.2, delay: 1.0 }}
                        className="bg-emerald-400 rounded-r-full"
                        title="Profit"
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-300 rounded-full" /> Cost: ₹{data.cost.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Profit: ₹{estimatedProfit.toLocaleString()}
                    </span>
                </div>
            </motion.div>

            <p className="text-[10px] text-slate-400 font-medium mt-3 text-center italic">
                * Estimates based on average Indian market data. Actual values may vary by region and season.
            </p>
        </motion.div>
    );
};

export default ProfitEstimationCard;
