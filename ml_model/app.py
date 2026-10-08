import os
import logging
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from soil_mapper import map_farmer_inputs
from functools import lru_cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'crop_model.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder.pkl')
CROP_PROFILES_PATH = os.path.join(BASE_DIR, 'crop_profiles.pkl')

model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
label_encoder = joblib.load(LABEL_ENCODER_PATH) if os.path.exists(LABEL_ENCODER_PATH) else None
crop_profiles = joblib.load(CROP_PROFILES_PATH) if os.path.exists(CROP_PROFILES_PATH) else None

print(f"Model loaded: {model is not None}")
print(f"Label encoder loaded: {label_encoder is not None}")
print(f"Crop profiles loaded: {crop_profiles is not None}")

try:
    from disease_inference import classifier as disease_classifier
    print("PlantVillage Disease Classifier imported successfully!")
except Exception as e:
    logger.warning(f"Disease classifier import error: {e}")
    disease_classifier = None

# Feature order that matches the trained model
if model and hasattr(model, 'feature_names_in_'):
    EXPECTED_FEATURES = list(model.feature_names_in_)
elif model and hasattr(model, 'estimator') and hasattr(model.estimator, 'feature_names_in_'):
    EXPECTED_FEATURES = list(model.estimator.feature_names_in_)
else:
    EXPECTED_FEATURES = [
        'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
        'np_ratio', 'kp_ratio', 'nk_ratio', 'fertility_index', 'nutrient_balance_score',
        'temp_humidity_index', 'temp_rainfall_interaction', 'ph_suitability',
        'environmental_stress_score', 'soil_health_index', 'yield_potential_estimate'
    ]

BASE_FEATURES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']


def engineer_features_single(input_dict):
    """Engineers the same advanced features used during model training."""
    out = input_dict.copy()
    n    = float(out.get('N', 0))
    p    = float(out.get('P', 0))
    k    = float(out.get('K', 0))
    temp = float(out.get('temperature', 0))
    humid = float(out.get('humidity', 0))
    ph   = float(out.get('ph', 0))
    rain = float(out.get('rainfall', 0))

    out['np_ratio'] = n / (p + 1e-5)
    out['kp_ratio'] = k / (p + 1e-5)
    out['nk_ratio'] = n / (k + 1e-5)
    out['fertility_index'] = (n + p + k) / 3.0

    total_nutrients = n + p + k + 1e-5
    prop_std = np.std([n / total_nutrients, p / total_nutrients, k / total_nutrients])
    out['nutrient_balance_score'] = 1.0 / (prop_std + 0.1)

    out['temp_humidity_index'] = 0.8 * temp + (humid / 100.0) * (temp - 14.4) + 46.4
    out['temp_rainfall_interaction'] = temp * rain / 100.0
    out['ph_suitability'] = np.exp(-0.5 * ((ph - 6.5) / 1.0) ** 2)

    temp_stress  = np.maximum(0, np.maximum(18.0 - temp,  temp  - 32.0))
    humid_stress = np.maximum(0, np.maximum(40.0 - humid, humid - 85.0)) / 10.0
    ph_stress    = np.maximum(0, np.maximum(5.5  - ph,    ph    -  7.5)) * 2.0
    rain_stress  = np.maximum(0, np.maximum(50.0 - rain,  rain  - 400.0)) / 100.0
    out['environmental_stress_score'] = temp_stress + humid_stress + ph_stress + rain_stress

    fertility = out['fertility_index']
    ph_suit   = out['ph_suitability']
    out['soil_health_index']       = fertility * ph_suit
    out['yield_potential_estimate'] = (fertility * ph_suit) / (1.0 + out['environmental_stress_score'])
    return out


