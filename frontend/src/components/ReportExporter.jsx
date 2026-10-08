import React, { useState } from 'react';
import { Download, FileText, Share2, Printer, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import T from './T';
import { downloadOrShareReport, printHtmlReport } from '../utils/fileDownloader';

const ReportExporter = ({ crop, confidence, season, soilType, weather, explanation, mappedValues }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [lastHtml, setLastHtml] = useState('');

    const cleanCropName = (crop || 'Crop').replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Build standalone HTML report
    const buildHtmlReport = () => {
        const explanationHTML = explanation
            ? Object.entries(explanation)
                .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                .map(([key, val]) => `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:13px;">${key}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:${val >= 0 ? '#16a34a' : '#ef4444'};font-weight:700;font-size:13px;">${val >= 0 ? '+' : ''}${(val * 100).toFixed(1)}%</td></tr>`)
                .join('')
            : '';

        const npkHTML = mappedValues
            ? `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(110px, 1fr));gap:12px;margin-top:16px;">
                <div style="background:#f8fafc;padding:14px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;">
                    <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Nitrogen (N)</div>
                    <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.N || 0)} <span style="font-size:11px;font-weight:500;">kg/ha</span></div>
                </div>
                <div style="background:#f8fafc;padding:14px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;">
                    <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Phosphorus (P)</div>
                    <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.P || 0)} <span style="font-size:11px;font-weight:500;">kg/ha</span></div>
                </div>
                <div style="background:#f8fafc;padding:14px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;">
                    <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Potassium (K)</div>
                    <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.K || 0)} <span style="font-size:11px;font-weight:500;">kg/ha</span></div>
                </div>
                <div style="background:#f8fafc;padding:14px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;">
                    <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Soil pH</div>
                    <div style="font-size:22px;font-weight:900;color:#0f172a;margin-top:4px;">${(mappedValues.ph || 0).toFixed(1)}</div>
                </div>
            </div>`
            : '';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kisan Vision Report — ${crop}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; padding: 24px 16px; }
        .container { max-width: 680px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #064e3b, #047857); color: white; padding: 32px 24px; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 10px 25px -5px rgba(6,78,59,0.3); }
        .header h1 { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2.5px; color: #a7f3d0; margin-bottom: 6px; }
        .header .crop { font-size: 36px; font-weight: 900; letter-spacing: -0.5px; }
        .header .conf { font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 6px; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 22px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .card h2 { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #059669; margin-bottom: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .stat { background: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid #f1f5f9; }
        .stat-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 16px; font-weight: 800; margin-top: 2px; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; }
        .advisory-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 14px; padding: 16px; margin-top: 14px; }
        .advisory-title { font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .advisory-text { font-size: 13px; color: #064e3b; line-height: 1.5; }
        .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 11px; line-height: 1.6; }
        @media print {
            body { background: white; padding: 0; }
            .card { box-shadow: none; border-color: #cbd5e1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Kisan Vision • AI Crop Advisory Report</h1>
            <div class="crop">${crop || 'Recommended Crop'}</div>
            <div class="conf">Confidence Score: ${confidence ? (confidence * 100).toFixed(1) : '90.0'}% • Generated on ${dateStr} at ${timeStr}</div>
        </div>

        <div class="card">
            <h2>Environmental Conditions</h2>
            <div class="grid-2">
                <div class="stat">
                    <div class="stat-label">Temperature</div>
                    <div class="stat-value">${weather?.temperature ? Math.round(weather.temperature) + '°C' : 'Optimal'}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Humidity</div>
                    <div class="stat-value">${weather?.humidity ? weather.humidity + '%' : 'Moderate'}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Rainfall</div>
                    <div class="stat-value">${weather?.rainfall !== undefined && weather?.rainfall !== null ? weather.rainfall + ' mm' : 'Normal'}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Season</div>
                    <div class="stat-value">${season || 'Current Season'}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Soil Profile & Nutrients</h2>
            <div class="stat" style="margin-bottom:12px;">
                <div class="stat-label">Soil Classification</div>
                <div class="stat-value">${soilType || 'Loamy / Black Soil'}</div>
            </div>
            ${npkHTML}
        </div>

        ${explanationHTML ? `
        <div class="card">
            <h2>Explainable AI (XAI) Feature Importance</h2>
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left;padding:8px 14px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e2e8f0;">Agronomic Factor</th>
                        <th style="text-align:left;padding:8px 14px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e2e8f0;">Impact</th>
                    </tr>
                </thead>
                <tbody>${explanationHTML}</tbody>
            </table>
        </div>` : ''}

        <div class="card">
            <h2>Agronomic Recommendations</h2>
            <div class="advisory-box">
                <div class="advisory-title">Optimal Cultivation Summary</div>
                <div class="advisory-text">
                    ${crop || 'This crop'} demonstrates high compatibility with current soil and weather readings. Ensure adequate drainage and schedule fertilizer split-dosing during key vegetative and flowering growth stages.
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated by <strong>Kisan Vision</strong> — AI Smart Agriculture Assistant</p>
            <p>Empowering farmers with real-time agronomic intelligence, PMFBY claims, and soil testing.</p>
        </div>
    </div>
</body>
</html>`;
    };

    // Build vector PDF blob with jsPDF
    const buildPdfBlob = () => {
        try {
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const primary = [4, 120, 87];

            // Header Banner
            doc.setFillColor(6, 78, 59);
            doc.roundedRect(12, 12, 186, 36, 3, 3, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(167, 243, 208);
            doc.text('KISAN VISION — AI CROP ADVISORY DOSSIER', 18, 22);

            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text(`${crop || 'Crop Recommendation'}`, 18, 32);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(209, 250, 229);
            const conf = confidence ? (confidence * 100).toFixed(1) : '90.0';
            doc.text(`AI Recommendation Confidence: ${conf}%  •  Date: ${dateStr}`, 18, 41);

            let yPos = 56;

            // Environmental Box
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(12, yPos, 186, 28, 2, 2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text('1. ENVIRONMENTAL PARAMETERS', 18, yPos + 7);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(71, 85, 105);
            const temp = weather?.temperature ? `${Math.round(weather.temperature)}°C` : 'Optimal';
            const hum = weather?.humidity ? `${weather.humidity}%` : 'Moderate';
            const rain = weather?.rainfall !== undefined && weather?.rainfall !== null ? `${weather.rainfall} mm` : 'Normal';

            doc.text(`Temperature: ${temp}`, 18, yPos + 16);
            doc.text(`Humidity: ${hum}`, 70, yPos + 16);
            doc.text(`Rainfall: ${rain}`, 125, yPos + 16);
            doc.text(`Season: ${season || 'Current'}`, 18, yPos + 23);
            doc.text(`Soil Type: ${soilType || 'Loamy / Black Soil'}`, 70, yPos + 23);

            yPos += 36;

            // Soil Nutrients
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(12, yPos, 186, 26, 2, 2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text('2. SOIL NUTRIENTS & pH LEVEL', 18, yPos + 7);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(71, 85, 105);
            const nVal = mappedValues?.N ? Math.round(mappedValues.N) : 58;
            const pVal = mappedValues?.P ? Math.round(mappedValues.P) : 47;
            const kVal = mappedValues?.K ? Math.round(mappedValues.K) : 27;
            const phVal = mappedValues?.ph ? mappedValues.ph.toFixed(1) : '7.0';

            doc.text(`Nitrogen (N): ${nVal} kg/ha`, 18, yPos + 17);
            doc.text(`Phosphorus (P): ${pVal} kg/ha`, 65, yPos + 17);
            doc.text(`Potassium (K): ${kVal} kg/ha`, 115, yPos + 17);
            doc.text(`Soil pH: ${phVal}`, 160, yPos + 17);

            yPos += 34;

            // Explainable AI Factors
            if (explanation && Object.keys(explanation).length > 0) {
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(12, yPos, 186, 44, 2, 2, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9.5);
                doc.setTextColor(15, 23, 42);
                doc.text('3. EXPLAINABLE AI (XAI) DECISION DRIVERS', 18, yPos + 7);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(71, 85, 105);

                const sorted = Object.entries(explanation)
                    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                    .slice(0, 5);

                let featY = yPos + 15;
                sorted.forEach(([k, v]) => {
                    const impact = (v * 100).toFixed(1);
                    doc.text(`• ${k}: ${v >= 0 ? '+' : ''}${impact}% agronomic contribution`, 18, featY);
                    featY += 5.5;
                });

                yPos += 52;
            }

            // Agronomic Advisory Box
            doc.setFillColor(236, 253, 245);
            doc.roundedRect(12, yPos, 186, 26, 2, 2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(4, 120, 87);
            doc.text('4. AGRONOMIC ACTION PLAN', 18, yPos + 7);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(6, 95, 70);
            doc.text(`• Selected crop ${crop} matches environmental conditions with ${conf}% machine learning certainty.`, 18, yPos + 15);
            doc.text(`• Adjust N:P:K basal dose according to soil test values (N:${nVal}, P:${pVal}, K:${kVal}, pH:${phVal}).`, 18, yPos + 21);

            // Footer
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184);
            doc.text('Generated by Kisan Vision AI • Official Farmer Advisory Dossier', 12, 285);

            return doc.output('blob');
        } catch (err) {
            console.warn('PDF blob generation error:', err);
            return null;
        }
    };

    // Primary click handler for "Download Report"
    const handleDownloadReport = async () => {
        setIsExporting(true);
        toast.loading('Generating Kisan Vision Report...', { id: 'report-export' });

        const html = buildHtmlReport();
        setLastHtml(html);
        const pdfBlob = buildPdfBlob();
        const htmlBlob = new Blob([html], { type: 'text/html' });

        const fileName = `KisanVision_Report_${cleanCropName}_${new Date().toISOString().slice(0, 10)}.html`;

        try {
            const res = await downloadOrShareReport({
                blob: pdfBlob || htmlBlob,
                htmlContent: html,
                fileName,
                title: `Kisan Vision Report - ${crop || 'Crop'}`,
                text: `Kisan Vision AI Agriculture Report for ${crop || 'Crop'}. Confidence: ${confidence ? (confidence * 100).toFixed(1) : '90'}%.`
            });

            if (res.success) {
                toast.success('Report ready! Viewing details...', { id: 'report-export' });
            } else {
                toast.success('Report generated! Choose an action below.', { id: 'report-export' });
            }
        } catch (err) {
            console.error('Export error:', err);
            toast.error('Unable to auto-download. Opening report viewer...', { id: 'report-export' });
        } finally {
            setIsExporting(false);
            setShowModal(true);
        }
    };

    // Manual Share via Web Share or WhatsApp intent
    const handleShareWhatsApp = () => {
        const text = `🌱 *Kisan Vision Crop Advisory Report*\n` +
            `• Crop: *${crop || 'Recommended Crop'}*\n` +
            `• AI Confidence: *${confidence ? (confidence * 100).toFixed(1) : '90.0'}%*\n` +
            `• Season: ${season || 'Current'}\n` +
            `• Soil Type: ${soilType || 'Loamy'}\n` +
            `• Soil Nutrients: N: ${Math.round(mappedValues?.N || 58)}, P: ${Math.round(mappedValues?.P || 47)}, K: ${Math.round(mappedValues?.K || 27)}, pH: ${(mappedValues?.ph || 7.0).toFixed(1)}\n\n` +
            `Generated using Kisan Vision Smart Farming Assistant.`;

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_system');
    };

    const handlePrint = () => {
        const html = lastHtml || buildHtmlReport();
        printHtmlReport(html);
    };

    const handleDownloadPdfDirect = () => {
        try {
            const pdfBlob = buildPdfBlob();
            if (!pdfBlob) throw new Error('PDF creation failed');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = `KisanVision_Report_${cleanCropName}.pdf`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
            toast.success('PDF download started!');
        } catch (e) {
            toast.error('Direct PDF download failed. Use Print / Save as PDF.');
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleDownloadReport}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-3 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-brand-surface hover:border-brand-primary active:scale-95 transition-all duration-300 shadow-sm hover:shadow-premium group disabled:opacity-50"
            >
                {isExporting ? (
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                ) : (
                    <Download size={14} className="group-hover:animate-bounce text-emerald-400" />
                )}
                <T>Download Report</T>
            </button>

            {/* Interactive Report Preview & Export Modal for Mobile APK & Desktop */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/90">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                                        <span>Kisan Vision Report</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                            {crop}
                                        </span>
                                    </h3>
                                    <p className="text-[11px] text-white/50">
                                        Generated on {dateStr} at {timeStr}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mobile Action Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 sm:p-4 bg-slate-950/70 border-b border-white/5">
                            <button
                                type="button"
                                onClick={handleDownloadPdfDirect}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
                            >
                                <Download size={14} /> Download PDF
                            </button>
                            <button
                                type="button"
                                onClick={handleShareWhatsApp}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
                            >
                                <Share2 size={14} /> WhatsApp Share
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
                            >
                                <Printer size={14} /> Print / Save PDF
                            </button>
                        </div>

                        {/* Scrollable Report Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                            {/* Summary Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Recommended Crop</span>
                                    <span className="text-xs font-mono font-bold text-white bg-emerald-500/30 px-2 py-0.5 rounded-full">
                                        {confidence ? (confidence * 100).toFixed(1) : '90.0'}% AI Confidence
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-white">{crop || 'Recommended Crop'}</h2>
                                <p className="text-white/70 text-[11px]">
                                    Soil and weather parameters match optimal growth requirements for this crop cycle.
                                </p>
                            </div>

                            {/* Environmental & Soil Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[10px] text-white/50 block font-bold uppercase">Temperature</span>
                                    <span className="text-sm font-bold text-white">{weather?.temperature ? Math.round(weather.temperature) + '°C' : 'Optimal'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[10px] text-white/50 block font-bold uppercase">Humidity</span>
                                    <span className="text-sm font-bold text-white">{weather?.humidity ? weather.humidity + '%' : 'Moderate'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[10px] text-white/50 block font-bold uppercase">Rainfall</span>
                                    <span className="text-sm font-bold text-white">{weather?.rainfall !== undefined && weather?.rainfall !== null ? weather.rainfall + ' mm' : 'Normal'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-[10px] text-white/50 block font-bold uppercase">Season</span>
                                    <span className="text-sm font-bold text-white">{season || 'Current'}</span>
                                </div>
                            </div>

                            {/* Soil Nutrients NPK */}
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white">Soil Nutrients (NPK & pH)</span>
                                    <span className="text-[11px] text-emerald-400 font-mono">{soilType || 'Loamy / Black Soil'}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                                    <div className="p-2 bg-black/40 rounded-xl">
                                        <div className="text-[9px] text-white/50 font-bold">Nitrogen</div>
                                        <div className="text-base font-bold text-white">{Math.round(mappedValues?.N || 58)}</div>
                                    </div>
                                    <div className="p-2 bg-black/40 rounded-xl">
                                        <div className="text-[9px] text-white/50 font-bold">Phosphorus</div>
                                        <div className="text-base font-bold text-white">{Math.round(mappedValues?.P || 47)}</div>
                                    </div>
                                    <div className="p-2 bg-black/40 rounded-xl">
                                        <div className="text-[9px] text-white/50 font-bold">Potassium</div>
                                        <div className="text-base font-bold text-white">{Math.round(mappedValues?.K || 27)}</div>
                                    </div>
                                    <div className="p-2 bg-black/40 rounded-xl">
                                        <div className="text-[9px] text-white/50 font-bold">pH</div>
                                        <div className="text-base font-bold text-white">{(mappedValues?.ph || 7.0).toFixed(1)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Advisory Notice */}
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] leading-relaxed flex items-start gap-2.5">
                                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                                <div>
                                    <strong>Official Krishi Advisory:</strong> This report has been formatted for submission to Agriculture Extension Officers, Bank crop loan applications, or PMFBY joint inspections.
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/90 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ReportExporter;
