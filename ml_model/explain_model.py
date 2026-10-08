import joblib
import shap
import pandas as pd
import numpy as np

# Load the trained model
model_path = 'crop_model.pkl'
model = joblib.load(model_path)

# Define feature names (must match the order used during training)
FEATURE_NAMES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

# Sample input (values as specified). Adjust season if needed – the model was trained without a season column.
sample_input = {
    'N': 90,
    'P': 42,
    'K': 43,
    'temperature': 20,
    'humidity': 80,
    'ph': 6.5,
    'rainfall': 200,
    # 'season': 0  # Uncomment if your model includes a season feature
}

# Convert to DataFrame with a single row
X_sample = pd.DataFrame([sample_input])[FEATURE_NAMES]

# Compute SHAP values using TreeExplainer (XGBoost models are tree‑based)
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_sample)

# shap_values is a 2‑D array (n_samples, n_features). We have only one sample.
shap_vals_row = shap_values[0]

# Build a dictionary of feature -> SHAP value
shap_dict = dict(zip(FEATURE_NAMES, shap_vals_row))

# Print the top 3 most influential features (by absolute SHAP value)
top_features = sorted(shap_dict.items(), key=lambda kv: abs(kv[1]), reverse=True)[:3]
print("Top 3 features influencing the prediction:")
for feature, value in top_features:
    print(f"{feature}: {value:.6f}")

# If this script is imported elsewhere, expose a helper function
def explain(sample_dict: dict) -> dict:
    """Return a dictionary of SHAP values for a given sample.

    Args:
        sample_dict: Mapping of feature names to values (must include all FEATURES).
    Returns:
        dict: Feature name -> SHAP value.
    """
    df = pd.DataFrame([sample_dict])[FEATURE_NAMES]
    vals = explainer.shap_values(df)[0]
    return dict(zip(FEATURE_NAMES, vals))

if __name__ == "__main__":
    # Demonstrate usage with the hard‑coded sample
    _ = explain(sample_input)
    # The top‑3 printout already occurred above.
