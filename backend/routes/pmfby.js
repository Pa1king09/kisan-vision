const express = require('express');
const router = express.Router();
const PmfbyClaim = require('../models/PmfbyClaim');

// Official PMFBY Scale of Finance & Standard Sum Insured per Acre (in INR)
const CROP_SUM_INSURED = {
    'Paddy / Rice (धान)': { sumInsuredPerAcre: 24000, season: 'Kharif', premiumRatePct: 2.0 },
    'Wheat (गेहूं)': { sumInsuredPerAcre: 20000, season: 'Rabi', premiumRatePct: 1.5 },
    'Cotton (कपास)': { sumInsuredPerAcre: 32000, season: 'Kharif', premiumRatePct: 5.0 },
    'Soybean (सोयाबीन)': { sumInsuredPerAcre: 18500, season: 'Kharif', premiumRatePct: 2.0 },
    'Mustard / Rapeseed (सरसों)': { sumInsuredPerAcre: 16500, season: 'Rabi', premiumRatePct: 1.5 },
    'Maize / Corn (मक्का)': { sumInsuredPerAcre: 15500, season: 'Kharif', premiumRatePct: 2.0 },
    'Groundnut (मूंगफली)': { sumInsuredPerAcre: 21000, season: 'Kharif', premiumRatePct: 2.0 },
    'Sugarcane (गन्ना)': { sumInsuredPerAcre: 42000, season: 'Annual', premiumRatePct: 5.0 },
    'Gram / Chana (चना)': { sumInsuredPerAcre: 17500, season: 'Rabi', premiumRatePct: 1.5 },
    'Onion (प्याज़)': { sumInsuredPerAcre: 35000, season: 'Kharif / Rabi', premiumRatePct: 5.0 },
    'Potato (आलू)': { sumInsuredPerAcre: 38000, season: 'Rabi', premiumRatePct: 5.0 },
    'Tomato (टमाटर)': { sumInsuredPerAcre: 36000, season: 'Annual', premiumRatePct: 5.0 },
    'Chilli (मिर्च)': { sumInsuredPerAcre: 32000, season: 'Annual', premiumRatePct: 5.0 },
    'Bajra / Pearl Millet (बाजरा)': { sumInsuredPerAcre: 13000, season: 'Kharif', premiumRatePct: 2.0 },
    'Jowar / Sorghum (ज्वार)': { sumInsuredPerAcre: 14000, season: 'Kharif', premiumRatePct: 2.0 },
    'Sunflower (सूरजमुखी)': { sumInsuredPerAcre: 16000, season: 'Kharif / Rabi', premiumRatePct: 1.5 },
    'Tur / Arhar / Pigeon Pea (अरहर)': { sumInsuredPerAcre: 19500, season: 'Kharif', premiumRatePct: 2.0 },
    'Urad / Black Gram (उड़द)': { sumInsuredPerAcre: 15000, season: 'Kharif', premiumRatePct: 2.0 },
    'Moong / Green Gram (मूंग)': { sumInsuredPerAcre: 15500, season: 'Kharif / Zaid', premiumRatePct: 2.0 },
    'Barley (जौ)': { sumInsuredPerAcre: 15000, season: 'Rabi', premiumRatePct: 1.5 }
};

