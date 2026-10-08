const express = require('express');
const router = express.Router();

const SCHEMES = [
  {
    id: 'pm_kisan',
    name: 'PM-KISAN (PM Kisan Samman Nidhi)',
    description: 'Direct income support of ₹6,000 per year in 3 instalments (₹2,000 each) to all landholding farmer families.',
    benefit_amount: '₹6,000 per year',
    how_to_apply: 'https://pmkisan.gov.in',
    documents_needed: ['Aadhaar card', 'Land records (Khatoni/Pahani)', 'Bank account passbook', 'Mobile number'],
    check: ({ has_bank_account, land_area_acres }) => land_area_acres > 0 && has_bank_account,
    estimated_benefit: (input) => 6000,
    fail_reason: 'Requires valid land records and linked bank account'
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive crop insurance covering losses from natural calamities, pests & diseases. Premium: 2% for Kharif, 1.5% for Rabi crops.',
    benefit_amount: 'Full insured sum on crop loss (₹25,000–₹1,50,000/acre depending on crop)',
    how_to_apply: 'https://pmfby.gov.in',
    documents_needed: ['Aadhaar card', 'Land records', 'Bank account', 'Sowing certificate from patwari'],
    check: ({ has_bank_account, land_area_acres }) => land_area_acres > 0 && has_bank_account,
    estimated_benefit: (input) => Math.round(input.land_area_acres * 40000),
    fail_reason: 'Requires valid land records and bank account linked to Aadhaar'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    description: 'Flexible credit for crop cultivation at just 4% interest rate per annum (after government interest subvention). Credit limit based on land holdings.',
    benefit_amount: 'Credit up to ₹3 lakh at 4% interest',
    how_to_apply: 'Apply at any nationalized bank or cooperative society branch',
    documents_needed: ['Aadhaar card', 'Land records', 'Two passport photos', 'Bank account', 'Income certificate'],
    check: ({ has_bank_account, land_area_acres }) => land_area_acres > 0 && has_bank_account,
    estimated_benefit: (input) => Math.min(Math.round(input.land_area_acres * 25000), 300000),
    fail_reason: 'Requires land ownership and bank account'
  },
  {
    id: 'pmksy',
    name: 'PM Krishi Sinchai Yojana (PMKSY)',
    description: 'Subsidy for drip and sprinkler irrigation systems. Small/marginal farmers get 55% subsidy, large farmers get 45% subsidy on irrigation equipment.',
    benefit_amount: '45–55% subsidy on drip/sprinkler irrigation cost',
    how_to_apply: 'Apply at District Agriculture Office or state agriculture portal',
    documents_needed: ['Aadhaar', 'Land records', 'Bank account', 'Soil & water test report'],
    check: ({ land_area_acres }) => land_area_acres >= 0.5,
    estimated_benefit: (input) => {
      const isSmall = input.is_small_farmer;
      const costPerAcre = 30000;
      const subsidy = isSmall ? 0.55 : 0.45;
      return Math.round(input.land_area_acres * costPerAcre * subsidy);
    },
    fail_reason: 'Minimum 0.5 acre land required'
  },
  {
    id: 'soil_health_card',
    name: 'Soil Health Card Scheme',
    description: 'Free soil testing and a printed card with soil nutrient status and fertilizer recommendations for your field. Test every 2 years.',
    benefit_amount: 'Free soil testing (saves ₹500–1,000 testing cost)',
    how_to_apply: 'Contact nearest KVK or District Agriculture Office',
    documents_needed: ['Aadhaar card', 'Land records or farmer ID'],
    check: () => true,
    estimated_benefit: () => 1000,
    fail_reason: null
  },
  {
    id: 'nfsm',
    name: 'National Food Security Mission (NFSM)',
    description: 'Subsidized distribution of certified seeds, micronutrients, and farm machinery for rice, wheat, pulses, and oilseeds.',
    benefit_amount: 'Seeds at 50% subsidy + 25% subsidy on farm equipment',
    how_to_apply: 'Apply at State Agriculture Department or block Agriculture Officer',
    documents_needed: ['Aadhaar', 'Land records', 'Farmer ID card'],
    check: ({ crop }) => ['rice', 'wheat', 'pulses', 'oilseeds', 'chickpea', 'lentil', 'groundnut', 'mustard', 'soybean'].some(c => crop?.toLowerCase().includes(c)),
    estimated_benefit: (input) => Math.round(input.land_area_acres * 2000),
    fail_reason: 'Available for rice, wheat, pulses, and oilseed farmers only'
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Financial support for converting to organic farming. Cluster-based approach with ₹50,000 per hectare over 3 years for organic inputs and certification.',
    benefit_amount: '₹50,000 per hectare over 3 years (₹31,000 as input assistance)',
    how_to_apply: 'Apply through Agriculture Department with minimum 20-farmer group',
    documents_needed: ['Aadhaar', 'Land records', 'Farmer group formation certificate'],
    check: ({ land_area_acres, annual_income }) => land_area_acres >= 2 && annual_income <= 500000,
    estimated_benefit: (input) => Math.round(input.land_area_acres * 0.4 * 31000), // hectare = acre * 0.404686
    fail_reason: 'Requires minimum 2 acres land and formation of 20-farmer cluster'
  },
  {
    id: 'pmkmy',
    name: 'PM Kisan Maandhan Yojana (Pension)',
    description: 'Voluntary pension scheme for small/marginal farmers. Monthly contribution of ₹55–200 ensures ₹3,000/month pension after age 60.',
    benefit_amount: '₹3,000/month pension after age 60',
    how_to_apply: 'Register at nearest CSC (Common Service Centre)',
    documents_needed: ['Aadhaar card', 'Bank account', 'Land records showing small/marginal farmer status'],
    check: ({ is_small_farmer, has_bank_account }) => is_small_farmer && has_bank_account,
    estimated_benefit: () => 36000, // annual pension
    fail_reason: 'Only for small/marginal farmers (< 2 hectare land)'
  },
  {
    id: 'enam',
    name: 'e-NAM (National Agriculture Market)',
    description: 'Online trading platform connecting farmers directly with buyers. Sell your produce at transparent prices without middlemen. Registration free.',
    benefit_amount: 'Better price realization (typically 10–15% higher than local mandi)',
    how_to_apply: 'https://enam.gov.in — register or visit your nearest APMC mandi',
    documents_needed: ['Aadhaar card', 'Bank account', 'Mobile number'],
    check: ({ has_bank_account }) => has_bank_account,
    estimated_benefit: (input) => Math.round(input.land_area_acres * 8000 * 0.12), // 12% price improvement estimate
    fail_reason: 'Requires bank account and mobile number for registration'
  },
  {
    id: 'aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    description: 'Subsidized loans up to ₹1 crore at 3% interest subsidy for post-harvest management, cold storage, warehouses, and processing units.',
    benefit_amount: '3% interest subvention on loan (up to ₹1 crore)',
    how_to_apply: 'Apply at https://agriinfra.dac.gov.in or through any bank',
    documents_needed: ['Aadhaar', 'Project report', 'Land documents', 'Bank account'],
    check: ({ land_area_acres, annual_income }) => land_area_acres >= 5 || annual_income <= 300000,
    estimated_benefit: () => 90000, // approximate saving on interest per year
    fail_reason: 'Best suited for FPOs, farmers with ≥5 acres, or group activities'
  },
  {
    id: 'micro_irrigation',
    name: 'Micro Irrigation Fund (MIF)',
    description: 'Special fund for subsidizing drip and sprinkler irrigation for small and marginal farmers at concessional interest rates through NABARD.',
    benefit_amount: 'Subsidy up to 90% for SC/ST/small farmers on drip irrigation',
    how_to_apply: 'Apply through State Agriculture Department or NABARD district office',
    documents_needed: ['Aadhaar', 'Land records', 'Caste certificate (if applicable)', 'Bank account'],
    check: ({ is_small_farmer }) => is_small_farmer,
    estimated_benefit: (input) => Math.round(input.land_area_acres * 35000 * 0.75),
    fail_reason: 'Priority given to small/marginal farmers (less than 2 hectares)'
  },
  {
    id: 'kisan_drones',
    name: 'Kisan Drone Scheme',
    description: 'Subsidy for purchasing agricultural drones for crop monitoring, fertilizer spraying, and field mapping. SC/ST/small farmers get higher subsidy.',
    benefit_amount: '50% subsidy (up to ₹2.5 lakh) for general farmers; SC/ST get higher subsidy',
    how_to_apply: 'Apply at Agriculture Department or FPO — drones must be DGCA certified',
    documents_needed: ['Aadhaar', 'Land records', 'FPO/SHG membership (if applying as group)'],
    check: ({ land_area_acres }) => land_area_acres >= 10,
    estimated_benefit: () => 250000,
    fail_reason: 'Best suited for large farmers (10+ acres) or FPO groups'
  }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

// POST /api/loan-eligibility
router.post('/loan-eligibility', (req, res) => {
  try {
    const {
      land_area_acres = 0,
      annual_income = 0,
      crop = '',
      state = '',
      has_kisan_card = false,
      is_small_farmer = false,
      bank_account = true
    } = req.body;

    const input = {
      land_area_acres: parseFloat(land_area_acres) || 0,
      annual_income: parseFloat(annual_income) || 0,
      crop,
      state,
      has_kisan_card,
      is_small_farmer,
      has_bank_account: bank_account
    };

    const eligible_schemes = SCHEMES.map(scheme => {
      const is_eligible = scheme.check(input);
      const estimated_benefit = is_eligible ? scheme.estimated_benefit(input) : 0;
      return {
        id: scheme.id,
        name: scheme.name,
        description: scheme.description,
        is_eligible,
        estimated_benefit: `₹${estimated_benefit.toLocaleString('en-IN')}`,
        estimated_benefit_value: estimated_benefit,
        benefit_amount: scheme.benefit_amount,
        reason: is_eligible ? 'You are eligible based on your provided details' : (scheme.fail_reason || 'Does not meet eligibility criteria'),
        how_to_apply: scheme.how_to_apply,
        documents_needed: scheme.documents_needed
      };
    });

    const eligible_count = eligible_schemes.filter(s => s.is_eligible).length;
    const total_benefit_value = eligible_schemes.reduce((sum, s) => sum + s.estimated_benefit_value, 0);
    const kcc_limit = Math.min(Math.round(input.land_area_acres * 25000), 300000);

    const tips = [];
    if (!input.has_bank_account) tips.push('Open a bank account immediately — most schemes require direct bank transfer');
    if (input.land_area_acres === 0) tips.push('Ensure your land is registered in your name for government scheme benefits');
    if (!input.is_small_farmer && input.land_area_acres <= 5) tips.push('You may qualify as a small/marginal farmer (< 2 hectares) — get verified at your local panchayat');
    if (!input.has_kisan_card) tips.push('Apply for Kisan Credit Card at your bank — it gives you 4% crop loan instantly');
    tips.push('Visit your nearest Krishi Vigyan Kendra (KVK) for free guidance on applying to all these schemes');
    tips.push('PM-KISAN transfers happen every 4 months — register at pmkisan.gov.in if not done yet');

    res.json({
      success: true,
      data: {
        eligible_schemes,
        eligible_count,
        total_benefit_estimate: `₹${total_benefit_value.toLocaleString('en-IN')} per year`,
        kcc_loan_limit: `₹${kcc_limit.toLocaleString('en-IN')}`,
        tips,
        indian_states: INDIAN_STATES
      }
    });
  } catch (err) {
    console.error('Loan eligibility error:', err.message);
    res.status(500).json({ success: false, message: 'Error checking eligibility' });
  }
});

// GET /api/indian-states (helper for frontend)
router.get('/indian-states', (req, res) => {
  res.json({ success: true, data: INDIAN_STATES });
});

module.exports = router;
