import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  MapPin, 
  TrendingDown, 
  AlertCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { InventoryItem, ReliefCategory } from '../types/relief';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onAddStock: (item: InventoryItem) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onAddStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New stock form state
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState<ReliefCategory>('Drinking Water');
  const [newQuantity, setNewQuantity] = useState<number>(500);
  const [newUnit, setNewUnit] = useState('liters');
  const [newLocation, setNewLocation] = useState('');
  const [newState, setNewState] = useState('Assam');
  const [newSource, setNewSource] = useState<InventoryItem['source']>('Government Warehouse');
  const [newContact, setNewContact] = useState('');

  const categories: ('ALL' | ReliefCategory)[] = [
    'ALL',
    'Drinking Water',
    'Food',
    'Medicines',
    'Blankets & Clothes',
    'Sanitary & Hygiene',
    'Emergency Equipment'
  ];

  const states = ['ALL', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesState = selectedState === 'ALL' || item.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleSubmitNewStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newLocation) return;

    const item: InventoryItem = {
      item_id: `INV-${Date.now().toString().slice(-5)}`,
      item_name: newItemName,
      category: newCategory,
      quantity: Number(newQuantity),
      unit: newUnit,
      location: newLocation,
      state: newState,
      source: newSource,
      latitude: 26.1445,
      longitude: 91.7362,
      contact_person: newContact || 'Depot Manager'
    };

    onAddStock(item);
    setIsAddModalOpen(false);
    setNewItemName('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-600" />
            <span>Relief Inventory & Shortage Control</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active stockpiles across North Eastern Region depots, warehouses, NGOs, and camps
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Stock</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search relief supplies, depots, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            {states.map(s => (
              <option key={s} value={s}>State: {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Format Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-sky-50/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-sky-100 font-bold">
              <tr>
                <th className="px-4 py-3.5">Relief Item</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Depot / Location</th>
                <th className="px-4 py-3.5">State</th>
                <th className="px-4 py-3.5">Available Stock</th>
                <th className="px-4 py-3.5">Source Channel</th>
                <th className="px-4 py-3.5">Contact Person</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.item_id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span>{item.item_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono ml-4">{item.item_id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium text-[11px] border border-sky-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">
                      {item.state}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-extrabold text-emerald-600 text-sm">
                        {item.quantity.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-1">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-slate-50 text-slate-700 border-slate-200">
                        <Building2 className="w-3 h-3 text-sky-600" />
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      <span className="font-medium text-slate-700">{item.contact_person || 'Logistics Incharge'}</span>
                      {item.contact_phone && (
                        <div className="text-slate-400 text-[10px]">{item.contact_phone}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Register / Replenish Relief Stock</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bottled Water, ORS Sachets, Tarpaulins"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ReliefCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Depot Type</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="Government Warehouse">Government Warehouse</option>
                    <option value="Relief Centre">Relief Centre</option>
                    <option value="NGO">NGO Depot</option>
                    <option value="Volunteer">Volunteer Group</option>
                    <option value="Donor">Private Donor</option>
                    <option value="Relief Camp">Relief Camp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="liters, packets, kits, pieces"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {states.filter(s => s !== 'ALL').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Depot / Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silchar Civil Supply Hub"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Officer / Phone</label>
                <input
                  type="text"
                  placeholder="e.g. Officer Baruah (+91 94350 ...)"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-200"
                >
                  Save Stock Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
