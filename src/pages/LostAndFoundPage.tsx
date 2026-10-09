import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { LostItemReport } from '../types';
import {
  Search,
  PlusCircle,
  Package,
  CheckCircle2,
  Clock,
  Sparkles,
  Train,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const LostAndFoundPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItemReport[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form fields
  const [itemType, setItemType] = useState('Electronic Gadget');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('Black');
  const [trainNumber, setTrainNumber] = useState('12626');
  const [stationOrCoach, setStationOrCoach] = useState('Coach B3, Berth 22');
  const [lossDate, setLossDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLostItems();
  }, []);

  const loadLostItems = async () => {
    try {
      const data = await api.getLostItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide an item description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReport = await api.reportLostItem({
        userId: user.id,
        reporterName: user.name,
        itemType,
        description,
        color,
        trainNumber,
        stationOrCoach,
        lossDate,
      });
      setItems((prev) => [newReport, ...prev]);
      setIsFormOpen(false);
      setDescription('');
      alert(`Lost property report filed with reference ${newReport.referenceId}.`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit lost item report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = items.filter(
    (i) =>
      i.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      i.itemType.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (i.trainNumber && i.trainNumber.includes(searchFilter)) ||
      i.referenceId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-wide">LOST & FOUND PROPERTY REGISTRY</h1>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              AI MATCHED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Report misplaced belongings across railway networks with automated station master matching.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle size={15} />
          {isFormOpen ? 'Close Form' : 'File Lost Item Report'}
        </button>
      </div>

      {/* Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleReportItem} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800">
            Submit Lost Property Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Item Category</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Electronic Gadget">Electronic Gadget (Phone/Laptop/Headphones)</option>
                <option value="Bag / Backpack">Bag / Backpack / Trolley Luggage</option>
                <option value="Wallet / ID / Documents">Wallet / ID Cards / Documents</option>
                <option value="Jewelry / Valuables">Jewelry / Watch / Valuables</option>
                <option value="Clothing / Jacket">Clothing / Shawl / Jacket</option>
                <option value="Other Belonging">Other Belonging</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Color / Texture</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue / Matte Black"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Approx. Date of Loss</label>
              <input
                type="date"
                value={lossDate}
                onChange={(e) => setLossDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Item Description & Identifying Marks</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Black Sony WH-1000XM4 headphones inside black hard shell zip case with scratches on left ear cup"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Train Number (if on train)</label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. 12626"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Coach / Berth / Station Platform</label>
              <input
                type="text"
                value={stationOrCoach}
                onChange={(e) => setStationOrCoach(e.target.value)}
                placeholder="e.g. Coach B3, Berth 22"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Submit Report to National Railway Registry'}
            </button>
          </div>
        </form>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter registered lost and found items..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Items Registry List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{item.referenceId}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                  {item.itemType}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                  item.status === 'matched' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{item.description}</h4>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono pt-0.5">
                <span>Color: {item.color || 'N/A'}</span>
                <span>• Train: {item.trainNumber || 'N/A'}</span>
                <span>• Place: {item.stationOrCoach || 'In transit'}</span>
                <span>• Date: {item.lossDate}</span>
              </div>
            </div>

            {item.matchScore ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 shrink-0 text-right">
                <div className="font-bold flex items-center justify-end gap-1">
                  <Sparkles size={13} /> {item.matchScore}% Match Found
                </div>
                <div className="text-[10px] text-emerald-400/80">Found at Bhopal Station Lost Desk</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
