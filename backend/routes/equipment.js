const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');
const mongoose = require('mongoose');

// Pre-seeded Indian agricultural equipment for instant 100% functionality
const SEED_EQUIPMENT = [
    // --- TRACTORS ---
    {
        name: 'John Deere 5050D (50 HP) 4WD Heavy Tractor',
        category: 'Tractor',
        modelYear: 2023,
        horsepower: 50,
        ownerName: 'Gurpreet Singh',
        ownerPhone: '+91 98722 15309',
        district: 'Ludhiana',
        state: 'Punjab',
        village: 'Samrala',
        ratePerHour: 750,
        ratePerAcre: 1000,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Powerful 4-wheel drive 50HP tractor with dual clutch and high hydraulic lifting capacity for heavy deep tillage and trailer hauling.',
        imageUrl: '/images/equipment_john_deere_5050d.jpg',
        rating: 4.95,
        reviewCount: 58,
        status: 'Available'
    },
    {
        name: 'Mahindra 575 DI (45 HP) High-Torque Tractor',
        category: 'Tractor',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Ramesh Patel',
        ownerPhone: '+91 98251 44321',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        village: 'Tenali Rural',
        ratePerHour: 650,
        ratePerAcre: 900,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Fuel-efficient 4-cylinder m-Boost engine tractor with high torque backup for heavy implements and puddling operations.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.88,
        reviewCount: 34,
        status: 'Available'
    },
    {
        name: 'Sonalika Tiger DI 55 CRDS (55 HP) 4WD Tractor',
        category: 'Tractor',
        modelYear: 2024,
        horsepower: 55,
        ownerName: 'Balwinder Sandhu',
        ownerPhone: '+91 98144 67210',
        district: 'Karnal',
        state: 'Haryana',
        village: 'Indri',
        ratePerHour: 800,
        ratePerAcre: 1050,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Next-gen CRDS electronic common rail engine with 4WD traction for heavy rotavators, laser levellers, and reversible ploughs.',
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
        rating: 4.92,
        reviewCount: 29,
        status: 'Available'
    },

    // --- CULTIVATORS ---
    {
        name: 'Fieldking 9-Tyne Extra Heavy Duty Spring Loaded Cultivator',
        category: 'Cultivator',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Koteswara Rao',
        ownerPhone: '+91 98480 32189',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        village: 'Tenali',
        ratePerHour: 450,
        ratePerAcre: 600,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: '9-tyne spring-loaded cultivator for breaking soil crust, deep aeration, and uprooting stubborn weeds without tyne breakage.',
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
        rating: 4.86,
        reviewCount: 22,
        status: 'Available'
    },
    {
        name: 'Lemken Achat 70 Heavy-Duty Rigid Tine Cultivator (11-Tyne)',
        category: 'Cultivator',
        modelYear: 2023,
        horsepower: 55,
        ownerName: 'Manjit Sandhu',
        ownerPhone: '+91 98150 99432',
        district: 'Karnal',
        state: 'Haryana',
        village: 'Gharaunda',
        ratePerHour: 520,
        ratePerAcre: 700,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Heavy duty rigid tyne tiller engineered for deep secondary tillage in black cotton and heavy clay soils.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.89,
        reviewCount: 18,
        status: 'Available'
    },
    {
        name: 'Khedut Duckfoot 7-Sweep Weed Eradicator Cultivator',
        category: 'Cultivator',
        modelYear: 2024,
        horsepower: 40,
        ownerName: 'Dharmesh Solanki',
        ownerPhone: '+91 94280 11984',
        district: 'Rajkot',
        state: 'Gujarat',
        village: 'Gondal',
        ratePerHour: 400,
        ratePerAcre: 550,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Wide sweep triangular duckfoot shovels for 100% shallow root weed clearing and soil moisture conservation.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.82,
        reviewCount: 14,
        status: 'Available'
    },

    // --- ROTAVATORS ---
    {
        name: 'Shaktiman Regular Plus 7ft Multi-Speed Rotavator (48 Blades)',
        category: 'Rotavator',
        modelYear: 2024,
        horsepower: 50,
        ownerName: 'Vikram Singh Rao',
        ownerPhone: '+91 94140 88219',
        district: 'Warangal',
        state: 'Telangana',
        village: 'Hanamkonda',
        ratePerHour: 600,
        ratePerAcre: 850,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Multi-speed heavy duty gearbox with 48 L-shaped boron steel blades for instant fine seedbed preparation in a single run.',
        imageUrl: '/images/equipment_rotavator_studio.jpg',
        rating: 4.96,
        reviewCount: 46,
        status: 'Available'
    },
    {
        name: 'Mahindra Gyrovator ZLX 6ft Heavy Duty Rotary Tiller',
        category: 'Rotavator',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Ramesh Patel',
        ownerPhone: '+91 98251 44321',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        village: 'Bapatla',
        ratePerHour: 580,
        ratePerAcre: 800,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Dual-motion rotavator specialized for wet paddy puddling and residue clod crushing with low diesel consumption.',
        imageUrl: '/images/equipment_rotavator_studio.jpg',
        rating: 4.85,
        reviewCount: 31,
        status: 'Available'
    },
    {
        name: 'Maschio Gaspardo B-205 Heavy European Rotary Tiller',
        category: 'Rotavator',
        modelYear: 2023,
        horsepower: 60,
        ownerName: 'Santosh Kumar',
        ownerPhone: '+91 97410 63821',
        district: 'Belagavi',
        state: 'Karnataka',
        village: 'Gokak',
        ratePerHour: 650,
        ratePerAcre: 920,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'High-strength European chassis rotavator for heavy cotton and sugarcane trash incorporation and hard soils.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewCount: 20,
        status: 'Available'
    },

    // --- PLOUGHS ---
    {
        name: 'Lemken Opal 090 Hydraulic Reversible MB Plough (3-Furrow)',
        category: 'Plough',
        modelYear: 2023,
        horsepower: 55,
        ownerName: 'Gurpreet Singh',
        ownerPhone: '+91 98722 15309',
        district: 'Ludhiana',
        state: 'Punjab',
        village: 'Samrala',
        ratePerHour: 750,
        ratePerAcre: 1100,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Dual hydraulic turnaround reversible mouldboard plough. Inverts topsoil, buries weeds and stubble, and eliminates dead furrows.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.94,
        reviewCount: 38,
        status: 'Available'
    },
    {
        name: 'Fieldking Heavy Duty Trailed 3-Disc Plough',
        category: 'Plough',
        modelYear: 2023,
        horsepower: 50,
        ownerName: 'Anil Deshmukh',
        ownerPhone: '+91 98220 54102',
        district: 'Nashik',
        state: 'Maharashtra',
        village: 'Niphad',
        ratePerHour: 650,
        ratePerAcre: 950,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'High carbon boron steel discs designed for tough, rocky, hard, and root-dense dry soils where MB ploughs cannot enter.',
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
        rating: 4.88,
        reviewCount: 24,
        status: 'Available'
    },
    {
        name: 'Landforce Deep Chisel Subsoiler Plough (Hardpan Shatterer)',
        category: 'Plough',
        modelYear: 2023,
        horsepower: 55,
        ownerName: 'Harinder Bajwa',
        ownerPhone: '+91 98765 44211',
        district: 'Karnal',
        state: 'Haryana',
        village: 'Nilokheri',
        ratePerHour: 700,
        ratePerAcre: 1200,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Breaks deep subsoil hardpan down to 20 inches, drastically increasing rainwater infiltration and deep root development.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.91,
        reviewCount: 16,
        status: 'Available'
    },

    // --- HARVESTERS & REAPERS ---
    {
        name: 'Claas Crop Tiger 30 Rubber Crawler Track Combine Harvester',
        category: 'Harvester',
        modelYear: 2023,
        horsepower: 75,
        ownerName: 'Santosh Kumar',
        ownerPhone: '+91 97410 63821',
        district: 'Belagavi',
        state: 'Karnataka',
        village: 'Gokak',
        ratePerHour: 1800,
        ratePerAcre: 2200,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Multi-crop rubber crawler track combine harvester for wet marshy paddy, wheat, and soybean with ultra-low grain loss.',
        imageUrl: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
        rating: 4.93,
        reviewCount: 45,
        status: 'Available'
    },
    {
        name: 'Preet 987 Self-Propelled Multi-Crop Combine Harvester (14ft)',
        category: 'Harvester',
        modelYear: 2023,
        horsepower: 101,
        ownerName: 'Jaspal Brar',
        ownerPhone: '+91 98880 77123',
        district: 'Bathinda',
        state: 'Punjab',
        village: 'Talwandi Sabo',
        ratePerHour: 2200,
        ratePerAcre: 2600,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Heavy-duty 101 HP 14-foot cutter bar combine with twin blower cleaning for rapid wheat, paddy, mustard, and soybean harvesting.',
        imageUrl: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
        rating: 4.91,
        reviewCount: 39,
        status: 'Available'
    },
    {
        name: 'BCS 730 Self-Propelled Reaper Binder (Paddy & Wheat Bundle Cutter)',
        category: 'Harvester',
        modelYear: 2024,
        horsepower: 10,
        ownerName: 'Subba Rao',
        ownerPhone: '+91 98491 55672',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        village: 'Gudivada',
        ratePerHour: 450,
        ratePerAcre: 700,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Cuts crops and ties them tightly into neat straw bundles in a single step. Zero grain shattering loss for small & medium farms.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.84,
        reviewCount: 19,
        status: 'Available'
    },
    {
        name: 'Kubota DC-68G High-Floatation Rice Combine Harvester',
        category: 'Harvester',
        modelYear: 2023,
        horsepower: 68,
        ownerName: 'Ravinder Reddy',
        ownerPhone: '+91 94401 22890',
        district: 'Nizamabad',
        state: 'Telangana',
        village: 'Armoor',
        ratePerHour: 1900,
        ratePerAcre: 2300,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'High-speed Japanese diesel engine crawler harvester with 3-way air stream cleaning for zero mud entrapment in wet fields.',
        imageUrl: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
        rating: 4.96,
        reviewCount: 33,
        status: 'Available'
    },

    // --- SEEDERS & SUPER SEEDERS ---
    {
        name: 'Shaktiman Super Seeder (7ft, Rotavator + Zero-Till Seed Drill)',
        category: 'Seeder',
        modelYear: 2024,
        horsepower: 55,
        ownerName: 'Gurpreet Singh',
        ownerPhone: '+91 98722 15309',
        district: 'Ludhiana',
        state: 'Punjab',
        village: 'Jagraon',
        ratePerHour: 900,
        ratePerAcre: 1200,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Direct sowing of wheat into standing paddy stubble without burning straw. Single pass rotary tilling, furrow opening, seed & fertilizer drop.',
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
        rating: 4.97,
        reviewCount: 52,
        status: 'Available'
    },
    {
        name: 'National Happy Seeder with Serrated Press Wheels',
        category: 'Seeder',
        modelYear: 2023,
        horsepower: 50,
        ownerName: 'Manjit Sandhu',
        ownerPhone: '+91 98150 99432',
        district: 'Karnal',
        state: 'Haryana',
        village: 'Taraori',
        ratePerHour: 800,
        ratePerAcre: 1000,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Direct seed-cum-fertilizer drilling through standing straw residue. Preserves moisture and forms natural organic surface mulch.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.86,
        reviewCount: 27,
        status: 'Available'
    },
    {
        name: 'Shaktiman Pneumatic Multi-Crop Precision Planter / Seeder',
        category: 'Seeder',
        modelYear: 2024,
        horsepower: 40,
        ownerName: 'Dharmesh Solanki',
        ownerPhone: '+91 94280 11984',
        district: 'Rajkot',
        state: 'Gujarat',
        village: 'Gondal',
        ratePerHour: 550,
        ratePerAcre: 700,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Vacuum precision metering disc for cotton, maize, groundnut, and soybean. Uniform seed-to-seed spacing and depth.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.88,
        reviewCount: 21,
        status: 'Available'
    },

    // --- DRONE SPRAYERS & BOOM SPRAYERS ---
    {
        name: 'DJI Agras T40 Agriculture Drone Sprayer',
        category: 'Drone Sprayer',
        modelYear: 2024,
        horsepower: 0,
        ownerName: 'Vikram Singh Rao',
        ownerPhone: '+91 94140 88219',
        district: 'Warangal',
        state: 'Telangana',
        village: 'Hanamkonda',
        ratePerHour: 1200,
        ratePerAcre: 350,
        isOperatorIncluded: true,
        isFuelIncluded: true,
        description: 'High capacity 40-liter drone for ultra-low volume precision pesticide and nano-urea spraying. Covers 1 acre in 6 minutes.',
        imageUrl: '/images/equipment_dji_agras_t40.jpg',
        rating: 4.98,
        reviewCount: 42,
        status: 'Available'
    },
    {
        name: 'ASPEE HTP Tractor-Mounted 600L Boom Sprayer (40ft Wing)',
        category: 'Sprayer',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Srinivas Goud',
        ownerPhone: '+91 98481 99281',
        district: 'Nizamabad',
        state: 'Telangana',
        village: 'Bodhan',
        ratePerHour: 500,
        ratePerAcre: 300,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Tractor PTO driven 600-liter boom sprayer covering 10 acres/hr with Italian anti-drip nozzles and uniform droplet distribution.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.85,
        reviewCount: 26,
        status: 'Available'
    },
    {
        name: 'Mitra Bullet 600L Orchard Air-Blast Mist Sprayer',
        category: 'Sprayer',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Anil Deshmukh',
        ownerPhone: '+91 98220 54102',
        district: 'Nashik',
        state: 'Maharashtra',
        village: 'Pimpalgaon',
        ratePerHour: 700,
        ratePerAcre: 800,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'High-velocity axial fan mist blower penetrating dense foliar canopies in grape vineyards, pomegranate, mango, and citrus orchards.',
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
        rating: 4.91,
        reviewCount: 30,
        status: 'Available'
    },

    // --- LASER LEVELLERS ---
    {
        name: 'Laser Guided Land Leveller with Hydraulic Scraper Bucket',
        category: 'Laser Leveller',
        modelYear: 2023,
        horsepower: 55,
        ownerName: 'Manjit Sandhu',
        ownerPhone: '+91 98150 99432',
        district: 'Karnal',
        state: 'Haryana',
        village: 'Gharaunda',
        ratePerHour: 800,
        ratePerAcre: 1300,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Dual-slope laser transmitter receiver with precision hydraulic grading. Reduces irrigation water usage by 25-30% and boosts yield.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        rating: 4.92,
        reviewCount: 37,
        status: 'Available'
    },

    // --- BALERS & STRAW MANAGEMENT ---
    {
        name: 'New Holland Square Straw Baler (BC5060)',
        category: 'Baler',
        modelYear: 2023,
        horsepower: 50,
        ownerName: 'Jaspal Brar',
        ownerPhone: '+91 98880 77123',
        district: 'Bathinda',
        state: 'Punjab',
        village: 'Talwandi Sabo',
        ratePerHour: 900,
        ratePerAcre: 500,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Paddy straw and wheat stubble square baler. Cleans field without stubble burning and creates high-density square bales for sale.',
        imageUrl: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
        rating: 4.89,
        reviewCount: 31,
        status: 'Available'
    },
    {
        name: 'Fieldking Round Straw Baler (Compact Twin Twine)',
        category: 'Baler',
        modelYear: 2023,
        horsepower: 45,
        ownerName: 'Sukhwinder Cheema',
        ownerPhone: '+91 98141 88390',
        district: 'Sangrur',
        state: 'Punjab',
        village: 'Sunam',
        ratePerHour: 850,
        ratePerAcre: 480,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Collects and compresses crop residue into compact round bales (18-25 kg) for cattle fodder and bio-mass power plants.',
        imageUrl: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?w=800&auto=format&fit=crop&q=80',
        rating: 4.85,
        reviewCount: 20,
        status: 'Available'
    },

    // --- THRESHERS & POST-HARVEST ---
    {
        name: 'Punni Multi-Crop Auto-Feeding High Capacity Thresher',
        category: 'Thresher',
        modelYear: 2023,
        horsepower: 35,
        ownerName: 'Gurcharan Singh',
        ownerPhone: '+91 98782 11099',
        district: 'Gurdaspur',
        state: 'Punjab',
        village: 'Batala',
        ratePerHour: 600,
        ratePerAcre: 800,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Heavy flywheel auto-hopper thresher for Wheat, Mustard, Soybean, Gram, and Millets with dual blowers for 99.8% clean grain.',
        imageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewCount: 28,
        status: 'Available'
    },
    {
        name: 'Bharat Tractor-Driven High-Speed Maize/Corn Sheller',
        category: 'Thresher',
        modelYear: 2023,
        horsepower: 35,
        ownerName: 'Venkat Narayana',
        ownerPhone: '+91 94412 88711',
        district: 'Warangal',
        state: 'Telangana',
        village: 'Narsampet',
        ratePerHour: 500,
        ratePerAcre: 600,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Processes 40-50 quintals/hour of dry maize cobs, deshelling grain without cracking kernel embryos.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.83,
        reviewCount: 17,
        status: 'Available'
    },

    // --- POWER TILLERS & WEEDERS ---
    {
        name: 'VST Shakti 130 DI Power Tiller (13 HP)',
        category: 'Power Tiller',
        modelYear: 2023,
        horsepower: 13,
        ownerName: 'Anil Deshmukh',
        ownerPhone: '+91 98220 54102',
        district: 'Nashik',
        state: 'Maharashtra',
        village: 'Niphad',
        ratePerHour: 350,
        ratePerAcre: 550,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Compact rotary tiller for vegetable gardens, orchards, sugarcane inter-cultivation, and wet paddy puddling.',
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        rating: 4.78,
        reviewCount: 19,
        status: 'Available'
    },
    {
        name: 'Honda FQ650 4-Stroke Inter-Row Power Weeder',
        category: 'Power Tiller',
        modelYear: 2024,
        horsepower: 6,
        ownerName: 'Koteswara Rao',
        ownerPhone: '+91 98480 32189',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        village: 'Tenali',
        ratePerHour: 250,
        ratePerAcre: 400,
        isOperatorIncluded: true,
        isFuelIncluded: false,
        description: 'Compact petrol power weeder for cotton, chili, sugarcane, and horticulture crop rows. Removes weeds and aerates soil.',
        imageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80',
        rating: 4.86,
        reviewCount: 23,
        status: 'Available'
    },

    // --- SMART FARM GADGETS ---
    {
        name: 'FarmShield Digital Handheld Grain Moisture Meter (FCI Calibrated)',
        category: 'Smart Gadget',
        modelYear: 2024,
        horsepower: 0,
        ownerName: 'Ramesh Patel',
        ownerPhone: '+91 98251 44321',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        village: 'Mangalagiri',
        ratePerHour: 150,
        ratePerAcre: 100,
        isOperatorIncluded: false,
        isFuelIncluded: false,
        description: 'Instant grain moisture % tester calibrated for 24 Indian grains. Prevents arbitrary price docking and moisture penalties at Mandis.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        rating: 4.95,
        reviewCount: 39,
        status: 'Available'
    },
    {
        name: 'AgroSense 5-in-1 Soil NPK & Moisture Optical Tester Wand',
        category: 'Smart Gadget',
        modelYear: 2024,
        horsepower: 0,
        ownerName: 'Vikram Singh Rao',
        ownerPhone: '+91 94140 88219',
        district: 'Warangal',
        state: 'Telangana',
        village: 'Kazipet',
        ratePerHour: 200,
        ratePerAcre: 150,
        isOperatorIncluded: false,
        isFuelIncluded: false,
        description: 'Portable root-zone sensor wand measuring instant Nitrogen, Phosphorus, Potassium, soil pH, and EC salinity in 10 seconds.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        rating: 4.92,
        reviewCount: 25,
        status: 'Available'
    },
    {
        name: 'SuryaKiran IoT Solar Pump Remote Starter & Telemetry Gadget',
        category: 'Smart Gadget',
        modelYear: 2024,
        horsepower: 0,
        ownerName: 'Anil Deshmukh',
        ownerPhone: '+91 98220 54102',
        district: 'Nashik',
        state: 'Maharashtra',
        village: 'Yeola',
        ratePerHour: 100,
        ratePerAcre: 200,
        isOperatorIncluded: true,
        isFuelIncluded: true,
        description: 'Smartphone-controlled GSM/IoT starter with dry-run protection, phase reversal guard, and water-table level telemetry for borewells.',
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        rating: 4.88,
        reviewCount: 32,
        status: 'Available'
    }
];

