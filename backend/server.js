require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database connection
require('./db'); // ensures mongoose connects

// JWT Secret Check
if (!process.env.JWT_SECRET) {
    console.warn('[WARNING] JWT_SECRET is missing from .env! Using fallback_secret for development.');
}

mongoose.connection.once('open', () => {
    console.log("DB connected successfully");
});

// Health Check & Root
app.get('/', (req, res) => {
    res.json({ message: 'Kisan Vision API is online', environment: process.env.NODE_ENV || 'development' });
});

app.get('/health', async (req, res) => {
    const isDbAlive = await mongoose.ping();
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(), 
        db: isDbAlive ? 'connected' : 'disconnected',
        readyState: mongoose.connection.readyState
    });
});

// Routes
const recommendRouter = require('./routes/recommend');
const riskRouter = require('./routes/risk');
const soilRouter = require('./routes/soil');
const improvementRouter = require('./routes/improvement');
const revenueRouter = require('./routes/revenue');
const feasibilityRouter = require('./routes/feasibility');
const schemesRouter = require('./routes/schemes');
const labourRouter = require('./routes/labour');
const guideRouter = require('./routes/guide');
const organicRouter = require('./routes/organic');
const authRouter = require('./routes/auth');
const weatherRouter = require('./routes/weather');
const chatRouter = require('./routes/chat');
const historyRouter = require('./routes/history');
const farmsRouter = require('./routes/farms');
// ── New Features ──────────────────────────────
const diseaseRouter = require('./routes/disease');
const calendarRouter = require('./routes/calendar');
const loanEligibilityRouter = require('./routes/loanEligibility');
const yieldForecastRouter = require('./routes/yieldForecast');
const forumRouter = require('./routes/forum');
const satelliteRouter = require('./routes/satellite');
const marketplaceRouter = require('./routes/marketplace');
const equipmentRouter = require('./routes/equipment');
const zbnfRouter = require('./routes/zbnf');
const pmfbyRouter = require('./routes/pmfby');
const landLeaseRouter = require('./routes/landLease');

app.use('/api', recommendRouter);
app.use('/api', riskRouter);
app.use('/api', soilRouter);
app.use('/api', improvementRouter);
app.use('/api', revenueRouter);
app.use('/api', feasibilityRouter);
app.use('/api', schemesRouter);
app.use('/api', labourRouter);
app.use('/api', guideRouter);
app.use('/api', organicRouter);
app.use('/api/auth', authRouter);
app.use('/api', weatherRouter);
app.use('/api', chatRouter);
app.use('/api', historyRouter);
app.use('/api', farmsRouter);
// ── New Feature Routes ────────────────────────
app.use('/api', diseaseRouter);
app.use('/api', calendarRouter);
app.use('/api', loanEligibilityRouter);
app.use('/api', yieldForecastRouter);
app.use('/api', forumRouter);
app.use('/api', satelliteRouter);
app.use('/api', marketplaceRouter);
app.use('/api', equipmentRouter);
app.use('/api', zbnfRouter);
app.use('/api', pmfbyRouter);
app.use('/api', landLeaseRouter);

// Direct APK Downloads & Hosting
const path = require('path');
const apkFolder = path.resolve(__dirname, '../../../../KisanVision_APKs');
app.use('/apk', express.static(apkFolder, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.apk')) {
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Disposition', 'attachment; filename="KisanVision.apk"');
        }
    }
}));
app.get(['/download/release', '/download/apk', '/get-apk'], (req, res) => {
    const apkFile = path.join(apkFolder, 'KisanVision-Release.apk');
    if (fs.existsSync(apkFile)) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.download(apkFile, 'KisanVision.apk');
    } else {
        res.status(404).send('APK file not found on server.');
    }
});

// Direct Report Export & Mobile Download Hosting
const reportsCache = new Map();

