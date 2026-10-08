import React from 'react';

export const NoFieldsSVG = () => (
  <div className="flex flex-col items-center py-8">
    <svg width="240" height="160" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0" width="300" height="60" fill="#c8dfc8" rx="8"/>
      <rect x="40" y="100" width="220" height="70" fill="#8B5E3C" rx="12"/>
      <path d="M40 100 C80 85, 140 115, 180 90, 220 110, 260 95 L260 100 L40 100Z" fill="#6a9e5a" opacity="0.5"/>
      <line x1="100" y1="130" x2="100" y2="115" stroke="#6a9e5a" strokeWidth="3"/>
      <ellipse cx="100" cy="112" rx="6" ry="4" fill="#6a9e5a"/>
      <line x1="150" y1="135" x2="150" y2="118" stroke="#6a9e5a" strokeWidth="3"/>
      <ellipse cx="150" cy="115" rx="6" ry="4" fill="#6a9e5a"/>
      <line x1="200" y1="130" x2="200" y2="115" stroke="#6a9e5a" strokeWidth="3"/>
      <ellipse cx="200" cy="112" rx="6" ry="4" fill="#6a9e5a"/>
      <circle cx="150" cy="60" r="16" fill="#2d5a27"/>
      <path d="M150 52 L150 68" stroke="#fff" strokeWidth="2"/>
      <path d="M145 57 L155 57" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M146 63 L154 63" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <p className="text-sm font-bold text-gray-700 mt-4">No fields added yet.</p>
    <p className="text-xs text-gray-400">Click + Add New Field to begin.</p>
  </div>
);

export const NoCropsSVG = () => (
  <div className="flex flex-col items-center py-6">
    <svg width="240" height="140" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="20" width="200" height="140" rx="8" fill="#fff" stroke="#2d5a27" strokeWidth="2"/>
      <line x1="70" y1="60" x2="230" y2="60" stroke="#e0e0e0" strokeWidth="1"/>
      <line x1="70" y1="90" x2="230" y2="90" stroke="#e0e0e0" strokeWidth="1"/>
      <line x1="70" y1="120" x2="230" y2="120" stroke="#e0e0e0" strokeWidth="1"/>
      <g transform="translate(180,50) rotate(0)">
        <line x1="0" y1="40" x2="0" y2="10" stroke="#6a9e5a" strokeWidth="2"/>
        <ellipse cx="-5" cy="20" rx="5" ry="3" fill="#6a9e5a" transform="rotate(-30 -5 20)"/>
        <ellipse cx="5" cy="15" rx="5" ry="3" fill="#6a9e5a" transform="rotate(30 5 15)"/>
        <ellipse cx="0" cy="10" rx="4" ry="3" fill="#6a9e5a"/>
      </g>
      <g transform="translate(70,120) rotate(-30)">
        <rect x="0" y="0" width="4" height="30" rx="1" fill="#8B5E3C"/>
        <polygon points="2,-4 5,2 -1,2" fill="#8B5E3C"/>
      </g>
    </svg>
    <p className="text-sm font-bold text-gray-700 mt-3">No crop history logged yet.</p>
    <p className="text-xs text-gray-400">Log your past crops to unlock rotation advice and yield insights.</p>
  </div>
);

export const HealthyFarmBanner = () => (
  <div className="rounded-2xl overflow-hidden">
    <svg width="100%" height="60" viewBox="0 0 600 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c8dfc8"/><stop offset="100%" stopColor="#f0ede6"/></linearGradient></defs>
      <rect width="600" height="60" fill="url(#hg)"/>
      <polygon points="30,15 33,22 40,22 34,27 36,34 30,30 24,34 26,27 20,22 27,22" fill="#2d5a27"/>
      <polygon points="55,20 57,25 63,25 58,28 60,33 55,30 50,33 52,28 47,25 53,25" fill="#2d5a27"/>
      <polygon points="80,17 82,22 87,22 83,25 85,30 80,27 75,30 77,25 73,22 78,22" fill="#2d5a27"/>
      <circle cx="540" cy="25" r="12" fill="#d4a017"/>
      <line x1="540" y1="8" x2="540" y2="4" stroke="#d4a017" strokeWidth="2"/>
      <line x1="540" y1="42" x2="540" y2="46" stroke="#d4a017" strokeWidth="2"/>
      <line x1="523" y1="25" x2="519" y2="25" stroke="#d4a017" strokeWidth="2"/>
      <line x1="557" y1="25" x2="561" y2="25" stroke="#d4a017" strokeWidth="2"/>
      <line x1="528" y1="13" x2="525" y2="10" stroke="#d4a017" strokeWidth="2"/>
      <line x1="552" y1="37" x2="555" y2="40" stroke="#d4a017" strokeWidth="2"/>
      <line x1="552" y1="13" x2="555" y2="10" stroke="#d4a017" strokeWidth="2"/>
      <line x1="528" y1="37" x2="525" y2="40" stroke="#d4a017" strokeWidth="2"/>
    </svg>
    <p className="text-center text-sm font-bold text-[#2d5a27] -mt-9 relative z-10 pb-3">✅ Your farm is looking healthy this season!</p>
  </div>
);

export default { NoFieldsSVG, NoCropsSVG, HealthyFarmBanner };
