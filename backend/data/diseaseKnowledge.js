// backend/data/diseaseKnowledge.js
// Authoritative Agronomic Knowledge Base for PlantVillage 38 Classes & Indian Crops
// Compliant with ICAR, CIBRC (Central Insecticides Board & Registration Committee), and TNAU Agritech Portal

const DISEASE_DATABASE = {
  // ── APPLE ───────────────────────────────────────────────────────────────────
  'Apple___Apple_scab': {
    crop: 'Apple',
    disease: 'Apple Scab',
    scientific_name: 'Venturia inaequalis',
    severity: 'High',
    symptoms: [
      'Olive-green to dull dark brown velvety spots on upper leaf surfaces',
      'Leaves become curled, distorted, puckered, and drop prematurely',
      'Scabby, corky dark lesions on fruit that may crack open during sizing'
    ],
    causes: [
      'Overwintering pseudothecia in fallen leaf litter',
      'Extended leaf wetness (9+ hours) during spring bud break at 15-22°C'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'At silver tip to green tip stage' },
        { name: 'Captan 50% WP', dosage: '2.0 g/L water', timing: 'At pink bud stage and post-bloom' },
        { name: 'Difenoconazole 25% EC', dosage: '0.3 ml/L water', timing: 'Curative spray within 72h of rain' },
        { name: 'Dodine 65% WP', dosage: '1.0 g/L water', timing: 'During early primary ascospore release' }
      ],
      label_instructions: 'Ensure full foliage coverage (10-15 liters per mature tree). Rotate chemistries (FRAC group 3 with protectants) to prevent fungicide resistance.',
      safety_precautions: [
        'Wear respirator mask, chemical-resistant gloves, and eye protection during spray prep.',
        'Observe minimum 21-day Pre-Harvest Interval (PHI) for Difenoconazole.',
        'Do not apply during windy weather to avoid drift onto honeybee colonies.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus subtilis (Serenade)', application: 'Foliar spray @ 5 ml/L during early vegetative growth' },
        { agent: 'Trichoderma harzianum', application: 'Soil & leaf litter drench to hasten decomposition of fallen leaves' }
      ],
      organic_sprays: [
        'Lime Sulfur spray @ 2% at dormant/bud-swell stage to eradicate overwintering spores',
        'Potassium bicarbonate @ 3g/L combined with horticultural mineral oil (0.5%)',
        'Bordeaux mixture (1:1:100) applied before leaf drop in autumn'
      ],
      cultural_practices: [
        'Shred or till fallen autumn leaves into soil with 5% urea spray to accelerate spore decay',
        'Prune orchard trees to an open vase or central leader canopy for rapid sunlight penetration',
        'Plant resistant cultivars like Prima, Priscilla, and Florina'
      ]
    }
  },

  'Apple___Black_rot': {
    crop: 'Apple',
    disease: 'Black Rot (Frogeye Leaf Spot)',
    scientific_name: 'Botryosphaeria obtusa',
    severity: 'High',
    symptoms: [
      'Small purple flecks enlarging into "frogeye" spots with brown centers and purple borders',
      'Sunken brown cankers on bark and twigs with pycnidia (black dots)',
      'Fruit rot starting at the blossom end, turning brown with concentric bands, then black and mummified'
    ],
    causes: [
      'Fungal infection harbored in dead wood, fire blight cankers, and mummified fruit',
      'Warm humid periods (20-27°C) accompanied by rain splash'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Thiophanate-methyl 70% WP', dosage: '1.0 g/L water', timing: 'At petal fall and cover sprays' },
        { name: 'Captan 50% WP', dosage: '2.0 g/L water', timing: 'Every 10-14 days through harvest' },
        { name: 'Copper Oxychloride 50% WP', dosage: '3.0 g/L water', timing: 'Dormant winter spray on tree trunks' }
      ],
      label_instructions: 'Direct sprays into canopy and over twig cankers. Apply with hydraulic sprayers using cone nozzles.',
      safety_precautions: [
        'Strictly observe 14-day PHI for Captan.',
        'Keep livestock out of treated orchard zones for 48 hours post-spray.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma viride', application: 'Bio-paste applied directly onto pruned twig surfaces' }
      ],
      organic_sprays: [
        'Liquid copper hydroxide @ 2.5g/L during early dormant season',
        'Neem oil 1500 ppm @ 3 ml/L as repellent against bark-boring wound vectors'
      ],
      cultural_practices: [
        'Meticulously prune out all dead, cankered wood and burn clippings immediately outside orchard',
        'Remove all hanging mummified fruits before spring bloom',
        'Disinfect pruning shears with 10% sodium hypochlorite solution between cuts'
      ]
    }
  },

  'Apple___Cedar_apple_rust': {
    crop: 'Apple',
    disease: 'Cedar Apple Rust',
    scientific_name: 'Gymnosporangium juniperi-virginianae',
    severity: 'Medium',
    symptoms: [
      'Bright yellow-orange circular lesions on upper leaf surfaces',
      'Tubular fruiting bodies (aecia) protruding on the leaf underside with curling borders',
      'Distorted leaves with chlorosis leading to early defoliation'
    ],
    causes: [
      'Heteroecious fungus needing both Apple and Eastern Red Cedar / Juniper as alternate hosts',
      'Galls on juniper releasing gelatinous telial horns during warm spring rains'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Myclobutanil 10% WP', dosage: '0.5 g/L water', timing: 'Pink bud to petal fall stage' },
        { name: 'Mancozeb 75% WP', dosage: '2.0 g/L water', timing: 'Preventive shield at bud break' }
      ],
      label_instructions: 'Apply 3 preventive sprays starting from tight cluster through 2nd cover spray.',
      safety_precautions: [
        'Avoid application during high winds (>12 km/h). Use protective boots and eye goggles.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus amyloliquefaciens', application: 'Foliar application at 2.5 ml/L' }
      ],
      organic_sprays: [
        'Sulfur dust or wettable sulfur @ 3g/L before wet rain events',
        'Potassium bicarbonate @ 4g/L as post-infection inhibitor'
      ],
      cultural_practices: [
        'Eradicate wild red cedar and ornamental junipers within a 500-meter radius of the orchard',
        'Hand-prune visible rust galls from nearby juniper trees before spring rains',
        'Cultivate rust-resistant apple varieties (e.g., Liberty, Freedom, Redfree)'
      ]
    }
  },

  'Apple___healthy': {
    crop: 'Apple',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Malus domestica',
    severity: 'Low',
    symptoms: ['Vibrant green color, smooth uniform margins, no necrotic spots or powdery residue.'],
    causes: ['Optimal agronomic care and favorable microclimate.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required. Continue routine pest scouting.',
      safety_precautions: ['Maintain safe fertilizer storage away from water sources.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Beneficial predatory mites (Neoseiulus fallacis)', application: 'Conserve natural orchard habitat' }
      ],
      organic_sprays: ['Panchagavya foliar tonic @ 3% every 20 days during vegetative flush'],
      cultural_practices: ['Balanced N-P-K fertilization based on annual soil tests; regular drip irrigation']
    }
  },

  // ── BLUEBERRY ──────────────────────────────────────────────────────────────
  'Blueberry___healthy': {
    crop: 'Blueberry',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Vaccinium corymbosum',
    severity: 'Low',
    symptoms: ['Clean waxy dark green foliage, no mottling or fungal lesions.'],
    causes: ['Optimal soil pH (4.5–5.2) and adequate moisture.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical fungicides necessary.',
      safety_precautions: ['Follow organic field management protocols.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Mycorrhizal fungi', application: 'Root inoculation at transplanting' }],
      organic_sprays: ['Seaweed extract @ 2 ml/L as nutrient booster'],
      cultural_practices: ['Maintain pine needle or woodchip mulch 3-4 inches deep; avoid overhead watering']
    }
  },

  // ── CHERRY ─────────────────────────────────────────────────────────────────
  'Cherry_(including_sour)___Powdery_mildew': {
    crop: 'Cherry',
    disease: 'Powdery Mildew',
    scientific_name: 'Podosphaera clandestina',
    severity: 'Medium',
    symptoms: [
      'Circular patches of white powdery fungal mycelium on leaves and young shoots',
      'Leaves curl upward, cup, and distort, often turning brown and brittle',
      'Stunted terminal shoot growth and unmarketable fruit with web-like scarring'
    ],
    causes: [
      'Chasmothecia overwintering in orchard bark crevices',
      'Dry foliage with high ambient relative humidity (70-95%) and warm temperatures (18-28°C)'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Hexaconazole 5% EC', dosage: '1.0 ml/L water', timing: 'At first sign of white powdery spots' },
        { name: 'Tebuconazole 25.9% EC', dosage: '0.75 ml/L water', timing: 'Shuck fall to pre-harvest' },
        { name: 'Wettable Sulfur 80% WDG', dosage: '2.5 g/L water', timing: 'Early morning preventive application' }
      ],
      label_instructions: 'Do not spray sulfur when temperatures exceed 30°C to avoid fruit and leaf scald.',
      safety_precautions: [
        'Avoid contact with skin; sulfur is an eye irritant. Wear goggles and long sleeves.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Ampelomyces quisqualis', application: 'Hyperparasitic fungus spray @ 2 g/L' }
      ],
      organic_sprays: [
        'Potassium silicate foliar spray @ 2ml/L to strengthen epidermal leaf cuticle',
        'Cow milk diluted 1:9 with water sprayed under direct sun'
      ],
      cultural_practices: [
        'Prune dense water sprouts in the center of the tree to enhance air flow',
        'Avoid excessive late-season nitrogen applications which promote lush, vulnerable growth'
      ]
    }
  },

  'Cherry_(including_sour)___healthy': {
    crop: 'Cherry',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Prunus cerasus',
    severity: 'Low',
    symptoms: ['Glossy deep-green leaves with sharply serrated clean edges.'],
    causes: ['Balanced orchard nutrition and good fungicide timing.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No fungicide intervention needed.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [],
      organic_sprays: ['Compost tea foliar drench monthly'],
      cultural_practices: ['Maintain drip irrigation lines and seasonal canopy pruning']
    }
  },

  // ── CORN / MAIZE ───────────────────────────────────────────────────────────
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    crop: 'Corn (Maize)',
    disease: 'Cercospora / Gray Leaf Spot',
    scientific_name: 'Cercospora zeae-maydis',
    severity: 'High',
    symptoms: [
      'Small tan spots with yellow halos expanding into long, narrow, rectangular gray-to-tan lesions',
      'Lesions strictly bounded by leaf veins running parallel to length of the blade',
      'Severe blighting of upper canopy leaves leading to stalk lodging and yield collapse'
    ],
    causes: [
      'Pathogen survives in corn crop debris on soil surface under minimum-till practices',
      'Extended periods of fog, high humidity (>90%), and temperatures between 25-30°C'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'At tassel stage (VT) or initial lesion sighting' },
        { name: 'Pyraclostrobin 20% WG', dosage: '0.8 g/L water', timing: 'Preventive at silking' },
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Early vegetative canopy protection' }
      ],
      label_instructions: 'Calibrate tractor boom or drone sprayers to deliver 150-200 L/ha water volume for thorough leaf canopy penetration.',
      safety_precautions: [
        'Keep a 30-day PHI before grain or fodder harvest.',
        'Use full PPE including nitrile gloves and face shield.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum Rifai', application: 'Seed treatment @ 4g/kg seed + foliar spray @ 5g/L' }
      ],
      organic_sprays: [
        'Fermented butter milk + hing (asafoetida) spray (5L sour buttermilk + 50g hing in 100L water)',
        'Copper Hydroxide 53.8% DF @ 2 g/L'
      ],
      cultural_practices: [
        'Deep moldboard plowing to bury infested corn stubble beneath 15 cm of soil',
        'Crop rotation away from corn for at least 2 consecutive seasons (rotate with soybean or groundnut)',
        'Select hybrid seeds with high genetic tolerance to gray leaf spot'
      ]
    }
  },

  'Corn_(maize)___Common_rust_': {
    crop: 'Corn (Maize)',
    disease: 'Common Rust',
    scientific_name: 'Puccinia sorghi',
    severity: 'Medium',
    symptoms: [
      'Oval to elongate cinnamon-brown powdery pustules (uredinia) scattered across both leaf surfaces',
      'Pustules rupture epidermal tissue releasing reddish-brown airborne spores',
      'Late in season, pustules turn brownish-black as teliospores form'
    ],
    causes: [
      'Airborne rust spores blown on prevailing southerly winds from subtropical regions',
      'Cool to moderate temperatures (16-25°C) combined with high humidity and heavy dews'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Propiconazole 25% EC', dosage: '1.0 ml/L water', timing: 'Apply when pustules appear on lower 3 leaves before silking' },
        { name: 'Tebuconazole 25.9% EC', dosage: '1.0 ml/L water', timing: 'Apply at 10-14 day intervals if rust pressure remains high' }
      ],
      label_instructions: 'Spray at 500 liters of water per hectare. Treat fields when 6 or more rust pustules per leaf appear on mid-canopy leaves.',
      safety_precautions: [
        'Do not graze livestock in treated fields within 30 days of application.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens', application: 'Seed dressing @ 10g/kg + foliar spray @ 10g/L' }
      ],
      organic_sprays: [
        'Wettable sulfur @ 3g/L applied at early morning dew point',
        'Neem extract (NSKE 5%) sprayed at early vegetative stage'
      ],
      cultural_practices: [
        'Plant resistant maize hybrids possessing Rp single-gene or multi-genic resistance',
        'Early planting to escape high late-season spore showers',
        'Maintain balanced nitrogen:potash fertilization to avoid overly succulence'
      ]
    }
  },

  'Corn_(maize)___Northern_Leaf_Blight': {
    crop: 'Corn (Maize)',
    disease: 'Northern Corn Leaf Blight (NCLB)',
    scientific_name: 'Exserohilum turcicum',
    severity: 'High',
    symptoms: [
      'Large, long, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long) with smooth margins',
      'Dark olive or black fungal sporulation visible within lesions during damp humid mornings',
      'Extensive blighting of entire leaves giving field a burnt or frosted appearance'
    ],
    causes: [
      'Fungus overwinters as conidia and chlamydospores in infected corn crop residue',
      'Moderate temperatures (18-27°C) with persistent rain, morning fog, or heavy dew'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Early stage preventive barrier' },
        { name: 'Azoxystrobin 11% + Tebuconazole 18.3% SC', dosage: '1.0 ml/L water', timing: 'Curative spray at onset of cigar-shaped lesions' }
      ],
      label_instructions: 'Ensure upper leaves supporting the ear (ear leaf +/- 2 leaves) are completely protected.',
      safety_precautions: ['Wear standard chemical goggles, rubber boots, and chemical-proof gloves.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma viride', application: 'Soil enrichment with well-rotted FYM (Farmyard Manure) @ 2.5 kg/ha' }
      ],
      organic_sprays: [
        'Bordeaux mixture (1%) spray on young plants before tassel emergence',
        'Garlic bulb extract (5%) as natural antifungal spray'
      ],
      cultural_practices: [
        'Two-year crop rotation out of corn to break fungal spore cycle in soil residue',
        'Thorough post-harvest tillage to accelerate breakdown of infected corn stalks',
        'Choose certified blight-resistant hybrid varieties'
      ]
    }
  },

  'Corn_(maize)___healthy': {
    crop: 'Corn (Maize)',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Zea mays',
    severity: 'Low',
    symptoms: ['Broad, arching vibrant green leaves with sturdy white midribs and clean leaf blades.'],
    causes: ['Optimal soil moisture, balanced nitrogen top-dressing, and weed-free field.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['Store all farm chemicals in locked cabinets.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma viride', application: 'Soil application at sowing' }],
      organic_sprays: ['Jeevamrutha soil drenching during vegetative stage @ 200 L/acre'],
      cultural_practices: ['Maintain proper plant spacing (60 x 20 cm) and furrow irrigation']
    }
  },

  // ── GRAPE ──────────────────────────────────────────────────────────────────
  'Grape___Black_rot': {
    crop: 'Grape',
    disease: 'Black Rot',
    scientific_name: 'Guignardia bidwellii',
    severity: 'Critical',
    symptoms: [
      'Small, circular reddish-brown spots with dark brown margins on leaves',
      'Tiny black pycnidia pimples forming in ring patterns inside leaf lesions',
      'Berries rot rapidly, shrivel, turn bluish-black, and transform into hard, wrinkly mummies'
    ],
    causes: [
      'Pathogen overwintering in cane lesions and shriveled fruit mummies on the vine or ground',
      'Warm wet weather (21-32°C) with free water on foliage for over 7 hours'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Kresoxim-methyl 44.3% SC', dosage: '0.7 ml/L water', timing: 'Bud break through fruit set' },
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'At 10 cm shoot growth and pre-bloom' },
        { name: 'Myclobutanil 10% WP', dosage: '0.5 g/L water', timing: 'Post-bloom cover sprays' }
      ],
      label_instructions: 'Spray canopy thoroughly from both sides of the trellis row. Pay special attention to fruit clusters.',
      safety_precautions: ['Pre-Harvest Interval (PHI) of 30 days must be strictly observed.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus subtilis', application: 'Preventive spray @ 3 ml/L every 7-10 days' }
      ],
      organic_sprays: [
        'Copper Oxychloride 50% WP @ 2.5 g/L during dormant vine stage',
        'Lime sulfur spray during late winter before bud swell'
      ],
      cultural_practices: [
        'Meticulously hand-pick and destroy all mummified grape clusters during winter pruning',
        'Prune and tie shoots to open the canopy to maximum sunlight and quick drying breeze',
        'Maintain clean herbicide strips or cultivated soil beneath trellis wire'
      ]
    }
  },

  'Grape___Esca_(Black_Measles)': {
    crop: 'Grape',
    disease: 'Esca / Black Measles',
    scientific_name: 'Phaeomoniella chlamydospora & Phaeoacremonium aleophilum',
    severity: 'High',
    symptoms: [
      'Classic "tiger-stripe" pattern of interveinal chlorosis and necrosis on leaves',
      'Small dark purplish-brown circular speckles on berry skins ("measles")',
      'Sudden apoplexy (vine collapse and wilting in hot midsummer) and spongy wood decay'
    ],
    causes: [
      'Trunk-invading vascular fungal complex entering through pruning wounds',
      'Stressful dry hot spells following wet spring growth'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Thiophanate-methyl paste', dosage: 'Direct wound seal', timing: 'Immediately after winter pruning' },
        { name: 'Fosetyl-Al 80% WP', dosage: '2.5 g/L water', timing: 'Foliar systemic uptake to relieve vine stress' }
      ],
      label_instructions: 'Seal all fresh pruning wounds >1 inch in diameter within 2 hours using paint or fungicide paste.',
      safety_precautions: ['Wear waterproof gloves when applying chemical trunk wound protectants.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma atroviride / T. gamsii', application: 'Bio-wound protectant spray onto pruning cuts' }
      ],
      organic_sprays: [
        'Sodium silicate solution (2%) trunk paint',
        'Equisetum (Horsetail herb) extract drench'
      ],
      cultural_practices: [
        'Delay pruning until late winter (double pruning method) when spore release is lower',
        'Prune in completely dry weather and disinfect loppers between vines with 70% alcohol',
        'Mark and uproot hopelessly collapsed apoplectic vines to protect vineyard perimeter'
      ]
    }
  },

  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    crop: 'Grape',
    disease: 'Leaf Blight (Isariopsis Clavispora)',
    scientific_name: 'Phaeoisariopsis vitis',
    severity: 'Medium',
    symptoms: [
      'Angular, dark reddish-brown to black spots (2-6 mm) with yellow haloes on leaves',
      'Sooty brown velvety growth on underside of spots during humid spells',
      'Premature leaf fall causing unripened bunches and poor cane maturation'
    ],
    causes: [
      'Airborne conidia favored by high humidity (80%+) and temperatures of 22-30°C',
      'Dense unpruned foliage in shaded parts of vine canopy'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water', timing: 'At onset of angular spots' },
        { name: 'Azoxystrobin 23% SC', dosage: '1.0 ml/L water', timing: 'Post-flowering protective spray' }
      ],
      label_instructions: 'Apply 750 L/ha water volume with high-pressure air-assisted vineyard blast sprayer.',
      safety_precautions: ['Do not enter vineyard within 24 hours of application without protective gear.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5 g/L' }
      ],
      organic_sprays: [
        'Bordeaux mixture (0.8%) after canopy pruning',
        'Neem oil 3000 ppm @ 2 ml/L'
      ],
      cultural_practices: [
        'Canopy shoot positioning and leaf stripping around bunches to improve airflow',
        'Destroy infected leaves dropped in vineyard basins'
      ]
    }
  },

  'Grape___healthy': {
    crop: 'Grape',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Vitis vinifera',
    severity: 'Low',
    symptoms: ['Uniformly green lobed leaves, strong tendril growth, free from chlorotic mottling.'],
    causes: ['Adequate trellis management, balanced fertigation, and preventative scouting.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical fungicides necessary.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [],
      organic_sprays: ['Panchagavya foliar spray @ 3%'],
      cultural_practices: ['Canopy shoot thinning and controlled drip fertigation according to veraison stage']
    }
  },

  // ── CITRUS / ORANGE ────────────────────────────────────────────────────────
  'Orange___Haunglongbing_(Citrus_greening)': {
    crop: 'Orange (Citrus)',
    disease: 'Citrus Greening (Huanglongbing - HLB)',
    scientific_name: 'Candidatus Liberibacter asiaticus',
    severity: 'Critical',
    symptoms: [
      'Blotchy, asymmetrical yellow mottling on leaves that crosses leaf veins',
      'Small upright leaves resembling zinc deficiency with prominent green veins ("rabbit ears")',
      'Lopsided, small, bitter fruit that stays green at the blossom end; excessive fruit drop'
    ],
    causes: [
      'Phloem-limited bacterium transmitted by the Asian Citrus Psyllid (Diaphorina citri)',
      'Grafting infected budwood'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Imidacloprid 17.8% SL', dosage: '0.5 ml/L water', timing: 'Targeting psyllid nymphs on new flushes' },
        { name: 'Thiamethoxam 25% WG', dosage: '0.3 g/L water', timing: 'Foliar or soil drench around feeder roots' },
        { name: 'Zinc Sulphate + Manganese Sulphate', dosage: '5 g/L each foliar', timing: 'Nutritional therapy to mitigate deficiency' }
      ],
      label_instructions: 'There is no chemical cure for the bacterium itself; all chemical management is strictly directed at suppressing the vector psyllid population.',
      safety_precautions: [
        'Imidacloprid is highly toxic to bees. NEVER apply during peak citrus bloom.',
        'Use full chemical protective mask and splash goggles.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Tamarixia radiata', application: 'Release of parasitic wasps to parasitize citrus psyllid nymphs' },
        { agent: 'Ladybird beetles & lacewings', application: 'Preserve natural insect predators in citrus groves' }
      ],
      organic_sprays: [
        'Horticultural mineral oil (1.5%) + Neem oil (3 ml/L) on tender vegetative flushes to deter psyllid egg-laying',
        'Kaolin clay particle film (Surround WP @ 30 g/L) to disguise foliage from psyllids'
      ],
      cultural_practices: [
        'Source only certified disease-free, shoot-tip grafted nursery stock from insect-proof screenhouses',
        'Scout grove weekly with yellow sticky cards; immediately dig up and burn confirmed infected trees',
        'Maintain strict orchard sanitation and quarantine against transport of citrus vegetative cuttings'
      ]
    }
  },

  // ── PEACH ──────────────────────────────────────────────────────────────────
  'Peach___Bacterial_spot': {
    crop: 'Peach',
    disease: 'Bacterial Spot',
    scientific_name: 'Xanthomonas arboricola pv. pruni',
    severity: 'High',
    symptoms: [
      'Water-soaked angular lesions turning purple-brown, then falling out to leave a "shot-hole" look',
      'Tip dieback of young twigs (spring cankers) with gum exudation',
      'Pitted, cracked, sunken black lesions on fruit surface with bacterial gumming'
    ],
    causes: [
      'Bacterium overwintering in twig cankers and buds',
      'Warm wet spring weather with blowing rain and windblown sand causing leaf abrasion'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Copper Hydroxide 77% WP', dosage: '2.0 g/L water', timing: 'At dormant season and bud swell' },
        { name: 'Oxytetracycline 20% WP', dosage: '1.5 g/L water', timing: 'Shuck split to harvest cover sprays' }
      ],
      label_instructions: 'Avoid high copper rates on emerged foliage to prevent phytotoxic leaf burning and fruit russetting.',
      safety_precautions: ['Follow label-specified PHI for antibiotic treatments (minimum 21 days).']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus subtilis / B. amyloliquefaciens', application: 'Preventative foliar spray @ 5 ml/L' }
      ],
      organic_sprays: [
        'Bordeaux mixture (1%) at bud break',
        'Hydrated lime spray @ 5g/L to buffer leaf surface pH against bacterial multiplication'
      ],
      cultural_practices: [
        'Plant windbreaks around the orchard perimeter to prevent sandblasting and leaf wounding',
        'Avoid excessive nitrogen fertilization which creates succulent, easily-penetrated shoots',
        'Select resistant peach cultivars (e.g., Candor, Dixired, Harvester)'
      ]
    }
  },

  'Peach___healthy': {
    crop: 'Peach',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Prunus persica',
    severity: 'Low',
    symptoms: ['Bright green lanceolate leaves with undulating clean borders and firm texture.'],
    causes: ['Optimal stone fruit orchard management and tree nutrition.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [],
      organic_sprays: ['Fish amino acid tonic @ 2 ml/L'],
      cultural_practices: ['Annual dormant pruning and regular weed control around tree basins']
    }
  },

  // ── BELL PEPPER / CHILLI ───────────────────────────────────────────────────
  'Pepper,_bell___Bacterial_spot': {
    crop: 'Bell Pepper / Chilli',
    disease: 'Bacterial Spot',
    scientific_name: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'High',
    symptoms: [
      'Small, circular, water-soaked spots on leaves that turn dark brown to black with yellow halos',
      'Lesions drop out, giving leaves a ragged, shot-hole appearance followed by severe defoliation',
      'Raised, wart-like brown scabs on bell pepper and chilli fruit surfaces'
    ],
    causes: [
      'Seed-borne bacterium or survival in solanaceous crop residues',
      'High temperatures (24-30°C) with persistent rain splash, overhead irrigation, or heavy morning dew'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Copper Oxychloride 50% WP + Streptocycline', dosage: '2.5 g + 0.1 g / L water', timing: 'At first appearance of spots' },
        { name: 'Copper Hydroxide 77% WP', dosage: '2.0 g/L water', timing: 'Every 7-10 days during rainy spells' },
        { name: 'Kasugamycin 3% SL', dosage: '2.0 ml/L water', timing: 'Curative spray for systemic control' }
      ],
      label_instructions: 'Apply 500 liters/ha with hollow-cone nozzles ensuring undersides of leaves are well coated.',
      safety_precautions: [
        'Do not apply during mid-day heat (>32°C) to prevent copper phytotoxicity.',
        'Wear chemical apron, nitrile gloves, and mist mask.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens', application: 'Seed treatment @ 10g/kg + foliar spray @ 5g/L' },
        { agent: 'Bacillus subtilis', application: 'Soil drenching around transplant root zone' }
      ],
      organic_sprays: [
        'Bordeaux mixture (0.5% - 1%)',
        'Fermented sour buttermilk spray (1:10 dilution in water)'
      ],
      cultural_practices: [
        'Use certified disease-free hot water treated seeds (50°C for 25 minutes)',
        'Switch from overhead sprinkler irrigation to root-zone drip irrigation',
        'Rotate away from Solanaceae (tomatoes, potatoes, peppers) for 2 to 3 years'
      ]
    }
  },

  'Pepper,_bell___healthy': {
    crop: 'Bell Pepper / Chilli',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Capsicum annuum',
    severity: 'Low',
    symptoms: ['Uniform, deep-green, crisp leaves without blemishes or marginal scorch.'],
    causes: ['Balanced soil fertility, drip irrigation, and integrated pest management.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Arbuscular Mycorrhizal Fungi (AMF)', application: 'Nursery bed soil treatment' }],
      organic_sprays: ['Vermiwash foliar application @ 5% every 15 days'],
      cultural_practices: ['Mulching with silver-black polyethylene mulch film to conserve moisture and suppress weeds']
    }
  },

  // ── POTATO ─────────────────────────────────────────────────────────────────
  'Potato___Early_blight': {
    crop: 'Potato',
    disease: 'Early Blight',
    scientific_name: 'Alternaria solani',
    severity: 'Medium',
    symptoms: [
      'Dark brown to black oval or angular spots showing distinctive concentric rings ("target board" pattern)',
      'Lesions usually start on older, lower leaves and spread upward through the canopy',
      'Leaves become chlorotic, wither, and hang dry on the stem ("firing")'
    ],
    causes: [
      'Fungus survives in potato tubers, volunteer potatoes, and dry solanaceous crop debris',
      'Alternating wet and dry cycles with temperatures around 24-29°C'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Preventive spray at 45 days after planting' },
        { name: 'Chlorothalonil 75% WP', dosage: '2.0 g/L water', timing: 'At first target spot detection' },
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'Curative spray in severe outbreaks' }
      ],
      label_instructions: 'Ensure full coverage of both upper and lower canopy leaves. Repeat spray at 10-14 day intervals.',
      safety_precautions: [
        'Chlorothalonil is a severe eye irritant. Wear splash-proof goggles and protective overalls.',
        'Observe a 14-day Pre-Harvest Interval.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum', application: 'Tuber dip @ 10g/L water for 15 mins before planting' }
      ],
      organic_sprays: [
        'Copper Oxychloride 50% WP @ 3.0 g/L',
        'Neem Seed Kernel Extract (NSKE 5%)',
        'Cow urine decoction (1:10) with asafoetida'
      ],
      cultural_practices: [
        'Maintain vigorous plant nutrition; early blight targets stressed and nitrogen-deficient plants',
        'Harvest tubers only when skins have matured (cured) to prevent Alternaria tuber rot during storage',
        'Destroy volunteer potato plants and nightshade weeds near field borders'
      ]
    }
  },

  'Potato___Late_blight': {
    crop: 'Potato',
    disease: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    severity: 'Critical',
    symptoms: [
      'Irregular, water-soaked pale-green to brown lesions expanding rapidly from leaf tips and margins',
      'White cottony or velvety downy mildew growth on underside of leaves in humid mornings',
      'Foul rotting smell in field; rapid blackening and collapse of entire vine within 4-7 days',
      'Tubers develop dry, sunken purplish-brown surface lesions with reddish-brown granular rot inside'
    ],
    causes: [
      'Oomycete pathogen harbored in infected seed tubers or cull piles',
      'Cool temperatures (10-21°C) with persistent relative humidity (>90%) and rain'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Cymoxanil 8% + Mancozeb 64% WP', dosage: '2.5 g/L water', timing: 'Apply immediately upon local blight forecast' },
        { name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil)', dosage: '2.5 g/L water', timing: 'Systemic curative spray at earliest sign' },
        { name: 'Dimethomorph 50% WP', dosage: '1.0 g/L water', timing: 'Alternate spray to prevent phenylamide resistance' },
        { name: 'Mandipropamid 23.4% SC', dosage: '0.8 ml/L water', timing: 'High rain pressure systemic lock' }
      ],
      label_instructions: 'Critical emergency: Spray must be applied within 24 hours of disease appearance. Spray volume: 600-750 L/ha.',
      safety_precautions: [
        'Strictly enforce 7-14 day Pre-Harvest Interval (PHI).',
        'Wear chemical respirator, neoprene gloves, and eye shield.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma viride', application: 'Soil application mixed with FYM at 2.5 kg/ha' },
        { agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5g/L prior to disease onset' }
      ],
      organic_sprays: [
        'Bordeaux mixture (1%) as protective barrier spray before rainy spells',
        'Copper Hydroxide 77% WP @ 2g/L water',
        'Horsetail (Equisetum arvense) extract spray @ 10%'
      ],
      cultural_practices: [
        'Plant only certified pathogen-tested seed tubers (CPRI certified)',
        'High earthing-up (hilling) of potato ridges to create a 10-15 cm soil barrier over growing tubers',
        'Destroy all cull piles and haulm (vines) with chemical desiccant or cutting 14 days before harvest',
        'Never irrigate late in the evening'
      ]
    }
  },

  'Potato___healthy': {
    crop: 'Potato',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Solanum tuberosum',
    severity: 'Low',
    symptoms: ['Dark green, vigorous pinnate foliage, robust stems, no spotting or curling.'],
    causes: ['Clean seed tubers, timely earthing up, and balanced N-P-K.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No fungicide intervention needed.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma harzianum', application: 'Seed tuber dressing' }],
      organic_sprays: ['Seaweed extract @ 2 ml/L at tuber initiation stage'],
      cultural_practices: ['Maintain proper ridge geometry and avoid waterlogging in furrows']
    }
  },

  // ── RASPBERRY & SOYBEAN ────────────────────────────────────────────────────
  'Raspberry___healthy': {
    crop: 'Raspberry',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Rubus idaeus',
    severity: 'Low',
    symptoms: ['Serrated, vibrant green leaves with pale undersides and strong canes.'],
    causes: ['Well-drained acidic soil and adequate trellising.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [],
      organic_sprays: ['Compost tea drench'],
      cultural_practices: ['Prune old fruited floricanes to ground level post-harvest']
    }
  },

  'Soybean___healthy': {
    crop: 'Soybean',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Glycine max',
    severity: 'Low',
    symptoms: ['Trifoliate lush green leaves, upright canopy, excellent nodulation on roots.'],
    causes: ['Rhizobium seed inoculation and optimal monsoon distribution.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Bradyrhizobium japonicum', application: 'Seed inoculation at sowing' }],
      organic_sprays: ['Panchagavya foliar spray @ 3% during flowering'],
      cultural_practices: ['Broad bed and furrow (BBF) planting for drainage']
    }
  },

  // ── SQUASH / CUCURBITS ─────────────────────────────────────────────────────
  'Squash___Powdery_mildew': {
    crop: 'Squash / Cucurbits',
    disease: 'Powdery Mildew',
    scientific_name: 'Podosphaera xanthii',
    severity: 'Medium',
    symptoms: [
      'Talcum powder-like white fungal patches on upper and lower surfaces of leaves and stems',
      'Infected leaves turn yellow, then brown, become dry and papery ("parchment like")',
      'Premature defoliation leads to sunscald on maturing squash/pumpkins and reduced sugar content'
    ],
    causes: [
      'Airborne conidia favored by dense shaded canopy, warm days (22-30°C), and high nighttime humidity'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Hexaconazole 5% SC', dosage: '1.0 ml/L water', timing: 'At first white powdery speckle' },
        { name: 'Azoxystrobin 23% SC', dosage: '1.0 ml/L water', timing: 'Curative spray' },
        { name: 'Wettable Sulfur 80% WP', dosage: '2.0 g/L water', timing: 'Preventive on non-sulfur-sensitive cucurbits' }
      ],
      label_instructions: 'Note: Certain squash varieties are sulfur-sensitive; test on small patch or use Hexaconazole/Azoxystrobin.',
      safety_precautions: [
        'Do not spray when air temp exceeds 32°C.',
        'Observe 7-day PHI before fruit picking.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus subtilis', application: 'Foliar spray @ 5 ml/L every 7 days' }
      ],
      organic_sprays: [
        'Potassium bicarbonate @ 4 g/L + 1 ml/L vegetable oil and mild surfactant',
        'Diluted raw milk spray (10% milk in water) under morning sunlight'
      ],
      cultural_practices: [
        'Trellis vines or provide wide plant spacing (1.5 - 2 meters) for rapid leaf drying',
        'Avoid overhead sprinkler irrigation; always use drip lines directly at root crown',
        'Promptly bury or compost heavily mildewed crop vines after harvest'
      ]
    }
  },

  // ── STRAWBERRY ─────────────────────────────────────────────────────────────
  'Strawberry___Leaf_scorch': {
    crop: 'Strawberry',
    disease: 'Leaf Scorch',
    scientific_name: 'Diplocarpon earlianum',
    severity: 'Medium',
    symptoms: [
      'Numerous small, irregular, purplish spots (1-5 mm) developing on upper leaf surface',
      'Centers of spots darken to purple-brown (no white center, distinguishing it from leaf spot)',
      'Lesions coalesce causing entire leaf blade to turn red, then brown, curl upward, and look scorched'
    ],
    causes: [
      'Fungus overwinters in living infected green leaves',
      'Extended leaf wetness (12+ hours) at 15-25°C'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Captan 50% WP', dosage: '2.0 g/L water', timing: 'At emergence of new spring leaves' },
        { name: 'Azoxystrobin 23% SC', dosage: '0.8 ml/L water', timing: 'Pre-bloom cover spray' }
      ],
      label_instructions: 'Direct sprays into plant crowns. Calibrate sprayers to thoroughly cover leaf undersides.',
      safety_precautions: ['Pre-Harvest Interval (PHI) of 3-7 days for Captan must be adhered to.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum', application: 'Root dip & foliar spray @ 5g/L' }
      ],
      organic_sprays: [
        'Copper Hydroxide 50% WP @ 2.0 g/L applied before flowering',
        'Equisetum (Horsetail) decoction @ 5% as silica leaf strengthener'
      ],
      cultural_practices: [
        'Plant on raised strawberry beds with black plastic mulch to eliminate soil splash',
        'Mow and incorporate strawberry foliage immediately after final crop harvest',
        'Select scorch-resistant cultivars (e.g., Honeoye, Allstar)'
      ]
    }
  },

  'Strawberry___healthy': {
    crop: 'Strawberry',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Fragaria x ananassa',
    severity: 'Low',
    symptoms: ['Lush trifoliate deep-green leaves with clean serrated margins and no purplish speckles.'],
    causes: ['Optimal bed drainage, plastic mulching, and balanced fertigation.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [],
      organic_sprays: ['Bio-fertilizer foliar drench (NPK consortia) @ 5 ml/L'],
      cultural_practices: ['Maintain drip tape under plastic mulch and prune older runners']
    }
  },

  // ── TOMATO ─────────────────────────────────────────────────────────────────
  'Tomato___Bacterial_spot': {
    crop: 'Tomato',
    disease: 'Bacterial Spot',
    scientific_name: 'Xanthomonas perforans / X. vesicatoria',
    severity: 'High',
    symptoms: [
      'Small, dark, greasy water-soaked circular spots (1-3 mm) on leaves that turn black with a yellow halo',
      'Centers of spots may dry and drop out, leaving a torn or ragged look',
      'Sunken brown scabs with cracked margins on green fruits',
      'Extensive lower canopy defoliation exposing developing tomatoes to sunscald'
    ],
    causes: [
      'Seed-borne bacterium surviving in tomato crop residue or volunteer solanaceous weeds',
      'Warm temperatures (24-30°C) with persistent rains, sprinkler splashing, or dew'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Copper Hydroxide 77% WP + Streptocycline', dosage: '2.0 g + 0.1 g / L water', timing: 'At first detection of spots' },
        { name: 'Copper Oxychloride 50% WP + Mancozeb 75% WP', dosage: '2.5 g + 2.0 g / L water', timing: 'Tank mix to overcome bacterial copper tolerance' },
        { name: 'Kasugamycin 3% SL', dosage: '1.5 ml/L water', timing: 'Systemic spray in severe localized outbreaks' }
      ],
      label_instructions: 'Apply 500 L/ha water volume. Tank-mixing copper with Mancozeb significantly enhances bacterial control compared to copper alone.',
      safety_precautions: [
        'Avoid spraying during high mid-day solar radiation to prevent leaf burn.',
        'Observe minimum 7-day PHI before fruit picking.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacteriophages (OmniLytics AgriPhage)', application: 'Targeted biological viral sprays active against Xanthomonas' },
        { agent: 'Bacillus amyloliquefaciens', application: 'Preventive foliar application @ 5 ml/L' }
      ],
      organic_sprays: [
        'Bordeaux mixture (0.5% - 1%)',
        'Fermented sour buttermilk spray (1L sour curd in 10L water)'
      ],
      cultural_practices: [
        'Use only hot-water treated or certified disease-free certified hybrid seeds',
        'Use drip irrigation; never irrigate with overhead sprinklers',
        'Rotate tomato fields with non-solanaceous crops (e.g. maize, beans) for at least 2 years'
      ]
    }
  },

  'Tomato___Early_blight': {
    crop: 'Tomato',
    disease: 'Early Blight',
    scientific_name: 'Alternaria solani',
    severity: 'Medium',
    symptoms: [
      'Dark brown to black circular lesions showing distinct concentric rings ("target board" rings)',
      'Lesions surrounded by diffuse yellow chlorotic halo',
      'Disease progresses from lower mature leaves upward, leading to severe leaf drop and stem collar rot'
    ],
    causes: [
      'Fungus survives in infected crop residue, nightshade weeds, and volunteer tomatoes',
      'Warm humid weather (24-29°C) with prolonged leaf wetness'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Preventive spray at 30 days after transplant' },
        { name: 'Chlorothalonil 75% WP', dosage: '2.0 g/L water', timing: 'At first appearance of target spots' },
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'Curative spray in dense canopies' }
      ],
      label_instructions: 'Thorough coverage of lower leaf tiers is essential. Spray every 10 days during rainy weather.',
      safety_precautions: [
        'Pre-Harvest Interval (PHI): 5 days for Mancozeb, 7 days for Chlorothalonil.',
        'Wear chemical-resistant gloves, eye goggles, and long-sleeved overalls.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma viride', application: 'Seedling root dip @ 10g/L for 30 minutes before transplanting' },
        { agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5g/L at 15-day intervals' }
      ],
      organic_sprays: [
        'Copper Oxychloride 50% WP @ 2.5 g/L',
        'Neem Seed Kernel Extract (NSKE 5%)',
        'Baking soda (Sodium bicarbonate) @ 5g/L with 2 ml liquid soap'
      ],
      cultural_practices: [
        'Prune out the lowest 30 cm of tomato foliage to prevent soil splash onto lower leaves',
        'Stake and trellis tomato vines to keep all foliage and fruit well off the ground',
        'Mulch around plants with straw or plastic to create a barrier over soilborne fungal spores'
      ]
    }
  },

  'Tomato___Late_blight': {
    crop: 'Tomato',
    disease: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    severity: 'Critical',
    symptoms: [
      'Large, irregular, water-soaked greenish-black lesions that enlarge with astonishing speed',
      'White downy fungal growth on the underside of infected leaves in high humidity',
      'Stems develop greasy brown-to-black lesions causing entire plant collapse in 3-5 days',
      'Firm, wrinkled, greasy golden-brown rot on green and ripe tomato fruit'
    ],
    causes: [
      'Airborne sporangia carried for miles on storm winds',
      'Cool, foggy, wet weather (15-21°C) with continuous high humidity (>90%)'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Cymoxanil 8% + Mancozeb 64% WP', dosage: '2.5 g/L water', timing: 'Emergency application at earliest symptom' },
        { name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ)', dosage: '2.5 g/L water', timing: 'Systemic curative spray within 24-48 hours' },
        { name: 'Dimethomorph 50% WP', dosage: '1.0 g/L water', timing: 'Alternate spray to avoid metalaxyl resistance' },
        { name: 'Famoxadone 16.6% + Cymoxanil 22.1% SC', dosage: '1.0 ml/L water', timing: 'High rain pressure protector' }
      ],
      label_instructions: 'Late blight is an agronomic emergency. Calibrate sprayers to apply 600 L/ha water. Ensure complete wetness of every leaf surface.',
      safety_precautions: [
        'Observe minimum 7-day PHI.',
        'Use complete personal protective equipment (PPE): respirator, rubber boots, and chemical apron.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum', application: 'Soil enrichment with well-decomposed manure' },
        { agent: 'Bacillus subtilis', application: 'Foliar spray @ 5 ml/L applied prior to forecasted rain events' }
      ],
      organic_sprays: [
        'Bordeaux mixture (1%) preventive barrier before onset of rain storms',
        'Copper Hydroxide 77% WP @ 2.0 g/L',
        'Potassium phosphite foliar drench @ 3 ml/L to trigger systemic acquired resistance'
      ],
      cultural_practices: [
        'Never plant tomatoes immediately adjacent to or downwind from potato fields',
        'Immediately bag, remove, and destroy (burn or bury 50 cm deep) any confirmed infected plants',
        'Do not work in wet fields to avoid mechanically transmitting sporangia across rows',
        'Cultivate resistant tomato varieties (e.g., Mountain Magic, Defiant PhR, Plum Regal)'
      ]
    }
  },

  'Tomato___Leaf_Mold': {
    crop: 'Tomato',
    disease: 'Leaf Mold',
    scientific_name: 'Passalora fulva (syn. Cladosporium fulvum)',
    severity: 'Medium',
    symptoms: [
      'Pale green to yellowish diffuse spots on the upper leaf surface with indefinite borders',
      'Dense, velvety, olive-green to brownish-gray mold on the corresponding lower leaf surface',
      'Leaves curl, turn brown, wither, and drop off, starting from the lower canopy in greenhouse crops'
    ],
    causes: [
      'High relative humidity (>85%) and moderate temperatures (20-25°C)',
      'Extremely common in polyhouses, greenhouses, and densely packed humid fields'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Difenoconazole 25% EC', dosage: '0.5 ml/L water', timing: 'At first sign of yellowish spots' },
        { name: 'Chlorothalonil 75% WP', dosage: '2.0 g/L water', timing: 'Preventive application in high tunnel greenhouses' },
        { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water', timing: 'Protective foliage spray' }
      ],
      label_instructions: 'Spray undersides of leaves thoroughly. Repeat at 7-10 day intervals in protected cultivation.',
      safety_precautions: ['Ventilate greenhouse for at least 4 hours after application before re-entry.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma viride', application: 'Foliar spray @ 5 g/L' }
      ],
      organic_sprays: [
        'Copper sulfate + slaked lime (Bordeaux mixture 0.5%)',
        'Potassium bicarbonate @ 3 g/L + horticultural oil (0.5%)'
      ],
      cultural_practices: [
        'Maximize greenhouse / polyhouse ventilation with exhaust fans and open side curtains',
        'Increase plant spacing and prune lower suckers to maintain relative humidity below 80%',
        'Use drip irrigation; keep nighttime greenhouse temperatures above dew point to avoid condensation'
      ]
    }
  },

  'Tomato___Septoria_leaf_spot': {
    crop: 'Tomato',
    disease: 'Septoria Leaf Spot',
    scientific_name: 'Septoria lycopersici',
    severity: 'High',
    symptoms: [
      'Numerous small, circular spots (1.5-3 mm) with dark brown margins and sunken grayish-white centers',
      'Tiny black pimple-like fruiting bodies (pycnidia) clearly visible in the gray center of each spot',
      'Leaves turn yellow, brown, and drop off rapidly from base to top, exposing tomatoes to sunburn'
    ],
    causes: [
      'Fungus survives on overwintering solanaceous crop debris and nightshade weeds',
      'Splashing raindrops, warm temperatures (20-25°C), and wet leaf surfaces'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Chlorothalonil 75% WP', dosage: '2.0 g/L water', timing: 'At first appearance of gray-centered spots' },
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Preventative cover spray every 7-10 days' },
        { name: 'Azoxystrobin 23% SC', dosage: '1.0 ml/L water', timing: 'Curative spray in heavy outbreaks' }
      ],
      label_instructions: 'Direct nozzle spray into inner and lower canopy where Septoria originates.',
      safety_precautions: ['Pre-Harvest Interval (PHI) of 7 days for Chlorothalonil. Wear chemical gloves.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Bacillus subtilis', application: 'Preventive spray @ 5 ml/L' }
      ],
      organic_sprays: [
        'Copper Hydroxide 77% WP @ 2.0 g/L',
        'Neem oil 1500 ppm @ 3 ml/L as repellent and fungal inhibitor'
      ],
      cultural_practices: [
        'Bottom-prune tomato plants up to 45 cm from soil level once plants reach 1 meter height',
        'Apply thick organic straw or plastic mulch to stop rain-splash from soil',
        'Practice a 3-year crop rotation without tomatoes, eggplants, or potatoes'
      ]
    }
  },

  'Tomato___Spider_mites Two-spotted_spider_mite': {
    crop: 'Tomato',
    disease: 'Two-Spotted Spider Mite Infestation',
    scientific_name: 'Tetranychus urticae',
    severity: 'High',
    symptoms: [
      'Fine white, yellow, or bronze stippling / speckling across the upper leaf surface',
      'Silken web threads enveloping leaf undersides, flower clusters, and growing tips',
      'Leaves turn yellow, curl, dry out like parchment, and plant vigor crashes rapidly under hot dry spells'
    ],
    causes: [
      'Microscopic arachnid pests proliferating rapidly in hot, dry, dusty environmental conditions (>30°C)',
      'Overuse of broad-spectrum synthetic pyrethroids which kill beneficial predatory mites'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Abamectin 1.9% EC', dosage: '0.5 ml/L water', timing: 'At earliest stippling or webbing' },
        { name: 'Spiromesifen 22.9% SC', dosage: '1.0 ml/L water', timing: 'Ovicidal and nymphal growth regulator' },
        { name: 'Propargite 57% EC', dosage: '2.0 ml/L water', timing: 'Rapid knockdown of adult mites' }
      ],
      label_instructions: 'Thorough coverage of leaf UNDERSIDES is mandatory. Mites reside almost entirely under the leaf blade.',
      safety_precautions: [
        'Abamectin is toxic to aquatic organisms and bees. Avoid spray drift into water bodies.',
        'Observe minimum 7-day PHI.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Predatory mites (Phytoseiulus persimilis / Neoseiulus californicus)', application: 'Release 2-5 predatory mites per sq meter at early infestation' }
      ],
      organic_sprays: [
        'Wettable sulfur 80% WDG @ 2.5 g/L (acting as both acaricide and fungicide)',
        'Cold-pressed Neem oil (3000 ppm) @ 3-4 ml/L with mild dish soap',
        'Insecticidal soap (Potassium salts of fatty acids) @ 10 ml/L'
      ],
      cultural_practices: [
        'Keep field borders and access roads watered to suppress dust which favors mite outbreaks',
        'Use overhead misting or high-pressure water wash to mechanically knock mites off foliage',
        'Remove heavily webbed plant branches in sealed plastic bags'
      ]
    }
  },

  'Tomato___Target_Spot': {
    crop: 'Tomato',
    disease: 'Target Spot',
    scientific_name: 'Corynespora cassiicola',
    severity: 'Medium',
    symptoms: [
      'Small, pinpoint brown spots expanding into circular lesions (up to 10 mm) with light brown centers and dark concentric rings',
      'Yellow chlorotic halos surrounding lesions; spots coalesce causing extensive foliar blight',
      'Sunken, dark circular lesions on green and ripe tomato fruit with cracked centers'
    ],
    causes: [
      'Fungus persists in solanaceous and cucurbit weeds and old tomato stalks',
      'Warm temperatures (25-32°C) combined with high relative humidity and prolonged leaf wetness'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'At first appearance of target lesions' },
        { name: 'Chlorothalonil 75% WP', dosage: '2.0 g/L water', timing: 'Protective spray every 7-10 days' },
        { name: 'Fluxapyroxad + Pyraclostrobin (Priaxor)', dosage: '0.6 ml/L water', timing: 'Curative systemic spray' }
      ],
      label_instructions: 'Deliver 500-600 L/ha water volume with cone nozzles for full interior canopy coverage.',
      safety_precautions: ['Observe 7-day PHI. Wear full chemical safety goggles and respirator.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum', application: 'Foliar spray @ 5 g/L' }
      ],
      organic_sprays: [
        'Copper Oxychloride 50% WP @ 2.5 g/L',
        'Bordeaux mixture (1%) preventive barrier'
      ],
      cultural_practices: [
        'Improve air drainage by maintaining proper plant spacing and trellising',
        'Avoid working in wet fields to prevent mechanical transmission of fungal conidia',
        'Remove infected lower leaves and cull affected fruit'
      ]
    }
  },

  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    crop: 'Tomato',
    disease: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientific_name: 'Begomovirus (TYLCV)',
    severity: 'Critical',
    symptoms: [
      'Upward curling, cupping, and twisting of leaf margins with severe marginal yellowing (chlorosis)',
      'Marked reduction in leaf size ("shoestring" or "bushy" appearance) and severe plant stunting',
      'Flower drop; plants infected early bear no marketable fruit; severe crop failure'
    ],
    causes: [
      'Transmitted exclusively by the Whitefly vector (Bemisia tabaci)',
      'Not seed-borne or mechanically transmitted through touch or pruning'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Diafenthiuron 50% WP', dosage: '1.2 g/L water', timing: 'Targeting adult and nymph whitefly vectors' },
        { name: 'Thiamethoxam 25% WG', dosage: '0.4 g/L water', timing: 'Nursery seedling drench or early foliar spray' },
        { name: 'Spiromesifen 22.9% SC', dosage: '1.0 ml/L water', timing: 'Whitefly egg and nymph control' },
        { name: 'Pyriproxyfen 10% EC', dosage: '1.5 ml/L water', timing: 'Insect Growth Regulator (IGR)' }
      ],
      label_instructions: 'There is NO cure for the virus once inside the plant. All chemical sprays MUST target the whitefly vector before inoculation occurs.',
      safety_precautions: [
        'Rotate chemical modes of action (IRAC groups 4A, 12A, 23) to avert whitefly insecticide resistance.',
        'Observe minimum 7-day PHI.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Beauveria bassiana / Verticillium lecanii', application: 'Entomopathogenic bio-fungicide @ 5 g/L to parasitize whiteflies' },
        { agent: 'Encarsia formosa / Eretmocerus', application: 'Parasitic wasps released in greenhouse settings' }
      ],
      organic_sprays: [
        'Neem oil (3000 ppm) @ 4 ml/L + 1 ml liquid soap sprayed every 5 days on leaf undersides',
        'Castor oil or fish oil rosin soap @ 20 g/L as natural whitefly suffocant'
      ],
      cultural_practices: [
        'Erect 40-mesh insect-proof nylon netting over nurseries to raise completely virus-free seedlings',
        'Install yellow sticky traps (15-20 traps per acre) at canopy height to monitor and mass-trap whiteflies',
        'Immediately rogue (uproot) and destroy stunted virus-infected plants in plastic bags',
        'Plant TYLCV-resistant hybrids possessing Ty-1, Ty-2, or Ty-3 resistance genes'
      ]
    }
  },

  'Tomato___Tomato_mosaic_virus': {
    crop: 'Tomato',
    disease: 'Tomato Mosaic Virus (ToMV)',
    scientific_name: 'Tobamovirus (ToMV)',
    severity: 'High',
    symptoms: [
      'Alternating light and dark green mottled mosaic patterns on leaves',
      'Leaves become curled, distorted, puckered, or narrow ("fern-leaf" or "strap-like" appearance)',
      'Severe plant stunting, internal brown necrotic browning of fruit wall, and patchy ripening'
    ],
    causes: [
      'Highly stable virus transmitted mechanically by contaminated hands, tools, clothes, and sap',
      'Seed-borne or harbored in contaminated tobacco products and solanaceous weed roots'
    ],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical viricide exists. Chemical sprays are completely ineffective against ToMV. Focus entirely on strict sanitation and viral vector barriers.',
      safety_precautions: ['Wash hands and tools with 20% non-fat dry milk solution or 10% TSP (Trisodium phosphate).']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens', application: 'Soil drenching to stimulate systemic acquired resistance (SAR)' }
      ],
      organic_sprays: [
        'Skim milk solution (100g powdered milk in 1L water) sprayed before transplant handling to neutralize mechanical transmission'
      ],
      cultural_practices: [
        'STRICT RULE: Farm workers must never smoke or handle chewing tobacco before entering the tomato field',
        'Dip all pruning shears and hands in 20% non-fat dry milk or 10% bleach between handling every plant',
        'Immediately uproot and incinerate mosaic-symptomatic plants along with surrounding soil',
        'Purchase only certified virus-free seed treated with dry heat (70°C for 3 days) or trisodium phosphate'
      ]
    }
  },

  'Tomato___healthy': {
    crop: 'Tomato',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Solanum lycopersicum',
    severity: 'Low',
    symptoms: ['Deep green lush composite leaves, sturdy hairy stems, vigorous apical shoots without mottling or spots.'],
    causes: ['Balanced fertigation, disciplined trellising, and proactive integrated pest management.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No fungicide intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma harzianum', application: 'Maintain root colonization with monthly organic compost top-dressing' }],
      organic_sprays: ['Panchagavya (3%) or Vermiwash (5%) foliar spray every 14 days'],
      cultural_practices: ['Maintain single-stem or double-stem staking and disciplined drip fertigation schedule']
    }
  },

  // ── COTTON ──────────────────────────────────────────────────────────────────
  'Cotton___Bacterial_blight': {
    crop: 'Cotton',
    disease: 'Bacterial Blight (Angular Leaf Spot / Black Arm)',
    scientific_name: 'Xanthomonas citri pv. malvacearum',
    severity: 'High',
    symptoms: [
      'Angular, water-soaked translucent spots on leaves strictly delimited by veins',
      'Spots turn dark reddish-brown to black and lesions coalesce causing premature leaf drop',
      'Black arm lesions on stems and petioles leading to lodging and boll rot'
    ],
    causes: [
      'Seed-borne bacterial infection surviving on fuzz and inside seed coat',
      'High relative humidity (>85%) accompanied by warm temperatures (28-32°C) and heavy rain splash'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Streptocycline 90:10 (Streptomycin + Tetracycline)', dosage: '1.0 g per 10 L water', timing: 'At first appearance of angular spots' },
        { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water (tank-mixed with Streptocycline)', timing: 'Every 12-15 days during cloudy/rainy spells' },
        { name: 'Copper Hydroxide 77% WP (Kocide)', dosage: '2.0 g/L water', timing: 'Preventive foliar spray' }
      ],
      label_instructions: 'Thoroughly drench lower leaf surfaces where stomatal bacterial entry occurs. Repeat after heavy rainfall.',
      safety_precautions: [
        'Do not exceed recommended antibiotic concentration to prevent phytotoxicity.',
        'Observe minimum 14-day Pre-Harvest Interval (PHI).'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens 1% WP', application: 'Seed treatment @ 10 g/kg seed and foliar spray @ 5 g/L' },
        { agent: 'Bacillus subtilis', application: 'Foliar spray @ 5 ml/L at 40 and 60 DAS' }
      ],
      organic_sprays: [
        'Cow urine spray (10% aqueous solution) mixed with 1% fermented asafoetida (Hing)',
        'Fresh neem leaf extract (5%) mixed with Panchagavya (3%)'
      ],
      cultural_practices: [
        'Delint cotton seeds with concentrated sulfuric acid (100 ml/kg seed) to eradicate seed-coat inoculum',
        'Collect and burn infected post-harvest cotton stalks instead of incorporating into soil',
        'Adopt crop rotation with non-host crops like Maize, Sorghum, or Pulses'
      ]
    }
  },

  'Cotton___Leaf_curl': {
    crop: 'Cotton',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    scientific_name: 'Cotton Leaf Curl Multan/Rajasthan Begomovirus',
    severity: 'Critical',
    symptoms: [
      'Upward and downward curling and thickening of leaf margins',
      'Vein thickening (enation) and leaf enation (cup-shaped outgrowths on lower leaf surface)',
      'Severe stunting, reduced flowering, and failure of boll formation'
    ],
    causes: [
      'Transmitted persistent-circulatively by Whitefly (Bemisia tabaci)',
      'Host reservoirs in weed species (Parthenium, Abutilon, Solanum nigrum) around field borders'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Diafenthiuron 50% WP', dosage: '1.2 g/L water', timing: 'For effective whitefly nymph and adult knockdown' },
        { name: 'Pyriproxyfen 10% + Bifenthrin 10% EC', dosage: '1.5 ml/L water', timing: 'At ETL (5-8 whiteflies per leaf)' },
        { name: 'Afidopyropen 50 g/L DC (Sefina)', dosage: '2.0 ml/L water', timing: 'Targeted chordotonal organ disruptor against sucking pests' },
        { name: 'Flonicamid 50% WG', dosage: '0.4 g/L water', timing: 'Curative sucking pest management' }
      ],
      label_instructions: 'Direct sprays specifically to the underside of leaves where whiteflies colonize. Rotate insecticide modes of action.',
      safety_precautions: [
        'Do not apply synthetic pyrethroids repeatedly as they cause whitefly resurgence.',
        'Wear protective face mask and gloves during spraying.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Verticillium lecanii (Lecanicillium)', application: 'Foliar spray @ 5 g/L during humid evening hours' },
        { agent: 'Chrysoperla carnea (Green Lacewing)', application: 'Release 50,000 larvae/ha for biological predation of whitefly nymphs' }
      ],
      organic_sprays: [
        'Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem Oil @ 2.5 ml/L',
        'Yellow sticky traps installed @ 25 traps/acre at crop canopy level'
      ],
      cultural_practices: [
        'Eradicate alternative weed hosts (Kanghi, Peeli Buti, Parthenium) on bunds and irrigation channels',
        'Grow CLCuV-tolerant Bt cotton hybrids certified for your agricultural zone',
        'Avoid late sowing; plant synchronous early season crops'
      ]
    }
  },

  'Cotton___Alternaria_leaf_spot': {
    crop: 'Cotton',
    disease: 'Alternaria Leaf Spot',
    scientific_name: 'Alternaria macrospora',
    severity: 'Medium',
    symptoms: [
      'Small, circular to irregular brown spots with concentric target-board rings',
      'Spots develop prominent purple or reddish-brown margins',
      'Dry centers crack open creating a "shot-hole" appearance, followed by severe defoliation'
    ],
    causes: [
      'Air-borne conidia and crop debris survival',
      'Intermittent rainfall with alternating humid warm days (25-30°C) and stressed plants'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Preventive spray at canopy closure' },
        { name: 'Propiconazole 25% EC (Tilt)', dosage: '1.0 ml/L water', timing: 'Curative spray on lesion appearance' },
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'At flowering and boll formation' }
      ],
      label_instructions: 'Spray when first concentric spots appear on lower canopy. Ensure full coverage of leaves.',
      safety_precautions: [
        'Maintain 14-day PHI.',
        'Avoid spraying in midday scorching sun.'
      ]
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Trichoderma harzianum', application: 'Foliar spray @ 5 g/L water' }
      ],
      organic_sprays: [
        'Copper Hydroxide 53.8% DF @ 2.0 g/L',
        'Fermented buttermilk (Chhachh 1L in 10L water) foliar spray'
      ],
      cultural_practices: [
        'Avoid moisture stress and potassium deficiency which aggravate Alternaria susceptibility',
        'Deep plow cotton residues after final picking'
      ]
    }
  },

  'Cotton___Grey_mildew': {
    crop: 'Cotton',
    disease: 'Grey Mildew (Dahiya Disease)',
    scientific_name: 'Ramularia areola',
    severity: 'Medium',
    symptoms: [
      'Pale translucent angular spots delimited by veinlets on the leaf',
      'White to frosty-grey powdery growth of conidia on lower leaf surfaces',
      'Leaves turn yellow, brown, and drop prematurely, leaving bare stems with unripened bolls'
    ],
    causes: [
      'High humidity (>90%) with cool night temperatures (18-24°C) during late crop stages',
      'Dense foliage planting preventing aeration'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Wettable Sulfur 80% WP', dosage: '3.0 g/L water', timing: 'At first appearance of frosty white patches' },
        { name: 'Carbendazim 50% WP', dosage: '1.0 g/L water', timing: 'Systemic foliar spray' },
        { name: 'Kresoxim-methyl 44.3% SC', dosage: '1.0 ml/L water', timing: 'For rapid curative knock-down' }
      ],
      label_instructions: 'Spray targeting the lower surface of mature canopy leaves.',
      safety_precautions: ['Do not spray sulfur when ambient temperatures exceed 35°C to avoid scorching.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5 g/L' }
      ],
      organic_sprays: [
        'Potassium bicarbonate @ 3 g/L combined with 0.5% horticultural oil',
        'Sour curd spray @ 5% dilution'
      ],
      cultural_practices: [
        'Wider spacing between rows to facilitate canopy ventilation',
        'Avoid excessive late nitrogen applications'
      ]
    }
  },

  'Cotton___healthy': {
    crop: 'Cotton',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Gossypium hirsutum',
    severity: 'Low',
    symptoms: ['Broad, deep green palmate lobes with prominent intact venation, smooth margins, and vigorous boll development.'],
    causes: ['Optimal soil moisture, balanced NPK nutrition, and effective integrated pest management.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['Maintain regular scouting.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma viride', application: 'Soil application with enriched FYM' }],
      organic_sprays: ['Panchagavya (3%) or Seaweed extract spray at 15-day intervals'],
      cultural_practices: ['Maintain proper drainage to prevent waterlogging during monsoons']
    }
  },

  // ── RICE / PADDY ────────────────────────────────────────────────────────────
  'Rice___Leaf_Blast': {
    crop: 'Rice',
    disease: 'Rice Leaf Blast',
    scientific_name: 'Magnaporthe oryzae (Pyricularia oryzae)',
    severity: 'Critical',
    symptoms: [
      'Spindle-shaped or eye-shaped lesions with pointed ends',
      'Ash-gray or whitish center with prominent dark reddish-brown borders',
      'Lesions enlarge and coalesce causing entire leaf blades to wither and scorch'
    ],
    causes: [
      'High relative humidity (>90%) with cloudy drizzling weather and temperatures around 20-25°C',
      'Excessive chemical nitrogen application'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Tricyclazole 75% WP (Baan / Beam)', dosage: '0.6 g/L water', timing: 'At first appearance of eye-shaped lesions' },
        { name: 'Isoprothiolane 40% EC (Fujione)', dosage: '1.5 ml/L water', timing: 'Repeat after 10-12 days' },
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'At tillering/panicle initiation' }
      ],
      label_instructions: 'Drain excessive standing water before spraying. Spray in early morning or late afternoon.',
      safety_precautions: ['Observe 21-day PHI.', 'Do not top-dress urea during active blast outbreak.']
    },
    biological_management: {
      biocontrol_agents: [
        { agent: 'Pseudomonas fluorescens (Pf-1)', application: 'Seed treatment @ 10g/kg and foliar spray @ 5g/L' }
      ],
      organic_sprays: [
        'Neem Seed Kernel Extract (NSKE 5%)',
        'Fermented buttermilk (1L sour curd in 10L water)'
      ],
      cultural_practices: [
        'Split nitrogen application into 3 or 4 doses instead of single heavy basal dose',
        'Use blast-resistant varieties like IR-64, Swarna, or MTU-1010'
      ]
    }
  },

  'Rice___Brown_Spot': {
    crop: 'Rice',
    disease: 'Rice Brown Spot',
    scientific_name: 'Bipolaris oryzae (Helminthosporium oryzae)',
    severity: 'Medium',
    symptoms: [
      'Small, circular to oval sesame-seed shaped brown spots uniformly distributed across leaf blades',
      'Mature spots have light brown to grey centers with distinct dark brown margins and yellow halos',
      'Severely infected leaves turn yellow and dry up prematurely'
    ],
    causes: [
      'Poor, depleted soils with potassium and silica deficiency',
      'Drought stress or intermittent water deficit'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Mancozeb 75% WP', dosage: '2.0 g/L water', timing: 'At initial spotting stage' },
        { name: 'Propiconazole 25% EC', dosage: '1.0 ml/L water', timing: 'Curative foliar spray' },
        { name: 'Edifenphos 50% EC', dosage: '1.0 ml/L water', timing: 'At booting stage' }
      ],
      label_instructions: 'Combine with muriate of potash (MOP) foliar nutrition for rapid plant recovery.',
      safety_precautions: ['Observe 14-day PHI.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma harzianum', application: 'Soil application @ 2.5 kg/ha with compost' }],
      organic_sprays: ['Garlic extract (50g in 1L water) or Panchagavya (3%)'],
      cultural_practices: [
        'Apply balanced potassium and zinc fertilizer (Zinc Sulfate 25 kg/ha)',
        'Maintain continuous shallow water layer (2-3 cm) during critical vegetative stages'
      ]
    }
  },

  'Rice___Bacterial_blight': {
    crop: 'Rice',
    disease: 'Bacterial Leaf Blight (BLB)',
    scientific_name: 'Xanthomonas oryzae pv. oryzae',
    severity: 'High',
    symptoms: [
      'Water-soaked stripes starting from leaf tips and margins, progressing downward',
      'Lesions turn wavy yellowish-white to straw-colored with milky bacterial ooze beads on damp mornings',
      'Kresek symptom (complete seedling wilting and death) in nursery or early tillering stage'
    ],
    causes: [
      'Inundation, cyclonic storms, and strong winds creating leaf micro-wounds',
      'High nitrogen doses with temperatures 25-34°C'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Streptocycline', dosage: '1.0 g in 10 L water', timing: 'Tank mixed with Copper Oxychloride' },
        { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water', timing: 'Apply immediately on observing leaf tip blighting' }
      ],
      label_instructions: 'Drain field water immediately. Stop further nitrogenous fertilizer application.',
      safety_precautions: ['Do not spray during high winds.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5 g/L' }],
      organic_sprays: ['Cow dung slurry supernatant (20 kg fresh cow dung in 100L water, filtered and sprayed)'],
      cultural_practices: [
        'Grow BLB-resistant varieties like Improved Samba Mahsuri (RP Bio-226), Ajaya',
        'Avoid clipping seedlings at transplanting'
      ]
    }
  },

  'Rice___healthy': {
    crop: 'Rice',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Oryza sativa',
    severity: 'Low',
    symptoms: ['Erect, vibrant green leaf blades with uniform parallel venation and healthy tillering.'],
    causes: ['Adequate water management and balanced NPK+Zinc fertilization.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Azospirillum and PSB', application: 'Biofertilizer soil application' }],
      organic_sprays: ['Panchagavya (3%) foliar spray at panicle initiation'],
      cultural_practices: ['Maintain 2-5 cm standing water until grain filling']
    }
  },

  // ── WHEAT ───────────────────────────────────────────────────────────────────
  'Wheat___Yellow_rust': {
    crop: 'Wheat',
    disease: 'Yellow Rust (Stripe Rust)',
    scientific_name: 'Puccinia striiformis',
    severity: 'Critical',
    symptoms: [
      'Bright lemon-yellow powdery pustules arranged in narrow linear stripes parallel to leaf veins',
      'Stripe lesions coalesce covering entire leaf blades with yellow fungal urediniospores',
      'Leaves chlorose, desiccate, and drop prematurely reducing grain filling drastically'
    ],
    causes: [
      'Cool temperatures (10-15°C) with persistent morning dew, fog, and cloudy weather',
      'Air-borne spores transported from sub-mountainous foothills'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Propiconazole 25% EC (Tilt)', dosage: '1.0 ml/L water (500 ml/ha)', timing: 'At first appearance of yellow stripes' },
        { name: 'Tebuconazole 25.9% EC (Folicur)', dosage: '1.0 ml/L water', timing: 'Curative foliar spray' },
        { name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', dosage: '1.0 ml/L water', timing: 'High-pressure canopy spray' }
      ],
      label_instructions: 'Spray immediately upon detection in localized patches ("foci") to prevent catastrophic field-wide spread.',
      safety_precautions: ['Observe 30-day PHI for Propiconazole.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma viride', application: 'Foliar spray @ 5 g/L' }],
      organic_sprays: ['Sulfur 80% WP dusting @ 10 kg/acre in early morning'],
      cultural_practices: [
        'Plant stripe-rust resistant cultivars recommended for your zone (e.g. DBW-187, DBW-303, PBW-725)',
        'Sow early in November to avoid peak disease weather at heading'
      ]
    }
  },

  'Wheat___Brown_rust': {
    crop: 'Wheat',
    disease: 'Brown Rust (Leaf Rust)',
    scientific_name: 'Puccinia triticina',
    severity: 'High',
    symptoms: [
      'Small, round to oval reddish-brown to orange powdery pustules scattered randomly on upper leaf surface',
      'Pustules do not form stripes; they erupt through leaf epidermis shedding dust-like brown spores'
    ],
    causes: [
      'Warmer temperatures (20-25°C) with high humidity (>80%) during February-March'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Propiconazole 25% EC', dosage: '1.0 ml/L water', timing: 'At initial infection detection' },
        { name: 'Mancozeb 75% WP', dosage: '2.0 g/L water', timing: 'Protective foliage spray' }
      ],
      label_instructions: 'Spray covering complete foliage.',
      safety_precautions: ['Observe minimum 25-day PHI.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Bacillus subtilis', application: 'Foliar spray @ 5 ml/L' }],
      organic_sprays: ['Neem oil 1500 ppm @ 3 ml/L'],
      cultural_practices: ['Destroy volunteer wheat seedlings and weed hosts']
    }
  },

  'Wheat___Powdery_mildew': {
    crop: 'Wheat',
    disease: 'Wheat Powdery Mildew',
    scientific_name: 'Blumeria graminis f. sp. tritici',
    severity: 'Medium',
    symptoms: [
      'Fluffy white cottony patches of fungal mycelium on lower leaf surfaces and stems',
      'Patches turn dull grayish-brown with tiny black pinhead-like cleistothecia in later stages'
    ],
    causes: [
      'Cool humid weather (15-20°C) with dense crop canopy and shade'
    ],
    chemical_management: {
      registered_products: [
        { name: 'Wettable Sulfur 80% WP', dosage: '3.0 g/L water', timing: 'At first appearance of white mycelium' },
        { name: 'Propiconazole 25% EC', dosage: '1.0 ml/L water', timing: 'Curative spray' }
      ],
      label_instructions: 'Direct spray into lower canopy.',
      safety_precautions: ['Avoid sulfur spray above 32°C.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Ampelomyces quisqualis', application: 'Bio-fungicide spray @ 5 g/L' }],
      organic_sprays: ['Potassium bicarbonate @ 3 g/L'],
      cultural_practices: ['Avoid excessive seed rate and heavy nitrogen fertilization']
    }
  },

  'Wheat___healthy': {
    crop: 'Wheat',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Triticum aestivum',
    severity: 'Low',
    symptoms: ['Clean, vibrant green linear blades without rust pustules or powdery patches.'],
    causes: ['Balanced nitrogen-phosphorus-potassium nutrition and timely irrigation.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Azotobacter and PSB', application: 'Seed inoculation' }],
      organic_sprays: ['Jeevamrutha foliar spray during tillering and jointing'],
      cultural_practices: ['Follow recommended irrigation at Crown Root Initiation (CRI) and heading']
    }
  },

  // ── CHILLI / PEPPER ─────────────────────────────────────────────────────────
  'Chilli___Bacterial_spot': {
    crop: 'Chilli',
    disease: 'Chilli Bacterial Leaf Spot',
    scientific_name: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'High',
    symptoms: [
      'Small, circular, water-soaked dark brown spots with prominent yellow halos',
      'Spots turn scabby and raised on leaves and green chillies',
      'Severe defoliation leading to sun-scald of exposed chillies'
    ],
    causes: ['Warm rainy weather (24-30°C) with overhead water splashing.'],
    chemical_management: {
      registered_products: [
        { name: 'Streptocycline', dosage: '1.0 g in 10 L water', timing: 'Tank mixed with Copper Oxychloride' },
        { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water', timing: 'Every 10-12 days during rainy spells' }
      ],
      label_instructions: 'Spray on both upper and lower leaf surfaces.',
      safety_precautions: ['Observe 14-day PHI.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5 g/L' }],
      organic_sprays: ['Bordeaux mixture (1%) protective spray'],
      cultural_practices: ['Hot water seed treatment at 50°C for 25 minutes before nursery sowing']
    }
  },

  'Chilli___Leaf_curl': {
    crop: 'Chilli',
    disease: 'Chilli Leaf Curl Virus (Murda Disease)',
    scientific_name: 'Chilli Leaf Curl Begomovirus',
    severity: 'Critical',
    symptoms: [
      'Severe upward curling and puckering of leaves with vein thickening',
      'Leaves become brittle, small ("boat-shaped"), and clustered with severe plant stunting',
      'Flowers drop prematurely and fruit set is drastically impaired'
    ],
    causes: ['Transmitted by Whiteflies (Bemisia tabaci) and Thrips (Scirtothrips dorsalis).'],
    chemical_management: {
      registered_products: [
        { name: 'Diafenthiuron 50% WP', dosage: '1.2 g/L water', timing: 'For sucking pest control' },
        { name: 'Spinetoram 11.7% SC', dosage: '1.0 ml/L water', timing: 'For severe thrips infestation' },
        { name: 'Afidopyropen 50 g/L DC', dosage: '2.0 ml/L water', timing: 'Whitefly suppression' }
      ],
      label_instructions: 'Direct spray to underside of leaves.',
      safety_precautions: ['Wear eye protection and respirator mask.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Lecanicillium lecanii', application: 'Foliar spray @ 5 g/L' }],
      organic_sprays: ['Yellow and blue sticky traps @ 20 traps/acre', 'Neem oil 10,000 ppm @ 3 ml/L'],
      cultural_practices: ['Barrier cropping with 2 rows of Maize or Sorghum around chilli plots']
    }
  },

  'Chilli___Anthracnose': {
    crop: 'Chilli',
    disease: 'Anthracnose / Dieback / Fruit Rot',
    scientific_name: 'Colletotrichum capsici',
    severity: 'High',
    symptoms: [
      'Circular sunken dark lesions with concentric rings of acervuli (black dots)',
      'Twigs wither from tip downward ("dieback") turning straw-colored',
      'Severe rotting of ripening chilli pods'
    ],
    causes: ['High humidity with continuous rainfall and temperature 28-30°C.'],
    chemical_management: {
      registered_products: [
        { name: 'Azoxystrobin 23% SC', dosage: '1.0 ml/L water', timing: 'At flowering and fruit initiation' },
        { name: 'Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'Protective canopy spray' }
      ],
      label_instructions: 'Spray during early morning hours.',
      safety_precautions: ['Observe 14-day PHI.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Trichoderma viride', application: 'Seed treatment @ 4 g/kg' }],
      organic_sprays: ['Copper Hydroxide 77% WP @ 2.0 g/L'],
      cultural_practices: ['Collect and destroy mummified dried chillies from plants']
    }
  },

  'Chilli___healthy': {
    crop: 'Chilli',
    disease: 'Healthy Leaf Tissue',
    scientific_name: 'Capsicum annuum',
    severity: 'Low',
    symptoms: ['Dark green lanceolate leaves with smooth margins, strong branching, and vigorous flowering.'],
    causes: ['Disciplined irrigation and integrated pest management.'],
    chemical_management: {
      registered_products: [],
      label_instructions: 'No chemical intervention required.',
      safety_precautions: ['None.']
    },
    biological_management: {
      biocontrol_agents: [{ agent: 'Pseudomonas fluorescens', application: 'Soil drenching' }],
      organic_sprays: ['Panchagavya (3%) foliar spray bi-weekly'],
      cultural_practices: ['Provide adequate staking and avoid waterlogging']
    }
  }
};

