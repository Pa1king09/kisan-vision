import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Star, Tractor, Sparkles, ShieldCheck, MapPin, 
  ArrowRight, PhoneCall, CheckCircle2, ChevronRight, Gauge
} from 'lucide-react';
import T from './T';

export const STUDIO_MACHINERY = [
  {
    id: 'studio-dji-t40',
    name: 'DJI Agras T40 Agriculture Drone Sprayer',
    category: 'Autonomous Aerial Drone',
    image: '/images/equipment_dji_agras_t40.jpg',
    podiumColor: 'from-emerald-500/30 to-cyan-500/20',
    glowColor: 'hover:border-emerald-400/50 hover:shadow-emerald-500/20',
    ratePerAcre: 350,
    ratePerHour: 1200,
    proximity: '⚡ Available within 3.2 km',
    rating: '⭐ 4.98 (42 Reviews)',
    operator: '🚜 Certified Drone Pilot Included',
    power: '40L Payload · Ultra-low Drift',
    coverage: '1 Acre in 6 mins',
    ownerName: 'Vikram Singh Rao',
    ownerPhone: '+91 94140 88219',
    district: 'Warangal',
    state: 'Telangana',
    status: 'Available Today',
    tags: ['⚡ Available within 5 km', '⭐ 4.9 Rated', '🚜 Operator Included']
  },
  {
    id: 'studio-jd-5050d',
    name: 'John Deere 5050D 4WD Heavy Tractor',
    category: 'Smart Heavy Tractor',
    image: '/images/equipment_john_deere_5050d.jpg',
    podiumColor: 'from-green-500/30 to-amber-500/20',
    glowColor: 'hover:border-green-400/50 hover:shadow-green-500/20',
    ratePerAcre: 1000,
    ratePerHour: 750,
    proximity: '⚡ Available within 4.8 km',
    rating: '⭐ 4.95 (58 Reviews)',
    operator: '🚜 Veteran Operator Included',
    power: '50 HP · Dual Clutch 4WD',
    coverage: 'Deep Tillage & Puddling',
    ownerName: 'Gurpreet Singh',
    ownerPhone: '+91 98722 15309',
    district: 'Ludhiana',
    state: 'Punjab',
    status: 'Available Today',
    tags: ['⚡ Available within 5 km', '⭐ 4.9 Rated', '🚜 Operator Included']
  },
  {
    id: 'studio-rotavator',
    name: 'Shaktiman Heavy Duty Rotary Tiller',
    category: 'Precision Soil Implement',
    image: '/images/equipment_rotavator_studio.jpg',
    podiumColor: 'from-cyan-500/30 to-blue-500/20',
    glowColor: 'hover:border-cyan-400/50 hover:shadow-cyan-500/20',
    ratePerAcre: 850,
    ratePerHour: 600,
    proximity: '⚡ Available within 2.5 km',
    rating: '⭐ 4.92 (31 Reviews)',
    operator: '🚜 Hitching & Operator Included',
    power: '7ft Multi-Speed Gearbox',
    coverage: 'Instant Seedbed Preparation',
    ownerName: 'Ramesh Patel',
    ownerPhone: '+91 98251 44321',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    status: 'Available Today',
    tags: ['⚡ Available within 5 km', '⭐ 4.9 Rated', '🚜 Operator Included']
  },
  {
    id: 'studio-plough',
    name: 'Lemken Opal 090 Hydraulic Reversible MB Plough',
    category: 'Deep Reversible Mouldboard Plough',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
    podiumColor: 'from-blue-500/30 to-indigo-500/20',
    glowColor: 'hover:border-blue-400/50 hover:shadow-blue-500/20',
    ratePerAcre: 1100,
    ratePerHour: 750,
    proximity: '⚡ Available within 3.8 km',
    rating: '⭐ 4.94 (38 Reviews)',
    operator: '🚜 Expert Ploughman Included',
    power: '3-Furrow Dual Turnaround',
    coverage: '100% Soil Inversion & Trash Burying',
    ownerName: 'Gurpreet Singh',
    ownerPhone: '+91 98722 15309',
    district: 'Ludhiana',
    state: 'Punjab',
    status: 'Available Today',
    tags: ['⚡ Available within 5 km', '⭐ 4.9 Rated', '🚜 Operator Included']
  },
  {
    id: 'studio-cultivator',
    name: 'Fieldking 9-Tyne Heavy Duty Spring Loaded Cultivator',
    category: 'Secondary Tillage & Weed Eradicator',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
    podiumColor: 'from-amber-500/30 to-orange-500/20',
    glowColor: 'hover:border-amber-400/50 hover:shadow-amber-500/20',
    ratePerAcre: 600,
    ratePerHour: 450,
    proximity: '⚡ Available within 1.8 km',
    rating: '⭐ 4.88 (22 Reviews)',
    operator: '🚜 Tractor & Driver Included',
    power: 'Spring Loaded Dual Coil Tynes',
    coverage: 'Crust Breaking & Root Uprooting',
    ownerName: 'Koteswara Rao',
    ownerPhone: '+91 98480 32189',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    status: 'Available Today',
    tags: ['⚡ Available within 5 km', '⭐ 4.8 Rated', '🚜 Operator Included']
  },
  {
    id: 'studio-harvester',
    name: 'Claas Crop Tiger 30 Rubber Track Combine Harvester',
    category: 'High-Floatation Track Harvester',
    image: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
    podiumColor: 'from-rose-500/30 to-purple-500/20',
    glowColor: 'hover:border-rose-400/50 hover:shadow-rose-500/20',
    ratePerAcre: 2200,
    ratePerHour: 1800,
    proximity: '⚡ Available within 6.0 km',
    rating: '⭐ 4.93 (45 Reviews)',
    operator: '🚜 2-Member Harvesting Crew',
    power: '75 HP Rubber Crawler Tracks',
    coverage: 'Wet Paddy & Wheat High-Speed Threshing',
    ownerName: 'Santosh Kumar',
    ownerPhone: '+91 97410 63821',
    district: 'Belagavi',
    state: 'Karnataka',
    status: 'Available Today',
    tags: ['⚡ Available within 10 km', '⭐ 4.9 Rated', '🚜 Operator Included']
  }
];