def compute_aci(input_dict, crop_name):
    """
    Agricultural Compatibility Index — measures how well the actual input values
    sit within a crop's observed training-data ranges.

    KEY FIX: Use a SOFT Gaussian penalty based on z-score distance from the mean
    (not p10/p90 hard walls). This prevents any single crop from scoring 1.0 on
    many features simultaneously just because its p10–p90 band is wide, which was
    the core cause of Pigeon Peas' inflated ACI domination.
    Additionally, we use per-feature standard-deviation-normalised distance so that
    tight-range crops (e.g., Pumpkin with a near-zero std) are not unfairly penalised
    for inputs that drift only slightly outside their tiny training window.
    """
    profile = crop_profiles.get(crop_name) if crop_profiles else None
    if not profile:
        return 0.5  # neutral fallback

    # Feature weights — higher weight = stronger signal for crop discrimination
    weights = {
        'rainfall':    3.0,
        'temperature': 2.5,
        'humidity':    2.0,
        'ph':          2.0,
        'N':           1.5,
        'K':           1.5,
        'P':           1.0,
    }
    total_weight = sum(weights.values())

    aci = 0.0
    for feat, w in weights.items():
        val  = float(input_dict[feat])
        mean = profile[feat]['mean']
        std  = profile[feat]['std']

        # Gaussian decay: score = 1 when val == mean, falls off with distance
        # We use 1.5*std as the "comfortable" spread so crops aren't penalised
        # for small deviations within a normal agronomic variance band.
        sigma = max(std * 1.5, 5.0)  # floor of 5 prevents divide-by-near-zero for tiny-sample crops
        z = (val - mean) / sigma
        f_score = np.exp(-0.5 * z ** 2)

        aci += w * f_score

    return aci / total_weight


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@lru_cache(maxsize=2048)
def _cached_predict(n, p, k, temp, humid, ph, rain):
    input_dict = {
        'N': n, 'P': p, 'K': k, 
        'temperature': temp, 'humidity': humid, 
        'ph': ph, 'rainfall': rain
    }

    # --- Build feature vector ---
    engineered = engineer_features_single(input_dict)
    ordered = {f: float(engineered.get(f, 0.0)) for f in EXPECTED_FEATURES}
    df = pd.DataFrame([ordered])[EXPECTED_FEATURES]

    # --- Step 1: Raw calibrated ML probabilities ---
    ml_probs = model.predict_proba(df)[0]   # shape (n_classes,)

    # --- Step 2: Agricultural Compatibility Index for every crop ---
    scores = []
    for idx, ml_p in enumerate(ml_probs):
        crop_name = label_encoder.inverse_transform([idx])[0]
        aci = compute_aci(input_dict, crop_name)

        # Hybrid score: ML probability dominates (70 %) and ACI guides (30 %)
        hybrid = 0.70 * float(ml_p) + 0.30 * aci

        scores.append({
            "crop":         str(crop_name),
            "ml_prob":      float(ml_p),
            "aci":          float(aci),
            "hybrid_score": float(hybrid),
        })

    # Sort by hybrid score descending
    ranked = sorted(scores, key=lambda x: x['hybrid_score'], reverse=True)

    top_3 = [
        {"crop": r["crop"], "confidence": round(r["hybrid_score"], 4)}
        for r in ranked[:3]
    ]
    best = ranked[0]

    # --- Step 3: Agricultural explanation (profile-based, zero-memory) ---
    try:
        if hasattr(model, 'estimator') and hasattr(model.estimator, 'feature_importances_'):
            importances = model.estimator.feature_importances_
        elif hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        else:
            importances = [1.0 / len(EXPECTED_FEATURES)] * len(EXPECTED_FEATURES)

        fi = dict(zip(EXPECTED_FEATURES, importances))
        explanation = {}
        profile = crop_profiles.get(best["crop"]) if crop_profiles else None
        for feat in BASE_FEATURES:
            val  = float(input_dict[feat])
            imp  = fi.get(feat, 0.1)
            if profile:
                mean  = profile[feat]['mean']
                std   = profile[feat]['std']
                sigma = max(std * 1.5, 5.0)
                z     = (val - mean) / sigma
                suit  = float(np.exp(-0.5 * z ** 2))
            else:
                suit = 0.7

            # Positive = in-range benefit; Negative = limiting constraint
            if suit >= 0.75:
                explanation[feat] = round(imp * suit, 4)
            else:
                explanation[feat] = round(-imp * (1.0 - suit), 4)
    except Exception as ex:
        logger.warning(f"Explanation fallback: {ex}")
        explanation = {f: 0.1 for f in BASE_FEATURES}

    return best["crop"], round(best["hybrid_score"], 4), top_3, explanation

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not label_encoder:
        return jsonify({"error": "Model or label encoder not loaded"}), 500
    try:
        raw_data = request.get_json(force=True)

        # Route through soil mapper only when descriptive inputs are supplied
        is_descriptive = 'soil_type' in raw_data or 'rainfall_level' in raw_data
        data = map_farmer_inputs(raw_data) if is_descriptive else raw_data

        # Validate required fields
        missing = [f for f in BASE_FEATURES if f not in data or data[f] is None]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        # Extract values for caching (rounded to 2 decimal places to increase cache hit rate)
        n = round(float(data.get('N', 0)), 2)
        p = round(float(data.get('P', 0)), 2)
        k = round(float(data.get('K', 0)), 2)
        temp = round(float(data.get('temperature', 0)), 2)
        humid = round(float(data.get('humidity', 0)), 2)
        ph = round(float(data.get('ph', 0)), 2)
        rain = round(float(data.get('rainfall', 0)), 2)

        best_crop, confidence, top_3, explanation = _cached_predict(n, p, k, temp, humid, ph, rain)

        return jsonify({
            "crop":              best_crop,
            "confidence":        confidence,
            "recommended_crops": top_3,
            "explanation":       explanation,
            "mapped_values":     {k: v for k, v in data.items() if k != 'season'},
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


@app.route('/predict-disease-image', methods=['POST'])
def predict_disease_image():
    if not disease_classifier or not disease_classifier.is_loaded:
        error_msg = disease_classifier.load_error if disease_classifier else 'Model not initialized'
        return jsonify({
            "success": False,
            "error": f"Disease detection AI model is unavailable: {error_msg}"
        }), 503
    try:
        raw_data = request.get_json(force=True)
        image_data = raw_data.get('image')
        crop = raw_data.get('crop', '')
        if not image_data:
            return jsonify({"success": False, "error": "No image data provided"}), 400

        result = disease_classifier.predict(image_data, crop=crop)
        if result.get("is_plant") is False or result.get("error_type") == "NON_PLANT_OBJECT":
            return jsonify(result), 422
        return jsonify(result), 200 if result.get("success") else 400
    except Exception as e:
        logger.error(f"Disease prediction error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/disease-model-status', methods=['GET'])
def disease_model_status():
    return jsonify({
        "model_name": "MobileNetV2 (PlantVillage 38-Class)",
        "framework": "PyTorch",
        "num_classes": 38,
        "is_loaded": disease_classifier.is_loaded if disease_classifier else False,
        "error": disease_classifier.load_error if disease_classifier else None
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
