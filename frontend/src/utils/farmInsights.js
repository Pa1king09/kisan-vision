const STORAGE_FIELDS = 'agrokai_fields';
const STORAGE_CROPS = 'agrokai_past_crops';
export const getFields = (userId) => {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_FIELDS}_${userId}`)) || [];
  } catch { return []; }
};
export const saveFields = (userId, f) => {
  if (!userId) return;
  localStorage.setItem(`${STORAGE_FIELDS}_${userId}`, JSON.stringify(f || []));
};

export const getCrops = (userId) => {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_CROPS}_${userId}`)) || [];
  } catch { return []; }
};
export const saveCrops = (userId, c) => {
  if (!userId) return;
  localStorage.setItem(`${STORAGE_CROPS}_${userId}`, JSON.stringify(c || []));
};


export function generateInsights(fields = [], crops = []) {
  const insights = [];
  if (!Array.isArray(fields) || !fields.length) {
    return [{ icon: '🌱', color: '#4caf50', msg: 'Add your first field to start receiving personalized farm insights.' }];
  }

  const safeCrops = Array.isArray(crops) ? [...crops] : [];

  // Rule 1: Crop rotation warning
  const fieldCrops = {};
  safeCrops.sort((a, b) => (a.year || 0) - (b.year || 0)).forEach(c => {
    if (!c.fieldName) return;
    if (!fieldCrops[c.fieldName]) fieldCrops[c.fieldName] = [];
    fieldCrops[c.fieldName].push(c);
  });
  for (const [fn, list] of Object.entries(fieldCrops)) {
    let streak = 1;
    for (let i = 1; i < list.length; i++) {
      if (list[i].cropName === list[i - 1].cropName) { streak++; } else { streak = 1; }
      if (streak >= 2) {
        insights.push({ icon: '⚠️', color: '#f5c542', msg: `You've grown ${list[i].cropName} for ${streak} seasons on ${fn}. Crop rotation is strongly recommended to restore soil nutrients.` });
        break;
      }
    }
  }

  // Rule 3: Underperforming soil
  const soilOutcomes = {};
  safeCrops.forEach(c => {
    const field = fields.find(f => f.name === c.fieldName);
    if (!field) return;
    if (!soilOutcomes[field.soilType]) soilOutcomes[field.soilType] = [];
    soilOutcomes[field.soilType].push(c.outcome);
  });
  for (const [soil, outcomes] of Object.entries(soilOutcomes)) {
    if (outcomes.filter(o => o === 'Poor').length >= 2) {
      insights.push({ icon: '🔴', color: '#e53935', msg: `${soil} soil fields are underperforming consistently. Consider soil treatment before next sowing.` });
    }
  }

  // Rule 6: Large area underutilized
  fields.forEach(f => {
    if (f.area > 10) {
      const fCrops = safeCrops.filter(c => c.fieldName === f.name);
      if (!fCrops.some(c => c.outcome === 'Good Yield')) {
        insights.push({ icon: '📐', color: '#fb8c00', msg: `${f.name} is ${f.area} acres but has no recorded good yield. Consider getting a soil test and running a precision analysis.` });
      }
    }
  });

  // Rule 2: Best performing soil
  for (const [soil, outcomes] of Object.entries(soilOutcomes)) {
    if (outcomes.filter(o => o === 'Good Yield').length >= 2) {
      insights.push({ icon: '🏆', color: '#4caf50', msg: `Your ${soil} soil fields have the best yield history. Prioritize them for high-value crops this season.` });
    }
  }

  // Rule 4: Most active season
  const seasonCount = {};
  safeCrops.forEach(c => { seasonCount[c.season] = (seasonCount[c.season] || 0) + 1; });
  const topSeason = Object.entries(seasonCount).sort((a, b) => b[1] - a[1])[0];
  if (topSeason) {
    insights.push({ icon: '📅', color: '#1e88e5', msg: `${topSeason[0]} is your most active season with ${topSeason[1]} recorded crops. Plan your field prep and labour accordingly.` });
  }

  // Rule 5: Field sitting idle
  fields.forEach(f => {
    if (!safeCrops.some(c => c.fieldName === f.name)) {
      insights.push({ icon: '💤', color: '#9e9e9e', msg: `${f.name} has no crop history logged. Add past crops to unlock personalized insights for this field.` });
    }
  });

  // Rule 7: Single soil diversity
  const uniqueSoils = [...new Set(fields.map(f => f.soilType))];
  if (uniqueSoils.length === 1 && fields.length > 1) {
    insights.push({ icon: '🌍', color: '#00897b', msg: `All your fields share ${uniqueSoils[0]} soil. Diversifying fields with different soil types can reduce season-wide crop failure risk.` });
  }

  // Priority: R1(yellow) > R3(red) > R6(orange) > R2(green) > R4(blue) > R5(gray) > R7(teal)
  const priority = { '#f5c542': 0, '#e53935': 1, '#fb8c00': 2, '#4caf50': 3, '#1e88e5': 4, '#9e9e9e': 5, '#00897b': 6 };
  insights.sort((a, b) => (priority[a.color] ?? 99) - (priority[b.color] ?? 99));
  return insights.slice(0, 3);
}