// Fallback generic info if an unmapped disease class is ever encountered
const DEFAULT_KNOWLEDGE = {
  severity: 'Medium',
  symptoms: [
    'Visible foliar discoloration, necrotic spots, or atypical leaf curling observed on the specimen'
  ],
  causes: [
    'Localized pathogen infection or abiotic environmental stress (excess moisture, heat, or nutrient imbalance)'
  ],
  chemical_management: {
    registered_products: [
      { name: 'Broad-spectrum Mancozeb 75% WP', dosage: '2.5 g/L water', timing: 'At early stage of foliar symptoms' },
      { name: 'Copper Oxychloride 50% WP', dosage: '2.5 g/L water', timing: 'Protective broad-spectrum foliage spray' }
    ],
    label_instructions: 'Ensure even canopy coverage. Follow product label guidelines and consult local agriculture officer.',
    safety_precautions: [
      'Wear protective face mask, rubber gloves, and eye goggles during preparation and spraying.',
      'Maintain standard 14-day Pre-Harvest Interval (PHI).'
    ]
  },
  biological_management: {
    biocontrol_agents: [
      { agent: 'Trichoderma viride', application: 'Soil drenching @ 5 g/L water' },
      { agent: 'Pseudomonas fluorescens', application: 'Foliar spray @ 5 g/L water' }
    ],
    organic_sprays: [
      'Cold-pressed Neem Oil (1500 ppm) @ 3 ml/L with mild surfactant',
      'Bordeaux mixture (1%) as broad protective foliar barrier'
    ],
    cultural_practices: [
      'Remove and destroy severely symptomatic leaves away from the field',
      'Avoid evening overhead sprinkler irrigation to keep foliage dry overnight',
      'Maintain wide plant spacing to facilitate rapid air circulation'
    ]
  },
  expert_consultation: {
    helpline: '1800-180-1551',
    helpline_name: 'Kisan Call Center (Govt. of India - Toll Free 6 AM to 10 PM)',
    whatsapp_desk: '+919849023145',
    whatsapp_label: 'Krishi Agronomist WhatsApp Desk',
    advisory: 'If symptoms persist or leaf damage exceeds 20%, contact your nearest Krishi Vigyan Kendra (KVK) or District Agriculture Officer with your geo-tagged leaf photo.'
  }
};

/**
 * Helper to fetch complete agronomic data for any class
 */
function getDiseaseDetails(className) {
  const match = DISEASE_DATABASE[className];
  if (match) {
    return {
      ...match,
      expert_consultation: DEFAULT_KNOWLEDGE.expert_consultation
    };
  }
  return {
    ...DEFAULT_KNOWLEDGE
  };
}

module.exports = {
  DISEASE_DATABASE,
  DEFAULT_KNOWLEDGE,
  getDiseaseDetails
};
