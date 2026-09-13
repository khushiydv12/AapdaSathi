import React, { useState } from 'react';
import { 
  Bot, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Navigation, 
  Truck, 
  AlertTriangle,
  X,
  ArrowRight
} from 'lucide-react';
import { ReliefRequest, InventoryItem, DeliveryRecord } from '../types/relief';
import { matchNeedToRelief } from '../services/reliefEngine';

interface NeedMatcherModalProps {
  request: ReliefRequest | null;
  inventory: InventoryItem[];
  onClose: () => void;
  onConfirmAllocation: (deliveryRecord: DeliveryRecord, updatedRequest: ReliefRequest) => void;
}

export const NeedMatcherModal: React.FC<NeedMatcherModalProps> = ({
  request,
  inventory,
  onClose,
  onConfirmAllocation
}) => {
  if (!request) return null;

  const matchResult = matchNeedToRelief(request, inventory);
  const [transporter, setTransporter] = useState('NDRF Logistics 2nd Bn');
  const [vehicleNo, setVehicleNo] = useState('AS-01-ET-8921');

  const handleDispatch = () => {
    if (!matchResult.primary_recommendation) return;

    const deliveryRecord: DeliveryRecord = {
      distribution_id: `DISP-NER-${Date.now().toString().slice(-4)}`,
      request_id: request.request_id,
      source_depot: matchResult.primary_recommendation.depot_name,
      destination_camp: `${request.location} (${request.district}, ${request.state})`,
      item: request.required_item,
      quantity: matchResult.total_allocated,
      unit: request.unit,
      transporter,
      vehicle_no: vehicleNo,
      dispatch_time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      estimated_arrival: 'Within 90 minutes',
      delivery_status: 'Assigned',
      recipient_confirmed: false,
      transit_progress_pct: 15
    };

    const updatedRequest: ReliefRequest = {
      ...request,
      status: 'Assigned',
      assigned_depot: matchResult.primary_recommendation.depot_name,
      transporter: transporter
    };

    onConfirmAllocation(deliveryRecord, updatedRequest);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
                Geospatial Matching
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">AI Need-to-Relief Distance Matcher</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demand Info Banner */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Destination Demand</span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{request.location} ({request.district}, {request.state})</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              Stranded: <strong className="text-slate-900">{request.people_count} citizens</strong> | Priority Score: <strong className="text-rose-600">{request.priority_score}</strong>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white px-3.5 py-2 rounded-xl border border-sky-100 shrink-0 shadow-xs">
            <div className="text-[10px] uppercase text-slate-500 font-bold">Needed Stock</div>
            <div className="text-base font-black text-sky-700">
              {request.quantity.toLocaleString()} {request.unit}
            </div>
            <div className="text-[11px] text-slate-700 font-semibold">{request.required_item}</div>
          </div>
        </div>

        {/* AI Recommendations */}
        {matchResult.match_found && matchResult.primary_recommendation ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    Nearest Optimal Source Identified
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                  {matchResult.primary_recommendation.distance_km} km away
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900">
                {matchResult.primary_recommendation.depot_name}
              </div>
              <div className="text-xs text-emerald-900 mt-1 font-medium">
                Stock Available at Depot: <strong className="text-emerald-800">{matchResult.primary_recommendation.available_quantity.toLocaleString()} {request.unit}</strong>
                {matchResult.primary_recommendation.can_fulfill_fully ? (
                  <span className="ml-2 text-emerald-700 font-bold">✓ 100% Demand Can Be Dispatched Immediately</span>
                ) : (
                  <span className="ml-2 text-amber-700 font-bold">⚠️ Partial stock available; multi-depot staging recommended</span>
                )}
              </div>
            </div>

            {/* Candidate Breakdown */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                All Evaluated Depots in Vicinity ({matchResult.allocations.length})
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {matchResult.allocations.map((alloc, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{alloc.depot_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {alloc.depot_type} • Contact: {alloc.contact_person} ({alloc.contact_phone})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sky-700">{alloc.allocated_quantity.toLocaleString()} {request.unit}</span>
                      <div className="text-[10px] text-slate-500 font-medium">{alloc.distance_km} km away</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispatch Form Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Transporter</label>
                <input
                  type="text"
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle / Callsign</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-sky-200 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Approve & Dispatch Allocation</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">No Matching Stocks Found</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently, no registered warehouse or depot in the NER cluster has stock for "{request.required_item}".
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
