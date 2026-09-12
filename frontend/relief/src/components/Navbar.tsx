import React, { useState } from 'react';
import { 
  Boxes, 
  Truck, 
  MapPin, 
  Cpu, 
  TrendingUp, 
  ClipboardList, 
  Layers, 
  Menu, 
  X, 
  Radio, 
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  inTransitDeliveriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  inTransitDeliveriesCount
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Relief Command Overview', description: 'Real-time KPIs & operational summary', icon: Layers },
    { id: 'inventory', label: 'Live Inventory & Shortages', description: 'Stockpiles across NER warehouses', icon: Boxes },
    { id: 'requests', label: 'Citizen Requests & AI Priority', description: 'Need intake with vulnerability scoring', icon: ClipboardList, badge: pendingRequestsCount },
    { id: 'deliveries', label: 'Delivery Tracking (5-Stage)', description: 'End-to-end transport status', icon: Truck, badge: inTransitDeliveriesCount },
    { id: 'heatmap', label: 'Shortage Heatmap & Coverage', description: 'District resource shortage matrix', icon: MapPin },
    { id: 'forecasting', label: 'Predictive Demand AI (24-72h)', description: 'Early-warning supply deficit models', icon: TrendingUp },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsDrawerOpen(false);
    // Instant scroll to top so the user always sees the top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  const tickerText = "Flooding & landslides reported across Cachar, Mangan & East Khasi Hills • AI Dispatch Active • 156 Relief Camps Operational • Emergency Lifelines En Route • ";

  return (
    <>
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-sm">
        {/* Moving Ticker - Light & Clean */}
        <div className="ticker-container bg-rose-50 border-b border-rose-200/80 flex items-center h-8 overflow-hidden relative select-none">
          {/* Static Live Alert Badge */}
          <div className="bg-rose-600 text-white px-3 h-full flex items-center gap-1.5 shrink-0 z-10 font-bold text-[10px] tracking-wider uppercase shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Live Alert</span>
          </div>

          {/* Scrolling Marquee */}
          <div className="relative overflow-hidden w-full h-full flex items-center">
            <div className="animate-marquee flex items-center whitespace-nowrap text-xs text-rose-900 font-semibold tracking-wide">
              <span className="inline-flex items-center gap-2 mr-8">
                <span>{tickerText}</span>
              </span>
              <span className="inline-flex items-center gap-2 mr-8">
                <span>{tickerText}</span>
              </span>
              <span className="inline-flex items-center gap-2 mr-8">
                <span>{tickerText}</span>
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 h-full bg-rose-100/60 border-l border-rose-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shrink-0 z-10">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>AI Active</span>
          </div>
        </div>

        {/* Clean Lively Light Blue Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div 
              onClick={() => handleSelectTab('overview')} 
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-200 text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">AapdaSathi</span>
                  <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                    Relief
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden xs:block truncate">
                  Disaster Resource & Relief Intelligence
                </p>
              </div>
            </div>

            {/* Current View Pill */}
            <div className="hidden md:flex items-center gap-2 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500 font-medium">Active Module:</span>
              <span className="font-bold text-sky-700">{currentTab.label}</span>
            </div>

            {/* Menu Drawer Toggle Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition-all"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
              {(pendingRequestsCount > 0 || inTransitDeliveriesCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* Drawer Panel */}
          <div 
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Relief Modules</h3>
                  <p className="text-[11px] text-slate-500">Select an operational view</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Options List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-sky-50 border border-sky-300 text-sky-900 shadow-sm'
                        : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-sky-500 text-white shadow-sm shadow-sky-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{tab.label}</span>
                          {tab.badge !== undefined && tab.badge > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-sky-100 bg-sky-50/40 text-center">
              <div className="text-xs text-slate-600 font-medium">
                AapdaSathi Disaster Response
              </div>
              <div className="text-[10px] text-sky-700 font-bold mt-0.5">
                North Eastern Region Operations
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
