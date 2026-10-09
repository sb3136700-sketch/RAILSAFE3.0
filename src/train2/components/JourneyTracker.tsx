import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Clock, 
  MapPin, 
  Gauge, 
  Share2, 
  Bell, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Utensils, 
  AlertCircle,
  Copy,
  Check,
  Compass,
  FileText,
  Car,
  Ticket,
  ExternalLink,
  Calculator,
  Building2,
  LayoutGrid,
  CheckSquare
} from 'lucide-react';
import { TrainDetails, RouteStop, DestinationAlarm, UserProfile } from '../types/railway';
import { playRailwayChime, playWakeupAlarm } from '../utils/audioChime';
import { DestinationWeatherCard } from './DestinationWeatherCard';
import { LuggageReminderCard } from './LuggageReminderCard';
import { LiveTrainLocationCard } from './LiveTrainLocationCard';

interface JourneyTrackerProps {
  currentTrain: TrainDetails;
  allTrains: TrainDetails[];
  onSelectTrain: (train: TrainDetails) => void;
  alarm: DestinationAlarm;
  onOpenAlarmModal: () => void;
  onNavigateToRoute: () => void;
  onNavigateToNearby: () => void;
  onOpenComplaintModal: () => void;
  onOpenFoodModal: () => void;
  onOpenTicketModal: () => void;
  userProfile: UserProfile;
  onNavigateToPnrStatus?: () => void;
  onNavigateToFareCalculator?: () => void;
  onNavigateToCoachPosition?: () => void;
  onNavigateToStationInfo?: () => void;
  onNavigateToChecklist?: () => void;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  currentTrain,
  allTrains,
  onSelectTrain,
  alarm,
  onOpenAlarmModal,
  onNavigateToRoute,
  onNavigateToNearby,
  onOpenComplaintModal,
  onOpenFoodModal,
  onOpenTicketModal,
  userProfile,
  onNavigateToPnrStatus,
  onNavigateToFareCalculator,
  onNavigateToCoachPosition,
  onNavigateToStationInfo,
  onNavigateToChecklist,
}) => {
  const [stopIndex, setStopIndex] = useState(1);
  const [progressBetweenStops, setProgressBetweenStops] = useState(0.65);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(currentTrain.avgSpeedKmph);
  const [copiedShare, setCopiedShare] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const stops = currentTrain.routeStops;
  const currentApproachingStop: RouteStop = stops[stopIndex] || stops[stops.length - 1];
  const previousStop: RouteStop = stops[Math.max(0, stopIndex - 1)];

  const segStartKm = previousStop.distanceKm;
  const segEndKm = currentApproachingStop.distanceKm;
  const totalJourneyKm = currentTrain.totalDistanceKm;
  
  const currentKm = Math.round(segStartKm + (segEndKm - segStartKm) * progressBetweenStops);
  const remainingKm = Math.max(0, totalJourneyKm - currentKm);
  const totalPercent = Math.min(100, Math.max(0, Math.round((currentKm / totalJourneyKm) * 100)));

  // Simulation timer
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgressBetweenStops((prev) => {
        if (prev >= 0.98) {
          setStopIndex((currIdx) => {
            if (currIdx < stops.length - 1) {
              return currIdx + 1;
            } else {
              setIsSimulating(false);
              return currIdx;
            }
          });
          return 0.05;
        }
        return prev + 0.02;
      });

      setCurrentSpeed((base) => {
        const jitter = Math.floor(Math.random() * 7) - 3;
        return Math.min(currentTrain.maxSpeedKmph, Math.max(45, base + jitter));
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating, stops.length, currentTrain.maxSpeedKmph]);

  // Alarm sound trigger
  useEffect(() => {
    if (alarm.enabled && !alarm.soundPlayed && !alarmTriggered) {
      if (alarm.stationCode === currentApproachingStop.stationCode) {
        if (progressBetweenStops > 0.8) {
          setAlarmTriggered(true);
          playRailwayChime().then(() => {
            playWakeupAlarm();
          });
        }
      }
    }
  }, [alarm, currentApproachingStop.stationCode, progressBetweenStops, alarmTriggered]);

  const shareText = `🚆 RAILSAFE JOURNEY STATUS (route preview, not GPS)\nTrain: ${currentTrain.trainNumber} ${currentTrain.trainName}\nDemo speed: ${isSimulating ? `${currentSpeed} km/h (simulated)` : 'Unavailable in route preview'}\nScheduled next stop: ${currentApproachingStop.stationName} (${currentApproachingStop.stationCode})\nScheduled platform: ${currentApproachingStop.platform}\nScheduled arrival: ${currentApproachingStop.arrivalTime}\nDemo route progress: ${isSimulating ? `${currentKm} km` : 'not active'} / ${totalJourneyKm} km\nFor provider-backed status, see the Real-time train status panel in RailSafe.`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const resetSimulation = () => {
    setStopIndex(1);
    setProgressBetweenStops(0.1);
    setIsSimulating(true);
    setAlarmTriggered(false);
  };

  return (
    <div className="space-y-6">
      {/* Alarm Banner Alert when triggered */}
      {alarmTriggered && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-300 animate-pulse neon-glow-amber">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                DEMO STATION ALARM: Route preview near {currentApproachingStop.stationName} ({currentApproachingStop.stationCode})!
              </div>
              <div className="text-xs text-amber-200">
                Scheduled arrival: {currentApproachingStop.arrivalTime} · Platform {currentApproachingStop.platform}. Get ready to deboard!
              </div>
            </div>
          </div>
          <button
            onClick={() => setAlarmTriggered(false)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Train Selector & Telemetry Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl neon-glow-amber">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-400 shadow-inner">
            <Train className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 font-mono tracking-wider">
                {currentTrain.trainNumber}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-semibold text-slate-300">
                {currentTrain.type}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-semibold text-cyan-300">● Schedule preview · Live status below</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentTrain.trainName}
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{currentTrain.sourceName} ({currentTrain.sourceCode})</span>
              <span>→</span>
              <span>{currentTrain.destName} ({currentTrain.destCode})</span>
              <span>·</span>
              <span>{currentTrain.duration}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Live WhatsApp Location Share + Quick Dropdown */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={currentTrain.trainNumber}
            onChange={(e) => {
              const tr = allTrains.find((t) => t.trainNumber === e.target.value);
              if (tr) {
                onSelectTrain(tr);
                setStopIndex(1);
                setProgressBetweenStops(0.2);
              }
            }}
            className="flex-1 lg:flex-initial rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
          >
            {allTrains.map((t) => (
              <option key={t.trainNumber} value={t.trainNumber}>
                {t.trainNumber} - {t.trainName}
              </option>
            ))}
          </select>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
            title="Share journey status (not GPS location)"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share Journey Status</span>
          </a>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copiedShare ? 'Copied' : 'Copy Status'}</span>
          </button>
        </div>
      </div>

      <LiveTrainLocationCard trainNumber={currentTrain.trainNumber} trainName={currentTrain.trainName} />

      {/* Quick Action Matrix for Commuters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Cabs / Auto (Ola, Uber, Rapido) */}
        <button
          onClick={onNavigateToNearby}
          className="flex items-center gap-2.5 p-3 rounded-xl border border-lime-500/40 bg-slate-900/90 hover:bg-slate-800 text-left transition-all shadow hover:shadow-lime-500/20 group"
        >
          <div className="h-8 w-8 rounded-lg bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-lime-300">Book Ola / Uber</div>
            <div className="text-[10px] text-slate-400">Rapido & Station Autos</div>
          </div>
        </button>

        {/* Food Order to Seat */}
        <button
          onClick={onOpenFoodModal}
          className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-500/40 bg-slate-900/90 hover:bg-slate-800 text-left transition-all shadow hover:shadow-amber-500/20 group"
        >
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300">Order Food to Seat</div>
            <div className="text-[10px] text-slate-400">IRCTC e-Catering & Pantry</div>
          </div>
        </button>

        {/* RailMadad Official Complaint */}
        <button
          onClick={onOpenComplaintModal}
          className="flex items-center gap-2.5 p-3 rounded-xl border border-red-500/40 bg-slate-900/90 hover:bg-slate-800 text-left transition-all shadow hover:shadow-red-500/20 group"
        >
          <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-red-300">RailMadad Complaint</div>
            <div className="text-[10px] text-slate-400">Cleanliness & Medical</div>
          </div>
        </button>

        {/* E-Ticket Download / Print */}
        <button
          onClick={onOpenTicketModal}
          className="flex items-center gap-2.5 p-3 rounded-xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-800 text-left transition-all shadow hover:shadow-cyan-500/20 group"
        >
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">Download E-Ticket</div>
            <div className="text-[10px] text-slate-400">Print / IRCTC Slip</div>
          </div>
        </button>
      </div>

      {/* Smart Rail Tools Strip (PNR, Fare, Coach Position, Station Info, Checklist) */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <span className="text-slate-400 font-semibold px-1">Passenger Utilities:</span>
        {onNavigateToPnrStatus && (
          <button
            onClick={onNavigateToPnrStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold transition-colors"
          >
            <Ticket className="h-3.5 w-3.5" />
            <span>Check PNR Status</span>
          </button>
        )}
        {onNavigateToFareCalculator && (
          <button
            onClick={onNavigateToFareCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold transition-colors"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Fare Calculator</span>
          </button>
        )}
        {onNavigateToCoachPosition && (
          <button
            onClick={onNavigateToCoachPosition}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold transition-colors"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Coach Position</span>
          </button>
        )}
        {onNavigateToStationInfo && (
          <button
            onClick={onNavigateToStationInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Station Info & Navigation</span>
          </button>
        )}
        {onNavigateToChecklist && (
          <button
            onClick={onNavigateToChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold transition-colors"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Packing Checklist</span>
          </button>
        )}
      </div>

      {/* Main Telemetry Gauges with Neon Glow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Speedometer Gauge (Neon Emerald) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between neon-glow-emerald">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-emerald-400">Demo Route Telemetry (not live)</span>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="font-semibold">{isSimulating ? 'Demo simulation running' : 'Demo simulation paused'}</span>
            </div>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-mono tracking-tight neon-text-cyan">
              {currentSpeed}
            </span>
            <span className="text-sm font-bold text-slate-400">km/h</span>
            <div className="ml-auto text-right text-xs text-slate-400">
              <div>Top Speed: {currentTrain.maxSpeedKmph} km/h</div>
              <div>Average: {currentTrain.avgSpeedKmph} km/h</div>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-500 h-2.5 rounded-full transition-all duration-700 shadow"
              style={{ width: `${isSimulating ? Math.min(100, (currentSpeed / currentTrain.maxSpeedKmph) * 100) : 0}%` }}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Optional demo simulation (not live GPS):</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
              >
                {isSimulating ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isSimulating ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Approaching Station Spotlight (Neon Amber) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between neon-glow-amber">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-amber-400">Next Scheduled Stop (not live)</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
              Platform {currentApproachingStop.platform}
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{currentApproachingStop.stationName}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {currentApproachingStop.stationCode}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>ETA: <strong className="text-white font-mono text-sm">{currentApproachingStop.arrivalTime}</strong></span>
              <span>·</span>
              <span>Halt: {currentApproachingStop.haltMinutes > 0 ? `${currentApproachingStop.haltMinutes} mins` : 'Terminus'}</span>
            </div>
          </div>

          {currentApproachingStop.localSpecialty && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                <Utensils className="h-3 w-3" />
                <span>Station Food: {currentApproachingStop.localSpecialty.dish}</span>
              </div>
              <p className="text-slate-300 text-[11px] truncate mt-0.5">
                {currentApproachingStop.localSpecialty.description}
              </p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Demo distance to stop:</span>
            <span className="font-mono text-white font-bold text-sm">
              {isSimulating ? `${Math.max(0, currentApproachingStop.distanceKm - currentKm)} km (demo)` : '—'}
            </span>
          </div>
        </div>

        {/* Progress & Wake-up Alarm */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between neon-glow-cyan">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-cyan-400">Demo Journey Progress (not live)</span>
            <span className="font-mono text-cyan-300 font-bold">{isSimulating ? `${totalPercent}%` : '—'}</span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-400">Covered: <strong className="text-white font-mono">{isSimulating ? `${currentKm} km` : '—'}</strong></span>
              <span className="text-slate-400">Remaining: <strong className="text-white font-mono">{isSimulating ? `${remainingKm} km` : '—'}</strong></span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-2.5 rounded-full transition-all duration-700 shadow"
                style={{ width: `${isSimulating ? totalPercent : 0}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`h-4 w-4 ${alarm.enabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <div className="text-xs">
                <div className="font-semibold text-white">
                  {alarm.enabled ? `Alarm: ${alarm.stationCode}` : 'Station Alarm Inactive'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {alarm.enabled ? `${alarm.offsetMinutes} mins prior chime` : 'Auto wake-up chime'}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenAlarmModal}
              className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
            >
              {alarm.enabled ? 'Edit' : 'Set Alarm'}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Corridor Stations Tracker */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Corridor Halt Tracker</h3>
            <p className="text-xs text-slate-400">Approaching stops until final terminus</p>
          </div>
          <button
            onClick={onNavigateToRoute}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
          >
            View Full Timetable & Halts →
          </button>
        </div>

        <div className="relative pt-6 pb-2 overflow-x-auto">
          <div className="relative flex justify-between items-start min-w-[500px]">
            {/* Track Line */}
            <div className="absolute top-4 left-6 right-6 h-1.5 bg-slate-800 rounded-full" />
            <div 
              className="absolute top-4 left-6 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `calc(${totalPercent}% * 0.9 + 2%)` }}
            />

            {stops.map((stop, idx) => {
              const isPassed = idx < stopIndex;
              const isCurrent = idx === stopIndex;

              return (
                <div key={stop.stationCode} className="flex flex-col items-center text-center max-w-[100px] z-10">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      isPassed
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'border-amber-400 bg-amber-500 text-slate-950 font-black scale-110 shadow-lg shadow-amber-500/50 animate-pulse'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isCurrent ? <Train className="h-4 w-4" /> : <span className="text-[10px] font-mono">{idx + 1}</span>}
                  </div>

                  <div className="mt-2">
                    <div className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : 'text-slate-200'}`}>
                      {stop.stationCode}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[90px]">
                      {stop.stationName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {stop.arrivalTime}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      PF {stop.platform}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Destination Weather & Deboarding Luggage Reminder Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DestinationWeatherCard
          destinationCity={currentTrain.destName.split(' ')[0]}
          stationCode={currentTrain.destCode}
        />
        <LuggageReminderCard />
      </div>
    </div>
  );
};
