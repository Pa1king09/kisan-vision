const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getDiseaseDetails } = require('../data/diseaseKnowledge');

const ML_ENGINE_URL = process.env.ML_ENGINE_URL || 'http://127.0.0.1:5001';

// ─── Disease Knowledge Base ───────────────────────────────────────────────────
const DISEASES = [
  {
    keywords: ['blast', 'lesion', 'diamond', 'gray center', 'brown border', 'spindle', 'neck rot', 'panicle'],
    disease: 'Rice Blast',
    affected_crops: ['Rice', 'Wheat', 'Barley'],
    severity: 'Critical',
    image_tip: 'Look for diamond-shaped lesions with gray centers and brown borders on leaves; neck of panicle turns brown and breaks.',
    treatment: [
      'Spray Tricyclazole 75WP @ 0.6g/L water immediately',
      'Apply Propiconazole 25EC @ 1ml/L as follow-up after 10 days',
      'Remove and destroy severely infected plant parts',
      'Improve field drainage to reduce humidity'
    ],
    organic_treatment: [
      'Spray Pseudomonas fluorescens @ 10g/L water (biocontrol agent)',
      'Apply neem seed kernel extract (NSKE) @ 5% as preventive spray'
    ],
    prevention: [
      'Use resistant varieties (IR-64, Jaya, Sasyasree)',
      'Avoid excess nitrogen fertilizer — split apply in 3 doses',
      'Maintain 2-3 cm water level in field during susceptible stages',
      'Seed treatment with Carbendazim 2g/kg seed before sowing'
    ]
  },
  {
    keywords: ['brown spot', 'circular spot', 'brown circular', 'oval lesion', 'helminthosporium', 'sesame spot'],
    disease: 'Brown Spot',
    affected_crops: ['Rice', 'Maize'],
    severity: 'Medium',
    image_tip: 'Small circular to oval spots with brown center and yellow halo on leaves. In severe cases, spots coalesce and leaves dry up.',
    treatment: [
      'Spray Mancozeb 75WP @ 2g/L water',
      'Apply Edifenphos 50EC @ 1ml/L if infection is severe',
      'Remove infected leaves and burn them',
      'Spray Copper Oxychloride 50WP @ 3g/L as alternative'
    ],
    organic_treatment: [
      'Spray Dithane M-45 (Mancozeb) mixed with neem oil @ 3ml/L',
      'Garlic extract spray (50g garlic in 1L water) for early infection'
    ],
    prevention: [
      'Maintain balanced nutrition — avoid potassium deficiency',
      'Seed treatment with Captan or Thiram @ 2.5g/kg seed',
      'Use certified disease-free seeds',
      'Avoid water stress — keep soil moisture adequate'
    ]
  },
  {
    keywords: ['bacterial blight', 'water soaking', 'wilting', 'yellowing margins', 'kresek', 'leaf scald', 'milky ooze'],
    disease: 'Bacterial Leaf Blight',
    affected_crops: ['Rice'],
    severity: 'High',
    image_tip: 'Water-soaked lesions along leaf margins that turn yellow then straw-colored. Creamy bacterial ooze on leaf tips in early morning.',
    treatment: [
      'Spray Streptomycin sulphate + Copper Oxychloride (200g + 1.2kg per acre)',
      'Apply Copper Hydroxide 77WP @ 2g/L water',
      'Drain and re-irrigate field to wash out bacteria',
      'Avoid overhead irrigation and prevent waterlogging'
    ],
    organic_treatment: [
      'Spray Bordeaux mixture (1%) — copper sulphate + lime in water',
      'Apply Trichoderma viride @ 5g/L as soil drench around roots'
    ],
    prevention: [
      'Use resistant varieties (IR-20, Ratna, Co-25)',
      'Avoid excess nitrogen fertilizer especially urea',
      'Remove weed hosts around field boundaries',
      'Disinfect farm tools with 1% bleach solution'
    ]
  },
  {
    keywords: ['rust', 'yellow rust', 'stem rust', 'leaf rust', 'orange pustule', 'red pustule', 'striped yellow'],
    disease: 'Wheat Rust',
    affected_crops: ['Wheat', 'Barley', 'Oats'],
    severity: 'Critical',
    image_tip: 'Yellow/orange or dark-red pustules on leaves and stems. Yellow rust shows parallel stripes; Stem rust has large dark reddish-brown pustules.',
    treatment: [
      'Spray Propiconazole 25EC @ 1ml/L immediately upon detection',
      'Apply Tebuconazole 250EC @ 1ml/L as alternate spray',
      'Use Mancozeb 75WP @ 2.5g/L for mild infections',
      'Repeat spray after 15 days if infection persists'
    ],
    organic_treatment: [
      'Spray wettable sulphur @ 3g/L water (effective for early yellow rust)',
      'Apply baking soda solution (1 tsp per litre) as mild fungicide'
    ],
    prevention: [
      'Sow resistant varieties (HD-2967, GW-322, K-307)',
      'Avoid late sowing — plant in recommended window (Nov 1-15)',
      'Monitor fields weekly during humid weather',
      'Destroy volunteer wheat plants that harbor the fungus'
    ]
  },
  {
    keywords: ['powdery mildew', 'white powder', 'white coating', 'flour dusting', 'powdery growth', 'white fungus'],
    disease: 'Powdery Mildew',
    affected_crops: ['Wheat', 'Peas', 'Grapes', 'Tomato', 'Chilli', 'Cucurbits'],
    severity: 'Medium',
    image_tip: 'White powdery fungal growth on upper leaf surface, stems, and pods. Leaves turn yellow and drop in severe cases.',
    treatment: [
      'Spray Carbendazim 50WP @ 1g/L or Hexaconazole @ 2ml/L',
      'Apply Wettable Sulphur 80WP @ 3g/L (most economical)',
      'Use Dinocap 48EC @ 1ml/L for cucurbits and grapes',
      'Repeat spray every 10-14 days during humid weather'
    ],
    organic_treatment: [
      'Spray potassium bicarbonate @ 1 tsp/L (disrupts fungal cell membrane)',
      'Neem oil @ 3ml/L + few drops of dish soap — spray on affected areas',
      'Diluted milk spray (40% milk, 60% water) weekly as preventive'
    ],
    prevention: [
      'Ensure good air circulation — avoid overcrowding',
      'Use drip irrigation instead of overhead — reduces leaf wetness',
      'Avoid excess nitrogen fertilizer',
      'Remove and destroy infected plant debris after harvest'
    ]
  },
  {
    keywords: ['wilt', 'fusarium wilt', 'vascular', 'yellowing', 'wilting', 'plant death', 'sudden death', 'collar rot'],
    disease: 'Fusarium Wilt',
    affected_crops: ['Tomato', 'Chilli', 'Banana', 'Cotton', 'Groundnut', 'Chickpea'],
    severity: 'High',
    image_tip: 'Sudden wilting of whole plant or individual branches starting from lower leaves. Cut stem shows brown discoloration of vascular tissue.',
    treatment: [
      'Drench soil with Carbendazim 50WP @ 2g/L around root zone',
      'Apply Trichoderma viride bioagent @ 5g/L as root drench',
      'Remove infected plants and dispose away from field',
      'Soil drench with Copper Oxychloride @ 3g/L in severe cases'
    ],
    organic_treatment: [
      'Apply Trichoderma harzianum enriched FYM @ 250g per plant hole',
      'Drench with Pseudomonas fluorescens @ 10g/L around roots',
      'Add neem cake @ 100g per plant to soil before transplanting'
    ],
    prevention: [
      'Use resistant/tolerant varieties and F1 hybrid seeds',
      'Crop rotation — avoid same family crops for 3+ years',
      'Soil solarization with transparent plastic for 4 weeks before planting',
      'Treat seeds with Trichoderma @ 4g/kg before sowing'
    ]
  },
  {
    keywords: ['downy mildew', 'purple downy', 'yellow angular', 'cottony growth', 'sporulation', 'water soaked angular'],
    disease: 'Downy Mildew',
    affected_crops: ['Maize', 'Sorghum', 'Onion', 'Grapes', 'Cucumber', 'Pearl Millet'],
    severity: 'High',
    image_tip: 'Yellow to pale-green angular spots on upper leaf surface; white to purple cottony fungal sporulation on underside of leaves.',
    treatment: [
      'Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L water',
      'Apply Cymoxanil + Mancozeb @ 3g/L as alternative',
      'Foliar spray of Fosetyl-Al @ 3g/L for systemic control',
      'Repeat spray every 7-10 days during disease-favorable weather'
    ],
    organic_treatment: [
      'Spray Bordeaux mixture (1%) as preventive and curative',
      'Apply copper-based spray (Copper Hydroxide @ 2g/L)'
    ],
    prevention: [
      'Seed treatment with Metalaxyl 35SD @ 6g/kg seed',
      'Use resistant varieties from ICAR/local KVK',
      'Avoid excess irrigation and waterlogging',
      'Maintain proper plant spacing for air circulation'
    ]
  },
  {
    keywords: ['early blight', 'target spot', 'concentric rings', 'dark brown spot with rings', 'alternaria'],
    disease: 'Early Blight (Alternaria)',
    affected_crops: ['Tomato', 'Potato', 'Brinjal'],
    severity: 'Medium',
    image_tip: 'Dark brown circular spots with concentric rings like a target on lower/older leaves. Yellow halo around spots; severe defoliation.',
    treatment: [
      'Spray Mancozeb 75WP @ 2g/L every 7-10 days',
      'Apply Chlorothalonil 75WP @ 2g/L as alternative',
      'Remove lower infected leaves before spraying',
      'Apply Iprodione 50WP @ 1g/L in severe cases'
    ],
    organic_treatment: [
      'Spray copper-based fungicide (Copper Oxychloride 3g/L)',
      'Neem oil @ 3ml/L + 1ml dish soap per litre of water'
    ],
    prevention: [
      'Remove infected leaf debris from field',
      'Use drip irrigation — avoid wetting foliage',
      'Stake tomato plants for air circulation',
      'Crop rotation with non-Solanaceous crops'
    ]
  },
  {
    keywords: ['late blight', 'water soaked', 'phytophthora', 'dark brown oily', 'white mold underside', 'fast spreading'],
    disease: 'Late Blight',
    affected_crops: ['Tomato', 'Potato'],
    severity: 'Critical',
    image_tip: 'Large, irregular water-soaked, dark brown-to-black oily lesions on leaves and stems. White mold visible on underside in humid mornings. Spreads VERY fast.',
    treatment: [
      'Spray Cymoxanil 8% + Mancozeb 64% @ 2.5g/L IMMEDIATELY',
      'Apply Metalaxyl + Mancozeb @ 2.5g/L every 5-7 days',
      'Remove and burn all infected plant material',
      'Apply Fosetyl-Al 80WP @ 3g/L for systemic action'
    ],
    organic_treatment: [
      'Spray Bordeaux mixture (1%) as preventive measure',
      'Copper Hydroxide 77WP @ 2g/L before heavy rains'
    ],
    prevention: [
      'Plant certified disease-free seed potatoes/tomato transplants',
      'Avoid overhead irrigation — use drip',
      'Monitor daily during cool (10-20°C), humid weather',
      'Hilling of potato plants to prevent tuber infection'
    ]
  },
  {
    keywords: ['leaf curl', 'curling', 'cupping', 'upward curl', 'downward curl', 'crinkle', 'distortion', 'virus'],
    disease: 'Leaf Curl Virus (TLCV)',
    affected_crops: ['Tomato', 'Chilli', 'Cotton', 'Papaya'],
    severity: 'High',
    image_tip: 'Leaves curl upward or downward, become distorted and leathery. New growth is stunted. Transmitted by whiteflies.',
    treatment: [
      'NO chemical cure for virus — manage vector (whitefly)',
      'Spray Imidacloprid 17.8SL @ 0.3ml/L to kill whiteflies',
      'Apply Thiamethoxam 25WG @ 0.3g/L as alternative',
      'Remove and destroy heavily infected plants immediately'
    ],
    organic_treatment: [
      'Yellow sticky traps @ 10 per acre to trap whiteflies',
      'Spray neem oil @ 5ml/L to repel whiteflies',
      'Reflective silver mulch reduces whitefly landing'
    ],
    prevention: [
      'Use virus-resistant varieties (Arka Rakshak, Sakthi)',
      'Install 40-50 mesh net to protect nursery from whiteflies',
      'Avoid growing tomato near tobacco/other virus hosts',
      'Remove volunteer plants and weeds that harbor virus'
    ]
  },
  {
    keywords: ['bollworm', 'cotton boll', 'pink bollworm', 'american bollworm', 'boll damage', 'square shedding'],
    disease: 'Cotton Bollworm',
    affected_crops: ['Cotton', 'Tomato', 'Maize'],
    severity: 'Critical',
    image_tip: 'Entry holes on cotton bolls with frass (excrement). Damaged bolls open prematurely with dark staining. Larvae visible inside boll.',
    treatment: [
      'Spray Chlorpyrifos 20EC @ 2ml/L + Lambda-cyhalothrin 5EC @ 1ml/L',
      'Apply Spinosad 45SC @ 0.3ml/L (effective on young larvae)',
      'Use Indoxacarb 14.5SC @ 1ml/L for resistance management',
      'Spray Bt (Bacillus thuringiensis) @ 1g/L for organic option'
    ],
    organic_treatment: [
      'Release Trichogramma cards @ 1.5 lakh eggs/acre/week (x3 releases)',
      'Set up Helilure pheromone traps @ 5 per acre for monitoring',
      'Spray NSKE (Neem Seed Kernel Extract) @ 5%'
    ],
    prevention: [
      'Grow Bt Cotton (already resistant to bollworms)',
      'Follow recommended spacing — avoid overcrowding',
      'Monitor using pheromone traps regularly',
      'Destroy crop residue immediately after harvest'
    ]
  },
  {
    keywords: ['aphid', 'honeydew', 'sticky leaves', 'small green insects', 'black colonies', 'sucking', 'sooty mold'],
    disease: 'Aphid Infestation',
    affected_crops: ['Wheat', 'Cotton', 'Mustard', 'Vegetables', 'Chilli'],
    severity: 'Medium',
    image_tip: 'Clusters of small green, black, or brown soft-bodied insects on new shoots and leaf undersides. Sticky honeydew on leaves, followed by black sooty mold.',
    treatment: [
      'Spray Imidacloprid 17.8SL @ 0.5ml/L or Thiamethoxam @ 0.3g/L',
      'Apply Dimethoate 30EC @ 1.5ml/L for knockdown effect',
      'Spray Pyrethroids (Lambda-cyhalothrin) for quick kill',
      'Repeat after 10-12 days if population builds up again'
    ],
    organic_treatment: [
      'Spray neem oil @ 5ml/L + 1ml soap per litre of water',
      'Garlic-chilli extract spray (natural repellent)',
      'Introduce lady beetles (Coccinella) as biological control'
    ],
    prevention: [
      'Avoid excess nitrogen fertilizer (attracts aphids)',
      'Remove heavily infested shoot tips',
      'Plant companion crops like coriander to attract natural enemies',
      'Monitor weekly and act early when population is low'
    ]
  },
  {
    keywords: ['whitefly', 'white fly', 'tiny white insects', 'cloud of white', 'sticky leaves', 'yellowing underside'],
    disease: 'Whitefly Infestation',
    affected_crops: ['Cotton', 'Tomato', 'Chilli', 'Brinjal', 'Cucumber'],
    severity: 'High',
    image_tip: 'Tiny white powdery insects on leaf undersides. When plant is disturbed, a cloud of white insects flies up. Leaves turn yellow and sticky with honeydew.',
    treatment: [
      'Spray Spiromesifen 22.9SC @ 0.9ml/L (breaks resistance)',
      'Apply Buprofezin 25SC @ 1ml/L as insect growth regulator',
      'Use Pyriproxyfen 10EC @ 1ml/L for nymph control',
      'Alternate between 3 different chemical groups to prevent resistance'
    ],
    organic_treatment: [
      'Yellow sticky traps @ 15 per acre for mass trapping',
      'Spray neem oil @ 3-5ml/L + soft soap @ 5ml/L',
      'Release Encarsia formosa (parasitic wasp) as biocontrol'
    ],
    prevention: [
      'Use reflective silver mulch to repel whiteflies',
      'Install 50 mesh net around nursery',
      'Avoid planting near heavily infested fields',
      'Manage weeds around field borders'
    ]
  },
  {
    keywords: ['root rot', 'damping off', 'seedling death', 'collar rot', 'stem base', 'dark brown root', 'rotting root'],
    disease: 'Root Rot / Damping Off',
    affected_crops: ['Tomato', 'Chilli', 'Cotton', 'Groundnut', 'Vegetables'],
    severity: 'High',
    image_tip: 'Seedlings collapse at soil level (pinching at collar). Roots turn dark brown to black and soft. Heavy damping off in waterlogged nursery areas.',
    treatment: [
      'Drench soil with Metalaxyl + Mancozeb @ 2.5g/L around plants',
      'Apply Copper Oxychloride @ 3g/L as soil drench',
      'Improve drainage immediately — remove standing water',
      'Carbendazim 50WP @ 1g/L drench on seedbeds'
    ],
    organic_treatment: [
      'Apply Trichoderma viride @ 4g/kg soil in nursery',
      'Drench with Pseudomonas fluorescens @ 10g/L',
      'Add well-composted FYM with Trichoderma enriched compost'
    ],
    prevention: [
      'Raise nursery beds 15-20 cm above ground level',
      'Use sterilized potting mix in nursery',
      'Avoid overwatering — water only when topsoil dries',
      'Seed treatment with Thiram + Carbendazim @ 2g/kg seed'
    ]
  },
  {
    keywords: ['smut', 'covered smut', 'loose smut', 'black powder', 'ear smut', 'grain replaced'],
    disease: 'Smut Disease',
    affected_crops: ['Wheat', 'Barley', 'Jowar', 'Bajra', 'Maize'],
    severity: 'High',
    image_tip: 'Grain replaced by black powdery masses (spores). In loose smut, black smut balls replace entire ear head. Strong fishy smell in some crops.',
    treatment: [
      'Remove and burn infected plants/ear heads before spores spread',
      'Spray Tebuconazole 250EC @ 1ml/L as preventive measure',
      'Apply Propiconazole @ 1ml/L at boot stage',
      'Deep plow after harvest to bury infected crop residue'
    ],
    organic_treatment: [
      'Hot water seed treatment: 52°C for 10 minutes kills smut spores',
      'Trichoderma seed treatment @ 4g/kg before sowing'
    ],
    prevention: [
      'Use certified smut-free seed — never use grain from infected crop',
      'Seed treatment with Vitavax 75WP (Carboxin) @ 2g/kg seed',
      'Rotate crop for at least 2 years',
      'Maintain field hygiene — remove infected material'
    ]
  },
  {
    keywords: ['anthracnose', 'fruit rot', 'dark sunken', 'brown sunken lesion', 'orange spore mass', 'post harvest rot'],
    disease: 'Anthracnose',
    affected_crops: ['Mango', 'Grape', 'Chilli', 'Bean', 'Cucumber'],
    severity: 'High',
    image_tip: 'Dark, sunken, circular lesions on fruits, leaves, and stems. Orange or salmon-colored spore masses visible in the center of spots in humid weather.',
    treatment: [
      'Spray Carbendazim 50WP @ 1g/L or Thiophanate Methyl @ 1g/L',
      'Apply Chlorothalonil 75WP @ 2g/L for broad-spectrum control',
      'Mancozeb 75WP @ 2.5g/L every 10 days during fruit development',
      'Post-harvest: hot water treatment (55°C for 5 min) for fruits'
    ],
    organic_treatment: [
      'Spray Bordeaux mixture (1%) as preventive',
      'Copper Oxychloride 50WP @ 3g/L before rains'
    ],
    prevention: [
      'Prune for airflow — avoid excessive shade in orchard',
      'Remove fallen infected fruits from field immediately',
      'Avoid injury to fruits during harvest',
      'Pre-harvest bagging of mango clusters'
    ]
  },
  {
    keywords: ['mosaic', 'mosaic virus', 'yellow green mosaic', 'mottled leaves', 'light dark green pattern', 'stunted growth mosaic'],
    disease: 'Mosaic Virus',
    affected_crops: ['Cucumber', 'Beans', 'Tomato', 'Papaya', 'Groundnut'],
    severity: 'High',
    image_tip: 'Alternating light and dark green patches (mosaic pattern) on leaves. Leaves may curl, become narrow, and plants are stunted with reduced flowering.',
    treatment: [
      'No chemical cure — manage aphid and thrips vectors',
      'Spray Imidacloprid @ 0.3ml/L to kill vector insects immediately',
      'Remove and destroy infected plants within 24 hours of detection',
      'Disinfect tools with 10% bleach solution between plants'
    ],
    organic_treatment: [
      'Mineral oil spray (1-2%) repels aphid vectors',
      'Kaolin clay foliar spray creates physical barrier against vectors',
      'Reflective mulches to confuse and repel aphids'
    ],
    prevention: [
      'Use virus-resistant/tolerant varieties',
      'Control aphids from day 1 of planting',
      'Avoid planting near infected crops of same family',
      'Rogue out infected plants as soon as detected'
    ]
  },
  {
    keywords: ['bacterial wilt', 'sudden wilting', 'ooze stream', 'white thread', 'stem cut ooze', 'ralstonia'],
    disease: 'Bacterial Wilt (Ralstonia)',
    affected_crops: ['Tomato', 'Potato', 'Brinjal', 'Groundnut', 'Banana'],
    severity: 'Critical',
    image_tip: 'Cut stem and dip in water — white milky bacterial ooze forms a stream. Plant wilts suddenly and completely. Vascular tissue turns brown.',
    treatment: [
      'NO effective chemical cure once infected',
      'Remove infected plants with roots and soil — dispose away from field',
      'Drench remaining plants with Copper Oxychloride @ 3g/L',
      'Apply Streptomycin 200ppm spray on surrounding healthy plants'
    ],
    organic_treatment: [
      'Soil application of Trichoderma + Pseudomonas fluorescens @ 250g/plant',
      'Lime application to raise soil pH above 7.0 reduces bacteria survival'
    ],
    prevention: [
      'Use grafted seedlings (on resistant rootstock) in problem soils',
      'Avoid water from infected areas for irrigation',
      'Crop rotation for minimum 3 years with non-host crops',
      'Soil solarization for 4-6 weeks before planting'
    ]
  },
  {
    keywords: ['charcoal rot', 'stalk rot', 'grey stem', 'internal rotting', 'shredding pith', 'charcoal black stem'],
    disease: 'Charcoal Rot',
    affected_crops: ['Maize', 'Soybean', 'Sorghum', 'Groundnut'],
    severity: 'High',
    image_tip: 'Grey-black discoloration of stem base. Internal stem tissue shows dark streaks and tiny black sclerotia (like charcoal particles). Premature plant death.',
    treatment: [
      'No effective fungicide once established — improve plant health',
      'Apply Thiophanate Methyl @ 1g/L as soil drench at early stage',
      'Foliar potassium spray @ 1% to reduce plant stress',
      'Supplemental irrigation to reduce drought stress'
    ],
    organic_treatment: [
      'Apply Trichoderma viride enriched FYM @ 500kg/acre',
      'Maintain soil moisture with mulching'
    ],
    prevention: [
      'Avoid drought stress at critical growth stages',
      'Use disease-tolerant varieties for drought-prone areas',
      'Seed treatment with Thiram + Carbendazim',
      'Balanced nutrition — avoid excess nitrogen'
    ]
  },
  {
    keywords: ['ergot', 'honeydew ergot', 'dark purple grain', 'sclerotia', 'horn-shaped body', 'sweet smell'],
    disease: 'Ergot Disease',
    affected_crops: ['Bajra', 'Rye', 'Jowar', 'Wheat'],
    severity: 'High',
    image_tip: 'Hard, dark purple to black horn-shaped bodies replace some grains. Sweet honeydew smell from infected heads in early stage. Toxic to humans and animals.',
    treatment: [
      'Remove infected ear heads before sclerotia mature and drop',
      'Spray Propiconazole @ 1ml/L at flowering to prevent infection',
      'Thiram 75WP @ 2g/L spray during pre-flowering stage',
      'Do NOT feed ergot-infected grain to animals — toxic'
    ],
    organic_treatment: [
      'Salt water solution (10%) seed treatment to float and remove ergot bodies',
      'Roguing infected plants by hand before disease spreads'
    ],
    prevention: [
      'Use certified ergot-free seed',
      'Deep plow after harvest to bury sclerotia',
      'Crop rotation breaks the disease cycle',
      'Avoid growing during high humidity at flowering'
    ]
  }
];

