function Shelters() {
  return (
    <div className="page">
      <h1>Nearby Shelters</h1>
      <p className="page-subtitle">
        Find safe places near your location.
      </p>

      <div className="shelter-card">
        <div className="shelter-header">
          <span className="shelter-icon">🏠</span>
          <span className="available">OPEN</span>
        </div>

        <h2>Community Relief Centre</h2>
        <p>📍 1.2 km away</p>

        <div className="capacity">
          <span>Capacity</span>
          <strong>72 / 100</strong>
        </div>

        <div className="capacity-bar">
          <div className="capacity-fill"></div>
        </div>

        <button>Get Directions</button>
      </div>

      <div className="shelter-card">
        <div className="shelter-header">
          <span className="shelter-icon">🏫</span>
          <span className="available">OPEN</span>
        </div>

        <h2>Government School Shelter</h2>
        <p>📍 2.4 km away</p>

        <div className="capacity">
          <span>Capacity</span>
          <strong>45 / 80</strong>
        </div>

        <div className="capacity-bar">
          <div className="capacity-fill second"></div>
        </div>

        <button>Get Directions</button>
      </div>

      <div className="shelter-card full">
        <div className="shelter-header">
          <span className="shelter-icon">🏥</span>
          <span className="full-badge">FULL</span>
        </div>

        <h2>Emergency Care Centre</h2>
        <p>📍 3.1 km away</p>

        <div className="capacity">
          <span>Capacity</span>
          <strong>100 / 100</strong>
        </div>

        <div className="capacity-bar">
          <div className="capacity-fill full-bar"></div>
        </div>

        <button disabled>Currently Full</button>
      </div>
    </div>
  );
}

export default Shelters;