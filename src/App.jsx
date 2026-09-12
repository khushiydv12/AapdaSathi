import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { useState, useEffect } from "react";
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


/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");

  const handleLogin = () => {
    if (mobile.length === 10) {
      navigate("/");
    } else {
      alert("Please enter a valid 10 digit mobile number");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">🛡️</div>

        <h1>SafeGuard</h1>

        <p className="login-subtitle">
          Your personal disaster safety companion
        </p>

        <h2>Welcome Back</h2>

        <p className="login-text">
          Sign in to access your safety dashboard
        </p>

        <label>Mobile Number</label>

        <div className="mobile-input">
          <span>+91</span>

          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            maxLength="10"
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Continue
        </button>

        <p className="login-footer">
          Your information is kept secure
        </p>

      </div>
    </div>
  );
}


/* ================= HOME ================= */

function Home() {
  return (
    <div className="app">

      {/* HEADER */}

      <div className="header">

        <div>
          <p className="small-text">
            Welcome back
          </p>

          <h1>SafeGuard</h1>
        </div>

        <Link
          to="/profile"
          className="profile-icon"
        >
          👤
        </Link>

      </div>


      {/* SAFETY STATUS */}

      <div className="safety-card">

        <div className="shield">
          🛡️
        </div>

        <div>
          <h2>You are safe</h2>

          <p className="green-text">
            No critical alerts nearby
          </p>
        </div>

      </div>


      {/* ACTIVE ALERT */}

      <div className="home-alert">

        <div className="home-alert-icon">
          🌧️
        </div>

        <div className="home-alert-content">

          <div className="home-alert-title">
            <strong>Heavy Rainfall</strong>

            <span>HIGH</span>
          </div>

          <p>
            Heavy rainfall expected nearby.
            Avoid low-lying areas.
          </p>

          <Link to="/alerts">
            View Alert →
          </Link>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <h2 className="section-title">
        Quick Actions
      </h2>

      <div className="actions">

        <Link
          to="/alerts"
          className="action-card"
        >
          <span>🚨</span>

          <h3>Alerts</h3>

          <p>
            View nearby disaster alerts
          </p>
        </Link>


        <Link
          to="/shelters"
          className="action-card"
        >
          <span>🏠</span>

          <h3>Shelters</h3>

          <p>
            Find safe shelters nearby
          </p>
        </Link>


        <Link
          to="/map"
          className="action-card"
        >
          <span>🗺️</span>

          <h3>Risk Map</h3>

          <p>
            View disaster risk zones
          </p>
        </Link>


        <Link
          to="/sos"
          className="action-card sos-card"
        >
          <span>🆘</span>

          <h3>Emergency SOS</h3>

          <p>
            Send emergency alert
          </p>
        </Link>

      </div>


      {/* AI RISK */}

      <h2 className="section-title">
        AI Safety Assessment
      </h2>

      <div className="home-ai-card">

        <div className="home-ai-icon">
          🤖
        </div>

        <div className="home-ai-content">

          <p>
            CURRENT RISK LEVEL
          </p>

          <h2>
            Low Risk
          </h2>

          <span>
            AI confidence: 76%
          </span>

        </div>

        <div className="home-risk-score">
          24%
        </div>

      </div>


      {/* NEAREST SHELTER */}

      <h2 className="section-title">
        Nearest Safe Shelter
      </h2>

      <div className="nearest-shelter">

        <div className="nearest-icon">
          🏠
        </div>

        <div className="nearest-info">

          <h3>
            Community Relief Centre
          </h3>

          <p>
            📍 1.2 km away
          </p>

          <span>
            🟢 80 spaces available
          </span>

        </div>

        <Link
          to="/map"
          className="small-navigate"
        >
          🧭
        </Link>

      </div>


      {/* LOCAL RISK */}

      <h2 className="section-title">
        Local Risk Level
      </h2>

      <div className="risk-card">

        <div className="risk-circle">
          LOW
        </div>

        <div>

          <h3>
            Low Risk Area
          </h3>

          <p>
            No major disaster reported in your area.
          </p>

        </div>

      </div>


      <BottomNav />

    </div>
  );
}

/* ================= ALERTS ================= */

