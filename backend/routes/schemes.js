const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');

const universalSchemes = [
    {
        name: "PM-KISAN",
        fullName: "Pradhan Mantri Kisan Samman Nidhi",
        benefit: "Income support of ₹6,000 per year in three equal installments.",
        eligibility: "All landholding farmer families across the country.",
        howToApply: "Register on the PM-KISAN portal or through CSC (Common Service Centers).",
        documents: ["Aadhaar Card", "Land Ownership Papers", "Bank Account Details"],
        website: "https://pmkisan.gov.in",
        helpline: "155261 / 1800115526"
    },
    {
        name: "PMFBY",
        fullName: "Pradhan Mantri Fasal Bima Yojana",
        benefit: "Comprehensive crop insurance with low premiums: 2% for Kharif, 1.5% for Rabi crops.",
        eligibility: "All farmers growing notified crops in notified areas.",
        howToApply: "Apply through the National Crop Insurance Portal or banks.",
        documents: ["ID Proof", "Address Proof", "Sowing Certificate", "Land Records"],
        website: "https://pmfby.gov.in",
        helpline: "18001801551"
    },
    {
        name: "Kisan Credit Card (KCC)",
        fullName: "Kisan Credit Card Scheme",
        benefit: "Short-term credit for cultivation with interest rates as low as 4% after timely repayment.",
        eligibility: "All farmers, including owner-cultivators, tenant farmers, and sharecroppers.",
        howToApply: "Visit any commercial or cooperative bank or apply through the PM-KISAN portal.",
        documents: ["Aadhaar Card", "Land Records", "Passport Size Photo"],
        website: "https://www.myscheme.gov.in/schemes/kcc",
        helpline: "1800115526"
    },
    {
        name: "Soil Health Card",
        fullName: "Soil Health Card Scheme",
        benefit: "Free soil testing every 2 years and customized fertilizer recommendations.",
        eligibility: "All farmers in India.",
        howToApply: "Contact local agriculture department or registered soil testing labs.",
        documents: ["Aadhaar Card", "Land Survey Number"],
        website: "https://soilhealth.dac.gov.in",
        helpline: "18001801551"
    },
    {
        name: "PM-KUSUM",
        fullName: "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan",
        benefit: "60% government subsidy for solar pumps and solarization of existing grid-connected pumps.",
        eligibility: "Individual farmers, groups of farmers, and cooperatives.",
        howToApply: "Apply through state-level renewable energy agencies.",
        documents: ["Identity Proof", "Land Ownership Proof", "Bank Details"],
        website: "https://mnre.gov.in/solar/pm-kusum",
        helpline: "18001803333"
    }
];

