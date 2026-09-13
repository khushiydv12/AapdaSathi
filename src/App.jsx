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
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// ============================================================
// LEAFLET MARKER ICONS
// ============================================================

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const shelterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/619/619153.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// ============================================================
// LOGIN PAGE - PAGE 1
// ============================================================

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const cleanMobile = mobile.replace(/\D/g, "");

    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");

    // Store login information
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userMobile", cleanMobile);

    // Go to Page 2
    navigate("/", { replace: true });
  };

  return (
    <div className="login-page">
      {/* Background disaster panels */}
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

      <div className="login-overlay"></div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-logo">
          🛡️
        </div>

        <h1>SafeGuard</h1>

        <p className="login-subtitle">
          Your personal disaster safety companion
        </p>

        <div className="login-divider"></div>

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

          <button
            type="submit"
            className="continue-button"
          >
            Continue →
          </button>
        </form>

        <p className="login-security">
          🔒 Your information is kept secure
        </p>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE - PAGE 2
// ============================================================

function Home() {
  return (
    <div className="app-page home-page">
      <header className="home-header">
        <div>
          <p className="welcome-text">Welcome back</p>
          <h1>SafeGuard</h1>
        </div>

        <Link to="/profile" className="profile-button">
          👤
        </Link>
      </header>

      {/* Safety Status */}
      <section className="safety-card safe">
        <div className="safety-icon">🛡️</div>

        <div>
          <h2>You are safe</h2>
          <p>No critical alerts nearby</p>
        </div>
      </section>

      {/* Active Alert */}
      <section className="active-alert-card">
        <div className="alert-header">
          <div className="alert-icon">🌧️</div>

          <div className="alert-title">
            <h3>Heavy Rainfall</h3>
          </div>

          <span className="severity high">HIGH</span>
        </div>

        <p>
          Heavy rainfall expected nearby. Avoid low-lying areas.
        </p>

        <Link to="/alerts" className="view-alert">
          View Alert →
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="quick-action-grid">
          <Link to="/alerts" className="quick-action">
            <span>🚨</span>
            <p>Alerts</p>
          </Link>

          <Link to="/shelters" className="quick-action">
            <span>🏠</span>
            <p>Shelters</p>
          </Link>

          <Link to="/map" className="quick-action">
            <span>🗺️</span>
            <p>Safe Map</p>
          </Link>

          <Link to="/sos" className="quick-action sos-action">
            <span>🆘</span>
            <p>SOS</p>
          </Link>
        </div>
      </section>

      {/* AI Safety Assessment */}
      <section className="risk-card">
        <div className="section-header">
          <div>
            <p className="section-label">AI SAFETY ASSESSMENT</p>
            <h2>Your Current Risk</h2>
          </div>

          <span className="risk-low">LOW RISK</span>
        </div>

        <div className="risk-score">
          <div className="risk-circle">
            <strong>24%</strong>
            <span>Risk</span>
          </div>

          <div className="risk-details">
            <h3>Low Risk</h3>

            <p>
              Current conditions indicate a relatively safe
              environment in your area.
            </p>

            <div className="confidence">
              AI Confidence: <strong>76%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Nearest Shelter */}
      <section className="nearest-shelter-card">
        <div className="section-header">
          <div>
            <p className="section-label">NEAREST SHELTER</p>
            <h2>Community Relief Centre</h2>
          </div>

          <span className="available">80 spaces</span>
        </div>

        <p>📍 Approximately 1.2 km away</p>

        <Link to="/shelters" className="card-button">
          View Shelters →
        </Link>
      </section>

      {/* Local Risk */}
      <section className="local-risk-card">
        <div className="section-header">
          <div>
            <p className="section-label">LOCAL RISK</p>
            <h2>Current Conditions</h2>
          </div>
        </div>

        <div className="condition-list">
          <div className="condition-item">
            <span>🌧️ Rainfall</span>
            <strong>Moderate</strong>
          </div>

          <div className="condition-item">
            <span>🌊 Water Level</span>
            <strong>Normal</strong>
          </div>

          <div className="condition-item">
            <span>🛣️ Roads</span>
            <strong>Mostly Clear</strong>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

// ============================================================
// ALERTS PAGE
// ============================================================

function Alerts() {
  const alerts = [
    {
      type: "Heavy Rainfall",
      level: "HIGH",
      icon: "🌧️",
      description:
        "Heavy rainfall expected nearby. Avoid low-lying areas.",
      time: "Active now",
    },
    {
      type: "Waterlogging",
      level: "MODERATE",
      icon: "🌊",
      description:
        "Waterlogging reported in some nearby areas.",
      time: "Recently updated",
    },
    {
      type: "Safety Advisory",
      level: "INFO",
      icon: "ℹ️",
      description:
        "Stay updated with official disaster management advisories.",
      time: "Today",
    },
  ];

  return (
    <div className="app-page alerts-page">
      <header className="page-header">
        <div>
          <p className="section-label">SAFETY UPDATES</p>
          <h1>Alerts</h1>
        </div>
      </header>

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div
            className={`alert-card ${alert.level.toLowerCase()}`}
            key={index}
          >
            <div className="alert-card-top">
              <div className="alert-icon">{alert.icon}</div>

              <div className="alert-main">
                <div className="alert-name-row">
                  <h3>{alert.type}</h3>

                  <span
                    className={`severity ${alert.level.toLowerCase()}`}
                  >
                    {alert.level}
                  </span>
                </div>

                <p>{alert.description}</p>
                <small>{alert.time}</small>
              </div>
            </div>

            <Link to="/map" className="alert-map-link">
              View on Map →
            </Link>
          </div>
        ))}
      </div>

      <section className="preparedness-card">
        <h2>Stay Prepared</h2>

        <p>
          Keep your emergency contacts, medical information,
          essential supplies and evacuation plan ready.
        </p>

        <div className="preparedness-actions">
          <Link to="/contacts">Emergency Contacts</Link>
          <Link to="/medical">Medical Information</Link>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

// ============================================================
// SHELTERS PAGE
// ============================================================

function Shelters() {
  const shelters = [
    {
      name: "Community Relief Centre",
      capacity: 200,
      occupied: 120,
      distance: "1.2 km",
      status: "Available",
      food: true,
      water: true,
      medical: true,
      position: [28.615, 77.205],
    },
    {
      name: "Government School Shelter",
      capacity: 300,
      occupied: 180,
      distance: "2.4 km",
      status: "Available",
      food: true,
      water: true,
      medical: false,
      position: [28.605, 77.225],
    },
    {
      name: "Emergency Care Centre",
      capacity: 150,
      occupied: 150,
      distance: "3.1 km",
      status: "Full",
      food: true,
      water: true,
      medical: true,
      position: [28.595, 77.2],
    },
  ];

  return (
    <div className="app-page shelters-page">
      <header className="page-header">
        <div>
          <p className="section-label">SAFE LOCATIONS</p>
          <h1>Relief Shelters</h1>
        </div>
      </header>

      <div className="shelter-list">
        {shelters.map((shelter, index) => {
          const available = shelter.capacity - shelter.occupied;

          const percentage =
            (shelter.occupied / shelter.capacity) * 100;

          const directionsUrl =
            `https://www.google.com/maps/dir/?api=1&destination=` +
            `${shelter.position[0]},${shelter.position[1]}`;

          return (
            <div className="shelter-card" key={index}>
              <div className="shelter-card-header">
                <div className="shelter-icon">🏠</div>

                <div className="shelter-info">
                  <h3>{shelter.name}</h3>
                  <p>📍 {shelter.distance} away</p>
                </div>

                <span
                  className={
                    shelter.status === "Full"
                      ? "shelter-full"
                      : "shelter-available"
                  }
                >
                  {shelter.status}
                </span>
              </div>

              <div className="capacity-section">
                <div className="capacity-text">
                  <span>Occupancy</span>
                  <strong>
                    {shelter.occupied} / {shelter.capacity}
                  </strong>
                </div>

                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p>
                  {available > 0
                    ? `${available} spaces available`
                    : "No spaces available"}
                </p>
              </div>

              <div className="facility-list">
                <span>{shelter.food ? "✓" : "×"} Food</span>
                <span>{shelter.water ? "✓" : "×"} Water</span>
                <span>
                  {shelter.medical ? "✓" : "×"} Medical
                </span>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
              >
                Get Directions →
              </a>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}

// ============================================================
// SOS PAGE
// ============================================================

function Sos() {
  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [sent, setSent] = useState(false);

  const [locationStatus, setLocationStatus] =
    useState("Getting your location...");

  const [userLocation, setUserLocation] =
    useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Location is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus("Location ready");
      },
      () => {
        setLocationStatus(
          "Location permission not available"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  const sendEmergencyAlert = () => {
    setSent(true);
    setShowConfirmation(false);
  };

  let contacts = [];

  try {
    contacts = JSON.parse(
      localStorage.getItem("emergencyContacts") || "[]"
    );
  } catch {
    contacts = [];
  }

  return (
    <div className="app-page sos-page">
      <header className="page-header">
        <div>
          <p className="section-label">
            EMERGENCY RESPONSE
          </p>
          <h1>SOS</h1>
        </div>
      </header>

      {!sent ? (
        <>
          <section className="sos-main-card">
            <div className="sos-large-icon">🆘</div>

            <h2>Emergency SOS</h2>

            <p>
              Use SOS when you need immediate emergency
              assistance.
            </p>

            <button
              className="sos-button"
              type="button"
              onClick={() => setShowConfirmation(true)}
            >
              SOS
            </button>

            <p className="sos-note">
              Your emergency location can be shared with
              your emergency contacts.
            </p>
          </section>

          <section className="location-status">
            <span>📍</span>

            <div>
              <strong>Current Location</strong>
              <p>{locationStatus}</p>

              {userLocation && (
                <small>
                  {userLocation.latitude.toFixed(5)},{" "}
                  {userLocation.longitude.toFixed(5)}
                </small>
              )}
            </div>
          </section>

          <section className="emergency-contacts-section">
            <div className="section-header">
              <div>
                <p className="section-label">
                  EMERGENCY CONTACTS
                </p>

                <h2>Your Contacts</h2>
              </div>

              <Link to="/contacts">Edit</Link>
            </div>

            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <div
                  className="contact-card"
                  key={index}
                >
                  <div className="contact-avatar">👤</div>

                  <div>
                    <strong>{contact.name}</strong>
                    <p>{contact.relation}</p>
                    <span>{contact.phone}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>
                  No emergency contacts added yet.
                </p>

                <Link to="/contacts">
                  Add Emergency Contact
                </Link>
              </div>
            )}
          </section>

          {showConfirmation && (
            <div className="confirmation-overlay">
              <div className="confirmation-card">
                <div className="confirmation-icon">
                  ⚠️
                </div>

                <h2>Send Emergency Alert?</h2>

                <p>
                  Your emergency alert will be prepared
                  with your current location.
                </p>

                <div className="confirmation-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      setShowConfirmation(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="confirm-sos-button"
                    onClick={sendEmergencyAlert}
                  >
                    Send SOS
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <section className="sos-success-card">
          <div className="success-icon">✓</div>

          <h2>Emergency Alert Prepared</h2>

          <p>
            Your SOS request has been recorded with your
            current location information.
          </p>

          <p className="demo-note">
            Emergency notification sending requires a
            connected backend/SMS service.
          </p>

          <button
            type="button"
            onClick={() => setSent(false)}
            className="card-button"
          >
            Back to SOS
          </button>
        </section>
      )}

      <BottomNav />
    </div>
  );
}

// ============================================================
// MAP PAGE
// ============================================================

function Map() {
  const defaultPosition = [28.6139, 77.209];

  const [userPosition, setUserPosition] =
    useState(defaultPosition);

  const [locationStatus, setLocationStatus] =
    useState("Using default location");

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);

        setLocationStatus("Your current location");
      },
      () => {
        setLocationStatus(
          "Location unavailable - showing Delhi"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  const shelters = [
    {
      name: "Community Relief Centre",
      position: [28.615, 77.205],
      capacity: "80 spaces available",
    },
    {
      name: "Government School Shelter",
      position: [28.605, 77.225],
      capacity: "120 spaces available",
    },
  ];

  return (
    <div className="app-page map-page">
      <header className="page-header">
        <div>
          <p className="section-label">
            DISASTER INTELLIGENCE
          </p>

          <h1>Safety Map</h1>
        </div>
      </header>

      <section className="map-status-card">
        <span>📍</span>

        <div>
          <strong>{locationStatus}</strong>

          <p>
            Disaster risk and safe shelter information
          </p>
        </div>
      </section>

      <div className="map-container">
        <MapContainer
          center={userPosition}
          zoom={12}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={userPosition}
            icon={userIcon}
          >
            <Popup>
              <strong>Your Location</strong>
              <br />
              Current position
            </Popup>
          </Marker>

          <Circle
            center={[28.625, 77.195]}
            radius={1500}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.18,
            }}
          >
            <Popup>
              <strong>HIGH RISK</strong>
              <br />
              Heavy rainfall risk area
            </Popup>
          </Circle>

          <Circle
            center={[28.605, 77.22]}
            radius={1200}
            pathOptions={{
              color: "orange",
              fillColor: "orange",
              fillOpacity: 0.15,
            }}
          >
            <Popup>
              <strong>MODERATE RISK</strong>
              <br />
              Waterlogging possible
            </Popup>
          </Circle>

          <Circle
            center={[28.595, 77.2]}
            radius={900}
            pathOptions={{
              color: "green",
              fillColor: "green",
              fillOpacity: 0.15,
            }}
          >
            <Popup>
              <strong>SAFE ZONE</strong>
              <br />
              Lower current risk
            </Popup>
          </Circle>

          {shelters.map((shelter, index) => {
            const directionsUrl =
              `https://www.google.com/maps/dir/?api=1&destination=` +
              `${shelter.position[0]},${shelter.position[1]}`;

            return (
              <Marker
                key={index}
                position={shelter.position}
                icon={shelterIcon}
              >
                <Popup>
                  <strong>{shelter.name}</strong>
                  <br />
                  {shelter.capacity}
                  <br />
                  <br />

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <section className="map-legend">
        <h3>Map Legend</h3>

        <div className="legend-items">
          <span>
            <i className="legend-dot high"></i>
            High Risk
          </span>

          <span>
            <i className="legend-dot moderate"></i>
            Moderate Risk
          </span>

          <span>
            <i className="legend-dot safe"></i>
            Safe Zone
          </span>

          <span>🏠 Relief Shelter</span>
        </div>
      </section>

      <section className="navigation-card">
        <div className="section-header">
          <div>
            <p className="section-label">
              AI RISK ASSESSMENT
            </p>

            <h2>Current Area</h2>
          </div>

          <span className="risk-low">LOW</span>
        </div>

        <p>
          Your current area has a low estimated disaster
          risk based on the available demo conditions.
        </p>
      </section>

      <BottomNav />
    </div>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================

function Profile() {
  const navigate = useNavigate();

  const mobile =
    localStorage.getItem("userMobile") ||
    "Not available";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userMobile");

    navigate("/login", { replace: true });
  };

  return (
    <div className="app-page profile-page">
      <header className="page-header">
        <div>
          <p className="section-label">ACCOUNT</p>
          <h1>Profile</h1>
        </div>
      </header>

      <section className="profile-card">
        <div className="profile-large-icon">👤</div>

        <h2>SafeGuard User</h2>

        <p>+91 {mobile}</p>
      </section>

      <section className="profile-options">
        <Link to="/contacts" className="profile-option">
          <span>📞</span>

          <div>
            <strong>Emergency Contacts</strong>
            <p>Manage your emergency contacts</p>
          </div>

          <span>›</span>
        </Link>

        <Link to="/medical" className="profile-option">
          <span>🏥</span>

          <div>
            <strong>Medical Information</strong>
            <p>Save important medical details</p>
          </div>

          <span>›</span>
        </Link>

        <Link to="/map" className="profile-option">
          <span>🗺️</span>

          <div>
            <strong>Safety Map</strong>
            <p>View risk zones and shelters</p>
          </div>

          <span>›</span>
        </Link>
      </section>

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        Log Out
      </button>

      <BottomNav />
    </div>
  );
}

// ============================================================
// MEDICAL PAGE
// ============================================================

function Medical() {
  const [medical, setMedical] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("medicalInformation") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMedical((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "medicalInformation",
      JSON.stringify(medical)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="app-page medical-page">
      <header className="page-header">
        <div>
          <p className="section-label">
            EMERGENCY INFORMATION
          </p>

          <h1>Medical Information</h1>
        </div>
      </header>

      <section className="form-card">
        <p className="form-intro">
          Store important medical information that can
          help during an emergency.
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="bloodGroup">
              Blood Group
            </label>

            <input
              id="bloodGroup"
              name="bloodGroup"
              value={medical.bloodGroup || ""}
              onChange={handleChange}
              placeholder="e.g. O+"
            />
          </div>

          <div className="form-group">
            <label htmlFor="allergies">
              Allergies
            </label>

            <textarea
              id="allergies"
              name="allergies"
              value={medical.allergies || ""}
              onChange={handleChange}
              placeholder="Enter known allergies"
            />
          </div>

          <div className="form-group">
            <label htmlFor="conditions">
              Medical Conditions
            </label>

            <textarea
              id="conditions"
              name="conditions"
              value={medical.conditions || ""}
              onChange={handleChange}
              placeholder="Enter important medical conditions"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medications">
              Current Medications
            </label>

            <textarea
              id="medications"
              name="medications"
              value={medical.medications || ""}
              onChange={handleChange}
              placeholder="Enter current medications"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Additional Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={medical.notes || ""}
              onChange={handleChange}
              placeholder="Any other important information"
            />
          </div>

          <button
            type="submit"
            className="save-button"
          >
            Save Medical Information
          </button>
        </form>

        {saved && (
          <div className="saved-message">
            ✓ Medical information saved successfully.
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}

// ============================================================
// EMERGENCY CONTACTS PAGE
// ============================================================

function Contacts() {
  const [contacts, setContacts] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("emergencyContacts") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [error, setError] = useState("");

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts);

    localStorage.setItem(
      "emergencyContacts",
      JSON.stringify(updatedContacts)
    );
  };

  const addContact = (event) => {
    event.preventDefault();
    setError("");

    if (contacts.length >= 3) {
      setError(
        "You can add a maximum of 3 emergency contacts."
      );
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (!name.trim()) {
      setError("Please enter the contact name.");
      return;
    }

    if (cleanPhone.length !== 10) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!relation.trim()) {
      setError("Please enter the relation.");
      return;
    }

    const newContact = {
      name: name.trim(),
      phone: cleanPhone,
      relation: relation.trim(),
    };

    saveContacts([...contacts, newContact]);

    setName("");
    setPhone("");
    setRelation("");
  };

  const deleteContact = (index) => {
    const updatedContacts = contacts.filter(
      (_, currentIndex) => currentIndex !== index
    );

    saveContacts(updatedContacts);
  };

  return (
    <div className="app-page contacts-page">
      <header className="page-header">
        <div>
          <p className="section-label">
            EMERGENCY RESPONSE
          </p>

          <h1>Emergency Contacts</h1>
        </div>
      </header>

      <section className="contacts-info-card">
        <span>📞</span>

        <p>
          Add people who should be contacted during
          an emergency.
        </p>
      </section>

      <section className="saved-contacts">
        <div className="section-header">
          <div>
            <p className="section-label">
              SAVED CONTACTS
            </p>

            <h2>{contacts.length} / 3 Contacts</h2>
          </div>
        </div>

        {contacts.length === 0 ? (
          <div className="empty-state">
            <p>No emergency contacts added yet.</p>
          </div>
        ) : (
          contacts.map((contact, index) => (
            <div
              className="saved-contact-card"
              key={index}
            >
              <div className="contact-avatar">👤</div>

              <div className="contact-details">
                <strong>{contact.name}</strong>
                <p>{contact.relation}</p>
                <span>+91 {contact.phone}</span>
              </div>

              <button
                type="button"
                className="delete-contact"
                onClick={() => deleteContact(index)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </section>

      {contacts.length < 3 && (
        <section className="form-card">
          <div className="section-header">
            <div>
              <p className="section-label">
                NEW CONTACT
              </p>

              <h2>Add Contact</h2>
            </div>
          </div>

          <form onSubmit={addContact}>
            <div className="form-group">
              <label htmlFor="contactName">
                Name
              </label>

              <input
                id="contactName"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">
                Phone Number
              </label>

              <div className="mobile-input-wrapper">
                <span className="country-code">+91</span>

                <input
                  id="contactPhone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactRelation">
                Relation
              </label>

              <input
                id="contactRelation"
                type="text"
                value={relation}
                onChange={(event) =>
                  setRelation(event.target.value)
                }
                placeholder="e.g. Mother, Father, Friend"
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="save-button"
            >
              Add Emergency Contact
            </button>
          </form>
        </section>
      )}

      <BottomNav />
    </div>
  );
}

// ============================================================
// BOTTOM NAVIGATION
// ============================================================

function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getClassName = (path, extra = "") =>
    currentPath === path
      ? `nav-item active ${extra}`
      : `nav-item ${extra}`;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={getClassName("/")}>
        <span>🏠</span>
        <small>Home</small>
      </Link>

      <Link
        to="/alerts"
        className={getClassName("/alerts")}
      >
        <span>🚨</span>
        <small>Alerts</small>
      </Link>

      <Link
        to="/sos"
        className={getClassName("/sos", "sos-nav")}
      >
        <span>🆘</span>
        <small>SOS</small>
      </Link>

      <Link
        to="/shelters"
        className={getClassName("/shelters")}
      >
        <span>🏠</span>
        <small>Shelters</small>
      </Link>

      <Link
        to="/profile"
        className={getClassName("/profile")}
      >
        <span>👤</span>
        <small>Profile</small>
      </Link>
    </nav>
  );
}

// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ============================================================
// MAIN APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PAGE 1 - LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PAGE 2 - HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* ALERTS */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* SHELTERS */}
        <Route
          path="/shelters"
          element={
            <ProtectedRoute>
              <Shelters />
            </ProtectedRoute>
          }
        />

        {/* SOS */}
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <Sos />
            </ProtectedRoute>
          }
        />

        {/* MAP */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* MEDICAL */}
        <Route
          path="/medical"
          element={
            <ProtectedRoute>
              <Medical />
            </ProtectedRoute>
          }
        />

        {/* CONTACTS */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;