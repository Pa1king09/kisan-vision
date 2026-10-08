const express = require('express');
const router = express.Router();
const axios = require('axios');
const { success, error: errorRes } = require('../utils/response');

// ... constants and functions remain same ...
const CLIMATE_CROP_MAP = {
    "tropical": ["rice", "banana", "coconut", "papaya", "coffee", "jute", "rubber", "tea", "mango", "pomegranate"],
    "semi_arid": ["cotton", "pigeonpeas", "maize", "sorghum", "millets", "groundnut", "sunflower", "soybean", "castor"],
    "temperate": ["apple", "grapes", "orange", "pear", "peach", "cherry", "plum", "walnut", "almond", "wheat", "barley"],
    "arid": ["date palm", "cactus", "agave", "jojoba", "moongbean"]
};

const WMO_CODES = {
    0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
    45: 'foggy', 48: 'depositing rime fog',
    51: 'light drizzle', 53: 'moderate drizzle', 55: 'dense drizzle',
    61: 'slight rain', 63: 'moderate rain', 65: 'heavy rain',
    71: 'slight snow fall', 73: 'moderate snow fall', 75: 'heavy snow fall',
    80: 'light showers', 81: 'moderate showers', 82: 'heavy showers',
    95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with heavy hail'
};

function determineClimateZone(temperature, rainfall) {
    if (temperature > 28 && rainfall > 150) return 'tropical';
    if (temperature > 30 && rainfall < 50) return 'arid';
    if (temperature < 22) return 'temperate';
    return 'semi_arid';
}

function getCurrentSeason() {
    const month = new Date().getMonth() + 1; 
    if (month >= 3 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 9) return 'Monsoon';
    if (month >= 10 && month <= 11) return 'Post-Monsoon';
    return 'Winter';
}

