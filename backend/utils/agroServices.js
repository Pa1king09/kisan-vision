const axios = require('axios');

// Lightweight in-memory cache
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getCacheKey = (prefix, params) => `${prefix}_${Object.values(params).join('_')}`;

const getFromCache = (key) => {
    const item = cache.get(key);
    if (item && Date.now() < item.expiry) {
        return item.data;
    }
    if (item) cache.delete(key);
    return null;
};

const setCache = (key, data) => {
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
};

// --- Shared Constants ---
const CLIMATE_CROP_MAP = {
    "tropical": ["rice", "banana", "coconut", "papaya", "coffee", "jute", "rubber", "tea", "mango", "pomegranate"],
    "semi_arid": ["cotton", "pigeonpeas", "maize", "sorghum", "millets", "groundnut", "sunflower", "soybean", "castor"],
    "temperate": ["apple", "grapes", "orange", "pear", "peach", "cherry", "plum", "walnut", "almond", "wheat", "barley"],
    "arid": ["date palm", "cactus", "agave", "jojoba", "moongbean"]
};

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
    'kerala': 'Loamy',
    'uttarakhand': 'Loamy',
    'himachal pradesh': 'Loamy'
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

const getGeocode = async (state, district, village) => {
    const key = getCacheKey('geo', { state, district, village });
    const cached = getFromCache(key);
    if (cached) return cached;

    const HEADERS = { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' };

    const pickBest = (results) => {
        if (!results || results.length === 0) return null;
        const admins = results.filter(r => r.class === 'boundary' && r.type === 'administrative');
        if (admins.length > 0) {
            const districtLevel = admins.find(r => parseInt(r.admin_level) <= 6);
            return districtLevel || admins[0];
        }
        return results[0];
    };

    const nominatim = async (params, timeout = 9000) => {
        const qs = new URLSearchParams({
            format: 'json', limit: '5', addressdetails: '1', countrycodes: 'in', ...params
        }).toString();
        const r = await axios.get(`https://nominatim.openstreetmap.org/search?${qs}`, { headers: HEADERS, timeout });
        return r.data || [];
    };

    try {
        let best = null;
        if (district && state) {
            const r1 = await nominatim({ county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r1);
            if (!best) {
                const r2 = await nominatim({ county: `${district} District`, state, country: 'India' }).catch(() => []);
                best = pickBest(r2);
            }
        }
        if (!best && village && (district || state)) {
            const r = await nominatim({ city: village, county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }
        if (!best && district) {
            const q = [village, `${district} District`, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }
        if (!best) {
            const q = [village, district, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }
        if (!best && state) {
            const r = await nominatim({ state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }

        if (!best) throw new Error('Location not found in Nominatim');

        const result = {
            latitude: parseFloat(best.lat),
            longitude: parseFloat(best.lon),
            formatted_address: best.display_name,
            state, district, village
        };
        setCache(key, result);
        return result;
    } catch (err) {
        console.error('[Geocode] Error:', err.message);
        return { latitude: 20.5937, longitude: 78.9629, formatted_address: 'India (fallback)', is_fallback: true };
    }
};

const getWeather = async (lat, lon) => {
    // Round to 2 decimal places to increase cache hits for nearby requests
    const rLat = parseFloat(lat).toFixed(2);
    const rLon = parseFloat(lon).toFixed(2);
    const key = getCacheKey('weather', { rLat, rLon });
    const cached = getFromCache(key);
    if (cached) return cached;

    try {
        // Advanced ML enhancement: Fetching 14-day forecast to get a more accurate seasonal average, 
        // plus elevation for future model enhancements.
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${rLat}&longitude=${rLon}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code` +
            `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=14`,
            { timeout: 10000 }
        );
        const d = weatherRes.data;
        
        // Use 14-day average for more stable predictions instead of single-day
        const dailyTempsMax = d.daily?.temperature_2m_max || [];
        const dailyTempsMin = d.daily?.temperature_2m_min || [];
        const dailyPrecip = d.daily?.precipitation_sum || [];
        
        let avgTemp = d.current.temperature_2m;
        if (dailyTempsMax.length > 0) {
            const maxAvg = dailyTempsMax.reduce((a, b) => a + b, 0) / dailyTempsMax.length;
            const minAvg = dailyTempsMin.reduce((a, b) => a + b, 0) / dailyTempsMin.length;
            avgTemp = (maxAvg + minAvg) / 2;
        }
        
        let totalRainfall14Days = dailyPrecip.reduce((a, b) => a + b, 0);
        let avgDailyRainfall = totalRainfall14Days / (dailyPrecip.length || 1);
        
        // For compatibility with old system that expected "daily" rainfall logic in soil_mapper
        const rainfall = Math.round(avgDailyRainfall * 10) / 10;
        const temperature = Math.round(avgTemp * 10) / 10;
        
        const apparent_temperature = d.current.apparent_temperature;
        const humidity = d.current.relative_humidity_2m;
        const elevation = d.elevation || 0;
        const weather_description = WMO_CODES[d.current.weather_code] || 'clear sky';

        let city = 'Your Location';
        let country = 'IN';
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${rLat}&lon=${rLon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' }, timeout: 6000 }
            );
            const addr = revGeo.data?.address || {};
            city = addr.city || addr.town || addr.municipality || addr.city_district || addr.suburb || addr.village || addr.hamlet || addr.county || addr.state_district || addr.state || 'Your Location';
            country = (addr.country_code || 'in').toUpperCase();
        } catch (geoErr) {}

        const climateZone = determineClimateZone(temperature, rainfall);
        const season = getCurrentSeason();

        const result = {
            temperature,
            apparent_temperature: apparent_temperature != null ? Math.round(apparent_temperature * 10) / 10 : null,
            humidity,
            rainfall,
            elevation,
            climate_zone: climateZone,
            season,
            suitable_crops: CLIMATE_CROP_MAP[climateZone] || [],
            location: { city, country },
            weather_description
        };
        setCache(key, result);
        return result;
    } catch (err) {
        console.error('[Weather] API error:', err.message);
        return {
            temperature: null, apparent_temperature: null, humidity: null,
            rainfall: 0, elevation: 0, climate_zone: 'semi_arid', season: getCurrentSeason(),
            suitable_crops: CLIMATE_CROP_MAP['semi_arid'],
            location: { city: 'Unknown', country: 'IN' }, weather_description: 'unavailable', is_fallback: true
        };
    }
};

const getSoil = async (lat, lon) => {
    const rLat = parseFloat(lat).toFixed(2);
    const rLon = parseFloat(lon).toFixed(2);
    const key = getCacheKey('soil', { rLat, rLon });
    const cached = getFromCache(key);
    if (cached) return cached;

    try {
        let soilType = 'Loamy';
        let ph = 7.0;
        let nitrogen = 0.5;

        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${rLat}&lon=${rLon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (soil map)' }, timeout: 5000 }
            );
            const state = revGeo.data?.address?.state?.toLowerCase();
            if (state) {
                const matchedState = Object.keys(STATE_SOIL_MAP).find(k => state.includes(k));
                if (matchedState) soilType = STATE_SOIL_MAP[matchedState];
            }
        } catch (geoErr) {}

        try {
            const soilRes = await axios.get(
                `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lat=${rLat}&lon=${rLon}&depths=0-30cm&properties=clay,silt,sand,phh2o,cec,nitrogen`,
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
        } catch (sgErr) {}

        const result = { soil_type: soilType, ph, nitrogen: Math.round(nitrogen * 100) / 100, depth: '0-30cm' };
        setCache(key, result);
        return result;
    } catch (err) {
        return { soil_type: 'Loamy', ph: 7.0, nitrogen: 0.5, depth: '0-30cm', is_fallback: true };
    }
};

const filterCrops = (crops, temperature, rainfall) => {
    const climateZone = determineClimateZone(temperature || 25, rainfall || 100);
    const suitableCrops = CLIMATE_CROP_MAP[climateZone] || [];
    const filteredCrops = crops.filter(crop =>
        suitableCrops.some(s =>
            crop.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(crop.toLowerCase())
        )
    );
    return {
        original_crops: crops,
        filtered_crops: filteredCrops.length > 0 ? filteredCrops : crops,
        climate_zone: climateZone,
        suitable_crops: suitableCrops
    };
};

module.exports = {
    getGeocode,
    getWeather,
    getSoil,
    filterCrops,
    determineClimateZone,
    getCurrentSeason,
    CLIMATE_CROP_MAP,
    WMO_CODES
};
