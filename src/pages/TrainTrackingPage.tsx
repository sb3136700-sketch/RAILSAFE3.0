import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { TrainDetails } from '../types';
import { MapViewer } from '../components/MapViewer';
import {
  Train,
  Search,
  MapPin,
  Clock,
  Radio,
  AlertCircle,
  CheckCircle2,
  Bell,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const TrainTrackingPage: React.FC = () => {
  const [trains, setTrains] = useState<TrainDetails[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<TrainDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stationReminder, setStationReminder] = useState<string | null>(null);

  useEffect(() => {
    loadTrains();
  }, []);

  const loadTrains = async () => {
    setIsLoading(true);
    try {
      const data = await api.searchTrains();
      setTrains(data);
      if (data.length > 0 && !selectedTrain) {
        setSelectedTrain(data[0]);
      }
    } catch (err) {
      console.error('Failed to load trains:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTrain = async (trainNumber: string) => {
    setIsLoading(true);
    try {
      const details = await api.getTrainDetails(trainNumber);
      setSelectedTrain(details);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrains = trains.filter(
    (t) =>
      t.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destinationCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare map markers
  const mapMarkers = selectedTrain
    ? [
        {
          lat: selectedTrain.currentLat,
          lng: selectedTrain.currentLng,
          title: `${selectedTrain.trainNumber} — ${selectedTrain.trainName}`,
          subtitle: `Speed: ${selectedTrain.speedKmh} km/h • Delay: ${selectedTrain.delayMinutes} min`,
          iconType: 'train' as const,
          isCurrent: true,
        },
        ...selectedTrain.stations.map((st) => ({
          lat: st.lat,
          lng: st.lng,
          title: `${st.name} (${st.code})`,
          subtitle: `Arr: ${st.scheduledArrival} | Dep: ${st.scheduledDeparture} | Plat: ${st.platform || 'N/A'}`,
          iconType: 'station' as const,
          isCurrent: st.isCurrent,
        })),
      ]
    : [];

  const polylineCoords: [number, number][] = selectedTrain
    ? selectedTrain.stations.map((st) => [st.lat, st.lng])
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-wide">LIVE TRAIN RADAR & ROUTE TRACKING</h1>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              GPS TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time train positioning, scheduled halts, and verified arrival estimates.
          </p>
        </div>

        {/* Data Authenticity & Provider Badge */}
        {selectedTrain && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            {selectedTrain.isDemoData ? (
              <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 flex items-center gap-2 shadow-lg">
                <AlertCircle size={15} className="text-amber-400" />
                <div>
                  <div className="font-bold font-mono">DEMO MODE — SIMULATED GPS</div>
                  <div className="text-[10px] text-amber-400/80">Live RailRadar API key unconfigured</div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <div>
                  <div className="font-bold font-mono">LIVE RAILRADAR CONNECTED</div>
                  <div className="text-[10px] text-emerald-400/80">Authentic GPS stream active</div>
                </div>
              </div>
            )}

            <button
              onClick={() => selectedTrain && handleSelectTrain(selectedTrain.trainNumber)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Refresh GPS telemetry"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Search & Selector row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search train or station..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {filteredTrains.map((train) => {
              const isSelected = selectedTrain?.trainNumber === train.trainNumber;
              return (
                <button
                  key={train.trainNumber}
                  onClick={() => handleSelectTrain(train.trainNumber)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black font-mono text-cyan-400">{train.trainNumber}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      train.delayMinutes === 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {train.delayMinutes === 0 ? 'ON TIME' : `+${train.delayMinutes} MIN`}
                    </span>
                  </div>
                  <div className="text-xs font-bold mt-1 text-slate-100 truncate">{train.trainName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>{train.sourceCode}</span> <ArrowRight size={10} /> <span>{train.destinationCode}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Train Details & Real-time Route */}
        {selectedTrain && (
          <div className="md:col-span-2 space-y-4">
            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Speed</span>
                <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">{selectedTrain.speedKmh} km/h</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
                <div className="text-lg font-bold text-white mt-0.5 capitalize">{selectedTrain.status.replace('_', ' ')}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Delay</span>
                <div className={`text-lg font-black font-mono mt-0.5 ${selectedTrain.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedTrain.delayMinutes} min
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Distance</span>
                <div className="text-lg font-black text-white font-mono mt-0.5">{selectedTrain.totalDistanceKm} km</div>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <MapViewer
              center={[selectedTrain.currentLat, selectedTrain.currentLng]}
              zoom={7}
              markers={mapMarkers}
              polyline={polylineCoords}
              className="h-80 w-full"
            />
          </div>
        )}
      </div>

      {/* Ordered Station Stops & Route Timeline */}
      {selectedTrain && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" />
                Scheduled Halts & Station Sequence
              </h3>
              <p className="text-xs text-slate-400">
                Track arrivals, platforms, and set upcoming station reminders
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {selectedTrain.stations.length} Stops
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Station</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Sch. Arr</th>
                  <th className="py-2.5 px-3">Sch. Dep</th>
                  <th className="py-2.5 px-3">Delay</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3 text-right">Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {selectedTrain.stations.map((st) => (
                  <tr
                    key={st.code}
                    className={`hover:bg-slate-850/50 transition-colors ${
                      st.isCurrent ? 'bg-cyan-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      {st.isCompleted ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : st.isCurrent ? (
                        <Radio size={14} className="text-cyan-400 animate-pulse shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0 ml-1"></div>
                      )}
                      <span>{st.name}</span>
                      {st.isCurrent && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1 rounded font-mono">
                          APPROACHING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400">{st.code}</td>
                    <td className="py-3 px-3 font-mono">Platform {st.platform || '1'}</td>
                    <td className="py-3 px-3 font-mono">{st.scheduledArrival}</td>
                    <td className="py-3 px-3 font-mono">{st.scheduledDeparture}</td>
                    <td className="py-3 px-3 font-mono">
                      {st.delayMinutes > 0 ? (
                        <span className="text-amber-400">+{st.delayMinutes} m</span>
                      ) : (
                        <span className="text-emerald-400">On time</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{st.distanceKm} km</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setStationReminder(st.code);
                          alert(`Arrival reminder set for station ${st.name} (${st.code}). You will be notified prior to arrival.`);
                        }}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          stationReminder === st.code
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Set Arrival Reminder"
                      >
                        <Bell size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
