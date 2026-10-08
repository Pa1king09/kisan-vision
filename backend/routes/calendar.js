const express = require('express');
const router = express.Router();
const { getSchedule } = require('../services/cropScheduleService');

// POST /api/farm-calendar
router.post('/farm-calendar', (req, res) => {
  try {
    const { crop = 'rice', season = 'Kharif', sow_date } = req.body;
    const schedule = getSchedule(crop, season);
    let calendar = schedule.weeks;

    // If sow_date given, add actual dates to each week
    if (sow_date) {
      const base = new Date(sow_date);
      calendar = calendar.map(week => {
        const weekStart = new Date(base);
        weekStart.setDate(base.getDate() + (week.week - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return {
          ...week,
          date_range: `${weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – ${weekEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
        };
      });
    }

    res.json({
      success: true,
      data: {
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        season,
        total_weeks: calendar.length || 16,
        sow_date: sow_date || null,
        calendar
      }
    });
  } catch (err) {
    console.error('Calendar route error:', err.message);
    res.status(500).json({ success: false, message: 'Error generating calendar' });
  }
});

module.exports = router;
