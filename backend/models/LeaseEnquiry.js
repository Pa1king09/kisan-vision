const mongoose = require('mongoose');

const LeaseEnquirySchema = new mongoose.Schema({
    landId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LandListing',
        required: true
    },
    landTitle: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        default: 'Landowner'
    },
    farmerId: {
        type: String,
        default: 'anonymous'
    },
    farmerName: {
        type: String,
        required: true,
        trim: true
    },
    farmerPhone: {
        type: String,
        required: true,
        trim: true
    },
    farmerEmail: {
        type: String,
        default: ''
    },
    requiredDuration: {
        type: String,
        default: '2 Years'
    },
    proposedCrops: {
        type: String,
        default: 'Vegetables & Cash Crops'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['New Enquiry', 'Contacted / Discussing', 'Deal Finalized', 'Closed'],
        default: 'New Enquiry'
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaseEnquiry', LeaseEnquirySchema);