function Alerts() {
  return (
    <div className="page">

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <h1>Disaster Alerts</h1>

      <p className="page-subtitle">
        Stay informed about nearby hazards
      </p>


      {/* HIGH ALERT */}

      <div className="alert-card critical">

        <div className="alert-top">
          <span className="alert-icon">🌧️</span>
          <span className="badge">HIGH</span>
        </div>

        <h2>Heavy Rainfall</h2>

        <p>
          Heavy rainfall is expected in the affected area.
          Avoid low-lying areas and stay indoors if possible.
        </p>

        <div className="alert-details">
          <span>📍 Nearby Area</span>
          <span>⚠️ Flood Risk: 78%</span>
        </div>

        <div className="safety-tip">
          <strong>🛡️ Safety Instructions</strong>
          <p>
            Avoid flooded roads, do not cross moving water,
            and keep emergency supplies ready.
          </p>
        </div>

        <Link
          to="/map"
          className="alert-map-button"
        >
          🗺️ View on Map
        </Link>

        <span className="alert-time">
          Updated 10 minutes ago
        </span>

      </div>


      {/* MODERATE ALERT */}

      <div className="alert-card warning">

        <div className="alert-top">
          <span className="alert-icon">🌊</span>
          <span className="badge">MODERATE</span>
        </div>

        <h2>Waterlogging</h2>

        <p>
          Waterlogging has been reported on nearby roads.
          Consider alternate routes while travelling.
        </p>

        <div className="alert-details">
          <span>📍 Nearby Roads</span>
          <span>🚧 Travel Risk: Medium</span>
        </div>

        <div className="safety-tip">
          <strong>🛡️ Safety Instructions</strong>
          <p>
            Avoid waterlogged roads and use safer alternate
            routes whenever possible.
          </p>
        </div>

        <Link
          to="/map"
          className="alert-map-button"
        >
          🗺️ View on Map
        </Link>

        <span className="alert-time">
          Updated 25 minutes ago
        </span>

      </div>


      {/* INFORMATION ALERT */}

      <div className="alert-card info">

        <div className="alert-top">
          <span className="alert-icon">ℹ️</span>
          <span className="badge">INFO</span>
        </div>

        <h2>Safety Advisory</h2>

        <p>
          Keep your emergency contacts updated and
          essential supplies ready.
        </p>

        <div className="alert-details">
          <span>📍 Your Area</span>
          <span>✅ Preparedness</span>
        </div>

        <div className="safety-tip">
          <strong>🛡️ Safety Instructions</strong>
          <p>
            Keep a torch, first-aid kit, drinking water
            and important documents ready.
          </p>
        </div>

        <Link
          to="/profile"
          className="alert-map-button"
        >
          👤 Check Emergency Info
        </Link>

        <span className="alert-time">
          Updated 1 hour ago
        </span>

      </div>


    </div>
  );
}

/* ================= SHELTERS ================= */

function Shelters() {
  return (
    <div className="page">

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <h1>Nearby Shelters</h1>

      <p className="page-subtitle">
        Safe locations available near you
      </p>


      {/* SHELTER 1 */}

      <div className="shelter-card">

        <div className="shelter-header">
          <span className="shelter-icon">🏠</span>
          <span className="available">AVAILABLE</span>
        </div>

        <h2>Community Relief Centre</h2>

        <p>📍 1.2 km away</p>

        <p>👥 Occupancy: 120 / 200</p>

        <p>🛏️ Available Spaces: 80</p>

        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{ width: "60%" }}
          />
        </div>

        <div className="shelter-status">
          🟢 80 spaces available
        </div>

        <Link
          to="/map"
          className="direction-button"
        >
          🧭 Get Directions
        </Link>

      </div>


      {/* SHELTER 2 */}

      <div className="shelter-card">

        <div className="shelter-header">
          <span className="shelter-icon">🏫</span>
          <span className="available">AVAILABLE</span>
        </div>

        <h2>Government School Shelter</h2>

        <p>📍 2.4 km away</p>

        <p>👥 Occupancy: 180 / 300</p>

        <p>🛏️ Available Spaces: 120</p>

        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{ width: "60%" }}
          />
        </div>

        <div className="shelter-status">
          🟢 120 spaces available
        </div>

        <Link
          to="/map"
          className="direction-button"
        >
          🧭 Get Directions
        </Link>

      </div>


      {/* SHELTER 3 */}

      <div className="shelter-card">

        <div className="shelter-header">
          <span className="shelter-icon">🏥</span>
          <span className="full-badge">FULL</span>
        </div>

        <h2>Emergency Care Centre</h2>

        <p>📍 3.1 km away</p>

        <p>👥 Occupancy: 150 / 150</p>

        <p>🛏️ Available Spaces: 0</p>

        <div className="capacity-bar">
          <div
            className="capacity-fill full-bar"
            style={{ width: "100%" }}
          />
        </div>

        <div className="shelter-status full-status">
          🔴 No spaces available
        </div>

        <button disabled>
          🚫 Shelter Full
        </button>

      </div>


      {/* SHELTER INFORMATION */}

      <div className="shelter-info">

        <h2>💡 Shelter Information</h2>

        <p>
          Choose an available shelter and use
          <strong> Get Directions </strong>
          to find the safest route.
        </p>

      </div>

    </div>
  );
}

