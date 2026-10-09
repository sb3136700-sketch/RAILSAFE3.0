import React, { useState, useEffect } from 'react';
import { Briefcase, CheckSquare, Square, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface BelongingItem {
  id: string;
  name: string;
  checked: boolean;
}

const DEFAULT_BELONGINGS: BelongingItem[] = [
  { id: 'b1', name: 'Mobile Phone', checked: false },
  { id: 'b2', name: 'Wallet / Cash / Cards', checked: false },
  { id: 'b3', name: 'Original Govt ID Card', checked: false },
  { id: 'b4', name: 'Train Ticket / E-Ticket PDF', checked: false },
  { id: 'b5', name: 'Under-berth Luggage & Bags', checked: false },
  { id: 'b6', name: 'Mobile Charger & Power Bank', checked: false },
  { id: 'b7', name: 'Earphones / Headphones', checked: false },
  { id: 'b8', name: 'Water Bottle & Jacket', checked: false },
];

const LUGGAGE_STORAGE_KEY = 'tg_belongings_checklist_v1';

export const LuggageReminderCard: React.FC = () => {
  const [belongings, setBelongings] = useState<BelongingItem[]>(() => {
    const saved = localStorage.getItem(LUGGAGE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_BELONGINGS;
      }
    }
    return DEFAULT_BELONGINGS;
  });

  const [customItem, setCustomItem] = useState('');

  useEffect(() => {
    localStorage.setItem(LUGGAGE_STORAGE_KEY, JSON.stringify(belongings));
  }, [belongings]);

  const toggleCheck = (id: string) => {
    setBelongings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItem.trim()) return;
    const newItem: BelongingItem = {
      id: `custom_${Date.now()}`,
      name: customItem.trim(),
      checked: false,
    };
    setBelongings((prev) => [...prev, newItem]);
    setCustomItem('');
  };

  const handleRemove = (id: string) => {
    setBelongings((prev) => prev.filter((item) => item.id !== id));
  };

  const allChecked = belongings.length > 0 && belongings.every((b) => b.checked);
  const checkedCount = belongings.filter((b) => b.checked).length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg neon-glow-amber">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            🧳 Check Your Belongings Reminder
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-amber-400">
          {checkedCount}/{belongings.length} Verified
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mt-2">
        Before deboarding at your station, ensure none of your personal items are left on the train:
      </p>

      {/* Belongings Checklist Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 text-xs">
        {belongings.map((b) => (
          <div
            key={b.id}
            onClick={() => toggleCheck(b.id)}
            className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
              b.checked
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {b.checked ? (
                <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
              <span className={`truncate ${b.checked ? 'line-through text-slate-400' : 'font-medium'}`}>
                {b.name}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(b.id);
              }}
              className="text-slate-600 hover:text-red-400 p-0.5"
              title="Delete item"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {allChecked && (
        <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>All personal items verified! Have a safe onward journey.</span>
        </div>
      )}

      {/* Add Custom item */}
      <form onSubmit={handleAddCustom} className="mt-3 pt-2 border-t border-slate-800/80 flex gap-1.5">
        <input
          type="text"
          value={customItem}
          onChange={(e) => setCustomItem(e.target.value)}
          placeholder="Add custom item (e.g. Glasses, Book)..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
