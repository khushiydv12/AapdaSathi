import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./App.css";

/* =========================================================
   LEAFLET ICON FIX
   ========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   DEMO DATA
   ========================================================= */

const shelters = [
  {
    id: 1,
    name: "Shillong Relief Centre",
    location: "Shillong, Meghalaya",
    distance: "1.8 km",
    capacity: 250,
    occupied: 92,
    medical: true,
    food: true,
    water: true,
  },
  {
    id: 2,
    name: "Guwahati Community Shelter",
    location: "Guwahati, Assam",
    distance: "3.2 km",
    capacity: 400,
    occupied: 148,
    medical: true,
    food: true,
    water: true,
  },
  {
    id: 3,
    name: "Gangtok Emergency Shelter",
    location: "Gangtok, Sikkim",
    distance: "4.5 km",
    capacity: 180,
    occupied: 76,
    medical: true,
    food: true,
    water: true,
  },
];

const alertsData = [
  {
    id: 1,
    type: "Heavy Rainfall",
    location: "Meghalaya",
    severity: "HIGH",
    time: "10 min ago",
    icon: "🌧️",
    message:
      "Heavy rainfall is expected. Avoid low-lying areas and monitor official updates.",
  },
  {
    id: 2,
    type: "Landslide Risk",
    location: "East Khasi Hills",
    severity: "CRITICAL",
    time: "24 min ago",
    icon: "⛰️",
    message:
      "High landslide probability detected near vulnerable slopes. Avoid unnecessary travel.",
  },
  {
    id: 3,
    type: "Flood Watch",
    location: "Assam",
    severity: "MODERATE",
    time: "1 hr ago",
    icon: "🌊",
    message:
      "Water levels are rising in selected areas. Stay prepared for evacuation instructions.",
  },
];

const emergencyContacts = [
  {
    name: "Emergency Services",
    number: "112",
    icon: "🚨",
  },
  {
    name: "Police",
    number: "100",
    icon: "👮",
  },
  {
    name: "Ambulance",
    number: "108",
    icon: "🚑",
  },
  {
    name: "Fire Services",
    number: "101",
    icon: "🚒",
  },
];

/* =========================================================
   LOGIN
   ========================================================= */

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userMobile", mobile);

    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="disaster-panel rainfall-panel">
          <span className="disaster-panel-icon">🌧️</span>
          <h2>Heavy Rainfall</h2>
          <p>Stay alert during extreme weather</p>
          <div className="rain-lines">⋮ ⋮ ⋮ ⋮ ⋮</div>
        </div>

        <div className="disaster-panel earthquake-panel">
          <span className="disaster-panel-icon">🌍</span>
          <h2>Earthquake</h2>
          <p>Drop, cover and hold</p>
          <div className="wave-lines">〰〰〰</div>
        </div>

        <div className="disaster-panel flood-panel">
          <span className="disaster-panel-icon">🌊</span>
          <h2>Flood</h2>
          <p>Avoid flooded roads and low areas</p>
          <div className="wave-lines">〰〰〰〰</div>
        </div>

        <div className="disaster-panel landslide-panel">
          <span className="disaster-panel-icon">⛰️</span>
          <h2>Landslide</h2>
          <p>Stay away from unstable slopes</p>
          <div className="landslide-dots">● ● ●</div>
        </div>
      </div>

      <div className="login-overlay" />

      <div className="login-card">
        <div className="login-logo">🛡️</div>

        <h1>AapdaSathi</h1>

        <p className="login-subtitle">
          Intelligent Disaster Safety Platform
        </p>

        <div className="login-divider" />

        <h2>Welcome Back</h2>

        <p className="login-description">
          Stay informed. Stay prepared. Stay safe.
        </p>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <label htmlFor="mobile">Mobile Number</label>

          <div className="mobile-input-wrapper">
            <span className="country-code">+91</span>

            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={mobile}
              placeholder="Enter mobile number"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setMobile(value);
                setError("");
              }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="continue-button">
            Continue
            <span>→</span>
          </button>
        </form>

        <p className="login-security">
          🔒 Your information is kept secure
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

function AppHeader({ title, subtitle }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">🛡️</div>

        <div>
          <h1>{title || "AapdaSathi"}</h1>

          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <Link to="/profile" className="header-profile">
        👤
      </Link>
    </header>
  );
}

/* =========================================================
   BOTTOM NAV
   ========================================================= */

