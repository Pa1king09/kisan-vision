const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const { success, error: errorRes } = require('../utils/response');
const cropData = require('../utils/cropData');
const agroServices = require('../utils/agroServices');
const {
    generateContrastiveTradeoffs,
    calibrateUncertainty,
    computeCounterfactual
} = require('../services/xaiService');

const getCropMetadata = (cropName) => {
    if (!cropName) return { total_duration: 'Varies', difficulty: 'Medium' };
    
    const clean = cropName.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-z]/g, '');
        
    for (const key of Object.keys(cropData)) {
        const cleanKey = key.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\(.*?\)/g, '')
            .replace(/[^a-z]/g, '');
            
        if (clean.includes(cleanKey) || cleanKey.includes(clean)) {
            return cropData[key];
        }
    }
    
    return { total_duration: 'Varies', difficulty: 'Medium' };
};

// POST /api/recommend
router.post('/recommend', async (req, res) => {
    try {
        const { location, soil_mode = 'manual', manual_soil_type = 'Loamy' } = req.body;

        if (!location) {
            return errorRes(res, 'Location is required', 400);
        }

        // Use process.env for URLs or derive from request host
        const protocol = req.protocol;
        const host = req.get('host');
        const selfUrl = `${protocol}://${host}/api`;
        const mlUrl = process.env.ML_API_URL || `${process.env.FLASK_URL || 'http://localhost:5001'}/predict`;

        // Step 1: Get coordinates
        let lat = location.lat || location.latitude;
        let lon = location.lon || location.longitude;
        
        if (!lat || !lon) {
            const { state, district, village } = location;
            if (!state && !district) {
                return errorRes(res, 'State or district required for manual location', 400);
            }
            const geoData = await agroServices.getGeocode(state, district, village);
            lat = geoData.latitude;
            lon = geoData.longitude;
        }

        if (!lat || !lon) {
            return errorRes(res, 'Could not resolve location coordinates', 400);
        }

        // Step 2: Get weather
        const weather = await agroServices.getWeather(lat, lon);

        // Step 3: Derive descriptive levels
        const rainfall_level = weather.rainfall < 70 ? 'Low' : weather.rainfall < 170 ? 'Medium' : 'High';
        const humidity_level = weather.humidity < 35 ? 'Low' : weather.humidity < 75 ? 'Medium' : 'High';

        // Step 4: Get soil
        let soil_type = manual_soil_type;
        let soil_info = { soil_type };
        if (soil_mode === 'auto') {
            const soilData = await agroServices.getSoil(lat, lon);
            soil_type = soilData.soil_type;
            soil_info = soilData;
        }

        // Step 5: Prepare farmer inputs
        const farmer_inputs = {
            temperature: weather.temperature,
            humidity: weather.humidity,
            rainfall: weather.rainfall,
            season: weather.season,
            soil_type,
            rainfall_level,
            humidity_level,
            elevation: weather.elevation || 0
        };

        // Step 6: ML prediction
        const mlRes = await axios.post(mlUrl, farmer_inputs);
        let top_crops = mlRes.data.recommended_crops || [{ crop: mlRes.data.crop, confidence: mlRes.data.confidence }];

        // Step 7: Climate filter
        const mlCrops = top_crops.map(c => c.crop);
        const filterData = agroServices.filterCrops(mlCrops, weather.temperature, weather.rainfall);
        
        const filtered_indices = filterData.filtered_crops.map(crop => mlCrops.indexOf(crop));
        const filtered_crops = filtered_indices.map(idx => top_crops[idx]).filter(Boolean).slice(0, 3);

        // Ensure we always have exactly 3 crops for the comparison panel to render consistently
        let final_recommended = [...filtered_crops];
        for (const tc of top_crops) {
            if (final_recommended.length >= 3) break;
            if (!final_recommended.some(c => c.crop === tc.crop)) {
                final_recommended.push(tc);
            }
        }

        const top1 = final_recommended[0] || top_crops[0];

        // Enrich with crop metadata
        const cropInfo = getCropMetadata(top1.crop);

        // Core XAI Enhancements: Uncertainty Calibration & Multi-Crop Contrastive Trade-offs
        const uncertainty_calibration = calibrateUncertainty(
            final_recommended,
            mlRes.data.mapped_values || farmer_inputs
        );

        const contrastive_tradeoffs = generateContrastiveTradeoffs(
            top1.crop,
            final_recommended.slice(1),
            mlRes.data.mapped_values || farmer_inputs,
            weather
        );

        return success(res, {
            crop: top1.crop,
            confidence: top1.confidence,
            recommended_crops: final_recommended,
            weather,
            soil_type,
            explanation: mlRes.data.explanation,
            mapped_values: mlRes.data.mapped_values,
            workflow_summary: farmer_inputs,
            total_duration: cropInfo.total_duration,
            uncertainty_calibration,
            contrastive_tradeoffs
        });
    } catch (err) {
        console.error('Error in /recommend:', err.message);
        const statusCode = err.response?.status || 500;
        return errorRes(res, 'Recommendation service temporarily unavailable', statusCode, err.message);
    }
});

// POST /api/counterfactual (Interactive "What-If" Counterfactual Engine)
router.post('/counterfactual', (req, res) => {
    try {
        const { current_inputs = {}, target_crop } = req.body;
        if (!target_crop) {
            return errorRes(res, 'target_crop is required', 400);
        }
        const result = computeCounterfactual(current_inputs, target_crop);
        return success(res, result);
    } catch (err) {
        console.error('Error in /counterfactual:', err.message);
        return errorRes(res, 'Counterfactual computation failed', 500, err.message);
    }
});

module.exports = router;
