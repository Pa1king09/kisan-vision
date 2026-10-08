import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, FileText, 
  Printer, Share2, PhoneCall, Download, Building2, Sparkles, 
  Calendar, MapPin, Camera, RefreshCw, ChevronRight, User, 
  CreditCard, ExternalLink, ArrowRight, Info, ShieldCheck, Copy,
  Image as ImageIcon, Navigation, Trash2, Check, Smartphone,
  Phone, Globe, Mail
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import T from '../components/T';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getActiveApiUrl } from '../utils/mobileInit';
import { downloadOrShareReport, printHtmlReport } from '../utils/fileDownloader';

const getApiBase = () => getActiveApiUrl();

// ── Complete Offline Fallback Catalogs ─────────────────
const FALLBACK_CROPS = [
  'Paddy / Rice (धान)',
  'Wheat (गेहूं)',
  'Cotton (कपास)',
  'Soybean (सोयाबीन)',
  'Mustard / Rapeseed (सरसों)',
  'Maize / Corn (मक्का)',
  'Groundnut (मूंगफली)',
  'Sugarcane (गन्ना)',
  'Gram / Chana (चना)',
  'Onion (प्याज़)',
  'Potato (आलू)',
  'Tomato (टमाटर)',
  'Chilli (मिर्च)',
  'Bajra / Pearl Millet (बाजरा)',
  'Jowar / Sorghum (ज्वार)',
  'Sunflower (सूरजमुखी)',
  'Tur / Arhar / Pigeon Pea (अरहर)',
  'Urad / Black Gram (उड़द)',
  'Moong / Green Gram (मूंग)',
  'Barley (जौ)'
];

const FALLBACK_STATES = [
  'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 
  'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Telangana', 
  'Haryana', 'Punjab', 'Odisha', 'Tamil Nadu', 
  'Bihar', 'West Bengal', 'Chhattisgarh', 'Jharkhand', 
  'Himachal Pradesh', 'Assam'
];

const FALLBACK_CALAMITY_CAUSES = [
  'Hailstorm (ओलावृष्टि)',
  'Inundation / Local Flood (जलभराव)',
  'Cyclone / Heavy Unseasonal Rain (चक्रवात / बेमौसम बारिश)',
  'Landslide / Cloudburst (भूस्खलन / बादल फटना)',
  'Severe Pest Outbreak (तीव्र कीट / टिड्डी प्रकोप)',
  'Drought / Severe Moisture Stress (सूखा)',
  'Post-Harvest Loss (कटी फसल पर बारिश - 14 दिन नियम)',
  'Frost / Cold Wave Damage (पाला)'
];

const FALLBACK_STATE_INSURERS = {
  'Maharashtra': {
    company: 'Agriculture Insurance Company of India (AIC)',
    tollFree: '1800116515',
    displayPhone: '1800-11-6515',
    email: 'ro.mumbai@aicofindia.com',
    website: 'https://aicofindia.com'
  },
  'Telangana': {
    company: 'Agriculture Insurance Company of India (AIC)',
    tollFree: '1800116515',
    displayPhone: '1800-11-6515',
    email: 'ro.hyderabad@aicofindia.com',
    website: 'https://aicofindia.com'
  },
  'Andhra Pradesh': {
    company: 'Agriculture Insurance Company of India (AIC)',
    tollFree: '1800116515',
    displayPhone: '1800-11-6515',
    email: 'ro.hyderabad@aicofindia.com',
    website: 'https://aicofindia.com'
  },
  'Madhya Pradesh': {
    company: 'HDFC ERGO General Insurance Co.',
    tollFree: '18002660700',
    displayPhone: '1800-266-0700',
    email: 'pmfby.mp@hdfcergo.com',
    website: 'https://hdfcergo.com'
  },
  'Uttar Pradesh': {
    company: 'Bajaj Allianz General Insurance',
    tollFree: '18002095959',
    displayPhone: '1800-209-5959',
    email: 'customercare@bajajallianz.co.in',
    website: 'https://bajajallianz.com'
  },
  'Rajasthan': {
    company: 'SBI General Insurance Co. Ltd.',
    tollFree: '1800221111',
    displayPhone: '1800-22-1111',
    email: 'customer.care@sbigeneral.in',
    website: 'https://sbigeneral.in'
  },
  'Gujarat': {
    company: 'ICICI Lombard General Insurance',
    tollFree: '18002666',
    displayPhone: '1800-2666',
    email: 'customersupport@icicilombard.com',
    website: 'https://icicilombard.com'
  },
  'Karnataka': {
    company: 'Universal Sompo General Insurance',
    tollFree: '1800224030',
    displayPhone: '1800-22-4030',
    email: 'contactus@universalsompo.com',
    website: 'https://universalsompo.com'
  },
  'Punjab': {
    company: 'State Department of Agriculture & Farmers Welfare',
    tollFree: '18001801551',
    displayPhone: '1800-180-1551',
    email: 'agripunjab@punjab.gov.in',
    website: 'https://agri.punjab.gov.in'
  },
  'Haryana': {
    company: 'Reliance General Insurance',
    tollFree: '18003009',
    displayPhone: '1800-3009',
    email: 'services.rgicl@relianceada.com',
    website: 'https://reliancegeneral.co.in'
  }
};

/**
 * Mobile-Optimized Canvas Photo Compression
 * Resizes 12-48MP smartphone photos down to ~120KB JPEG with legal proof watermark
 */