/* ================= SOS ================= */

function SOS() {
  const [sent, setSent] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState([]);

useEffect(() => {
  const saved = localStorage.getItem("emergencyContacts");

  if (saved) {
    setEmergencyContacts(JSON.parse(saved));
  }
}, []);

  const handleSOS = () => {
    setShowContacts(true);
  };

  const sendEmergencyAlert = () => {
    setShowContacts(false);
    setSent(true);
  };

  return (
    <div className="sos-page">

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <div className="sos-header">
        <h1>Emergency SOS</h1>
        <p>
          Send an emergency alert with your current location.
        </p>
      </div>

      {/* LOCATION */}
      <div className="sos-location">
        <span>📍</span>

        <div>
          <strong>Location Detected</strong>

          <p>
            Your current location will be shared with
            emergency contacts during an SOS alert.
          </p>
        </div>
      </div>

      {/* SOS BUTTON */}
      <div className="sos-button-area">

        <button
          className="big-sos-button"
          onClick={handleSOS}
        >
          <span>SOS</span>
          <small>PRESS FOR HELP</small>
        </button>

      </div>

      {/* CONTACT CONFIRMATION */}
      {showContacts && (
        <div className="emergency-confirm">

          <h2>🚨 Send Emergency Alert?</h2>

          <p>
            Your emergency alert and current location
            will be shared with:
          </p>

          <div className="contact-preview">

            {emergencyContacts.map((contact, index) => (
              <div className="preview-contact" key={index}>

                <span>👤</span>

                <div>
                  <strong>{contact.name}</strong>
                  <p>{contact.relation} • {contact.phone}</p>
                </div>

              </div>
            ))}

          </div>

          <div className="location-share">
            📍 <strong>Live location sharing</strong>
            <span> ON</span>
          </div>

          <button
            className="confirm-sos-button"
            onClick={sendEmergencyAlert}
          >
            🚨 Send Emergency Alert
          </button>

          <button
            className="cancel-sos-button"
            onClick={() => setShowContacts(false)}
          >
            Cancel
          </button>

        </div>
      )}

      {/* SUCCESS */}
      {sent && (
        <div className="sos-success">

          <span>✅</span>

          <div>
            <h3>Emergency Alert Sent</h3>

            <p>
              Your emergency contacts have been notified
              and your location has been shared.
            </p>
          </div>

        </div>
      )}

      {/* EMERGENCY INFORMATION */}
      <div className="emergency-info">

        <h2>Emergency Information</h2>

        <div className="info-row">
          <span>📞</span>

          <div>
            <strong>Emergency Services</strong>
            <p>Call 112 for immediate assistance</p>
          </div>
        </div>

        <div className="info-row">
          <span>📍</span>

          <div>
            <strong>Live Location</strong>
            <p>Location sharing is enabled</p>
          </div>
        </div>

        <div className="info-row">
          <span>👥</span>

          <div>
            <strong>Emergency Contacts</strong>
            <p>Your saved contacts will be notified</p>
          </div>
        </div>

      </div>

      <BottomNav />

    </div>
  );
}

