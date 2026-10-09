import React, { useState } from 'react';
import { LayoutGrid, Train, Search, Info, Check, User, Sparkles } from 'lucide-react';
import { TrainDetails, TrainCoach } from '../types/railway';

interface CoachSeatMapProps {
  currentTrain: TrainDetails;
}

export const CoachSeatMap: React.FC<CoachSeatMapProps> = ({ currentTrain }) => {
  const coaches = currentTrain.coaches;
  const [selectedCoachCode, setSelectedCoachCode] = useState<string>(
    coaches.find((c) => c.coachClass !== 'LOCO' && c.coachClass !== 'EOG')?.coachCode || 'C1'
  );
  const [seatSearchInput, setSeatSearchInput] = useState('42');
  const [highlightedSeat, setHighlightedSeat] = useState<number>(42);

  const activeCoach = coaches.find((c) => c.coachCode === selectedCoachCode) || coaches[1];

  // Helper to determine berth type in Indian Railways AC 3-Tier / Sleeper (8 berths per bay)
  const getSleeperBerthType = (berthNo: number): { type: string; color: string; desc: string } => {
    const mod = berthNo % 8;
    if (mod === 1 || mod === 4) return { type: 'Lower Berth (LB)', color: 'emerald', desc: 'Easy reach, comfortable for seniors & parents with infants. Used for daytime sitting.' };
    if (mod === 2 || mod === 5) return { type: 'Middle Berth (MB)', color: 'blue', desc: 'Sleep window 10 PM to 6 AM per IRCTC rules. Fold down during day.' };
    if (mod === 3 || mod === 6) return { type: 'Upper Berth (UB)', color: 'indigo', desc: 'Permanent privacy, undisturbed sleep, safe luggage overhead.' };
    if (mod === 7) return { type: 'Side Lower (SL)', color: 'amber', desc: 'Direct track window view. Converted from 2 daytime seats.' };
    return { type: 'Side Upper (SU)', color: 'purple', desc: 'Private single bunk with personal reading lamp and charging socket.' };
  };

  // Helper for Chair Car (Vande Bharat / Shatabdi 3x2 layout)
  const getChairCarSeatType = (seatNo: number): { type: string; color: string; desc: string } => {
    const mod = seatNo % 5;
    if (mod === 1 || mod === 0) return { type: 'Window Seat', color: 'emerald', desc: 'Scenic panoramic outside window view with charging point.' };
    if (mod === 2) return { type: 'Middle Seat', color: 'blue', desc: 'Spacious seat between window and aisle with foldable tray table.' };
    return { type: 'Aisle Seat', color: 'purple', desc: 'Direct corridor access, easy movement to pantry or restroom.' };
  };

  const handleSeatSearch = () => {
    const num = parseInt(seatSearchInput.trim(), 10);
    if (!isNaN(num) && num > 0 && num <= (activeCoach.totalSeats || 78)) {
      setHighlightedSeat(num);
    }
  };

  const isChairCar = activeCoach.coachClass === 'CC' || activeCoach.coachClass === 'EC';
  const berthInfo = isChairCar
    ? getChairCarSeatType(highlightedSeat)
    : getSleeperBerthType(highlightedSeat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <span>{currentTrain.trainNumber}</span>
              <span>·</span>
              <span>{currentTrain.trainName}</span>
            </div>
            <h2 className="text-xl font-bold text-white">Coach Position & Berth Map</h2>
            <p className="text-xs text-slate-400">
              Locate coach position at the platform and explore seat layout
            </p>
          </div>

          {/* Seat Search Bar */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="relative">
              <input
                type="number"
                min="1"
                max={activeCoach.totalSeats || 78}
                value={seatSearchInput}
                onChange={(e) => setSeatSearchInput(e.target.value)}
                placeholder="Berth / Seat No"
                className="w-36 rounded-xl border border-slate-700 bg-slate-950 pl-3 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSeatSearch}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow transition-colors"
            >
              Locate
            </button>
          </div>
        </div>

        {/* Coach Composition / Rake Visualizer */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-2 flex items-center justify-between">
            <span>Rake Coach Order (Platform Arrival Direction →)</span>
            <span className="text-[11px] text-amber-400">Tap coach to view seat grid</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {coaches.map((c, i) => {
              const isSelected = c.coachCode === selectedCoachCode;
              const isLoco = c.coachClass === 'LOCO';
              const isPantry = c.coachClass === 'PANTRY';

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!isLoco) setSelectedCoachCode(c.coachCode);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[70px] h-16 rounded-xl border p-2 transition-all shrink-0 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-white font-bold ring-2 ring-amber-400/40 shadow-lg'
                      : isLoco
                      ? 'border-slate-800 bg-slate-950 text-slate-500 cursor-default'
                      : isPantry
                      ? 'border-emerald-800/50 bg-emerald-950/30 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {c.coachClass}
                  </span>
                  <span className="text-sm font-bold mt-0.5">
                    {c.coachCode}
                  </span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[60px]">
                    {c.totalSeats ? `${c.totalSeats} seats` : isLoco ? 'Engine' : 'Staff'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Coach Inspection Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Berth Highlight & IRCTC Rules */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-xs text-slate-400 mb-1">Inspecting Coach</div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold text-white">
                Coach {activeCoach.coachCode}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {activeCoach.coachClass} Class
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Total Capacity: {activeCoach.totalSeats} passengers
            </div>

            {/* Berth Locator Card */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Berth / Seat No. {highlightedSeat} Selected</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {berthInfo.type}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {berthInfo.desc}
              </p>
            </div>

            {/* Official IRCTC Passenger Guidelines */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Info className="h-3.5 w-3.5 text-amber-400" />
                <span>Official IRCTC Berth Etiquette:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                <li>Middle berth passengers are allowed to sleep between 10:00 PM and 6:00 AM only.</li>
                <li>Lower berths are shared as sitting space by middle and upper berth passengers during daytime.</li>
                <li>Side Lower RAC holders share one berth for daytime seating until chart revision.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Visual Seat Layout Grid */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Interior Coach Cabin Layout ({activeCoach.coachCode})
              </h3>
              <p className="text-xs text-slate-400">Click any seat to inspect its berth allocation</p>
            </div>

            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-amber-500" /> Selected
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-slate-800 border border-slate-700" /> Available
              </span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[500px] overflow-y-auto">
            {isChairCar ? (
              /* Chair Car Layout (rows of 3 + 2 seats separated by aisle) */
              <div className="space-y-2">
                <div className="text-center text-[10px] text-slate-500 pb-1 border-b border-slate-800">
                  ▲ Vestibule / Entry Door
                </div>
                {Array.from({ length: Math.ceil((activeCoach.totalSeats || 78) / 5) }).map((_, rowIdx) => {
                  const baseSeat = rowIdx * 5 + 1;
                  return (
                    <div key={rowIdx} className="flex items-center justify-between gap-3 py-1 px-2 hover:bg-slate-900/50 rounded-lg">
                      {/* Left side (3 seats: Window, Middle, Aisle) */}
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((offset) => {
                          const seatNo = baseSeat + offset;
                          if (seatNo > (activeCoach.totalSeats || 78)) return null;
                          const isSelected = seatNo === highlightedSeat;
                          const info = getChairCarSeatType(seatNo);

                          return (
                            <button
                              key={seatNo}
                              onClick={() => {
                                setHighlightedSeat(seatNo);
                                setSeatSearchInput(seatNo.toString());
                              }}
                              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border text-xs font-mono transition-all ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md scale-105'
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                              }`}
                              title={`${info.type} #${seatNo}`}
                            >
                              <span className="font-bold">{seatNo}</span>
                              <span className="text-[8px] opacity-75">{info.type.slice(0, 3)}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle Path */}
                      <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest px-2">
                        Aisle
                      </div>

                      {/* Right side (2 seats: Aisle, Window) */}
                      <div className="flex items-center gap-1.5">
                        {[3, 4].map((offset) => {
                          const seatNo = baseSeat + offset;
                          if (seatNo > (activeCoach.totalSeats || 78)) return null;
                          const isSelected = seatNo === highlightedSeat;
                          const info = getChairCarSeatType(seatNo);

                          return (
                            <button
                              key={seatNo}
                              onClick={() => {
                                setHighlightedSeat(seatNo);
                                setSeatSearchInput(seatNo.toString());
                              }}
                              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border text-xs font-mono transition-all ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md scale-105'
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                              }`}
                              title={`${info.type} #${seatNo}`}
                            >
                              <span className="font-bold">{seatNo}</span>
                              <span className="text-[8px] opacity-75">{info.type.slice(0, 3)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Sleeper / AC 3-Tier Layout (Bays of 6 berths + 2 side berths) */
              <div className="space-y-4">
                {Array.from({ length: Math.ceil((activeCoach.totalSeats || 72) / 8) }).map((_, bayIdx) => {
                  const bayStart = bayIdx * 8 + 1;
                  return (
                    <div key={bayIdx} className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/40">
                      <div className="text-[10px] text-slate-500 font-mono mb-2">
                        Bay {bayIdx + 1} (Berths {bayStart} to {Math.min(activeCoach.totalSeats || 72, bayStart + 7)})
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Main Cabin (Lower, Middle, Upper x 2) */}
                        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                          {[0, 1, 2, 3, 4, 5].map((offset) => {
                            const berthNo = bayStart + offset;
                            if (berthNo > (activeCoach.totalSeats || 72)) return null;
                            const isSelected = berthNo === highlightedSeat;
                            const info = getSleeperBerthType(berthNo);

                            return (
                              <button
                                key={berthNo}
                                onClick={() => {
                                  setHighlightedSeat(berthNo);
                                  setSeatSearchInput(berthNo.toString());
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-mono transition-all ${
                                  isSelected
                                    ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md scale-105'
                                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className="font-bold text-sm">{berthNo}</span>
                                <span className="text-[9px] opacity-75">{info.type.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Corridor divider */}
                        <div className="hidden sm:block h-12 w-px bg-slate-800" />

                        {/* Side Berths (Side Lower, Side Upper) */}
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end">
                          {[6, 7].map((offset) => {
                            const berthNo = bayStart + offset;
                            if (berthNo > (activeCoach.totalSeats || 72)) return null;
                            const isSelected = berthNo === highlightedSeat;
                            const info = getSleeperBerthType(berthNo);

                            return (
                              <button
                                key={berthNo}
                                onClick={() => {
                                  setHighlightedSeat(berthNo);
                                  setSeatSearchInput(berthNo.toString());
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                                  isSelected
                                    ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md scale-105'
                                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className="font-bold">{berthNo}</span>
                                <span className="text-[9px] opacity-75">
                                  {offset === 6 ? 'Side Lower' : 'Side Upper'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
