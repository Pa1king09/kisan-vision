const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    userId: { type: String, default: 'guest' },
    farmId: { type: String, required: false },
    farmName: { type: String, required: false },
    
    location: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lon: { type: Number }
    },
    
    soilType: { type: String, required: true },
    soilMetrics: {
        nitrogen: { type: Number },
        phosphorus: { type: Number },
        potassium: { type: Number },
        ph: { type: Number }
    },
    
    environmentalData: {
        temperature: { type: Number },
        humidity: { type: Number },
        rainfall: { type: Number },
        season: { type: String }
    },
    
    predictionResult: {
        crop: { type: String, required: true },
        confidence: { type: Number, required: true },
        alternatives: { type: Array, default: [] },
        aiReasoning: { type: Object, default: {} },
        riskAnalysis: { type: Object, default: {} },
        soilAdvice: { type: Object, default: {} },
        growthPeriod: { type: String },
        weatherSummary: { type: Object, default: {} }
    },

    metadata: {
        analysisVersion: { type: String, default: '1.0' },
        source: { type: String, enum: ['manual', 'farm-analysis'], default: 'manual' }
    },

    bookmarked: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
