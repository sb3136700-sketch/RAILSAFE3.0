import React, { useState } from 'react';
import { 
  Search, 
  ArrowRightLeft, 
  Calendar, 
  Train, 
  Clock, 
  Check, 
  Info, 
  ChevronRight, 
  Sparkles, 
  Zap,
  Filter
} from 'lucide-react';
import { TrainDetails, TrainClass, TrainType } from '../types/railway';
import { MAJOR_STATIONS } from '../data/trainsData';

interface JourneyPlannerProps {
  allTrains: TrainDetails[];
  onSelectTrainForTracking: (train: TrainDetails) => void;
  onSelectTrainForRoute: (train: TrainDetails) => void;
  onSelectTrainForCoach: (train: TrainDetails) => void;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({
  allTrains,
  onSelectTrainForTracking,
  onSelectTrainForRoute,
  onSelectTrainForCoach,
}) => {
  const [fromCode, setFromCode] = useState('NDLS');
  const [toCode, setToCode] = useState('BSB');
  const [journeyDate, setJourneyDate] = useState('2026-09-26');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedQuota, setSelectedQuota] = useState<string>('GN');

  // Quick swap
  const handleSwapStations = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Popular route shortcuts
  const popularRoutes = [
    { from: 'NDLS', to: 'BSB', label: 'Delhi ↔ Varanasi' },
    { from: 'NDLS', to: 'MMCT', label: 'Delhi ↔ Mumbai' },
    { from: 'MAS', to: 'MYS', label: 'Chennai ↔ Mysuru' },
    { from: 'NDLS', to: 'LJN', label: 'Delhi ↔ Lucknow' },
    { from: 'NDLS', to: 'HWH', label: 'Delhi ↔ Kolkata' },
    { from: 'MMCT', to: 'GNC', label: 'Mumbai ↔ Ahmedabad' },
  ];

  // Filter trains
  const matchingTrains = allTrains.filter((train) => {
    // Check if route contains fromStation before toStation
    const stops = train.routeStops;
    const fromIdx = stops.findIndex(
      (s) => s.stationCode === fromCode || s.city.toLowerCase() === fromCode.toLowerCase()
    );
    const toIdx = stops.findIndex(
      (s) => s.stationCode === toCode || s.city.toLowerCase() === toCode.toLowerCase()
    );

    // If both match and sequence is valid
    const matchesStations = fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;

    // Filter by type
    if (selectedType !== 'ALL' && train.type !== selectedType) {
      return false;
    }

    // Filter by class
    if (selectedClass !== 'ALL' && !train.classes.includes(selectedClass as TrainClass)) {
      return false;
    }

    return matchesStations;
  });

  // Fallback: If no direct train found in dataset, show all trains with helpful notice
  const displayTrains = matchingTrains.length > 0 ? matchingTrains : allTrains;

  return (
    <div className="space-y-6">
      {/* Search Console Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Find Trains & Plan Journey</h2>
            <p className="text-xs text-slate-400">Search routes, live seats, Tatkal quotas & fare estimates</p>
          </div>
          
          {/* Quick Tatkal reminder badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Tatkal window: AC at 10:00 AM · Non-AC at 11:00 AM</span>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* From Station */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              From Station
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              {MAJOR_STATIONS.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code}) - {st.city}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-1">
            <button
              onClick={handleSwapStations}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition-colors"
              title="Swap From and To stations"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* To Station */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              To Station
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              {MAJOR_STATIONS.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code}) - {st.city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Journey Date
            </label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Popular Route Shortcuts */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1">Popular routes:</span>
          {popularRoutes.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                setFromCode(r.from);
                setToCode(r.to);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Filters Bar: Quota, Class & Train Type */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Quota */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Quota</label>
            <select
              value={selectedQuota}
              onChange={(e) => setSelectedQuota(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="GN">General Quota (GN)</option>
              <option value="TQ">Tatkal Quota (TQ)</option>
              <option value="PT">Premium Tatkal (PT)</option>
              <option value="LD">Ladies Quota (LD)</option>
              <option value="SS">Senior Citizen (SS)</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Class Filter</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">All Travel Classes</option>
              <option value="EC">Executive Chair Car (EC)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2-Tier (2A)</option>
              <option value="3A">AC 3-Tier (3A)</option>
              <option value="3E">AC 3-Economy (3E)</option>
              <option value="SL">Sleeper Class (SL)</option>
            </select>
          </div>

          {/* Train Type */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Train Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">All Train Types</option>
              <option value="Vande Bharat">Vande Bharat Express</option>
              <option value="Rajdhani">Rajdhani Express</option>
              <option value="Shatabdi">Shatabdi Express</option>
              <option value="Superfast">Superfast Express</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{displayTrains.length} trains</strong> for{' '}
          <strong className="text-amber-400">{fromCode} → {toCode}</strong> on {journeyDate}
        </div>
        {matchingTrains.length === 0 && (
          <div className="text-xs text-amber-400/90 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>Showing all available express corridors</span>
          </div>
        )}
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {displayTrains.map((train) => {
          return (
            <div
              key={train.trainNumber}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                {/* Train identity */}
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {train.trainNumber}
                    </span>
                    <span className="font-semibold text-slate-300">{train.type}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{train.totalDistanceKm} km</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-emerald-400">Pantry {train.pantryAvailable ? 'Available' : 'No'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {train.trainName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Runs On: <span className="font-mono text-slate-300">{train.runsOnDays.join(', ')}</span>
                  </div>
                </div>

                {/* Timings Schedule */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <div className="text-lg font-extrabold text-white font-mono">
                      {train.sourceDeparture}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {train.sourceCode} ({train.sourceName})
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-amber-400 font-mono font-semibold">{train.duration}</span>
                    <div className="w-20 sm:w-24 h-0.5 bg-slate-700 my-1 relative">
                      <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-[10px] text-slate-500">{train.routeStops.length} stops</span>
                  </div>

                  <div>
                    <div className="text-lg font-extrabold text-white font-mono">
                      {train.destArrival}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {train.destCode} ({train.destName})
                    </div>
                  </div>
                </div>
              </div>

              {/* Class & Availability Boxes */}
              <div className="mt-4 flex flex-wrap gap-2.5 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {train.classes.map((cls) => {
                    const fare = train.fares[cls] || 950;
                    // Simulated realistic availability
                    const isAvailable = cls === 'CC' || cls === '3A' || cls === '2A';
                    const availText = isAvailable ? 'AVAILABLE-38' : cls === '1A' ? 'AVAILABLE-6' : 'RAC-14';

                    return (
                      <div
                        key={cls}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 min-w-[110px] text-left hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{cls}</span>
                          <span className="font-mono text-slate-300 font-medium">₹{fare}</span>
                        </div>
                        <div
                          className={`text-[11px] font-mono font-semibold mt-1 ${
                            isAvailable ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {availText}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => onSelectTrainForTracking(train)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-md transition-colors"
                  >
                    <Train className="h-3.5 w-3.5" />
                    <span>Track Live</span>
                  </button>

                  <button
                    onClick={() => onSelectTrainForRoute(train)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <span>Route & Halts</span>
                  </button>

                  <button
                    onClick={() => onSelectTrainForCoach(train)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <span>Coach & Berth</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