// Generic fallback response
const GENERIC_RESPONSE = {
  disease: 'Unknown / Multiple Possible Diseases',
  severity: 'Unknown',
  affected_crops: ['Various crops'],
  symptoms_matched: [],
  treatment: [
    'Collect samples and consult your local Krishi Vigyan Kendra (KVK)',
    'Take clear photos of affected leaves/stems to an agricultural officer',
    'Avoid applying any chemical until disease is confirmed',
    'Meanwhile: improve drainage, reduce overhead irrigation, and ensure good airflow'
  ],
  organic_treatment: [
    'Neem oil spray @ 3-5ml/L as broad-spectrum preventive',
    'Bordeaux mixture (1%) for fungal/bacterial issues'
  ],
  prevention: [
    'Use certified seeds from registered dealers',
    'Maintain crop hygiene — remove dead plant material',
    'Follow proper crop rotation',
    'Monitor fields twice a week for early detection'
  ],
  image_tip: 'Take close-up photos of affected leaves (front and back), stems, and any insects present. Check for spots, discoloration, unusual growth, or insect damage.'
};

// POST /api/disease-detect
router.post('/disease-detect', (req, res) => {
  try {
    const { symptoms = '', crop = '' } = req.body;
    if (!symptoms.trim()) {
      return res.status(400).json({ success: false, message: 'Please describe the symptoms' });
    }

    const lower = (symptoms + ' ' + crop).toLowerCase();

    let bestMatch = null;
    let bestScore = 0;
    let matchedKeywords = [];

    for (const disease of DISEASES) {
      const matched = disease.keywords.filter(kw => lower.includes(kw));
      if (matched.length > bestScore) {
        bestScore = matched.length;
        bestMatch = disease;
        matchedKeywords = matched;
      }
    }

    if (!bestMatch || bestScore === 0) {
      return res.json({
        success: true,
        data: { ...GENERIC_RESPONSE, symptoms_input: symptoms }
      });
    }

    res.json({
      success: true,
      data: {
        disease: bestMatch.disease,
        severity: bestMatch.severity,
        affected_crops: bestMatch.affected_crops,
        symptoms_matched: matchedKeywords,
        treatment: bestMatch.treatment,
        organic_treatment: bestMatch.organic_treatment,
        prevention: bestMatch.prevention,
        image_tip: bestMatch.image_tip,
        symptoms_input: symptoms
      }
    });
  } catch (err) {
    console.error('Disease detect error:', err.message);
    res.status(500).json({ success: false, message: 'Error processing request' });
  }
});

