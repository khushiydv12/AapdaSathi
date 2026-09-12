import React from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { DeliveryRecord, DeliveryStatus } from '../types/relief';

interface DeliveryTrackerProps {
  deliveries: DeliveryRecord[];
  onUpdateStatus: (deliveryId: string, newStatus: DeliveryStatus) => void;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  deliveries,
  onUpdateStatus
}) => {
  const stages: DeliveryStatus[] = ['Requested', 'Verified', 'Assigned', 'In Transit', 'Delivered'];

  const getStageIndex = (status: DeliveryStatus) => {
    const idx = stages.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const getNextStatus = (current: DeliveryStatus): DeliveryStatus | null => {
    const idx = stages.indexOf(current);
    if (idx >= 0 && idx < stages.length - 1) {
      return stages[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Relief Logistics Pipeline
            </span>
            <span className="text-xs text-slate-500 font-medium">End-to-End Transport Status</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-600" />
            <span>Relief Delivery Tracking & 5-Stage Status</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time transit pipeline: Warehouse ➔ Transport ➔ Relief Camp ➔ Citizens
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-xs flex items-center gap-3 shadow-sm">
          <span className="text-slate-500 font-medium">Active Shipments:</span>
          <span className="font-extrabold text-sky-700 text-sm">{deliveries.length} Dispatched</span>
        </div>
      </div>

      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-sm">
            No active delivery shipments currently dispatched. Use the Citizen Requests tab to match and dispatch relief.
          </div>
        ) : (
          deliveries.map((delivery) => {
            const currentIdx = getStageIndex(delivery.delivery_status);
            const nextStage = getNextStatus(delivery.delivery_status);
            const isDelivered = delivery.delivery_status === 'Delivered';

            return (
              <div
                key={delivery.distribution_id}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
                  isDelivered ? 'border-slate-200/60 bg-slate-50/40' : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      {delivery.distribution_id}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{delivery.item}</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {delivery.quantity.toLocaleString()} {delivery.unit}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Linked Demand: {delivery.request_id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      delivery.delivery_status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : delivery.delivery_status === 'In Transit'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      {delivery.delivery_status === 'In Transit' && '🚚 '}
                      {delivery.delivery_status === 'Delivered' && '🟢 '}
                      Status: {delivery.delivery_status}
                    </span>

                    {nextStage && (
                      <button
                        onClick={() => onUpdateStatus(delivery.distribution_id, nextStage)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-sky-200 transition-colors"
                      >
                        <span>Advance to {nextStage}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 5-Stage Stepper Bar */}
                <div className="py-2 mb-4">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {stages.map((stage, idx) => {
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                              isCurrent
                                ? 'bg-sky-500 text-white ring-4 ring-sky-100 shadow-sm'
                                : isComplete
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isComplete && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[11px] font-semibold leading-tight ${
                            isCurrent ? 'text-sky-700' : isComplete ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-sky-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${((currentIdx) / (stages.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Route & Transport Logistics Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Origin Source</span>
                    <span className="font-semibold text-slate-800">{delivery.source_depot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Destination Camp</span>
                    <span className="font-semibold text-slate-800">{delivery.destination_camp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Transporter / Vehicle</span>
                    <span className="font-semibold text-slate-800">{delivery.transporter} ({delivery.vehicle_no})</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Dispatch / ETA</span>
                    <span className="font-semibold text-slate-800">{delivery.estimated_arrival}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
