const express = require('express');
const router = express.Router();
const { success, error: errorRes } = require('../utils/response');
const { 
    calculateEconomics,
    getLiveMandiPrices,
    getHarvestHorizonForecast
} = require('../services/agriEconomicsService');

router.post('/revenue-prediction', (req, res) => {
    try {
        const { crop, soil_type, rainfall_level, land_area_acres, soil_quality, state = 'Telangana', district = 'Warangal' } = req.body;
        const area = parseFloat(land_area_acres) || 1;

        const econ = calculateEconomics({
            crop,
            landAreaAcres: area,
            soilType: soil_type,
            rainfallLevel: rainfall_level,
            soilQuality: soil_quality
        });

        const liveMandi = getLiveMandiPrices({ crop, state, district });
        const harvestHorizons = getHarvestHorizonForecast({
            crop,
            totalYield: econ.totalYield,
            basePrice: econ.avgMarketPrice
        });

        return success(res, {
            crop_used: econ.cropUsed,
            estimated_yield: econ.totalYield,
            gross_revenue: econ.grossRevenue,
            input_cost: econ.inputCost,
            net_profit: econ.netProfit,
            profit_per_acre: econ.profitPerAcre,
            msp_used: econ.mspUsed,
            roi_percentage: econ.roiPercentage,
            revenue_range: {
                optimistic: econ.revenueRange.optimistic,
                realistic: econ.revenueRange.realistic,
                conservative: econ.revenueRange.pessimistic
            },
            yield_breakdown: [
                { factor: "Estimated Yield", value: `${econ.yieldPerAcre} ${econ.unit}` },
                { factor: "Land Area", value: `${area} Acres` },
                { factor: "Benchmarked Cost", value: `₹${econ.costPerAcre}/acre` },
                { factor: "Benchmark Rate", value: `₹${econ.mspUsed}/qtl` }
            ],
            live_mandi: liveMandi,
            harvest_horizons: harvestHorizons,
            disclaimer: "Figures are calculated using official CACP/MSP benchmarks & standardized input costs. Actual market realization may fluctuate with APMC mandi arrivals."
        });

    } catch (err) {
        console.error('Error calculating revenue:', err.message);
        return errorRes(res, 'Revenue calculation failure', 500, err.message);
    }
});

module.exports = router;
