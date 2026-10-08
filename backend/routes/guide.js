const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');
const { getSchedule } = require('../services/cropScheduleService');

router.post('/growing-guide', (req, res) => {
    try {
        const { crop, season, soil_type } = req.body;
        const schedule = getSchedule(crop, season);

        return success(res, {
            crop: crop || 'Rice',
            total_duration: schedule.total_duration,
            difficulty: schedule.difficulty,
            water_requirement: schedule.water_requirement,
            best_season: schedule.best_season,
            stages: schedule.stages
        });
    } catch (err) {
        console.error('Error fetching growing guide:', err.message);
        res.status(500).json({ error: 'Failed to retrieve growing guide' });
    }
});

module.exports = router;
