const cropData = require('../utils/cropData');

// Authoritative Crop Lifecycle & Calendar Schedules
const CROP_CALENDARS = {
  rice: {
    total_duration: "120-150 Days",
    difficulty: "Medium",
    water_requirement: "Very High",
    best_season: "Kharif (Monsoon)",
    stages: [
      {
        num: 1, name: "Land Preparation", emoji: "🚜", duration: "15 Days",
        desc: "Prepare the field for puddling to create an impervious layer for water retention.",
        steps: [
          "Plough the field 2-3 times with a tractor to break soil clods.",
          "Apply 10 tonnes of Farm Yard Manure (FYM) per acre during first ploughing.",
          "Puddle the field with 5-10 cm of standing water twice at 7-day intervals.",
          "Level the field perfectly using a laser leveler to ensure uniform water depth."
        ],
        pro_tip: "Add green manure crops like Dhaincha 45 days before puddling for natural nitrogen.",
        tools: ["Tractor", "Plough", "Leveler"],
        warning: "Inadequate leveling leads to uneven growth and higher weed infestation."
      },
      {
        num: 2, name: "Seed Selection & Treatment", emoji: "🧪", duration: "2 Days",
        desc: "Choose high-yielding varieties and protect them from seed-borne diseases.",
        steps: [
          "Select certified seeds of high-yielding varieties suitable for your region.",
          "Soak 10kg seeds in 10L water with 2.5g Carbendazim for 24 hours.",
          "Drain water and keep seeds in moist gunny bag for 24-48 hours for sprouting.",
          "Remove any floating, light-weight seeds before treatment."
        ],
        pro_tip: "Salt water test: Healthy seeds sink in 10% salt solution; discard floating seeds.",
        tools: ["Buckets", "Gunny Bags", "Seed Treatment Chemicals"],
        warning: "Using uncertified seeds can reduce yield by up to 20% due to poor germination."
      },
      {
        num: 3, name: "Nursery & Transplanting", emoji: "🌱", duration: "25-30 Days",
        desc: "Raise healthy seedlings in a nursery and transplant them to the main field.",
        steps: [
          "Sow sprouted seeds in a raised bed nursery (100sqm per acre of main field).",
          "Keep nursery moist but not flooded for the first 5 days.",
          "Transplant 20-25 day old seedlings to the main field.",
          "Plant 2-3 seedlings per hill at a spacing of 20x15 cm."
        ],
        pro_tip: "Dip seedling roots in Bio-fertilizer (Azospirillum) for 30 mins before planting.",
        tools: ["Sickle", "Nursery Trays (Optional)"],
        warning: "Delayed transplanting (seedlings >35 days) reduces tillering and final yield."
      },
      {
        num: 4, name: "Water & Nutrient Management", emoji: "💧", duration: "Throughout",
        desc: "Maintain precise water levels to suppress weeds and support growth.",
        steps: [
          "Maintain 2-3 cm of water depth during the first week after transplanting.",
          "Follow Alternate Wetting and Drying (AWD) to save water and reduce methane.",
          "Apply Nitrogen in 3 splits (basal, tillering, panicle initiation).",
          "Drain field 10-15 days before harvest date."
        ],
        pro_tip: "Do not allow field to dry completely during flowering and grain formation.",
        tools: ["AWD Pipe", "Sprayer"],
        warning: "Water stress during panicle initiation directly reduces grain count."
      }
    ],
    phases: ['Land Preparation', 'Nursery & Sowing', 'Transplanting', 'Vegetative Growth', 'Flowering', 'Grain Filling', 'Maturity & Harvest'],
    weeks: [
      { week: 1, phase: 'Land Preparation', title: 'Field Preparation', activities: ['Plough field 2-3 times to depth of 20-25 cm', 'Level the field properly for uniform water distribution', 'Apply 5-10 tonnes FYM/compost per acre', 'Repair bunds and irrigation channels'], irrigation: 'Flood field for 2-3 days before puddling', fertilizer: 'Basal dose: Apply FYM and 50% phosphorus (DAP)', watch_out: 'Remove weeds and stubble from previous crop' },
      { week: 2, phase: 'Nursery & Sowing', title: 'Nursery Preparation', activities: ['Prepare raised nursery beds (1m wide, 5-10m long)', 'Treat seeds with Carbendazim 2g/kg for 12 hours', 'Sow seeds @ 40-50g per sq.m', 'Cover seeds with thin soil layer'], irrigation: 'Light irrigation daily to keep moist', fertilizer: 'Apply 5kg DAP per 100 sq.m nursery area', watch_out: 'Protect from birds — use nets over nursery' },
      { week: 3, phase: 'Nursery & Sowing', title: 'Seedling Management', activities: ['Thin seedlings if overcrowded', 'Apply top dress nitrogen to nursery', 'Monitor for blast symptoms on leaf tips', 'Prepare main field for transplanting'], irrigation: 'Maintain 2-3 cm water level in nursery', fertilizer: 'Top dress: 2kg Urea per 100 sq.m nursery', watch_out: 'Watch for leaf blast — gray spindle-shaped lesions' },
      { week: 4, phase: 'Transplanting', title: 'Transplanting', activities: ['Transplant 20-25 day old seedlings (2-3 per hill)', 'Maintain row spacing: 20x15 cm', 'Transplant in straight lines for weed management', 'Apply pre-emergence herbicide within 3 days'], irrigation: 'Maintain 2-3 cm standing water after transplanting', fertilizer: 'Basal: Full dose P + K + 25% N (Urea) at transplanting', watch_out: 'Ensure proper rooting — seedlings should not float' },
      { week: 5, phase: 'Vegetative Growth', title: 'Early Tillering', activities: ['Check plant establishment and gap filling', 'Apply first weeding if pre-em herbicide not used', 'Monitor for leaf folder and stem borer', 'Check for any nutrient deficiencies'], irrigation: 'Maintain 3-5 cm standing water', fertilizer: 'Top dress: 25% N (2nd dose) at 15 DAT (days after transplanting)', watch_out: 'Dead heart symptom indicates stem borer — check leaf sheaths' },
      { week: 6, phase: 'Vegetative Growth', title: 'Active Tillering', activities: ['Manual weeding or chemical weeding', 'Spray for leaf folder if infestation > 5% leaves', 'Check for brown planthopper near base of plant', 'Ensure proper water level maintenance'], irrigation: 'Maintain 3-5 cm standing water continuously', fertilizer: 'Apply potash (MOP) if not applied at transplanting', watch_out: 'Hopper burn (brown/yellow patches) indicates BPH attack' },
      { week: 7, phase: 'Vegetative Growth', title: 'Tillering Completion', activities: ['Drain field for 5-7 days (mid-season drainage) to encourage root growth', 'Count tillers — target 250-300 productive tillers/sq.m', 'Remove excess water to control BPH', 'Apply micronutrient if zinc deficiency seen'], irrigation: 'Mid-season drainage — drain field completely for 7 days', fertilizer: 'Zinc sulphate @ 10kg/acre if yellowing/browning between veins', watch_out: 'Zinc deficiency: brown rusty spots on lower leaves' },
      { week: 8, phase: 'Vegetative Growth', title: 'Panicle Initiation', activities: ['Resume irrigation after mid-season drainage', 'Apply 3rd split dose of nitrogen (panicle initiation)', 'Monitor for neck blast symptom', 'Check for gall midge — onion-like leaf sheath'], irrigation: 'Resume to maintain 5 cm standing water', fertilizer: 'Final N split (25%): Apply Urea at panicle initiation stage', watch_out: 'Neck blast infection risk peaks now — spray if humid' },
      { week: 9, phase: 'Flowering', title: 'Booting & Heading', activities: ['Maintain water level critical at this stage — do NOT let dry', 'Monitor for sheath blight near water level', 'Spray for neck blast prevention with Tricyclazole', 'Check panicle development and emergence'], irrigation: 'Critical: Maintain 5-7 cm water — no stress at this stage', fertilizer: 'No nitrogen now — may cause lodging', watch_out: 'Sheath blight: oval lesions at waterline on leaf sheaths' },
      { week: 10, phase: 'Flowering', title: 'Anthesis (Flowering)', activities: ['Maintain water level — most critical for grain filling', 'Spray against false smut if weather is cloudy', 'Monitor for green leafhopper', 'Avoid pesticide sprays during actual flowering (harm pollinators)'], irrigation: 'Maintain 5 cm standing water — no dry periods', fertilizer: 'No fertilizer during flowering', watch_out: 'False smut: yellow-green balls replacing some grains' },
      { week: 11, phase: 'Grain Filling', title: 'Milk Stage', activities: ['Maintain water level to ensure grain filling', 'Monitor for grain-feeding bugs', 'Check panicle weight and grain density'], irrigation: 'Maintain 3-5 cm water level', fertilizer: 'None required', watch_out: 'Grain bug feeding causes discolored/chalky grains' },
      { week: 12, phase: 'Grain Filling', title: 'Dough Stage', activities: ['Begin to reduce irrigation frequency', 'Monitor for sheath rot near panicle', 'Set bird scarer/net to protect ripening grains', 'Arrange harvesting labor and equipment'], irrigation: 'Reduce to alternate wetting and drying', fertilizer: 'None', watch_out: 'Sheath rot causes empty panicles' },
      { week: 13, phase: 'Maturity & Harvest', title: 'Hard Dough / Maturity', activities: ['Drain field completely 10 days before harvest', 'Confirm maturity: 80-85% grains golden yellow', 'Arrange harvesting machinery or labor', 'Check grain moisture content (should be 20-22%)'], irrigation: 'Stop irrigation — drain field', fertilizer: 'None', watch_out: 'Do NOT delay harvest — shattering and quality loss' },
      { week: 14, phase: 'Maturity & Harvest', title: 'Harvest', activities: ['Harvest when 80-85% grains are straw-colored', 'Use combine harvester or manual harvesting', 'Thresh immediately to prevent field spoilage', 'Dry grains to 14% moisture for storage'], irrigation: 'Field should be dry for machine access', fertilizer: 'None', watch_out: 'Avoid harvest in rainy weather' },
      { week: 15, phase: 'Maturity & Harvest', title: 'Post-Harvest Processing', activities: ['Proper drying on clean surface or drier', 'Winnow to remove chaff and debris', 'Grade grains — remove broken/discolored grains', 'Store in clean dry gunny bags or silos'], irrigation: 'None', fertilizer: 'None', watch_out: 'Store with moisture content below 14% to prevent fungal growth' },
      { week: 16, phase: 'Maturity & Harvest', title: 'Field Closure & Stubble Management', activities: ['Deep plow to incorporate rice straw (never burn)', 'Take soil sample for testing before next crop', 'Decide on next rabi crop based on soil health'], irrigation: 'None', fertilizer: 'Apply compost or bio-decomposer on stubble', watch_out: 'Stubble burning destroys topsoil microbial life' }
    ]
  },
  wheat: {
    total_duration: "110-130 Days",
    difficulty: "Low",
    water_requirement: "Medium",
    best_season: "Rabi (Winter)",
    stages: [
      {
        num: 1, name: "Land Preparation", emoji: "🚜", duration: "10 Days",
        desc: "Deep plowing to create a fine, pulverized seedbed.",
        steps: ["Plough 2-3 times after kharif harvest", "Apply 5-8 tonnes FYM per acre", "Pre-sowing irrigation (paleva) 10 days before sowing"],
        pro_tip: "Leveling with laser leveler saves 20% irrigation water.",
        tools: ["Tractor", "Cultivator"],
        warning: "Avoid sowing in coarse, cloddy soil."
      },
      {
        num: 2, name: "Sowing & Seed Treatment", emoji: "🌱", duration: "3 Days",
        desc: "Timely sowing between Nov 1-15 for maximum yield potential.",
        steps: ["Use certified seeds @ 40-45 kg/acre", "Seed treatment with Vitavax @ 2.5g/kg", "Sow at 22.5 cm row spacing"],
        pro_tip: "Sowing after Nov 25 results in 15-20% terminal heat yield loss.",
        tools: ["Seed Drill"],
        warning: "Deep sowing (>6 cm) causes poor seedling emergence."
      },
      {
        num: 3, name: "Crown Root Irrigation (CRI)", emoji: "💧", duration: "21-25 DAS",
        desc: "First irrigation at CRI stage is the most critical yield determinant.",
        steps: ["Irrigate at 21-25 days after sowing", "Apply 1st top dress Urea immediately after irrigation"],
        pro_tip: "Never delay the CRI irrigation.",
        tools: ["Irrigation Channels"],
        warning: "Missing CRI irrigation reduces tillering by up to 30%."
      },
      {
        num: 4, name: "Flowering & Harvesting", emoji: "🌾", duration: "Last 30 Days",
        desc: "Protect against yellow rust and harvest at 14% grain moisture.",
        steps: ["Light irrigation during grain filling stage", "Stop irrigation 10 days before harvest", "Harvest when straw turns golden yellow"],
        pro_tip: "Store grain with Aluminium Phosphide tablet to prevent weevil damage.",
        tools: ["Combine Harvester", "Bags"],
        warning: "Rain during harvest causes pre-harvest sprouting."
      }
    ],
    phases: ['Land Preparation', 'Sowing', 'Crown Root Initiation', 'Tillering', 'Jointing & Booting', 'Heading & Flowering', 'Grain Filling', 'Maturity'],
    weeks: [
      { week: 1, phase: 'Land Preparation', title: 'Field Preparation', activities: ['Deep plow to 25-30 cm after kharif harvest', 'Apply FYM/compost 5-8 tonnes per acre', 'Prepare fine seedbed'], irrigation: 'Pre-sowing irrigation (paleva)', fertilizer: 'Basal: Full P (DAP 50kg/acre) + K (MOP 30kg/acre)', watch_out: 'Remove stubble from previous crop' },
      { week: 2, phase: 'Sowing', title: 'Sowing', activities: ['Sow certified seed @ 40-45 kg/acre (Nov 1-15)', 'Row spacing: 22.5 cm using seed drill', 'Seed depth: 5 cm'], irrigation: 'Avoid irrigation on day of sowing', fertilizer: '50% N (Urea) as basal at sowing', watch_out: 'Late sowing after Nov 25 leads to yield loss' },
      { week: 3, phase: 'Crown Root Initiation', title: 'Germination Check', activities: ['Check germination (should be 90%+ in 5-7 days)', 'Gap filling if needed', 'Watch for rodent activity'], irrigation: 'Prepare for first irrigation at CRI (21 DAS)', fertilizer: 'None yet', watch_out: 'Poor germination indicates moisture problem' },
      { week: 4, phase: 'Crown Root Initiation', title: 'CRI Irrigation & N Application', activities: ['Apply 1st irrigation at Crown Root Initiation (21-25 DAS)', 'Apply 2nd split Nitrogen (Urea) right after irrigation', 'Weed management with Clodinafop for grassy weeds'], irrigation: '1st irrigation: 21-25 DAS (CRI stage) — critical', fertilizer: '25% N (top dress Urea after 1st irrigation)', watch_out: 'CRI stage water stress permanently reduces tillering' },
      { week: 5, phase: 'Tillering', title: 'Tillering & Weed Control', activities: ['Broadleaf weed herbicide application if needed', 'Check plant population — target 100-120 plants/sq.m'], irrigation: '2nd irrigation at tillering stage (40-45 DAS)', fertilizer: 'None', watch_out: 'Look out for yellow rust pustules' },
      { week: 6, phase: 'Tillering', title: 'Active Tillering', activities: ['Assess rust situation', 'Target 8-10 productive tillers/plant', 'Apply fungicide if rust spots found'], irrigation: 'Maintain adequate soil moisture', fertilizer: '3rd split N (25%) at late tillering if pale', watch_out: 'Yellow rust requires urgent Propiconazole spray' },
      { week: 7, phase: 'Jointing & Booting', title: 'Jointing Stage', activities: ['3rd irrigation at jointing stage', 'Monitor for stem fly and aphids'], irrigation: '3rd irrigation at jointing (60-65 DAS)', fertilizer: 'Final N top dress if not done', watch_out: 'Avoid excess N — causes lodging' },
      { week: 8, phase: 'Jointing & Booting', title: 'Booting Stage', activities: ['4th irrigation at booting stage', 'Monitor for yellow rust', 'Check ear emergence'], irrigation: '4th irrigation at booting (75-80 DAS)', fertilizer: 'No nitrogen now', watch_out: 'Powdery mildew watch' },
      { week: 9, phase: 'Heading & Flowering', title: 'Heading & Pollination', activities: ['5th irrigation at heading', 'Avoid pesticide spray during morning pollination'], irrigation: '5th irrigation at heading (85-90 DAS)', fertilizer: 'None', watch_out: 'Avoid irrigation during windy days to prevent lodging' },
      { week: 10, phase: 'Heading & Flowering', title: 'Grain Set', activities: ['Monitor for aphids on ears', 'Bird control'], irrigation: '6th irrigation at early grain fill (95-100 DAS)', fertilizer: 'None', watch_out: 'Aphids cause grain shriveling' },
      { week: 11, phase: 'Grain Filling', title: 'Milk Stage', activities: ['Last irrigation at milk stage', 'Assess grain firmness'], irrigation: 'Last irrigation at milk stage', fertilizer: 'None', watch_out: 'Stink bugs' },
      { week: 12, phase: 'Grain Filling', title: 'Dough Stage', activities: ['Stop all irrigation', 'Grains turn golden yellow'], irrigation: 'Stop irrigation — field must dry', fertilizer: 'None', watch_out: 'Unseasonal rain' },
      { week: 13, phase: 'Maturity', title: 'Maturity Check', activities: ['Check grain moisture (14-18%)', 'Book combine harvester'], irrigation: 'None', fertilizer: 'None', watch_out: 'Delayed harvest causes shattering losses' },
      { week: 14, phase: 'Maturity', title: 'Harvest', activities: ['Harvest with combine harvester', 'Thresh and dry'], irrigation: 'None', fertilizer: 'None', watch_out: 'Store only dry grain' },
      { week: 15, phase: 'Maturity', title: 'Post-Harvest & Storage', activities: ['Dry grain to 12% moisture', 'Pack in 50kg bags', 'Check MSP prices'], irrigation: 'None', fertilizer: 'None', watch_out: 'Protect from moisture in storage' },
      { week: 16, phase: 'Maturity', title: 'Field Closure', activities: ['Incorporate wheat straw with rotavator', 'Take soil sample for next kharif'], irrigation: 'None', fertilizer: 'Apply 5kg Urea/tonne straw for fast decomposition', watch_out: 'Never burn wheat stubble' }
    ]
  }
};

