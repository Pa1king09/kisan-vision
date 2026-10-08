const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');
const { getOrganicProfile } = require('../services/organicRecipeService');

router.post('/organic-farming', (req, res) => {
    try {
        const { crop, soil_type, land_area_acres } = req.body;
        const profile = getOrganicProfile(crop || 'Rice');

        const certificationSteps = [
            { step: 1, name: "Registration", desc: "Register at APEDA (NPOP) or Regional Council for PGS-India.", cost: "₹2,000 - ₹5,000", time: "1 Month" },
            { step: 2, name: "Inspection", desc: "Government inspectors visit to verify soil and inputs.", cost: "Based on travel", time: "Ongoing" },
            { step: 3, name: "Transition Mode", desc: "Farm is marked 'In-conversion' (C1, C2, C3).", cost: "Zero", time: "1-3 Years" },
            { step: 4, name: "Certification", desc: "Receive 'India Organic' or 'Jaivik Bharat' seal.", cost: "Renewable annually", time: "Final Week" }
        ];

        return success(res, {
            ...profile,
            pest_management: profile.pests.map(p => ({
                pest: p.pest,
                solution: p.solution,
                preparation: "Prepare natural biological extract without chemical adulteration.",
                application: p.timing
            })),
            certification: certificationSteps,
            institution_contacts: ["NPOP - National Programme for Organic Production", "NHM - National Horticulture Mission", "Jaivik Kheti Portal (jaivikkheti.in)"],
            disclaimer: "Organic yields depend heavily on local soil microbiology health and boundary isolation sincerity."
        });
    } catch (err) {
        console.error('Error in organic route:', err.message);
        res.status(500).json({ error: 'Internal server error in organic engine' });
    }
});

module.exports = router;
