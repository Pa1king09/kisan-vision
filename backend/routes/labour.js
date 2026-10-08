const express = require('express');
const router = express.Router();
const { success, error: errorRes } = require('../utils/response');

// ... data remains same ...
const cropLabourData = {
    'Rice': {
        labour_days_per_acre: 45,
        daily_wage_rate: 450,
        peak_months: ['July', 'August', 'November'],
        machinery: true,
        phases: [
            { name: "Land Preparation", emoji: "🚜", duration: "10 Days", workers: 4, tasks: ["Ploughing", "Puddling", "Leveling"], type: "Skilled/Unskilled" },
            { name: "Transplanting", emoji: "🌱", duration: "15 Days", workers: 12, tasks: ["Nursery Raising", "Uprooting", "Manual Planting"], type: "Unskilled" },
            { name: "Crop Management", emoji: "💧", duration: "60 Days", workers: 2, tasks: ["Weeding (Twice)", "Fertilizer Application", "Irrigation"], type: "Unskilled" },
            { name: "Harvesting & Post-Harvest", emoji: "🌾", duration: "20 Days", workers: 10, tasks: ["Cutting", "Threshing", "Winnowing", "Bagging"], type: "Skilled/Unskilled" }
        ],
        machinery_options: [
            { name: "Power Tiller", rental: "₹800/hr", saving: "70%" },
            { name: "Paddy Transplanter", rental: "₹1200/hr", saving: "85%" },
            { name: "Combine Harvester", rental: "₹2500/hr", saving: "90%" }
        ]
    },
    'Wheat': {
        labour_days_per_acre: 30,
        daily_wage_rate: 500,
        peak_months: ['November', 'April'],
        machinery: true,
        phases: [
            { name: "Land Preparation", emoji: "🚜", duration: "7 Days", workers: 2, tasks: ["Deep Ploughing", "Disc Harrowing", "Planking"], type: "Skilled" },
            { name: "Sowing", emoji: "🎯", duration: "5 Days", workers: 3, tasks: ["Seed Treatment", "Seed Drill Operation"], type: "Skilled" },
            { name: "Crop Management", emoji: "🌿", duration: "45 Days", workers: 1, tasks: ["Irrigation Management", "Urea Top Dressing"], type: "Unskilled" },
            { name: "Harvesting & Post-Harvest", emoji: "🧺", duration: "12 Days", workers: 8, tasks: ["Reaping", "Threshing", "Cleaning"], type: "Skilled/Unskilled" }
        ],
        machinery_options: [
            { name: "Tractor with Seed Drill", rental: "₹1000/hr", saving: "75%" },
            { name: "Multicrop Thresher", rental: "₹600/hr", saving: "80%" }
        ]
    },
    'Maize': {
        labour_days_per_acre: 25,
        daily_wage_rate: 400,
        peak_months: ['June', 'September'],
        machinery: true,
        phases: [
            { name: "Land Preparation", emoji: "🚜", duration: "6 Days", workers: 2, tasks: ["Primary Tillage", "Field Leveling"], type: "Unskilled" },
            { name: "Sowing", emoji: "🌽", duration: "4 Days", workers: 4, tasks: ["Dibbling", "Gap Filling"], type: "Unskilled" },
            { name: "Crop Management", emoji: "🧤", duration: "40 Days", workers: 2, tasks: ["Hoeing", "Interculture Operations", "Earthing up"], type: "Unskilled" },
            { name: "Harvesting", emoji: "📦", duration: "10 Days", workers: 6, tasks: ["Cobb Picking", "Shelling", "Drying"], type: "Unskilled" }
        ],
        machinery_options: [
            { name: "Maize Sheller", rental: "₹500/hr", saving: "90%" }
        ]
    },
    'Millet': {
        labour_days_per_acre: 18,
        daily_wage_rate: 380,
        peak_months: ['July', 'October'],
        machinery: false,
        phases: [
            { name: "Field Preparation", emoji: "🏜️", duration: "5 Days", workers: 2, tasks: ["Clearing Debris", "Light Ploughing"], type: "Unskilled" },
            { name: "Sowing", emoji: "✨", duration: "3 Days", workers: 3, tasks: ["Broadcasting", "Seed Covering"], type: "Unskilled" },
            { name: "Management", emoji: "🌵", duration: "30 Days", workers: 1, tasks: ["Thinning", "Minimal Weeding"], type: "Unskilled" },
            { name: "Harvesting", emoji: "🧤", duration: "8 Days", workers: 5, tasks: ["Cutting Ear-heads", "Manual Threshing"], type: "Unskilled" }
        ],
        machinery_options: []
    },
    'Sugarcane': {
        labour_days_per_acre: 120,
        daily_wage_rate: 450,
        peak_months: ['February', 'March', 'December'],
        machinery: true,
        phases: [
            { name: "Land & Setts Prep", emoji: "🎋", duration: "15 Days", workers: 6, tasks: ["Deep Trenching", "Sett Cutting", "Sett Treatment"], type: "Skilled" },
            { name: "Planting", emoji: "🚜", duration: "10 Days", workers: 15, tasks: ["Placing Setts", "Covering", "Irrigation"], type: "Unskilled" },
            { name: "Management", emoji: "🌊", duration: "180 Days", workers: 4, tasks: ["Propping", "Detrashing", "Continuous Irrigation"], type: "Unskilled" },
            { name: "Harvesting", emoji: "🪓", duration: "30 Days", workers: 20, tasks: ["Cutting", "Stripping", "Loading for Factory"], type: "Unskilled" }
        ],
        machinery_options: [
            { name: "Sugarcane Planter", rental: "₹1500/hr", saving: "60%" },
            { name: "Sugarcane Harvester", rental: "₹4500/hr", saving: "95%" }
        ]
    },
    'Cotton': {
        labour_days_per_acre: 55,
        daily_wage_rate: 420,
        peak_months: ['October', 'November', 'December'],
        machinery: false,
        phases: [
            { name: "Pre-Sowing", emoji: "⛏️", duration: "8 Days", workers: 3, tasks: ["Basal Fertilizer Application", "Bed Making"], type: "Unskilled" },
            { name: "Sowing", emoji: "☁️", duration: "5 Days", workers: 5, tasks: ["Seed Sowing", "Gap Filling"], type: "Unskilled" },
            { name: "Management", emoji: "🧪", duration: "100 Days", workers: 3, tasks: ["Pest Scouting", "Spraying", "Weeding"], type: "Skilled" },
            { name: "Picking", emoji: "👐", duration: "45 Days", workers: 12, tasks: ["Multi-stage Picking", "Drying", "Storing"], type: "Unskilled (Female Focused)" }
        ],
        machinery_options: [
            { name: "Power Sprayer", rental: "₹200/hr", saving: "50%" }
        ]
    },
    'Jute': {
        labour_days_per_acre: 60,
        daily_wage_rate: 400,
        peak_months: ['April', 'July', 'August'],
        machinery: false,
        phases: [
            { name: "Sowing", emoji: "🧶", duration: "6 Days", workers: 4, tasks: ["Broadcast Sowing", "Thinning"], type: "Unskilled" },
            { name: "Management", emoji: "🌿", duration: "50 Days", workers: 3, tasks: ["Repeated Weeding", "Plant Protection"], type: "Unskilled" },
            { name: "Harvesting", emoji: "🔪", duration: "15 Days", workers: 10, tasks: ["Stepping", "Cutting", "Bundling"], type: "Unskilled" },
            { name: "Retting & Stripping", emoji: "💧", duration: "15 Days", workers: 15, tasks: ["Submerging", "Fibre Extraction", "Washing"], type: "Skilled" }
        ],
        machinery_options: []
    },
    'Coffee': {
        labour_days_per_acre: 150,
        daily_wage_rate: 550,
        peak_months: ['December', 'January', 'February'],
        machinery: false,
        phases: [
            { name: "Estate Maintenance", emoji: "🌳", duration: "Ongoing", workers: 2, tasks: ["Pruning", "Shade Management", "Drainage"], type: "Skilled" },
            { name: "Fertilization", emoji: "🧪", duration: "15 Days", workers: 5, tasks: ["Lime Application", "NPK Application"], type: "Unskilled" },
            { name: "Harvesting", emoji: "☕", duration: "40 Days", workers: 20, tasks: ["Berry Picking (Select/Strip)", "Processing"], type: "Unskilled" },
            { name: "Processing", emoji: "🏭", duration: "20 Days", workers: 8, tasks: ["Pulping", "Fermentation", "Drying"], type: "Skilled" }
        ],
        machinery_options: [
            { name: "Coffee Pulper", rental: "N/A (Fixed Asset)", saving: "70%" },
            { name: "Mechanical Pruner", rental: "₹400/hr", saving: "40%" }
        ]
    },
    'Coconut': {
        labour_days_per_acre: 20,
        daily_wage_rate: 650,
        peak_months: ['Every 45 days'],
        machinery: false,
        phases: [
            { name: "Basal Maintenance", emoji: "🥥", duration: "5 Days", workers: 2, tasks: ["Basin Cleaning", "Bund Formation"], type: "Unskilled" },
            { name: "Climbing/Harvest", emoji: "🧗", duration: "2 Days", workers: 3, tasks: ["Harvesting Nuts", "Cleaning Crowns"], type: "Highly Skilled" },
            { name: "Post-Harvest", emoji: "🌴", duration: "5 Days", workers: 4, tasks: ["De-husking", "Copra Making"], type: "Unskilled" },
            { name: "Plant Protection", emoji: "🛡️", duration: "3 Days", workers: 2, tasks: ["Pheromone Trap Setting", "Stem Injection"], type: "Skilled" }
        ],
        machinery_options: [
            { name: "Climbing Device", rental: "₹100/day", saving: "30%" }
        ]
    },
    'Banana': {
        labour_days_per_acre: 80,
        daily_wage_rate: 450,
        peak_months: ['August', 'September', 'October'],
        machinery: false,
        phases: [
            { name: "Planting", emoji: "🍌", duration: "10 Days", workers: 8, tasks: ["Sucker Selection", "Pit Making", "Planting"], type: "Unskilled" },
            { name: "Desuckering", emoji: "✂️", duration: "Ongoing", workers: 2, tasks: ["Removal of secondary suckers", "Pruning"], type: "Unskilled" },
            { name: "Management", emoji: "⛲", duration: "120 Days", workers: 3, tasks: ["Propping (Bamboo Support)", "Drip Maintenance"], type: "Skilled" },
            { name: "Harvesting", emoji: "🚚", duration: "15 Days", workers: 10, tasks: ["Bunch Cutting", "Packing", "Loading"], type: "Unskilled" }
        ],
        machinery_options: []
    }
};