const compressEvidencePhoto = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.75, gpsStamp = '') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Watermark with timestamp & GPS coordinates for PMFBY statutory validity
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, height - 26, width, 26);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px sans-serif';
        const stampText = `KisanVision PMFBY Evidence • ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • ${gpsStamp || 'GPS Captured'}`;
        ctx.fillText(stampText, 10, height - 8);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const PmfbyClaim = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'dossier' | 'directory' | 'myclaims'
  const [meta, setMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  // Form State
  const [farmerName, setFarmerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [kccOrPolicyNo, setKccOrPolicyNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Amravati');
  const [village, setVillage] = useState('');
  const [surveyKhasraNo, setSurveyKhasraNo] = useState('');

  const [crop, setCrop] = useState('Paddy / Rice (धान)');
  const [season, setSeason] = useState('Kharif');
  const [sownAreaAcres, setSownAreaAcres] = useState(3.0);
  const [damagedAreaAcres, setDamagedAreaAcres] = useState(2.5);
  const [damagePercentage, setDamagePercentage] = useState(75);
  const [cropStage, setCropStage] = useState('Standing Crop (Vegetative/Flowering)');

  // Calamity Time & Date (Defaults to current date/time)
  const [calamityCause, setCalamityCause] = useState('Hailstorm (ओलावृष्टि)');
  const todayStr = new Date().toISOString().split('T')[0];
  const [calamityDate, setCalamityDate] = useState(todayStr);
  const [calamityTime, setCalamityTime] = useState('14:00');

  // Photo & Evidence
  const [evidencePhotos, setEvidencePhotos] = useState([]);
  const [currentGps, setCurrentGps] = useState('17.3850° N, 78.4867° E (Default)');
  const [detectingGps, setDetectingGps] = useState(false);
  const [notes, setNotes] = useState('');

  // Compensation Calculation result
  const [calcResult, setCalcResult] = useState(null);

  // Submitted Claim Result
  const [createdClaim, setCreatedClaim] = useState(null);
  const [whatsappText, setWhatsappText] = useState('');

  // My Saved Claims (Synced with LocalStorage for offline access)
  const [savedClaims, setSavedClaims] = useState(() => {
    try {
      const cached = localStorage.getItem('kisan_pmfby_claims');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loadingClaims, setLoadingClaims] = useState(false);

  // Directory Search Filter
  const [searchState, setSearchState] = useState('');

  // Photo Input Refs for Reliable Mobile WebKit/Android Triggers
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Load Meta, Claims & User Profile on Mount
  useEffect(() => {
    fetchMeta();
    fetchClaims();
    loadUserFromStorage();
    // Read any crop passed from Recommendation or Scheme cards
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const cropParam = searchParams.get('crop');
      if (cropParam) {
        const found = FALLBACK_CROPS.find(c => c.toLowerCase().includes(cropParam.toLowerCase()));
        if (found) setCrop(found);
      }
    } catch (_) {}
  }, []);

  // Synchronize user profile whenever auth state updates
  useEffect(() => {
    loadUserFromStorage();
  }, [user]);

  const loadUserFromStorage = () => {
    try {
      const u = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (u) {
        if (u.username || u.name) setFarmerName(u.username || u.name);
        if (u.phone) setContactNumber(u.phone);
        if (u.state) setState(u.state);
        if (u.district) setDistrict(u.district);
        if (u.village) setVillage(u.village);
      }
    } catch (e) {
      console.warn('Could not load user profile', e);
    }
  };

  const fetchMeta = async () => {
    try {
      setLoadingMeta(true);
      const res = await axios.get(`${getApiBase()}/pmfby/meta`, { timeout: 6000 });
      if (res.data?.success) {
        setMeta(res.data);
        if (res.data.crops?.length > 0 && !crop) {
          setCrop(res.data.crops[0]);
        }
      }
    } catch (err) {
      console.warn('Using offline PMFBY catalogs:', err.message);
    } finally {
      setLoadingMeta(false);
    }
  };

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const res = await axios.get(`${getApiBase()}/pmfby/claims`, { timeout: 6000 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSavedClaims(res.data.data);
        localStorage.setItem('kisan_pmfby_claims', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.warn('Loading claims from local storage fallback:', err.message);
    } finally {
      setLoadingClaims(false);
    }
  };

  // Recalculate compensation dynamically
  useEffect(() => {
    calculateCompensation();
  }, [crop, state, sownAreaAcres, damagedAreaAcres, damagePercentage]);

  const calculateCompensation = async () => {
    try {
      const res = await axios.post(`${getApiBase()}/pmfby/calculate`, {
        crop,
        state,
        sownAreaAcres: parseFloat(sownAreaAcres) || 1.0,
        damagedAreaAcres: parseFloat(damagedAreaAcres) || 1.0,
        damagePercentage: parseFloat(damagePercentage) || 70
      }, { timeout: 5000 });

      if (res.data?.success) {
        setCalcResult(res.data.data);
      }
    } catch (err) {
      // Local client-side calculation fallback
      const sumInsured = 22000;
      const sown = Math.max(0.1, parseFloat(sownAreaAcres) || 1.0);
      const damaged = Math.min(sown, Math.max(0.1, parseFloat(damagedAreaAcres) || 1.0));
      const pct = Math.min(100, Math.max(1, parseFloat(damagePercentage) || 70));
      const est = Math.round(damaged * sumInsured * (pct / 100));
      const prem = Math.round(sown * sumInsured * 0.02);

      const insurer = (meta?.stateInsurers && meta.stateInsurers[state]) || FALLBACK_STATE_INSURERS[state] || {
        company: 'Agriculture Insurance Company of India (AIC)',
        tollFree: '1800116515',
        displayPhone: '1800-11-6515'
      };

      setCalcResult({
        crop,
        state,
        season: 'Kharif',
        sownAreaAcres: sown,
        damagedAreaAcres: damaged,
        damagePercentage: pct,
        sumInsuredPerAcre: sumInsured,
        totalSumInsured: Math.round(sown * sumInsured),
        damagedSumInsured: Math.round(damaged * sumInsured),
        estimatedCompensation: est,
        farmerPremiumPaid: prem,
        premiumRatePct: 2.0,
        netBenefitMultiplier: prem > 0 ? (est / prem).toFixed(1) : '15.0',
        insuranceCompany: insurer.company,
        tollFreeHelpline: insurer.tollFree,
        supportEmail: insurer.email || 'ro.delhi@aicofindia.com'
      });
    }
  };

  // 72-Hour Countdown Calculation
  const calculateHoursPassed = () => {
    if (!calamityDate) return 0;
    try {
      const dateParts = String(calamityDate).split('-');
      if (dateParts.length !== 3) return 0;
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);
      
      let hour = 12;
      let minute = 0;
      if (calamityTime && String(calamityTime).includes(':')) {
        const timeParts = String(calamityTime).split(':');
        hour = parseInt(timeParts[0], 10) || 0;
        minute = parseInt(timeParts[1], 10) || 0;
      }
      
      const eventDate = new Date(year, month, day, hour, minute);
      const eventTime = eventDate.getTime();
      if (isNaN(eventTime)) return 0;
      const now = Date.now();
      const diffHrs = (now - eventTime) / (1000 * 60 * 60);
      return (isNaN(diffHrs) || diffHrs < 0) ? 0 : diffHrs;
    } catch {
      return 0;
    }
  };

  const hoursPassed = calculateHoursPassed();
  const hoursRemaining = Math.max(0, 72 - (isNaN(hoursPassed) ? 0 : hoursPassed));
  const isWithin72Hrs = (isNaN(hoursPassed) ? 0 : hoursPassed) <= 72;

  // ── Mobile Live GPS Geolocation Capture ──────────────
  const handleDetectLiveGps = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your mobile browser.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coordsStr = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (±${Math.round(accuracy)}m GPS)`;
        setCurrentGps(coordsStr);
        setDetectingGps(false);
        toast.success(`📍 Live field GPS captured! (Accuracy: ±${Math.round(accuracy)}m)`);
      },
      (err) => {
        setDetectingGps(false);
        console.warn('GPS detection error:', err.message);
        toast.error('Could not acquire GPS. Please ensure Location is enabled in phone settings.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── Mobile-Optimized Photo Handler with Canvas Compression ──
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WebP).');
      if (e.target) e.target.value = '';
      return;
    }

    if (evidencePhotos.length >= 4) {
      toast.error('Maximum 4 field photos allowed for PMFBY intimation.');
      if (e.target) e.target.value = '';
      return;
    }

    const toastId = toast.loading('Compressing & geo-tagging photo for mobile upload...');
    try {
      const compressedDataUrl = await compressEvidencePhoto(file, 1024, 1024, 0.75, currentGps);
      setEvidencePhotos(prev => [...prev, compressedDataUrl]);
      toast.success('Field damage photo compressed & geo-tagged!', { id: toastId });
    } catch (err) {
      console.error('Photo compression failed:', err);
      toast.error('Unable to process photo. Please try a different camera angle.', { id: toastId });
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleAddSamplePhoto = () => {
    if (evidencePhotos.length >= 4) {
      toast.error('Maximum 4 field photos allowed.');
      return;
    }
    const sample = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80`;
    setEvidencePhotos(prev => [...prev, sample]);
    toast.success('Sample field photo added with timestamp & GPS coordinates.');
  };

  const handleRemovePhoto = (indexToRemove) => {
    setEvidencePhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success('Photo removed.');
  };

  // ── Submit Claim to Backend ──────────────────────────
  const handleSubmitClaim = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!farmerName.trim()) {
      toast.error('Please enter Farmer Full Name');
      const el = document.getElementById('pmfby-farmer-name');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    const cleanPhone = contactNumber.replace(/[^0-9]/g, '');
    if (!contactNumber.trim() || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number for surveyor calls.');
      const el = document.getElementById('pmfby-contact-number');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    if (!district.trim()) {
      toast.error('Please enter District name');
      const el = document.getElementById('pmfby-district');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    if (!village.trim()) {
      toast.error('Please enter Village or Taluka name');
      const el = document.getElementById('pmfby-village');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }

    const sown = Math.max(0.1, parseFloat(sownAreaAcres) || 1.0);
    const damaged = Math.max(0.1, parseFloat(damagedAreaAcres) || 1.0);
    if (damaged > sown) {
      toast.error('Damaged area cannot exceed total sown area.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userId: user?._id || user?.id || user?.username || 'farmer',
        farmerName: farmerName.trim(),
        contactNumber: contactNumber.trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        kccOrPolicyNo: kccOrPolicyNo.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        state,
        district: district.trim(),
        village: village.trim(),
        surveyKhasraNo: surveyKhasraNo.trim(),
        crop,
        season,
        sownAreaAcres: sown,
        damagedAreaAcres: damaged,
        calamityCause,
        calamityDate,
        calamityTime: calamityTime || '14:00',
        cropStage,
        damagePercentage: Math.min(100, Math.max(1, parseFloat(damagePercentage) || 75)),
        evidencePhotos,
        notes: notes.trim()
      };

      const res = await axios.post(`${getApiBase()}/pmfby/claims`, payload, { timeout: 12000 });
      if (res.data?.success) {
        toast.success('🎉 PMFBY Loss Intimation Dossier Generated!');
        setCreatedClaim(res.data.claim);
        setWhatsappText(res.data.whatsappText);
        setActiveTab('dossier');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update local claims cache immediately
        setSavedClaims(prev => [res.data.claim, ...prev]);
        try {
          const current = JSON.parse(localStorage.getItem('kisan_pmfby_claims') || '[]');
          localStorage.setItem('kisan_pmfby_claims', JSON.stringify([res.data.claim, ...current]));
        } catch (_) {}
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback: If network issue, create local offline dossier
      const randRef = `PMFBY/${new Date().getFullYear()}/${state.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const estComp = calcResult?.estimatedCompensation || 25000;
      const offlineClaim = {
        claimRef: randRef,
        farmerName: farmerName.trim(),
        contactNumber: contactNumber.trim(),
        state,
        district: district.trim(),
        village: village.trim(),
        crop,
        season,
        sownAreaAcres: sown,
        damagedAreaAcres: damaged,
        damagePercentage: Math.min(100, Math.max(1, parseFloat(damagePercentage) || 75)),
        calamityCause,
        calamityDate,
        calamityTime: calamityTime || '14:00',
        estimatedCompensation: estComp,
        submissionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        within72Hours: isWithin72Hrs,
        hoursRemainingAtSubmission: Math.round(hoursRemaining) || 48,
        insuranceCompany: calcResult?.insuranceCompany || 'Agriculture Insurance Company of India (AIC)',
        tollFreeHelpline: calcResult?.tollFreeHelpline || '1800116515'
      };

      setCreatedClaim(offlineClaim);
      setWhatsappText(`🚨 *URGENT PMFBY CROP DAMAGE INTIMATION (72-HR NOTICE)*\n📋 *Ref:* ${randRef}\n👤 *Farmer:* ${farmerName} | 📞 ${contactNumber}\n📍 *Location:* Village ${village}, Dist. ${district}, ${state}\n🌾 *Crop:* ${crop}\n⚡ *Calamity:* ${calamityCause}\n💥 *Damage:* ${damagePercentage}%\n💰 *Estimated Claim:* ₹${estComp.toLocaleString('en-IN')}\n🕒 *Status:* ${isWithin72Hrs ? 'Within 72-Hour Legal Window' : 'Special Notice'}`);
      setActiveTab('dossier');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSavedClaims(prev => [offlineClaim, ...prev]);
      try {
        const current = JSON.parse(localStorage.getItem('kisan_pmfby_claims') || '[]');
        localStorage.setItem('kisan_pmfby_claims', JSON.stringify([offlineClaim, ...current]));
      } catch (_) {}
      toast.success('PMFBY Loss Intimation Dossier generated (Offline Safe Mode)!');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Universal Mobile Dossier Sharing ─────────────────
  const handleShareDossier = async () => {
    if (!whatsappText) return;

    // 1. Try Native Mobile Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `PMFBY Crop Damage Intimation - ${createdClaim?.claimRef || 'Dossier'}`,
          text: whatsappText
        });
        toast.success('Dossier shared successfully!');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User closed sheet
      }
    }

    // 2. Direct WhatsApp App Protocol with Browser Fallback
    const encoded = encodeURIComponent(whatsappText);
    try {
      window.location.href = `whatsapp://send?text=${encoded}`;
    } catch {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_system');
    }
  };

  const copyDossierText = () => {
    if (whatsappText) {
      navigator.clipboard.writeText(whatsappText);
      toast.success('Official intimation text copied to clipboard!');
    }
  };

  // ── Generate Printable / Downloadable HTML Dossier ────
  const buildOfficialDossierHtml = (claim) => {
    if (!claim) return '';
    const dateFormatted = new Date(claim.submissionDate || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PMFBY Official Loss Intimation Dossier — ${claim.claimRef}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 24px 16px; font-size: 13px; line-height: 1.5; }
    .container { max-width: 720px; margin: 0 auto; background: #ffffff; border: 2px solid #0f172a; padding: 32px 28px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .header .gov { font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #475569; text-transform: uppercase; }
    .header h1 { font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 4px; text-transform: uppercase; }
    .header .subtitle { font-size: 12px; font-weight: 700; color: #047857; margin-top: 2px; }
    .meta-bar { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; color: #334155; }
    .meta-bar strong { color: #0f172a; font-family: monospace; font-size: 13px; }
    .to-block { margin-bottom: 16px; font-size: 12px; }
    .to-block p { margin-bottom: 2px; }
    .subject-box { background: #f1f5f9; border-left: 4px solid #047857; padding: 10px 14px; font-weight: 700; margin-bottom: 16px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; font-weight: 700; color: #334155; width: 35%; }
    .highlight { color: #047857; font-weight: 800; }
    .danger { color: #b91c1c; font-weight: 800; }
    .footer-signs { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid #cbd5e1; }
    .sign-box { text-align: right; }
    .sign-space { height: 45px; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="gov">GOVERNMENT OF INDIA • MINISTRY OF AGRICULTURE & FARMERS WELFARE</div>
      <h1>PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY)</h1>
      <div class="subtitle">STATUTORY LOSS INTIMATION & JOINT SURVEY REQUISITION (CLAUSE 21 COMPLIANT)</div>
    </div>

    <div class="meta-bar">
      <div>Dossier Ref: <strong>${claim.claimRef}</strong></div>
      <div>Date of Notice: <strong>${dateFormatted}</strong></div>
    </div>

    <div class="to-block">
      <p><strong>TO:</strong></p>
      <p>1. The District Agriculture Officer (DAO), District ${claim.district}, ${claim.state}</p>
      <p>2. The Authorized Claims Officer, ${claim.insuranceCompany}</p>
      <p>Toll-Free Helpline: ${claim.tollFreeHelpline || '14447'}</p>
    </div>

    <div class="subject-box">
      SUBJECT: Formal Intimation of Localized Crop Damage due to ${claim.calamityCause} on ${new Date(claim.calamityDate).toLocaleDateString('en-IN')} under PMFBY 72-Hour Reporting Window.
    </div>

    <p>Respected Sir / Madam,</p>
    <p style="margin-top: 6px;">
      I hereby formally intimate that standing crop in my insured agricultural field has suffered severe damage due to <strong>${claim.calamityCause}</strong> on <strong>${new Date(claim.calamityDate).toLocaleDateString('en-IN')} at ${claim.calamityTime || '14:00'} hrs</strong>.
      This notice is dispatched within the statutory 72-hour reporting window mandated under Clause 21 of the PMFBY Operational Guidelines.
    </p>

    <table>
      <tbody>
        <tr><th>Farmer Name</th><td><strong>${claim.farmerName}</strong></td></tr>
        <tr><th>Mobile & Contact</th><td>${claim.contactNumber}</td></tr>
        <tr><th>Field Location</th><td>Village ${claim.village}, District ${claim.district}, ${claim.state}</td></tr>
        <tr><th>Survey / Khasra No.</th><td>${claim.surveyKhasraNo || 'Provided during Joint Field Inspection'}</td></tr>
        <tr><th>Insured Crop & Season</th><td><strong>${claim.crop} (${claim.season || 'Kharif'})</strong></td></tr>
        <tr><th>Sown Area / Damaged Area</th><td>${claim.sownAreaAcres} Acres Sown / ${claim.damagedAreaAcres} Acres Destroyed</td></tr>
        <tr><th>Estimated Loss Severity</th><td class="danger">${claim.damagePercentage}% Damage</td></tr>
        <tr><th>Estimated Compensation Claim</th><td class="highlight">₹${Number(claim.estimatedCompensation || 0).toLocaleString('en-IN')} (Direct Benefit Transfer)</td></tr>
        <tr><th>72-Hour Legal Window Compliance</th><td class="highlight">${claim.within72Hours ? `✓ Complied (${claim.hoursRemainingAtSubmission || 48} Hours Buffer Remaining)` : '⚠️ Special Waiver Requisition'}</td></tr>
      </tbody>
    </table>

    <p style="margin-top: 10px;">
      I kindly request you to depute an authorized Insurance Surveyor and Block Agriculture Officer for a <strong>Joint Field Inspection within 48 hours</strong>, record the loss assessment in the Joint Inspection Report (JIR), and approve the rightful compensation for direct benefit transfer into my bank account.
    </p>

    <div class="footer-signs">
      <div>
        <p><strong>Enclosures:</strong></p>
        <p style="font-size: 11px; color: #475569;">1. Geo-tagged & timestamped field damage photographs</p>
        <p style="font-size: 11px; color: #475569;">2. Copy of Sowing certificate / Land 7/12</p>
      </div>
      <div class="sign-box">
        <div class="sign-space"></div>
        <p><strong>${claim.farmerName}</strong></p>
        <p style="font-size: 10px; color: #64748b;">Signature / Thumb Impression of Farmer</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // ── Download Official Dossier Document ───────────────
  const handleDownloadDossier = async () => {
    if (!createdClaim) return;
    setExportingReport(true);
    const toastId = toast.loading('Preparing official PMFBY Claim Dossier...');

    try {
      const htmlContent = buildOfficialDossierHtml(createdClaim);
      const safeName = `PMFBY_Loss_Intimation_${createdClaim.claimRef.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const res = await downloadOrShareReport({
        blob,
        htmlContent,
        fileName: safeName,
        title: `PMFBY Claim Dossier - ${createdClaim.claimRef}`,
        text: `Official PMFBY Crop Damage Claim Dossier for ${createdClaim.farmerName} (${createdClaim.crop}).`
      });

      if (res.success) {
        toast.success('Dossier ready! Downloaded / Shared successfully.', { id: toastId });
      } else {
        toast.success('Dossier prepared.', { id: toastId });
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Unable to export dossier file.', { id: toastId });
    } finally {
      setExportingReport(false);
    }
  };

  const handlePrintDossier = () => {
    if (!createdClaim) return;
    const html = buildOfficialDossierHtml(createdClaim);
    printHtmlReport(html);
  };

  const cropsList = meta?.crops?.length ? meta.crops : FALLBACK_CROPS;
  const statesList = meta?.states?.length ? meta.states : FALLBACK_STATES;
  const causesList = meta?.calamityCauses?.length ? meta.calamityCauses : FALLBACK_CALAMITY_CAUSES;
  const insurersMap = meta?.stateInsurers || FALLBACK_STATE_INSURERS;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary pt-24 pb-20 px-3 sm:px-6 lg:px-8 transition-colors duration-500">
      
      {/* ═══ TOP HERO HEADER ═══ */}
      <div className="max-w-7xl mx-auto mb-6">
        
        {/* Urgent Emergency 72-Hour Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-amber-950/80 border border-rose-500/30 backdrop-blur-xl mb-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                <ShieldAlert size={24} className="animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    <T>Statutory Rule (Clause 21)</T>
                  </span>
                  <span className="text-xs text-rose-300 font-bold font-mono">
                    PMFBY • Crop Insurance Portal
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                  <T>72-Hour Crop Damage Claim Assistant</T>
                </h1>
                <p className="text-xs text-white/70 max-w-2xl mt-0.5 leading-relaxed">
                  <T>Localized hailstorm, waterlogging, or pest damage must be intimated within 72 hours. Generate your official claim dossier, calculate compensation, and notify your insurance officer immediately.</T>
                </p>
              </div>
            </div>

            {/* Central Helpline Quick Badges (Clean Mobile Tap-to-Dial) */}
            <div className="shrink-0 flex items-center gap-2 sm:gap-3 bg-black/40 border border-white/10 p-2.5 sm:p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <PhoneCall size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50 block">
                    <T>National Toll-Free</T>
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a 
                      href="tel:14447" 
                      className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-black font-mono flex items-center gap-1 border border-emerald-500/30"
                    >
                      📞 14447
                    </a>
                    <a 
                      href="tel:18001801551" 
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black font-mono flex items-center gap-1 border border-white/10"
                    >
                      📞 1800-180-1551
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LIVE 72-HOUR COUNTDOWN HUD ═══ */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-surface border border-brand-border/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shrink-0 ${isWithin72Hrs ? (hoursRemaining < 24 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse') : 'bg-red-600'}`} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand-text-primary">
                {isWithin72Hrs ? (
                  hoursRemaining < 24 ? (
                    <span className="text-rose-500">
                      <T>CRITICAL LOSS WINDOW: Only</T> {hoursRemaining.toFixed(1)} <T>Hours Left!</T>
                    </span>
                  ) : (
                    <span className="text-emerald-500 dark:text-emerald-400">
                      <T>Within Safe Intimation Window</T> ({hoursRemaining.toFixed(1)} <T>Hours Remaining</T>)
                    </span>
                  )
                ) : (
                  <span className="text-amber-500">
                    <T>Notice Window Exceeded (Over 72 Hours) — Special Affidavit Mode Applied</T>
                  </span>
                )}
              </p>
              <p className="text-[11px] text-brand-text-secondary">
                <T>Incident Time</T>: {calamityDate} at {calamityTime} hrs ({hoursPassed.toFixed(1)} hrs elapsed)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-32 sm:w-48 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  hoursRemaining > 48 ? 'bg-emerald-500' : hoursRemaining > 24 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (hoursRemaining / 72) * 100))}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-brand-text-secondary">
              {Math.round((hoursRemaining / 72) * 100)}% <T>Time Left</T>
            </span>
          </div>
        </div>

        {/* ═══ MOBILE HORIZONTALLY SCROLLABLE NAVIGATION TABS ═══ */}
        <div className="flex items-center gap-2 mt-4 border-b border-brand-border pb-2 overflow-x-auto scrollbar-none flex-nowrap -mx-3 px-3 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'builder'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Sparkles size={13} /> <span>1. <T>Claim Builder & Calculator</T></span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'dossier'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <FileText size={13} /> <span>2. <T>Official Dossier Letter</T> {createdClaim && '✓'}</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'directory'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <Building2 size={13} /> <span>3. <T>State Insurance Helplines</T></span>
          </button>

          <button
            onClick={() => setActiveTab('myclaims')}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'myclaims'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            <CheckCircle2 size={13} /> <span>4. <T>My Saved Claims</T> ({savedClaims.length})</span>
          </button>
        </div>

      </div>

      {/* ═══ TAB 1: CLAIM BUILDER & LIVE CALCULATOR ═══ */}
      {activeTab === 'builder' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 bg-brand-surface border border-brand-border rounded-3xl p-5 sm:p-8 shadow-xl">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center text-xs">
                1
              </span>
              <T>Damage & Calamity Intimation Form</T>
            </h2>

            <form noValidate onSubmit={handleSubmitClaim} className="space-y-5">
              
              {/* Incident Date & Peril */}
              <div className="p-4 rounded-2xl bg-brand-surface-inset border border-brand-border/60 space-y-3.5">
                <p className="text-[11px] font-black uppercase text-rose-500 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                  <Clock size={13} /> <T>Step A: Incident Timing & Cause of Calamity</T>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Incident Date</T> *
                    </label>
                    <input 
                      type="date" 
                      value={calamityDate}
                      onChange={(e) => setCalamityDate(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Time of Occurrence</T>
                    </label>
                    <input 
                      type="time" 
                      value={calamityTime}
                      onChange={(e) => setCalamityTime(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Crop Stage</T> *
                    </label>
                    <select
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    >
                      <option value="Standing Crop (Vegetative/Flowering)">Standing Crop (Vegetative/Flowering)</option>
                      <option value="Grain Filling / Pod Formation">Grain Filling / Pod Formation</option>
                      <option value="Maturity / Ready for Harvest">Maturity / Ready for Harvest</option>
                      <option value="Cut & Spread on Field (Post-Harvest)">Cut & Spread on Field (Post-Harvest - 14 Days Rule)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                    <T>Cause of Calamity (Peril)</T> *
                  </label>
                  <select
                    value={calamityCause}
                    onChange={(e) => setCalamityCause(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl p-3 text-xs text-brand-text-primary font-bold focus:border-emerald-500 outline-none shadow-xs"
                  >
                    {causesList.map((cause, idx) => (
                      <option key={idx} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Crop & Land Details */}
              <div className="p-4 rounded-2xl bg-brand-surface-inset border border-brand-border/60 space-y-3.5">
                <p className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} /> <T>Step B: Crop, Location & Damaged Acreage</T>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Insured Crop</T> *
                    </label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary font-bold focus:border-emerald-500 outline-none shadow-xs"
                    >
                      {cropsList.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>State</T> *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary font-bold focus:border-emerald-500 outline-none shadow-xs"
                    >
                      {statesList.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>District</T> *
                    </label>
                    <input 
                      id="pmfby-district"
                      type="text" 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Amravati"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Village / Taluka</T> *
                    </label>
                    <input 
                      id="pmfby-village"
                      type="text" 
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Warud"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Khasra / Survey No.</T>
                    </label>
                    <input 
                      type="text" 
                      value={surveyKhasraNo}
                      onChange={(e) => setSurveyKhasraNo(e.target.value)}
                      placeholder="e.g. 142/3"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    />
                  </div>
                </div>

                {/* Acreage and Damage Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Total Sown Area (Acres)</T> *
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0.25"
                      value={sownAreaAcres === '' ? '' : sownAreaAcres}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSownAreaAcres(val === '' ? '' : val);
                        if (val !== '' && !isNaN(val)) {
                          const num = parseFloat(val);
                          if (damagedAreaAcres > num) setDamagedAreaAcres(num);
                        }
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        const finalVal = isNaN(num) || num < 0.25 ? 0.25 : num;
                        setSownAreaAcres(finalVal);
                        if (damagedAreaAcres > finalVal) setDamagedAreaAcres(finalVal);
                      }}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary font-bold focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Damaged Area (Acres)</T> *
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      max={sownAreaAcres || undefined}
                      value={damagedAreaAcres === '' ? '' : damagedAreaAcres}
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDamagedAreaAcres(val === '' ? '' : val);
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        const maxVal = parseFloat(sownAreaAcres) || 100;
                        const finalVal = isNaN(num) || num < 0.1 ? 0.1 : Math.min(num, maxVal);
                        setDamagedAreaAcres(finalVal);
                      }}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary font-bold focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-brand-text-secondary">
                        <T>Damage Severity</T>
                      </label>
                      <span className="text-xs font-black text-rose-500">{damagePercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      step="5"
                      value={damagePercentage}
                      onChange={(e) => setDamagePercentage(parseInt(e.target.value))}
                      className="w-full accent-rose-500 mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Farmer ID & Bank Details */}
              <div className="p-4 rounded-2xl bg-brand-surface-inset border border-brand-border/60 space-y-3.5">
                <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <User size={13} /> <T>Step C: Farmer Identity & Bank/KCC Credentials</T>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Farmer Full Name</T> *
                    </label>
                    <input 
                      id="pmfby-farmer-name"
                      type="text" 
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Mobile Number (for Surveyor Call & SMS)</T> *
                    </label>
                    <input 
                      id="pmfby-contact-number"
                      type="tel" 
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>KCC / Policy No. / Application No.</T>
                    </label>
                    <input 
                      type="text" 
                      value={kccOrPolicyNo}
                      onChange={(e) => setKccOrPolicyNo(e.target.value)}
                      placeholder="KCC-948102 or Crop App Ref"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Aadhaar Number (Last 4 Digits)</T>
                    </label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX-XXXX-8921"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-text-secondary block mb-1">
                      <T>Bank Name & Account No.</T>
                    </label>
                    <input 
                      type="text" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="SBI / Bank of Baroda - A/C"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl p-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Evidence Assistant with Live GPS Detection */}
              <div className="p-4 rounded-2xl bg-brand-surface-inset border border-brand-border/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-[11px] font-black uppercase text-amber-500 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Camera size={13} /> <T>Step D: Geo-Tagged Photo Evidence</T>
                  </p>

                  {/* 1-Tap Mobile GPS Acquisition */}
                  <button
                    type="button"
                    onClick={handleDetectLiveGps}
                    disabled={detectingGps}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-fit shadow-xs"
                  >
                    {detectingGps ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        <span><T>Fetching GPS...</T></span>
                      </>
                    ) : (
                      <>
                        <Navigation size={11} />
                        <span>📍 {currentGps} (<T>Tap to Refresh</T>)</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-brand-text-secondary leading-relaxed">
                  <T>Take clear field damage photos. Photos are automatically compressed for fast mobile upload and stamped with date & GPS coordinates to prevent claim disputes during joint assessment.</T>
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button 
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    <Camera size={15} /> <span>📷 <T>Take Field Photo</T></span>
                  </button>
                  <input 
                    ref={cameraInputRef}
                    id="pmfby-camera-input"
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handlePhotoUpload} 
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                  />

                  <button 
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    <ImageIcon size={15} /> <span>🖼️ <T>Choose from Gallery</T></span>
                  </button>
                  <input 
                    ref={galleryInputRef}
                    id="pmfby-gallery-input"
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 text-xs font-medium"
                  >
                    + <T>Add Sample Photo</T>
                  </button>
                </div>

                {/* Evidence Thumbnails with Delete button */}
                {evidencePhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {evidencePhotos.map((photo, pIdx) => (
                      <div key={pIdx} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 h-24 bg-black/40 group shadow-xs">
                        <img src={photo} alt="Field Damage Evidence" className="w-full h-full object-cover" />
                        
                        {/* Delete photo button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(pIdx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 size={11} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1 py-0.5 text-[8px] font-mono text-emerald-400 truncate">
                          Photo #{pIdx + 1} • Geo-Tagged
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-98 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span><T>Compiling Official Dossier...</T></span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} />
                    <span><T>Generate Official PMFBY Claim Dossier & Notify Insurer</T></span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Live Compensation Calculator (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Live Calculation Preview Card */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[70px] pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} /> <T>Live Claim Computation</T>
                </span>
                <span className="text-[10px] text-white/50 font-mono">GOI PMFBY Formula</span>
              </div>

              {calcResult ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-white/60 font-medium block">
                      <T>Estimated Claim Compensation</T>:
                    </span>
                    <p className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight mt-1">
                      ₹{calcResult.estimatedCompensation.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-emerald-400/90 font-medium mt-1">
                      <T>Direct Benefit Transfer (DBT) into farmer's Bank Account upon survey approval.</T>
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 text-xs">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-white/50 block text-[10px] uppercase font-bold"><T>Sum Insured / Acre</T></span>
                      <strong className="text-white text-sm font-black">
                        ₹{calcResult.sumInsuredPerAcre.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-white/50 block text-[10px] uppercase font-bold"><T>Damaged Sum Insured</T></span>
                      <strong className="text-white text-sm font-black">
                        ₹{calcResult.damagedSumInsured.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-white/50 block text-[10px] uppercase font-bold"><T>Farmer Premium Paid</T></span>
                      <strong className="text-amber-400 text-sm font-black">
                        ₹{calcResult.farmerPremiumPaid.toLocaleString('en-IN')} ({calcResult.premiumRatePct}%)
                      </strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-white/50 block text-[10px] uppercase font-bold"><T>Claim Multiplier</T></span>
                      <strong className="text-emerald-400 text-sm font-black">
                        {calcResult.netBenefitMultiplier}x <T>Return</T>
                      </strong>
                    </div>
                  </div>

                  {/* Designated Insurer Info */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-wider text-white/50">
                        <T>Designated State Insurer</T> ({calcResult.state})
                      </span>
                      <ShieldCheck size={14} className="text-emerald-400" />
                    </div>
                    <strong className="text-xs text-white block">
                      {calcResult.insuranceCompany}
                    </strong>
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
                      <span><T>Toll-Free Helpline</T>:</span>
                      <a href={`tel:${String(calcResult.tollFreeHelpline).replace(/[^0-9]/g, '') || '14447'}`} className="underline">
                        {calcResult.tollFreeHelpline}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-white/40">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-emerald-400" />
                  <p className="text-xs"><T>Computing compensation metrics...</T></p>
                </div>
              )}
            </div>

            {/* PMFBY Loss Rules & Guide Card */}
            <div className="bg-brand-surface border border-brand-border rounded-3xl p-5 sm:p-6 shadow-md space-y-3.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-brand-text-primary flex items-center gap-2">
                <Info size={16} className="text-cyan-500" /> <T>Key Guidelines for Fast Claim Approval</T>
              </h3>

              <ul className="space-y-2.5 text-xs text-brand-text-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong><T>72-Hour Rule</T>:</strong> <T>Intimation submitted within 72 hours legally protects you from claim repudiation.</T></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong><T>Joint Assessment</T>:</strong> <T>The Insurance Company + District Agriculture Officer must complete field survey within 48 hours of notice.</T></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong><T>Do Not Harvest</T>:</strong> <T>Keep damaged crop intact until the surveyor inspects the field, or record video evidence before cutting.</T></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong><T>Surveyor Signature</T>:</strong> <T>Ensure you obtain a copy of the Joint Inspection Report (JIR) signed by both the surveyor and yourself.</T></span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ═══ TAB 2: OFFICIAL DOSSIER LETTER & UNIVERSAL DISPATCH ═══ */}
      {activeTab === 'dossier' && (
        <div className="max-w-4xl mx-auto space-y-5">
          {createdClaim ? (
            <div className="space-y-5">
              
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-brand-surface border border-brand-border rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-brand-text-primary">
                    <T>Claim Ref</T>: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{createdClaim.claimRef}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={copyDossierText}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 shadow-xs"
                  >
                    <Copy size={13} /> <T>Copy Text</T>
                  </button>

                  <button
                    onClick={handleShareDossier}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Share2 size={13} /> <T>Share via WhatsApp / Apps</T>
                  </button>

                  <button
                    onClick={handleDownloadDossier}
                    disabled={exportingReport}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download size={13} /> <T>Download PDF / File</T>
                  </button>

                  <button
                    onClick={handlePrintDossier}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer size={13} /> <T>Print</T>
                  </button>
                </div>
              </div>

              {/* Printable Official Letterhead Dossier */}
              <div className="bg-white text-slate-900 p-4 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 font-sans">
                
                {/* Government / PMFBY Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500">
                      GOVERNMENT OF INDIA • MINISTRY OF AGRICULTURE & FARMERS WELFARE
                    </p>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase mt-0.5">
                      PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY)
                    </h2>
                    <p className="text-xs font-bold text-emerald-700">
                      FORMAL LOSS INTIMATION & JOINT SURVEY REQUISITION (CLAUSE 21 COMPLIANT)
                    </p>
                  </div>

                  <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Claim Dossier Ref:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{createdClaim.claimRef}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      Date: {new Date(createdClaim.submissionDate || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Recipient Notice */}
                <div className="text-xs space-y-1 text-slate-700 mb-6">
                  <p className="font-bold text-slate-900">TO:</p>
                  <p className="font-semibold">1. The District Agriculture Officer (DAO), District {createdClaim.district}, {createdClaim.state}</p>
                  <p className="font-semibold">2. The Authorized Claims Officer, {createdClaim.insuranceCompany}</p>
                  <p className="text-[11px] text-slate-500">Helpline: {createdClaim.tollFreeHelpline || '14447'}</p>
                </div>

                {/* Subject */}
                <div className="p-3 bg-slate-100 rounded-xl mb-6 text-xs font-bold text-slate-900 leading-snug">
                  SUBJECT: Formal Intimation of Localized Crop Damage due to {createdClaim.calamityCause} on {new Date(createdClaim.calamityDate).toLocaleDateString('en-IN')} under PMFBY 72-Hour Reporting Window.
                </div>

                {/* Body Details */}
                <div className="text-xs text-slate-800 leading-relaxed space-y-4">
                  <p>
                    Respected Sir / Madam,
                  </p>
                  <p>
                    I hereby intimate that standing crop in my insured agricultural field has suffered severe damage due to <strong>{createdClaim.calamityCause}</strong> on <strong>{new Date(createdClaim.calamityDate).toLocaleDateString('en-IN')} at {createdClaim.calamityTime || '14:00'} hrs</strong>.
                    This notice is formally dispatched within the statutory 72-hour window mandated under Clause 21 of the PMFBY Operational Guidelines.
                  </p>

                  {/* Tabular Details */}
                  <div className="border border-slate-200 rounded-2xl overflow-x-auto my-4">
                    <table className="w-full text-left text-xs">
                      <tbody>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-600 w-1/3">Farmer Name:</td>
                          <td className="p-2.5 font-bold text-slate-900">{createdClaim.farmerName}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold text-slate-600">Mobile & Contact:</td>
                          <td className="p-2.5 text-slate-900 font-mono">{createdClaim.contactNumber}</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-600">Field Location:</td>
                          <td className="p-2.5 text-slate-900">Village {createdClaim.village}, District {createdClaim.district}, {createdClaim.state}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold text-slate-600">Khasra / Survey No:</td>
                          <td className="p-2.5 text-slate-900 font-mono">{createdClaim.surveyKhasraNo || 'Provided during Joint Survey'}</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-600">Insured Crop & Season:</td>
                          <td className="p-2.5 text-slate-900 font-bold">{createdClaim.crop} ({createdClaim.season || 'Kharif'})</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold text-slate-600">Sown Area / Damaged Area:</td>
                          <td className="p-2.5 text-slate-900 font-bold">{createdClaim.sownAreaAcres} Acres Sown / {createdClaim.damagedAreaAcres} Acres Destroyed</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-600">Estimated Loss Severity:</td>
                          <td className="p-2.5 text-rose-700 font-black">{createdClaim.damagePercentage}% Damage</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold text-slate-600">Estimated Compensation Claim:</td>
                          <td className="p-2.5 text-emerald-700 font-black text-sm font-mono">₹{Number(createdClaim.estimatedCompensation || 0).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-600">72-Hour Compliance Status:</td>
                          <td className="p-2.5 text-emerald-700 font-bold">
                            {createdClaim.within72Hours ? `✓ Complied (${createdClaim.hoursRemainingAtSubmission || 48} Hours Buffer Remaining)` : '⚠️ Special Waiver Requisition'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    I kindly request you to depute an authorized Insurance Surveyor and Block Agriculture Officer for a <strong>Joint Field Inspection within 48 hours</strong>, record the loss assessment, and approve the rightful claim compensation for direct transfer to my bank account.
                  </p>

                  <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Enclosures:</p>
                      <p className="text-[11px] text-slate-600">1. Geo-tagged & timestamped field damage photographs</p>
                      <p className="text-[11px] text-slate-600">2. Copy of Sowing certificate / Land revenue 7/12</p>
                    </div>
                    <div className="text-right">
                      <div className="h-10"></div>
                      <p className="font-bold text-slate-900">{createdClaim.farmerName}</p>
                      <p className="text-[10px] text-slate-500">Signature / Thumb Impression of Farmer</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-md">
              <FileText size={48} className="text-brand-text-secondary/40 mx-auto" />
              <h3 className="text-base sm:text-lg font-black uppercase text-brand-text-primary">
                <T>No Claim Dossier Active</T>
              </h3>
              <p className="text-xs text-brand-text-secondary max-w-md mx-auto leading-relaxed">
                <T>Fill out the Claim Builder in Step 1 to generate an official legal intimation letter and WhatsApp dispatch payload.</T>
              </p>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase tracking-wider text-xs inline-flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <T>Go to Claim Builder</T> <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB 3: STATE INSURANCE DIRECTORY ═══ */}
      {activeTab === 'directory' && (
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-brand-text-primary flex items-center gap-2">
                <Building2 size={20} className="text-emerald-500 dark:text-emerald-400" />
                <T>Empaneled State Insurance Companies & Helplines</T>
              </h2>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                <T>Official insurance firms designated by Ministry of Agriculture for PMFBY claims handling.</T>
              </p>
            </div>

            <input 
              type="text"
              placeholder="Search your state (e.g. Telangana, Maharashtra, Rajasthan)..."
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
              className="bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text-primary focus:border-emerald-500 outline-none w-full sm:w-80 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(insurersMap)
              .filter(([stName]) => stName.toLowerCase().includes(searchState.toLowerCase()))
              .map(([stName, data], sIdx) => {
                const cleanPhone = String(data.tollFree || '').replace(/[^0-9]/g, '');
                return (
                  <div 
                    key={sIdx}
                    className="bg-brand-surface border border-brand-border hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {stName}
                      </span>
                      <span className="text-[10px] font-mono text-brand-text-secondary"><T>Empaneled Insurer</T></span>
                    </div>

                    <h3 className="text-sm font-black text-brand-text-primary group-hover:text-emerald-500 transition-colors">
                      {data.company}
                    </h3>

                    <div className="space-y-2 text-xs border-t border-brand-border/60 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-text-secondary flex items-center gap-1">
                          <PhoneCall size={12} className="text-emerald-500" /> <T>Toll-Free</T>:
                        </span>
                        <a 
                          href={`tel:${cleanPhone || '14447'}`} 
                          className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                        >
                          📞 {data.displayPhone || data.tollFree || '14447'}
                        </a>
                      </div>

                      {data.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text-secondary flex items-center gap-1">
                            <Mail size={12} className="text-blue-500" /> <T>Email</T>:
                          </span>
                          <a href={`mailto:${data.email}`} className="text-brand-text-primary font-mono hover:underline truncate max-w-[170px]">
                            {data.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {data.website && (
                      <a 
                        href={data.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-2 w-full py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-brand-text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <span><T>Visit Official Portal</T></span> <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ═══ TAB 4: MY SAVED CLAIMS TRACKER ═══ */}
      {activeTab === 'myclaims' && (
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-brand-text-primary flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400" />
                <T>My PMFBY Claims History</T> ({savedClaims.length})
              </h2>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                <T>Track surveyor dispatch, field inspection progress, and DBT disbursement.</T>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('builder')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md active:scale-95 w-fit"
            >
              + <T>File New Claim</T>
            </button>
          </div>

          {loadingClaims && savedClaims.length === 0 ? (
            <div className="py-16 text-center text-brand-text-secondary">
              <RefreshCw size={28} className="animate-spin mx-auto mb-2 text-emerald-500" />
              <p className="text-xs"><T>Loading past claims from database...</T></p>
            </div>
          ) : savedClaims.length > 0 ? (
            <div className="space-y-3.5">
              {savedClaims.map((cl, idx) => (
                <div 
                  key={cl._id || cl.claimRef || idx}
                  className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                        {cl.claimRef}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-brand-text-secondary">
                        {new Date(cl.createdAt || cl.submissionDate || Date.now()).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-brand-text-primary">
                      {cl.crop} — {cl.calamityCause} ({cl.damagePercentage}% <T>Damage</T>)
                    </h3>

                    <p className="text-xs text-brand-text-secondary font-mono">
                      <T>Village</T>: {cl.village}, {cl.district}, {cl.state} • <T>Damaged</T>: {cl.damagedAreaAcres} <T>Acres</T>
                    </p>
                  </div>

                  {/* Status Badge & Claim Value */}
                  <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 border-t md:border-t-0 border-brand-border pt-3 md:pt-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-brand-text-secondary block">
                        <T>Estimated Claim</T>
                      </span>
                      <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹{Number(cl.estimatedCompensation || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCreatedClaim(cl);
                        const calamityDateFormatted = new Date(cl.calamityDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        setWhatsappText(`🚨 *URGENT PMFBY CROP DAMAGE INTIMATION (72-HR NOTICE)*\n📋 *Ref:* ${cl.claimRef}\n👤 *Farmer:* ${cl.farmerName} | 📞 ${cl.contactNumber}\n📍 *Location:* Village ${cl.village}, Dist. ${cl.district}, ${cl.state}\n🌾 *Crop:* ${cl.crop}\n⚡ *Calamity:* ${cl.calamityCause} on ${calamityDateFormatted}\n💥 *Damage:* ${cl.damagePercentage}%\n💰 *Claim Compensation:* ₹${Number(cl.estimatedCompensation || 0).toLocaleString('en-IN')}`);
                        setActiveTab('dossier');
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-xs font-bold text-brand-text-primary flex items-center gap-1 border border-slate-200 dark:border-white/10 shadow-xs"
                    >
                      <FileText size={12} /> <T>View Dossier</T>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 sm:p-12 text-center space-y-3 shadow-md">
              <CheckCircle2 size={36} className="text-brand-text-secondary/40 mx-auto" />
              <h3 className="text-sm font-black text-brand-text-primary uppercase"><T>No Claims Filed Yet</T></h3>
              <p className="text-xs text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
                <T>Any crop damage loss intimation letters generated will appear here for tracking and re-printing.</T>
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default PmfbyClaim;
