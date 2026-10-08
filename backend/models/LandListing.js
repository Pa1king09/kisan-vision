const mongoose = require('mongoose');

const LandListingSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        default: 'anonymous'
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    ownerPhone: {
        type: String,
        required: true,
        trim: true
    },
    ownerEmail: {
        type: String,
        default: '',
        trim: true
    },
    preferredContactMethod: {
        type: String,
        enum: ['Phone Call', 'WhatsApp', 'Email', 'Any'],
        default: 'Phone Call'
    },

    // Land Details
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    village: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        default: ''
    },
    surveyNumber: {
        type: String,
        default: ''
    },
    latitude: {
        type: Number,
        default: 17.3850
    },
    longitude: {
        type: Number,
        default: 78.4867
    },

    // Land Specifications
    area: {
        type: Number,
        required: true,
        min: 0.25
    },
    areaUnit: {
        type: String,
        enum: ['Acres', 'Hectares', 'Guntas'],
        default: 'Acres'
    },
    soilType: {
        type: String,
        required: true,
        enum: ['Black Soil (Regur)', 'Red Loamy Soil', 'Alluvial Fertile Soil', 'Clayey Soil', 'Sandy Loam', 'Laterite Soil', 'Other'],
        default: 'Red Loamy Soil'
    },
    currentUsage: {
        type: String,
        default: 'Cultivated Farm Land'
    },
    suitableCrops: {
        type: [String],
        default: ['Paddy', 'Vegetables', 'Cotton', 'Wheat']
    },

    // Facilities (Toggles)
    waterAvailability: {
        type: String,
        enum: ['24/7 Abundant (Borewell/Canal)', 'Perennial Borewell (2 Sources)', 'Canal Seasonal Flow', 'Open Well + Tubewell', 'Rainfed / Tank Irrigation'],
        default: 'Perennial Borewell (2 Sources)'
    },
    hasBorewell: { type: Boolean, default: true },
    hasOpenWell: { type: Boolean, default: false },
    hasCanalIrrigation: { type: Boolean, default: false },
    hasElectricity: { type: Boolean, default: true },
    electricityType: {
        type: String,
        enum: ['3-Phase Agricultural Power', 'Dedicated Solar Pump 5HP', 'Single Phase', 'None'],
        default: '3-Phase Agricultural Power'
    },
    hasRoadAccess: { type: Boolean, default: true },
    hasFencing: { type: Boolean, default: true },
    hasStorageFacility: { type: Boolean, default: false },
    hasFarmEquipment: { type: Boolean, default: false },

    // Lease Terms & Pricing
    leaseDurationYears: {
        type: Number,
        default: 2,
        min: 0.5
    },
    leasePrice: {
        type: Number,
        required: true
    },
    priceUnit: {
        type: String,
        enum: ['per year', 'per month', 'total lease period'],
        default: 'per year'
    },
    estimated2YearCost: {
        type: Number,
        required: true
    },
    isNegotiable: {
        type: Boolean,
        default: true
    },
    securityDeposit: {
        type: Number,
        default: 10000
    },
    availableFrom: {
        type: Date,
        default: Date.now
    },

    // Visuals & Status
    images: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Available', 'Pending', 'Leased', 'Inactive'],
        default: 'Available'
    },
    enquiriesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('LandListing', LandListingSchema);
