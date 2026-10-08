const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');
const { success, error: errorRes } = require('../utils/response');

// POST /api/history/save & POST /api/analysis - Automatically save recommendation with farm linkage
const saveHandler = async (req, res) => {
    try {
        const {
            userId, farmId, farmName, location, coordinates, soilType,
            soilMetrics, environmentalData, predictionResult, metadata
        } = req.body;

        console.log('[History] Save payload:', { userId, farmId, farmName, location });

        const recommendation = new Recommendation({
            userId: userId || 'guest',
            farmId,
            farmName,
            location,
            coordinates,
            soilType,
            soilMetrics,
            environmentalData,
            predictionResult,
            metadata
        });

        const saved = await recommendation.save();
        console.log('[History] Saved recommendation to DB:', saved._id);

        // Update corresponding Farm document if farmId is provided
        if (farmId) {
            try {
                const Farm = require('../models/Farm');
                // Support both standard Mongoose ObjectId or localStorage string-based IDs
                const farm = await Farm.findOne({ $or: [{ _id: mongoose.Types.ObjectId.isValid(farmId) ? farmId : null }, { _id: null }, { name: farmName, userId }] });
                
                // Let's also query directly by string if it's not a standard ObjectId
                let targetFarm = farm;
                if (!targetFarm && mongoose.Types.ObjectId.isValid(farmId)) {
                    targetFarm = await Farm.findById(farmId);
                }
                if (!targetFarm) {
                    // Try by name and user
                    targetFarm = await Farm.findOne({ name: farmName, userId: userId || 'guest' });
                }

                if (targetFarm) {
                    console.log('[Linkage] Found Farm document:', targetFarm.name);
                    
                    // 1. Append analysis reference
                    targetFarm.analyses.push(saved._id);

                    // 2. Append crop history
                    const crop = predictionResult?.crop || 'Unknown';
                    const season = environmentalData?.season || 'Monsoon';
                    const confidence = predictionResult?.confidence || 0.95;
                    const confidenceVal = confidence < 1 ? Math.round(confidence * 100) : Math.round(confidence);

                    targetFarm.cropHistory.push({
                        cropName: crop,
                        season: season,
                        year: new Date().getFullYear(),
                        outcome: 'Good Yield'
                    });

                    // 3. Append recommendation summary
                    targetFarm.recommendationSummary = `Latest recommendation: ${crop} (${confidenceVal}% Match) with soil pH ${soilMetrics?.ph || targetFarm.soilType} in ${season} season.`;

                    await targetFarm.save();
                    console.log(`[Linkage] Successfully updated Farm ${targetFarm._id} with Recommendation ${saved._id}`);
                } else {
                    console.warn(`[Linkage] Farm document not found for linking. ID: ${farmId}, Name: ${farmName}`);
                }
            } catch (linkErr) {
                console.error('[Linkage] Failed to link analysis to Farm document:', linkErr.message);
            }
        }

        return success(res, saved, 'Analysis history saved successfully');
    } catch (err) {
        console.error('Error saving history:', err.message);
        return errorRes(res, 'Failed to save analysis history', 500, err.message);
    }
};

const mongoose = require('mongoose');

router.post('/history/save', saveHandler);
router.post('/analysis', saveHandler);

// GET /api/history/user/:userId & GET /api/history/user/:id - Fetch user history
const userHistoryHandler = async (req, res) => {
    try {
        const userId = req.params.userId || req.params.id;
        console.log('[History] Fetching history for user:', userId);
        const history = await Recommendation.find({ userId }).sort({ createdAt: -1 });
        return success(res, history, 'User history fetched successfully');
    } catch (err) {
        console.error('Error fetching user history:', err.message);
        return errorRes(res, 'Failed to fetch user history', 500, err.message);
    }
};

router.get('/history/user/:userId', userHistoryHandler);
router.get('/history/user/:id', userHistoryHandler);

// GET /api/history/farm/:farmId - Fetch history for specific farm
router.get('/history/farm/:farmId', async (req, res) => {
    try {
        const { farmId } = req.params;
        const history = await Recommendation.find({ farmId }).sort({ createdAt: -1 });
        return success(res, history, 'Farm history fetched successfully');
    } catch (err) {
        console.error('Error fetching farm history:', err.message);
        return errorRes(res, 'Failed to fetch farm history', 500, err.message);
    }
});

// GET /api/history - Fetch all history (fallback for older frontend code)
router.get('/history', async (req, res) => {
    try {
        const history = await Recommendation.find().sort({ createdAt: -1 });
        // Return directly since history page expects array directly or response.data
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err.message);
        res.status(500).json({ error: 'Failed to fetch recommendation history' });
    }
});

// GET /api/history/:id - Get single analysis details
router.get('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Recommendation.findById(id);
        if (!record) return errorRes(res, 'History record not found', 404);
        return success(res, record, 'History record fetched successfully');
    } catch (err) {
        console.error('Error fetching single history:', err.message);
        return errorRes(res, 'Failed to fetch history record', 500, err.message);
    }
});

// DELETE /api/history/:id - Delete history entry
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Recommendation.findByIdAndDelete(id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting recommendation:', err.message);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// PATCH /api/history/:id - Update history entry (favorites, notes, tags)
router.patch('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bookmarked, notes, tags } = req.body;
        
        const updateData = {};
        if (bookmarked !== undefined) updateData.bookmarked = bookmarked;
        if (notes !== undefined) updateData.notes = notes;
        if (tags !== undefined) updateData.tags = tags;
        
        const updated = await Recommendation.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!updated) return errorRes(res, 'History record not found', 404);
        return success(res, updated, 'History updated successfully');
    } catch (err) {
        console.error('Error updating history:', err.message);
        return errorRes(res, 'Failed to update record', 500, err.message);
    }
});

module.exports = router;
