import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sprout, Droplets, Sun, Scissors, CheckCircle2, Clock } from 'lucide-react';
import T, { TD } from './T';

// Static timeline data per crop group
const TIMELINE_DB = {
    'rice': [
        { month: 'Jun', phase: 'Land Preparation', desc: 'Plow and puddle the field. Prepare nursery beds for seedlings.', icon: Sprout, color: 'bg-amber-500' },
        { month: 'Jul', phase: 'Transplanting', desc: 'Transplant 25-30 day old seedlings to the main field.', icon: Sprout, color: 'bg-emerald-500' },
        { month: 'Aug', phase: 'Fertilizing', desc: 'Apply urea and DAP. First top dressing of nitrogen.', icon: Droplets, color: 'bg-blue-500' },
        { month: 'Sep', phase: 'Irrigation & Care', desc: 'Maintain 2-5cm standing water. Weed management.', icon: Droplets, color: 'bg-cyan-500' },
        { month: 'Oct', phase: 'Maturation', desc: 'Reduce water. Grains harden and turn golden.', icon: Sun, color: 'bg-orange-500' },
        { month: 'Nov', phase: 'Harvesting', desc: 'Harvest when 80% grains are golden. Thresh and dry.', icon: Scissors, color: 'bg-red-500' },
    ],
    'wheat (gehun)': [
        { month: 'Oct', phase: 'Land Preparation', desc: 'Deep plowing and field leveling. Apply basal fertilizers.', icon: Sprout, color: 'bg-amber-500' },
        { month: 'Nov', phase: 'Sowing', desc: 'Sow seeds at 20-22cm row spacing. Seed rate 100kg/ha.', icon: Sprout, color: 'bg-emerald-500' },
        { month: 'Dec', phase: 'First Irrigation', desc: 'Crown root initiation stage. Apply first nitrogen top dress.', icon: Droplets, color: 'bg-blue-500' },
        { month: 'Jan', phase: 'Tillering', desc: 'Second irrigation and weed control. Apply urea.', icon: Droplets, color: 'bg-cyan-500' },
        { month: 'Feb', phase: 'Flowering', desc: 'Critical irrigation at heading stage. Monitor for rust.', icon: Sun, color: 'bg-orange-500' },
        { month: 'Mar-Apr', phase: 'Harvesting', desc: 'Harvest when grain moisture drops below 20%. Thresh immediately.', icon: Scissors, color: 'bg-red-500' },
    ],
    'sunflower': [
        { month: 'Feb', phase: 'Land Preparation', desc: 'Deep plowing. Apply FYM and basal fertilizers.', icon: Sprout, color: 'bg-amber-500' },
        { month: 'Mar', phase: 'Sowing', desc: 'Sow at 60x30cm spacing. Seed depth 4-5cm.', icon: Sprout, color: 'bg-emerald-500' },
        { month: 'Apr', phase: 'Growth & Fertilizing', desc: 'Apply nitrogen top dressing. Thin to one plant per hill.', icon: Droplets, color: 'bg-blue-500' },
        { month: 'May', phase: 'Flowering', desc: 'Head formation stage. Critical irrigation needed.', icon: Sun, color: 'bg-orange-500' },
        { month: 'Jun', phase: 'Harvesting', desc: 'Harvest when back of head turns brown. Sun-dry seeds.', icon: Scissors, color: 'bg-red-500' },
    ],
    'cotton': [
        { month: 'Apr', phase: 'Land Preparation', desc: 'Deep plowing. Ridge and furrow method recommended.', icon: Sprout, color: 'bg-amber-500' },
        { month: 'May', phase: 'Sowing', desc: 'Plant Bt cotton hybrids at 90x60cm spacing.', icon: Sprout, color: 'bg-emerald-500' },
        { month: 'Jun-Jul', phase: 'Vegetative Growth', desc: 'Apply NPK fertilizers. Thinning and weeding.', icon: Droplets, color: 'bg-blue-500' },
        { month: 'Aug', phase: 'Square Formation', desc: 'Monitor for bollworm. Spray as needed.', icon: Sun, color: 'bg-cyan-500' },
        { month: 'Sep-Oct', phase: 'Boll Opening', desc: 'Reduce irrigation. Bolls begin to burst open.', icon: Sun, color: 'bg-orange-500' },
        { month: 'Nov-Dec', phase: 'Picking', desc: 'Pick cotton in 3-4 rounds as bolls open progressively.', icon: Scissors, color: 'bg-red-500' },
    ],
};

// Generic timeline for crops not in DB
const DEFAULT_TIMELINE = [
    { month: 'Month 1', phase: 'Land Preparation', desc: 'Prepare soil through plowing, leveling, and adding organic matter.', icon: Sprout, color: 'bg-amber-500' },
    { month: 'Month 2', phase: 'Sowing / Planting', desc: 'Sow seeds or transplant seedlings at recommended spacing.', icon: Sprout, color: 'bg-emerald-500' },
    { month: 'Month 3', phase: 'Fertilizing', desc: 'Apply recommended NPK fertilizers and micronutrients.', icon: Droplets, color: 'bg-blue-500' },
    { month: 'Month 4', phase: 'Irrigation & Maintenance', desc: 'Regular watering, weeding, and pest monitoring.', icon: Droplets, color: 'bg-cyan-500' },
    { month: 'Month 5', phase: 'Flowering / Fruiting', desc: 'Critical growth stage. Ensure adequate water and nutrition.', icon: Sun, color: 'bg-orange-500' },
    { month: 'Month 6', phase: 'Harvesting', desc: 'Harvest at optimal maturity. Process and store properly.', icon: Scissors, color: 'bg-red-500' },
];

const getTimeline = (cropName) => {
    if (!cropName) return DEFAULT_TIMELINE;
    const key = cropName.toLowerCase();
    // Try exact match first, then partial match
    if (TIMELINE_DB[key]) return TIMELINE_DB[key];
    const match = Object.keys(TIMELINE_DB).find(k => key.includes(k) || k.includes(key));
    return match ? TIMELINE_DB[match] : DEFAULT_TIMELINE;
};

const GrowingTimeline = ({ crop }) => {
    const safeCrop = crop || 'Rice';
    const timeline = getTimeline(safeCrop);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-brand-primary" />
                </div>
                <div>
                    <T as="h3" className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Growing Timeline</T>
                    <p className="text-brand-text-secondary text-xs font-bold">
                        <T>Month-wise cultivation roadmap for</T> <TD value={safeCrop} />
                    </p>
                </div>
            </div>

            <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-slate-200" />

                {timeline.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="relative mb-8 last:mb-0"
                        >
                            {/* Dot on timeline */}
                            <div className={`absolute -left-8 top-3 w-[18px] h-[18px] rounded-full ${step.color} flex items-center justify-center shadow-md z-10`}>
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>

                            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ml-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full text-brand-surface ${step.color}`}>
                                        <Clock size={10} />
                                        <TD value={step.month} />
                                    </span>
                                    <span className="text-sm font-black text-brand-text-primary uppercase tracking-tight">
                                        <TD value={step.phase} />
                                    </span>
                                </div>
                                <p className="text-sm text-brand-text-secondary font-medium leading-relaxed">
                                    <TD value={step.desc} />
                                </p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Completion marker */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: timeline.length * 0.1 }}
                    className="relative"
                >
                    <div className="absolute -left-8 top-0 w-[18px] h-[18px] rounded-full bg-brand-primary flex items-center justify-center shadow-md z-10">
                        <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <div className="ml-4 pt-1">
                        <T as="p" className="text-sm font-black text-brand-primary uppercase tracking-widest">Cycle Complete</T>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GrowingTimeline;
