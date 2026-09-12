function Alerts() {
  return (
    <div className="page">
      <h1>Emergency Alerts</h1>
      <p className="page-subtitle">
        Stay updated about disasters near you.
      </p>

      <div className="alert-card critical">
        <div className="alert-top">
          <span className="alert-icon">⚠️</span>
          <span className="badge">HIGH</span>
        </div>

        <h2>Heavy Rainfall Alert</h2>
        <p>
          Heavy rainfall is expected in your area. Avoid low-lying
          areas and stay indoors if possible.
        </p>

        <span className="alert-time">Updated 10 minutes ago</span>
      </div>

      <div className="alert-card warning">
        <div className="alert-top">
          <span className="alert-icon">🌧️</span>
          <span className="badge">MODERATE</span>
        </div>

        <h2>Waterlogging Advisory</h2>
        <p>
          Some roads may experience waterlogging. Use alternate
          routes when travelling.
        </p>

        <span className="alert-time">Updated 25 minutes ago</span>
      </div>

      <div className="alert-card info">
        <div className="alert-top">
          <span className="alert-icon">ℹ️</span>
          <span className="badge">INFO</span>
        </div>

        <h2>Safety Advisory</h2>
        <p>
          Keep your emergency kit ready and keep your phone charged.
        </p>

        <span className="alert-time">Updated 1 hour ago</span>
      </div>
    </div>
  );
}

export default Alerts;