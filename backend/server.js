import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let mongoConnected = false;

// -------------------- DEMO DATA --------------------
const alerts = [
  {
    id: "A001",
    type: "Heavy Rainfall",
    severity: "HIGH",
    state: "Assam",
    district: "Kamrup",
    description: "Heavy rainfall expected. Avoid low-lying areas.",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "A002",
    type: "Flood",
    severity: "CRITICAL",
    state: "Assam",
    district: "Dibrugarh",
    description: "Flood conditions reported in affected areas.",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "A003",
    type: "Landslide",
    severity: "MODERATE",
    state: "Sikkim",
    district: "Gangtok",
    description: "Landslide risk on hilly roads.",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  }
];

const shelters = [
  {
    id: "S001",
    name: "Community Relief Centre",
    state: "Assam",
    district: "Kamrup",
    capacity: 200,
    occupied: 120,
    food: true,
    water: true,
    medical: true,
    latitude: 26.1445,
    longitude: 91.7362
  },
  {
    id: "S002",
    name: "Government School Shelter",
    state: "Assam",
    district: "Kamrup",
    capacity: 300,
    occupied: 180,
    food: true,
    water: true,
    medical: false,
    latitude: 26.1500,
    longitude: 91.7400
  },
  {
    id: "S003",
    name: "Emergency Care Centre",
    state: "Assam",
    district: "Kamrup",
    capacity: 150,
    occupied: 150,
    food: true,
    water: true,
    medical: true,
    latitude: 26.1350,
    longitude: 91.7300
  }
];

const inventory = [
  { id: "R001", item: "Rice", category: "Food", quantity: 8500, unit: "kg", source: "Government Warehouse" },
  { id: "R002", item: "Drinking Water", category: "Water", quantity: 12000, unit: "litres", source: "Relief Centre" },
  { id: "R003", item: "Medicines", category: "Medicine", quantity: 3200, unit: "units", source: "Health Department" },
  { id: "R004", item: "Blankets", category: "Shelter", quantity: 1400, unit: "units", source: "NGO" },
  { id: "R005", item: "First Aid Kits", category: "Medicine", quantity: 650, unit: "kits", source: "NGO" }
];

const requests = [];
const deliveries = [];

// -------------------- HEALTH --------------------
app.get("/api/health", async (req, res) => {
  res.json({
    status: "healthy",
    service: "AapdaSathi Central Backend",
    mongo: mongoConnected,
    timestamp: new Date().toISOString()
  });
});

// -------------------- ALERTS --------------------
app.get("/api/alerts", (req, res) => {
  const { state, severity } = req.query;

  let result = [...alerts];

  if (state) {
    result = result.filter(a => a.state.toLowerCase() === state.toLowerCase());
  }

  if (severity) {
    result = result.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
  }

  res.json({ success: true, count: result.length, data: result });
});