// ─── PlantVillage Vision Classes & Samples ──────────────────────────────────
const PLANTVILLAGE_SAMPLES = [
  {
    id: 'cotton_bacterial_blight',
    name: 'Cotton Bacterial Blight (Angular Leaf Spot)',
    crop: 'Cotton',
    plantvillage_class: 'Cotton___Bacterial_blight',
    confidence: 96.5,
    severity: 'High',
    affected_leaf_area: '26% angular lesions',
    preview_color: '#4a2810',
    visual_symptoms: ['Angular water-soaked spots delimited by leaf veins', 'Lesions turning dark brown to black (black arm symptom)', 'Premature defoliation'],
    treatment: [
      'Spray Streptocycline 1g in 10L water tank-mixed with Copper Oxychloride 25g in 10L water',
      'Repeat after 12 days during rainy periods',
      'Avoid excess nitrogen application'
    ],
    organic_treatment: [
      'Cow urine spray (10% aqueous) with 1% fermented asafoetida',
      'Pseudomonas fluorescens 1% WP foliar spray @ 5g/L'
    ],
    prevention: [
      'Delint seeds with sulfuric acid before planting',
      'Destroy infected crop residue post-harvest'
    ]
  },
  {
    id: 'cotton_leaf_curl',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    crop: 'Cotton',
    plantvillage_class: 'Cotton___Leaf_curl',
    confidence: 94.8,
    severity: 'Critical',
    affected_leaf_area: '35% foliar curling',
    preview_color: '#854d0e',
    visual_symptoms: ['Upward and downward curling of leaf margins', 'Vein enation and leaf thickening', 'Severe plant stunting and flower abortion'],
    treatment: [
      'Spray Diafenthiuron 50% WP @ 1.2g/L or Afidopyropen 50 g/L DC @ 2ml/L to control vector whiteflies',
      'Install yellow sticky traps @ 25 traps/acre'
    ],
    organic_treatment: [
      'Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem Oil @ 2.5ml/L',
      'Lecanicillium lecanii biopesticide @ 5g/L'
    ],
    prevention: [
      'Eradicate host weeds like Parthenium around field borders',
      'Grow CLCuV-resistant Bt cotton cultivars'
    ]
  },
  {
    id: 'tomato_late_blight',
    name: 'Tomato Late Blight',
    crop: 'Tomato',
    plantvillage_class: 'Tomato___Late_blight',
    confidence: 96.4,
    severity: 'Critical',
    affected_leaf_area: '38% leaf necrosis',
    preview_color: '#8B4513',
    visual_symptoms: ['Large irregular water-soaked dark brown spots', 'Pale green border ring around dead tissue', 'White mildew growth on lower leaf surface in humid conditions'],
    treatment: [
      'Spray Metalaxyl + Mancozeb (Ridomil MZ) @ 2.5g/L water immediately',
      'Alternate with Cymoxanil + Mancozeb @ 2g/L after 7 days',
      'Remove heavily blighted leaves and burn or bury away from field',
      'Avoid evening irrigation that leaves foliage wet overnight'
    ],
    organic_treatment: [
      'Copper Hydroxide spray (Bordeaux Mixture 1%) on unaffected foliage',
      'Bio-fungicide spray with Trichoderma harzianum @ 5g/L',
      'Baking soda solution (5g/L water + few drops liquid soap) as preventive barrier'
    ],
    prevention: [
      'Space plants at least 60cm apart for rapid air circulation',
      'Use drip irrigation instead of overhead sprinklers',
      'Rotate crops — avoid planting tomato near potato fields',
      'Plant resistant hybrids (e.g. Mountain Magic, Defiant)'
    ]
  },
  {
    id: 'rice_blast',
    name: 'Rice Leaf Blast',
    crop: 'Rice',
    plantvillage_class: 'Rice___Leaf_Blast',
    confidence: 94.8,
    severity: 'Critical',
    affected_leaf_area: '29% foliar lesions',
    preview_color: '#A0522D',
    visual_symptoms: ['Spindle/diamond-shaped lesions with pointed ends', 'Ash-grey or whitish centers with dark brown borders', 'Coalescing lesions causing leaf desiccation'],
    treatment: [
      'Spray Tricyclazole 75WP (Baan) @ 0.6g/L water at earliest appearance',
      'Apply Isoprothiolane 40EC (Fujione) @ 1.5ml/L after 10 days',
      'Drain standing water slightly and withhold urea top-dressing',
      'Apply potassium fertilizer (MOP) to harden cell walls'
    ],
    organic_treatment: [
      'Spray Pseudomonas fluorescens @ 10g/L water',
      'Neem Seed Kernel Extract (NSKE 5%) spray',
      'Fermented buttermilk spray (1L sour curd in 10L water)'
    ],
    prevention: [
      'Treat seeds with Carbendazim 2g/kg seed before sowing',
      'Avoid excessive nitrogen (split urea in 3 doses)',
      'Use blast-resistant varieties like IR-64 or Swarna',
      'Maintain 2–3 cm shallow water layer'
    ]
  },
  {
    id: 'corn_rust',
    name: 'Corn (Maize) Common Rust',
    crop: 'Maize',
    plantvillage_class: 'Corn_(Maize)___Common_rust',
    confidence: 93.1,
    severity: 'Medium',
    affected_leaf_area: '22% pustule density',
    preview_color: '#D2691E',
    visual_symptoms: ['Golden-brown to cinnamon-brown powdery pustules', 'Pustules scattered across upper and lower leaf surfaces', 'Leaves turning yellow and chlorotic around dense spore patches'],
    treatment: [
      'Spray Mancozeb 75WP @ 2.5g/L water',
      'Apply Azoxystrobin + Difenoconazole (Amistar Top) @ 1ml/L for severe infection',
      'Ensure proper drainage to reduce microclimate humidity'
    ],
    organic_treatment: [
      'Sulfur 80WP dusting @ 10kg/acre in early morning',
      'Neem oil spray (10,000 ppm @ 3ml/L) as anti-sporulant'
    ],
    prevention: [
      'Plant rust-tolerant maize hybrids',
      'Avoid high plant density that traps moisture',
      'Destroy crop residue after harvest to eliminate overwintering spores'
    ]
  },
  {
    id: 'potato_early_blight',
    name: 'Potato Early Blight (Alternaria)',
    crop: 'Potato',
    plantvillage_class: 'Potato___Early_blight',
    confidence: 95.2,
    severity: 'High',
    affected_leaf_area: '34% concentric lesions',
    preview_color: '#5C4033',
    visual_symptoms: ['Concentric dark brown rings forming "target-board" pattern', 'Lesions restricted by leaf veins', 'Yellow halo surrounding older spots'],
    treatment: [
      'Spray Chlorothalonil 75WP @ 2g/L or Mancozeb @ 2.5g/L',
      'Apply Difenoconazole 25EC (Score) @ 0.5ml/L for curative action',
      'Do not harvest tubers from fields with live blighted foliage'
    ],
    organic_treatment: [
      'Trichoderma viride 1% WP spray @ 5g/L',
      'Copper Oxychloride 50WP @ 3g/L organic approved formulation'
    ],
    prevention: [
      'Maintain adequate potassium and nitrogen balance',
      'Adopt 3-year crop rotation with non-solanaceous crops',
      'Destroy wild solanaceous weeds around field borders'
    ]
  },
  {
    id: 'chilli_bacterial_spot',
    name: 'Chilli Bacterial Leaf Spot',
    crop: 'Chilli',
    plantvillage_class: 'Pepper_bell___Bacterial_spot',
    confidence: 91.7,
    severity: 'High',
    affected_leaf_area: '19% necrotic spotting',
    preview_color: '#654321',
    visual_symptoms: ['Small water-soaked circular blisters that turn dark brown', 'Scabby raised lesions with yellow margins', 'Defoliation of infected leaves from bottom upward'],
    treatment: [
      'Spray Streptocycline (1g in 10L water) + Copper Oxychloride (30g in 10L water)',
      'Repeat after 12 days if wet weather persists',
      'Disinfect pruning tools with 10% bleach solution'
    ],
    organic_treatment: [
      'Spray cow urine extract (10% diluted in water)',
      'Bordeaux mixture (1%) protective coat'
    ],
    prevention: [
      'Hot water seed treatment at 50°C for 25 minutes before sowing',
      'Avoid overhead irrigation that splashes bacterial cells between plants'
    ]
  },
  {
    id: 'healthy_leaf',
    name: 'Healthy Crop Leaf',
    crop: 'General',
    plantvillage_class: 'Healthy_Plant_Tissue',
    confidence: 98.7,
    severity: 'Low',
    affected_leaf_area: '0% disease symptoms',
    preview_color: '#10B981',
    visual_symptoms: ['Uniform chlorophyll distribution with no chlorosis', 'Clear intact leaf margins without necrotic lesions', 'Vigorous cell structure and optimal turgor pressure'],
    treatment: [
      'No chemical treatment needed — plant is healthy!',
      'Continue regular nutrient and water management schedule'
    ],
    organic_treatment: [
      'Preventive bi-weekly spray of Panchagavya (3%) or Jeevamrutha to sustain beneficial phyllosphere microbes'
    ],
    prevention: [
      'Maintain regular monitoring traps for early insect detection',
      'Keep field borders free from diseased weed hosts'
    ]
  }
];