// State-wise Designated Insurance Companies (Official Empaneled PMFBY Agencies)
const STATE_INSURERS = {
    'Maharashtra': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.mumbai@aicofindia.com',
        website: 'https://aicofindia.com'
    },
    'Madhya Pradesh': {
        company: 'HDFC ERGO General Insurance Co.',
        tollFree: '1800-266-0700 / 14447',
        email: 'pmfby.mp@hdfcergo.com',
        website: 'https://hdfcergo.com'
    },
    'Uttar Pradesh': {
        company: 'Bajaj Allianz General Insurance',
        tollFree: '1800-209-5959 / 14447',
        email: 'customercare@bajajallianz.co.in',
        website: 'https://bajajallianz.com'
    },
    'Rajasthan': {
        company: 'SBI General Insurance Co. Ltd.',
        tollFree: '1800-22-1111 / 14447',
        email: 'customer.care@sbigeneral.in',
        website: 'https://sbigeneral.in'
    },
    'Gujarat': {
        company: 'ICICI Lombard General Insurance',
        tollFree: '1800-2666 / 14447',
        email: 'customersupport@icicilombard.com',
        website: 'https://icicilombard.com'
    },
    'Karnataka': {
        company: 'Universal Sompo General Insurance',
        tollFree: '1800-22-4030 / 14447',
        email: 'contactus@universalsompo.com',
        website: 'https://universalsompo.com'
    },
    'Andhra Pradesh': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.hyderabad@aicofindia.com',
        website: 'https://aicofindia.com'
    },
    'Telangana': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.hyderabad@aicofindia.com',
        website: 'https://aicofindia.com'
    },
    'Haryana': {
        company: 'Reliance General Insurance',
        tollFree: '1800-3009 / 14447',
        email: 'services.rgicl@relianceada.com',
        website: 'https://reliancegeneral.co.in'
    },
    'Punjab': {
        company: 'State Department of Agriculture & Farmers Welfare',
        tollFree: '1800-180-1551',
        email: 'agripunjab@punjab.gov.in',
        website: 'https://agri.punjab.gov.in'
    },
    'Odisha': {
        company: 'IFFCO-Tokio General Insurance',
        tollFree: '1800-103-5499 / 14447',
        email: 'support@iffcotokio.co.in',
        website: 'https://iffcotokio.co.in'
    },
    'Tamil Nadu': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.chennai@aicofindia.com',
        website: 'https://aicofindia.com'
    },
    'Bihar': {
        company: 'Bihar Rajya Fasal Sahayata Yojana (BRFSY)',
        tollFree: '1800-345-6290',
        email: 'support.cooperative@bihar.gov.in',
        website: 'https://pacsonline.bih.nic.in'
    },
    'West Bengal': {
        company: 'Bangla Shasya Bima (BSB) - AIC of India',
        tollFree: '1800-572-7142',
        email: 'ro.kolkata@aicofindia.com',
        website: 'https://banglashasyabima.net'
    },
    'Chhattisgarh': {
        company: 'Future Generali India Insurance',
        tollFree: '1800-220-233 / 14447',
        email: 'fgcare@futuregenerali.in',
        website: 'https://futuregenerali.in'
    },
    'Jharkhand': {
        company: 'Jharkhand Fasal Rahat Yojana',
        tollFree: '1800-123-1136',
        email: 'jfrjharkhand@gmail.com',
        website: 'https://jfr.jharkhand.gov.in'
    },
    'Himachal Pradesh': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.chandigarh@aicofindia.com',
        website: 'https://aicofindia.com'
    },
    'Assam': {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800-11-6515 / 14447',
        email: 'ro.guwahati@aicofindia.com',
        website: 'https://aicofindia.com'
    }
};

const DEFAULT_INSURER = {
    company: 'Agriculture Insurance Company of India (AIC)',
    tollFree: '1800-11-6515 / 14447',
    email: 'ro.delhi@aicofindia.com',
    website: 'https://pmfby.gov.in'
};

