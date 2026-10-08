import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Share2, MapPin, Sprout, Wind, Droplets, Thermometer, CloudRain, Save, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import T, { TD } from '../T';
import useTranslate, { useTranslated } from '../../hooks/useTranslate';
import CropExplanationPanel from '../CropExplanationPanel';
import CropImage from '../CropImage';
import { downloadOrShareReport } from '../../utils/fileDownloader';

const HistoryDetailsModal = ({ record, onClose, onUpdateNotes }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [notes, setNotes] = useState(record?.notes || '');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const reportRef = useRef(null);
    const { t, language } = useTranslate();
    const { str } = useTranslated({
        placeholder: "Add your observations or notes about this analysis...",
        exporting: "Generating PDF Report...",
        success: "Report downloaded successfully!",
        error: "Failed to generate PDF"
    });

    React.useEffect(() => {
        if (record) setNotes(record.notes || '');
    }, [record]);

    if (!record) return null;

    const crop = record.predictionResult?.crop || 'Unknown';
    const confidence = record.predictionResult?.confidence || 0;
    const date = new Date(record.createdAt).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const handleExportPDF = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        toast.loading(str.exporting, { id: 'pdf-toast' });
        
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            const pdfBlob = pdf.output('blob');
            const fileName = `KisanVision_Report_${crop}_${new Date().getTime()}.pdf`;

            await downloadOrShareReport({
                blob: pdfBlob,
                fileName,
                title: `Kisan Vision Report - ${crop}`,
                text: `Kisan Vision crop analysis report for ${crop}`,
                mimeType: 'application/pdf'
            });
            
            toast.success(str.success, { id: 'pdf-toast' });
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error(str.error, { id: 'pdf-toast' });
        } finally {
            setIsExporting(false);
        }
    };

    const handleSaveNote = async () => {
        setIsSavingNote(true);
        await onUpdateNotes(record._id, notes);
        setIsSavingNote(false);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="relative w-full max-w-4xl max-h-full bg-brand-bg rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-brand-border"
                >
                    {/* Header Actions */}
                    <div className="flex justify-between items-center p-4 border-b border-brand-border bg-brand-surface">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                <span className="hidden sm:inline"><T>Export PDF</T></span>
                            </button>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-brand-surface-inset hover:bg-red-500/10 text-brand-text-tertiary hover:text-red-500 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div ref={reportRef} className="space-y-8 bg-brand-bg p-4 rounded-xl">
                            
                            {/* Report Header */}
                            <div className="text-center pb-6 border-b border-brand-border">
                                <h1 className="text-3xl font-black text-brand-text-primary uppercase tracking-tight mb-2"><T>Analysis Report</T></h1>
                                <p className="text-sm font-medium text-brand-text-tertiary">{date}</p>
                            </div>

                            {/* Main Metrics Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="premium-card p-6 flex flex-col justify-center items-center text-center">
                                    <CropImage 
                                        crop={crop} 
                                        size="lg" 
                                        rounded="rounded-3xl" 
                                        className="mb-4 shadow-xl ring-2 ring-brand-primary/20" 
                                    />
                                    <h2 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] mb-1"><T>Recommended Crop</T></h2>
                                    <p className="text-4xl font-black text-brand-text-primary uppercase"><TD value={crop} /></p>
                                    <div className="mt-4 px-4 py-1.5 bg-brand-surface-inset rounded-full text-sm font-bold text-brand-text-primary">
                                        {Math.round(confidence * 100)}% <T>Confidence</T>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="premium-card p-4 flex flex-col justify-center items-center text-center">
                                        <MapPin size={24} className="text-blue-500 mb-2" />
                                        <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-1"><T>Location</T></p>
                                        <p className="text-sm font-bold text-brand-text-primary"><TD value={record.location} /></p>
                                    </div>
                                    <div className="premium-card p-4 flex flex-col justify-center items-center text-center">
                                        <Wind size={24} className="text-amber-700 mb-2" />
                                        <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-1"><T>Soil Type</T></p>
                                        <p className="text-sm font-bold text-brand-text-primary"><TD value={record.soilType} /></p>
                                    </div>
                                    <div className="premium-card p-4 flex flex-col justify-center items-center text-center">
                                        <Thermometer size={24} className="text-orange-500 mb-2" />
                                        <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-1"><T>Temperature</T></p>
                                        <p className="text-sm font-bold text-brand-text-primary">{record.environmentalData?.temperature}°C</p>
                                    </div>
                                    <div className="premium-card p-4 flex flex-col justify-center items-center text-center">
                                        <CloudRain size={24} className="text-cyan-500 mb-2" />
                                        <p className="text-[10px] font-black text-brand-text-tertiary uppercase tracking-widest mb-1"><T>Rainfall</T></p>
                                        <p className="text-sm font-bold text-brand-text-primary">{record.environmentalData?.rainfall}mm</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Reasoning Panel (Reuse existing component if available) */}
                            {record.predictionResult?.aiReasoning && (
                                <div className="premium-card p-0 overflow-hidden">
                                    <CropExplanationPanel 
                                        crop={crop}
                                        confidence={confidence}
                                        explanation={record.predictionResult.aiReasoning}
                                        inputs={{ soil_type: record.soilType, season: record.environmentalData?.season }}
                                        mapped_values={record.predictionResult.mappedValues || (record.soilMetrics ? {
                                            N: record.soilMetrics.nitrogen ?? record.soilMetrics.N ?? 0,
                                            P: record.soilMetrics.phosphorus ?? record.soilMetrics.P ?? 0,
                                            K: record.soilMetrics.potassium ?? record.soilMetrics.K ?? 0,
                                            ph: record.soilMetrics.ph ?? 7.0
                                        } : null)}
                                    />
                                </div>
                            )}

                            {/* Soil Metrics */}
                            {record.soilMetrics && (
                                <div className="premium-card p-6">
                                    <h3 className="text-xs font-black text-brand-text-primary uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                                        <Droplets size={16} className="text-blue-500" />
                                        <T>Soil Metrics</T>
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-brand-surface-inset rounded-xl">
                                            <p className="text-xl font-black text-brand-text-primary">{record.soilMetrics.nitrogen}</p>
                                            <p className="text-[10px] font-black text-brand-text-secondary uppercase">N</p>
                                        </div>
                                        <div className="p-3 bg-brand-surface-inset rounded-xl">
                                            <p className="text-xl font-black text-brand-text-primary">{record.soilMetrics.phosphorus}</p>
                                            <p className="text-[10px] font-black text-brand-text-secondary uppercase">P</p>
                                        </div>
                                        <div className="p-3 bg-brand-surface-inset rounded-xl">
                                            <p className="text-xl font-black text-brand-text-primary">{record.soilMetrics.potassium}</p>
                                            <p className="text-[10px] font-black text-brand-text-secondary uppercase">K</p>
                                        </div>
                                        <div className="p-3 bg-brand-surface-inset rounded-xl">
                                            <p className="text-xl font-black text-brand-text-primary">{record.soilMetrics.ph}</p>
                                            <p className="text-[10px] font-black text-brand-text-secondary uppercase">pH</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notes Section (Outside of PDF export area) */}
                        <div className="mt-8">
                            <h3 className="text-xs font-black text-brand-text-primary uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-amber-500" />
                                <T>Personal Notes</T>
                            </h3>
                            <div className="relative">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={str.placeholder}
                                    className="w-full h-32 bg-brand-surface border border-brand-border rounded-2xl p-4 text-sm text-brand-text-primary placeholder:text-brand-text-tertiary focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all custom-scrollbar resize-none"
                                />
                                <button
                                    onClick={handleSaveNote}
                                    disabled={isSavingNote || notes === record.notes}
                                    className="absolute bottom-4 right-4 p-2 bg-brand-primary text-slate-950 rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSavingNote ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                </button>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HistoryDetailsModal;
