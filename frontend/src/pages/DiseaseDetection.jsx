import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, Leaf, AlertTriangle, CheckCircle, Shield, Eye, ChevronDown, 
  Loader2, Search, Sprout, FlaskConical, Camera, Upload, RefreshCw, 
  Volume2, PhoneCall, MessageCircle, HelpCircle, X, Sparkles, 
  ExternalLink, Cpu, Info, ShieldAlert, Award, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../context/LanguageContext';
import T from '../components/T';
import { playSuccessChime } from '../utils/soundFx';
import { getActiveApiUrl } from '../utils/mobileInit';

const getApi = () => getActiveApiUrl();

const CROPS = [
  'Rice', 'Wheat', 'Cotton', 'Maize', 'Tomato', 'Potato', 'Onion', 'Groundnut', 
  'Soybean', 'Sugarcane', 'Chilli', 'Mustard', 'Bajra (Pearl Millet)', 'Jowar (Sorghum)', 
  'Sunflower', 'Cucumber', 'Brinjal', 'Banana', 'Grapes', 'Mango', 'Apple', 'Peach', 'Strawberry'
];

const SEVERITY_CONFIG = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-300 border-red-500/40', icon: '🚨' },
  High: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40', icon: '⚠️' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: '⚡' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: '✅' },
  Unknown: { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', badge: 'bg-gray-500/20 text-gray-300 border-gray-500/40', icon: '❓' },
};

const SYMPTOM_EXAMPLES = [
  'Water-soaked dark brown spots with white mold underneath on tomato leaves',
  'Target-like concentric rings with yellow halo on potato leaves',
  'Cinnamon-brown powdery pustules scattered across maize leaf surface',
  'Small water-soaked circular blisters turning dark brown with yellow margin on chilli',
  'Olive-green velvety spots on apple leaves causing curling and drop',
  'Leaves curling upward with bright yellowing margins and severe stunting'
];