// Helper to seed if collection is empty or missing items
const ensureSeeded = async () => {
    try {
        for (const item of SEED_EQUIPMENT) {
            const exists = await Equipment.findOne({ name: item.name });
            if (!exists) {
                await Equipment.create(item);
            }
        }
        console.log(`🌱 Verified all ${SEED_EQUIPMENT.length} agricultural machines and implements.`);
    } catch (e) {
        console.warn('Could not auto-seed equipment:', e.message);
    }
};

// GET /api/equipment - List machinery with filters
router.get('/equipment', async (req, res) => {
    const { category, district, state, status, search, maxRate } = req.query;
    try {
        await ensureSeeded();
        const query = {};

        if (category && category !== 'All') {
            query.category = category;
        }
        if (district) {
            query.district = new RegExp(district, 'i');
        }
        if (state && state !== 'All') {
            query.state = new RegExp(state, 'i');
        }
        if (status) {
            query.status = status;
        }
        if (maxRate) {
            query.ratePerAcre = { $lte: Number(maxRate) };
        }
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { ownerName: new RegExp(search, 'i') },
                { district: new RegExp(search, 'i') }
            ];
        }

        const items = await Equipment.find(query).sort({ rating: -1, createdAt: -1 });
        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (err) {
        console.error('Error fetching equipment:', err);
        // Fallback to static seeds with in-memory filtering if database is not reachable
        let fallbackData = [...SEED_EQUIPMENT];
        if (category && category !== 'All') {
            fallbackData = fallbackData.filter(m => m.category === category);
        }
        if (state && state !== 'All') {
            fallbackData = fallbackData.filter(m => (m.state || '').toLowerCase() === state.toLowerCase());
        }
        if (search) {
            const s = search.toLowerCase();
            fallbackData = fallbackData.filter(m => 
                (m.name && m.name.toLowerCase().includes(s)) ||
                (m.description && m.description.toLowerCase().includes(s)) ||
                (m.ownerName && m.ownerName.toLowerCase().includes(s)) ||
                (m.district && m.district.toLowerCase().includes(s))
            );
        }
        res.json({
            success: true,
            count: fallbackData.length,
            data: fallbackData
        });
    }
});