/* ================= MAP ================= */

function Map() {

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const shelterIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/619/619153.png",
    iconSize: [38, 38],
  });

  const userIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [35, 35],
  });

  useEffect(() => {

    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      () => {
        setLocationError(
          "Location permission denied. Please allow location access."
        );
      }
    );

  }, []);

  return (
    <div className="page">

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <h1>Disaster Risk Map</h1>

      <p className="page-subtitle">
        AI-powered risk zones and nearby shelters
      </p>


      {/* LOCATION STATUS */}

      <div className="location-status">

        <span>📍</span>

        <div>
          <strong>
            {userLocation
              ? "Your Location Detected"
              : "Detecting Your Location..."}
          </strong>

          <p>
            {userLocation
              ? "Your current location is shown on the map."
              : "Please allow location permission."}
          </p>
        </div>

      </div>


      {locationError && (
        <div className="location-error">
          ⚠️ {locationError}
        </div>
      )}


      {/* MAP */}

      <div className="real-map">

        <MapContainer
          center={userLocation || [28.6139, 77.2090]}
          zoom={12}
          scrollWheelZoom={true}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* USER LOCATION */}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={userIcon}
            >
              <Popup>
                📍 <strong>You are here</strong>
                <br />
                Your current location
              </Popup>
            </Marker>
          )}


          {/* HIGH RISK */}

          <Circle
            center={[28.625, 77.225]}
            radius={1800}
            pathOptions={{
              color: "#e63946",
              fillColor: "#e63946",
              fillOpacity: 0.25,
            }}
          >

            <Popup>
              🔴 High Risk Zone
              <br />
              Flood probability: 78%
            </Popup>

          </Circle>


          {/* MEDIUM RISK */}

          <Circle
            center={[28.595, 77.19]}
            radius={1400}
            pathOptions={{
              color: "#f4a261",
              fillColor: "#f4a261",
              fillOpacity: 0.25,
            }}
          >

            <Popup>
              🟠 Medium Risk Zone
              <br />
              Flood probability: 46%
            </Popup>

          </Circle>


          {/* SAFE ZONE */}

          <Circle
            center={[28.64, 77.18]}
            radius={1000}
            pathOptions={{
              color: "#2eb47e",
              fillColor: "#2eb47e",
              fillOpacity: 0.25,
            }}
          >

            <Popup>
              🟢 Safe Zone
            </Popup>

          </Circle>


          {/* SHELTER 1 */}

          <Marker
            position={[28.615, 77.205]}
            icon={shelterIcon}
          >

            <Popup>
              🏠 Community Relief Centre
              <br />
              Capacity: 120 / 200
              <br />
              <br />

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.615,77.205"
                target="_blank"
                rel="noopener noreferrer"
              >
                🧭 Navigate to Shelter
              </a>

            </Popup>

          </Marker>


          {/* SHELTER 2 */}

          <Marker
            position={[28.605, 77.225]}
            icon={shelterIcon}
          >

            <Popup>
              🏫 Government School Shelter
              <br />
              Capacity: 180 / 300
              <br />
              <br />

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.605,77.225"
                target="_blank"
                rel="noopener noreferrer"
              >
                🧭 Navigate to Shelter
              </a>

            </Popup>

          </Marker>

        </MapContainer>

      </div>


      {/* RISK LEGEND */}

      <div className="map-legend">

        <h2>Risk Zones</h2>

        <div className="legend-row">

          <span className="legend-dot high"></span>

          <div>
            <strong>High Risk</strong>
            <p>Immediate caution required</p>
          </div>

        </div>


        <div className="legend-row">

          <span className="legend-dot medium"></span>

          <div>
            <strong>Medium Risk</strong>
            <p>Stay alert and prepared</p>
          </div>

        </div>


        <div className="legend-row">

          <span className="legend-dot safe"></span>

          <div>
            <strong>Safe Zone</strong>
            <p>No major risk detected</p>
          </div>

        </div>

      </div>


      {/* AI RISK */}

      <div className="ai-risk-card">

        <div>

          <p>AI RISK ASSESSMENT</p>

          <h2>Low Risk</h2>

          <span>
            Prediction confidence: 76%
          </span>

        </div>

        <div className="risk-score-circle">
          24%
        </div>

      </div>


      {/* SHELTERS */}

      <Link
        to="/shelters"
        className="map-shelter-button"
      >
        🏠 View Nearby Shelters
      </Link>


      {/* NAVIGATION */}

      <div className="navigation-card">

        <div className="navigation-icon">
          🧭
        </div>

        <div className="navigation-content">

          <h2>Nearest Shelter</h2>

          <p>
            Community Relief Centre
          </p>

          <span>
            📍 1.2 km away
          </span>

        </div>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=28.615,77.205"
          target="_blank"
          rel="noopener noreferrer"
          className="navigate-button"
        >
          Navigate
        </a>

      </div>


    </div>
  );
}
/* ================= PROFILE ================= */