function BottomNav() {
  const location = useLocation();

  const items = [
    {
      path: "/",
      icon: "⌂",
      label: "Home",
    },
    {
      path: "/alerts",
      icon: "🔔",
      label: "Alerts",
    },
    {
      path: "/sos",
      icon: "🆘",
      label: "SOS",
    },
    {
      path: "/shelters",
      icon: "🏠",
      label: "Shelters",
    },
    {
      path: "/profile",
      icon: "👤",
      label: "Profile",
    },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${active ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* =========================================================
   HOME
   ========================================================= */

function Home() {
  return (
    <div className="app-page">
      <AppHeader
        title="AapdaSathi"
        subtitle="Disaster Safety Platform"
      />

      <main className="page-content">

        <div className="location-strip">
          <span>📍</span>
          <span>North Eastern India</span>

          <span className="live-dot" />

          <span className="live-text">
            Monitoring
          </span>
        </div>

        {/* SAFETY CARD */}

        <section className="safety-card">
          <div className="safety-top">
            <div className="safety-icon">🛡️</div>

            <span className="safe-badge">
              LOW RISK
            </span>
          </div>

          <p className="eyebrow">
            CURRENT SAFETY STATUS
          </p>

          <h2>You are safe</h2>

          <p>
            No critical alerts have been detected
            in your current area.
          </p>

          <div className="safety-progress">
            <span />
          </div>

          <div className="safety-footer">
            <span>Risk level</span>
            <strong>Low</strong>
          </div>
        </section>

        {/* ACTIVE ALERT */}

        <section className="section-block">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">
                IMPORTANT
              </p>

              <h2>Active Alert</h2>
            </div>

            <Link to="/alerts">
              View all
            </Link>
          </div>

          <div className="alert-card">
            <div className="alert-icon large">
              🌧️
            </div>

            <div className="alert-card-content">
              <div className="alert-card-top">
                <span className="severity high">
                  HIGH
                </span>

                <span className="alert-time">
                  10 min ago
                </span>
              </div>

              <h3>Heavy Rainfall</h3>

              <p>Meghalaya</p>

              <span className="alert-message">
                Avoid low-lying areas and monitor
                official updates.
              </span>
            </div>
          </div>
        </section>

        {/* EMERGENCY */}

        <section className="emergency-banner">
          <div>
            <span className="emergency-label">
              EMERGENCY?
            </span>

            <h3>Need immediate help?</h3>

            <p>
              Send your location to emergency
              services.
            </p>
          </div>

          <Link
            to="/sos"
            className="sos-mini-button"
          >
            SOS
          </Link>
        </section>

        {/* QUICK ACTIONS */}

        <section className="section-block">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">
                CITIZEN SERVICES
              </p>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-grid">

            <Link
              to="/alerts"
              className="quick-card"
            >
              <div className="quick-icon alert-bg">
                🔔
              </div>

              <strong>Alerts</strong>

              <span>
                Warnings & updates
              </span>
            </Link>

            <Link
              to="/shelters"
              className="quick-card"
            >
              <div className="quick-icon shelter-bg">
                🏠
              </div>

              <strong>Shelters</strong>

              <span>
                Find safe places
              </span>
            </Link>

            <Link
              to="/map"
              className="quick-card"
            >
              <div className="quick-icon map-bg">
                🗺️
              </div>

              <strong>Safe Map</strong>

              <span>
                Risk & routes
              </span>
            </Link>

            <Link
              to="/sos"
              className="quick-card sos-card"
            >
              <div className="quick-icon sos-bg">
                🆘
              </div>

              <strong>SOS</strong>

              <span>
                Get emergency help
              </span>
            </Link>

          </div>
        </section>

        {/* OPERATIONS */}

        <section className="section-block">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">
                DISASTER MANAGEMENT
              </p>

              <h2>
                AapdaSathi Operations
              </h2>
            </div>
          </div>

          <div className="operations-grid">

            <Link
              to="/command-center"
              className="operation-card command-operation"
            >
              <div className="operation-icon">
                🛰️
              </div>

              <div className="operation-content">

                <div className="operation-badge">
                  HAZARD MONITORING
                </div>

                <h3>
                  Risk Command Center
                </h3>

                <p>
                  Monitor hazards, rainfall,
                  affected districts and risk zones.
                </p>

                <span>
                  Open Command Center →
                </span>

              </div>
            </Link>

            <Link
              to="/relief"
              className="operation-card relief-operation"
            >
              <div className="operation-icon">
                📦
              </div>

              <div className="operation-content">

                <div className="operation-badge">
                  RELIEF MANAGEMENT
                </div>

                <h3>
                  Relief Intelligence
                </h3>

                <p>
                  Manage requests, inventory,
                  matching and relief deliveries.
                </p>

                <span>
                  Open Relief Center →
                </span>

              </div>
            </Link>

          </div>
        </section>

        {/* AI RISK */}

        <section className="ai-card">
          <div className="ai-icon">
            ✨
          </div>

          <div className="ai-content">

            <div className="ai-heading">
              <span>
                AI RISK ASSESSMENT
              </span>

              <small>
                DEMO
              </small>
            </div>

            <h3>
              Current area risk is low
            </h3>

            <p>
              AapdaSathi analyses weather,
              terrain and disaster signals
              to estimate local risk.
            </p>

            <div className="ai-stats">

              <div>
                <strong>24%</strong>
                <span>Risk</span>
              </div>

              <div>
                <strong>76%</strong>
                <span>Confidence</span>
              </div>

            </div>

          </div>
        </section>

        {/* NEAREST SHELTER */}

        <section className="section-block">
          <div className="section-title-row">

            <div>
              <p className="eyebrow">
                EMERGENCY RESPONSE
              </p>

              <h2>
                Nearest Shelter
              </h2>
            </div>

            <Link to="/shelters">
              See all
            </Link>

          </div>

          <div className="shelter-preview">

            <div className="shelter-preview-icon">
              🏠
            </div>

            <div className="shelter-preview-content">

              <h3>
                Shillong Relief Centre
              </h3>

              <p>
                📍 Shillong, Meghalaya
              </p>

              <div className="shelter-meta">
                <span>
                  1.8 km away
                </span>

                <span className="available">
                  ● Capacity available
                </span>
              </div>

            </div>

            <Link
              to="/shelters"
              className="round-arrow"
            >
              →
            </Link>

          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}

/* =========================================================
   ALERTS
   ========================================================= */

function Alerts() {
  const [filter, setFilter] = useState("ALL");

  const filteredAlerts =
    filter === "ALL"
      ? alertsData
      : alertsData.filter(
          (alert) =>
            alert.severity === filter
        );

  return (
    <div className="app-page">

      <AppHeader
        title="Alerts"
        subtitle="Disaster warnings & updates"
      />

      <main className="page-content">

        <div className="alert-summary">

          <div className="summary-icon">
            🔔
          </div>

          <div>
            <strong>
              3 Active Alerts
            </strong>

            <span>
              Across North Eastern India
            </span>
          </div>

        </div>

        <div className="filter-row">

          {["ALL", "CRITICAL", "HIGH", "MODERATE"].map(
            (item) => (
              <button
                key={item}
                className={`filter-button ${
                  filter === item ? "active" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {item === "ALL"
                  ? "All"
                  : item.charAt(0) +
                    item.slice(1).toLowerCase()}
              </button>
            )
          )}

        </div>

        <div className="alerts-list">

          {filteredAlerts.map((alert) => (

            <div
              className={`full-alert ${
                alert.severity.toLowerCase()
              }`}
              key={alert.id}
            >

              <div className="full-alert-icon">
                {alert.icon}
              </div>

              <div className="full-alert-content">

                <div className="full-alert-top">

                  <span
                    className={`severity ${
                      alert.severity.toLowerCase()
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <span>
                    {alert.time}
                  </span>

                </div>

                <h3>
                  {alert.type}
                </h3>

                <p className="alert-location">
                  📍 {alert.location}
                </p>

                <p>
                  {alert.message}
                </p>

                <button className="alert-action">
                  View details →
                </button>

              </div>
            </div>
          ))}

        </div>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   SHELTERS
   ========================================================= */

function Shelters() {
  return (
    <div className="app-page">

      <AppHeader
        title="Safe Shelters"
        subtitle="Nearby emergency centres"
      />

      <main className="page-content">

        <div className="shelter-info">

          <span>🏠</span>

          <div>
            <strong>
              3 shelters available
            </strong>

            <p>
              Showing emergency centres near
              your selected region.
            </p>
          </div>

        </div>

        <div className="shelters-list">

          {shelters.map((shelter) => {

            const occupancy =
              Math.round(
                (shelter.occupied /
                  shelter.capacity) *
                  100
              );

            const directionsUrl =
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                shelter.name +
                  " " +
                  shelter.location
              )}`;

            return (
              <div
                className="shelter-card"
                key={shelter.id}
              >

                <div className="shelter-card-header">

                  <div className="shelter-icon">
                    🏠
                  </div>

                  <div>

                    <h3>
                      {shelter.name}
                    </h3>

                    <p>
                      📍 {shelter.location}
                    </p>

                  </div>

                  <span className="distance">
                    {shelter.distance}
                  </span>

                </div>

                <div className="occupancy">

                  <div className="occupancy-top">

                    <span>
                      Occupancy
                    </span>

                    <strong>
                      {occupancy}%
                    </strong>

                  </div>

                  <div className="occupancy-bar">
                    <span
                      style={{
                        width: `${occupancy}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="facility-row">

                  {shelter.food && (
                    <span>
                      🍱 Food
                    </span>
                  )}

                  {shelter.water && (
                    <span>
                      💧 Water
                    </span>
                  )}

                  {shelter.medical && (
                    <span>
                      ⚕️ Medical
                    </span>
                  )}

                </div>

                <a
                  className="directions-button"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📍 Get Directions
                </a>

              </div>
            );
          })}

        </div>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   SOS
   ========================================================= */

function Sos() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendSOS = () => {
    setSending(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "SOS location:",
            position.coords.latitude,
            position.coords.longitude
          );

          setTimeout(() => {
            setSending(false);
            setSent(true);
          }, 1200);
        },
        () => {
          setTimeout(() => {
            setSending(false);
            setSent(true);
          }, 1200);
        }
      );
    } else {
      setTimeout(() => {
        setSending(false);
        setSent(true);
      }, 1200);
    }
  };

  return (
    <div className="app-page sos-page">

      <AppHeader
        title="Emergency SOS"
        subtitle="Request immediate assistance"
      />

      <main className="page-content">

        <section className="sos-intro">

          <div className="sos-status">
            <span />
            Emergency assistance
          </div>

          <h2>
            Are you in danger?
          </h2>

          <p>
            Press the SOS button to send your
            location and request emergency help.
          </p>

        </section>

        <div className="sos-button-wrapper">

          <button
            className={`sos-big-button ${
              sending ? "sending" : ""
            }`}
            onClick={sendSOS}
            disabled={sending}
          >
            <span className="sos-inner">
              {sending ? "..." : "SOS"}
            </span>
          </button>

        </div>

        {sent && (
          <div className="sos-success">

            <span>✓</span>

            <div>
              <strong>
                Emergency alert prepared
              </strong>

              <p>
                Your location has been detected.
                Connect with emergency services
                immediately if needed.
              </p>
            </div>

          </div>
        )}

        <section className="emergency-contacts">

          <div className="section-title-row">

            <div>
              <p className="eyebrow">
                QUICK HELP
              </p>

              <h2>
                Emergency Contacts
              </h2>
            </div>

          </div>

          <div className="contacts-grid">

            {emergencyContacts.map(
              (contact) => (

                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="emergency-contact"
                >

                  <span>
                    {contact.icon}
                  </span>

                  <div>

                    <strong>
                      {contact.name}
                    </strong>

                    <small>
                      {contact.number}
                    </small>

                  </div>

                  <b>☎</b>

                </a>
              )
            )}

          </div>

        </section>

        <div className="sos-note">

          <span>⚠️</span>

          <p>
            Only use SOS during a genuine emergency.
            This prototype demonstrates the emergency
            workflow.
          </p>

        </div>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   MAP
   ========================================================= */

function MapCenter({ center }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 7, {
      duration: 1,
    });
  }, [center, map]);

  return null;
}

function SafetyMap() {
  const [center, setCenter] = useState([
    26.2006,
    92.9376,
  ]);

  const locations = [
    {
      name: "Shillong",
      position: [25.5788, 91.8933],
      risk: "HIGH",
    },
    {
      name: "Guwahati",
      position: [26.1445, 91.7362],
      risk: "MODERATE",
    },
    {
      name: "Gangtok",
      position: [27.3389, 88.6065],
      risk: "LOW",
    },
  ];

  return (
    <div className="app-page">

      <AppHeader
        title="Safety Map"
        subtitle="Risk zones & emergency locations"
      />

      <main className="map-page-content">

        <div className="map-toolbar">

          <button
            className="map-location-button"
            onClick={() =>
              setCenter([
                26.2006,
                92.9376,
              ])
            }
          >
            📍 North East
          </button>

          <Link
            to="/shelters"
            className="map-action-button"
          >
            🏠 Shelters
          </Link>

        </div>

        <div className="map-container">

          <MapContainer
            center={center}
            zoom={7}
            scrollWheelZoom={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          >

            <MapCenter center={center} />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((location) => {

              const riskColor =
                location.risk === "HIGH"
                  ? "#ef4444"
                  : location.risk === "MODERATE"
                  ? "#f59e0b"
                  : "#22c55e";

              return (
                <React.Fragment
                  key={location.name}
                >

                  <Circle
                    center={location.position}
                    radius={35000}
                    pathOptions={{
                      color: riskColor,
                      fillColor: riskColor,
                      fillOpacity: 0.18,
                    }}
                  />

                  <Marker
                    position={location.position}
                  >
                    <Popup>

                      <strong>
                        {location.name}
                      </strong>

                      <br />

                      Risk:{" "}
                      <b>
                        {location.risk}
                      </b>

                    </Popup>
                  </Marker>

                </React.Fragment>
              );
            })}

          </MapContainer>

        </div>

        <div className="map-legend">

          <span>
            <i className="legend-dot critical" />
            High Risk
          </span>

          <span>
            <i className="legend-dot moderate" />
            Moderate
          </span>

          <span>
            <i className="legend-dot safe" />
            Low Risk
          </span>

        </div>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   COMMAND CENTER
   ========================================================= */

function CommandCenter() {
  return (
    <div className="app-page">

      <AppHeader
        title="Command Center"
        subtitle="Risk & hazard intelligence"
      />

      <main className="page-content">

        <div className="module-hero command-hero">

          <div className="module-hero-icon">
            🛰️
          </div>

          <div>

            <span className="module-label">
              AAPDASATHI OPERATIONS
            </span>

            <h2>
              Dynamic Hazard Command Center
            </h2>

            <p>
              Monitor rainfall, hazards, roads,
              affected regions and risk zones.
            </p>

          </div>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <span>🚨</span>
            <strong>03</strong>
            <small>Active Alerts</small>
          </div>

          <div className="stat-card">
            <span>🔴</span>
            <strong>01</strong>
            <small>Critical Zone</small>
          </div>

          <div className="stat-card">
            <span>🌧️</span>
            <strong>04</strong>
            <small>Weather Risks</small>
          </div>

          <div className="stat-card">
            <span>🚧</span>
            <strong>07</strong>
            <small>Road Issues</small>
          </div>

        </div>

        <section className="demo-command-panel">

          <div className="panel-heading">

            <div>
              <p className="eyebrow">
                HAZARD MONITOR
              </p>

              <h2>
                Current Risk Zones
              </h2>
            </div>

            <span className="live-badge">
              ● LIVE
            </span>

          </div>

          <div className="risk-zone">

            <div className="risk-zone-icon">
              🔴
            </div>

            <div>
              <strong>
                East Khasi Hills
              </strong>

              <p>
                Landslide & Flash Flood
              </p>
            </div>

            <span className="critical-tag">
              CRITICAL
            </span>

          </div>

          <div className="risk-zone">

            <div className="risk-zone-icon">
              🟠
            </div>

            <div>
              <strong>
                Tawang
              </strong>

              <p>
                Slope Instability
              </p>
            </div>

            <span className="high-tag">
              HIGH
            </span>

          </div>

          <Link
            to="/map"
            className="full-button"
          >
            Open Safety Map →
          </Link>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   RELIEF INTELLIGENCE
   ========================================================= */

function Relief() {
  return (
    <div className="app-page module-page relief-integration-page">

      {/* Header */}
      <header className="module-header">
        <Link to="/" className="back-button">
          ←
        </Link>

        <div>
          <span className="module-label">
            AAPDASATHI OPERATIONS
          </span>

          <h1>Relief Intelligence</h1>

          <p>
            AI-powered relief distribution and resource management
          </p>
        </div>
      </header>

      {/* Connected Relief Application */}
      <section className="relief-connected-container">

        <div className="relief-connected-bar">

          <div className="connected-status">
            <span className="connected-dot"></span>

            <div>
              <strong>Relief Intelligence Online</strong>

              <small>
                Relief management system connected successfully
              </small>
            </div>
          </div>

          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            className="open-relief-button"
          >
            Open Fullscreen ↗
          </a>

        </div>

        {/* Relief application */}
        <div className="relief-app-frame">
          <iframe
            src="http://localhost:5174"
            title="Relief Intelligence"
            className="relief-iframe"
          />
        </div>

      </section>

    </div>
  );
}

/* =========================================================
   MEDICAL
   ========================================================= */

function Medical() {
  const [saved, setSaved] = useState(false);

  const saveInformation = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="app-page">

      <AppHeader
        title="Medical"
        subtitle="Emergency medical information"
      />

      <main className="page-content">

        <div className="info-card blue-info">

          <span>🩺</span>

          <div>

            <strong>
              Keep important medical information
              available during emergencies.
            </strong>

            <p>
              This information can help emergency
              responders provide appropriate care.
            </p>

          </div>

        </div>

        <div className="form-card">

          <label>
            Blood Group
          </label>

          <select defaultValue="">
            <option value="" disabled>
              Select blood group
            </option>

            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <label>
            Allergies
          </label>

          <textarea
            placeholder="Enter any known allergies"
          />

          <label>
            Medical Conditions
          </label>

          <textarea
            placeholder="Enter important medical conditions"
          />

          <button
            className="full-button"
            onClick={saveInformation}
          >
            {saved
              ? "✓ Information Saved"
              : "Save Information"}
          </button>

        </div>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   CONTACTS
   ========================================================= */

function Contacts() {
  return (
    <div className="app-page">

      <AppHeader
        title="Contacts"
        subtitle="Emergency people & services"
      />

      <main className="page-content">

        <section className="section-block">

          <div className="section-title-row">

            <div>

              <p className="eyebrow">
                EMERGENCY SERVICES
              </p>

              <h2>
                Quick Call
              </h2>

            </div>

          </div>

          <div className="contacts-list">

            {emergencyContacts.map(
              (contact) => (

                <a
                  className="contact-row"
                  href={`tel:${contact.number}`}
                  key={contact.number}
                >

                  <span className="contact-row-icon">
                    {contact.icon}
                  </span>

                  <div>

                    <strong>
                      {contact.name}
                    </strong>

                    <small>
                      {contact.number}
                    </small>

                  </div>

                  <span className="call-icon">
                    ☎
                  </span>

                </a>
              )
            )}

          </div>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function Profile() {
  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") ||
    "Citizen";

  const mobile =
    localStorage.getItem("userMobile") ||
    "Not available";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userMobile");
    localStorage.removeItem("username");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="app-page profile-page">

      <header className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ←
        </button>

        <div>

          <h1>
            Profile
          </h1>

          <p>
            Your AapdaSathi account
          </p>

        </div>

      </header>

      <section className="profile-card">

        <div className="profile-avatar">
          {username.charAt(0).toUpperCase()}
        </div>

        <h2>
          {username}
        </h2>

        <p className="profile-mobile">
          📱 {mobile}
        </p>

      </section>

      <section className="profile-options">

        <button
          onClick={() =>
            navigate("/medical")
          }
          className="profile-option"
        >

          <span>🏥</span>

          <div>

            <strong>
              Medical Information
            </strong>

            <small>
              Manage your emergency medical details
            </small>

          </div>

          <span>›</span>

        </button>

        <button
          onClick={() =>
            navigate("/contacts")
          }
          className="profile-option"
        >

          <span>👥</span>

          <div>

            <strong>
              Emergency Contacts
            </strong>

            <small>
              Manage people to contact during emergencies
            </small>

          </div>

          <span>›</span>

        </button>

        <button
          onClick={handleLogout}
          className="profile-option logout-option"
        >

          <span>🚪</span>

          <div>

            <strong>
              Logout
            </strong>

            <small>
              Sign out of your AapdaSathi account
            </small>

          </div>

          <span>›</span>

        </button>

      </section>

    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
   ========================================================= */

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") ===
    "true";

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shelters"
          element={
            <ProtectedRoute>
              <Shelters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <Sos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <SafetyMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical"
          element={
            <ProtectedRoute>
              <Medical />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/command-center"
          element={
            <ProtectedRoute>
              <CommandCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relief"
          element={
            <ProtectedRoute>
              <Relief />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;