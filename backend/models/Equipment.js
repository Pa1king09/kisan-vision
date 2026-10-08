const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Tractor', 
            'Rotavator', 
            'Cultivator', 
            'Plough', 
            'Harvester', 
            'Seeder', 
            'Drone Sprayer', 
            'Sprayer', 
            'Laser Leveller', 
            'Baler', 
            'Thresher', 
            'Power Tiller', 
            'Smart Gadget', 
            'Other'
        ],
        default: 'Tractor'
    },
    modelYear: {
        type: Number,
        default: 2023
    },
    horsepower: {
        type: Number,
        default: 45
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
    village: {
        type: String,
        trim: true,
        default: ''
    },
    ratePerHour: {
        type: Number,
        default: 600
    },
    ratePerAcre: {
        type: Number,
        default: 850
    },
    isOperatorIncluded: {
        type: Boolean,
        default: true
    },
    isFuelIncluded: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: 'Well maintained farming equipment with experienced operator available for seasonal work.'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 4.8
    },
    reviewCount: {
        type: Number,
        default: 14
    },
    status: {
        type: String,
        enum: ['Available', 'In Use', 'Booked', 'Under Maintenance'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
