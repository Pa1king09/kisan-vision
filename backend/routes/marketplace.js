const express = require('express');
const router = express.Router();

const PRODUCTS = [
  // ── CHEMICAL FERTILIZERS ──────────────────────────────
  {
    id: 'neem_coated_urea',
    name: 'Neem Coated Urea (46% N)',
    category: 'fertilizer',
    type: 'chemical',
    unit: '45 kg Bag',
    brand: 'IFFCO / KRIBHCO / NFL',
    govt_subsidized: true,
    mrp: 2450,
    subsidized_price: 266.50,
    prices: {
      esamridhi: { price: 266.50, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 266.50, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 280.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 290.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '45–60 kg per acre (in 2–3 splits)',
    crops: ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'],
    description: 'Essential nitrogen fertilizer for vegetative vigor and leaf greenness. Neem coating slows nitrogen release, preventing leaching and groundwater loss.'
  },
  {
    id: 'dap',
    name: 'DAP (Di-Ammonium Phosphate 18:46:0)',
    category: 'fertilizer',
    type: 'chemical',
    unit: '50 kg Bag',
    brand: 'IFFCO / Coromandel / Paradeep',
    govt_subsidized: true,
    mrp: 2650,
    subsidized_price: 1350.00,
    prices: {
      esamridhi: { price: 1350.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 1360.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 1390.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 1420.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '40–50 kg per acre as basal dose at sowing',
    crops: ['Rice', 'Wheat', 'Cotton', 'Potato', 'Pulses', 'Oilseeds'],
    description: 'Provides vital early phosphorus for robust root development and early nitrogen support. Apply during field prep or basal placement.'
  },
  {
    id: 'mop',
    name: 'MOP (Muriate of Potash 60% K2O)',
    category: 'fertilizer',
    type: 'chemical',
    unit: '50 kg Bag',
    brand: 'IPL / IFFCO / Mosaic',
    govt_subsidized: true,
    mrp: 2200,
    subsidized_price: 1650.00,
    prices: {
      esamridhi: { price: 1650.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 1675.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 1720.00, inStock: false, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 1750.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '25–35 kg per acre during flowering/pod formation',
    crops: ['Sugarcane', 'Potato', 'Banana', 'Tomato', 'Paddy', 'Cotton'],
    description: 'Potash boosts disease resistance, drought tolerance, grain weight, and fruit sweetness/quality.'
  },
  {
    id: 'npk_10_26_26',
    name: 'Complex NPK (10:26:26)',
    category: 'fertilizer',
    type: 'chemical',
    unit: '50 kg Bag',
    brand: 'IFFCO / Mahadhan / Gromor',
    govt_subsidized: true,
    mrp: 2100,
    subsidized_price: 1470.00,
    prices: {
      esamridhi: { price: 1470.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 1490.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 1530.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 1550.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '50 kg per acre as basal fertilizer',
    crops: ['Cotton', 'Chilli', 'Groundnut', 'Soybean', 'Vegetables'],
    description: 'High-phosphorus and high-potassium complex fertilizer. Excellent for oilseeds, pulses, and commercial crops.'
  },
  {
    id: 'ssp',
    name: 'SSP (Single Super Phosphate 16% P2O5 + 11% S)',
    category: 'fertilizer',
    type: 'chemical',
    unit: '50 kg Bag',
    brand: 'Khaitan / Coromandel / Rama',
    govt_subsidized: true,
    mrp: 850,
    subsidized_price: 490.00,
    prices: {
      esamridhi: { price: 490.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 510.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 540.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 550.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '100 kg per acre at land preparation',
    crops: ['Groundnut', 'Mustard', 'Soybean', 'Pulses'],
    description: 'Rich in phosphorus and sulphur (11%). Ideal for oilseed crops to increase oil percentage and root nodules.'
  },

  // ── BIO & ORGANIC FERTILIZERS ─────────────────────────
  {
    id: 'neem_cake',
    name: 'Pure Cold-Pressed Neem Cake Powder',
    category: 'bio_fertilizer',
    type: 'organic',
    unit: '50 kg Bag',
    brand: 'IFFCO Organic / AgroStar Bio',
    govt_subsidized: false,
    mrp: 1400,
    subsidized_price: 1150.00,
    prices: {
      esamridhi: { price: 1150.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 1190.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 1220.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 1280.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '100–150 kg per acre in soil during plowing',
    crops: ['All Vegetables', 'Paddy', 'Chilli', 'Cotton', 'Banana'],
    description: 'Natural organic fertilizer with nematicidal properties. Protects root system from termites, white grubs, and root nematodes.'
  },
  {
    id: 'vermicompost',
    name: 'Enriched Earthworm Vermicompost',
    category: 'bio_fertilizer',
    type: 'organic',
    unit: '40 kg Bag',
    brand: 'Kisan Bio / National Organic / IFFCO',
    govt_subsidized: true,
    mrp: 600,
    subsidized_price: 360.00,
    prices: {
      esamridhi: { price: 360.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 380.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 420.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 450.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '400–500 kg per acre during field preparation',
    crops: ['All Crops', 'Horticulture', 'Vegetables', 'Flowers'],
    description: 'Improves soil humus, water holding capacity, and soil microbial activity. Restores exhausted soil naturally.'
  },
  {
    id: 'trichoderma_viride',
    name: 'Trichoderma Viride 1.5% WP (Bio-Fungicide)',
    category: 'pesticide',
    type: 'organic',
    unit: '1 kg Pack',
    brand: 'IFFCO / Anand Agro / Multiplex',
    govt_subsidized: false,
    mrp: 320,
    subsidized_price: 210.00,
    prices: {
      esamridhi: { price: 210.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 225.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 240.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 260.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '1 kg per acre mixed with FYM or 10g/kg seed treatment',
    crops: ['Rice', 'Cotton', 'Chilli', 'Tomato', 'Chickpea'],
    description: 'Beneficial antagonistic fungus controlling soil-borne diseases like root rot, collar rot, damping off, and Fusarium wilt.'
  },

  // ── PESTICIDES & INSECTICIDES ─────────────────────────
  {
    id: 'chlorpyrifos',
    name: 'Chlorpyrifos 20% EC (Termite & Stem Borer)',
    category: 'pesticide',
    type: 'chemical',
    unit: '1 Litre Can',
    brand: 'Tata Rallis / Bayer / Dhanuka',
    govt_subsidized: false,
    mrp: 650,
    subsidized_price: 460.00,
    prices: {
      esamridhi: { price: 460.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 475.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 490.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 530.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '800–1000 ml per acre with 200L water',
    crops: ['Paddy', 'Wheat', 'Sugarcane', 'Cotton'],
    description: 'Broad-spectrum contact and stomach insecticide controlling termites, stem borers, and soil cutworms.'
  },
  {
    id: 'emamectin',
    name: 'Emamectin Benzoate 5% SG (Bollworm & Caterpillars)',
    category: 'pesticide',
    type: 'chemical',
    unit: '250 g Pack',
    brand: 'Syngenta (Proclaim) / Dhanuka / GSP',
    govt_subsidized: false,
    mrp: 1100,
    subsidized_price: 790.00,
    prices: {
      esamridhi: { price: 790.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 810.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 830.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 890.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '80–100 g per acre in 200L water',
    crops: ['Cotton', 'Chilli', 'Tomato', 'Cabbage', 'Soybean'],
    description: 'Highly effective against lepidopteran pests, fall armyworm, pink bollworm, and fruit borers. Rain-fast within 2 hours.'
  },
  {
    id: 'imidacloprid',
    name: 'Imidacloprid 17.8% SL (Sucking Pests)',
    category: 'pesticide',
    type: 'chemical',
    unit: '500 ml Bottle',
    brand: 'Bayer (Confidor) / UPL / IFFCO-MC',
    govt_subsidized: false,
    mrp: 750,
    subsidized_price: 520.00,
    prices: {
      esamridhi: { price: 520.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 540.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 560.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 610.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '60–75 ml per acre with 200L water',
    crops: ['Cotton', 'Paddy', 'Chilli', 'Mango', 'Okra'],
    description: 'Systemic insecticide targeting aphid, jassid, thrips, and brown planthopper (BPH) with long-lasting protection.'
  },
  {
    id: 'neem_oil',
    name: 'Organic Neem Oil (Azadirachtin 10,000 PPM)',
    category: 'pesticide',
    type: 'organic',
    unit: '1 Litre Bottle',
    brand: 'Kisan Organics / Multiplex / IFFCO',
    govt_subsidized: false,
    mrp: 800,
    subsidized_price: 560.00,
    prices: {
      esamridhi: { price: 560.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 585.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 610.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 650.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '2–3 ml per litre of water (spray early morning)',
    crops: ['All Vegetables', 'Paddy', 'Cotton', 'Fruits'],
    description: 'Safe organic repellent and anti-feedant for whitefly, mites, aphids, and caterpillar eggs. Zero residue on produce.'
  },

  // ── FUNGICIDES ────────────────────────────────────────
  {
    id: 'mancozeb',
    name: 'Mancozeb 75% WP (Broad Spectrum Fungicide)',
    category: 'fungicide',
    type: 'chemical',
    unit: '1 kg Pack',
    brand: 'UPL (Dithane M-45) / Indofil M-45 / Tata',
    govt_subsidized: false,
    mrp: 550,
    subsidized_price: 380.00,
    prices: {
      esamridhi: { price: 380.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 395.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 415.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 460.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '600–800 g per acre in 200L water',
    crops: ['Potato (Blight)', 'Tomato', 'Paddy (Blast)', 'Groundnut', 'Wheat'],
    description: 'Classic protective contact fungicide controlling early & late blight, leaf spots, and blast. Contains zinc and manganese nutrients.'
  },
  {
    id: 'carbendazim',
    name: 'Carbendazim 50% WP (Systemic Fungicide)',
    category: 'fungicide',
    type: 'chemical',
    unit: '500 g Pack',
    brand: 'Crystal (Bavistin) / Dhanuka / IFFCO',
    govt_subsidized: false,
    mrp: 420,
    subsidized_price: 290.00,
    prices: {
      esamridhi: { price: 290.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 305.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 320.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 350.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '250–300 g per acre in 200L water',
    crops: ['Paddy (Sheath Blight)', 'Cotton', 'Wheat', 'Apple', 'Grapes'],
    description: 'Systemic curative and preventive fungicide for powdery mildew, loose smut, and blast.'
  },

  // ── MICRONUTRIENTS ────────────────────────────────────
  {
    id: 'zinc_sulphate',
    name: 'Zinc Sulphate Monohydrate 33% Zn',
    category: 'micronutrient',
    type: 'chemical',
    unit: '10 kg Pack',
    brand: 'IFFCO / Coromandel / Zuari',
    govt_subsidized: false,
    mrp: 750,
    subsidized_price: 520.00,
    prices: {
      esamridhi: { price: 520.00, inStock: true, platform: 'IFFCO e-Bazar / e-Samridhi', link: 'https://www.iffcobazar.com' },
      agribazaar: { price: 540.00, inStock: true, platform: 'AgriBazaar', link: 'https://www.agribazaar.com' },
      agrostar: { price: 570.00, inStock: true, platform: 'AgroStar', link: 'https://www.agrostar.in' },
      local_dealer: { price: 620.00, inStock: true, platform: 'Local Mandi Dealer', link: null }
    },
    recommended_dose: '5–10 kg per acre in basal soil application',
    crops: ['Rice (Khaira Disease prevention)', 'Wheat', 'Maize', 'Cotton'],
    description: 'Prevents zinc deficiency and Khaira disease in paddy. Essential for auxin enzyme synthesis and tillering.'
  }
];

// GET /api/marketplace/products
router.get('/marketplace/products', (req, res) => {
  try {
    const { category, type, search } = req.query;
    let list = PRODUCTS;

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (type && type !== 'all') {
      list = list.filter(p => p.type === type);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.crops.some(c => c.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/marketplace/calculate-basket
// Input: { acres: 2, crop: 'Rice' } -> calculates standard fertilizer basket & total cost comparison
router.post('/marketplace/calculate-basket', (req, res) => {
  try {
    const { acres = 1, crop = 'Rice' } = req.body;
    const a = parseFloat(acres) || 1;

    // Standard fertilizer plan per acre: 2 bags Urea, 1 bag DAP, 0.5 bag MOP, 1 pack Zinc
    const ureaBags = Math.ceil(a * 2);
    const dapBags = Math.ceil(a * 1);
    const mopBags = Math.ceil(a * 0.5);
    const zincPacks = Math.ceil(a * 1);

    const urea = PRODUCTS.find(p => p.id === 'neem_coated_urea');
    const dap = PRODUCTS.find(p => p.id === 'dap');
    const mop = PRODUCTS.find(p => p.id === 'mop');
    const zinc = PRODUCTS.find(p => p.id === 'zinc_sulphate');

    const total_esamridhi = Math.round(
      ureaBags * urea.prices.esamridhi.price +
      dapBags * dap.prices.esamridhi.price +
      mopBags * mop.prices.esamridhi.price +
      zincPacks * zinc.prices.esamridhi.price
    );

    const total_agribazaar = Math.round(
      ureaBags * urea.prices.agribazaar.price +
      dapBags * dap.prices.agribazaar.price +
      mopBags * mop.prices.agribazaar.price +
      zincPacks * zinc.prices.agribazaar.price
    );

    const total_local = Math.round(
      ureaBags * urea.prices.local_dealer.price +
      dapBags * dap.prices.local_dealer.price +
      mopBags * mop.prices.local_dealer.price +
      zincPacks * zinc.prices.local_dealer.price
    );

    const savings = total_local - total_esamridhi;

    res.json({
      success: true,
      data: {
        acres: a,
        crop,
        basket: [
          { name: 'Neem Coated Urea', quantity: `${ureaBags} bags (45kg)` },
          { name: 'DAP (18:46:0)', quantity: `${dapBags} bags (50kg)` },
          { name: 'MOP (Potash)', quantity: `${mopBags} bags (50kg)` },
          { name: 'Zinc Sulphate', quantity: `${zincPacks} packs (10kg)` },
        ],
        totals: {
          esamridhi: `₹${total_esamridhi.toLocaleString('en-IN')}`,
          agribazaar: `₹${total_agribazaar.toLocaleString('en-IN')}`,
          local_dealer: `₹${total_local.toLocaleString('en-IN')}`,
          potential_savings: `₹${savings.toLocaleString('en-IN')}`
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