function generateGenericCalendar(cropName, season = 'Kharif') {
  const crop = cropName || 'General Crop';
  const phases = ['Land Preparation', 'Sowing', 'Vegetative Growth (Early)', 'Vegetative Growth (Late)', 'Flowering', 'Fruit/Grain Development', 'Maturity', 'Harvest'];
  const weekPhases = ['Land Preparation', 'Land Preparation', 'Sowing', 'Vegetative Growth (Early)', 'Vegetative Growth (Early)', 'Vegetative Growth (Late)', 'Vegetative Growth (Late)', 'Flowering', 'Flowering', 'Fruit/Grain Development', 'Fruit/Grain Development', 'Fruit/Grain Development', 'Maturity', 'Maturity', 'Harvest', 'Harvest'];

  const weeks = weekPhases.map((phase, i) => ({
    week: i + 1,
    phase,
    title: `Week ${i + 1}: ${phase}`,
    activities: [
      `Inspect field conditions for ${crop}`,
      `Maintain optimal soil moisture and crop aeration`,
      `Monitor for pest occurrences and weed emergence`
    ],
    irrigation: i < 2 ? 'Pre-sowing irrigation as needed' : (i > 12 ? 'Stop irrigation for harvest dry-down' : 'Irrigate based on topsoil dryness (every 7-10 days)'),
    fertilizer: i === 0 ? 'Apply basal organic manure (FYM) & balanced NPK' : (i === 4 ? 'Top-dress Nitrogen split dose' : 'None required at this stage'),
    watch_out: 'Check leaf undersides for sucking pests and fungal spots'
  }));

  const stages = [
    {
      num: 1, name: "Land Preparation", emoji: "🚜", duration: "10-15 Days",
      desc: `Prepare the field for ${crop} cultivation with adequate aeration and organic matter.`,
      steps: ["Plough 2-3 times to break clods", "Add 5-8 tonnes compost/FYM per acre", "Level field for uniform drainage"],
      pro_tip: "Ensure fine tilth for better seed germination.",
      tools: ["Tractor", "Plough"],
      warning: "Poor drainage can cause seed rot."
    },
    {
      num: 2, name: "Sowing & Seed Treatment", emoji: "🌱", duration: "2-3 Days",
      desc: "Use high-quality treated seeds planted at recommended row and plant spacing.",
      steps: ["Treat seeds with biological or chemical protectant", "Maintain appropriate seed depth (3-5 cm)", "Ensure adequate soil moisture before sowing"],
      pro_tip: "Always buy certified seeds from registered dealers.",
      tools: ["Seed Drill / Planter"],
      warning: "Deep sowing reduces germination percentage."
    },
    {
      num: 3, name: "Vegetative Growth & Care", emoji: "🌿", duration: "40-60 Days",
      desc: "Manage weeding, irrigation intervals, and balanced fertilizer splits.",
      steps: ["Apply weed control within first 30 days", "Apply split Nitrogen dose", "Monitor for early insect attacks"],
      pro_tip: "Mulching helps retain soil moisture and suppresses weeds.",
      tools: ["Weeder", "Sprayer"],
      warning: "Do not let weeds outcompete young seedlings."
    },
    {
      num: 4, name: "Maturity & Harvesting", emoji: "🌾", duration: "15-20 Days",
      desc: "Harvest at peak maturity and dry to safe moisture level for storage or mandi sale.",
      steps: ["Stop irrigation 10-14 days before harvest", "Harvest on a dry sunny day", "Thresh and dry properly before storage"],
      pro_tip: "Check local APMC mandi prices before deciding whether to store or sell immediately.",
      tools: ["Harvester", "Gunny Bags"],
      warning: "Do not harvest wet crops to avoid mold and mycotoxin formation."
    }
  ];

  return {
    total_duration: cropData[crop]?.total_duration || "100-130 Days",
    difficulty: cropData[crop]?.difficulty || "Medium",
    water_requirement: cropData[crop]?.water_requirement || "Medium",
    best_season: season || cropData[crop]?.best_season || "Kharif",
    stages,
    phases,
    weeks
  };
}

function getSchedule(cropName, season = 'Kharif') {
  const normalized = (cropName || 'rice').toLowerCase().trim();
  if (CROP_CALENDARS[normalized]) {
    return CROP_CALENDARS[normalized];
  }
  return generateGenericCalendar(cropName, season);
}

module.exports = {
  getSchedule,
  CROP_CALENDARS
};
