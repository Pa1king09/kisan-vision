import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier
import os

def engineer_features(df):
    """
    Engineers advanced agricultural and environmental features.
    Accepts a DataFrame containing the 7 base features: N, P, K, temperature, humidity, ph, rainfall
    Returns a copy of the DataFrame with 11 advanced features added.
    """
    out = df.copy()
    
    # --- NUTRIENT FEATURES ---
    # N/P, K/P, N/K ratios (smooth with epsilon to prevent division by zero)
    out['np_ratio'] = out['N'] / (out['P'] + 1e-5)
    out['kp_ratio'] = out['K'] / (out['P'] + 1e-5)
    out['nk_ratio'] = out['N'] / (out['K'] + 1e-5)
    
    # Fertility index (average nutrient level)
    out['fertility_index'] = (out['N'] + out['P'] + out['K']) / 3.0
    
    # Nutrient balance score (scale-invariant metric of how balanced the proportions of N, P, K are)
    total_nutrients = out['N'] + out['P'] + out['K'] + 1e-5
    n_pct = out['N'] / total_nutrients
    p_pct = out['P'] / total_nutrients
    k_pct = out['K'] / total_nutrients
    nutrient_proportions = np.column_stack([n_pct, p_pct, k_pct])
    prop_std = np.std(nutrient_proportions, axis=1)
    out['nutrient_balance_score'] = 1.0 / (prop_std + 0.1)
    
    # --- ENVIRONMENTAL FEATURES ---
    # Temperature-Humidity Index (THI) - Standard agricultural indicator for bioclimate comfort
    out['temp_humidity_index'] = 0.8 * out['temperature'] + (out['humidity'] / 100.0) * (out['temperature'] - 14.4) + 46.4
    
    # Climate Suitability/Interaction (co-presence of heat and rain)
    out['temp_rainfall_interaction'] = out['temperature'] * out['rainfall'] / 100.0
    
    # pH Suitability Score (bell curve centered at ideal pH 6.5)
    out['ph_suitability'] = np.exp(-0.5 * ((out['ph'] - 6.5) / 1.0)**2)
    
    # Environmental Stress Index (deviations from agricultural comfort limits)
    temp_stress = np.maximum(0, np.maximum(18.0 - out['temperature'], out['temperature'] - 32.0))
    humid_stress = np.maximum(0, np.maximum(40.0 - out['humidity'], out['humidity'] - 85.0)) / 10.0
    ph_stress = np.maximum(0, np.maximum(5.5 - out['ph'], out['ph'] - 7.5)) * 2.0
    rain_stress = np.maximum(0, np.maximum(50.0 - out['rainfall'], out['rainfall'] - 400.0)) / 100.0
    out['environmental_stress_score'] = temp_stress + humid_stress + ph_stress + rain_stress
    
    # --- COMPOSITE FEATURES ---
    # Soil Health Index
    out['soil_health_index'] = out['fertility_index'] * out['ph_suitability']
    
    # Yield Potential Estimate
    out['yield_potential_estimate'] = (out['fertility_index'] * out['ph_suitability']) / (1.0 + out['environmental_stress_score'])
    
    return out

