const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');

const crops = ['Rice', 'Wheat', 'Maize', 'Millet', 'Sugarcane', 'Cotton', 'Jute', 'Coffee', 'Coconut', 'Banana'];

const cropRequirements = {
    'Rice': { soil: ['Clay', 'Alluvial'], rainfall: 'High', season: ['Monsoon', 'Summer'], humidity: 'High' },
    'Wheat': { soil: ['Loamy', 'Alluvial'], rainfall: 'Medium', season: ['Winter'], humidity: 'Low' },
    'Maize': { soil: ['Alluvial', 'Loamy'], rainfall: 'Medium', season: ['Summer', 'Monsoon'], humidity: 'Medium' },
    'Millet': { soil: ['Sandy', 'Red'], rainfall: 'Low', season: ['Summer'], humidity: 'Low' },
    'Sugarcane': { soil: ['Black', 'Alluvial'], rainfall: 'High', season: ['Summer', 'Monsoon'], humidity: 'High' },
    'Cotton': { soil: ['Black', 'Alluvial'], rainfall: 'Medium', season: ['Summer'], humidity: 'Medium' },
    'Jute': { soil: ['Alluvial', 'Clay'], rainfall: 'High', season: ['Monsoon'], humidity: 'High' },
    'Coffee': { soil: ['Red'], rainfall: 'Medium', season: ['Spring', 'Summer'], humidity: 'High' },
    'Coconut': { soil: ['Sandy', 'Alluvial'], rainfall: 'High', season: ['Monsoon', 'Summer'], humidity: 'High' },
    'Banana': { soil: ['Loamy', 'Alluvial'], rainfall: 'High', season: ['Monsoon', 'Summer'], humidity: 'High' }
};

const baseYields = {
    'Rice': 2.5, 'Wheat': 2.0, 'Maize': 3.0, 'Millet': 1.2, 'Sugarcane': 35.0,
    'Cotton': 0.8, 'Jute': 2.8, 'Coffee': 0.6, 'Coconut': 3.5, 'Banana': 10.0
};

const mspPrices = {
    'Rice': 2183, 'Wheat': 2275, 'Maize': 1962, 'Millet': 2500,
    'Sugarcane': 315, 'Cotton': 6620, 'Jute': 4750, 'Coffee': 4254, 'Coconut': 2700, 'Banana': 1500
};

const calculateScore = (cropName, soil, rainfall, season, humidity) => {
    const reqs = cropRequirements[cropName];
    if (!reqs) return 0;

    let score = 0;
    const factors = [];

    // Soil compatibility (30 points)
    const soilScore = reqs.soil.includes(soil) ? 30 : (reqs.soil.some(s => s.includes(soil) || soil.includes(s)) ? 20 : 10);
    score += soilScore;
    factors.push({ name: 'Soil Compatibility', score: soilScore, max: 30, status: soilScore >= 25 ? 'Excellent' : 'Average' });

    // Rainfall adequacy (25 points)
    const rainScore = reqs.rainfall === rainfall ? 25 : (rainfall === 'Medium' ? 15 : 10);
    score += rainScore;
    factors.push({ name: 'Rainfall Adequacy', score: rainScore, max: 25, status: rainScore >= 20 ? 'Optimal' : 'Sub-optimal' });

    // Season alignment (25 points)
    const seasonScore = reqs.season.includes(season) ? 25 : 10;
    score += seasonScore;
    factors.push({ name: 'Season Alignment', score: seasonScore, max: 25, status: seasonScore >= 20 ? 'Perfect' : 'Mismatch' });

    // Climate suitability (20 points)
    const humidScore = reqs.humidity === humidity ? 20 : 10;
    score += humidScore;
    factors.push({ name: 'Climate Suitability', score: humidScore, max: 20, status: humidScore >= 15 ? 'Stable' : 'Volatile' });

    return { total: score, factors };
};

const calculateProfitPerAcre = (cropName) => {
    const yieldPerAcre = baseYields[cropName] || 1;
    const msp = mspPrices[cropName] || 1000;
    let gross;
    if (cropName === 'Sugarcane') {
        gross = yieldPerAcre * msp;
    } else {
        gross = (yieldPerAcre * 10) * msp;
    }
    const net = gross * 0.65; // 35% cost
    return Math.round(net);
};

router.post('/feasibility-report', (req, res) => {
    try {
        const { crop, soil_type, season, rainfall_level, humidity_level } = req.body;
        const normalizedCrop = crop?.charAt(0).toUpperCase() + crop?.slice(1).toLowerCase();

        const mainAnalysis = calculateScore(normalizedCrop, soil_type, rainfall_level, season, humidity_level);

        let label = "Low Feasibility";
        let color = "#ef4444";
        if (mainAnalysis.total >= 85) { label = "Highly Feasible"; color = "#22c55e"; }
        else if (mainAnalysis.total >= 70) { label = "Feasible"; color = "#84cc16"; }
        else if (mainAnalysis.total >= 55) { label = "Moderately Feasible"; color = "#eab308"; }

        // Alternatives
        const alternatives = crops
            .filter(c => c.toLowerCase() !== normalizedCrop.toLowerCase())
            .map(c => {
                const analysis = calculateScore(c, soil_type, rainfall_level, season, humidity_level);
                return {
                    name: c,
                    match_score: analysis.total,
                    profit: calculateProfitPerAcre(c),
                    reason: `High compatibility with ${soil_type} soil during ${season}.`
                };
            })
            .sort((a, b) => b.match_score - a.match_score)
            .slice(0, 3)
            .map((c, i) => ({
                rank: i + 1,
                ...c,
                emoji: ['🍚', '🌾', '🌽', '🌾', '🎋', '☁️', '🧶', '☕', '🥥', '🍌'][crops.indexOf(c.name)] || '🌱'
            }));

        return success(res, {
            overall_feasibility: label,
            feasibility_score: mainAnalysis.total,
            feasibility_color: color,
            feasibility_factors: mainAnalysis.factors,
            top_3_crops: alternatives,
            recommendation_summary: `The feasibility score of ${mainAnalysis.total}% suggests that ${normalizedCrop} is a ${label.toLowerCase()} choice for your current environment.`
        });

    } catch (err) {
        console.error('Error generating feasibility report:', err.message);
        res.status(500).json({ error: 'Feasibility engine failure' });
    }
});

module.exports = router;
