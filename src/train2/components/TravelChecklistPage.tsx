import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  FileText, 
  Smartphone, 
  Shirt, 
  Apple, 
  Pill, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export interface ChecklistItem {
  id: string;
  name: string;
  category: 'Documents' | 'Electronics' | 'Clothes' | 'Food' | 'Medicines' | 'Personal Items';
  completed: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // Documents
  { id: 'c1', name: 'Original Aadhaar / Govt Photo ID', category: 'Documents', completed: true },
  { id: 'c2', name: 'Printed e-Ticket PDF or IRCTC SMS', category: 'Documents', completed: true },
  { id: 'c3', name: 'Debit/Credit Cards & Cash Currency', category: 'Documents', completed: false },
  // Electronics
  { id: 'c4', name: 'Smartphone with offline railway app', category: 'Electronics', completed: true },
  { id: 'c5', name: 'Power Bank (10,000+ mAh) & Fast Cable', category: 'Electronics', completed: false },
  { id: 'c6', name: 'Earphones / Noise Canceling Pods', category: 'Electronics', completed: false },
  // Clothes
  { id: 'c7', name: 'Light Shawl / Warm Socks (AC vents)', category: 'Clothes', completed: false },
  { id: 'c8', name: 'Comfortable Cotton Nightwear / Flip-flops', category: 'Clothes', completed: false },
  // Food
  { id: 'c9', name: 'Packed Dry Snacks & Biscuits', category: 'Food', completed: false },
  { id: 'c10', name: 'Refillable Stainless Steel Water Bottle', category: 'Food', completed: true },
  // Medicines
  { id: 'c11', name: 'Motion sickness & Digestion tablets', category: 'Medicines', completed: false },
  { id: 'c12', name: 'Pain relief balm & Band-Aids', category: 'Medicines', completed: false },
  // Personal Items
  { id: 'c13', name: 'Paper Soap Strips & Sanitizer bottle', category: 'Personal Items', completed: true },
  { id: 'c14', name: 'Luggage Chain with Number Padlock', category: 'Personal Items', completed: false },
];

const CHECKLIST_STORAGE_KEY = 'tg_master_travel_checklist_v1';

export const TravelChecklistPage: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CHECKLIST;
      }
    }
    return DEFAULT_CHECKLIST;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('Documents');

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const categories = [
    { name: 'Documents', icon: FileText, color: 'text-cyan-400' },
    { name: 'Electronics', icon: Smartphone, color: 'text-amber-400' },
    { name: 'Clothes', icon: Shirt, color: 'text-indigo-400' },
    { name: 'Food', icon: Apple, color: 'text-emerald-400' },
    { name: 'Medicines', icon: Pill, color: 'text-red-400' },
    { name: 'Personal Items', icon: Sparkles, color: 'text-purple-400' },
  ];

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const item: ChecklistItem = {
      id: `chk_${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      completed: false,
    };
    setItems((prev) => [item, ...prev]);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_CHECKLIST);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const filteredItems =
    selectedCategory === 'ALL'
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl neon-glow-cyan">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <CheckSquare className="h-4 w-4" />
              <span>Smart Indian Railway Packing Planner</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Travel Packing Checklist
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Organized by essential journey categories with persistent local storage
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">Overall Packing Progress</span>
            <span className="font-mono font-bold text-cyan-400">{completedCount} of {items.length} items ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new packing item (e.g. Toothbrush, Slippers)..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            required
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as ChecklistItem['category'])}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none sm:w-44"
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All Items ({items.length})
        </button>
        {categories.map((c) => {
          const count = items.filter((i) => i.category === c.name).length;
          const Icon = c.icon;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === c.name
                  ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{c.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No items in this category. Add your own packing item above!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                item.completed
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {item.name}
                  </span>
                  <span className="block text-[10px] text-slate-500">{item.category}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
