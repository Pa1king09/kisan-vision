const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');

const improvementData = {
    'Clay': {
        current_grade: 'C',
        potential_grade: 'A',
        duration: '2 Seasons',
        steps: [
            { step: 1, action: "Improve Drainage", quantity: "As per field slope", timing: "Pre-Monsoon", benefit: "Reduces waterlogging and root rot risks." },
            { step: 2, action: "Add Organic Compost", quantity: "5-7 tons/acre", timing: "Post-Harvest", benefit: "Break down clay particles for better aeration." },
            { step: 3, action: "Subsoil Plowing", quantity: "12-15 inches deep", timing: "Dry Season", benefit: "Breaks the hard clay pan beneath the surface." },
            { step: 4, action: "Green Manure (Dhaincha)", quantity: "20kg seeds/acre", timing: "Early Monsoon", benefit: "Naturally fixes nitrogen and adds biomass." }
        ],
        better_crops: [
            { name: "Potato", emoji: "🥔", reason: "Improved drainage prevents tuber rot.", yield_increase: "25%" },
            { name: "Wheat", emoji: "🌾", reason: "Better root penetration in porous soil.", yield_increase: "18%" }
        ]
    },
    'Sandy': {
        current_grade: 'D',
        potential_grade: 'B',
        duration: '3 Seasons',
        steps: [
            { step: 1, action: "Add Organic Matter", quantity: "10 tons/acre", timing: "Early Spring", benefit: "Majorly boosts water and nutrient retention." },
            { step: 2, action: "Heavy Mulching", quantity: "4-inch layer", timing: "Early Summer", benefit: "Protects soil from extreme heat and evaporation." },
            { step: 3, action: "Cover Crops (Legumes)", quantity: "Mixed seeds", timing: "Winter", benefit: "Prevents wind erosion and adds natural nitrogen." },
            { step: 4, action: "Water Retention Mix", quantity: "250kg/acre", timing: "Before Sowing", benefit: "Holds moisture for 3x longer in root zones." }
        ],
        better_crops: [
            { name: "Tomato", emoji: "🍅", reason: "Consistent moisture levels for fruit set.", yield_increase: "40%" },
            { name: "Groundnut", emoji: "🥜", reason: "Better nutrient availability in enriched sand.", yield_increase: "30%" }
        ]
    },
    'Loamy': {
        current_grade: 'B',
        potential_grade: 'A+',
        duration: '1 Season',
        steps: [
            { step: 1, action: "Maintain Compost", quantity: "2 tons/acre", timing: "Annual", benefit: "Keeps the biological activity at peak levels." },
            { step: 2, action: "Crop Rotation", quantity: "3-crop cycle", timing: "Ongoing", benefit: "Prevents specific nutrient depletion patterns." },
            { step: 3, action: "Minimal Intervention", quantity: "No-till approach", timing: "Year-round", benefit: "Protects the natural soil structure and fungi." }
        ],
        better_crops: [
            { name: "Cotton", emoji: "☁️", reason: "Optimal N-P-K balance for high fiber quality.", yield_increase: "15%" },
            { name: "Maize", emoji: "🌽", reason: "Perfect aeration for heavy feeders.", yield_increase: "20%" }
        ]
    },
    'Black': {
        current_grade: 'C',
        potential_grade: 'B+',
        duration: '2 Seasons',
        steps: [
            { step: 1, action: "Manage Waterlogging", quantity: "Trench systems", timing: "Pre-Monsoon", benefit: "Prevents heavy black soil from turning toxic." },
            { step: 2, action: "Phosphorus Manure", quantity: "300kg/acre", timing: "Before Sowing", benefit: "Balances the naturally high moisture with nutrients." },
            { step: 3, action: "Raised Bed Farming", quantity: "1-foot height", timing: "Continuous", benefit: "Ensures roots stay above the saturated zone." }
        ],
        better_crops: [
            { name: "Soybean", emoji: "🫛", reason: "Better root respiration in drained beds.", yield_increase: "22%" },
            { name: "Sugarcane", emoji: "🎋", reason: "Sustainable growth without water stress.", yield_increase: "12%" }
        ]
    },
    'Red': {
        current_grade: 'C',
        potential_grade: 'B',
        duration: '2 Seasons',
        steps: [
            { step: 1, action: "Add Lime (Limestone)", quantity: "500kg/acre", timing: "Spring", benefit: "Neutralizes the natural acidity of red soil." },
            { step: 2, action: "Heavy Composting", quantity: "8 tons/acre", timing: "Bi-annual", benefit: "Improves the typically low organic content." },
            { step: 3, action: "Iron Chelates", quantity: "15kg/acre", timing: "Vegetative Phase", benefit: "Specifically targets red soil mineral deficiency." }
        ],
        better_crops: [
            { name: "Tea/Coffee", emoji: "☕", reason: "Controlled acidity for high-grade flavor.", yield_increase: "35%" },
            { name: "Chilli", emoji: "🌶️", reason: "Better color and pungency in enriched soil.", yield_increase: "28%" }
        ]
    },
    'Alluvial': {
        current_grade: 'B',
        potential_grade: 'A',
        duration: '1 Season',
        steps: [
            { step: 1, action: "Maintain Organic Matter", quantity: "3 tons/acre", timing: "Annual", benefit: "Prevents nutrient depletion from heavy farming." },
            { step: 2, action: "Seasonal Replenishment", quantity: "Tailored NPK", timing: "Pre-Kharif", benefit: "Restores minerals used by previous intensive crops." }
        ],
        better_crops: [
            { name: "Rice", emoji: "🍚", reason: "Consistently high mineral availability.", yield_increase: "10%" },
            { name: "Mustard", emoji: "🌼", reason: "Enhanced oil content through better nutrition.", yield_increase: "15%" }
        ]
    }
};

router.post('/soil-improvement', (req, res) => {
    try {
        const { soil_type, current_crop } = req.body;
        const normalizedSoil = improvementData[soil_type] ? soil_type : 'Loamy';
        const data = improvementData[normalizedSoil];

        return success(res, {
            soil_type: normalizedSoil,
            current_grade: data.current_grade,
            potential_grade: data.potential_grade,
            duration: data.duration,
            steps: data.steps,
            better_crops: data.better_crops,
            general_tips: [
                "Always perform a soil test before applying large quantities of lime or fertilizers.",
                "Leave crop residue on the field to act as natural mulch.",
                "Monitor soil moisture levels using a simple tensiometer."
            ]
        });
    } catch (err) {
        console.error('Error generating improvement roadmap:', err.message);
        res.status(500).json({ error: 'Failed to generate improvement roadmap' });
    }
});

module.exports = router;