// GET /api/equipment/:id - Single machine
router.get('/equipment/:id', async (req, res) => {
    try {
        const item = await Equipment.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/equipment - Owner listing new machine
router.post('/equipment', async (req, res) => {
    try {
        const {
            name, category, modelYear, horsepower,
            ownerName, ownerPhone, district, state, village,
            ratePerHour, ratePerAcre, isOperatorIncluded, isFuelIncluded,
            description, imageUrl
        } = req.body;

        if (!name || !ownerName || !ownerPhone || !district || !state) {
            return res.status(400).json({
                success: false,
                message: 'Name, ownerName, ownerPhone, district, and state are required.'
            });
        }

        const newMachine = new Equipment({
            name,
            category: category || 'Tractor',
            modelYear: Number(modelYear) || 2023,
            horsepower: Number(horsepower) || 45,
            ownerName,
            ownerPhone,
            district,
            state,
            village: village || '',
            ratePerHour: Number(ratePerHour) || 600,
            ratePerAcre: Number(ratePerAcre) || 850,
            isOperatorIncluded: isOperatorIncluded !== undefined ? isOperatorIncluded : true,
            isFuelIncluded: isFuelIncluded !== undefined ? isFuelIncluded : false,
            description: description || 'Well maintained agricultural machinery.',
            imageUrl: imageUrl || ''
        });

        const saved = await newMachine.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error('Error creating equipment listing:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/equipment/:id/book - Book machine
router.post('/equipment/:id/book', async (req, res) => {
    try {
        let equipment = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            equipment = await Equipment.findById(req.params.id);
        }
        if (!equipment) {
            const clean = req.params.id.replace('studio-', '').toLowerCase();
            equipment = await Equipment.findOne({
                $or: [
                    { name: new RegExp(clean, 'i') },
                    { category: new RegExp(clean, 'i') }
                ]
            });
        }
        if (!equipment) {
            equipment = SEED_EQUIPMENT.find(s => 
                s.name.toLowerCase().includes(req.params.id.toLowerCase().replace('studio-', ''))
            ) || SEED_EQUIPMENT[0];
        }

        const {
            renterName, renterPhone, district, state,
            fieldName, fieldAcres, pricingType, hoursOrAcres,
            bookingDate, notes
        } = req.body;

        if (!renterName || !renterPhone) {
            return res.status(400).json({
                success: false,
                message: 'Renter name and phone number are required.'
            });
        }

        const type = pricingType === 'hour' ? 'hour' : 'acre';
        const qty = Number(hoursOrAcres || fieldAcres || 1);
        const unitRate = type === 'hour' ? (equipment.ratePerHour || 600) : (equipment.ratePerAcre || 850);
        const totalEstimatedCost = Math.round(qty * unitRate);

        const booking = new EquipmentBooking({
            equipmentId: equipment._id || new mongoose.Types.ObjectId(),
            equipmentName: equipment.name,
            renterName,
            renterPhone,
            district: district || equipment.district,
            state: state || equipment.state,
            fieldName: fieldName || 'My Field',
            fieldAcres: Number(fieldAcres) || qty,
            pricingType: type,
            hoursOrAcres: qty,
            totalEstimatedCost,
            bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
            notes: notes || '',
            status: 'Confirmed'
        });

        const savedBooking = await booking.save();

        res.status(201).json({
            success: true,
            message: 'Equipment booked successfully!',
            data: savedBooking,
            ownerContact: {
                name: equipment.ownerName,
                phone: equipment.ownerPhone
            }
        });
    } catch (err) {
        console.error('Error booking equipment:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/equipment-bookings - List recent bookings
router.get('/equipment-bookings', async (req, res) => {
    try {
        const bookings = await EquipmentBooking.find().sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PATCH /api/equipment-bookings/:id/status - Update booking status
router.patch('/equipment-bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await EquipmentBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