export default function EquipmentStudioShowcase({ onSelectMachine }) {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="w-full mb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Studio Machinery Fleet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            <T>Illuminated Showroom Equipment</T>
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            <T>Direct booking of top-rated, certified mechanization with included operators and GPS telemetry dispatch.</T>
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Proximity Radar Active</span>
        </div>
      </div>

      {/* 3D Studio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STUDIO_MACHINERY.map((machine, idx) => (
          <motion.div
            key={machine.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            whileHover={{ y: -6 }}
            className={`group relative rounded-[2rem] overflow-hidden border border-white/10 bg-slate-950/80 shadow-2xl flex flex-col justify-between transition-all duration-500 ${machine.glowColor}`}
          >
            {/* Ambient Podium Glow behind Image */}
            <div className={`absolute top-0 inset-x-0 h-56 bg-gradient-to-b ${machine.podiumColor} opacity-30 group-hover:opacity-60 transition-opacity duration-700 blur-2xl pointer-events-none`} />

            {/* Studio Image Stage */}
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center p-3">
              {/* Studio Backdrop Ring */}
              <div className="absolute inset-x-8 bottom-6 h-28 rounded-full border border-cyan-500/20 group-hover:border-cyan-400/40 opacity-40 blur-[1px] transform -rotate-6 transition-all duration-700 pointer-events-none" />

              <img
                src={machine.image}
                alt={machine.name}
                className="w-full h-full object-cover rounded-2xl transform transition-transform duration-700 ease-out group-hover:scale-106 filter brightness-95 contrast-105"
              />

              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-emerald-400 text-[10px] font-mono font-bold uppercase shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{machine.status}</span>
              </div>

              {/* Category Pill */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-gray-300 text-[10px] font-mono tracking-wider font-semibold">
                {machine.category}
              </div>
            </div>

            {/* Quick Visual Tags Ribbon (As Requested!) */}
            <div className="px-5 pt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                <Zap size={10} className="text-emerald-400 fill-emerald-400" />
                Available within 5 km
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                4.9 Rated
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                <Tractor size={10} className="text-cyan-400" />
                Operator Included
              </span>
            </div>

            {/* Machine Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-display font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                  {machine.name}
                </h3>
                <p className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-1">
                  <MapPin size={11} /> {machine.district}, {machine.state}
                </p>
                <div className="mt-2.5 text-[11px] text-gray-400 flex items-center justify-between border-t border-white/10 pt-2 font-mono">
                  <span>⚡ {machine.power}</span>
                  <span className="text-gray-300">⏱️ {machine.coverage}</span>
                </div>
              </div>

              {/* Pricing & Booking Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Rental Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-display font-black text-emerald-400 leading-none">
                      ₹{machine.ratePerAcre}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">/acre</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">₹{machine.ratePerHour}/hr</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${machine.ownerPhone}`}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                    title={`Call Owner: ${machine.ownerPhone}`}
                  >
                    <PhoneCall size={14} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectMachine && onSelectMachine(machine)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                  >
                    <span><T>Book Now</T></span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
