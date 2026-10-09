import React, { useState } from 'react';
import { Bell, Volume2, X, Check, Clock, AlertTriangle } from 'lucide-react';
import { DestinationAlarm, RouteStop } from '../types/railway';
import { playRailwayChime, playWakeupAlarm } from '../utils/audioChime';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarm: DestinationAlarm;
  onSaveAlarm: (newAlarm: DestinationAlarm) => void;
  routeStops: RouteStop[];
  currentStopIndex: number;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onClose,
  alarm,
  onSaveAlarm,
  routeStops,
  currentStopIndex,
}) => {
  const [enabled, setEnabled] = useState(alarm.enabled);
  const [selectedStation, setSelectedStation] = useState(
    alarm.stationCode || (routeStops[routeStops.length - 1]?.stationCode ?? '')
  );
  const [offsetMinutes, setOffsetMinutes] = useState(alarm.offsetMinutes || 30);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  if (!isOpen) return null;

  // Filter only upcoming stations
  const eligibleStations = routeStops.slice(Math.max(1, currentStopIndex));

  const handleTestChime = async () => {
    setIsPlayingTest(true);
    await playRailwayChime();
    playWakeupAlarm();
    setTimeout(() => setIsPlayingTest(false), 2000);
  };

  const handleSave = () => {
    const station = routeStops.find((s) => s.stationCode === selectedStation);
    onSaveAlarm({
      enabled,
      stationCode: selectedStation,
      stationName: station?.stationName || selectedStation,
      offsetMinutes,
      soundPlayed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Destination Wake-up Alarm</h3>
              <p className="text-xs text-slate-400">Never miss your station halt during deep sleep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Toggle alarm */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-sm font-medium text-white">Enable Station Alarm</div>
              <div className="text-xs text-slate-400">Rings audio chime when approaching station</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Select destination station */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Destination / Alert Station
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              disabled={!enabled}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
            >
              {eligibleStations.map((stop) => (
                <option key={stop.stationCode} value={stop.stationCode}>
                  {stop.stationName} ({stop.stationCode}) · ETA {stop.arrivalTime} (PF {stop.platform})
                </option>
              ))}
            </select>
          </div>

          {/* Alert offset selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Wake Me Up Before Arrival:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  disabled={!enabled}
                  onClick={() => setOffsetMinutes(mins)}
                  className={`py-2 px-2 text-center rounded-lg text-xs font-medium border transition-colors disabled:opacity-40 ${
                    offsetMinutes === mins
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* Test Sound Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestChime}
              disabled={isPlayingTest}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors"
            >
              <Volume2 className={`h-4 w-4 ${isPlayingTest ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
              <span>{isPlayingTest ? 'Playing Indian Railways Chime...' : 'Test Station Announcement Chime'}</span>
            </button>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Tip: Keep your phone volume audible. The alarm plays the authentic railway chime even if in silent browsing.
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-md transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Save Alarm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
