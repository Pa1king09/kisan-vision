const mongoose = require('mongoose');

const PmfbyClaimSchema = new mongoose.Schema({
    claimRef: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        default: 'anonymous'
    },
    farmerName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    aadhaarNumber: {
        type: String,
        default: ''
    },
    kccOrPolicyNo: {
        type: String,
        default: ''
    },
    bankName: {
        type: String,
        default: ''
    },
    accountNumber: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    surveyKhasraNo: {
        type: String,
        default: ''
    },
    crop: {
        type: String,
        required: true
    },
    season: {
        type: String,
        default: 'Kharif'
    },
    sownAreaAcres: {
        type: Number,
        required: true
    },
    damagedAreaAcres: {
        type: Number,
        required: true
    },
    calamityCause: {
        type: String,
        required: true
    },
    calamityDate: {
        type: Date,
        required: true
    },
    calamityTime: {
        type: String,
        default: '12:00'
    },
    cropStage: {
        type: String,
        default: 'Standing Crop (Vegetative/Flowering)'
    },
    damagePercentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    sumInsuredPerAcre: {
        type: Number,
        required: true
    },
    estimatedCompensation: {
        type: Number,
        required: true
    },
    farmerPremiumPaid: {
        type: Number,
        default: 0
    },
    insuranceCompany: {
        type: String,
        default: 'Agriculture Insurance Company of India (AIC)'
    },
    tollFreeHelpline: {
        type: String,
        default: '1800-11-6515 / 14447'
    },
    surveyorStatus: {
        type: String,
        enum: [
            'Claim Intimated (72-hr Window Complied)',
            'Surveyor Assigned',
            'Field Assessment In Progress',
            'Loss Assessed',
            'Compensation Disbursed',
            'Pending Bank Verification'
        ],
        default: 'Claim Intimated (72-hr Window Complied)'
    },
    within72Hours: {
        type: Boolean,
        default: true
    },
    hoursRemainingAtSubmission: {
        type: Number,
        default: 72
    },
    evidencePhotos: {
        type: [String],
        default: []
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('PmfbyClaim', PmfbyClaimSchema);
