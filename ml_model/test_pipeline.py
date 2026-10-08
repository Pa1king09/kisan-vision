import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
import os

# 1. Feature Engineering
def engineer_features(df):
    out = df.copy()
    
    # Nutrient ratios and indices
    out['np_ratio'] = out['N'] / (out['P'] + 1e-5)
    out['kp_ratio'] = out['K'] / (out['P'] + 1e-5)
    out['nk_ratio'] = out['N'] / (out['K'] + 1e-5)
    out['fertility_index'] = (out['N'] + out['P'] + out['K']) / 3.0
    
    # Scale-invariant nutrient balance score
    total_nutrients = out['N'] + out['P'] + out['K'] + 1e-5
    n_pct = out['N'] / total_nutrients
    p_pct = out['P'] / total_nutrients
    k_pct = out['K'] / total_nutrients
    
    # standard deviation of the proportions (smaller std = more balanced)
    nutrient_proportions = np.column_stack([n_pct, p_pct, k_pct])
    prop_std = np.std(nutrient_proportions, axis=1)
    out['nutrient_balance_score'] = 1.0 / (prop_std + 0.1)
    
    # Environmental indices
    out['temp_humidity_index'] = 0.8 * out['temperature'] + (out['humidity'] / 100.0) * (out['temperature'] - 14.4) + 46.4
    out['temp_rainfall_interaction'] = out['temperature'] * out['rainfall'] / 100.0
    out['ph_suitability'] = np.exp(-0.5 * ((out['ph'] - 6.5) / 1.0)**2)
    
    # Environmental Stress Index
    temp_stress = np.maximum(0, np.maximum(18.0 - out['temperature'], out['temperature'] - 32.0))
    humid_stress = np.maximum(0, np.maximum(40.0 - out['humidity'], out['humidity'] - 85.0)) / 10.0
    ph_stress = np.maximum(0, np.maximum(5.5 - out['ph'], out['ph'] - 7.5)) * 2.0
    rain_stress = np.maximum(0, np.maximum(50.0 - out['rainfall'], out['rainfall'] - 400.0)) / 100.0
    out['environmental_stress_score'] = temp_stress + humid_stress + ph_stress + rain_stress
    
    # Soil Health Index
    out['soil_health_index'] = out['fertility_index'] * out['ph_suitability']
    
    # Yield Potential Estimate
    out['yield_potential_estimate'] = (out['fertility_index'] * out['ph_suitability']) / (1.0 + out['environmental_stress_score'])
    
    return out

def run_evaluation():
    # Load dataset
    data_path = 'crop_data.csv'
    if not os.path.exists(data_path):
        print("Error: crop_data.csv not found")
        return
        
    df = pd.read_csv(data_path)
    
    # Clean duplicates
    df = df.drop_duplicates()
    
    # Encode labels
    le = LabelEncoder()
    df['encoded_label'] = le.fit_transform(df['label'])
    
    # Apply feature engineering
    df_feat = engineer_features(df)
    
    # Drop columns
    X = df_feat.drop(['label', 'encoded_label'], axis=1)
    y = df_feat['encoded_label']
    
    # Stratified split to preserve class distribution
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("=== MODEL EVALUATION ===")
    print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")
    
    # 1. Random Forest Classifier
    rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_pred)*100:.2f}%")
    print(f"Random Forest Weighted F1: {f1_score(y_test, rf_pred, average='weighted')*100:.2f}%")
    
    # 2. XGBoost Classifier
    # Compute class weights for sample_weight
    class_counts = np.bincount(y_train)
    total_samples = len(y_train)
    n_classes = len(class_counts)
    class_weights = total_samples / (n_classes * class_counts)
    sample_weights = y_train.map(lambda c: class_weights[c])
    
    xgb = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    xgb.fit(X_train, y_train, sample_weight=sample_weights)
    xgb_pred = xgb.predict(X_test)
    print(f"XGBoost Accuracy: {accuracy_score(y_test, xgb_pred)*100:.2f}%")
    print(f"XGBoost Weighted F1: {f1_score(y_test, xgb_pred, average='weighted')*100:.2f}%")
    
    # 3. Calibrated Random Forest
    calibrated_rf = CalibratedClassifierCV(rf, method='sigmoid', cv='prefit')
    calibrated_rf.fit(X_test, y_test) # Note: CalibratedClassifierCV on prefitted model
    
    # Let's check LightGBM / CatBoost if installed
    try:
        from lightgbm import LGBMClassifier
        lgb = LGBMClassifier(class_weight='balanced', random_state=42, verbose=-1)
        lgb.fit(X_train, y_train)
        lgb_pred = lgb.predict(X_test)
        print(f"LightGBM Accuracy: {accuracy_score(y_test, lgb_pred)*100:.2f}%")
        print(f"LightGBM Weighted F1: {f1_score(y_test, lgb_pred, average='weighted')*100:.2f}%")
    except ImportError:
        print("LightGBM not installed.")
        
    try:
        from catboost import CatBoostClassifier
        cat = CatBoostClassifier(auto_class_weights='Balanced', random_state=42, verbose=0)
        cat.fit(X_train, y_train)
        cat_pred = cat.predict(X_test)
        print(f"CatBoost Accuracy: {accuracy_score(y_test, cat_pred)*100:.2f}%")
        print(f"CatBoost Weighted F1: {f1_score(y_test, cat_pred, average='weighted')*100:.2f}%")
    except ImportError:
        print("CatBoost not installed.")

    # 4. Generate crop agricultural rules/profiles
    print("\nGenerating crop profiles (min, max, mean, std) for hybrid rules...")
    crop_profiles = {}
    features_to_profile = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    for crop in df['label'].unique():
        crop_df = df[df['label'] == crop]
        profile = {}
        for feat in features_to_profile:
            profile[feat] = {
                'min': float(crop_df[feat].min()),
                'max': float(crop_df[feat].max()),
                'mean': float(crop_df[feat].mean()),
                'std': float(crop_df[feat].std() + 1e-5),
                'p10': float(crop_df[feat].quantile(0.1)),
                'p90': float(crop_df[feat].quantile(0.9))
            }
        crop_profiles[crop] = profile
        
    joblib.dump(crop_profiles, 'crop_profiles.pkl')
    print("Crop profiles generated and saved to 'crop_profiles.pkl'")

if __name__ == '__main__':
    run_evaluation()