router.post('/labour-requirements', (req, res) => {
    try {
        const { crop, land_area_acres, season } = req.body;
        const area = parseFloat(land_area_acres) || 1;

        const normalizedCrop = Object.keys(cropLabourData).find(
            k => k.toLowerCase() === crop?.toLowerCase()
        ) || 'Rice';

        const data = cropLabourData[normalizedCrop];
        const totalLabourDays = Math.round(data.labour_days_per_acre * area);
        const totalLabourCost = Math.round(totalLabourDays * data.daily_wage_rate);

        return success(res, {
            crop_name: normalizedCrop,
            land_area: area,
            total_labour_days: totalLabourDays,
            total_labour_cost: totalLabourCost,
            daily_wage_rate: data.daily_wage_rate,
            peak_labour_periods: data.peak_months,
            labour_phases: data.phases.map(p => ({
                ...p,
                cost_for_area: Math.round((totalLabourCost / 4)) 
            })),
            machinery_options: data.machinery_options,
            booking_tip: "Book labour at least 15 days before peak months. Group with neighboring farms to negotiate better daily rates or machinery rentals."
        });
    } catch (err) {
        console.error('Error calculating labour requirements:', err.message);
        return errorRes(res, 'Labour planning engine failed', 500, err.message);
    }
});

module.exports = router;

module.exports = router;
