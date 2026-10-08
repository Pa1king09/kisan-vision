const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    soilType: { type: String, required: true },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    area: { type: Number, default: 0 },
    latitude: { type: Number },
    longitude: { type: Number },
    boundary: { type: [[Number]], default: [] },
    
    // References to Recommendation (analysis) history entries
    analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }],
    
    // Log of past crops grown on this field
    cropHistory: [{
        cropName: { type: String, required: true },
        season: { type: String, default: 'Kharif' },
        year: { type: Number, default: 2026 },
        outcome: { type: String, default: 'Good Yield' }
    }],
    
    recommendationSummary: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
