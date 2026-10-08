import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Standard soil nutrient baselines (N, P, K ranges and typical pH)
SOIL_NPK_MAP = {
    "Clay":     {"N": (70,100), "P": (40,60), "K": (35,50), "ph": 6.5},
    "Sandy":    {"N": (10,35),  "P": (30,60), "K": (10,25), "ph": 6.0},
    "Loamy":    {"N": (40,90),  "P": (30,60), "K": (15,40), "ph": 7.0},
    "Black":    {"N": (30,60),  "P": (20,40), "K": (15,35), "ph": 7.5},
    "Red":      {"N": (10,40),  "P": (40,70), "K": (10,30), "ph": 5.5},
    "Alluvial": {"N": (40,80),  "P": (30,60), "K": (15,35), "ph": 7.2},
}

# Season-specific multipliers for soil nutrient dynamics
SEASON_MULTIPLIERS = {
    "Monsoon": {"N": 1.10, "P": 0.95, "K": 1.10},
    "Summer":  {"N": 0.90, "P": 1.05, "K": 1.00},
    "Winter":  {"N": 0.85, "P": 1.10, "K": 0.95},
    "Spring":  {"N": 1.05, "P": 1.00, "K": 1.05},
}

def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))

def map_farmer_inputs(farmer_input):
    """
    Translates farmer-friendly descriptive inputs and transient daily weather forecasts
    into realistic, cumulative growing-season parameters aligned with the ML model's training distribution.
    This resolves the severe low-rainfall / low-humidity bias that caused Moth Beans overprediction.
    """
    soil_type = farmer_input.get("soil_type", "Loamy")
    season = farmer_input.get("season", "Summer")
    
    # Get values from daily weather forecast or default
    input_temp = float(farmer_input.get("temperature") if farmer_input.get("temperature") is not None else 25)
    input_humidity = float(farmer_input.get("humidity") if farmer_input.get("humidity") is not None else 50)
    input_rainfall = float(farmer_input.get("rainfall") if farmer_input.get("rainfall") is not None else 100)

    # 1. Map Soil Nutrients
    base_values = SOIL_NPK_MAP.get(soil_type, SOIL_NPK_MAP["Loamy"])
    multipliers = SEASON_MULTIPLIERS.get(season, SEASON_MULTIPLIERS["Summer"])

    # Generate deterministic NPK (midpoint of typical range)
    n_val = (base_values["N"][0] + base_values["N"][1]) // 2
    p_val = (base_values["P"][0] + base_values["P"][1]) // 2
    k_val = (base_values["K"][0] + base_values["K"][1]) // 2

    mapped_n = float(clamp(round(n_val * multipliers["N"]), 0, 140))
    mapped_p = float(clamp(round(p_val * multipliers["P"]), 5, 145))
    mapped_k = float(clamp(round(k_val * multipliers["K"]), 5, 205))
    mapped_ph = float(clamp(base_values["ph"], 3.5, 9.9))

    # 2. Translate Transient Daily Weather to Seasonal Equivalents (Agronomically Grounded)
    # The training dataset is based on growing-season averages/totals, but the API sends daily snapshots.
    season_lower = season.lower() if season else "summer"
    
    # Rainfall translation: daily precip (usually 0-15mm) scaled to seasonal cumulative water availability
    if "monsoon" in season_lower:
        seasonal_rainfall = 750.0 + input_rainfall * 15.0
    elif "winter" in season_lower:
        seasonal_rainfall = 180.0 + input_rainfall * 10.0
    elif "spring" in season_lower or "post-monsoon" in season_lower:
        seasonal_rainfall = 320.0 + input_rainfall * 12.0
    else:  # Summer (often relies on irrigation or dryland baseline)
        seasonal_rainfall = 220.0 + input_rainfall * 8.0
        
    mapped_rainfall = float(clamp(seasonal_rainfall, 30.0, 1800.0))

    # Humidity translation: smooth transient dry/moist spikes to seasonal averages
    if "monsoon" in season_lower:
        seasonal_humidity = 72.0 + (input_humidity * 0.2)
    elif "winter" in season_lower:
        seasonal_humidity = 52.0 + (input_humidity * 0.2)
    else:  # Summer / Dry periods
        seasonal_humidity = 42.0 + (input_humidity * 0.25)
        
    mapped_humidity = float(clamp(seasonal_humidity, 15.0, 95.0))
    mapped_temp = float(clamp(input_temp, 8, 44))

    logger.info(f"[Soil Mapper] Mapped daily weather (temp={input_temp}, humid={input_humidity}, rain={input_rainfall}) "
                f"to seasonal equivalents (temp={mapped_temp}, humid={mapped_humidity:.1f}, rain={mapped_rainfall:.1f})")

    return {
        "N": mapped_n,
        "P": mapped_p,
        "K": mapped_k,
        "temperature": mapped_temp,
        "humidity": mapped_humidity,
        "ph": mapped_ph,
        "rainfall": mapped_rainfall
    }