// Authoritative Organic Farming & Zero Budget Natural Farming (ZBNF) Service

function roundNum(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

const BASE_RECIPES = {
  jeevamrut: {
    id: "jeevamrut",
    name: "Jeevamrut (Liquid Microbial Soil Energizer)",
    hindiName: "जीवामृत",
    replaces: "Chemical NPK / Urea",
    purpose: "Replaces chemical Urea, DAP & NPK. Cultivates millions of beneficial aerobic and anaerobic microbes in the soil to unlock native nutrients.",
    applicationMethod: "Apply with irrigation water (flood/drip) or spray at 10% dilution (15L pump = 1.5L Jeevamrut + 13.5L water) every 15-21 days.",
    fermentationDays: "48 - 72 Hours",
    shelfLife: "7 to 10 Days",
    cost_per_acre: "₹1,200",
    baseIngredients: [
      { name: "Clean Water", perAcre: 200, unit: "Litres", source: "Pond or tubewell water (avoid chlorine tap water)" },
      { name: "Desi Cow Dung (Gobar)", perAcre: 10, unit: "kg", source: "Fresh dung of native indigenous (Bos indicus) cow (Gir, Sahiwal, Ongole)" },
      { name: "Desi Cow Urine (Gaumutra)", perAcre: 10, unit: "Litres", source: "Old or fresh desi cow urine (acts as antibacterial medium)" },
      { name: "Jaggery (Gud / Organic Sugar)", perAcre: 2, unit: "kg", source: "Unrefined dark chemical-free jaggery (food for microbes)" },
      { name: "Gram / Pulse Flour (Besan)", perAcre: 2, unit: "kg", source: "Gram flour (chana), black gram, or pigeon pea flour (protein source)" },
      { name: "Living Virgin Soil", perAcre: 0.5, unit: "kg", source: "Collected from field boundary, under a Banyan/Peepal tree" }
    ],
    steps: [
      "Take a 200-litre plastic drum (do not use metal or cement tanks).",
      "Add clean water into the drum.",
      "Mix cow dung and cow urine thoroughly until dissolved, then pour into drum.",
      "Dissolve jaggery in water and add to the drum.",
      "Add pulse flour and living virgin soil, stirring well clockwise with a wooden stick.",
      "Cover drum with a breathable jute gunny sack in shade.",
      "After 48-72 hours, rich fermentation foam appears. Filter through muslin cloth and apply."
    ]
  },
  ghanJeevamrut: {
    id: "ghanJeevamrut",
    name: "Ghan-Jeevamrut (Dry Microbial Fertilizer Pellets)",
    hindiName: "घन जीवामृत",
    replaces: "DAP / Synthetic Granules",
    purpose: "Solid bio-fertilizer replacing synthetic DAP/chemical granules. Provides slow-release natural nutrition for up to 6 months.",
    applicationMethod: "Broadcast 100-200 kg per acre as a basal dose during final ploughing or before sowing.",
    fermentationDays: "4 Days Drying",
    shelfLife: "6 to 8 Months",
    cost_per_acre: "₹1,500",
    baseIngredients: [
      { name: "Desi Cow Dung", perAcre: 100, unit: "kg", source: "Semi-dry indigenous cow dung" },
      { name: "Jaggery (Gud)", perAcre: 1, unit: "kg", source: "Dissolved in urine" },
      { name: "Pulse Flour (Besan)", perAcre: 1, unit: "kg", source: "Gram or blackgram flour" },
      { name: "Desi Cow Urine", perAcre: 5, unit: "Litres", source: "Indigenous cow urine" },
      { name: "Living Virgin Soil", perAcre: 1, unit: "kg", source: "Forest or bund soil" }
    ],
    steps: [
      "Spread cow dung in a 4-inch thick layer on a clean plastic sheet in shade.",
      "Mix urine, jaggery, flour, and virgin soil in a separate container.",
      "Sprinkle the liquid mix evenly over cow dung and knead thoroughly.",
      "Make heap, cover with gunny bag for 48 hours to ferment, then dry in shade for 2-3 days.",
      "Store dry pellets in sacks for up to 6 months."
    ]
  },
  beejamrut: {
    id: "beejamrut",
    name: "Beejamrut (Natural Seed Treatment Inoculant)",
    hindiName: "बीजामृत",
    replaces: "Chemical Seed Dressing (Thiram / Carbendazim)",
    purpose: "Protects seeds from soil-borne and seed-borne fungal/bacterial diseases, improves root vigor, and increases germination rate.",
    applicationMethod: "Dip seeds for 10-15 minutes, or coat large seeds with hands and dry in shade for 30 minutes before sowing.",
    fermentationDays: "12 - 24 Hours",
    shelfLife: "24 Hours (use fresh)",
    cost_per_acre: "₹300",
    baseIngredients: [
      { name: "Water", perAcre: 20, unit: "Litres", source: "Clean water" },
      { name: "Desi Cow Dung", perAcre: 5, unit: "kg", source: "Wrapped in cloth and soaked in water" },
      { name: "Desi Cow Urine", perAcre: 5, unit: "Litres", source: "Pure indigenous cow urine" },
      { name: "Slaked Lime (Chuna)", perAcre: 0.05, unit: "kg", source: "Edible slaked lime" },
      { name: "Virgin Bund Soil", perAcre: 0.1, unit: "kg", source: "A handful of fertile forest soil" }
    ],
    steps: [
      "Hang 5kg cow dung in a cloth bag suspended in 20L water for 12 hours.",
      "Squeeze the bag repeatedly into the water to extract microbial essence.",
      "Add 5L cow urine, a pinch of edible lime, and handful of soil. Mix well.",
      "Treat seeds by coating evenly and dry in shade before planting."
    ]
  },
  neemastra: {
    id: "neemastra",
    name: "Neemastra (Sucking Pest & Leaf Miner Protector)",
    hindiName: "नीमास्त्र",
    replaces: "Chemical Insecticides (Monocrotophos / Imidacloprid)",
    purpose: "Broad-spectrum organic repellent controlling aphids, whiteflies, jassids, and early-stage small caterpillars.",
    applicationMethod: "Spray directly without dilution on affected crops using a fine mist nozzle early morning or late afternoon.",
    fermentationDays: "48 Hours",
    shelfLife: "30 Days",
    cost_per_acre: "₹400",
    baseIngredients: [
      { name: "Water", perAcre: 100, unit: "Litres", source: "Clean water" },
      { name: "Desi Cow Urine", perAcre: 5, unit: "Litres", source: "Indigenous cow urine" },
      { name: "Desi Cow Dung", perAcre: 2, unit: "kg", source: "Fresh dung" },
      { name: "Crushed Neem Leaves / Pulp", perAcre: 5, unit: "kg", source: "Fresh chopped neem leaves and fruits" }
    ],
    steps: [
      "In a 100L plastic drum, add 100L water and 5L cow urine.",
      "Add 2kg cow dung and 5kg crushed neem leaves.",
      "Stir clockwise with a wooden stick twice daily for 48 hours.",
      "Filter through muslin cloth and spray directly without dilution."
    ]
  },
  brahmastra: {
    id: "brahmastra",
    name: "Brahmastra (Borer & Large Caterpillar Destroyer)",
    hindiName: "ब्रह्मास्त्र",
    replaces: "Heavy Chemical Pesticides (Chlorpyrifos / Cypermethrin)",
    purpose: "Controls hidden borers (pod borer, stem borer, fruit borer) using botanical alkaloids extracted by mild heating.",
    applicationMethod: "Mix 2 to 2.5 litres Brahmastra in 100 litres water for spraying 1 acre.",
    fermentationDays: "Boiled & Fermented 48 Hours",
    shelfLife: "6 Months",
    cost_per_acre: "₹650",
    baseIngredients: [
      { name: "Desi Cow Urine", perAcre: 10, unit: "Litres", source: "Pure indigenous cow urine" },
      { name: "Neem Leaves Paste", perAcre: 2, unit: "kg", source: "Crushed leaves" },
      { name: "Custard Apple (Sharifa) Leaves", perAcre: 2, unit: "kg", source: "Annona squamosa leaves" },
      { name: "Papaya Leaves", perAcre: 2, unit: "kg", source: "Carica papaya leaves" },
      { name: "Pomegranate / Guava Leaves", perAcre: 2, unit: "kg", source: "Punica granatum leaves" },
      { name: "Pongamia / Karanj Leaves", perAcre: 2, unit: "kg", source: "Millettia pinnata leaves" }
    ],
    steps: [
      "Crush all botanical leaves into a coarse paste.",
      "Put paste in a clay pot or steel vessel with 10L cow urine.",
      "Boil on slow fire for 15-20 minutes, then cool and let ferment for 48 hours.",
      "Filter and store in glass or HDPE containers for up to 6 months."
    ]
  },
  agniastra: {
    id: "agniastra",
    name: "Agniastra (Fiery Defense for Severe Infestation)",
    hindiName: "अग्नियास्त्र",
    replaces: "Systemic Chemical Insecticides",
    purpose: "Rapid knockdown of stubborn borers, armyworms, leaf rollers, and severe blight-carrying pests.",
    applicationMethod: "Mix 2 to 2.5 litres in 100 litres of water for foliar spray per acre.",
    fermentationDays: "Boiled & Fermented 48 Hours",
    shelfLife: "3 Months",
    cost_per_acre: "₹750",
    baseIngredients: [
      { name: "Desi Cow Urine", perAcre: 10, unit: "Litres", source: "Pure indigenous cow urine" },
      { name: "Spicy Green Chilli Paste", perAcre: 0.5, unit: "kg", source: "Hot pungent green chillies" },
      { name: "Garlic Paste", perAcre: 0.5, unit: "kg", source: "Crushed raw garlic cloves" },
      { name: "Neem Leaf Paste", perAcre: 2, unit: "kg", source: "Crushed fresh neem" },
      { name: "Tobacco Powder / Snuff (Optional)", perAcre: 0.25, unit: "kg", source: "Organic tobacco leaves" }
    ],
    steps: [
      "Mix all ingredients with cow urine in a pot.",
      "Boil on slow fire until foam reduces (approx 15-20 mins).",
      "Allow to cool and steep for 48 hours in shade.",
      "Strain through fine muslin cloth and store."
    ]
  },
  vermicompost: {
    id: "vermicompost",
    name: "Vermicompost & Earthworm Castings",
    hindiName: "केंचुआ खाद",
    replaces: "Synthetic NPK / DAP",
    purpose: "Rich in humic acid, micro-flora, and essential macro/micronutrients. Enhances soil water-holding capacity.",
    applicationMethod: "Incorporate into topsoil during final field preparation or ring placement around crop root zones.",
    fermentationDays: "60-90 Days Process",
    shelfLife: "1 Year",
    cost_per_acre: "₹6,000",
    baseIngredients: [
      { name: "Earthworm Castings", perAcre: 2000, unit: "kg", source: "Produced using Eisenia fetida earthworms" }
    ],
    steps: [
      "Spread 2-3 tonnes per acre evenly across field before final harrowing.",
      "Irrigate lightly after application to keep beneficial microbes alive."
    ]
  }
};

function getScaledRecipes(areaAcres = 1) {
  const acres = Math.max(0.25, parseFloat(areaAcres) || 1);
  const result = {};

  for (const [key, recipe] of Object.entries(BASE_RECIPES)) {
    result[key] = {
      name: recipe.name,
      hindiName: recipe.hindiName,
      purpose: recipe.purpose,
      replaces: recipe.replaces,
      applicationMethod: recipe.applicationMethod,
      fermentationDays: recipe.fermentationDays,
      shelfLife: recipe.shelfLife,
      cost_per_acre: recipe.cost_per_acre,
      ingredients: recipe.baseIngredients.map(ing => {
        const scaledQty = roundNum(ing.perAcre * acres);
        return {
          name: ing.name,
          quantity: `${scaledQty} ${ing.unit}`,
          source: ing.source
        };
      }),
      steps: recipe.steps
    };
  }

  return result;
}

const CROP_ORGANIC_PROFILES = {
  rice: {
    is_organic_suitable: true,
    organic_transition_period: "3 Years",
    yield_comparison: "Organic yield may initially decrease by 15-20% but stabilizes within 3 years with 30-40% input cost savings.",
    price_premium: "40-60%",
    estimated_organic_profit_increase: 35,
    pests: [
      { pest: "Stem Borer", solution: "Neemastra / Neem Oil Spray (5ml/L)", timing: "Every 15 days during vegetative phase" },
      { pest: "Leaf Folder", solution: "Agniastra (2.5L in 100L water)", timing: "At first sign of leaf folding" }
    ]
  },
  wheat: {
    is_organic_suitable: true,
    organic_transition_period: "2-3 Years",
    yield_comparison: "Yield stabilizes after year 2. Higher gluten and grain quality commands premium price.",
    price_premium: "30-50%",
    estimated_organic_profit_increase: 30,
    pests: [
      { pest: "Aphids / Rust", solution: "Sour buttermilk spray (5L sour lassi in 100L water) + Neemastra", timing: "During cloudy weather" }
    ]
  },
  cotton: {
    is_organic_suitable: true,
    organic_transition_period: "3 Years",
    yield_comparison: "Organic desi cotton requires 60% less water and zero chemical pesticide expenditure.",
    price_premium: "50-70%",
    estimated_organic_profit_increase: 40,
    pests: [
      { pest: "Bollworm", solution: "Brahmastra spray + Marigold trap crops on field borders", timing: "Pre-flowering and boll formation" }
    ]
  }
};

function getOrganicProfile(cropName = 'Rice') {
  const normalized = (cropName || 'rice').toLowerCase().trim();
  const baseProfile = CROP_ORGANIC_PROFILES[normalized] || {
    is_organic_suitable: true,
    organic_transition_period: "2-3 Years",
    yield_comparison: "Input costs decrease by 40-50%. Soil organic carbon increases significantly over 3 years.",
    price_premium: "30-50%",
    estimated_organic_profit_increase: 25,
    pests: [
      { pest: "Sucking Pests", solution: "Neemastra (5L/acre foliar spray)", timing: "Early morning spray every 15 days" },
      { pest: "Blight / Fungal Spores", solution: "Fermented Butter Milk spray (5L in 100L water)", timing: "Preventive spray during high humidity" }
    ]
  };

  const inputs = [
    {
      input_name: BASE_RECIPES.jeevamrut.name,
      replaces: BASE_RECIPES.jeevamrut.replaces,
      preparation_method: BASE_RECIPES.jeevamrut.steps[0] + " " + BASE_RECIPES.jeevamrut.steps[2],
      quantity_per_acre: "200 Litres",
      cost_per_acre: BASE_RECIPES.jeevamrut.cost_per_acre
    },
    {
      input_name: BASE_RECIPES.beejamrut.name,
      replaces: BASE_RECIPES.beejamrut.replaces,
      preparation_method: BASE_RECIPES.beejamrut.steps[0] + " " + BASE_RECIPES.beejamrut.steps[3],
      quantity_per_acre: "As per seed volume",
      cost_per_acre: BASE_RECIPES.beejamrut.cost_per_acre
    },
    {
      input_name: BASE_RECIPES.vermicompost.name,
      replaces: BASE_RECIPES.vermicompost.replaces,
      preparation_method: BASE_RECIPES.vermicompost.steps[0],
      quantity_per_acre: "2-3 Tonnes",
      cost_per_acre: BASE_RECIPES.vermicompost.cost_per_acre
    }
  ];

  return {
    ...baseProfile,
    organic_inputs: inputs,
    market_linkage: [
      { name: "Jaivik Bharat (Govt Organic Portal)", icon: "Leaf", url: "https://jaivikbharat.fssai.gov.in" },
      { name: "e-NAM Organic Trading", icon: "Store", url: "https://enam.gov.in" },
      { name: "Organic India", icon: "ShoppingCart", url: "https://www.organicindia.com" }
    ],
    do_and_dont: {
      dos: [
        "Use certified desi/indigenous seeds.",
        "Maintain multi-crop bio-diversity with pulse rotations.",
        "Maintain 5-meter buffer zone around field borders.",
        "Regularly check soil earthworm population."
      ],
      donts: [
        "Never burn crop stubble or farm biomass.",
        "Do not apply synthetic weedicides or chemical coatings.",
        "Do not mix chlorine tap water when preparing Jeevamrut.",
        "Avoid chemical sprays within 100 meters of organic plots."
      ]
    }
  };
}

module.exports = {
  BASE_RECIPES,
  getScaledRecipes,
  getOrganicProfile
};
