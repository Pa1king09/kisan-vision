const express = require('express');
const router = express.Router();

// ─────────────────────────────────────────────
// Offline Farming Knowledge Base
// Used when no GROQ_API_KEY is configured
// ─────────────────────────────────────────────
const FARMING_KB = [
    {
        keywords: ['soil health', 'improve soil', 'soil naturally', 'healthy soil', 'soil quality'],
        answer: `To improve soil health naturally:\n- **Add organic matter**: compost, vermicompost, or farm yard manure (FYM) at 5–10 tonnes/hectare.\n- **Crop rotation**: alternate legumes (dal, groundnut) to fix nitrogen.\n- **Green manuring**: grow Dhaincha or Sunhemp and plough them back.\n- **Avoid over-tilling** to preserve beneficial soil microbes.\n- **Mulching** with crop residue retains moisture and feeds soil organisms.`
    },
    {
        keywords: ['fertilizer', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'urea', 'dap'],
        answer: `Fertilizer tips for Indian farming:\n- Use the **NPK ratio** recommended for your crop (e.g., Rice: 120:60:60 kg/ha).\n- Apply **Urea (46% N)** in split doses — half at sowing, half at tillering.\n- **DAP (Di-ammonium Phosphate)** provides both N and P; apply at sowing.\n- Conduct a **soil test** (KVK or soil lab) to avoid over-fertilization.\n- Organic alternatives: vermicompost, neem cake, bone meal.`
    },
    {
        keywords: ['pest', 'insect', 'disease', 'fungal', 'blight', 'aphid', 'whitefly', 'caterpillar', 'worm'],
        answer: `Integrated Pest Management (IPM):\n- **Monitor regularly** — check plants twice a week.\n- Use **neem oil spray** (5 ml/litre) for soft-bodied insects like aphids & whiteflies.\n- **Yellow sticky traps** for whiteflies and thrips.\n- For fungal blight, spray **Mancozeb or Copper Oxychloride** (2 g/litre).\n- Biological control: release **Trichogramma cards** for stem borer in rice.\n- Follow label instructions for chemical pesticides and maintain safety gap before harvest.`
    },
    {
        keywords: ['irrigation', 'water', 'drip', 'sprinkler', 'watering'],
        answer: `Irrigation best practices:\n- **Drip irrigation** saves 40–60% water — ideal for vegetables, cotton, sugarcane.\n- **Sprinkler** is good for groundnut, wheat, and pulses.\n- Rice uses **Alternate Wetting and Drying (AWD)** — saves 30% water with no yield loss.\n- Water in **early morning or evening** to reduce evaporation.\n- Check soil moisture before irrigating — insert finger 5 cm into soil; if dry, irrigate.`
    },
    {
        keywords: ['kharif', 'monsoon crop', 'paddy', 'rice', 'cotton', 'maize', 'soybean'],
        answer: `Kharif season (June–October):\n- Major crops: **Rice, Cotton, Maize, Soybean, Groundnut, Bajra, Jowar**.\n- Sow after first good monsoon rain (June–July).\n- Ensure field drainage to prevent waterlogging.\n- Apply basal fertilizer at sowing; top-dress during active growth.`
    },
    {
        keywords: ['rabi', 'winter crop', 'wheat', 'mustard', 'chickpea', 'gram'],
        answer: `Rabi season (November–March):\n- Major crops: **Wheat, Mustard, Chickpea (Chana), Lentil (Masoor), Peas**.\n- Sow after kharif harvest once soil cools below 25°C.\n- Wheat needs 4–6 irrigations; chickpea is mostly rainfed.\n- Apply phosphorus-rich fertilizer (DAP) at sowing for root development.`
    },
    {
        keywords: ['crop recommendation', 'which crop', 'best crop', 'what to grow', 'suitable crop'],
        answer: `For the best crop recommendation tailored to your soil and weather, use the **Recommend** page of this app — it analyses your soil type, rainfall, temperature, and season using AI to suggest the best crop with full explanation!\n\nGenerally:\n- **Clay soil + high rainfall** → Rice, Sugarcane\n- **Loamy soil** → Wheat, Maize, Vegetables\n- **Sandy soil** → Groundnut, Millet, Watermelon\n- **Black soil (Vertisol)** → Cotton, Soybean`
    },
    {
        keywords: ['compost', 'organic farming', 'vermicompost', 'bio fertilizer'],
        answer: `Organic farming tips:\n- **Vermicompost**: 2–5 tonnes/hectare improves soil structure and adds micro-nutrients.\n- **Jeevamrut** (cow dung + urine + jaggery + pulse flour + soil): Apply 200 litres/acre.\n- **Biofertilizers**: Rhizobium for legumes, Azospirillum for cereals, PSB for phosphorus.\n- Certify under **Paramparagat Krishi Vikas Yojana (PKVY)** for premium market price.`
    },
    {
        keywords: ['weather', 'rain', 'temperature', 'humidity', 'forecast'],
        answer: `Weather management in farming:\n- Use the **Weather** section in this app for real-time local weather data.\n- For drought stress: apply **mulching** and use drought-tolerant varieties (e.g., HYV seeds from ICAR).\n- Protect crops during unseasonal rain with **drainage channels** around fields.\n- Cold wave protection: light irrigation creates a protective film on leaves.`
    },
    {
        keywords: ['market', 'price', 'msp', 'sell', 'profit', 'income', 'revenue'],
        answer: `Market & income tips:\n- Check **MSP (Minimum Support Price)** on the eNAM portal (enam.gov.in) for your crop.\n- Sell through **FPO (Farmer Producer Organisations)** for better collective bargaining.\n- **Mandi prices**: check Agmarknet (agmarknet.nic.in) for daily prices.\n- For value addition: consider drying, grading, or processing to command higher prices.\n- Use the **Revenue Estimate** feature in this app for projected profit/cost analysis.`
    },
    {
        keywords: ['government scheme', 'subsidy', 'pm kisan', 'loan', 'kcc', 'insurance', 'fasal bima'],
        answer: `Key government schemes for farmers:\n- **PM-KISAN**: ₹6,000/year direct income support — register at pmkisan.gov.in.\n- **Kisan Credit Card (KCC)**: Low-interest crop loans (4% for timely repayment).\n- **PM Fasal Bima Yojana (PMFBY)**: Crop insurance against natural calamities.\n- **Soil Health Card**: Free soil testing — apply at your nearest KVK or Agriculture office.\n- **eNAM**: Online market platform for direct crop selling.`
    },
    {
        keywords: ['seed', 'variety', 'hybrid', 'sow', 'sowing'],
        answer: `Seed selection tips:\n- Always use **certified seeds** from registered dealers (look for tag with lot no. & germination %).\n- **HYV (High Yielding Varieties)** from ICAR/SAU give 20–40% more yield.\n- **Seed treatment**: treat with Thiram (2g/kg) or Trichoderma (4g/kg) before sowing to prevent seed-borne diseases.\n- Soak seeds in water for 8–12 hours before sowing for better germination.\n- Store seeds in cool, dry place in airtight containers.`
    },
];