// GET /api/disease-model-status (Check real PyTorch ML engine status)
router.get('/disease-model-status', async (req, res) => {
  try {
    const mlRes = await axios.get(`${ML_ENGINE_URL}/disease-model-status`, { timeout: 3000 });
    return res.json({
      success: true,
      data: mlRes.data
    });
  } catch (err) {
    return res.json({
      success: false,
      is_loaded: false,
      error: 'PyTorch MobileNetV2 Deep Learning Inference Engine is currently offline.',
      model_url: ML_ENGINE_URL
    });
  }
});

// GET /api/disease-samples (1-click test leaves for frontend)
router.get('/disease-samples', (req, res) => {
  res.json({
    success: true,
    data: PLANTVILLAGE_SAMPLES
  });
});

// POST /api/disease-detect-image
router.post('/disease-detect-image', async (req, res) => {
  try {
    const { image, sample_id, crop = '' } = req.body;

    if (!image && !sample_id) {
      return res.status(400).json({ success: false, message: 'No leaf photo provided for diagnosis' });
    }

    let imageToSend = image;

    if (sample_id && !imageToSend) {
      const match = PLANTVILLAGE_SAMPLES.find(s => s.id === sample_id);
      if (match && match.sample_image) {
        imageToSend = match.sample_image;
      }
    }

    if (!imageToSend) {
      return res.status(400).json({ success: false, message: 'Invalid or missing leaf photo data' });
    }

    // Call Real Deep Learning PyTorch Inference & Grad-CAM Service
    let mlResponse;
    try {
      mlResponse = await axios.post(`${ML_ENGINE_URL}/predict-disease-image`, {
        image: imageToSend,
        crop: crop
      }, {
        timeout: 35000,
        maxContentLength: 50 * 1024 * 1024
      });
    } catch (mlErr) {
      if (mlErr.response && (mlErr.response.status === 422 || mlErr.response.data?.is_plant === false)) {
        const rejectData = mlErr.response.data || {};
        return res.status(422).json({
          success: false,
          is_plant: false,
          error_type: rejectData.error_type || 'NON_PLANT_OBJECT',
          message: rejectData.error || 'No plant, leaf, or crop detected in this image. Kisan Vision Instant Disease Doctor only analyzes plant leaves and crops. Please capture or upload a clear photo of a crop leaf.',
          reason: rejectData.reason
        });
      }
      console.error('ML inference server unreachable:', mlErr.message);
      return res.status(503).json({
        success: false,
        message: 'The AI Deep Learning Inference Engine is currently unavailable. Please ensure the PyTorch MobileNetV2 service is running on port 5001.'
      });
    }

    const mlData = mlResponse.data;
    if (!mlData || !mlData.success) {
      if (mlData && mlData.is_plant === false) {
        return res.status(422).json({
          success: false,
          is_plant: false,
          error_type: mlData.error_type || 'NON_PLANT_OBJECT',
          message: mlData.error || 'No plant, leaf, or crop detected in this image. Kisan Vision Instant Disease Doctor only analyzes plant leaves and crops. Please capture or upload a clear photo of a crop leaf.',
          reason: mlData.reason
        });
      }
      return res.status(500).json({
        success: false,
        message: mlData?.error || 'AI Deep Learning model failed to classify this leaf.'
      });
    }

    // Retrieve verified agronomic knowledge for the predicted class
    const details = getDiseaseDetails(mlData.class_name);

    const enrichedResult = {
      name: `${mlData.crop} - ${mlData.disease}`,
      crop: mlData.crop,
      disease: mlData.disease,
      plantvillage_class: mlData.class_name,
      confidence: mlData.confidence,
      is_uncertain: mlData.is_uncertain,
      is_healthy: mlData.is_healthy,
      original_image: mlData.original_image,
      heatmap_image: mlData.heatmap_image,
      overlay_image: mlData.overlay_image,
      xai_explanation: mlData.xai_explanation,
      top3: mlData.top3 || [],
      severity: details.severity,
      symptoms: details.symptoms,
      causes: details.causes,
      chemical_management: details.chemical_management,
      biological_management: details.biological_management,
      expert_consultation: details.expert_consultation,
      treatment: details.chemical_management?.registered_products?.map(p => `${p.name} @ ${p.dosage} - ${p.timing}`) || [],
      organic_treatment: [
        ...(details.biological_management?.organic_sprays || []),
        ...(details.biological_management?.cultural_practices?.slice(0, 2) || [])
      ],
      prevention: details.biological_management?.cultural_practices || []
    };

    return res.json({
      success: true,
      data: enrichedResult
    });
  } catch (err) {
    console.error('Image disease detection route error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to analyze leaf photo: ' + err.message });
  }
});

module.exports = router;


