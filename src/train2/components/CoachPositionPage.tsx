import React, { useState } from 'react';
import { LayoutGrid, Search, AlertCircle, Train, Check, Info } from 'lucide-react';
import { ALL_TRAINS } from '../data/trainsData';

export const CoachPositionPage: React.FC = () => {
  const [trainInput, setTrainInput] = useState('22436');
  const [coachInput, setCoachInput] = useState('C3');
  const [highlightedCoach, setHighlightedCoach] = useState('C3');

  // Find train or use default
  const selectedTrain =
    ALL_TRAINS.find((t) => t.trainNumber === trainInput.trim()) || ALL_TRAINS[0];

  const handleSearchCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    setHighlightedCoach(coachInput.trim().toUpperCase());
  };

  // Illustrative 22-coach express rake composition if standard rake requested
  const illustrativeCoaches = [
    { code: 'ENG', type: 'Locomotive', label: 'WAP-7 Engine', category: 'loco' },
    { code: 'EOG', type: 'Generator', label: 'Power Car 1', category: 'power' },
    { code: 'GEN1', type: 'General', label: 'General Unreserved 1', category: 'gen' },
    { code: 'S1', type: 'Sleeper', label: 'Sleeper S1', category: 'sleeper' },
    { code: 'S2', type: 'Sleeper', label: 'Sleeper S2', category: 'sleeper' },
    { code: 'S3', type: 'Sleeper', label: 'Sleeper S3', category: 'sleeper' },
    { code: 'S4', type: 'Sleeper', label: 'Sleeper S4', category: 'sleeper' },
    { code: 'S5', type: 'Sleeper', label: 'Sleeper S5', category: 'sleeper' },
    { code: 'S6', type: 'Sleeper', label: 'Sleeper S6', category: 'sleeper' },
    { code: 'B1', type: 'AC 3-Tier', label: '3AC B1', category: '3ac' },
    { code: 'B2', type: 'AC 3-Tier', label: '3AC B2', category: '3ac' },
    { code: 'B3', type: 'AC 3-Tier', label: '3AC B3', category: '3ac' },
    { code: 'B4', type: 'AC 3-Tier', label: '3AC B4', category: '3ac' },
    { code: 'B5', type: 'AC 3-Tier', label: '3AC B5', category: '3ac' },
    { code: 'M1', type: '3AC Economy', label: '3E M1', category: '3ac' },
    { code: 'PANTRY', type: 'Pantry Car', label: 'Pantry Car', category: 'pantry' },
    { code: 'A1', type: 'AC 2-Tier', label: '2AC A1', category: '2ac' },
    { code: 'A2', type: 'AC 2-Tier', label: '2AC A2', category: '2ac' },
    { code: 'H1', type: 'AC First Class', label: '1A H1', category: '1ac' },
    { code: 'GEN2', type: 'General', label: 'General Unreserved 2', category: 'gen' },
    { code: 'SLR', type: 'Guard / Luggage', label: 'SLR Guard Brake', category: 'power' },
  ];

  // If active train has configured coaches, merge or use illustrative
  const displayRake =
    selectedTrain.coaches && selectedTrain.coaches.length > 5
      ? selectedTrain.coaches.map((c) => ({
          code: c.coachCode,
          type: c.coachClass,
          label: c.coachName,
          category: c.coachClass.toLowerCase(),
        }))
      : illustrativeCoaches;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl neon-glow-cyan">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <LayoutGrid className="h-4 w-4" />
          <span>Platform Rake Positioning Guide</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Coach Position Guide
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Find where your coach will halt along the station platform
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearchCoach} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Train Number or Name
            </label>
            <select
              value={trainInput}
              onChange={(e) => setTrainInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {ALL_TRAINS.map((t) => (
                <option key={t.trainNumber} value={t.trainNumber}>
                  {t.trainNumber} - {t.trainName}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-48">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Coach Number (e.g. S5, B2, C3)
            </label>
            <input
              type="text"
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="e.g. S5 or C3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan"
            >
              Locate Coach
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Important Notice:</strong> Coach position is informational and may vary by train/service. Indian Railways alters rake orientation based on turnaround terminal requirements. Please verify with overhead platform digital indicators upon arrival.
          </p>
        </div>
      </div>

      {/* Illustrative Train Coach Arrangement */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs text-slate-400 font-medium">Platform Arrival Sequence</span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {selectedTrain.trainNumber} · {selectedTrain.trainName} Rake
            </h3>
          </div>

          {highlightedCoach && (
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span>Highlighted Coach: {highlightedCoach}</span>
            </div>
          )}
        </div>

        {/* Visual Coach Chain */}
        <div className="mt-6 overflow-x-auto pb-4 pt-2">
          <div className="flex items-center gap-2 min-w-[700px]">
            {displayRake.map((c, idx) => {
              const isMatch =
                c.code.toUpperCase() === highlightedCoach.toUpperCase() ||
                (highlightedCoach && c.label.toUpperCase().includes(highlightedCoach.toUpperCase()));

              return (
                <div key={idx} className="flex items-center">
                  <div
                    onClick={() => setHighlightedCoach(c.code)}
                    className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border p-2 cursor-pointer transition-all ${
                      isMatch
                        ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-500/40 neon-glow-cyan'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span className={`text-[9px] uppercase font-mono ${isMatch ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {c.type}
                    </span>
                    <span className="text-sm font-black mt-1">
                      {c.code}
                    </span>
                    <span className={`text-[9px] truncate max-w-[70px] mt-0.5 ${isMatch ? 'text-slate-900' : 'text-slate-400'}`}>
                      {c.label}
                    </span>
                  </div>

                  {idx < displayRake.length - 1 && (
                    <div className="h-0.5 w-2 bg-slate-700 mx-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Engine side (Front of Train) ←</span>
          <span>→ Guard / SLR side (Rear of Train)</span>
        </div>
      </div>
    </div>
  );
};
