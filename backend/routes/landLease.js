const express = require('express');
const router = express.Router();
const LandListing = require('../models/LandListing');
const LeaseEnquiry = require('../models/LeaseEnquiry');

// High-quality Initial Seed Data for Indian Agricultural Farm Lands
const SEED_LISTINGS = [
    {
        title: "2.5 Acres Fertile Red Soil Farmland with 2 High-Yield Borewells",
        description: "Exceptionally fertile 2.5 acres land situated along the Hyderabad-Warangal highway. Enclosed with solar wire fencing, 2 deep borewells producing 2.5 inches water throughout the year. 5HP 3-phase submersible pump installed. Ready for organic vegetable cultivation or paddy.",
        address: "Survey No. 84, Beside Gram Panchayat Road, Shamirpet",
        village: "Shamirpet",
        district: "Medchal-Malkajgiri / Hyderabad",
        state: "Telangana",
        pincode: "500078",
        surveyNumber: "84/2A",
        latitude: 17.5936,
        longitude: 78.5719,
        area: 2.5,
        areaUnit: "Acres",
        soilType: "Red Loamy Soil",
        currentUsage: "Organic Vegetable & Flower Farming",
        suitableCrops: ["Tomato", "Chilli", "Marigold", "Paddy", "Leafy Greens", "Maize"],
        waterAvailability: "Perennial Borewell (2 Sources)",
        hasBorewell: true,
        hasOpenWell: false,
        hasCanalIrrigation: false,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: true,
        hasFarmEquipment: true,
        leaseDurationYears: 2,
        leasePrice: 60000,
        priceUnit: "per year",
        estimated2YearCost: 120000,
        isNegotiable: true,
        securityDeposit: 15000,
        ownerName: "Ramesh Kumar Reddy",
        ownerPhone: "+91 98490 23145",
        ownerEmail: "ramesh.k.reddy@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "5.0 Acres Premium Black Cotton Soil Farm with Krishna Canal Water",
        description: "Deep nutrient-rich Black Cotton soil (Regur) with direct access to Nagarjuna Sagar left bank canal. Ideal for high-yielding Cotton, Chilli, and Groundnut crops. Includes 10HP power connection, drip irrigation pipeline laid across the entire 5 acres, and 1 tractor shed.",
        address: "Near Sitarama Temple, Guntur-Tenali Link Road",
        village: "Chebrolu",
        district: "Guntur",
        state: "Andhra Pradesh",
        pincode: "522212",
        surveyNumber: "142/B",
        latitude: 16.2001,
        longitude: 80.5280,
        area: 5.0,
        areaUnit: "Acres",
        soilType: "Black Soil (Regur)",
        currentUsage: "Cotton & Mirchi Cultivation",
        suitableCrops: ["Cotton", "Guntur Chilli", "Groundnut", "Tobacco", "Soybean"],
        waterAvailability: "24/7 Abundant (Borewell/Canal)",
        hasBorewell: true,
        hasOpenWell: true,
        hasCanalIrrigation: true,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: true,
        hasFarmEquipment: false,
        leaseDurationYears: 3,
        leasePrice: 85000,
        priceUnit: "per year",
        estimated2YearCost: 170000,
        isNegotiable: true,
        securityDeposit: 25000,
        ownerName: "Venkat Rao Chowdary",
        ownerPhone: "+91 94401 78922",
        ownerEmail: "venkat.rao.guntur@gmail.com",
        preferredContactMethod: "WhatsApp",
        images: [
            "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "4.0 Acres Levelled Alluvial Land with Solar Pump Tubewell",
        description: "100% flat alluvial soil farmland situated along GT Road. Completely equipped with a 7.5HP PM-KUSUM Solar pump, permanent underground RCC irrigation pipeline, and metal gate boundary. Uninterrupted road access for commercial transport trucks.",
        address: "Samrala-Khanna Bypass, Ludhiana",
        village: "Samrala",
        district: "Ludhiana",
        state: "Punjab",
        pincode: "141114",
        surveyNumber: "219/1",
        latitude: 30.8336,
        longitude: 76.1912,
        area: 4.0,
        areaUnit: "Acres",
        soilType: "Alluvial Fertile Soil",
        currentUsage: "Wheat & Basmati Paddy Rotation",
        suitableCrops: ["Wheat", "Basmati Paddy", "Potato", "Mustard", "Silage Maize"],
        waterAvailability: "Perennial Borewell (2 Sources)",
        hasBorewell: true,
        hasOpenWell: false,
        hasCanalIrrigation: true,
        hasElectricity: true,
        electricityType: "Dedicated Solar Pump 5HP",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: true,
        hasFarmEquipment: true,
        leaseDurationYears: 2,
        leasePrice: 70000,
        priceUnit: "per year",
        estimated2YearCost: 140000,
        isNegotiable: false,
        securityDeposit: 20000,
        ownerName: "Sardar Harpreet Singh",
        ownerPhone: "+91 98150 44321",
        ownerEmail: "harpreet.singh.farm@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "3.2 Acres Certified Organic Farmland with Micro-Drip & Greenhouse",
        description: "Certified chemical-free organic land for the last 5 years. Features an existing 10,000 sq ft naturally ventilated polyhouse structure, vermicompost pits, cattle shed, and 24-hr electric pump. Excellent opportunity for strawberry or high-value exotic vegetable growers.",
        address: "Near Baramati Agri College, Baramati Road",
        village: "Malegaon Khurd",
        district: "Pune",
        state: "Maharashtra",
        pincode: "413115",
        surveyNumber: "95/4",
        latitude: 18.1519,
        longitude: 74.5770,
        area: 3.2,
        areaUnit: "Acres",
        soilType: "Black Soil (Regur)",
        currentUsage: "Exotic Vegetables & Grapes",
        suitableCrops: ["Bell Pepper", "Cucumber", "Tomato", "Pomegranate", "Sugarcane"],
        waterAvailability: "24/7 Abundant (Borewell/Canal)",
        hasBorewell: true,
        hasOpenWell: true,
        hasCanalIrrigation: false,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: true,
        hasFarmEquipment: false,
        leaseDurationYears: 2,
        leasePrice: 95000,
        priceUnit: "per year",
        estimated2YearCost: 190000,
        isNegotiable: true,
        securityDeposit: 30000,
        ownerName: "Sachin Dnyaneshwar Shinde",
        ownerPhone: "+91 98220 89104",
        ownerEmail: "sachin.shinde.pune@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "6.0 Acres Riverbank Alluvial Land Suitable for Sugarcane & Banana",
        description: "Located alongside the Tungabhadra river canal with year-round gravity irrigation. Highly fertile silty alluvial soil with zero water salinity. Fenced perimeter with 15ft tar road connectivity for tractor and harvester entry.",
        address: "Tungabhadra Canal Road, Gangavathi",
        village: "Marali",
        district: "Koppal",
        state: "Karnataka",
        pincode: "583227",
        surveyNumber: "312/A",
        latitude: 15.4328,
        longitude: 76.5312,
        area: 6.0,
        areaUnit: "Acres",
        soilType: "Alluvial Fertile Soil",
        currentUsage: "Paddy & Sugarcane",
        suitableCrops: ["Sugarcane", "Banana", "Paddy (Sona Masoori)", "Turmeric"],
        waterAvailability: "24/7 Abundant (Borewell/Canal)",
        hasBorewell: true,
        hasOpenWell: true,
        hasCanalIrrigation: true,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: false,
        hasStorageFacility: true,
        hasFarmEquipment: true,
        leaseDurationYears: 3,
        leasePrice: 65000,
        priceUnit: "per year",
        estimated2YearCost: 130000,
        isNegotiable: true,
        securityDeposit: 20000,
        ownerName: "Basavaraj Gowda Patil",
        ownerPhone: "+91 97312 66501",
        ownerEmail: "bg.patil.koppal@gmail.com",
        preferredContactMethod: "WhatsApp",
        images: [
            "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "3.5 Acres Sandy Loam Groundnut & Cumin Farm with Drip Setup",
        description: "Situated in the Saurashtra agro-climatic belt. Sandy loam soil with excellent drainage, ideal for groundnut, cumin, and mustard. Complete Jain Drip line setup installed. Low-salinity sweet borewell water at 180ft.",
        address: "Gondal-Rajkot Highway, Near Marketing Yard",
        village: "Gondal Rural",
        district: "Rajkot",
        state: "Gujarat",
        pincode: "360311",
        surveyNumber: "178/3",
        latitude: 21.9619,
        longitude: 70.7923,
        area: 3.5,
        areaUnit: "Acres",
        soilType: "Sandy Loam",
        currentUsage: "Groundnut & Jeera (Cumin)",
        suitableCrops: ["Groundnut", "Cumin (Jeera)", "Mustard", "Sesame", "Cotton"],
        waterAvailability: "Perennial Borewell (2 Sources)",
        hasBorewell: true,
        hasOpenWell: false,
        hasCanalIrrigation: false,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: false,
        hasFarmEquipment: false,
        leaseDurationYears: 2,
        leasePrice: 52000,
        priceUnit: "per year",
        estimated2YearCost: 104000,
        isNegotiable: true,
        securityDeposit: 12000,
        ownerName: "Kishorbhai Patel",
        ownerPhone: "+91 98251 77410",
        ownerEmail: "kishor.patel.rajkot@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "8.0 Acres Large Tractor-Ready Soybean & Wheat Farm",
        description: "Expansive 8 acres contiguous farm with deep black soil. 3 large open irrigation wells connected by underground pipes. Suitable for commercial mechanized grain farming. Tenant farmer gets free usage of a 2-room farm dwelling and equipment shed.",
        address: "Indore-Ujjain Expressway, Sanwer Tehsil",
        village: "Sanwer",
        district: "Indore",
        state: "Madhya Pradesh",
        pincode: "453551",
        surveyNumber: "405/1",
        latitude: 22.9734,
        longitude: 75.8267,
        area: 8.0,
        areaUnit: "Acres",
        soilType: "Black Soil (Regur)",
        currentUsage: "Soybean & Sharbati Wheat",
        suitableCrops: ["Soybean", "Sharbati Wheat", "Gram (Chana)", "Garlic", "Onion"],
        waterAvailability: "Open Well + Tubewell",
        hasBorewell: true,
        hasOpenWell: true,
        hasCanalIrrigation: false,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: true,
        hasStorageFacility: true,
        hasFarmEquipment: true,
        leaseDurationYears: 3,
        leasePrice: 48000,
        priceUnit: "per year",
        estimated2YearCost: 96000,
        isNegotiable: true,
        securityDeposit: 20000,
        ownerName: "Devendra Singh Bundela",
        ownerPhone: "+91 94250 11984",
        ownerEmail: "bundela.devendra@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    },
    {
        title: "2.0 Acres Highway-Facing Clayey Loam Land with Tube Well",
        description: "Compact 2-acre plot with rich alluvial clay loam, ideal for potato, mustard, and mentha (peppermint) oil farming. Only 200m from state highway, round-the-clock water supply from 100ft tube well.",
        address: "Aligarh-Agra Road, Sasni Block",
        village: "Sasni",
        district: "Hathras / Aligarh",
        state: "Uttar Pradesh",
        pincode: "204216",
        surveyNumber: "62/3",
        latitude: 27.7084,
        longitude: 78.0772,
        area: 2.0,
        areaUnit: "Acres",
        soilType: "Clayey Soil",
        currentUsage: "Potato & Mustard Farm",
        suitableCrops: ["Potato", "Mustard", "Mentha", "Wheat", "Green Peas"],
        waterAvailability: "Perennial Borewell (2 Sources)",
        hasBorewell: true,
        hasOpenWell: false,
        hasCanalIrrigation: false,
        hasElectricity: true,
        electricityType: "3-Phase Agricultural Power",
        hasRoadAccess: true,
        hasFencing: false,
        hasStorageFacility: false,
        hasFarmEquipment: false,
        leaseDurationYears: 2,
        leasePrice: 45000,
        priceUnit: "per year",
        estimated2YearCost: 90000,
        isNegotiable: true,
        securityDeposit: 10000,
        ownerName: "Brijesh Upadhyay",
        ownerPhone: "+91 94122 55390",
        ownerEmail: "brijesh.upadhyay@gmail.com",
        preferredContactMethod: "Phone Call",
        images: [
            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop&q=80"
        ],
        status: "Available"
    }
];

// Helper to calculate 2-Year Lease Cost
function calculate2YearCost(price, unit, durationYears = 2) {
    const p = parseFloat(price) || 50000;
    const d = parseFloat(durationYears) || 2;
    if (unit === 'per month') {
        return Math.round(p * 24);
    } else if (unit === 'total lease period') {
        return Math.round((p / d) * 2);
    } else {
        // default: per year
        return Math.round(p * 2);
    }
}

// ── GET /api/land-lease ──────────────────────────────────────
router.get('/land-lease', async (req, res) => {
    try {
        // Auto-seed if database is empty
        const count = await LandListing.countDocuments();
        if (count === 0) {
            await LandListing.insertMany(SEED_LISTINGS);
            console.log('Seeded 8 initial agricultural land listings.');
        }

        const {
            q,
            state,
            district,
            soilType,
            minArea,
            maxArea,
            maxPrice,
            hasBorewell,
            hasElectricity,
            suitableCrop,
            status,
            sort = 'recent'
        } = req.query;

        const filter = {};

        // Status filter (default show Available & Pending)
        if (status && status !== 'All') {
            filter.status = status;
        } else {
            filter.status = { $in: ['Available', 'Pending'] };
        }

        // State & District
        if (state && state !== 'All') filter.state = state;
        if (district && district !== 'All') filter.district = new RegExp(district, 'i');
        if (soilType && soilType !== 'All') filter.soilType = soilType;

        // Area Filter
        if (minArea || maxArea) {
            filter.area = {};
            if (minArea) filter.area.$gte = parseFloat(minArea);
            if (maxArea) filter.area.$lte = parseFloat(maxArea);
        }

        // Price Filter (based on estimated 2-Year Cost or annual price)
        if (maxPrice) {
            filter.leasePrice = { $lte: parseFloat(maxPrice) };
        }

        // Facilities
        if (hasBorewell === 'true') filter.hasBorewell = true;
        if (hasElectricity === 'true') filter.hasElectricity = true;

        // Suitable Crop Tag
        if (suitableCrop && suitableCrop !== 'All') {
            filter.suitableCrops = { $in: [new RegExp(suitableCrop, 'i')] };
        }

        // Text Search
        if (q && q.trim()) {
            const regex = new RegExp(q.trim(), 'i');
            filter.$or = [
                { title: regex },
                { description: regex },
                { village: regex },
                { district: regex },
                { state: regex },
                { soilType: regex },
                { suitableCrops: regex }
            ];
        }

        // Sorting
        let sortOption = { createdAt: -1 };
        if (sort === 'lowest_price') sortOption = { estimated2YearCost: 1 };
        if (sort === 'largest_area') sortOption = { area: -1 };
        if (sort === 'alphabetical') sortOption = { title: 1 };

        const listings = await LandListing.find(filter).sort(sortOption).limit(50);

        res.json({
            success: true,
            count: listings.length,
            data: listings
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/land-lease/seed ────────────────────────────────
router.get('/land-lease/seed', async (req, res) => {
    try {
        await LandListing.deleteMany({});
        const inserted = await LandListing.insertMany(SEED_LISTINGS);
        res.json({
            success: true,
            message: `Successfully seeded ${inserted.length} farm land listings!`,
            count: inserted.length
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/land-lease/:id ─────────────────────────────────
router.get('/land-lease/:id', async (req, res) => {
    try {
        const listing = await LandListing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Land listing not found.' });
        }
        res.json({ success: true, data: listing });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/land-lease ────────────────────────────────────
router.post('/land-lease', async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.ownerName || !body.ownerPhone || !body.area || !body.leasePrice || !body.state || !body.district || !body.village) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Title, Owner Name, Phone, Area, Lease Price, State, District, and Village.'
            });
        }

        // Compute 2-Year Lease Cost
        const unit = body.priceUnit || 'per year';
        const duration = parseFloat(body.leaseDurationYears) || 2;
        const est2Year = calculate2YearCost(body.leasePrice, unit, duration);

        // Ensure suitable crops array
        let crops = body.suitableCrops || [];
        if (typeof crops === 'string') {
            crops = crops.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Default placeholder photo if none uploaded
        let images = body.images || [];
        if (!Array.isArray(images) || images.length === 0) {
            images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"];
        }

        const newListing = new LandListing({
            ...body,
            suitableCrops: crops,
            estimated2YearCost: est2Year,
            images,
            status: 'Available'
        });

        await newListing.save();

        res.status(201).json({
            success: true,
            message: 'Your agricultural land has been successfully listed on AgroLease Connect.',
            data: newListing
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── PUT /api/land-lease/:id ─────────────────────────────────
router.put('/land-lease/:id', async (req, res) => {
    try {
        const updates = req.body;
        if (updates.leasePrice || updates.priceUnit) {
            const current = await LandListing.findById(req.params.id);
            if (current) {
                const price = updates.leasePrice || current.leasePrice;
                const unit = updates.priceUnit || current.priceUnit;
                const duration = updates.leaseDurationYears || current.leaseDurationYears;
                updates.estimated2YearCost = calculate2YearCost(price, unit, duration);
            }
        }

        const updated = await LandListing.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Land listing not found.' });
        }

        res.json({
            success: true,
            message: 'Listing updated successfully.',
            data: updated
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── DELETE /api/land-lease/:id ──────────────────────────────
router.delete('/land-lease/:id', async (req, res) => {
    try {
        const deleted = await LandListing.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Land listing not found.' });
        }
        res.json({ success: true, message: 'Land listing deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/land-lease/:id/enquiry ────────────────────────
router.post('/land-lease/:id/enquiry', async (req, res) => {
    try {
        const land = await LandListing.findById(req.params.id);
        if (!land) {
            return res.status(404).json({ success: false, message: 'Land listing not found.' });
        }

        const {
            farmerName,
            farmerPhone,
            farmerEmail = '',
            farmerId = 'anonymous',
            requiredDuration = '2 Years',
            proposedCrops = 'Vegetables / Food Crops',
            message
        } = req.body;

        if (!farmerName || !farmerPhone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Farmer Name, Phone Number, and Enquiry Message are required.'
            });
        }

        const newEnquiry = new LeaseEnquiry({
            landId: land._id,
            landTitle: land.title,
            ownerPhone: land.ownerPhone,
            ownerName: land.ownerName,
            farmerId,
            farmerName,
            farmerPhone,
            farmerEmail,
            requiredDuration,
            proposedCrops,
            message,
            status: 'New Enquiry'
        });

        await newEnquiry.save();

        // Increment enquiries count on land
        await LandListing.findByIdAndUpdate(land._id, { $inc: { enquiriesCount: 1 } });

        res.status(201).json({
            success: true,
            message: 'Your enquiry has been delivered to the landowner. They will contact you shortly.',
            data: newEnquiry
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/land-lease/owner/enquiries ─────────────────────
router.get('/land-lease/owner/enquiries', async (req, res) => {
    try {
        const { ownerPhone, ownerId } = req.query;
        const filter = {};
        if (ownerPhone) filter.ownerPhone = ownerPhone;
        if (ownerId && ownerId !== 'anonymous') filter.ownerId = ownerId;

        const enquiries = await LeaseEnquiry.find(filter).sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, count: enquiries.length, data: enquiries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/land-lease/owner/my-listings ───────────────────
router.get('/land-lease/owner/my-listings', async (req, res) => {
    try {
        const { ownerPhone, ownerName, ownerId } = req.query;
        const orConditions = [];
        if (ownerPhone) orConditions.push({ ownerPhone });
        if (ownerName) orConditions.push({ ownerName: new RegExp(ownerName, 'i') });
        if (ownerId && ownerId !== 'anonymous') orConditions.push({ ownerId });

        const filter = orConditions.length > 0 ? { $or: orConditions } : {};
        const listings = await LandListing.find(filter).sort({ createdAt: -1 });

        res.json({ success: true, count: listings.length, data: listings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