// ── GET /api/pmfby/meta ─────────────────────────
router.get('/pmfby/meta', (req, res) => {
    try {
        const crops = Object.keys(CROP_SUM_INSURED);
        const states = Object.keys(STATE_INSURERS);
        const calamityCauses = [
            'Hailstorm (ओलावृष्टि)',
            'Inundation / Local Flood (जलभराव)',
            'Cyclone / Heavy Unseasonal Rain (चक्रवात / बेमौसम बारिश)',
            'Landslide / Cloudburst (भूस्खलन / बादल फटना)',
            'Severe Pest Outbreak (तीव्र कीट / टिड्डी प्रकोप)',
            'Drought / Severe Moisture Stress (सूखा)',
            'Post-Harvest Loss (कटी फसल पर बारिश - 14 दिन नियम)',
            'Frost / Cold Wave Damage (पाला)'
        ];

        const rules = [
            {
                title: "Strict 72-Hour Reporting Mandate",
                desc: "According to Clause 21 of PMFBY Guidelines, localized calamities (hailstorm, waterlogging, landslides) must be reported within 72 hours of occurrence. Failure to intimate on time allows insurance firms to deny claims."
            },
            {
                title: "Mandatory Geo-Tagged Evidence",
                desc: "Capture at least 2 clear photos of the damaged field showing survey boundary markers, standing water or shredded foliage, with GPS coordinates and date/time stamps enabled."
            },
            {
                title: "Joint Survey Protocol",
                desc: "Within 48 hours of intimation, a Joint Committee consisting of the Insurance Surveyor, Block Agriculture Officer, and Revenue Patwari will visit your field to survey the loss."
            },
            {
                title: "Direct Benefit Transfer (DBT)",
                desc: "Approved compensation is credited directly into the farmer's Aadhaar-linked Bank/KCC Account within 15 to 21 days of survey completion."
            }
        ];

        res.json({
            success: true,
            crops,
            cropDetails: CROP_SUM_INSURED,
            states,
            stateInsurers: STATE_INSURERS,
            calamityCauses,
            rules,
            centralHelpline: {
                pmfbyTollFree: '14447',
                kisanCallCenter: '1800-180-1551',
                cropInsuranceApp: 'https://play.google.com/store/apps/details?id=in.farmguide.farmerapp',
                portalUrl: 'https://pmfby.gov.in'
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/pmfby/calculate ─────────────────────
router.post('/pmfby/calculate', (req, res) => {
    try {
        const {
            crop = 'Paddy / Rice (धान)',
            state = 'Maharashtra',
            sownAreaAcres = 2.5,
            damagedAreaAcres = 2.0,
            damagePercentage = 70
        } = req.body;

        const cropMeta = CROP_SUM_INSURED[crop] || { sumInsuredPerAcre: 22000, premiumRatePct: 2.0, season: 'Kharif' };
        const insurer = STATE_INSURERS[state] || DEFAULT_INSURER;

        const sown = Math.max(0.1, parseFloat(sownAreaAcres) || 1);
        const damaged = Math.min(sown, Math.max(0.1, parseFloat(damagedAreaAcres) || sown));
        const damagePct = Math.min(100, Math.max(1, parseFloat(damagePercentage) || 50));

        const sumInsuredPerAcre = cropMeta.sumInsuredPerAcre;
        const totalSumInsured = Math.round(sown * sumInsuredPerAcre);
        const damagedSumInsured = Math.round(damaged * sumInsuredPerAcre);

        // Claim Formula: Damaged Area * Sum Insured Per Acre * (Damage % / 100)
        const estimatedCompensation = Math.round(damagedSumInsured * (damagePct / 100));

        // Farmer Premium Contribution (e.g. 2% for Kharif, 1.5% for Rabi, 5% for Commercial)
        const farmerPremiumPaid = Math.round(totalSumInsured * (cropMeta.premiumRatePct / 100));
        const netBenefitMultiplier = farmerPremiumPaid > 0 ? (estimatedCompensation / farmerPremiumPaid).toFixed(1) : 'N/A';

        res.json({
            success: true,
            data: {
                crop,
                state,
                season: cropMeta.season,
                sownAreaAcres: sown,
                damagedAreaAcres: damaged,
                damagePercentage: damagePct,
                sumInsuredPerAcre,
                totalSumInsured,
                damagedSumInsured,
                estimatedCompensation,
                farmerPremiumPaid,
                premiumRatePct: cropMeta.premiumRatePct,
                netBenefitMultiplier,
                insuranceCompany: insurer.company,
                tollFreeHelpline: insurer.tollFree,
                supportEmail: insurer.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/pmfby/claims ─────────────────────────
router.post('/pmfby/claims', async (req, res) => {
    try {
        const {
            userId = 'anonymous',
            farmerName,
            contactNumber,
            aadhaarNumber = '',
            kccOrPolicyNo = '',
            bankName = '',
            accountNumber = '',
            state = 'Maharashtra',
            district,
            village,
            surveyKhasraNo = '',
            crop = 'Paddy / Rice (धान)',
            season = 'Kharif',
            sownAreaAcres,
            damagedAreaAcres,
            calamityCause,
            calamityDate,
            calamityTime = '12:00',
            cropStage = 'Standing Crop (Vegetative/Flowering)',
            damagePercentage,
            evidencePhotos = [],
            notes = ''
        } = req.body;

        if (!farmerName || !contactNumber || !village || !district) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all mandatory fields (Name, Phone, Village, District).'
            });
        }

        // Robust date parsing (handles mobile ISO, date-only, local formats)
        let calamityDateTime = new Date(`${calamityDate}T${calamityTime || '12:00'}:00`);
        if (isNaN(calamityDateTime.getTime())) {
            calamityDateTime = new Date(calamityDate);
        }
        if (isNaN(calamityDateTime.getTime())) {
            calamityDateTime = new Date();
        }

        const now = new Date();
        const diffMs = now - calamityDateTime;
        const hoursPassed = isNaN(diffMs) ? 0 : Math.max(0, diffMs / (1000 * 60 * 60));
        const within72Hours = hoursPassed <= 72;
        const hoursRemainingAtSubmission = Math.max(0, Math.round(72 - hoursPassed)) || 0;

        // Compensation Calculation safeguards
        const cropMeta = CROP_SUM_INSURED[crop] || { sumInsuredPerAcre: 22000, premiumRatePct: 2.0 };
        const insurer = STATE_INSURERS[state] || DEFAULT_INSURER;

        const sown = Math.max(0.1, parseFloat(sownAreaAcres) || 1.0);
        const damaged = Math.min(sown, Math.max(0.1, parseFloat(damagedAreaAcres) || sown));
        const damagePct = Math.min(100, Math.max(1, parseFloat(damagePercentage) || 70));

        const sumInsuredPerAcre = Number(cropMeta.sumInsuredPerAcre) || 20000;
        const estimatedCompensation = Math.round(damaged * sumInsuredPerAcre * (damagePct / 100)) || 0;
        const farmerPremiumPaid = Math.round(sown * sumInsuredPerAcre * ((cropMeta.premiumRatePct || 2.0) / 100)) || 0;

        // Generate unique Claim Reference
        const year = new Date().getFullYear();
        const stateCode = (state || 'IN').substring(0, 2).toUpperCase();
        const randId = Math.floor(100000 + Math.random() * 900000);
        const claimRef = `PMFBY/${year}/${stateCode}-${Date.now().toString().slice(-4)}${randId.toString().slice(-3)}`;

        // Sanitize evidencePhotos (keep maximum 4 compressed photos to protect storage)
        const sanitizedPhotos = Array.isArray(evidencePhotos) ? evidencePhotos.slice(0, 4) : [];

        const newClaim = new PmfbyClaim({
            claimRef,
            userId,
            farmerName: String(farmerName).trim(),
            contactNumber: String(contactNumber).trim(),
            aadhaarNumber: String(aadhaarNumber || '').trim(),
            kccOrPolicyNo: String(kccOrPolicyNo || '').trim(),
            bankName: String(bankName || '').trim(),
            accountNumber: String(accountNumber || '').trim(),
            state,
            district: String(district).trim(),
            village: String(village).trim(),
            surveyKhasraNo: String(surveyKhasraNo || '').trim(),
            crop,
            season,
            sownAreaAcres: sown,
            damagedAreaAcres: damaged,
            calamityCause: calamityCause || 'Hailstorm (ओलावृष्टि)',
            calamityDate: calamityDateTime,
            calamityTime: calamityTime || '12:00',
            cropStage,
            damagePercentage: damagePct,
            sumInsuredPerAcre,
            estimatedCompensation,
            farmerPremiumPaid,
            insuranceCompany: insurer.company,
            tollFreeHelpline: insurer.tollFree,
            surveyorStatus: 'Claim Intimated (72-hr Window Complied)',
            within72Hours,
            hoursRemainingAtSubmission,
            evidencePhotos: sanitizedPhotos,
            notes: String(notes || '').trim()
        });

        await newClaim.save();

        // Generate Dossier Text for WhatsApp / Email
        const calamityDateFormatted = calamityDateTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const whatsappText = `🚨 *URGENT PMFBY CROP DAMAGE INTIMATION (72-HR NOTICE)*\n` +
            `📋 *Ref:* ${claimRef}\n` +
            `👤 *Farmer:* ${farmerName} | 📞 ${contactNumber}\n` +
            `📍 *Location:* Village ${village}, Dist. ${district}, ${state}\n` +
            `📜 *Khasra/Survey No:* ${surveyKhasraNo || 'Provided upon survey'}\n` +
            `🌾 *Crop:* ${crop} (${sown} Acres Sown)\n` +
            `⚡ *Calamity:* ${calamityCause} on ${calamityDateFormatted}\n` +
            `💥 *Estimated Damage:* ${damagePct}% (${damaged} Acres destroyed)\n` +
            `💰 *Claim Compensation:* ₹${estimatedCompensation.toLocaleString('en-IN')}\n` +
            `🏢 *Designated Insurer:* ${insurer.company}\n` +
            `🕒 *Compliance:* ${within72Hours ? `✅ Within 72-Hour Window (${hoursRemainingAtSubmission} hrs remaining)` : '⚠️ Exceeded 72 hrs (Special waiver requested)'}\n` +
            `Please dispatch an authorized insurance surveyor for the joint field assessment within 48 hours as per PMFBY Operational Guidelines.`;

        res.status(201).json({
            success: true,
            message: 'PMFBY Crop Damage Claim Dossier created successfully!',
            claim: newClaim,
            whatsappText,
            insurer
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/pmfby/claims ──────────────────────────
router.get('/pmfby/claims', async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId && userId !== 'anonymous' ? { userId } : {};
        const claims = await PmfbyClaim.find(filter).sort({ createdAt: -1 }).limit(30);

        res.json({
            success: true,
            count: claims.length,
            data: claims
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/pmfby/claims/:id ──────────────────────
router.get('/pmfby/claims/:id', async (req, res) => {
    try {
        const claim = await PmfbyClaim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ success: false, message: 'Claim not found' });
        }
        res.json({ success: true, data: claim });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