function Profile() {

  const navigate = useNavigate();

  return (
    <div className="page profile-page">

      <Link to="/" className="back-button">
        ← Back
      </Link>


      <div className="profile-header">

        <div className="profile-big-icon">
          👤
        </div>

        <h1>My Profile</h1>

        <p>
          Manage your safety information
        </p>

      </div>


      <div className="profile-card">

        <div className="profile-row">
          <span>👤</span>

          <div>
            <p>Name</p>
            <strong>Citizen User</strong>
          </div>
        </div>


        <div className="profile-row">
          <span>📱</span>

          <div>
            <p>Mobile Number</p>
            <strong>+91 XXXXX XXXXX</strong>
          </div>
        </div>


        <div className="profile-row">
          <span>📍</span>

          <div>
            <p>Location</p>
            <strong>Location Enabled</strong>
          </div>
        </div>

      </div>


      <h2 className="profile-section-title">
        Emergency Information
      </h2>


      <div className="profile-options">

        <Link
          to="/medical"
          className="profile-option"
        >
          <span>🩸</span>

          <div>
            <strong>Medical Information</strong>
            <p>Blood group, allergies, conditions</p>
          </div>

          <span className="arrow">›</span>
        </Link>


        <Link
          to="/contacts"
          className="profile-option"
        >
          <span>👨‍👩‍👧</span>

          <div>
            <strong>Emergency Contacts</strong>
            <p>Add people to contact during emergencies</p>
          </div>

          <span className="arrow">›</span>
        </Link>


        <div className="profile-option">

          <span>📍</span>

          <div>
            <strong>Location Sharing</strong>
            <p>Location sharing is currently ON</p>
          </div>

          <span className="toggle-on">ON</span>

        </div>

      </div>


      <button
        className="logout-button"
        onClick={() => navigate("/login")}
      >
        Logout
      </button>

    </div>
  );
}


/* ================= MEDICAL INFORMATION ================= */