const cropSpecificSchemes = {
    'Rice': [
        {
            name: "NFSM-Rice",
            fullName: "National Food Security Mission - Rice",
            benefit: "Subsidies on seeds, farm machinery, and integrated pest management.",
            eligibility: "Rice farmers in identified NFSM districts.",
            howToApply: "Contact District Agriculture Officer (DAO).",
            documents: ["Aadhaar", "Passbook", "Land Record"],
            website: "https://www.nfsm.gov.in"
        },
        {
            name: "PKVY",
            fullName: "Paramparagat Krishi Vikas Yojana",
            benefit: "Support for organic rice cultivation and certification (₹50,000 per hectare for 3 years).",
            eligibility: "Groups of farmers adopting organic farming.",
            howToApply: "Join or form a farmer cluster through the local agriculture office.",
            documents: ["Cluster Certificate", "Individual ID"],
            website: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
        }
    ],
    'Wheat': [
        {
            name: "NFSM-Wheat",
            fullName: "National Food Security Mission - Wheat",
            benefit: "Financial assistance for high-yielding seeds and micro-irrigation systems.",
            eligibility: "Farmers in NFSM-Wheat covered clusters.",
            howToApply: "Apply through the Block Agriculture Office.",
            documents: ["Aadhaar Card", "Land Records"],
            website: "https://www.nfsm.gov.in"
        }
    ],
    'Cotton': [
        {
            name: "Technology Mission on Cotton",
            fullName: "TMC - Mini Mission Scheme",
            benefit: "Infrastructure support for cotton technology transfers and market yard development.",
            eligibility: "Cotton growers and processors.",
            howToApply: "Contact the Cotton Corporation of India (CCI).",
            documents: ["Industry/Farmer Registration", "Land Details"],
            website: "https://cotcorp.org.in"
        }
    ],
    'Sugarcane': [
        {
            name: "FRP Scheme",
            fullName: "Fair and Remunerative Price",
            benefit: "Legal guarantee for a minimum price paid by sugar mills to farmers.",
            eligibility: "All sugarcane farmers selling to registered sugar mills.",
            howToApply: "Automatic benefit upon delivery to registered sugar factories.",
            documents: ["Factory Delivery Slip", "Bank Passbook"],
            website: "https://dfpd.gov.in"
        }
    ],
    'Maize': [
        {
            name: "NFSM-Maize",
            fullName: "National Food Security Mission - Oilseeds and Maize",
            benefit: "Promotion of high-yielding hybrids and linkage with starch/poultry feed industries.",
            eligibility: "Maize farmers in notified districts.",
            howToApply: "Register at the District Agriculture Office.",
            documents: ["Aadhaar", "Land Records"],
            website: "https://www.nfsm.gov.in"
        }
    ],
    'Coffee': [
        {
            name: "Coffee Board Subsidies",
            fullName: "Export Promotion and Market Development Scheme",
            benefit: "Incentives for quality improvement, export promotion, and lab testing.",
            eligibility: "Registered coffee estate owners.",
            howToApply: "Apply through the Coffee Board of India portal.",
            documents: ["Coffee Board Registration", "Quantity Logs"],
            website: "https://www.indiacoffee.org"
        }
    ],
    'Coconut': [
        {
            name: "CDB Schemes",
            fullName: "Coconut Development Board Integrated Farming",
            benefit: "Subsidy for new plantations, replanting, and organic manure units.",
            eligibility: "Coconut growers with at least 10 palm trees.",
            howToApply: "Apply to the CDB regional office or online portal.",
            documents: ["Ownership Proof", "Bank Accounts"],
            website: "https://www.coconutboard.gov.in"
        }
    ],
    'Banana': [
        {
            name: "MIDH - Banana",
            fullName: "Mission for Integrated Development of Horticulture",
            benefit: "Support for high-density planting and post-harvest infrastructure (cold storage).",
            eligibility: "Horticulture farmers.",
            howToApply: "Contact State Horticulture Mission (SHM).",
            documents: ["Land Documents", "Voter ID/Aadhaar"],
            website: "https://midh.gov.in"
        }
    ],
    'Jute': [
        {
            name: "Jute ICARE",
            fullName: "Integrated Cultivation and Advanced Retting Exercise",
            benefit: "Improved retting technology and quality seeds distribution.",
            eligibility: "Jute farmers in major producing states like West Bengal, Bihar, Assam.",
            howToApply: "Register with the Jute Corporation of India (JCI).",
            documents: ["JCI Farmer Card", "Aadhaar"],
            website: "https://www.jutecorp.in"
        }
    ]
};

router.post('/government-schemes', (req, res) => {
    try {
        const { crop, season } = req.body;
        const normalizedCrop = Object.keys(cropSpecificSchemes).find(
            k => k.toLowerCase() === crop?.toLowerCase()
        ) || null;

        const cropSpecific = normalizedCrop ? cropSpecificSchemes[normalizedCrop] : [];

        return success(res, {
            universal_schemes: universalSchemes,
            crop_specific_schemes: cropSpecific,
            state_schemes_note: "Specific state-level subsidies (e.g., Rythu Bandhu in Telangana, Kalia in Odisha) may also apply based on your local residency.",
            kisan_helpline: "1800-180-1551"
        });
    } catch (err) {
        console.error('Error fetching schemes:', err.message);
        res.status(500).json({ error: 'Failed to retrieve government schemes' });
    }
});

module.exports = router;
