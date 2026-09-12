# AapdaSathi — Member 3: Relief Intelligence & Distribution

This module delivers the complete **Relief Intelligence & Matching AI Layer** for the AapdaSathi disaster response system for North Eastern India (NER).

---

## 📌 Ownership Boundary (Strict No-Overlap Plan)

| Feature / Layer | Owner | Integration with other members |
|---|---|---|
| **Relief Inventory Management** | **Member 3 (You)** | M4 persists to MongoDB Atlas; M1/M4 views records |
| **Citizen/Community Relief Request Workflow** | **Member 3 (You)** | M1 citizen app navigates to it; M4 validates & stores |
| **Shortage Calculation (`Required - Available`)** | **Member 3 (You)** | Real-time computed values shared across system |
| **Need-to-Relief AI Matching** | **Member 3 (You)** | Computes nearest source & distance; M4 approves allocation |
| **Delivery Lifecycle Tracking** | **Member 3 (You)** | `Requested` ➔ `Verified` ➔ `Assigned` ➔ `In Transit` ➔ `Delivered` |
| **Relief Shortage Heatmap Logic** | **Member 3 (You)** | M2 maps the coordinates & severity levels on base map |
| **Essential Coverage Score ("No One Left Without Essentials")**| **Member 3 (You)** | Displayed on M4 authority dashboard & M1 citizen app |
| **Predictive Relief Demand Forecasting** | **Member 3 (You)** | 24-72h AI forecasting engine predicting shortages before stockouts |

---

## 🚀 Directory Structure

```
AapdaSathi/
├── frontend/
│   └── relief/               # Member 3 UI (React + TypeScript + Tailwind CSS)
│       ├── src/
│       │   ├── components/   # Modular Relief Intelligence UI Widgets
│       │   ├── services/     # API Service Client (M3 Engine + M4 Ready)
│       │   ├── types/        # Typed Data Models matching SRS Section 30
│       │   └── App.tsx       # Main Relief Intelligence Workstation
├── ai/
│   └── relief-demand/        # Member 3 AI & Matching Logic Microservice
│       ├── relief_engine.py  # Algorithms for Priority Scoring, Haversine Matching, Forecasting
│       ├── api_server.py     # Zero-dependency HTTP server for the AI engine (port 5003)
│       └── test_relief_engine.py # Automated unit test suite
└── shared/
    ├── relief-contracts.json # OpenAPI/JSON Schemas for Member 4 backend
    └── README.md             # This guide
```

---

## 🔗 Quick Start

### 1. Run AI Microservice (Python)
```powershell
cd C:\Users\Vinya\OneDrive\Desktop\AapdaSathi\ai\relief-demand
python api_server.py
# Running on http://localhost:5003
```

### 2. Run Relief Intelligence Frontend (React + Vite)
```powershell
cd C:\Users\Vinya\OneDrive\Desktop\AapdaSathi\frontend\relief
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🤝 Handoff for Member 4 (Backend + Database)
Member 4 needs to implement the routes defined in `shared/relief-contracts.json`.
In the meantime, the frontend includes a live in-memory / mock engine so M3 functions 100% standalone out of the box!
