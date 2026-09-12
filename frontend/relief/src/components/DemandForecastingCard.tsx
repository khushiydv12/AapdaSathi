import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { runDemandForecast } from '../services/reliefEngine';

export const DemandForecastingCard: React.FC = () => {
  const [disasterType, setDisasterType] = useState('Flood');
  const [severity, setSeverity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [population, setPopulation] = useState<number>(20000);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [currentFood, setCurrentFood] = useState<number>(8000);
  const [currentWater, setCurrentWater] = useState<number>(12000);
  const [currentMeds, setCurrentMeds] = useState<number>(400);
  const [currentBlankets, setCurrentBlankets] = useState<number>(3000);

  const forecast = runDemandForecast(
    disasterType,
    severity,
    population,
    durationDays,
    {
      food: currentFood,
      water: currentWater,
      medicine: currentMeds,
      blankets: currentBlankets
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              AI Forecasting Model
            </span>
            <span className="text-xs text-slate-500 font-medium">Predictive Demand Analysis</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            <span>AI Relief Demand Forecasting (24h - 72h)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Predictive deficit model — alerts authorities before supplies run out
          </p>
        </div>

        <button
          onClick={() => {
            setDisasterType('Flood');
            setSeverity('HIGH');
            setPopulation(20000);
            setDurationDays(3);
            setCurrentFood(8000);
            setCurrentWater(12000);
          }}
          className="flex items-center gap-2 bg-white hover:bg-sky-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Simulator Inputs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Simulation Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Disaster Hazard</label>
            <select
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              <option value="Flood">Flash Flood / River Breaching</option>
              <option value="Landslide">Slope Failure / Landslide</option>
              <option value="Earthquake">Seismic Disturbance</option>
              <option value="Cloudburst">Cloudburst Inundation</option>
              <option value="Cyclone">Tropical Storm / Cyclone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assessed Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              <option value="CRITICAL">🔴 CRITICAL</option>
              <option value="HIGH">🟠 HIGH</option>
              <option value="MODERATE">🟡 MODERATE</option>
              <option value="LOW">🟢 LOW</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Displaced Population ({population.toLocaleString()})
            </label>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={population}
              onChange={(e) => setPopulation(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anticipated Duration ({durationDays} Days)
            </label>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Existing Stock Inputs */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Current Stockpiles in Impact Zone Warehouses
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-medium">Food Packets</label>
              <input
                type="number"
                value={currentFood}
                onChange={(e) => setCurrentFood(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-medium">Water Liters</label>
              <input
                type="number"
                value={currentWater}
                onChange={(e) => setCurrentWater(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-medium">Medical Kits</label>
              <input
                type="number"
                value={currentMeds}
                onChange={(e) => setCurrentMeds(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-medium">Blankets</label>
              <input
                type="number"
                value={currentBlankets}
                onChange={(e) => setCurrentBlankets(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Early Warning Alert */}
      {forecast.hasCriticalWarning && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <span>🔴 Critical Relief Shortage Predicted (Early Action Trigger)</span>
            </h4>
            <ul className="mt-2 space-y-1 text-xs text-rose-700 font-medium">
              {forecast.alerts.map((alt, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Predicted Breakdown Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.forecast.map((item) => (
          <div
            key={item.name}
            className={`bg-white border rounded-2xl p-4 shadow-sm ${
              item.isCritical ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200/80 hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">{item.name}</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                item.isCritical
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {item.coverage}% Covered
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 mb-3 font-medium">
              <div className="flex justify-between">
                <span>AI Predicted Need:</span>
                <strong className="text-slate-900">{item.required.toLocaleString()} {item.unit}</strong>
              </div>
              <div className="flex justify-between">
                <span>Current Stock:</span>
                <span className="text-slate-700">{item.current.toLocaleString()} {item.unit}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 text-rose-700">
                <span className="font-bold">Projected Shortage:</span>
                <strong className="text-rose-700 font-black">{item.shortage.toLocaleString()} {item.unit}</strong>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${item.isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${item.coverage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
