const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { success, error: errorRes } = require('../utils/response');

// GET /api/farms/user/:userId - Get all fields for a user
router.get('/farms/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const farms = await Farm.find({ userId }).sort({ createdAt: -1 });
        return success(res, farms, 'Farms fetched successfully');
    } catch (err) {
        console.error('Error fetching farms:', err.message);
        return errorRes(res, 'Failed to fetch farms', 500, err.message);
    }
});

// POST /api/farms - Create a new farm
router.post('/farms', async (req, res) => {
    try {
        const { userId, name, soilType, district, state, area, latitude, longitude, boundary } = req.body;
        if (!userId || !name || !soilType) {
            return errorRes(res, 'UserId, name, and soilType are required', 400);
        }

        const newFarm = new Farm({
            userId,
            name,
            soilType,
            district: district || '',
            state: state || '',
            area: parseFloat(area) || 0,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            boundary: Array.isArray(boundary) ? boundary : [],
            analyses: [],
            cropHistory: []
        });

        const saved = await newFarm.save();
        return success(res, saved, 'Field created successfully', 201);
    } catch (err) {
        console.error('Error creating farm:', err.message);
        return errorRes(res, 'Failed to create field', 500, err.message);
    }
});

// DELETE /api/farms/:id - Delete farm
router.delete('/farms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Farm.findByIdAndDelete(id);
        if (!deleted) {
            return errorRes(res, 'Field not found', 404);
        }
        return success(res, deleted, 'Field deleted successfully');
    } catch (err) {
        console.error('Error deleting farm:', err.message);
        return errorRes(res, 'Failed to delete field', 500, err.message);
    }
});

// POST /api/farms/:id/crops - Add past crop to crop history manually
router.post('/farms/:id/crops', async (req, res) => {
    try {
        const { id } = req.params;
        const { cropName, season, year, outcome } = req.body;

        if (!cropName) {
            return errorRes(res, 'Crop name is required', 400);
        }

        const farm = await Farm.findById(id);
        if (!farm) {
            return errorRes(res, 'Field not found', 404);
        }

        farm.cropHistory.push({
            cropName,
            season: season || 'Kharif',
            year: parseInt(year) || 2026,
            outcome: outcome || 'Good Yield'
        });

        await farm.save();
        return success(res, farm, 'Past crop logged successfully');
    } catch (err) {
        console.error('Error logging crop:', err.message);
        return errorRes(res, 'Failed to log past crop', 500, err.message);
    }
});

module.exports = router;
