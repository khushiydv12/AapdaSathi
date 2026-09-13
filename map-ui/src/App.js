import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const floodIcon = new L.DivIcon({
  html: '<div class="pulse-icon flood-hazard">⚠️</div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const rainIcon = new L.DivIcon({
  html: '<div class="rain-animation">🌧️<div class="droplet d1"></div><div class="droplet d2"></div></div>',
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Multi-district mock telemetry database (driven by M2 logic)
const DISTRICT_DATA = {
  "East Khasi Hills": {
    center: [25.5788, 91.8933],
    state: "Meghalaya",
    severity: "CRITICAL",
    hazard_type: "Landslide & Flash Flood",
    road_status: "BLOCKED (Impassable)",
    isolation_status: "ISOLATED - Air Drop Required",
    isRaining: true,
    hasFloodRisk: true
  },
  "Tawang": {
    center: [27.5873, 91.8593],
    state: "Arunachal Pradesh",
    severity: "HIGH",
    hazard_type: "Slope Instability",
    road_status: "PARTIALLY BLOCKED",
    isolation_status: "MONITORED - Ground Access Slow",
    isRaining: true,
    hasFloodRisk: false
  },
  "Gangtok": {
    center: [27.3389, 88.6065],
    state: "Sikkim",
    severity: "MODERATE",
    hazard_type: "Continuous Rainfall",
    road_status: "OPEN (Caution)",
    isolation_status: "CLEAR",
    isRaining: false,
    hasFloodRisk: false
  }
};

// Helper component to pan map smoothly when selection changes
function MapController({ center }) {
  const map = useMap();
  map.setView(center, 8);
  return null;
}

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("East Khasi Hills");
  const data = DISTRICT_DATA[selectedDistrict];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#02172B', display: 'flex', flexDirection: 'column' }}>
      {/* Command Center Header & Theater Switcher */}
      <div style={{ background: '#1E293B', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <h2 style={{ color: '#F8FAFC', margin: 0, fontSize: '18px' }}>
          AapdaSathi | M2: Dynamic Hazard Command Center
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(DISTRICT_DATA).map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              style={{
                background: selectedDistrict === district ? '#3B82F6' : '#334155',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedDistrict === district ? 'bold' : 'normal',
                fontSize: '13px'
              }}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Map Viewport */}
      <MapContainer center={data.center} zoom={8} style={{ width: '100%', height: 'calc(100vh - 55px)' }}>
        <MapController center={data.center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {data.hasFloodRisk && (
          <Marker position={data.center} icon={floodIcon}>
            <Popup className="critical-popup">
              <div style={{ fontSize: '14px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#B91C1C' }}>{selectedDistrict}, {data.state}</h3>
                <strong>🚨 SEVERITY: {data.severity}</strong><br/>
                Hazard: {data.hazard_type}<br/>
                Roads: {data.road_status}<br/>
                Status: {data.isolation_status}
              </div>
            </Popup>
          </Marker>
        )}

        {data.isRaining && (
          <Marker position={data.center} icon={rainIcon} zIndexOffset={1000}>
            <Popup>Heavy Localized Rainfall Active</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;