function Medical() {

  const navigate = useNavigate();

  const [medical, setMedical] = useState({
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {

    setMedical({
      ...medical,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };


  const handleSave = () => {

    setSaved(true);

    alert("Medical information saved successfully!");
  };


  return (
    <div className="page">

      <button
        className="back-button"
        onClick={() => navigate("/profile")}
      >
        ← Back to Profile
      </button>


      <h1>Medical Information</h1>

      <p className="page-subtitle">
        This information can help responders during emergencies.
      </p>


      <div className="form-card">

        <label>Blood Group</label>

        <select
          name="bloodGroup"
          value={medical.bloodGroup}
          onChange={handleChange}
        >

          <option value="">
            Select blood group
          </option>

          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>

        </select>


        <label>Allergies</label>

        <input
          name="allergies"
          value={medical.allergies}
          onChange={handleChange}
          placeholder="Example: Penicillin"
        />


        <label>Medical Conditions</label>

        <textarea
          name="conditions"
          value={medical.conditions}
          onChange={handleChange}
          placeholder="Example: Asthma, diabetes..."
        />


        <label>Current Medications</label>

        <textarea
          name="medications"
          value={medical.medications}
          onChange={handleChange}
          placeholder="Enter current medicines"
        />


        <button
          className="save-button"
          onClick={handleSave}
        >
          💾 Save Medical Information
        </button>


        {saved && (
          <div className="saved-message">
            ✅ Information saved successfully
          </div>
        )}

      </div>

    </div>
  );
}


/* ================= EMERGENCY CONTACTS ================= */

function Contacts() {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("emergencyContacts");

    return saved
      ? JSON.parse(saved)
      : [{ name: "", phone: "", relation: "" }];
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const addContact = () => {
    if (contacts.length >= 3) {
      alert("You can add maximum 3 emergency contacts.");
      return;
    }

    setContacts([
      ...contacts,
      { name: "", phone: "", relation: "" },
    ]);
  };

  const updateContact = (index, field, value) => {
    const updatedContacts = [...contacts];

    updatedContacts[index][field] = value;

    setContacts(updatedContacts);
  };

  const removeContact = (index) => {
    if (contacts.length === 1) {
      alert("At least one emergency contact is required.");
      return;
    }

    setContacts(
      contacts.filter((_, i) => i !== index)
    );
  };

  const saveContacts = () => {
    const validContacts = contacts.filter(
      (contact) =>
        contact.name.trim() !== "" &&
        contact.phone.trim() !== ""
    );

    if (validContacts.length === 0) {
      alert("Please enter at least one emergency contact.");
      return;
    }

    localStorage.setItem(
      "emergencyContacts",
      JSON.stringify(validContacts)
    );

    setContacts(validContacts);
    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 3000);
  };

  return (
    <div className="page">

      <Link to="/profile" className="back-button">
        ← Back
      </Link>

      <h1>Emergency Contacts</h1>

      <p className="page-subtitle">
        These people will be notified during an emergency.
      </p>

      {contacts.map((contact, index) => (
        <div className="contact-card" key={index}>

          <div className="contact-card-header">

            <h2>
              Contact {index + 1}
            </h2>

            {contacts.length > 1 && (
              <button
                className="remove-contact"
                onClick={() => removeContact(index)}
              >
                Remove
              </button>
            )}

          </div>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter full name"
            value={contact.name}
            onChange={(e) =>
              updateContact(
                index,
                "name",
                e.target.value
              )
            }
          />

          <label>Mobile Number</label>

          <input
            type="tel"
            placeholder="Enter mobile number"
            maxLength="10"
            value={contact.phone}
            onChange={(e) =>
              updateContact(
                index,
                "phone",
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          <label>Relation</label>

          <input
            type="text"
            placeholder="Example: Mother, Father, Friend"
            value={contact.relation}
            onChange={(e) =>
              updateContact(
                index,
                "relation",
                e.target.value
              )
            }
          />

        </div>
      ))}

      <button
        className="add-contact-button"
        onClick={addContact}
      >
        ➕ Add Emergency Contact
      </button>

      <button
        className="save-button"
        onClick={saveContacts}
      >
        💾 Save Contacts
      </button>

      {savedMessage && (
        <div className="saved-message">
          ✅ Emergency contacts saved successfully!
        </div>
      )}

    </div>
  );
}

/* ================== BOTTOM NAV ================== */

function BottomNav() {

  return (
    <div className="bottom-nav">

      <Link to="/" className="nav-item">
        🏠
        <span>Home</span>
      </Link>

      <Link to="/alerts" className="nav-item">
        🚨
        <span>Alerts</span>
      </Link>

      <Link to="/sos" className="nav-item sos-nav">
        🆘
        <span>SOS</span>
      </Link>

      <Link to="/shelters" className="nav-item">
        🏫
        <span>Shelters</span>
      </Link>

      <Link to="/profile" className="nav-item">
        <span>Profile</span>
      </Link>

    </div>
  );
}

/* ================== APP ================== */

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
          element={<Home />} 
        />

        <Route 
          path="/alerts" 
          element={<Alerts />} 
        />

        <Route 
          path="/shelters" 
          element={<Shelters />} 
        />

        <Route 
          path="/sos"
          element={<SOS />}
    />

    <Route 
      path="/map"
      element={<Map />}
    />

    <Route 
      path="/profile"
      element={<Profile />}
    />

    <Route 
      path="/medical"
      element={<Medical />}
    />

    <Route 
      path="/contacts"
      element={<Contacts />}
    />

  </Routes>

</BrowserRouter>

);
}

export default App;