app.post("/api/alerts", (req, res) => {
  const alert = {
    id: `A${String(alerts.length + 1).padStart(3, "0")}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };

  alerts.push(alert);
  res.status(201).json({ success: true, data: alert });
});

// -------------------- SHELTERS --------------------
app.get("/api/shelters", (req, res) => {
  res.json({
    success: true,
    count: shelters.length,
    data: shelters.map(s => ({
      ...s,
      available: Math.max(s.capacity - s.occupied, 0)
    }))
  });
});

// -------------------- INVENTORY --------------------
app.get("/api/relief/inventory", (req, res) => {
  res.json({ success: true, data: inventory });
});

// -------------------- RELIEF REQUESTS --------------------
app.get("/api/relief/requests", (req, res) => {
  res.json({ success: true, data: requests });
});

app.post("/api/relief/requests", (req, res) => {
  const body = req.body || {};

  const population = Number(body.population || 0);
  const urgency = Number(body.urgency || 1);
  const shortage = Number(body.shortage || 1);
  const accessibility = Number(body.accessibility || 1);
  const vulnerability = Number(body.vulnerability || 1);

  const priority = Math.round(
    population * 0.30 +
    urgency * 20 +
    shortage * 20 +
    accessibility * 10 +
    vulnerability * 10
  );

  const request = {
    id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
    item: body.item || "Unknown",
    category: body.category || "General",
    quantity: Number(body.quantity || 0),
    unit: body.unit || "units",
    state: body.state || "Assam",
    district: body.district || "Kamrup",
    population,
    urgency,
    shortage,
    accessibility,
    vulnerability,
    priority: Math.min(priority, 100),
    status: "Pending Verification",
    createdAt: new Date().toISOString()
  };

  requests.push(request);

  res.status(201).json({ success: true, data: request });
});

// -------------------- PRIORITY SCORE --------------------
app.post("/api/relief/priority-score", (req, res) => {
  const b = req.body || {};

  const population = Number(b.population || 0);
  const urgency = Number(b.urgency || 0);
  const shortage = Number(b.shortage || 0);
  const accessibility = Number(b.accessibility || 0);
  const vulnerability = Number(b.vulnerability || 0);

  const score = Math.min(
    100,
    Math.round(
      population * 0.3 +
      urgency * 20 +
      shortage * 20 +
      accessibility * 10 +
      vulnerability * 10
    )
  );

  res.json({
    success: true,
    score,
    priority:
      score >= 80 ? "CRITICAL" :
      score >= 60 ? "HIGH" :
      score >= 40 ? "MODERATE" : "LOW"
  });
});

// -------------------- AI MATCHING --------------------
app.post("/api/relief/match-need", (req, res) => {
  const body = req.body || {};
  const requestedCategory = String(body.category || "").toLowerCase();
  const requestedQuantity = Number(body.quantity || 0);

  const candidates = inventory.filter(item =>
    item.category.toLowerCase() === requestedCategory &&
    item.quantity > 0
  );

  candidates.sort((a, b) => b.quantity - a.quantity);

  const selected = candidates[0];

  if (!selected) {
    return res.json({
      success: true,
      matched: false,
      message: "No suitable resource is currently available.",
      data: null
    });
  }

  const allocated = Math.min(selected.quantity, requestedQuantity);

  res.json({
    success: true,
    matched: true,
    data: {
      source: selected.source,
      item: selected.item,
      available: selected.quantity,
      requested: requestedQuantity,
      allocated,
      matchScore: 92
    }
  });
});

// -------------------- DELIVERY --------------------
app.get("/api/relief/deliveries", (req, res) => {
  res.json({ success: true, data: deliveries });
});

app.post("/api/relief/deliveries", (req, res) => {
  const delivery = {
    id: `DEL-${String(deliveries.length + 1).padStart(3, "0")}`,
    ...req.body,
    status: req.body.status || "Assigned",
    createdAt: new Date().toISOString()
  };

  deliveries.push(delivery);
  res.status(201).json({ success: true, data: delivery });
});

app.patch("/api/relief/deliveries/:id", (req, res) => {
  const delivery = deliveries.find(d => d.id === req.params.id);

  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: "Delivery not found"
    });
  }

  Object.assign(delivery, req.body);

  res.json({ success: true, data: delivery });
});

// -------------------- COVERAGE --------------------
app.post("/api/relief/coverage-score", (req, res) => {
  const b = req.body || {};

  const food = Number(b.food || 0);
  const water = Number(b.water || 0);
  const medicine = Number(b.medicine || 0);
  const shelter = Number(b.shelter || 0);
  const sanitation = Number(b.sanitation || 0);

  const score = Math.round(
    (food + water + medicine + shelter + sanitation) / 5
  );

  res.json({
    success: true,
    score: Math.min(score, 100),
    gaps: [
      ["Food", food],
      ["Water", water],
      ["Medicine", medicine],
      ["Shelter", shelter],
      ["Sanitation", sanitation]
    ]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(x => x[0])
  });
});

// -------------------- DEMAND FORECAST --------------------
app.post("/api/relief/demand-forecast", (req, res) => {
  const b = req.body || {};

  const population = Number(b.population || 0);
  const days = Number(b.days || 3);
  const severity = String(b.severity || "HIGH").toUpperCase();

  const severityMultiplier =
    severity === "CRITICAL" ? 1.5 :
    severity === "HIGH" ? 1.25 :
    severity === "MODERATE" ? 1.0 : 0.75;

  const food = Math.round(population * 1.0 * days * severityMultiplier);
  const water = Math.round(population * 1.5 * days * severityMultiplier);

  res.json({
    success: true,
    forecast: {
      foodPackets: food,
      waterLitres: water,
      days,
      severity,
      population
    }
  });
});

// -------------------- STATE ANALYTICS --------------------
app.get("/api/analytics/overview", (req, res) => {
  res.json({
    success: true,
    data: {
      totalActiveAlerts: alerts.filter(a => a.status === "ACTIVE").length,
      criticalAlerts: alerts.filter(a => a.severity === "CRITICAL").length,
      mobileAppUsers: 12640,
      smsDisseminated: 18420,
      activeDisasters: 3,
      reliefCamps: shelters.length,
      reliefItemsDistributed: 21850,
      peopleRequiringAssistance: 6840,
      pendingReliefRequests: requests.filter(r => r.status === "Pending Verification").length
    }
  });
});

// -------------------- SIMPLE USER LOGIN --------------------
app.post("/api/auth/login", (req, res) => {
  const mobile = String(req.body?.mobile || "").replace(/\D/g, "");

  if (mobile.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid 10-digit mobile number."
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      mobile,
      role: "citizen"
    }
  });
});

// -------------------- OPTIONAL MONGODB --------------------
async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.log("MongoDB URI not configured. Running in demo mode.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoConnected = true;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.log("MongoDB connection failed. Continuing in demo mode.");
    console.log(error.message);
  }
}

app.listen(PORT, async () => {
  await connectMongo();
  console.log(`AapdaSathi backend running at http://localhost:${PORT}`);
});
