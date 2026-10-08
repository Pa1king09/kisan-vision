const express = require('express');
const router = express.Router();
const { success, error: errorRes } = require('../utils/response');

const water_intensive_crops = ['rice', 'sugarcane', 'jute', 'banana', 'coconut', 'watermelon', 'muskmelon', 'orange'];

// POST /api/confidence-risk
router.post('/confidence-risk', (req, res) => {
    try {
        const { crop, confidence, soil_type, rainfall_level, humidity_level, season, temperature } = req.body;

        let risk_factors = [];
        let mitigations = [];
        let risk_score = Math.round((1 - (confidence || 0.5)) * 100);

        // ... logic remains same ...
        if (water_intensive_crops.includes(crop?.toLowerCase()) && rainfall_level === 'Low') {
            risk_factors.push("water risk");
            mitigations.push("Critical irrigation required. Consider rainwater harvesting or micro-sprinklers.");
            risk_score += 25;
        }

        if (temperature > 38) {
            risk_factors.push("heat stress risk");
            mitigations.push("High heat detected. Use soil mulching and morning irrigation to prevent moisture loss.");
            risk_score += 20;
        }

        if (temperature < 12) {
            risk_factors.push("cold stress risk");
            mitigations.push("Cold alert. Apply organic ground cover or windbreaks to protect crops.");
            risk_score += 20;
        }

        if (soil_type === 'Sandy' && water_intensive_crops.includes(crop?.toLowerCase())) {
            risk_factors.push("drainage risk");
            mitigations.push("Sandy soil drains too fast for this crop. Add hydrogels or organic manure.");
            risk_score += 15;
        }

        if (humidity_level === 'Low' && season === 'Summer') {
            risk_factors.push("drought risk");
            mitigations.push("Dry summer conditions. Prioritize deep watering during evening hours.");
            risk_score += 15;
        }

        if (confidence < 0.70) {
            risk_factors.push("model uncertainty risk");
            mitigations.push("Confidence is low. Soil verification is recommended before large scale planting.");
            risk_score += 10;
        }

        risk_score = Math.min(risk_score, 100);

        let risk_level = "Low Risk";
        let risk_color = "#22c55e"; 

        if (confidence < 0.55 || risk_score > 75) {
            risk_level = "Very High Risk";
            risk_color = "#ef4444";
        } else if (confidence < 0.70 || risk_score > 55) {
            risk_level = "High Risk";
            risk_color = "#f97316";
        } else if (confidence < 0.85 || risk_score > 35) {
            risk_level = "Moderate Risk";
            risk_color = "#eab308";
        }

        const should_soil_test = (risk_level === "High Risk" || risk_level === "Very High Risk");

        const recommendation_text = risk_factors.length > 0
            ? `Our analysis indicates some environmental challenges. Following the mitigation plan is advised for optimal yield.`
            : `Conditions are highly favorable for ${crop}. Standard farming practices should yield excellent results.`;

        return success(res, {
            risk_level,
            risk_color,
            risk_score,
            risk_factors,
            mitigations,
            overall_recommendation: recommendation_text,
            should_soil_test
        });

    } catch (err) {
        console.error('Error calculating risk:', err.message);
        return errorRes(res, 'Risk assessment failure', 500, err.message);
    }
});

module.exports = router;

module.exports = router;
