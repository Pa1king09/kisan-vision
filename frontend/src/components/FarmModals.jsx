import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, MapPin, Compass, Layers, Check, Trash2, Undo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import LocationSearch from './LocationSearch';
import { useLanguage } from '../context/LanguageContext';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const OUTCOMES = ['Good Yield', 'Average', 'Poor'];

// Geodesic Shoelace calculation to compute exact field acreage from map boundary polygon
function calculatePolygonAcres(coords) {
  if (!coords || coords.length < 3) return 0;
  const R = 6378137; // Earth radius in meters
  let area = 0;
  const len = coords.length;
  const avgLat = (coords.reduce((sum, c) => sum + c[0], 0) / len) * (Math.PI / 180);
  for (let i = 0; i < len; i++) {
    const j = (i + 1) % len;
    const xi = coords[i][1] * (Math.PI / 180) * R * Math.cos(avgLat);
    const yi = coords[i][0] * (Math.PI / 180) * R;
    const xj = coords[j][1] * (Math.PI / 180) * R * Math.cos(avgLat);
    const yj = coords[j][0] * (Math.PI / 180) * R;
    area += (xi * yj) - (xj * yi);
  }
  const sqMeters = Math.abs(area) / 2;
  const acres = sqMeters / 4046.8564224;
  return Math.round(acres * 100) / 100;
}

