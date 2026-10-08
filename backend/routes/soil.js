const express = require('express');
const router = express.Router();
const { success, error: errorRes } = require('../utils/response');

// ... data remains same ...
const soilAdviceData = {
    'Sandy': {
        tips: [
            "Incorporate organic compost or well-rotted manure to improve water retention.",
            "Use mulching to prevent rapid moisture evaporation from the surface.",
            "Implement frequent but light irrigation rather than deep watering."
        ],
        urgency: "High - Sandy soils leach nutrients rapidly."
    },
    'Clay': {
        tips: [
            "Add agricultural gypsum to improve soil structure and drainage.",
            "Avoid tilling when the soil is too wet to prevent compaction.",
            "Consider raised bed farming to manage moisture levels effectively."
        ],
        urgency: "Moderate - Risk of waterlogging and poor aeration."
    },
    'Loamy': {
        tips: [
            "Add green manure or vermicompost annually to maintain peak fertility.",
            "Practice crop rotation to prevent specific nutrient depletion.",
            "Monitor pH levels to stay within the optimal 6.0 - 7.0 range."
        ],
        urgency: "Recommended - For maintaining high yield consistency."
    },
    'Black': {
        tips: [
            "Improve field drainage to prevent heavy water stagnation.",
            "Use deep plowing during summer to improve soil aeration.",
            "Add sulfur-based fertilizers if the soil becomes too alkaline."
        ],
        urgency: "High - Black soil can become heavy and unworkable when wet."
    },
    'Red': {
        tips: [
            "Apply agricultural lime to neutralize acidity if detected.",
            "Focus on phosphate-rich fertilizers to boost crop immunity.",
            "Use tank silt or organic matter to improve soil texture."
        ],
        urgency: "Moderate - Vulnerable to acidity and low phosphate."
    },
    'Alluvial': {
        tips: [
            "Rotate primary crops with legumes to naturally fix nitrogen.",
            "Apply balanced NPK fertilizers based on specific crop needs.",
            "Maintain organic carbon levels through residue management."
        ],
        urgency: "Recommended - Generally fertile but benefits from mapping."
    }
};

router.post('/soil-test-advice', (req, res) => {
    try {
        const { soil_type, crop } = req.body;
        const normalizedSoil = soilAdviceData[soil_type] ? soil_type : 'Loamy';
        const advice = soilAdviceData[normalizedSoil];

        return success(res, {
            should_test: true,
            urgency: advice.urgency,
            urgency_level: normalizedSoil === 'Sandy' || normalizedSoil === 'Black' ? 'High' : (normalizedSoil === 'Loamy' || normalizedSoil === 'Alluvial' ? 'Low' : 'Moderate'),
            test_types: [
                { id: 1, name: "NPK Quantitative Test", icon: "FlaskConical" },
                { id: 2, name: "pH & Electrical Conductivity", icon: "Zap" },
                { id: 3, name: "Organic Carbon Analysis", icon: "Leaf" },
                { id: 4, name: "Micronutrient (Zn, Fe, Cu) Profile", icon: "Microscope" }
            ],
            locations: [
                { name: "Krishi Vigyan Kendra (KVK)", type: "Government", distance: "Nearest District", url: "https://icar.org.in/en/krishi-vigyan-kendras" },
                { name: "ICAR Soil Science Division", type: "Research", distance: "State Capital", url: "https://icar.org.in/en" }
            ],
            cost_estimate: "₹450 - ₹1,200 (Subsidized models available)",
            time_required: "5 - 7 Business Days",
            collection_steps: [
                "Identify 8-10 random spots in your field avoiding edges or manure pits.",
                "Remove surface debris and dig a V-shaped pit (15cm deep).",
                "Cut a 1-inch thick slice from the side of the pit (top to bottom).",
                "Collect samples from all spots, mix thoroughly in a clean bucket.",
                "Sun-dry the composite 500g sample before packing in a clean cloth bag."
            ],
            improvement_tips: advice.tips
        });
    } catch (err) {
        console.error('Error generating soil advice:', err.message);
        return errorRes(res, 'Failed to generate soil testing strategy', 500, err.message);
    }
});

module.exports = router;

module.exports = router;