// ROUTE 1: Get weather
router.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return errorRes(res, 'Latitude and longitude are required', 400);
    }

    try {
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code` +
            `&daily=precipitation_sum&timezone=auto&forecast_days=1`,
            { timeout: 10000 }
        );
        const d = weatherRes.data;
        const temperature = d.current.temperature_2m;
        const apparent_temperature = d.current.apparent_temperature;
        const humidity = d.current.relative_humidity_2m;

        const rainfall = Math.round((d.daily?.precipitation_sum?.[0] ?? d.current.precipitation ?? 0) * 10) / 10;
        const weather_description = WMO_CODES[d.current.weather_code] || 'clear sky';

        let city = 'Your Location';
        let country = 'IN';
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' }, timeout: 6000 }
            );
            const addr = revGeo.data?.address || {};
            city = addr.city || addr.town || addr.municipality || addr.city_district || addr.suburb || addr.village || addr.hamlet || addr.county || addr.state_district || addr.state || 'Your Location';
            country = (addr.country_code || 'in').toUpperCase();
        } catch (geoErr) {
            console.warn('[Geocode] Reverse geocoding failed:', geoErr.message);
        }

        const climateZone = determineClimateZone(temperature, rainfall);
        const season = getCurrentSeason();

        return success(res, {
            temperature: Math.round(temperature * 10) / 10,
            apparent_temperature: apparent_temperature != null ? Math.round(apparent_temperature * 10) / 10 : null,
            humidity,
            rainfall,
            climate_zone: climateZone,
            season,
            suitable_crops: CLIMATE_CROP_MAP[climateZone] || [],
            location: { city, country },
            weather_description
        });
    } catch (err) {
        console.error('[Weather] API error:', err.message);
        const season = getCurrentSeason();
        return success(res, {
            temperature: null,
            apparent_temperature: null,
            humidity: null,
            rainfall: 0,
            climate_zone: 'semi_arid',
            season,
            suitable_crops: CLIMATE_CROP_MAP['semi_arid'],
            location: { city: 'Unknown', country: 'IN' },
            weather_description: 'unavailable',
            is_fallback: true
        });
    }
});

// ============================================
// ROUTE 2: Geocode address → coordinates
// Uses Nominatim / OpenStreetMap (free, no API key)
// 5-strategy multi-attempt approach for Indian districts
// ============================================
router.get('/geocode', async (req, res) => {
    const { state, district, village } = req.query;
    if (!state && !district && !village) {
        return res.status(400).json({ error: 'At least one of state, district, or village is required' });
    }

    const HEADERS = { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' };

    // Prefer district-level administrative boundaries over talukas/villages
    const pickBest = (results) => {
        if (!results || results.length === 0) return null;
        const admins = results.filter(r => r.class === 'boundary' && r.type === 'administrative');
        if (admins.length > 0) {
            // admin_level 5 or 6 = district in India; prefer that over subdistrict (7/8)
            const districtLevel = admins.find(r => parseInt(r.admin_level) <= 6);
            return districtLevel || admins[0];
        }
        return results[0];
    };

    // Helper: call Nominatim search with given params
    const nominatim = async (params, timeout = 9000) => {
        const qs = new URLSearchParams({
            format: 'json', limit: '5', addressdetails: '1', countrycodes: 'in', ...params
        }).toString();
        const r = await axios.get(`https://nominatim.openstreetmap.org/search?${qs}`, { headers: HEADERS, timeout });
        return r.data || [];
    };

    try {
        let best = null;
        const tried = [];

        // Strategy 1: Nominatim structured params (county = district, state = state)
        if (district && state) {
            tried.push('structured');
            const r1 = await nominatim({ county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r1);
            if (!best) {
                // Add "District" suffix — common in OSM data for Indian districts
                const r2 = await nominatim({ county: `${district} District`, state, country: 'India' }).catch(() => []);
                best = pickBest(r2);
            }
        }

        // Strategy 2: Structured with village/city included
        if (!best && village && (district || state)) {
            tried.push('structured-village');
            const r = await nominatim({ city: village, county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 3: Free-text with "District" keyword appended
        if (!best && district) {
            tried.push('freetext-district-suffix');
            const q = [village, `${district} District`, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 4: Plain free-text (original approach)
        if (!best) {
            tried.push('freetext-plain');
            const q = [village, district, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 5: State-only last resort
        if (!best && state) {
            tried.push('state-only');
            const r = await nominatim({ state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }

        console.log(`[Geocode] strategies: ${tried.join('→')} | result: ${best ? best.display_name : 'NOT FOUND'}`);

        if (!best) {
            console.warn(`[Geocode] Location not found for strategies: ${tried.join('→')}. Using fallback.`);
            throw new Error('Location not found in Nominatim');
        }

        res.json({
            latitude: parseFloat(best.lat),
            longitude: parseFloat(best.lon),
            formatted_address: best.display_name,
            state, district, village
        });
    } catch (err) {
        console.error('[Geocode] Error:', err.message);
        res.json({ latitude: 20.5937, longitude: 78.9629, formatted_address: 'India (fallback)', is_fallback: true });
    }
});

// ============================================
// ROUTE 3: Soil data from SoilGrids API + Geographical Mapping
// ============================================

const STATE_SOIL_MAP = {
    'maharashtra': 'Black',
    'gujarat': 'Black',
    'madhya pradesh': 'Black',
    'karnataka': 'Red',
    'andhra pradesh': 'Red',
    'telangana': 'Black',
    'tamil nadu': 'Red',
    'odisha': 'Red',
    'chhattisgarh': 'Red',
    'jharkhand': 'Red',
    'uttar pradesh': 'Alluvial',
    'punjab': 'Alluvial',
    'haryana': 'Alluvial',
    'bihar': 'Alluvial',
    'west bengal': 'Alluvial',
    'assam': 'Alluvial',
    'rajasthan': 'Sandy',
    'kerala': 'Loamy', // Laterite usually, but Loamy is a safe ML substitute
    'uttarakhand': 'Loamy',
    'himachal pradesh': 'Loamy'
};

router.get('/soil', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        let soilType = 'Loamy'; // base fallback
        let ph = 7.0;
        let nitrogen = 0.5;

        // 1. Geography-based soil mapping (Primary for Indian regions)
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (soil map)' }, timeout: 5000 }
            );
            const state = revGeo.data?.address?.state?.toLowerCase();
            if (state) {
                // Find matching state in our map
                const matchedState = Object.keys(STATE_SOIL_MAP).find(k => state.includes(k));
                if (matchedState) {
                    soilType = STATE_SOIL_MAP[matchedState];
                    console.log(`[Soil Map] Geography matched: ${state} -> ${soilType} Soil`);
                }
            }
        } catch (geoErr) {
            console.warn('[Soil Map] Geocoding for soil failed:', geoErr.message);
        }

        // 2. SoilGrids API for pH, Nitrogen, and fallback texture
        try {
            const soilRes = await axios.get(
                `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}&depths=0-30cm&properties=clay,silt,sand,phh2o,cec,nitrogen`,
                { timeout: 7000 }
            );
            const data = soilRes.data;

            if (data.properties?.phh2o) {
                const phVals = data.properties.phh2o?.layers?.[0]?.values;
                if (phVals) {
                    const vals = Object.values(phVals);
                    ph = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
                }
            }

            if (data.properties?.nitrogen) {
                const nVals = data.properties.nitrogen?.layers?.[0]?.values;
                if (nVals) nitrogen = Object.values(nVals).reduce((a, b) => a + b, 0) / Object.values(nVals).length;
            }

            // Only use SoilGrids texture if geographic mapping failed
            if (soilType === 'Loamy' && data.properties?.clay && data.properties?.sand) {
                const clayVals = data.properties.clay?.layers?.[0]?.values;
                const sandVals = data.properties.sand?.layers?.[0]?.values;
                if (clayVals && sandVals) {
                    const clay = Object.values(clayVals).reduce((a, b) => a + b, 0) / Object.values(clayVals).length;
                    const sand = Object.values(sandVals).reduce((a, b) => a + b, 0) / Object.values(sandVals).length;
                    if (clay > 40) soilType = 'Clay';
                    else if (sand > 60) soilType = 'Sandy';
                }
            }
        } catch (sgErr) {
            console.warn('[Soil Map] SoilGrids API failed, using geographic/fallback:', sgErr.message);
        }

        res.json({
            soil_type: soilType,
            ph, nitrogen: Math.round(nitrogen * 100) / 100,
            depth: '0-30cm'
        });
    } catch (err) {
        console.error('Soil API master error:', err.message);
        res.json({ soil_type: 'Loamy', ph: 7.0, nitrogen: 0.5, depth: '0-30cm', is_fallback: true });
    }
});

// ============================================
// ROUTE 4: Climate-based crop filter
// ============================================
router.post('/filter-crops', (req, res) => {
    try {
        const { crops, temperature, rainfall } = req.body;
        if (!crops || !Array.isArray(crops)) {
            return res.status(400).json({ error: 'Crops array is required' });
        }

        const climateZone = determineClimateZone(temperature || 25, rainfall || 100);
        const suitableCrops = CLIMATE_CROP_MAP[climateZone] || [];
        const filteredCrops = crops.filter(crop =>
            suitableCrops.some(s =>
                crop.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(crop.toLowerCase())
            )
        );

        res.json({
            original_crops: crops,
            filtered_crops: filteredCrops.length > 0 ? filteredCrops : crops,
            climate_zone: climateZone,
            suitable_crops: suitableCrops
        });
    } catch (err) {
        console.error('Filter error:', err.message);
        res.status(500).json({ error: 'Failed to filter crops' });
    }
});

// ============================================
// ROUTE 5: Comprehensive Agro-Weather Alerts & 7-Day Advisory
// ============================================
router.get('/weather/alerts', async (req, res) => {
    let { lat = 17.9784, lon = 79.5941, crop = 'Rice' } = req.query;
    lat = parseFloat(lat) || 17.9784;
    lon = parseFloat(lon) || 79.5941;

    try {
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
            `&timezone=auto&forecast_days=7`,
            { timeout: 10000 }
        );

        const d = weatherRes.data;
        const currentTemp = Math.round(d.current.temperature_2m * 10) / 10;
        const currentHumidity = d.current.relative_humidity_2m;
        const currentWind = Math.round(d.current.wind_speed_10m * 10) / 10;
        const currentWeather = WMO_CODES[d.current.weather_code] || 'Clear';

        const daily = d.daily || {};
        const maxTemps = daily.temperature_2m_max || [];
        const minTemps = daily.temperature_2m_min || [];
        const rainSums = daily.precipitation_sum || [];
        const rainProbs = daily.precipitation_probability_max || [];
        const windMaxs = daily.wind_speed_10m_max || [];
        const uvMaxs = daily.uv_index_max || [];
        const weatherCodes = daily.weather_code || [];
        const dates = daily.time || [];

        // 1. Severe Weather Alerts Engine
        const severeAlerts = [];
        const maxExpectedTemp = Math.max(...maxTemps, currentTemp);
        const minExpectedTemp = Math.min(...minTemps);
        const maxRainDay = Math.max(...rainSums, 0);
        const totalRain7Days = rainSums.reduce((a, b) => a + b, 0);
        const maxWindExpected = Math.max(...windMaxs, currentWind);

        if (maxExpectedTemp >= 40) {
            severeAlerts.push({
                id: 'heatwave',
                level: 'Critical',
                title: '🔥 Extreme Heatwave Warning',
                description: `Temperatures projected to reach ${maxExpectedTemp}°C. High risk of pollen sterility, leaf scorch, and severe evapotranspiration.`,
                action: 'Provide frequent light irrigation during evening/early morning. Avoid nitrogen application during peak heat.'
            });
        } else if (maxExpectedTemp >= 36) {
            severeAlerts.push({
                id: 'moderate_heat',
                level: 'Warning',
                title: '☀️ High Temperature Advisory',
                description: `Peak temperatures around ${maxExpectedTemp}°C. Soil moisture will deplete rapidly.`,
                action: 'Ensure adequate mulch on soil surface and maintain irrigation schedule.'
            });
        }

        if (maxRainDay >= 45) {
            severeAlerts.push({
                id: 'heavy_flood',
                level: 'Critical',
                title: '🌊 Heavy Rainfall & Waterlogging Alert',
                description: `Intense downpour predicted (${maxRainDay} mm/day). High danger of root asphyxiation and standing water damage.`,
                action: 'Clear farm drainage channels immediately. Do not apply chemical fertilizers or spray pesticides before rain.'
            });
        } else if (maxRainDay >= 25) {
            severeAlerts.push({
                id: 'moderate_rain',
                level: 'Warning',
                title: '🌧️ Moderate Rainfall Expected',
                description: `Significant rain (~${maxRainDay} mm) forecast in coming days.`,
                action: 'Postpone irrigation. Ensure bunds are reinforced to harvest rainwater safely.'
            });
        }

        if (minExpectedTemp <= 5) {
            severeAlerts.push({
                id: 'frost',
                level: 'Critical',
                title: '❄️ Frost / Cold Wave Alert',
                description: `Night temperatures dropping to ${minExpectedTemp}°C. Risk of cell rupture and frost bite on tender vegetative growth.`,
                action: 'Irrigate fields lightly before sunset to keep soil warm. Create light smoke around field perimeter during early dawn.'
            });
        }

        if (maxWindExpected >= 35) {
            severeAlerts.push({
                id: 'high_wind',
                level: 'Warning',
                title: '💨 High Wind & Storm Advisory',
                description: `Wind gusts up to ${maxWindExpected} km/h expected. Risk of crop lodging (falling) in tall crops like Maize, Sugarcane, and Paddy.`,
                action: 'Stake tall plants/vegetables. Delay overhead sprinkler irrigation and avoid spraying.'
            });
        }

        if (totalRain7Days < 2 && currentHumidity < 30) {
            severeAlerts.push({
                id: 'dry_spell',
                level: 'Warning',
                title: '☀️ Extended Dry Spell & Low Humidity',
                description: `Humidity is down to ${currentHumidity}% with negligible rain for 7 days. High water deficit.`,
                action: 'Run drip irrigation. Apply anti-transpirants or kaolin clay spray on fruit/vegetable foliage if applicable.'
            });
        }

        if (severeAlerts.length === 0) {
            severeAlerts.push({
                id: 'favorable',
                level: 'Favorable',
                title: '✅ Favorable Weather Conditions',
                description: 'Temperature, moisture, and wind speeds are within normal agronomic thresholds for your region.',
                action: 'Carry out planned routine farm activities and field operations normally.'
            });
        }

        // 2. Crop-Specific Agronomic Warnings
        const cropLower = crop.toLowerCase();
        let cropAdvisory = {};

        if (cropLower.includes('rice') || cropLower.includes('paddy')) {
            cropAdvisory = {
                crop: 'Rice (Paddy)',
                risk_level: currentHumidity > 85 ? 'High (Blast Risk)' : currentHumidity < 40 ? 'Moderate (Moisture Stress)' : 'Normal',
                warnings: currentHumidity > 85 
                    ? ['Continuous high humidity (>85%) combined with cloud cover creates ideal conditions for Rice Blast and Brown Spot fungal spores. Inspect leaves for spindle lesions.', 'Avoid excessive urea top-dressing which makes leaves succulent to blast fungus.']
                    : currentHumidity < 40
                    ? ['Low relative humidity accelerates panicle drying and moisture stress during tillering.', 'Maintain a standing water level of at least 3–5 cm in paddy basins.']
                    : ['Favorable conditions for tillering and canopy development.', 'Maintain standard intermittent drying and wetting (AWD) water regime.']
            };
        } else if (cropLower.includes('cotton')) {
            cropAdvisory = {
                crop: 'Cotton',
                risk_level: maxRainDay > 30 ? 'High (Boll Rot)' : maxExpectedTemp > 38 ? 'High (Flower Shedding)' : 'Normal',
                warnings: maxRainDay > 30
                    ? ['Rain during flowering or boll formation causes flower drop and boll rot.', 'Ensure field furrows drain surplus water rapidly.']
                    : maxExpectedTemp > 38
                    ? ['Temperatures above 38°C cause square and boll shedding. Maintain soil moisture through alternate furrow irrigation.', 'Look out for whitefly and thrips multiplication during dry heat.']
                    : ['Good weather for boll development. Monitor for pink bollworm traps.']
            };
        } else if (cropLower.includes('tomato') || cropLower.includes('potato')) {
            cropAdvisory = {
                crop: cropLower.includes('tomato') ? 'Tomato' : 'Potato',
                risk_level: currentHumidity > 80 && currentTemp < 28 ? 'Critical (Late Blight)' : 'Normal',
                warnings: currentHumidity > 80 && currentTemp < 28
                    ? ['Danger: High humidity + moderate temperatures (18–26°C) trigger rapid Late Blight epidemic.', 'Spray preventive Mancozeb 75% WP (2g/L) immediately before rains. Avoid overhead sprinkler irrigation.']
                    : ['Normal conditions. Ensure proper staking and pruning of lower leaves touching damp soil.']
            };
        } else if (cropLower.includes('wheat')) {
            cropAdvisory = {
                crop: 'Wheat',
                risk_level: maxExpectedTemp > 32 ? 'High (Terminal Heat)' : minExpectedTemp < 7 ? 'Watch (Yellow Rust)' : 'Normal',
                warnings: maxExpectedTemp > 32
                    ? ['Terminal heat above 32°C during grain filling forces early maturity, causing shriveled grains.', 'Give light irrigation in evening hours to cool microclimate.']
                    : ['Weather is suitable for vegetative tillering and crown root development.']
            };
        } else {
            cropAdvisory = {
                crop: crop,
                risk_level: 'Moderate',
                warnings: [
                    `Current temperature is ${currentTemp}°C with ${currentHumidity}% humidity.`,
                    'Inspect field weekly for pest resurgence following sudden weather changes.'
                ]
            };
        }

        // 3. Pesticide Spray Window Index
        let sprayStatus = 'Optimal';
        let sprayColor = '#10B981';
        let sprayReason = 'Wind speed is below 12 km/h and rain probability is low. Excellent condition for foliar spray.';

        if (rainProbs[0] > 40 || rainSums[0] > 5) {
            sprayStatus = 'Do Not Spray';
            sprayColor = '#EF4444';
            sprayReason = `High chance of rain today (${rainProbs[0]}% probability). Chemicals will wash off before absorption.`;
        } else if (currentWind > 18) {
            sprayStatus = 'Unfavorable';
            sprayColor = '#F59E0B';
            sprayReason = `Wind speed is high (${currentWind} km/h). Spray droplets will drift away from target foliage.`;
        } else if (currentTemp > 35) {
            sprayStatus = 'Morning Only';
            sprayColor = '#FBBF24';
            sprayReason = `Afternoon temperature is high (${currentTemp}°C). Spray only between 6:00 AM – 9:00 AM to prevent leaf burn.`;
        }

        // 4. 7-Day Forecast Array
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecast7Days = dates.map((dateStr, idx) => {
            const dt = new Date(dateStr);
            const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : days[dt.getDay()];
            return {
                day: dayName,
                date: dateStr,
                max_temp: Math.round(maxTemps[idx]),
                min_temp: Math.round(minTemps[idx]),
                rain_sum: Math.round(rainSums[idx] * 10) / 10,
                rain_prob: rainProbs[idx] || 0,
                wind_speed: Math.round(windMaxs[idx]),
                uv_index: uvMaxs[idx] || 5,
                weather_desc: WMO_CODES[weatherCodes[idx]] || 'Partly Cloudy'
            };
        });

        // 5. Reverse geocoding for city
        let locationName = 'Your Farm Location';
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0' }, timeout: 4000 }
            );
            const addr = revGeo.data?.address || {};
            locationName = addr.city || addr.town || addr.village || addr.state_district || addr.state || 'Your Farm Location';
        } catch {}

        res.json({
            success: true,
            data: {
                location: locationName,
                coordinates: { lat, lon },
                current: {
                    temperature: currentTemp,
                    feels_like: Math.round(d.current.apparent_temperature * 10) / 10,
                    humidity: currentHumidity,
                    wind_speed: currentWind,
                    weather_description: currentWeather
                },
                severe_alerts: severeAlerts,
                crop_advisory: cropAdvisory,
                spray_index: {
                    status: sprayStatus,
                    color: sprayColor,
                    reason: sprayReason,
                    wind_speed: `${currentWind} km/h`,
                    rain_probability: `${rainProbs[0] || 0}%`
                },
                forecast_7days: forecast7Days
            }
        });
    } catch (err) {
        console.error('Weather Alerts API error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch weather alerts' });
    }
});

module.exports = router;

