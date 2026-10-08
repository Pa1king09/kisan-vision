# 🌾 KISAN VISION (AGRO.XAI) — AI Precision Agriculture Platform

> 🌐 **Live Website & Android APK Download:** [https://kisanvision-app.vercel.app](https://kisanvision-app.vercel.app)  
> 📱 **Direct App Portal:** [kisanvision-app.vercel.app](https://kisanvision-app.vercel.app)

An intelligent, farmer-friendly crop recommendation and precision agriculture engine powered by **XGBoost**, **SHAP**, and Deep Learning with real-time explainability and rich agronomic analysis modules.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [ML Model Service](#6-ml-model-service-flask--python)
7. [Backend API](#7-backend-api-nodejsexpress)
8. [Frontend](#8-frontend-reactvite)
9. [API Reference](#9-api-reference)
10. [XAI — Explainable AI Design](#10-xai--explainable-ai-design)
11. [Environment Variables](#11-environment-variables)

---

## 1. Project Overview

AGRO.XAI recommends the best crop to plant based on soil conditions, weather, and season. Unlike black-box tools, it explains *why* a crop was chosen using **SHAP** (SHapley Additive exPlanations), giving farmers and agronomists actionable, trustworthy insights.

**Key capabilities:**

| Feature | Description |
|---|---|
| 🌱 Crop Recommendation | XGBoost model trained on the Kaggle Crop Recommendation Dataset |
| 🧠 Explainability | SHAP values highlight the top 3 factors driving each prediction |
| ⚠️ Risk Analysis | Confidence-based agronomic risk assessment with mitigation steps |
| 💰 Revenue Estimation | Profit projections based on crop type and area |
| 🌍 Soil Improvement | Soil-specific improvement recommendations |
| 🗺️ Growing Guide | Month-by-month cultivation calendar |
| 🏛️ Government Schemes | Relevant crop-linked agricultural subsidy schemes |
| 🌿 Organic Farming | Organic alternatives and practices |
| 👷 Labour Planner | Workforce estimation by crop phase |
| 🔐 Authentication | JWT-based user accounts with prediction history |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User)                        │
│              React 18 + Vite Frontend (:5173)           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js / Express Backend (:5005)          │
│   Routes: recommend, risk, soil, improvement, revenue,  │
│           feasibility, schemes, labour, guide, organic,  │
│           auth                                          │
│   DB: Mongoose + MongoDB (cropdb @ :27017)             │
└──────────────────────┬──────────────────────────────────┘
                       │ Axios (internal)
                       ▼
┌─────────────────────────────────────────────────────────┐
│             Flask ML Server (:5001)                     │
│   XGBoost Model + SHAP TreeExplainer                   │
│   Soil Mapper (descriptive → numeric)                  │
└─────────────────────────────────────────────────────────┘
```

**Request flow for crop prediction:**
1. User submits soil/weather inputs via the React form.
2. Frontend POST → `Node /api/recommend`.
3. Node proxies the inputs to Flask `POST /predict`.
4. Flask maps descriptive inputs → numeric values, runs XGBoost, computes SHAP values.
5. Response (`crop`, `confidence`, `explanation`, `mapped_values`) propagates back to the UI.
6. Node saves the record to MongoDB for history.
7. Frontend renders the prediction card + SHAP explainability chart.

---

## 3. Tech Stack

### ML Service
| Tool | Version | Purpose |
|---|---|---|
| Python | 3.x | Runtime |
| Flask | 3.1.3 | REST API server |
| XGBoost | 3.2.0 | Crop classification model |
| SHAP | 0.50.0 | Prediction explainability |
| scikit-learn | 1.8.0 | Label encoding, train/test split |
| pandas | 3.0.1 | Data handling |
| joblib | 1.5.3 | Model serialisation |

### Backend
| Tool | Version | Purpose |
|---|---|---|
| Node.js | LTS | Runtime |
| Express | 5.2.1 | HTTP framework |
| Mongoose | 9.2.3 | MongoDB ODM |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT auth |
| axios | 1.13.5 | Flask proxy calls |

### Frontend
| Tool | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI library |
| Vite | 5.4.10 | Build tool / dev server |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| Framer Motion | 12.34.3 | Animations |
| Recharts | 3.7.0 | SHAP bar chart |
| react-router-dom | 7.13.1 | Client-side routing |
| react-hot-toast | 2.6.0 | Toast notifications |

---

## 4. Project Structure

```
crop-recommendation-system/
├── ml_model/                    # Python / Flask ML service
│   ├── app.py                   # Flask entry point, /predict & /health routes
│   ├── train_model.py           # Trains XGBoost, saves .pkl files
│   ├── soil_mapper.py           # Converts descriptive inputs → numeric values
│   ├── explain_model.py         # Standalone SHAP exploration script
│   ├── crop_data.csv            # Kaggle crop recommendation dataset
│   ├── crop_model.pkl           # Trained XGBoost model (generated)
│   ├── label_encoder.pkl        # Crop label encoder (generated)
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Python virtual environment
│
├── backend/                     # Node.js / Express API
│   ├── server.js                # App entry, registers all routers
│   ├── db.js                    # Mongoose connection
│   ├── .env                     # Environment variables (gitignored)
│   ├── models/
│   │   ├── Recommendation.js    # MongoDB schema for predictions
│   │   └── User.js              # MongoDB schema for users
│   └── routes/
│       ├── auth.js              # POST /api/auth/register, /login
│       ├── recommend.js         # POST /api/recommend, GET/DELETE /api/history
│       ├── risk.js              # POST /api/confidence-risk
│       ├── soil.js              # POST /api/soil-analysis
│       ├── improvement.js       # POST /api/soil-improvement
│       ├── revenue.js           # POST /api/revenue-estimate
│       ├── feasibility.js       # POST /api/feasibility
│       ├── schemes.js           # POST /api/government-schemes
│       ├── labour.js            # POST /api/labour-plan
│       ├── guide.js             # POST /api/growing-guide
│       └── organic.js           # POST /api/organic-farming
│
└── frontend/                    # React + Vite SPA
    ├── src/
    │   ├── App.jsx              # Router setup, route definitions
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── Recommend.jsx    # Main prediction form + results
    │   │   ├── History.jsx      # Past predictions table
    │   │   ├── Login.jsx        # Login page
    │   │   └── Register.jsx     # Registration page
    │   └── components/
    │       ├── CropExplanationPanel.jsx  # Master results panel
    │       ├── ExplainabilityChart.jsx   # SHAP bar chart (Recharts)
    │       ├── RiskAnalysisCard.jsx      # Risk gauge + mitigations
    │       ├── SoilTestingCard.jsx       # Soil test / composition
    │       ├── SoilImprovementCard.jsx   # Fertilizer/amendment tips
    │       ├── RevenueCard.jsx           # Profit projection
    │       ├── FeasibilityCard.jsx       # Planting feasibility
    │       ├── GovernmentSchemesCard.jsx # Subsidy schemes
    │       ├── GrowingGuideCard.jsx      # Cultivation calendar
    │       ├── LabourPlannerCard.jsx     # Worker requirements
    │       ├── OrganicFarmingCard.jsx    # Organic farming info
    │       ├── Navbar.jsx               # Navigation bar
    │       ├── ProtectedRoute.jsx       # Auth guard HOC
    │       └── ...                      # UI utility components
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 5. Getting Started

### Prerequisites
- **Node.js** v18+ with npm
- **Python** 3.9+
- **MongoDB** running locally on port `27017`

### Step 1 — Start MongoDB
```bash
# From inside crop-recommendation-system/
mongod --dbpath ./mongo_data --logpath ./mongod.log --fork
```

### Step 2 — Set up and start the ML service
```bash
cd ml_model

# Create and activate the virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# (First time only) Train the model
python train_model.py

# Start the Flask server
python app.py
# Listening on http://localhost:5001
```

### Step 3 — Start the backend
```bash
cd backend
npm install
# Configure .env (see Environment Variables section)
node server.js
# Listening on http://localhost:5005
```

### Step 4 — Start the frontend
```bash
cd frontend
npm install
npm run dev
# Listening on http://localhost:5173
```

---

## 6. ML Model Service (Flask + Python)

### `app.py` — Prediction Server

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns `{"status": "ok"}` |
| `POST` | `/predict` | Run crop prediction + SHAP explanation |

**`POST /predict` — Request body (two modes):**

*Mode 1 — Expert inputs (raw numeric):*
```json
{
  "N": 90, "P": 42, "K": 43,
  "temperature": 20.9,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.0
}
```

*Mode 2 — Farmer-friendly (descriptive):*
```json
{
  "soil_type": "Loamy",
  "rainfall_level": "High",
  "humidity_level": "Medium",
  "season": "Monsoon",
  "temperature": 24
}
```

**Response:**
```json
{
  "crop": "rice",
  "confidence": 0.9712,
  "explanation": {
    "rainfall": 0.8421,
    "humidity": 0.4312,
    "N": -0.1524
  },
  "mapped_values": { "N": 94, "P": 52, "K": 48, "ph": 6.8, "rainfall": 240, "humidity": 62 }
}
```

> **SHAP explanation values** are raw SHAP scores for the predicted class. Positive = pushed toward this crop; negative = pushed away.

---

### `train_model.py` — Model Training

Reads `crop_data.csv`, encodes categorical columns, splits 80/20, trains an `XGBClassifier`, and saves:
- `crop_model.pkl` — trained XGBoost model
- `label_encoder.pkl` — decodes numeric class → crop name
- `season_encoder.pkl` — encodes season string → numeric

**To retrain after updating the dataset:**
```bash
cd ml_model && python train_model.py
```

---

### `soil_mapper.py` — Descriptive Input Translator

Maps farmer-friendly terms to agronomically grounded numeric values before inference.

| Input type | Values |
|---|---|
| `soil_type` | Clay, Sandy, Loamy, Black, Red, Alluvial |
| `rainfall_level` | Low (55mm), Medium (140mm), High (240mm) |
| `humidity_level` | Low (38%), Medium (62%), High (85%) |
| `season` | Monsoon, Summer, Winter, Spring (affects N/P/K multipliers) |

All outputs are clamped to the Kaggle dataset ranges to prevent out-of-distribution inference.

---

## 7. Backend API (Node.js/Express)

The server runs on port **5005** and serves all routes under `/api`.

### Authentication Routes (`/api/auth/`)

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ username, password }` | Register a new user. Returns JWT token. |
| `POST` | `/api/auth/login` | `{ username, password }` | Login. Returns JWT token. |

**JWT tokens** are signed with `JWT_SECRET`, expire in 7 days, and carry `{ userId, username }`.  
Passwords are hashed with `bcryptjs` (10 rounds).

---

### Prediction & History Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/recommend` | Proxies inputs to Flask, saves result to MongoDB, returns prediction. |
| `GET` | `/api/history` | Returns all historical predictions (newest first). |
| `DELETE` | `/api/history/:id` | Deletes a specific prediction record by MongoDB `_id`. |

---

### Analysis Routes

All analysis routes are `POST` and accept `crop` plus contextual fields in the request body.

| Route | Purpose | Key inputs |
|---|---|---|
| `POST /api/confidence-risk` | Risk score, risk level, mitigation steps | `crop, confidence, soil_type, rainfall_level, humidity_level, season, temperature` |
| `POST /api/soil-analysis` | Soil composition analysis | `soil_type, N, P, K, ph` |
| `POST /api/soil-improvement` | Fertilizer and amendment recommendations | `soil_type, crop` |
| `POST /api/revenue-estimate` | Estimated revenue / profit for the crop | `crop, area_hectares` |
| `POST /api/feasibility` | Planting feasibility score | `crop, soil_type, season, rainfall_level` |
| `POST /api/government-schemes` | Govt subsidy schemes linked to the crop | `crop` |
| `POST /api/labour-plan` | Estimated labour requirements by phase | `crop, area_hectares` |
| `POST /api/growing-guide` | Month-by-month cultivation calendar | `crop, season` |
| `POST /api/organic-farming` | Organic farming practices for the crop | `crop, soil_type` |

---

### Risk Assessment Logic (`risk.js`)

The risk score starts from `(1 - confidence) × 100` and adds:

| Condition | Extra score | Risk factor added |
|---|---|---|
| Water-intensive crop + Low rainfall | +25 | Water risk |
| Temperature > 38°C | +20 | Heat stress risk |
| Temperature < 12°C | +20 | Cold stress risk |
| Sandy soil + water-intensive crop | +15 | Drainage risk |
| Low humidity + Summer season | +15 | Drought risk |
| Confidence < 0.70 | +10 | Model uncertainty risk |

**Risk levels:** Low (green) → Moderate (yellow) → High (orange) → Very High (red)

---

## 8. Frontend (React/Vite)

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing page with hero section |
| `/recommend` | `Recommend.jsx` | Dual-mode input form + full results panel |
| `/history` | `History.jsx` | Past predictions table with delete |
| `/login` | `Login.jsx` | JWT login form |
| `/register` | `Register.jsx` | User registration form |

### Key Components

| Component | Purpose |
|---|---|
| `CropExplanationPanel` | Orchestrates all result sub-cards after a prediction |
| `ExplainabilityChart` | Recharts horizontal bar chart of SHAP values |
| `RiskAnalysisCard` | Circular progress gauge, risk badges, mitigation list |
| `SoilTestingCard` | Visual soil composition breakdown |
| `SoilImprovementCard` | Nutrient gap analysis and amendment tips |
| `RevenueCard` | Revenue/cost/profit projection tables |
| `FeasibilityCard` | Feasibility score with radar |
| `GovernmentSchemesCard` | Scheme list with eligibility |
| `GrowingGuideCard` | Monthly cultivation steps |
| `LabourPlannerCard` | Phase-wise labour estimates |
| `OrganicFarmingCard` | Organic tips per crop |
| `ProtectedRoute` | Redirects to `/login` if no JWT stored |
| `Navbar` | Navigation with auth state awareness |

### State Management

Auth state (JWT token, username) is managed via React Context (`context/`) and persisted in `localStorage`.

---

## 9. API Reference

### Quick test with curl

**Register:**
```bash
curl -X POST http://localhost:5005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"farmer1","password":"secure123"}'
```

**Predict (expert mode):**
```bash
curl -X POST http://localhost:5005/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"N":90,"P":42,"K":43,"temperature":20.9,"humidity":82,"ph":6.5,"rainfall":202}'
```

**Predict (farmer mode):**
```bash
curl -X POST http://localhost:5005/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"soil_type":"Loamy","rainfall_level":"High","humidity_level":"Medium","season":"Monsoon","temperature":24}'
```

**Risk assessment:**
```bash
curl -X POST http://localhost:5005/api/confidence-risk \
  -H "Content-Type: application/json" \
  -d '{"crop":"rice","confidence":0.72,"soil_type":"Sandy","rainfall_level":"Low","humidity_level":"Low","season":"Summer","temperature":40}'
```

**History:**
```bash
curl http://localhost:5005/api/history
```

---

## 10. XAI — Explainable AI Design

AGRO.XAI uses **SHAP TreeExplainer** (optimal for tree-based models like XGBoost) to generate additive feature attributions for every prediction.

### How it works

1. After XGBoost predicts a class, SHAP computes a contribution score for each feature.
2. A positive SHAP value means the feature pushed the model *toward* the predicted crop.
3. A negative SHAP value means the feature pushed the model *away* from it.
4. The top 3 features by absolute SHAP value are returned as the explanation.

### Why XGBoost + SHAP?

| Property | Benefit for AGRO.XAI |
|---|---|
| High accuracy on tabular data | Kaggle crop dataset is fully tabular — XGBoost excels here |
| Handles class imbalance | Dataset has 22 crop classes; XGBoost is robust |
| Feature importance built-in | Aligns with SHAP-based transparency |
| SHAP TreeExplainer support | Fast, exact explanation computation for tree models |
| Robust to missing/skewed features | Real-world soil data is often imperfect |

### Interpretation guide for users

| SHAP value sign | Meaning |
|---|---|
| Large positive | This factor strongly favours the predicted crop |
| Near zero | This factor had little influence |
| Large negative | This factor was unfavourable, but outweighed |

The `ExplainabilityChart` component renders these as a colour-coded horizontal bar chart for non-technical users.

---

## 11. Environment Variables

### `backend/.env`

```env
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/cropdb
JWT_SECRET=your_very_secret_key_here
FLASK_URL=http://localhost:5001
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5005` | Node.js server port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/cropdb` | MongoDB connection string |
| `JWT_SECRET` | *(required)* | Secret for signing JWT tokens |
| `FLASK_URL` | `http://localhost:5001` | URL of the Flask ML service |

> ⚠️ **Never commit `.env` to version control.** The file is gitignored.

---

## Detailed Documentation

For deeper dives into each layer, see the `docs/` folder:

| Document | Contents |
|---|---|
| [`docs/ML_MODEL.md`](docs/ML_MODEL.md) | Dataset ranges, training steps, SHAP internals, soil mapper lookup tables |
| [`docs/BACKEND.md`](docs/BACKEND.md) | All 11 API routes with full request/response schemas, MongoDB models, auth flow, risk scoring algorithm |
| [`docs/FRONTEND.md`](docs/FRONTEND.md) | Pages, components, auth context, library list |

---

## Port Summary

| Service | Port |
|---|---|
| React Frontend (Vite dev) | `5173` |
| Node.js Backend (Express) | `5005` |
| Flask ML Server | `5001` |
| MongoDB | `27017` |

---

*Documentation generated: March 2026 — AGRO.XAI v1.0*
