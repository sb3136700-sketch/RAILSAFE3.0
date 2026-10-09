import React, { useState } from 'react';
import { 
  Train, 
  Wifi, 
  Utensils, 
  Coffee, 
  Clock, 
  MapPin, 
  Armchair, 
  Accessibility, 
  BatteryCharging, 
  Droplet, 
  Luggage, 
  Bell, 
  Search, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { TrainDetails, RouteStop, DestinationAlarm } from '../types/railway';

interface RouteTimelineProps {
  currentTrain: TrainDetails;
  currentStopIndex: number;
  alarm: DestinationAlarm;
  onSetAlarmForStation: (stationCode: string, stationName: string) => void;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  currentTrain,
  currentStopIndex,
  alarm,
  onSetAlarmForStation,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(null);

  const stops = currentTrain.routeStops;

  const filteredStops = stops.filter((stop, idx) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = stop.stationName.toLowerCase().includes(q);
      const matchCode = stop.stationCode.toLowerCase().includes(q);
      const matchFood = stop.localSpecialty?.dish.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchFood) return false;
    }

    // Filter type
    if (filterType === 'upcoming') {
      return idx >= currentStopIndex;
    }
    if (filterType === 'food') {
      return !!stop.localSpecialty;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Route Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-amber-400 font-semibold">{currentTrain.trainNumber}</span>
            <span>·</span>
            <span>{currentTrain.type}</span>
            <span>·</span>
            <span>{stops.length} Total Halts</span>
            <span>·</span>
            <span>{currentTrain.totalDistanceKm} km</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {currentTrain.trainName} Route & Stations
          </h2>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <span>Runs on:</span>
            <span className="font-mono text-amber-300">{currentTrain.runsOnDays.join(', ')}</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station or food..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Halts
            </button>
            <button
              onClick={() => setFilterType('upcoming')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'upcoming'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterType('food')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'food'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="h-3 w-3" />
              <span>Famous Food</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stations Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
        {filteredStops.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm bg-slate-900/50 rounded-2xl border border-slate-800">
            No stations found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredStops.map((stop) => {
            const originalIndex = stops.findIndex((s) => s.stationCode === stop.stationCode);
            const isPassed = originalIndex < currentStopIndex;
            const isCurrentApproaching = originalIndex === currentStopIndex;
            const isAlarmSet = alarm.enabled && alarm.stationCode === stop.stationCode;
            const hasSpecialty = !!stop.localSpecialty;

            return (
              <div key={stop.stationCode} className="relative group">
                {/* Timeline node pin */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    isPassed
                      ? 'border-emerald-500 bg-slate-950 text-emerald-400'
                      : isCurrentApproaching
                      ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-110 font-bold'
                      : 'border-slate-700 bg-slate-950 text-slate-500'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  ) : isCurrentApproaching ? (
                    <Train className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-mono">{originalIndex + 1}</span>
                  )}
                </div>

                {/* Station Card */}
                <div
                  className={`rounded-2xl border p-5 transition-all ${
                    isCurrentApproaching
                      ? 'border-amber-500/50 bg-slate-900/90 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {stop.stationName}
                        </h3>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {stop.stationCode}
                        </span>
                        {isCurrentApproaching && (
                          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping inline-block" />
                            Next Stop
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{stop.city}, {stop.state}</span>
                        <span>·</span>
                        <span>Distance: <strong className="text-slate-300 font-mono">{stop.distanceKm} km</strong></span>
                        <span>·</span>
                        <span className="font-semibold text-slate-200">
                          Platform {stop.platform}
                        </span>
                      </div>
                    </div>

                    {/* Times & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">
                          Arrive: <strong className="text-white font-mono text-sm">{stop.arrivalTime}</strong>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Depart: <span className="font-mono text-slate-300">{stop.departureTime}</span>
                          {stop.haltMinutes > 0 && (
                            <span className="text-amber-400 ml-1.5 font-medium">({stop.haltMinutes}m halt)</span>
                          )}
                        </div>
                      </div>

                      {/* Station Wake-up Alarm Toggle */}
                      {!isPassed && (
                        <button
                          onClick={() => onSetAlarmForStation(stop.stationCode, stop.stationName)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            isAlarmSet
                              ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
                          }`}
                          title="Set wake-up alarm for this stop"
                        >
                          <Bell className={`h-3.5 w-3.5 ${isAlarmSet ? 'animate-bounce' : ''}`} />
                          <span className="hidden sm:inline">{isAlarmSet ? 'Alarm Active' : 'Set Alarm'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Station Amenities Badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {stop.wifi && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Wifi className="h-3 w-3 text-cyan-400" />
                        <span>Free Wi-Fi</span>
                      </span>
                    )}
                    {stop.foodPlaza && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Utensils className="h-3 w-3 text-amber-400" />
                        <span>Food Plaza / Jan Aahar</span>
                      </span>
                    )}
                    {stop.executiveLounge && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Coffee className="h-3 w-3 text-emerald-400" />
                        <span>IRCTC Executive Lounge</span>
                      </span>
                    )}
                    {stop.cloakRoom && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Luggage className="h-3 w-3 text-indigo-400" />
                        <span>Cloak Room</span>
                      </span>
                    )}
                    {stop.waitingRoom && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Armchair className="h-3 w-3 text-sky-400" />
                        <span>AC Waiting Room</span>
                      </span>
                    )}
                    {stop.wheelchair && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Accessibility className="h-3 w-3 text-purple-400" />
                        <span>Wheelchair Sahayak</span>
                      </span>
                    )}
                    {stop.waterBooth && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <Droplet className="h-3 w-3 text-blue-400" />
                        <span>RO Water Booth</span>
                      </span>
                    )}
                    {stop.chargingPoints && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        <BatteryCharging className="h-3 w-3 text-yellow-400" />
                        <span>Fast Charging</span>
                      </span>
                    )}
                  </div>

                  {/* Local Specialty Culinary Highlight */}
                  {hasSpecialty && stop.localSpecialty && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          <span>Famous Specialty at {stop.stationName}: {stop.localSpecialty.dish}</span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedSpecialty(
                              expandedSpecialty === stop.stationCode ? null : stop.stationCode
                            )
                          }
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          {expandedSpecialty === stop.stationCode ? 'Less' : 'Platform Tips'}
                        </button>
                      </div>
                      <p className="text-slate-300 text-xs mt-1">
                        {stop.localSpecialty.description}
                      </p>
                      {expandedSpecialty === stop.stationCode && stop.localSpecialty.platformTips && (
                        <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-200">
                          <strong>Where to buy during train halt:</strong> {stop.localSpecialty.platformTips}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