const vertexPointIcon = L.divIcon({
  className: '',
  html: `<div style="background:#00FF88;width:12px;height:12px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 8px #00FF88;cursor:pointer;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [center, map]);
  return null;
}

const Backdrop = ({ children, onClose, maxWidth = 'max-w-md' }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`bg-brand-surface-elevated border border-brand-border/60 rounded-3xl shadow-premium w-full ${maxWidth} max-h-[92vh] overflow-y-auto text-brand-text-primary`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

export const AddFieldModal = ({ open, onClose, onSave }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [soilType, setSoilType] = useState('Loamy');
  const [area, setArea] = useState('');

  // Map Border & Locating State
  const [showMap, setShowMap] = useState(false);
  const [boundary, setBoundary] = useState([]); // [[lat, lng], [lat, lng], ...]
  const [mapCenter, setMapCenter] = useState([17.9784, 79.5941]);
  const [mapLayer, setMapLayer] = useState('hybrid');

  const handleLocationSelect = ({ district: d, state: s, lat, lon }) => {
    setDistrict(d);
    setState(s);
    if (lat && lon) {
      const p = [parseFloat(lat), parseFloat(lon)];
      setMapCenter(p);
    }
  };

  const handleMapClick = async (lat, lon) => {
    const newPoint = [lat, lon];
    const newBoundary = [...boundary, newPoint];
    setBoundary(newBoundary);
    setMapCenter(newPoint);

    // Auto-calculate exact acreage when 3 or more points form a closed border
    if (newBoundary.length >= 3) {
      const calculatedAcres = calculatePolygonAcres(newBoundary);
      if (calculatedAcres > 0) {
        setArea(calculatedAcres.toString());
        toast.success(`Border updated: ${newBoundary.length} corners (~${calculatedAcres} acres)`);
      }
    } else {
      toast(`Corner ${newBoundary.length} placed. Need ${3 - newBoundary.length} more to close border.`, { icon: '📍' });
    }

    // Auto reverse geocode district & state from first boundary point
    if (boundary.length === 0) {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`, {
          headers: { 'User-Agent': 'AGRO.XAI/1.0 (farm field mapper)' },
          timeout: 5000
        });
        const addr = res.data?.address || {};
        const d = addr.county || addr.state_district || addr.district || addr.city || addr.town || addr.village || '';
        const s = addr.state || '';
        if (d) setDistrict(d.replace(' District', ''));
        if (s) setState(s);
      } catch {}
    }
  };

  const handleClearBorder = () => {
    setBoundary([]);
    toast('Field border cleared. Click corners on map to redraw.', { icon: '🧹' });
  };

  const handleUndoPoint = () => {
    if (boundary.length === 0) return;
    const updated = boundary.slice(0, -1);
    setBoundary(updated);
    if (updated.length >= 3) {
      setArea(calculatePolygonAcres(updated).toString());
    }
  };

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      toast.error('GPS is not supported by your browser');
      return;
    }
    toast('Detecting GPS location...', { icon: '🧭' });
    navigator.geolocation.getCurrentPosition(
      pos => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(p);
        handleMapClick(p[0], p[1]);
      },
      () => toast.error('Could not get GPS position')
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const centerLat = boundary.length ? boundary[0][0] : undefined;
    const centerLon = boundary.length ? boundary[0][1] : undefined;

    onSave({
      id: Date.now().toString(),
      name: name.trim(),
      district, state, soilType,
      area: parseFloat(area) || 0,
      latitude: centerLat,
      longitude: centerLon,
      coordinates: centerLat ? { lat: centerLat, lon: centerLon } : null,
      boundary: boundary,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setName(''); setDistrict(''); setState(''); setSoilType('Loamy'); setArea(''); setBoundary([]); setShowMap(false);
    onClose();
  };

  const currentAcres = calculatePolygonAcres(boundary);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose} maxWidth="max-w-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('addNewField').replace('+ ', '')}</h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">Define your farm field & mark its boundary border on satellite land.</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Field Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North Field / Main Paddy Plot"
                  className="w-full px-4 py-3 mt-1 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
              </div>

              {/* Location Search + Map Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Location & Land Border</label>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className={`text-[11px] px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                      showMap
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-brand-surface-inset border-brand-border text-brand-text-secondary hover:text-white'
                    }`}
                  >
                    <MapPin size={12} className="text-emerald-400" />
                    {showMap ? 'Hide Map' : '🗺️ Select Field Border on Map'}
                  </button>
                </div>
                <div className="mt-1">
                  <LocationSearch onSelect={handleLocationSelect} placeholder="Search district or town to zoom in..." />
                </div>
              </div>

              {/* Interactive Land Border Selector */}
              {showMap && (
                <div className="rounded-2xl overflow-hidden border border-brand-border/60 bg-gray-950 p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs px-1 flex-wrap gap-2">
                    <span className="text-[11px] text-emerald-400 font-medium">
                      {boundary.length === 0 && '🖱️ Click 3+ points on land to draw field border'}
                      {boundary.length > 0 && boundary.length < 3 && `📍 Placed ${boundary.length} corner(s). Click ${3 - boundary.length} more to close border`}
                      {boundary.length >= 3 && `✅ Border Marked: ${boundary.length} corners • ~${currentAcres} Acres`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {boundary.length > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={handleUndoPoint}
                            className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300 border border-gray-700 hover:text-white flex items-center gap-1"
                            title="Undo last corner"
                          >
                            <Undo size={10} /> Undo
                          </button>
                          <button
                            type="button"
                            onClick={handleClearBorder}
                            className="px-2 py-0.5 rounded bg-red-500/20 text-[10px] text-red-400 border border-red-500/40 hover:bg-red-500/30 flex items-center gap-1"
                            title="Clear all points"
                          >
                            <Trash2 size={10} /> Clear
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setMapLayer(mapLayer === 'hybrid' ? 'streets' : 'hybrid')}
                        className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300 border border-gray-700 hover:text-white flex items-center gap-1"
                      >
                        <Layers size={10} /> {mapLayer === 'hybrid' ? '🛰️ Satellite' : '🗺️ Streets'}
                      </button>
                      <button
                        type="button"
                        onClick={handleGpsLocate}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center gap-1 font-semibold"
                      >
                        <Compass size={10} /> GPS
                      </button>
                    </div>
                  </div>

                  <div className="h-60 w-full rounded-xl overflow-hidden relative border border-gray-800">
                    <MapContainer
                      center={mapCenter}
                      zoom={15}
                      style={{ width: '100%', height: '100%' }}
                      className="z-0"
                    >
                      <MapRecenter center={mapCenter} />
                      <TileLayer
                        url={
                          mapLayer === 'hybrid'
                            ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                        attribution="&copy; Google / OSM"
                        maxZoom={21}
                      />
                      <MapClickHandler onLocationSelect={handleMapClick} />

                      {/* In-progress line while clicking corners */}
                      {boundary.length >= 2 && boundary.length < 3 && (
                        <Polygon
                          positions={boundary}
                          pathOptions={{ color: '#FBBF24', weight: 2, dashArray: '6,6', fillOpacity: 0 }}
                        />
                      )}

                      {/* Complete closed field boundary border */}
                      {boundary.length >= 3 && (
                        <Polygon
                          positions={boundary}
                          pathOptions={{
                            color: '#00FF88',
                            fillColor: '#10B981',
                            fillOpacity: 0.25,
                            weight: 3,
                            opacity: 1,
                            lineJoin: 'round',
                            lineCap: 'round',
                          }}
                        />
                      )}

                      {/* Corner vertex dots */}
                      {boundary.map((pos, idx) => (
                        <Marker key={idx} position={pos} icon={vertexPointIcon} />
                      ))}
                    </MapContainer>

                    {/* Quick Hint Overlay */}
                    {boundary.length < 3 && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[400] bg-black/75 backdrop-blur text-[11px] text-white px-3 py-1.5 rounded-full border border-white/10 pointer-events-none shadow-md">
                        👆 Click corners around your land to draw field border
                      </div>
                    )}
                  </div>

                  {boundary.length >= 3 && (
                    <div className="text-[11px] text-emerald-400 font-mono px-1 flex items-center justify-between">
                      <span>📐 Calculated Area: <strong className="text-white">{currentAcres} Acres</strong></span>
                      <span className="text-gray-400 text-[10px]">Auto-filled into Area field below</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">District</label>
                  <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District"
                    className="w-full px-4 py-3 mt-1 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">State</label>
                  <input value={state} onChange={e => setState(e.target.value)} placeholder="State"
                    className="w-full px-4 py-3 mt-1 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Soil Type</label>
                  <div className="relative mt-1">
                    <select value={soilType} onChange={e => setSoilType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{t(s.toLowerCase() + 'Soil')}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Area (Acres)</label>
                    {boundary.length >= 3 && (
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">📐 From Map Border</span>
                    )}
                  </div>
                  <input type="number" step="0.01" value={area} onChange={e => setArea(e.target.value)}
                    onFocus={e => e.target.select()}
                    onClick={e => e.target.select()}
                    placeholder="0"
                    className="w-full px-4 py-3 mt-1 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>

              <button onClick={handleSave}
                className="w-full mt-3 py-4 bg-brand-primary text-slate-950 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
                {t('saveFieldBtn')}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export const LogCropModal = ({ open, onClose, onSave, fields }) => {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [season, setSeason] = useState('Kharif');
  const [year, setYear] = useState(new Date().getFullYear());
  const [outcome, setOutcome] = useState('Good Yield');

  // Reset/Sync state when modal opens
  React.useEffect(() => {
    if (open) {
      setCropName('');
      if (fields.length > 0) {
        // If current fieldName is invalid or empty, set to first field
        if (!fieldName || !fields.find(f => f.name === fieldName)) {
          setFieldName(fields[0].name);
        }
      } else {
        setFieldName('');
      }
    }
  }, [open, fields]);

  const handleSave = () => {
    if (!cropName.trim()) {
      toast.error('Please enter a crop name');
      return;
    }
    if (!fieldName) {
      toast.error('Please select a field');
      return;
    }
    onSave({ id: Date.now().toString(), cropName: cropName.trim(), fieldName, season, year: parseInt(year), outcome });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('logPastCrop')}</h3>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Crop Name</label>
                <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Wheat"
                  className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Field</label>
                <div className="relative mt-1.5">
                  <select value={fieldName} onChange={e => setFieldName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                    {fields.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Season</label>
                  <div className="relative mt-1.5">
                    <select value={season} onChange={e => setSeason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                      {SEASONS.map(s => <option key={s} value={s}>{t(s.toLowerCase())}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Year</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)}
                    onFocus={e => e.target.select()}
                    onClick={e => e.target.select()}
                    className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Outcome</label>
                <div className="relative mt-1.5">
                  <select value={outcome} onChange={e => setOutcome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                    {OUTCOMES.map(o => {
                      const key = o === 'Good Yield' ? 'goodYield' : o === 'Average' ? 'averageYield' : 'poorYield';
                      return <option key={o} value={o}>{t(key)}</option>;
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full mt-4 py-4 bg-brand-primary text-slate-950 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
                {t('logCropBtn')}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export const SelectFarmModal = ({ open, onClose, fields, onSelect }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">Select Farm to Analyze</h3>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-brand-text-secondary mb-4">No fields added yet.</p>
                <button onClick={onClose} className="py-2 px-4 bg-brand-primary text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest">
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {fields.map(f => (
                  <button
                    key={f.id || f._id}
                    onClick={() => {
                      onSelect(f);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-primary hover:bg-brand-surface-inset transition-all group flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-black text-brand-text-primary uppercase">{f.name}</p>
                      <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mt-1">
                        {f.district}{f.district && f.state ? ', ' : ''}{f.state} · {f.soilType}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-brand-surface-elevated border border-brand-border flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-slate-950 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
