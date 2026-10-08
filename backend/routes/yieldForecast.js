const express = require('express');
const router = express.Router();
const { 
  calculateEconomics, 
  CROP_ECONOMIC_DATA,
  getLiveMandiPrices,
  getHarvestHorizonForecast 
} = require('../services/agriEconomicsService');

// POST /api/yield-forecast
router.post('/yield-forecast', (req, res) => {
  try {
    const {
      crop = 'rice',
      land_area_acres = 1,
      soil_type = 'Loamy',
      rainfall_level = 'Medium',
      season = 'Kharif',
      fertilizer_used = true,
      state = 'Telangana',
      district = 'Warangal'
    } = req.body;

    const acres = parseFloat(land_area_acres) || 1;
    const econ = calculateEconomics({
      crop,
      landAreaAcres: acres,
      soilType: soil_type,
      rainfallLevel: rainfall_level
    });

    const normalizedKey = (crop || 'rice').toLowerCase().replace(/\s+\(.*?\)/g, '').trim();
    const rawData = CROP_ECONOMIC_DATA[normalizedKey] || CROP_ECONOMIC_DATA.rice;

    const revenueValue = econ.grossRevenue;
    const costValue = econ.inputCost;
    const profitValue = econ.netProfit;

    // Monthly price trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const basePrice = econ.avgMarketPrice;
    const priceTrend = months.map(month => ({
      month,
      price: econ.bestMonths.includes(month)
        ? Math.round(basePrice * 1.15)
        : Math.round(basePrice * 0.92)
    }));

    // Hyper-Local Real-Time Integrations: Live Mandi Rates & Short-Term Harvest Horizon Forecast
    const liveMandi = getLiveMandiPrices({ crop, state, district });
    const harvestHorizons = getHarvestHorizonForecast({
      crop,
      totalYield: econ.totalYield,
      basePrice: econ.avgMarketPrice
    });

    res.json({
      success: true,
      data: {
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        land_area_acres: acres,
        soil_type,
        rainfall_level,
        season,
        fertilizer_used,
        expected_yield_per_acre: econ.yieldPerAcre,
        yield_unit: econ.unit,
        total_yield: econ.totalYield,
        market_prices: {
          min: rawData.marketPriceRange ? rawData.marketPriceRange[0] : 1800,
          max: rawData.marketPriceRange ? rawData.marketPriceRange[1] : 2600,
          avg: econ.avgMarketPrice,
          msp: rawData.msp,
          unit: '₹ per quintal'
        },
        estimated_revenue: `₹${revenueValue.toLocaleString('en-IN')}`,
        estimated_cost: `₹${costValue.toLocaleString('en-IN')}`,
        net_profit: `₹${profitValue.toLocaleString('en-IN')}`,
        profit_value: profitValue,
        revenue_value: revenueValue,
        cost_value: costValue,
        best_selling_months: econ.bestMonths,
        price_trend: econ.trend,
        price_trend_chart: priceTrend,
        market_advice: econ.advice,
        live_mandi: liveMandi,
        harvest_horizons: harvestHorizons
      }
    });
  } catch (err) {
    console.error('Yield forecast error:', err.message);
    res.status(500).json({ success: false, message: 'Error generating forecast' });
  }
});

// GET /api/mandi-prices (Query live district APMC rates)
router.get('/mandi-prices', (req, res) => {
  try {
    const { crop = 'Rice', state = 'Telangana', district = 'Warangal' } = req.query;
    const mandiData = getLiveMandiPrices({ crop, state, district });
    res.json({ success: true, data: mandiData });
  } catch (err) {
    console.error('Mandi prices query error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching mandi rates' });
  }
});

module.exports = router;
