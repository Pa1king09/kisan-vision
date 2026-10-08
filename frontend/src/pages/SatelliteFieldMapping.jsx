import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Satellite, Layers, MapPin, RefreshCw, AlertCircle, CheckCircle2, 
  TrendingUp, Sparkles, Eye, Info, ChevronRight, Activity, ShieldCheck 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import { getActiveApiUrl } from '../utils/mobileInit';

const API = getActiveApiUrl();

// Fix Leaflet default icon path in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle clicks on the map to add polygon boundary points
function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Recenter helper component
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function SatelliteFieldMapping() {
  const [coordinates, setCoordinates] = useState([]);
  const [mapType, setMapType] = useState('google_hybrid'); // google_hybrid | google_satellite | esri_satellite | openstreet
  const [loading, setLoading] = useState(false);
  const [ndviData, setNdviData] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('Rice (Paddy)');
  const [center, setCenter] = useState([17.9784, 79.5941]); // Default to Warangal, Telangana

  // Load preset sample farms on mount
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(`${API}/satellite-samples`);
        if (res.data?.data) {
          setSamples(res.data.data);
          loadSampleFarm(res.data.data[0]);
        }
      } catch (e) {
        console.warn('Could not load samples:', e);
      }
    };
    fetchSamples();
  }, []);

  const loadSampleFarm = (farm) => {
    if (!farm) return;
    setCenter(farm.center);
    setCoordinates(farm.defaultPolygon);
    setSelectedCrop(farm.crop);
    fetchNdvi(farm.defaultPolygon, farm.crop, farm.name);
  };

  const handleMapClick = (latlng) => {
    if (coordinates.length >= 8) {
      toast('Maximum 8 boundary points allowed for boundary precision', { icon: 'ℹ️' });
      return;
    }
    const newCoords = [...coordinates, latlng];
    setCoordinates(newCoords);
    if (newCoords.length >= 3) {
      fetchNdvi(newCoords, selectedCrop, 'Custom Drawn Field');
    }
  };

  const clearBoundary = () => {
    setCoordinates([]);
    setNdviData(null);
    toast('Boundary cleared. Click on the map to draw new boundary points.', { icon: '🧹' });
  };

  const fetchNdvi = async (coords, crop, fieldName) => {
    if (!coords || coords.length < 3) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/satellite-ndvi`, {
        coordinates: coords,
        crop: crop || selectedCrop,
        field_name: fieldName || 'My Field'
      });
      setNdviData(res.data.data);
    } catch {
      toast.error('Failed to analyze satellite imagery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // High-resolution tile layers
  const TILE_LAYERS = {
    google_hybrid: {
      label: '🛰️ Google Hybrid (Best)',
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 21,
    },
    google_satellite: {
      label: '🌍 Google Satellite',
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps',
      maxZoom: 21,
    },
    esri_satellite: {
      label: '🗺️ ESRI World Imagery',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 19,
    },
    openstreet: {
      label: '📌 OpenStreetMap (Roads)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    },
  };

  const activeTile = TILE_LAYERS[mapType] || TILE_LAYERS.google_hybrid;

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Satellite size={14} className="animate-spin text-emerald-400" style={{ animationDuration: '12s' }} />
            Satellite Field Mapping & NDVI Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Precision Crop Health & Vegetation Index
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Draw your farm boundary directly on high-resolution Sentinel-2 satellite imagery. Compute multispectral NDVI (Normalized Difference Vegetation Index) heatmaps to identify moisture stress, chlorophyll vigor, and crop anomalies.
          </p>
        </motion.div>

        {/* Controls Toolbar */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sample Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">📍 Sample Estates:</span>
              <select
                onChange={(e) => {
                  const s = samples.find(x => x.id === e.target.value);
                  if (s) loadSampleFarm(s);
                }}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
              >
                {samples.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.crop})</option>
                ))}
              </select>
            </div>

            {/* Map Layer Switcher */}
            <div className="flex items-center gap-2">
              <Layers size={13} className="text-emerald-400 shrink-0" />
              <select
                value={mapType}
                onChange={e => setMapType(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                  <option key={key} value={key}>{layer.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Boundary: <span className="text-emerald-400 font-bold">{coordinates.length}</span> points {coordinates.length >= 3 ? '(Complete Polygon)' : '(Click 3+ points on map)'}
            </span>
            <button
              onClick={clearBoundary}
              className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all"
            >
              Clear Boundary
            </button>
          </div>
        </div>

        {/* Map + Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interactive Map (7 cols) */}
          <div className="lg:col-span-7 bg-gray-800/40 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[560px]">
            <MapContainer
              center={center}
              zoom={17}
              style={{ width: '100%', height: '100%' }}
              className="z-0"
              zoomControl={true}
            >
              <RecenterMap center={center} />
              <TileLayer
                attribution={activeTile.attribution}
                url={activeTile.url}
                maxZoom={activeTile.maxZoom}
                maxNativeZoom={activeTile.maxZoom}
              />
              <MapEvents onMapClick={handleMapClick} />

              {/* In-progress line segments while drawing */}
              {coordinates.length >= 2 && coordinates.length < 3 && (
                <Polygon
                  positions={coordinates}
                  pathOptions={{ color: '#FBBF24', weight: 2, dashArray: '6,6', fillOpacity: 0, opacity: 0.8 }}
                />
              )}

              {/* Completed field boundary polygon */}
              {coordinates.length >= 3 && (
                <Polygon
                  positions={coordinates}
                  pathOptions={{
                    color: '#00FF88',         // bright neon green — visible on any satellite
                    fillColor: ndviData?.mean_ndvi >= 0.65 ? '#22c55e' : '#f59e0b',
                    fillOpacity: 0.22,
                    weight: 3,
                    opacity: 1,
                    dashArray: null,          // solid border for max visibility
                    lineJoin: 'round',
                    lineCap: 'round',
                  }}
                />
              )}

              {/* Vertex markers — small neon dots */}
              {coordinates.map((pos, idx) => (
                <Marker
                  key={idx}
                  position={pos}
                  icon={L.divIcon({
                    className: '',
                    html: `<div style="width:12px;height:12px;border-radius:50%;background:#00FF88;border:2px solid #fff;box-shadow:0 0 6px #00FF88;"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  })}
                />
              ))}
            </MapContainer>

            {/* Drawing tip overlay */}
            {coordinates.length < 3 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-black/70 backdrop-blur text-xs text-white px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                🖱️ Click on the map to place boundary points — need {Math.max(0, 3 - coordinates.length)} more
              </div>
            )}

            {/* Floating NDVI Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-gray-900/90 backdrop-blur-md border border-gray-700/80 rounded-xl px-3 py-2 text-xs flex flex-wrap items-center gap-3">
              <span className="text-gray-400 font-medium">NDVI Scale:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-gray-300">&lt; 0.3 Stressed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="text-gray-300">0.3–0.5 Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-gray-300">&gt; 0.6 Healthy</span>
              </div>
            </div>
          </div>

          {/* Right: Live Satellite Telemetry & Health Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {ndviData ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                
                {/* Score Header Card */}
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Field Health Index</span>
                      <h3 className="text-xl font-bold text-white mt-1">{ndviData.field_name}</h3>
                      <p className="text-xs text-gray-400">Crop: <span className="text-gray-200">{ndviData.crop}</span> • Area: <span className="text-emerald-400 font-semibold">{ndviData.area_acres} Acres</span></p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-emerald-400">{ndviData.mean_ndvi}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-medium">Mean NDVI Value</div>
                    </div>
                  </div>

                  {/* Satellite Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-300">
                    <div>📡 <span className="text-gray-400">Sensor:</span> {ndviData.satellite}</div>
                    <div>🎯 <span className="text-gray-400">Spatial Res:</span> {ndviData.resolution}</div>
                    <div>☁️ <span className="text-gray-400">Cloud Cover:</span> {ndviData.cloud_cover}</div>
                    <div>⏱️ <span className="text-gray-400">Telemetry:</span> {ndviData.last_pass}</div>
                  </div>
                </div>

                {/* Health Breakdown Distribution */}
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={13} className="text-emerald-400" />
                    Field Canopy Vigor Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Dense Canopy / Peak Vigor</span>
                        <span className="font-bold text-emerald-400">{ndviData.health_distribution.dense}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: ndviData.health_distribution.dense }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Healthy Vegetative Growth</span>
                        <span className="font-bold text-teal-400">{ndviData.health_distribution.healthy}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: ndviData.health_distribution.healthy }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Moderate / Uneven Growth</span>
                        <span className="font-bold text-yellow-400">{ndviData.health_distribution.moderate}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: ndviData.health_distribution.moderate }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Moisture / Nutrient Stressed</span>
                        <span className="font-bold text-red-400">{ndviData.health_distribution.stressed}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-red-400 h-1.5 rounded-full" style={{ width: ndviData.health_distribution.stressed }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4-Zone Sector Recommendations */}
                <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue-400" />
                    Zonal Precision Agronomy Guidance
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {ndviData.zones.map((z, idx) => (
                      <div key={idx} className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{z.zone}</span>
                          <span className="px-2 py-0.5 rounded-md font-bold" style={{ backgroundColor: `${z.color}20`, color: z.color }}>
                            NDVI {z.ndvi} ({z.status})
                          </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{z.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical NDVI Vegetation Trend */}
                {ndviData.ndvi_history && (
                  <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5">
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                      6-Month NDVI Satellite Pass History
                    </h4>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={ndviData.ndvi_history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <YAxis domain={[0, 1]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', fontSize: '11px' }}
                          itemStyle={{ color: '#10B981' }}
                        />
                        <Line type="monotone" dataKey="ndvi" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: '#10B981' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-800/30 border border-gray-700/40 rounded-2xl p-8 text-center">
                <Satellite size={48} className="text-gray-600 mb-4 animate-pulse" />
                <h4 className="text-base font-semibold text-gray-300 mb-1">No Field Selected</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Click at least 3 points on the satellite map to draw a custom farm perimeter, or pick an estate from the presets above.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