function getOfflineReply(message) {
    const lower = message.toLowerCase();

    // Find best matching topic
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of FARMING_KB) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (lower.includes(kw)) score++;
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch.answer;
    }

    // Greeting
    if (/\b(hello|hi|hey|namaste|namaskar)\b/.test(lower)) {
        return `Namaste! 🌾 I'm **Kisan Vision Assistant** — your farming guide.\n\nAsk me about:\n- Soil health & fertilizers\n- Pest & disease management\n- Irrigation techniques\n- Kharif/Rabi crops\n- Government schemes (PM-KISAN, PMFBY, KCC)\n- Organic farming tips\n- Market prices & MSP`;
    }

    // Thank you
    if (/\b(thank|thanks|dhanyavaad)\b/.test(lower)) {
        return `You're welcome! Happy farming! 🌱 Feel free to ask anything about crops, soil, or pest management.`;
    }

    // Generic fallback
    return `I can help with farming topics like:\n\n🌱 **Soil & Fertilizers** — "How to improve soil health?"\n🪲 **Pest Management** — "How to control aphids organically?"\n💧 **Irrigation** — "Best irrigation for cotton?"\n🌾 **Crop Advice** — "What to grow in Rabi season?"\n🏛️ **Govt Schemes** — "Tell me about PM-KISAN"\n💰 **Market Prices** — "How to get better prices for my crop?"\n\nPlease try asking one of these topics!`;
}

