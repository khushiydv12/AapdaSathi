import React, { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  ShieldAlert, 
  Filter,
  Layers,
  Share2
} from 'lucide-react';
import { ShortageHeatmapDistrict } from '../types/relief';

interface ShortageHeatmapViewProps {
  districts: ShortageHeatmapDistrict[];
}

export const ShortageHeatmapView: React.FC<ShortageHeatmapViewProps> = ({ districts }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [copiedContract, setCopiedContract] = useState(false);

  const filteredDistricts = districts.filter(d => {
    if (filterSeverity === 'ALL') return true;
    return d.overall_shortage === filterSeverity;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'RED':
        return {
          bg: 'bg-rose-50/70 border-rose-200 text-rose-900',
          label: '🔴 Severe Shortage',
          dot: 'bg-rose-500'
        };
      case 'ORANGE':
        return {
          bg: 'bg-orange-50/70 border-orange-200 text-orange-900',
          label: '🟠 Moderate Shortage',
          dot: 'bg-orange-500'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          label: '🟡 Low Shortage',
          dot: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
          label: '🟢 Adequate Resources',
          dot: 'bg-emerald-500'
        };
    }
  };

  const getPillarStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-600 font-bold';
      case 'LOW':
        return 'text-amber-600 font-semibold';
      default:
        return 'text-emerald-600 font-semibold';
    }
  };

  const handleExportForMember2 = () => {
    const exportData = {
      layer_id: "relief_shortage_heatmap",
      generated_by: "Relief Intelligence Subsystem",
      intended_consumer: "Interactive Map Engine & Authority Dashboard",
      timestamp: new Date().toISOString(),
      districts: districts.map(d => ({
        id: d.id,
        district: d.district,
        state: d.state,
        coordinates: [d.latitude, d.longitude],
        shortage_level: d.overall_shortage,
        food_status: d.food_status,
        medical_status: d.medical_status,
        water_status: d.water_status,
        disaster_risk: d.disaster_risk
      }))
    };

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Shortage Analytics
            </span>
            <span className="text-xs text-slate-500 font-medium">Regional Matrix</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <span>Relief Need Heatmap & District Shortage Matrix</span>
          </h2>
          <p className="text-xs text-slate-500">
            Couples natural hazard risks with real-time food, medicine, and water deficit indicators
          </p>
        </div>

        <button
          onClick={handleExportForMember2}
          className="flex items-center gap-2 bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Share2 className="w-4 h-4 text-sky-600" />
          <span>{copiedContract ? '✓ GeoJSON Copied!' : 'Export GeoJSON Heatmap'}</span>
        </button>
      </div>

      {/* Legend & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold text-[11px] mr-1">Shortage Tiers:</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px]">
            🔴 Severe
          </span>
          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-semibold text-[11px]">
            🟠 Moderate
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
            🟡 Low
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
            🟢 Adequate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Shortage Levels</option>
            <option value="RED">Red (Severe Shortage Only)</option>
            <option value="ORANGE">Orange (Moderate Shortage)</option>
            <option value="YELLOW">Yellow (Low Shortage)</option>
            <option value="GREEN">Green (Adequate Resources)</option>
          </select>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDistricts.map((item) => {
          const badge = getSeverityBadge(item.overall_shortage);

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-4 shadow-sm transition-all hover:shadow-md ${badge.bg}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.state}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${badge.dot} ring-4 ring-white`} />
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{item.district}</span>
              </h4>

              <div className="bg-white/90 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs mb-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    Disaster Risk:
                  </span>
                  <span className="font-bold text-rose-600">{item.disaster_risk}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-slate-400" />
                    Food Supply:
                  </span>
                  <span className={getPillarStatusBadge(item.food_status)}>{item.food_status}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                    Medical Supply:
                  </span>
                  <span className={getPillarStatusBadge(item.medical_status)}>{item.medical_status}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-slate-400" />
                    Water Supply:
                  </span>
                  <span className={getPillarStatusBadge(item.water_status)}>{item.water_status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Active Shortage:</span>
                <span className="font-black text-slate-900">{item.active_shortage_count.toLocaleString()} Units</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