export default function DiseaseDetection() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'symptoms'
  
  // Model status state
  const [modelStatus, setModelStatus] = useState(null);
  const [isCheckingModel, setIsCheckingModel] = useState(true);

  // Photo mode state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // XAI View state: 'side-by-side' | 'overlay' | 'heatmap' | 'original'
  const [xaiViewMode, setXaiViewMode] = useState('side-by-side');
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // Dual Treatment Tab: 'chemical' | 'biological'
  const [treatmentTab, setTreatmentTab] = useState('chemical');

  // Symptoms mode state
  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Results state
  const [result, setResult] = useState(null);
  const [rejectionError, setRejectionError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleOpenCamera = (e) => {
    e?.stopPropagation?.();
    cameraInputRef.current?.click();
  };

  const handleOpenGallery = (e) => {
    e?.stopPropagation?.();
    galleryInputRef.current?.click();
  };

  useEffect(() => {
    checkModelStatus();
    fetchSamples();
  }, []);

  const checkModelStatus = async () => {
    setIsCheckingModel(true);
    try {
      const res = await axios.get(`${getApi()}/disease-model-status`);
      if (res.data?.success && res.data?.data?.is_loaded) {
        setModelStatus(res.data.data);
      } else {
        setModelStatus({ is_loaded: false, error: res.data?.error || 'Engine offline' });
      }
    } catch (err) {
      setModelStatus({ is_loaded: false, error: 'Connection failed' });
    } finally {
      setIsCheckingModel(false);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await axios.get(`${getApi()}/disease-samples`);
      if (res.data?.data) {
        setSamples(res.data.data);
      }
    } catch {}
  };

  // Handle image upload with auto-compression using canvas (supports camera and gallery)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    // Reset input value so user can re-select same or different image
    e.target.value = '';

    if (!file) return;

    // Validate MIME type or file extension (JPG, PNG, WebP)
    const isImage = file.type?.startsWith('image/') || /\.(jpe?g|png|webp|bmp|heic|heif)$/i.test(file.name || '');
    if (!isImage) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    setSelectedSampleId(null);
    const reader = new FileReader();

    reader.onerror = () => {
      toast.error('Unable to read this image. Please select another photo.');
    };

    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        toast.error('Unable to read this image. Please select another photo.');
        return;
      }

      const img = new window.Image();
      img.onerror = () => {
        toast.error('Unable to decode this image. Please select another photo.');
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Clean high-resolution JPEG data URL (~120KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedImage(compressedDataUrl);
          setImagePreview(compressedDataUrl);
          setResult(null);
          setRejectionError(null);
          toast.success('Leaf image loaded successfully!');
        } catch (err) {
          console.warn('Canvas processing error, using raw image:', err);
          setSelectedImage(dataUrl);
          setImagePreview(dataUrl);
          setResult(null);
          setRejectionError(null);
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  // 1-Click Sample Leaf Selection
  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setSelectedImage(null);
    setCrop(sample.crop);
    setRejectionError(null);
    // Create a high-quality sample canvas preview to send to the ML model
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 256, 256);
    // Draw representative sample leaf
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.ellipse(128, 128, 90, 115, Math.PI / 8, 0, 2 * Math.PI);
    ctx.fill();
    // Leaf vein
    ctx.strokeStyle = '#52b788';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(128, 30);
    ctx.lineTo(128, 226);
    ctx.stroke();
    // Draw disease spots based on sample type
    if (sample.id.includes('blight')) {
      ctx.fillStyle = '#4a2810';
      ctx.beginPath();
      ctx.ellipse(100, 100, 35, 25, 0, 0, 2 * Math.PI);
      ctx.ellipse(150, 150, 40, 30, 0, 0, 2 * Math.PI);
      ctx.fill();
    } else if (sample.id.includes('rust')) {
      ctx.fillStyle = '#d97706';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(80 + (i % 4) * 28, 70 + Math.floor(i / 4) * 35, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(110, 110, 15, 0, 2 * Math.PI);
      ctx.arc(145, 140, 18, 0, 2 * Math.PI);
      ctx.fill();
    }
    const sampleDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setImagePreview(sampleDataUrl);
    setSelectedImage(sampleDataUrl);
    setResult(null);
  };

  // Submit Photo to Deep Learning PyTorch Model
  const handlePhotoSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedImage && !selectedSampleId) {
      toast.error('Please upload or select a leaf photo first');
      return;
    }

    setLoading(true);
    setIsScanning(true);
    setResult(null);
    setRejectionError(null);

    try {
      const res = await axios.post(`${getApi()}/disease-detect-image`, {
        image: selectedImage,
        sample_id: selectedSampleId,
        crop: crop
      });

      if (res.data?.success && res.data?.data) {
        setResult(res.data.data);
        setRejectionError(null);
        setIsScanning(false);
        setLoading(false);
        playSuccessChime();
        toast.success(`Diagnosis complete: ${res.data.data.name || res.data.data.disease}`);
      } else {
        throw new Error(res.data?.message || 'Inference failed');
      }
    } catch (err) {
      console.error('Photo inference error:', err);
      setIsScanning(false);
      setLoading(false);

      if (err.response?.status === 422 || err.response?.data?.is_plant === false) {
        const errData = err.response.data || {};
        setRejectionError({
          title: 'Non-Plant Object Detected',
          message: errData.message || 'No plant leaf or crop detected in this image. Instant Disease Doctor only analyzes plant leaves and crops. Please capture or upload a clear photo of a crop leaf.',
          reason: errData.reason || 'Image content does not match botanical foliage pigments or leaf morphology.'
        });
        setResult(null);
        toast.error('🚫 Image Declined: Non-Plant Object Detected', { duration: 6000 });
      } else {
        const msg = err.response?.data?.message || err.message || 'Failed to analyze leaf image with AI model.';
        toast.error(msg, { duration: 5000 });
      }
    }
  };

  // Submit Text Symptoms / Voice Input
  const handleSymptomsSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error('Please describe the symptoms');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${getApi()}/disease-detect`, { symptoms, crop });
      if (res.data?.success && res.data?.data) {
        setResult(res.data.data);
        playSuccessChime();
        toast.success('Diagnosis generated from agronomic symptom engine!');
      }
    } catch (err) {
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sev = result ? (SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.Unknown) : null;
  const diseaseTitle = result?.name || result?.disease;
  const isUncertain = result?.is_uncertain || (result?.confidence && result.confidence < 55.0);

  // Pre-filled WhatsApp message for agronomist consultation
  const whatsappConsultLink = `https://wa.me/919849023145?text=${encodeURIComponent(
    `Hello Krishi Agronomist, I diagnosed my ${result?.crop || 'crop'} on KisanVision. ` +
    `Prediction: ${diseaseTitle || 'Uncertain'} (${result?.confidence || '0'}% confidence). ` +
    `Severity: ${result?.severity || 'Medium'}. Could you please review my leaf diagnosis and recommend field advice?`
  )}`;

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-20 sm:pt-24 pb-16 px-3 sm:px-6 max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8 w-full max-w-full overflow-hidden">
        
        {/* Header with Deep Learning & XAI Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu size={14} className="text-emerald-400" />
            PyTorch MobileNetV2 Deep Learning & Grad-CAM XAI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Instant Crop Disease Doctor
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Upload a photo of a diseased crop leaf. Our deep learning model classifies over 38 PlantVillage crop-disease categories and generates Explainable AI (Grad-CAM) attention heatmaps highlighting the exact infection zones.
          </p>

          {/* Model Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {isCheckingModel ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700">
                <Loader2 size={12} className="animate-spin text-emerald-400" /> Verifying PyTorch Model Engine...
              </span>
            ) : modelStatus?.is_loaded ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Model: {modelStatus.model_name || 'MobileNetV2 (38 Classes)'} • Grad-CAM Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                <AlertTriangle size={12} />
                AI Inference Engine Offline (Please launch PyTorch service on port 5001)
              </span>
            )}
          </div>
        </motion.div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex justify-center">
          <div className="w-full sm:w-auto bg-gray-800/80 border border-gray-700/80 rounded-2xl p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xl">
            <button
              onClick={() => { setActiveTab('photo'); setResult(null); }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'photo'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera size={15} /> Upload Leaf Photo (Deep Learning)
            </button>
            <button
              onClick={() => { setActiveTab('symptoms'); setResult(null); }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'symptoms'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sprout size={15} /> Describe Symptoms / Voice
            </button>
          </div>
        </div>

        {/* MODE 1: PHOTO UPLOAD */}
        {activeTab === 'photo' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-6">
              
              {/* Optional Crop Filter & Sample Leaf Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">🌾 Crop Name (Optional Context)</label>
                  <div className="relative">
                    <select
                      value={crop}
                      onChange={e => setCrop(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-200 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Any Crop / Auto-detect</option>
                      {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3 text-gray-500" size={14} />
                  </div>
                </div>

                {/* 1-Click Samples Dropdown / Helper */}
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1.5">🧪 Or Try a 1-Click Test Specimen:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {samples.slice(0, 5).map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSample(s)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          selectedSampleId === s.id
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold'
                            : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {s.crop}: {s.name.split(' ').slice(1).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual Source Action Buttons: 📷 Take Photo & 🖼️ Choose from Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 hover:from-emerald-600/40 hover:to-emerald-500/30 active:scale-98 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <Camera size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span><T>📷 Take Photo (Camera)</T></span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenGallery}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600/30 to-teal-500/20 hover:from-teal-600/40 hover:to-teal-500/30 active:scale-98 border border-teal-500/40 text-teal-300 font-bold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <ImageIcon size={18} className="text-teal-400 group-hover:scale-110 transition-transform" />
                  <span><T>🖼️ Upload from Gallery</T></span>
                </button>
              </div>

              {/* Hidden Inputs for Direct Camera & Mobile Gallery Picker */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Upload Dropzone / Preview Area */}
              <div
                onClick={imagePreview ? undefined : handleOpenGallery}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[250px] ${
                  imagePreview
                    ? 'border-emerald-500/50 bg-gray-900/40 cursor-default'
                    : 'border-gray-700 hover:border-emerald-500/50 bg-gray-900/30'
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={imagePreview}
                      alt="Uploaded Crop Leaf"
                      className="w-full h-60 object-cover rounded-xl"
                    />

                    {/* Laser Scanning Animation Effect */}
                    {isScanning && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10B981]"
                      />
                    )}

                    {/* Quick Action Badges on Preview */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-between gap-1.5 bg-black/80 backdrop-blur p-1.5 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={handleOpenCamera}
                        className="flex-1 py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Camera size={11} /> <T>📷 Retake</T>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenGallery}
                        className="flex-1 py-1.5 px-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <ImageIcon size={11} /> <T>🖼️ Gallery</T>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setSelectedImage(null);
                          setSelectedSampleId(null);
                        }}
                        className="py-1.5 px-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <X size={11} /> <T>Clear</T>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white"><T>Tap to Upload from Gallery or Take Photo</T></p>
                      <p className="text-xs text-gray-400 mt-1"><T>Supports Camera & Mobile Photo Gallery (JPG, PNG, WebP)</T></p>
                      <p className="text-[11px] text-emerald-400/80 mt-1">💡 <T>For best accuracy: Hold camera 15-20cm from leaf with good natural light</T></p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium"><T>📷 Take Photo (Camera)</T></span>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium"><T>🖼️ Upload from Gallery</T></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePhotoSubmit}
                disabled={loading || (!selectedImage && !selectedSampleId)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> <T>Running PyTorch MobileNetV2 & Grad-CAM...</T></>
                ) : (
                  <><Search size={18} /> <T>Run AI Disease Diagnosis</T></>
                )}
              </button>

            </div>
          </motion.div>
        )}

        {/* MODE 2: SYMPTOMS / VOICE */}
        {activeTab === 'symptoms' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <form onSubmit={handleSymptomsSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">🌾 Select Crop (Optional)</label>
                <div className="relative">
                  <select
                    value={crop}
                    onChange={e => setCrop(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Any Crop / Not Sure</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 text-gray-500" size={16} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">🔍 Describe Symptoms <span className="text-red-400">*</span></label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-emerald-400 hidden sm:inline">🎙️ Speak symptoms:</span>
                    <VoiceInput
                      size="sm"
                      onTranscript={(spokenText) => {
                        setSymptoms(prev => prev ? `${prev} ${spokenText}` : spokenText);
                      }}
                    />
                  </div>
                </div>
                <textarea
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  rows={4}
                  placeholder="Describe what you see on the plant... e.g., yellow spots with brown border on leaves, white powdery coating, wilting, insect damage, etc."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">💡 Try an agronomic example:</p>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_EXAMPLES.slice(0, 4).map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSymptoms(ex)}
                      className="text-xs px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 rounded-lg text-gray-400 hover:text-gray-200 transition-all text-left"
                    >
                      {ex.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing Symptoms...</> : <><Search size={18} /> Diagnose Disease</>}
              </button>
            </form>
          </motion.div>
        )}

        {/* NON-PLANT REJECTION CARD */}
        <AnimatePresence>
          {rejectionError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-950/40 border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-red-500/20 animate-pulse">
                🚫
              </div>
              <div className="space-y-2 max-w-xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-red-500/40">
                  <T>Image Declined by AI Verifier</T>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  <T>{rejectionError.title || 'No Plant or Crop Leaf Detected'}</T>
                </h3>
                <p className="text-sm text-red-200/90 leading-relaxed font-medium">
                  <T>{rejectionError.message}</T>
                </p>
                {rejectionError.reason && (
                  <p className="text-xs text-gray-400 bg-black/40 rounded-xl px-4 py-2 font-mono">
                    <T>Verification Detail:</T> {rejectionError.reason}
                  </p>
                )}
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Camera size={16} /> <T>📷 Take Crop Leaf Photo</T>
                </button>
                <button
                  type="button"
                  onClick={handleOpenGallery}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                >
                  <ImageIcon size={16} /> <T>🖼️ Choose from Gallery</T>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS PANEL */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* 1. Header Diagnosis Card */}
              <div className={`bg-gray-800/70 border rounded-2xl p-6 ${sev.border} shadow-2xl relative overflow-hidden`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">AI Deep Learning Diagnosis</span>
                      {result.plantvillage_class && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded bg-gray-700/60 text-emerald-400 font-mono border border-gray-600/40">
                          Class: {result.plantvillage_class}
                        </span>
                      )}
                      {result.is_healthy && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          🌱 Specimen Healthy
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                      {sev.icon} {diseaseTitle}
                    </h2>

                    {result.causes?.[0] && (
                      <p className="text-xs text-gray-400 italic">
                        Pathogen / Primary Factor: {result.causes[0]}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sev.badge}`}>
                        {result.severity} Severity
                      </span>
                      {result.confidence && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          result.confidence >= 80 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                            : result.confidence >= 55 
                              ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' 
                              : 'bg-red-500/15 border-red-500/30 text-red-400'
                        }`}>
                          {result.confidence}% Model Confidence
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audio Listen Aloud */}
                  <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-300">🔊 Listen:</span>
                    <VoiceInput
                      showSpeaker={true}
                      textToSpeak={`${diseaseTitle}. Severity is ${result.severity}. ${
                        result.chemical_management?.registered_products?.[0]?.name 
                          ? `Recommended treatment: ${result.chemical_management.registered_products[0].name} at ${result.chemical_management.registered_products[0].dosage}.` 
                          : result.treatment?.[0] || ''
                      }`}
                      size="md"
                    />
                  </div>
                </div>

                {/* Animated Confidence Bar */}
                {result.confidence && (
                  <div className="mt-5 pt-4 border-t border-gray-700/60">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-400">Deep Learning Probability Score</span>
                      <span className="font-bold text-white">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          result.confidence >= 80 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                            : result.confidence >= 55 
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-400' 
                              : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Uncertainty Warning Banner (If confidence < 55%) */}
                {isUncertain && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
                  >
                    <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                    <div className="text-xs space-y-1.5">
                      <p className="font-bold text-amber-300 text-sm">
                        Low Confidence Diagnosis ({result.confidence}%)
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        The neural network detected ambiguous leaf patterns or insufficient lesion clarity. We strongly recommend retaking the photo in good lighting or consulting an agricultural specialist.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <RefreshCw size={12} /> Retake Photo
                        </button>
                        <a
                          href="tel:18001801551"
                          className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <PhoneCall size={12} /> Call Kisan Call Center (1800-180-1551)
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 2. Explainable AI (XAI) Grad-CAM Inspection Panel */}
              {(result.heatmap_image || result.overlay_image) && (
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                        <Eye size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                          Explainable AI (XAI) • Grad-CAM Visual Heatmap
                        </h3>
                        <p className="text-xs text-gray-400">
                          Visual explanation showing which leaf regions influenced the MobileNetV2 prediction
                        </p>
                      </div>
                    </div>

                    {/* View AI Explanation Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowExplanationModal(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 border border-teal-500/40 rounded-xl text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles size={14} className="text-teal-400" />
                      View AI Explanation
                    </button>
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex gap-2 border-b border-gray-700/50 pb-3 text-xs">
                    <button
                      onClick={() => setXaiViewMode('side-by-side')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        xaiViewMode === 'side-by-side'
                          ? 'bg-gray-700 text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Side-by-Side View
                    </button>
                    <button
                      onClick={() => setXaiViewMode('overlay')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        xaiViewMode === 'overlay'
                          ? 'bg-gray-700 text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Blended Overlay
                    </button>
                    <button
                      onClick={() => setXaiViewMode('heatmap')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        xaiViewMode === 'heatmap'
                          ? 'bg-gray-700 text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Pure Heatmap
                    </button>
                  </div>

                  {/* Visual Comparison Area */}
                  {xaiViewMode === 'side-by-side' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Original Upload */}
                      <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-3 text-center space-y-2">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          Original Uploaded Leaf
                        </span>
                        <div className="h-56 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                          <img
                            src={result.original_image || imagePreview}
                            alt="Original leaf"
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Grad-CAM Overlay */}
                      <div className="bg-gray-900/60 border border-teal-500/30 rounded-xl p-3 text-center space-y-2">
                        <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                          Grad-CAM Attention Heatmap
                        </span>
                        <div className="h-56 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center relative">
                          <img
                            src={result.overlay_image || result.heatmap_image}
                            alt="Grad-CAM heatmap"
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {xaiViewMode === 'overlay' && (
                    <div className="bg-gray-900/60 border border-teal-500/30 rounded-xl p-4 text-center max-w-md mx-auto space-y-2">
                      <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                        Superimposed Heatmap (55% Leaf + 45% Activation)
                      </span>
                      <div className="h-64 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                        <img
                          src={result.overlay_image}
                          alt="Blended overlay"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {xaiViewMode === 'heatmap' && (
                    <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center max-w-md mx-auto space-y-2">
                      <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider block">
                        Raw JET Colormap Activation
                      </span>
                      <div className="h-64 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                        <img
                          src={result.heatmap_image}
                          alt="Raw heatmap"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Grad-CAM Color Spectrum Legend */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2 border-t border-gray-700/40">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Low Influence / Healthy Tissue
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Moderate Feature Attention
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-red-600 inline-block" /> High Attention (Infection Focus)
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Common Symptoms & Diagnostic Indicators */}
              {result.symptoms && result.symptoms.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-teal-400" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                      Verified Agronomic Symptoms
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.symptoms.map((sym, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-gray-300 bg-gray-900/60 border border-gray-700/40 rounded-xl p-3">
                        <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Dual Treatment Recommendation System (Tabs) */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Dual Treatment Switcher Header */}
                <div className="grid grid-cols-2 border-b border-gray-700/60">
                  <button
                    type="button"
                    onClick={() => setTreatmentTab('chemical')}
                    className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      treatmentTab === 'chemical'
                        ? 'bg-orange-500/15 text-orange-400 border-b-2 border-orange-500'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                  >
                    <FlaskConical size={16} className="text-orange-400" />
                    Chemical Management (CIBRC Approved)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreatmentTab('biological')}
                    className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      treatmentTab === 'biological'
                        ? 'bg-emerald-500/15 text-emerald-400 border-b-2 border-emerald-500'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                  >
                    <Sprout size={16} className="text-emerald-400" />
                    Biological & Organic Management
                  </button>
                </div>

                <div className="p-6">
                  {/* TAB A: CHEMICAL MANAGEMENT */}
                  {treatmentTab === 'chemical' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      
                      {/* Registered Products Table */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Award size={14} /> Registered Formulations & Dosages
                          </h4>
                          <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                            ICAR / CIBRC Protocols
                          </span>
                        </div>

                        {result.chemical_management?.registered_products?.length > 0 ? (
                          <div className="space-y-2.5">
                            {result.chemical_management.registered_products.map((prod, idx) => (
                              <div key={idx} className="bg-gray-900/70 border border-gray-700/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="font-bold text-white text-xs sm:text-sm">{prod.name}</div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">Application Stage: {prod.timing}</div>
                                </div>
                                <div className="sm:text-right shrink-0">
                                  <span className="inline-block px-3 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
                                    {prod.dosage}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 bg-gray-900/60 p-4 rounded-xl border border-gray-700/40">
                            {result.chemical_management?.label_instructions || 'No synthetic chemicals recommended for this stage/disease. Rely on cultural sanitation and biocontrols.'}
                          </div>
                        )}
                      </div>

                      {/* Official Label Directions */}
                      {result.chemical_management?.label_instructions && (
                        <div className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 space-y-1">
                          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                            Official Label Directions:
                          </span>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {result.chemical_management.label_instructions}
                          </p>
                        </div>
                      )}

                      {/* Safety Precautions & PPE */}
                      {result.chemical_management?.safety_precautions?.length > 0 && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
                          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert size={14} /> Mandatory Safety Precautions & PPE:
                          </span>
                          <ul className="space-y-1.5">
                            {result.chemical_management.safety_precautions.map((safe, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-red-400 font-bold shrink-0">•</span>
                                <span className="leading-relaxed">{safe}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB B: BIOLOGICAL & ORGANIC MANAGEMENT */}
                  {treatmentTab === 'biological' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      
                      {/* Biocontrol Agents */}
                      {result.biological_management?.biocontrol_agents?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Sprout size={14} /> Biological Control Agents (Bio-Fungicides)
                          </h4>
                          <div className="space-y-2">
                            {result.biological_management.biocontrol_agents.map((bio, idx) => (
                              <div key={idx} className="bg-gray-900/70 border border-gray-700/50 rounded-xl p-3.5">
                                <div className="font-bold text-emerald-400 text-xs sm:text-sm">{bio.agent}</div>
                                <div className="text-xs text-gray-300 mt-1">{bio.application}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certified Organic Sprays */}
                      {result.biological_management?.organic_sprays?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            🌿 Certified Organic Spray Formulations
                          </h4>
                          <ul className="space-y-2">
                            {result.biological_management.organic_sprays.map((org, idx) => (
                              <li key={idx} className="text-xs text-gray-300 bg-gray-900/60 border border-gray-700/40 rounded-xl p-3 flex gap-2.5">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="leading-relaxed">{org}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Agronomic Cultural Practices */}
                      {result.biological_management?.cultural_practices?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Shield size={14} /> Cultural & Preventive Farm Practices
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {result.biological_management.cultural_practices.map((cul, idx) => (
                              <div key={idx} className="text-xs text-gray-300 bg-gray-900/60 border border-gray-700/40 rounded-xl p-3 flex gap-2">
                                <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{cul}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* 5. Alternative Top-3 Candidates */}
              {result.top3 && result.top3.length > 1 && (
                <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    📊 Deep Learning Probability Distribution (Top Candidates):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.top3.map((cand, idx) => (
                      <div key={idx} className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-3 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white truncate max-w-[130px]">{cand.crop}</span>
                          <span className="font-mono text-emerald-400 font-bold">{cand.confidence}%</span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">{cand.disease}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Consult an Agricultural Expert Panel */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <PhoneCall size={18} className="text-emerald-400" />
                      <h3 className="font-bold text-white text-base">
                        Consult an Agricultural Agronomist
                      </h3>
                    </div>
                    <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                      If the crop damage is severe, disease symptoms do not match, or you require localized pesticide recommendations, contact certified government and institutional experts immediately.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Kisan Call Center */}
                  <a
                    href="tel:18001801551"
                    className="flex items-center gap-3 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 p-4 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Kisan Call Center (Govt. of India)</div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        1800-180-1551 (Toll-Free)
                      </div>
                      <div className="text-[10px] text-emerald-400">Available 6:00 AM – 10:00 PM in all Indian languages</div>
                    </div>
                  </a>

                  {/* Krishi WhatsApp Desk */}
                  <a
                    href={whatsappConsultLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 p-4 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Krishi Agronomist Desk (WhatsApp)</div>
                      <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">
                        Send Leaf Photo for Verification
                      </div>
                      <div className="text-[10px] text-green-400">Direct chat with agricultural specialists</div>
                    </div>
                  </a>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* EXPLAINABLE AI (XAI) GRAD-CAM EXPLANATION MODAL */}
      <AnimatePresence>
        {showExplanationModal && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowExplanationModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                  <Sparkles size={13} /> Explainable AI (XAI) Attribution
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  How the Neural Network Diagnosed This Leaf
                </h3>
              </div>

              {/* Visual Heatmap Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-center space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-300 uppercase">Input Leaf</span>
                  <div className="h-48 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
                    <img
                      src={result.original_image || imagePreview}
                      alt="Input leaf"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="bg-gray-800/60 border border-teal-500/40 rounded-xl p-3 text-center space-y-1.5">
                  <span className="text-[11px] font-bold text-teal-400 uppercase">Grad-CAM Overlay</span>
                  <div className="h-48 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
                    <img
                      src={result.overlay_image || result.heatmap_image}
                      alt="Grad-CAM overlay"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
                <p className="font-semibold text-white">
                  🔬 What is Grad-CAM?
                </p>
                <p>
                  <strong>Gradient-weighted Class Activation Mapping (Grad-CAM)</strong> calculates the gradients of the predicted class score flowing into the final convolutional layer of the MobileNetV2 neural network.
                </p>
                <ul className="space-y-2 pt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">🔴 Red & Orange Zones:</span>
                    <span>Represent the highest neuron activations. This is where the model detected key diagnostic features such as necrotic lesions, leaf tissue chlorosis, or fungal pustules.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold shrink-0">🔵 Blue & Dark Zones:</span>
                    <span>Represent background, healthy green leaf blades, or areas that had minimal influence on the classification output.</span>
                  </li>
                </ul>
              </div>

              {/* Scientific Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  <strong className="text-yellow-300">Agronomic Transparency Notice: </strong>
                  The Grad-CAM heatmap displays which visual regions most heavily guided the AI model's convolutional calculations. It serves as visual explanation and transparency, not definitive laboratory proof of pathogen culture. Always verify with field observation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowExplanationModal(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-xs"
              >
                Close Explanation Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
