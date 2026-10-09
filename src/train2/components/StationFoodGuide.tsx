import React, { useState } from 'react';
import { Utensils, MapPin, Sparkles, Search, Compass, Info } from 'lucide-react';
import { FAMOUS_STATION_FOODS } from '../data/trainsData';

export const StationFoodGuide: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const allTags = ['ALL', 'Sweet', 'Breakfast', 'Snack', 'Spicy', 'Dessert'];

  const filteredFoods = FAMOUS_STATION_FOODS.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.stationName.toLowerCase().includes(q) ||
      item.dish.toLowerCase().includes(q) ||
      item.stationCode.toLowerCase().includes(q);

    if (selectedTag === 'ALL') return matchesSearch;
    return matchesSearch && item.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Utensils className="h-4 w-4" />
            <span>Culinary Heritage of Indian Railways</span>
          </div>
          <h2 className="text-xl font-bold text-white">Famous Station Food & Platform Specialties</h2>
          <p className="text-xs text-slate-400 mt-1">
            Iconic regional delicacies to taste during train halts across India
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish or station..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-amber-500/40 hover:bg-slate-900 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {item.stationCode}
                </span>
                <span className="text-slate-400 font-medium">{item.stationName}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-1">
                {item.dish}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] text-amber-300/90 flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                <span><strong>Platform Tip:</strong> {item.platformTip}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {item.tags.map((t, tidx) => (
                  <span
                    key={tidx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