app.post('/api/export-report', (req, res) => {
    try {
        const { crop = 'Crop', html, fileName } = req.body;
        if (!html) {
            return res.status(400).json({ success: false, message: 'Report content is required' });
        }
        const reportId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const cleanCrop = (crop || 'Crop').replace(/[^a-zA-Z0-9]/g, '_');
        const resolvedName = fileName || `KisanVision_Report_${cleanCrop}_${new Date().toISOString().slice(0, 10)}.html`;

        reportsCache.set(reportId, {
            html,
            fileName: resolvedName,
            createdAt: Date.now()
        });

        // Prune old entries (older than 2 hours)
        const twoHoursAgo = Date.now() - 7200000;
        for (const [key, val] of reportsCache.entries()) {
            if (val.createdAt < twoHoursAgo) reportsCache.delete(key);
        }

        const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${PORT}`;
        const proto = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
        const downloadUrl = `${proto}://${host}/api/download-report/${reportId}`;

        res.json({
            success: true,
            reportId,
            fileName: resolvedName,
            downloadUrl
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get('/api/download-report/:id', (req, res) => {
    const report = reportsCache.get(req.params.id);
    if (!report) {
        return res.status(404).send('Report has expired or is invalid. Please generate a new report from the Kisan Vision app.');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
    res.send(report.html);
});

// Share Landing Page for WhatsApp & Mobile Browsers
app.get(['/share', '/download'], (req, res) => {
    const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${PORT}`;
    const proto = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
    const apkUrl = `${proto}://${host}/apk/KisanVision-Release.apk`;
    const shareUrl = `${proto}://${host}/share`;

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Kisan Vision Android App</title>
  <meta property="og:title" content="Kisan Vision - Smart Agriculture Assistant">
  <meta property="og:description" content="Download the official Kisan Vision Android App. AI crop recommendations, soil testing, market revenues, and farm management.">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#064e3b">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #060d17; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; }
    .card { background: #0b1524; border: 1px solid #1e293b; border-radius: 28px; max-width: 440px; width: 100%; padding: 36px 28px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); }
    .icon { width: 88px; height: 88px; border-radius: 22px; background: linear-gradient(135deg, #10b981, #047857); display: inline-flex; align-items: center; justify-content: center; font-size: 42px; margin-bottom: 20px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); }
    h1 { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 6px; }
    .tag { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; border: 1px solid rgba(16, 185, 129, 0.3); }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .features { text-align: left; background: #060d17; border: 1px solid #1e293b; border-radius: 16px; padding: 14px 18px; margin-bottom: 26px; }
    .feature-item { display: flex; align-items: center; font-size: 13px; color: #cbd5e1; margin: 6px 0; font-weight: 500; }
    .feature-item span { color: #10b981; font-weight: bold; margin-right: 10px; font-size: 16px; }
    .btn-download { display: block; width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981, #059669); color: #022c22; font-size: 16px; font-weight: 800; text-decoration: none; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5); transition: transform 0.2s, background 0.2s; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-download:active { transform: scale(0.98); }
    .btn-share { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 13px; background: #25D366; color: #062b14; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 14px; transition: transform 0.2s; }
    .btn-share:active { transform: scale(0.98); }
    .steps { margin-top: 24px; font-size: 11px; color: #64748b; line-height: 1.7; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🌱</div>
    <h1>Kisan Vision</h1>
    <div class="tag">v1.0.19 • Official APK Release</div>
    <p>Empowering farmers with AI crop insights, soil testing advice, revenue forecasting, and farm tools.</p>
    
    <div class="features">
      <div class="feature-item"><span>✓</span> AI Crop Recommendations & Risk Analysis</div>
      <div class="feature-item"><span>✓</span> Soil Testing & Organic Recipe Guide</div>
      <div class="feature-item"><span>✓</span> PMFBY Crop Insurance & Land Lease</div>
      <div class="feature-item"><span>✓</span> 100% Free & Built for Android Phones</div>
    </div>

    <a href="${apkUrl}" class="btn-download" download="KisanVision-Release.apk">
      ⬇️ Download APK (26 MB - Latest Release)
    </a>

    <a href="https://api.whatsapp.com/send?text=%F0%9F%8C%B1%20Download%20the%20official%20*Kisan%20Vision*%20Android%20App%20for%20smart%20farming%2C%20crop%20recommendations%20and%20soil%20testing%3A%20${encodeURIComponent(shareUrl)}" target="_blank" class="btn-share">
      📲 Share App on WhatsApp
    </a>

    <div class="steps">
      How to install: Tap <b>Download APK</b> &rarr; Open the downloaded file &rarr; Allow install from this source if prompted &rarr; Start Kisan Vision!
    </div>
  </div>
</body>
</html>`);
});
// App In-App Version & Update API
const fs = require('fs');
app.get(['/api/app-version', '/api/version'], (req, res) => {
    try {
        const configPath = path.join(__dirname, 'config/app-version.json');
        if (fs.existsSync(configPath)) {
            const raw = fs.readFileSync(configPath, 'utf8');
            const data = JSON.parse(raw);
            const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${PORT}`;
            const proto = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
            const fullDownloadUrl = `${proto}://${host}${data.downloadUrl}`;
            res.json({
                success: true,
                ...data,
                downloadUrl: fullDownloadUrl,
                directDownloadUrl: `${proto}://${host}/download/release`
            });
        } else {
            res.json({ success: true, latestVersion: '1.0.1', forceUpdate: false });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- Global Server Error ---');
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? 'Service temporarily unavailable' : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
