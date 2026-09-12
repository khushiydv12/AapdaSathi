import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  FileText, 
  Send, 
  ShieldAlert, 
  Baby, 
  HeartHandshake, 
  HelpCircle,
  Activity,
  AlertOctagon
} from 'lucide-react';
import { ReliefRequest, ReliefCategory, UrgencyLevel } from '../types/relief';
import { computePriorityScore } from '../services/reliefEngine';

interface ReliefRequestFormProps {
  onSubmitRequest: (request: ReliefRequest) => void;
}

export const ReliefRequestForm: React.FC<ReliefRequestFormProps> = ({ onSubmitRequest }) => {
  const [location, setLocation] = useState('');
  const [state, setState] = useState('Assam');
  const [district, setDistrict] = useState('Cachar');
  const [peopleCount, setPeopleCount] = useState<number>(120);
  const [requiredItem, setRequiredItem] = useState('Drinking Water');
  const [category, setCategory] = useState<ReliefCategory>('Drinking Water');
  const [quantity, setQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState('liters');
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [roadBlocked, setRoadBlocked] = useState<boolean>(true);
  const [notes, setNotes] = useState('');

  // Vulnerable counts
  const [childrenCount, setChildrenCount] = useState<number>(35);
  const [elderlyCount, setElderlyCount] = useState<number>(20);
  const [pregnantCount, setPregnantCount] = useState<number>(4);
  const [injuredCount, setInjuredCount] = useState<number>(6);

  // Real-time AI Priority Preview
  const livePriority = computePriorityScore(
    Number(peopleCount),
    urgency,
    {
      children: Number(childrenCount),
      elderly: Number(elderlyCount),
      pregnant: Number(pregnantCount),
      injured: Number(injuredCount)
    },
    roadBlocked,
    0.85
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !requiredItem.trim()) return;

    const newReq: ReliefRequest = {
      request_id: `REQ-NER-${Date.now().toString().slice(-4)}`,
      location,
      state,
      district,
      latitude: 24.8333,
      longitude: 92.7789,
      people_count: Number(peopleCount),
      required_item: requiredItem,
      category,
      quantity: Number(quantity),
      unit,
      urgency,
      vulnerable: {
        children: Number(childrenCount),
        elderly: Number(elderlyCount),
        pregnant: Number(pregnantCount),
        injured: Number(injuredCount)
      },
      road_blocked: roadBlocked,
      status: 'Requested',
      priority_score: livePriority.score,
      priority_class: livePriority.priorityClass,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes
    };

    onSubmitRequest(newReq);
    setLocation('');
    setNotes('');
  };

  const getPriorityColor = (pClass: string) => {
    switch (pClass) {
      case 'CRITICAL': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'HIGH': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Community Intake
            </span>
            <span className="text-xs text-slate-500 font-medium">Citizen & Local Authority Portal</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Community Relief Assistance Intake</span>
          </h3>
          <p className="text-xs text-slate-500">
            Submit local distress requirements. The AI calculates real-time priority scores based on demographic vulnerabilities.
          </p>
        </div>

        {/* Live Priority Score Badge */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 shadow-sm ${getPriorityColor(livePriority.priorityClass)}`}>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">AI Relief Priority Score</div>
            <div className="text-xs font-bold">Priority Class: {livePriority.priorityClass}</div>
          </div>
          <div className="text-2xl font-black">{livePriority.score}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: State, District, Exact Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State (NER)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              {['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District / Sub-Division</label>
            <input
              type="text"
              required
              placeholder="e.g. Cachar, Kamrup, Mangan"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Camp / Locality Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Borkhola Village, Ward 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2: Category, Item, Quantity, Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Category</label>
            <select
              value={category}
              onChange={(e) => {
                const val = e.target.value as ReliefCategory;
                setCategory(val);
                if (val === 'Drinking Water') { setRequiredItem('Drinking Water'); setUnit('liters'); }
                else if (val === 'Food') { setRequiredItem('Emergency Food Packets'); setUnit('packets'); }
                else if (val === 'Medicines') { setRequiredItem('Medical Kits'); setUnit('kits'); }
                else if (val === 'Blankets & Clothes') { setRequiredItem('Thermal Blankets'); setUnit('pieces'); }
                else if (val === 'Sanitary & Hygiene') { setRequiredItem('Hygiene Packs'); setUnit('packs'); }
                else { setRequiredItem('Torches & Batteries'); setUnit('sets'); }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              <option value="Drinking Water">Drinking Water</option>
              <option value="Food">Food & Rations</option>
              <option value="Medicines">Medicines & First Aid</option>
              <option value="Blankets & Clothes">Blankets & Clothes</option>
              <option value="Sanitary & Hygiene">Sanitary & Hygiene</option>
              <option value="Emergency Equipment">Emergency Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Required Item</label>
            <input
              type="text"
              required
              value={requiredItem}
              onChange={(e) => setRequiredItem(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Quantity</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
            <input
              type="text"
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: People Count & Demographic Vulnerabilities */}
        <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Affected Population & Vulnerability Factors</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Weights the AI Priority Score</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">Total Stranded</label>
              <input
                type="number"
                min="1"
                required
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">Children (&lt;10y)</label>
              <input
                type="number"
                min="0"
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">Elderly (60+)</label>
              <input
                type="number"
                min="0"
                value={elderlyCount}
                onChange={(e) => setElderlyCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">Pregnant</label>
              <input
                type="number"
                min="0"
                value={pregnantCount}
                onChange={(e) => setPregnantCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">Injured</label>
              <input
                type="number"
                min="0"
                value={injuredCount}
                onChange={(e) => setInjuredCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Urgency & Road Cutoff */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Perceived Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              <option value="CRITICAL">🔴 CRITICAL (Immediate Life Threat)</option>
              <option value="HIGH">🟠 HIGH (Rapidly Depleting Resources)</option>
              <option value="MODERATE">🟡 MODERATE (Relief Needed within 24h)</option>
              <option value="LOW">🟢 LOW (Preventive Stocking)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 self-end">
            <input
              type="checkbox"
              id="road_blocked_check"
              checked={roadBlocked}
              onChange={(e) => setRoadBlocked(e.target.checked)}
              className="w-4 h-4 text-sky-600 bg-white border-slate-300 rounded focus:ring-sky-500"
            />
            <label htmlFor="road_blocked_check" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-900">Road Access Cutoff / Inaccessible</span>
              <span className="text-[11px] text-slate-500">Requires air-drop or motorized boat convoy</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Ground Situation Notes</label>
          <textarea
            rows={2}
            placeholder="Describe specific conditions e.g. river overflow height, road damage, landmark coordinates..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Community Relief Requirement</span>
          </button>
        </div>
      </form>
    </div>
  );
};
