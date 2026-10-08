const express = require('express');
const router = express.Router();
const { getScaledRecipes } = require('../services/organicRecipeService');

// POST /api/zbnf-calculator
router.post('/zbnf-calculator', (req, res) => {
    try {
        const { crop = 'Rice', areaAcres = 2.5 } = req.body;
        const acres = Math.max(0.25, parseFloat(areaAcres) || 2.5);

        // 1. Get Scaled Recipes from shared service
        const recipes = getScaledRecipes(acres);

        // 2. Crop-Specific ZBNF Schedule
        const cropCalendars = {
            Rice: [
                { stage: "Seed Sowing", timing: "Day 0", formula: "Beejamrut", action: "Coat 10-12kg paddy seeds with Beejamrut 30 mins before sowing in wet nursery beds." },
                { stage: "Transplanting / Broadcast", timing: "Day 21", formula: "Ghan-Jeevamrut", action: "Broadcast 150kg Ghan-Jeevamrut pellets per acre across the field during final puddling." },
                { stage: "Active Tillering", timing: "Day 35", formula: "Jeevamrut (1st Dose)", action: "Mix 200L Jeevamrut into flood irrigation stream or spray 10% solution over foliage." },
                { stage: "Panicle Initiation", timing: "Day 55", formula: "Jeevamrut + Neemastra", action: "Feed 2nd dose of Jeevamrut. Spray Neemastra if early stem borer / leaf folder noticed." },
                { stage: "Flowering & Milking", timing: "Day 75", formula: "Brahmastra / Sour Buttermilk", action: "Spray sour buttermilk or Brahmastra to protect emerging grain panicles from blast and stink bugs." }
            ],
            Cotton: [
                { stage: "Seed Treatment", timing: "Day 0", formula: "Beejamrut", action: "Treat desi cotton seeds with Beejamrut for resistance against seedling root rot." },
                { stage: "Vegetative Phase", timing: "Day 30", formula: "Jeevamrut Drip/Spray", action: "Foliar spray of 10% Jeevamrut every 21 days to promote branch nodes and leaf area." },
                { stage: "Squaring & Flowering", timing: "Day 60", formula: "Agniastra / Brahmastra", action: "Spray Brahmastra to counter spotted bollworm and pink bollworm larval emergence." },
                { stage: "Boll Development", timing: "Day 90-120", formula: "Neemastra Spray", action: "Keep whitefly and thrips populations below economic threshold using pure Neemastra." }
            ],
            Tomato: [
                { stage: "Nursery Sowing", timing: "Day 0", formula: "Beejamrut", action: "Seed treatment to stop Pythium damping off and early root rot." },
                { stage: "Transplanting", timing: "Day 25", formula: "Root Dip in Jeevamrut", action: "Dip roots in 20% Jeevamrut. Broadcast 100kg Ghan-Jeevamrut in planting beds." },
                { stage: "Early Vegetative", timing: "Day 40", formula: "Neemastra Spray", action: "Spray to eliminate Whitefly (vector for leaf curl virus) and leaf miner." },
                { stage: "Flowering & Fruiting", timing: "Day 60", formula: "Brahmastra + Chhach", action: "Prevent tomato fruit borer (Helicoverpa) and early blight fungi." },
                { stage: "Harvest Window", timing: "Day 80-110", formula: "Jeevamrut Drip", action: "Feed Jeevamrut every 12 days to prolong picking cycles and enhance fruit brix sweetness." }
            ],
            Wheat: [
                { stage: "Seed Sowing", timing: "Day 0", formula: "Beejamrut + Ghan Jeevamrut", action: "Coat wheat seeds with Beejamrut. Basal broadcast of 150kg/acre Ghan Jeevamrut." },
                { stage: "Crown Root (CRI)", timing: "Day 21", formula: "Jeevamrut 1st Dosing", action: "Run 200L Jeevamrut per acre with 1st irrigation water." },
                { stage: "Tillering Phase", timing: "Day 45", formula: "Jeevamrut + Neemastra", action: "2nd Jeevamrut dose with 2nd watering. Neemastra spray if aphids appear." },
                { stage: "Jointing & Booting", timing: "Day 70", formula: "Sour Buttermilk Spray", action: "Spray sour buttermilk (5L/acre in 100L water) for yellow rust and powdery mildew defense." },
                { stage: "Milking Stage", timing: "Day 90", formula: "Jeevamrut Foliar", action: "Light foliar spray of 10% filtered Jeevamrut to maximize 1000-grain weight." }
            ]
        };

        const activeCalendar = cropCalendars[crop] || cropCalendars['Rice'];

        // 3. Financial Comparison (Chemical vs ZBNF)
        const chemicalCostPerAcre = 9500;
        const zbnfCostPerAcre = 1100;
        const totalChemicalExpense = Math.round(chemicalCostPerAcre * acres);
        const totalZbnfExpense = Math.round(zbnfCostPerAcre * acres);
        const netSavings = totalChemicalExpense - totalZbnfExpense;
        const savingsPercentage = Math.round((netSavings / totalChemicalExpense) * 100);

        return res.json({
            success: true,
            crop,
            areaAcres: acres,
            recipes,
            calendar: activeCalendar,
            economics: {
                chemicalCostTotal: totalChemicalExpense,
                zbnfCostTotal: totalZbnfExpense,
                netSavings: netSavings,
                savingsPercentage: savingsPercentage,
                costPerAcreSavings: chemicalCostPerAcre - zbnfCostPerAcre
            },
            principles: [
                { title: "Beejamrut (Seed Shield)", desc: "Natural microbial coating to protect seed embryos and boost germination without fungicide poisons." },
                { title: "Jeevamrut (Microbial Culture)", desc: "Not a fertilizer itself, but a powerful catalyst hosting billions of bacteria to unlock locked soil minerals." },
                { title: "Acchadana (Mulching)", desc: "Soil cover using straw or crop residue to conserve 70% water and protect soil earthworms from heat." },
                { title: "Waaphasa (Moisture-Air Equilibrium)", desc: "Irrigating alternate furrows so roots breathe oxygen and absorb nutrient-dense water vapor." }
            ]
        });

    } catch (err) {
        console.error('Error in ZBNF calculator:', err);
        res.status(500).json({ success: false, message: 'ZBNF calculation failed', error: err.message });
    }
});

module.exports = router;
