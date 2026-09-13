import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Truck, 
  MapPin, 
  Layers, 
  TrendingUp, 
  AlertOctagon, 
  ShieldAlert, 
  Users, 
  Bot, 
  CheckCircle2, 
  Clock, 
  FileText,
  Activity,
  ArrowRight,
  Filter,
  RefreshCw,
  Zap
} from 'lucide-react';

import { 
  InventoryItem, 
  ReliefRequest, 
  DeliveryRecord, 
  DeliveryStatus, 
  ShortageHeatmapDistrict 
} from './types/relief';
import { 
  INITIAL_INVENTORY, 
  INITIAL_REQUESTS, 
  INITIAL_DELIVERIES, 
  INITIAL_HEATMAP_DISTRICTS 
} from './services/mockData';
import { computeEssentialCoverageScore } from './services/reliefEngine';
import { getHealth, getInventory, BackendInventoryItem } from './services/api';

import { Navbar } from './components/Navbar';
import { CoverageScoreCard } from './components/CoverageScoreCard';
import { InventoryManager } from './components/InventoryManager';
import { ReliefRequestForm } from './components/ReliefRequestForm';
import { NeedMatcherModal } from './components/NeedMatcherModal';
import { DeliveryTracker } from './components/DeliveryTracker';
import { ShortageHeatmapView } from './components/ShortageHeatmapView';
import { DemandForecastingCard } from './components/DemandForecastingCard';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Master States
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [requests, setRequests] = useState<ReliefRequest[]>(INITIAL_REQUESTS);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(INITIAL_DELIVERIES);
  const [districts] = useState<ShortageHeatmapDistrict[]>(INITIAL_HEATMAP_DISTRICTS);

  // Active request being matched by AI
  const [selectedRequestForMatching, setSelectedRequestForMatching] = useState<ReliefRequest | null>(null);

  // Filter for requests list
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('ALL');

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  // Convert backend inventory data into the exact InventoryItem shape
  // expected by Member 3's existing relief UI.
  const convertBackendInventory = (backendItems: BackendInventoryItem[]): InventoryItem[] => {
    const getCategory = (value: string): InventoryItem['category'] => {
      switch (value.toLowerCase()) {
        case 'food':
          return 'Food';
        case 'water':
        case 'drinking water':
          return 'Drinking Water';
        case 'medicine':
        case 'medicines':
          return 'Medicines';
        case 'shelter':
        case 'blankets':
        case 'blankets & clothes':
          return 'Blankets & Clothes';
        case 'sanitation':
        case 'sanitary & hygiene':
          return 'Sanitary & Hygiene';
        case 'emergency equipment':
          return 'Emergency Equipment';
        default:
          return 'Emergency Equipment';
      }
    };

    const getSource = (value: string): InventoryItem['source'] => {
      const source = value.toLowerCase();

      if (source.includes('government')) return 'Government Warehouse';
      if (source.includes('relief centre') || source.includes('relief center')) return 'Relief Centre';
      if (source.includes('ngo')) return 'NGO';
      if (source.includes('volunteer')) return 'Volunteer';
      if (source.includes('donor')) return 'Donor';
      if (source.includes('camp')) return 'Relief Camp';

      return 'Relief Centre';
    };

    return backendItems.map((item) => ({
      item_id: item.id,
      item_name: item.item,
      category: getCategory(item.category),
      quantity: item.quantity,
      unit: item.unit,
      location: 'North East India',
      state: 'Assam',
      source: getSource(item.source),
      latitude: 26.2006,
      longitude: 92.9376,
      contact_person: 'AapdaSathi Relief Team',
      contact_phone: '+91 00000 00000',
    }));
  };

  // Load inventory from the central Node.js backend.
  // If the backend is unavailable, keep Member 3's original mock data.
  useEffect(() => {
    let mounted = true;

    const loadBackendData = async () => {
      try {
        const health = await getHealth();

        if (!mounted) return;
        setBackendStatus(health.status === 'healthy' ? 'connected' : 'offline');

        const inventoryResponse = await getInventory();

        if (!mounted) return;

        if (inventoryResponse.success && inventoryResponse.data.length > 0) {
          setInventory(convertBackendInventory(inventoryResponse.data));
        }
      } catch (error) {
        console.warn('AapdaSathi backend unavailable. Using local relief data.', error);
        if (mounted) {
          setBackendStatus('offline');
        }
      }
    };

    loadBackendData();

    return () => {
      mounted = false;
    };
  }, []);

  // Automatically scroll to the very top whenever the user switches modules
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Compute live coverage score
  const coverageScore = computeEssentialCoverageScore('Assam & North East', {
    Food: { required: 25000, available: 21000 },
    Water: { required: 30000, available: 19500 },
    Medicine: { required: 1500, available: 850 },
    Shelter: { required: 5000, available: 4200 },
    Sanitation: { required: 4000, available: 2900 }
  });

  // Handlers
  const handleAddStock = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleCreateRequest = (newReq: ReliefRequest) => {
    setRequests(prev => [newReq, ...prev]);
    setActiveTab('requests');
  };

  const handleConfirmAllocation = (newDelivery: DeliveryRecord, updatedRequest: ReliefRequest) => {
    setDeliveries(prev => [newDelivery, ...prev]);
    setRequests(prev => prev.map(r => r.request_id === updatedRequest.request_id ? updatedRequest : r));

    setInventory(prev => prev.map(item => {
      if (item.source.includes(newDelivery.source_depot.split(' ')[0]) || 
          newDelivery.source_depot.includes(item.source)) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - newDelivery.quantity)
        };
      }
      return item;
    }));

    setSelectedRequestForMatching(null);
    setActiveTab('deliveries');
  };

  const handleUpdateDeliveryStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    setDeliveries(prev => prev.map(d => {
      if (d.distribution_id === deliveryId) {
        return {
          ...d,
          delivery_status: newStatus,
          recipient_confirmed: newStatus === 'Delivered',
          transit_progress_pct: newStatus === 'Delivered' ? 100 : newStatus === 'In Transit' ? 75 : 40
        };
      }
      return d;
    }));
  };

  // KPIs
  const pendingRequests = requests.filter(r => r.status === 'Requested' || r.status === 'Verified');
  const inTransitCount = deliveries.filter(d => d.delivery_status === 'In Transit').length;
  const criticalRequestsCount = requests.filter(r => r.priority_class === 'CRITICAL' && r.status !== 'Delivered').length;

  const filteredRequests = requests.filter(r => {
    if (requestStatusFilter === 'ALL') return true;
    return r.status === requestStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-sky-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={pendingRequests.length}
        inTransitDeliveriesCount={inTransitCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* TAB 1: RELIEF COMMAND OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick KPI Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Pending Demands</span>
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{pendingRequests.length}</div>
                <div className="text-[11px] text-rose-600 mt-1 font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" />
                  <span>{criticalRequestsCount} Critical / Cutoff</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Active Shipments</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{deliveries.length}</div>
                <div className="text-[11px] text-amber-700 mt-1 font-bold">
                  {inTransitCount} In Transit
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Relief Stockpiles</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{inventory.length} Depots</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-bold">8 NER States Covered</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Essential Coverage</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{coverageScore.overall_coverage_pct}%</div>
                <div className="text-[11px] text-purple-700 mt-1 font-bold">
                  Gap: {coverageScore.lowest_coverage_pillar}
                </div>
              </div>
            </div>

            {/* Coverage Score Card */}
            <CoverageScoreCard
              scoreData={coverageScore}
              onResolveGapClick={() => setActiveTab('inventory')}
            />

            {/* Two-Column Fast Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Critical Requests Queue */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>High Priority Relief Demands</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-xs text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View All ({requests.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {requests.slice(0, 3).map(req => (
                    <div
                      key={req.request_id}
                      className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-sky-300 hover:bg-sky-50/30 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            req.priority_class === 'CRITICAL'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            Score {req.priority_score} • {req.priority_class}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{req.location}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Demands: <strong className="text-sky-700">{req.quantity} {req.unit}</strong> {req.required_item}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {req.people_count} stranded ({req.vulnerable.children} kids, {req.vulnerable.injured} injured)
                          {req.road_blocked && <span className="text-rose-600 font-bold ml-1.5">⚠️ Road Cut Off</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRequestForMatching(req)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 transition-all shrink-0 self-start sm:self-center"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Match</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Dispatch Stream */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>Live Dispatches & Transit</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className="text-xs text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Pipeline ({deliveries.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {deliveries.slice(0, 3).map(d => (
                    <div
                      key={d.distribution_id}
                      className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{d.item} ({d.quantity} {d.unit})</span>
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          {d.delivery_status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Destination: {d.destination_camp}</span>
                        <span className="text-slate-600 font-medium">{d.transporter}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE INVENTORY */}
        {activeTab === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            onAddStock={handleAddStock}
          />
        )}

        {/* TAB 3: CITIZEN REQUESTS & PRIORITY SCORING */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <ReliefRequestForm onSubmitRequest={handleCreateRequest} />

            {/* Existing Requests List */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-600" />
                    <span>Active Community Requests & AI Priority Ranking</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked automatically by Population + Urgency + Shortage + Accessibility + Vulnerability
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => setRequestStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Requested">Requested (New)</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No requests found matching status "{requestStatusFilter}".
                  </div>
                ) : (
                  filteredRequests.map(req => (
                    <div
                      key={req.request_id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-300 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-bold">
                            {req.request_id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{req.location}</span>
                          <span className="text-xs text-slate-500">({req.district}, {req.state})</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span>Item: <strong className="text-sky-700 font-bold">{req.quantity} {req.unit} {req.required_item}</strong></span>
                          <span>•</span>
                          <span>Population: <strong className="text-slate-900">{req.people_count}</strong></span>
                          <span>•</span>
                          <span className="text-slate-500">
                            Vulnerable: {req.vulnerable.children} kids, {req.vulnerable.elderly} elderly, {req.vulnerable.injured} injured
                          </span>
                          {req.road_blocked && (
                            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              ⚠️ Road Inaccessible
                            </span>
                          )}
                        </div>

                        {req.notes && (
                          <div className="text-xs text-slate-500 italic mt-1">"{req.notes}"</div>
                        )}
                      </div>

                      {/* Right side status & action */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <div className="text-[10px] uppercase text-slate-400 font-bold">Priority Score</div>
                          <div className={`text-base font-black ${
                            req.priority_class === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {req.priority_score} <span className="text-xs font-medium">({req.priority_class})</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          req.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'In Transit'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {req.status}
                        </span>

                        {req.status !== 'Delivered' && req.status !== 'In Transit' && (
                          <button
                            onClick={() => setSelectedRequestForMatching(req)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 transition-all"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>AI Match & Dispatch</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 5-STAGE DELIVERY TRACKING */}
        {activeTab === 'deliveries' && (
          <DeliveryTracker
            deliveries={deliveries}
            onUpdateStatus={handleUpdateDeliveryStatus}
          />
        )}

        {/* TAB 5: HEATMAP & COVERAGE */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <CoverageScoreCard
              scoreData={coverageScore}
              onResolveGapClick={() => setActiveTab('inventory')}
            />
            <ShortageHeatmapView districts={districts} />
          </div>
        )}

        {/* TAB 6: PREDICTIVE DEMAND FORECASTING */}
        {activeTab === 'forecasting' && (
          <DemandForecastingCard />
        )}
      </main>

      {/* AI Need Matching Modal */}
      {selectedRequestForMatching && (
        <NeedMatcherModal
          request={selectedRequestForMatching}
          inventory={inventory}
          onClose={() => setSelectedRequestForMatching(null)}
          onConfirmAllocation={handleConfirmAllocation}
        />
      )}

      {/* Clean Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span>AapdaSathi Disaster Management System • Relief Intelligence & Resource Coordination</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
            backendStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : backendStatus === 'checking'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Backend: {backendStatus === 'connected' ? 'Connected' : backendStatus === 'checking' ? 'Checking' : 'Offline / Demo'}
          </span>
        </div>
      </footer>
    </div>
  );
}
