const mongoose = require('mongoose');

const equipmentBookingSchema = new mongoose.Schema({
    equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    equipmentName: {
        type: String,
        required: true
    },
    renterName: {
        type: String,
        required: true,
        trim: true
    },
    renterPhone: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    fieldName: {
        type: String,
        default: 'General Farmland'
    },
    fieldAcres: {
        type: Number,
        default: 1
    },
    pricingType: {
        type: String,
        enum: ['acre', 'hour'],
        default: 'acre'
    },
    hoursOrAcres: {
        type: Number,
        default: 1
    },
    totalEstimatedCost: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EquipmentBooking', equipmentBookingSchema);