// ─────────────────────────────────────────────
// Try to use Groq if key is available; fall back to offline KB
// ─────────────────────────────────────────────
async function getGroqReply(message, contextStr, apiKey) {
    const Groq = require('groq-sdk');
    const SYSTEM_PROMPT = `You are Kisan Vision, an intelligent farming assistant built into the Kisan Vision precision agriculture platform. You help Indian farmers with crop recommendations, soil health, fertilizer advice, pest management, irrigation, and market insights.

Rules:
- Keep responses SHORT (2-4 sentences max unless user asks for detail)
- Be practical and actionable
- Use simple language a farmer can understand
- Focus only on agriculture topics
- Reference Indian farming context (seasons: Kharif, Rabi, Zaid; crops common in India)
- Use metric units (hectares, kg, mm rainfall)`;

    const groq = new Groq({ apiKey });
    const messages = [
        { role: 'system', content: `${SYSTEM_PROMPT}${contextStr}` },
        { role: 'user', content: message.trim() }
    ];

    try {
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 512,
        });
        return completion.choices[0]?.message?.content || getOfflineReply(message);
    } catch {
        try {
            const completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 512,
            });
            return completion.choices[0]?.message?.content || getOfflineReply(message);
        } catch {
            return getOfflineReply(message);
        }
    }
}

// POST /api/chat
router.post('/chat', async (req, res) => {
    console.log('--- Chat Request Received ---');
    try {
        const { message, context } = req.body;
        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build context string
        let contextStr = '';
        if (context) {
            const parts = [];
            if (context.crop) parts.push(`Recommended Crop: ${context.crop}`);
            if (context.soilType) parts.push(`Soil Type: ${context.soilType}`);
            if (context.temperature) parts.push(`Temperature: ${context.temperature}°C`);
            if (context.humidity) parts.push(`Humidity: ${context.humidity}%`);
            if (context.rainfall) parts.push(`Rainfall: ${context.rainfall}mm`);
            if (context.season) parts.push(`Season: ${context.season}`);
            if (context.location) parts.push(`Location: ${context.location}`);
            if (parts.length > 0) {
                contextStr = `\n\nActive Farm Context:\n${parts.map(p => `- ${p}`).join('\n')}`;
            }
        }

        const apiKey = process.env.GROQ_API_KEY;
        let reply;

        if (apiKey) {
            // Use Groq AI if key is available
            try {
                reply = await getGroqReply(message.trim(), contextStr, apiKey);
            } catch (err) {
                console.warn('Groq failed, using offline KB:', err.message);
                reply = getOfflineReply(message.trim());
            }
        } else {
            // No API key — use local knowledge base
            console.log('No GROQ_API_KEY found — using offline farming knowledge base.');
            reply = getOfflineReply(message.trim());
        }

        res.json({ reply });
    } catch (err) {
        console.error('Chat route error:', err.message);
        // Even if something unexpected happens, return a helpful offline response
        const { message } = req.body;
        res.json({ reply: getOfflineReply(message || '') });
    }
});

// GET /api/test-groq
router.get('/test-groq', async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.json({
            status: 'offline',
            message: 'No GROQ_API_KEY configured. Chat is running in offline knowledge-base mode.',
        });
    }
    try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello!' }],
            model: 'llama-3.1-8b-instant',
        });
        res.json({ status: 'success', reply: completion.choices[0]?.message?.content });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