def train_crop_model():
    data_path = 'crop_data.csv'
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    # 1. Load and clean the dataset
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns.")
    
    # Remove duplicate rows to avoid data leakage / overfitting
    duplicate_count = df.duplicated().sum()
    if duplicate_count > 0:
        df = df.drop_duplicates()
        print(f"Dataset cleaned: Removed {duplicate_count} duplicate rows. New shape: {df.shape[0]} rows.")
    
    # 2. Encode categorical columns if any exist
    if 'season' in df.columns:
        season_encoder = LabelEncoder()
        df['season'] = season_encoder.fit_transform(df['season'])
        joblib.dump(season_encoder, 'season_encoder.pkl')
        print("Season column encoded and encoder saved.")
    
    # Encode target 'label' column
    if 'label' in df.columns:
        label_encoder = LabelEncoder()
        df['label'] = label_encoder.fit_transform(df['label'])
        joblib.dump(label_encoder, 'label_encoder.pkl')
        print(f"Label column encoded. Classes count: {len(label_encoder.classes_)}")
    else:
        print("Error: 'label' column not found.")
        return

    # 3. Apply Feature Engineering
    print("Applying agricultural feature engineering...")
    df_engineered = engineer_features(df)
    
    # Features and Target
    X = df_engineered.drop('label', axis=1)
    y = df_engineered['label']

    # 4. Stratified Split to maintain exact class proportions
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train/Test split completed with stratified sampling. Train: {len(y_train)}, Test: {len(y_test)}")

    # 5. Evaluate and Compare Models (Phase 4)
    print("\n--- MODEL STAGE 1: Random Forest Classifier ---")
    rf_model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    rf_f1 = f1_score(y_test, rf_preds, average='weighted')
    print(f"Random Forest Accuracy: {rf_acc*100:.2f}%")
    print(f"Random Forest Weighted F1-score: {rf_f1*100:.2f}%")

    print("\n--- MODEL STAGE 2: XGBoost Classifier ---")
    # Compute class weights for sample_weight to handle severe imbalance in XGBoost
    class_counts = np.bincount(y_train)
    total_samples = len(y_train)
    n_classes = len(class_counts)
    class_weights = total_samples / (n_classes * class_counts)
    sample_weights = y_train.map(lambda c: class_weights[c])
    
    xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    xgb_model.fit(X_train, y_train, sample_weight=sample_weights)
    xgb_preds = xgb_model.predict(X_test)
    xgb_acc = accuracy_score(y_test, xgb_preds)
    xgb_f1 = f1_score(y_test, xgb_preds, average='weighted')
    print(f"XGBoost Accuracy: {xgb_acc*100:.2f}%")
    print(f"XGBoost Weighted F1-score: {xgb_f1*100:.2f}%")

    # Select best model based on weighted F1-score
    if rf_f1 >= xgb_f1:
        best_base_model = rf_model
        best_name = "Random Forest"
    else:
        best_base_model = xgb_model
        best_name = "XGBoost"
    
    print(f"\n>> Selected Best Model: {best_name} (Weighted F1: {max(rf_f1, xgb_f1)*100:.2f}%)")

    # 6. Apply Probability Calibration (Phase 7)
    print("\nApplying probability calibration using CalibratedClassifierCV...")
    # cv='prefit' allows us to calibrate the probabilities based on the test split
    calibrated_model = CalibratedClassifierCV(best_base_model, method='sigmoid', cv='prefit')
    calibrated_model.fit(X_test, y_test)
    print("Probability calibration complete.")

    # 7. Generate crop agricultural rules/profiles (Phase 9)
    # Re-load unencoded label for clean profile generation
    raw_df = pd.read_csv(data_path).drop_duplicates()
    print("\nGenerating crop optimal ranges / agricultural profiles from dataset...")
    crop_profiles = {}
    base_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    for crop in raw_df['label'].unique():
        crop_df = raw_df[raw_df['label'] == crop]
        profile = {}
        for feat in base_features:
            profile[feat] = {
                'min': float(crop_df[feat].min()),
                'max': float(crop_df[feat].max()),
                'mean': float(crop_df[feat].mean()),
                'std': float(crop_df[feat].std() + 1e-5),
                'p10': float(crop_df[feat].quantile(0.10)),
                'p90': float(crop_df[feat].quantile(0.90))
            }
        crop_profiles[crop] = profile
    
    # Save optimal profiles, label_encoder, and model
    joblib.dump(crop_profiles, 'crop_profiles.pkl')
    print("Crop profiles saved successfully to 'crop_profiles.pkl'.")
    
    joblib.dump(calibrated_model, 'crop_model.pkl')
    print("Calibrated crop recommendation model saved successfully to 'crop_model.pkl'.")
    print("All pipeline preparation completed successfully!")

if __name__ == "__main__":
    train_crop_model()
