import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MapViewer } from '../components/MapViewer';
import {
  ShieldAlert,
  MapPin,
  Clock,
  PhoneCall,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Train,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface LiveSosTrackingPageProps {
  token: string;
}

export const LiveSosTrackingPage: React.FC<LiveSosTrackingPageProps> = ({ token }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicSos();
    // Poll for updates every 15 seconds
    const interval = setInterval(loadPublicSos, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const loadPublicSos = async () => {
    try {
      const result = await api.getPublicLiveSos(token);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Tracking link invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Radio size={36} className="text-red-400 animate-spin mx-auto" />
        <h3 className="text-base font-bold text-white">Loading Live Passenger Telemetry...</h3>
        <p className="text-xs text-slate-400 font-mono">Verifying time-limited encrypted tracking token</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Clock size={24} />
        </div>
        <h3 className="text-lg font-bold text-white">Tracking Session Inactive</h3>
        <p className="text-xs text-slate-400">
          {error || 'This live location tracking link has either expired or been marked resolved by the passenger.'}
        </p>
        <div className="pt-2">
          <a
            href="tel:112"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <PhoneCall size={14} /> Call Emergency Services (112)
          </a>
        </div>
      </div>
    );
  }

  const isStale = data.locationUpdatedAt
    ? Date.now() - new Date(data.locationUpdatedAt).getTime() > 10 * 60 * 1000
    : true;

  const lat = data.currentLatitude || 23.2599;
  const lng = data.currentLongitude || 77.4126;

  const markers = [
    {
      lat,
      lng,
      title: `${data.passengerName} (Live SOS Position)`,
      subtitle: `Accuracy: ±${Math.round(data.locationAccuracy || 20)}m • Last updated: ${new Date(data.locationUpdatedAt).toLocaleTimeString()}`,
      iconType: 'sos' as const,
      isCurrent: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      {/* High Urgency Alert Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-500/50 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
            <ShieldAlert size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded uppercase">
                EMERGENCY ALERT BROADCAST
              </span>
              <span className="text-xs text-slate-400 font-mono">Ref #{data.referenceId}</span>
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">
              {data.passengerName} requested emergency assistance
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Emergency Category: <strong className="text-red-400">{data.category}</strong>
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">Status:</span>
            <span className={`text-xs font-bold font-mono uppercase ${data.status === 'active' ? 'text-red-400' : 'text-emerald-400'}`}>
              {data.status === 'active' ? '● ACTIVE EMERGENCY' : 'RESOLVED'}
            </span>
          </div>

          <button
            onClick={loadPublicSos}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} /> Refresh Position
          </button>
        </div>
      </div>

      {/* Stale location warning if updates stopped */}
      {isStale && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            <strong>Location Warning:</strong> Last successful GPS coordinate was received over 10 minutes ago. The passenger device may be experiencing tunnel signal loss or low battery.
          </span>
        </div>
      )}

      {/* Main Map Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <MapPin size={13} className="text-red-400" />
            Reported GPS Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)} (±{Math.round(data.locationAccuracy || 15)}m)
          </span>
          <span className="font-mono">
            Last ping: {new Date(data.locationUpdatedAt).toLocaleTimeString()}
          </span>
        </div>

        <MapViewer
          center={[lat, lng]}
          zoom={13}
          markers={markers}
          className="h-96 w-full"
        />
      </div>

      {/* Journey Context & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Journey details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Train size={14} className="text-cyan-400" /> Train & Coach Details
          </h3>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Train Number / Name:</span>
              <span className="font-mono font-bold text-white">{data.trainNumber || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coach / Seat:</span>
              <span className="font-bold text-cyan-400">{data.coachSeat || 'Coach In transit'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Activation Time:</span>
              <span className="font-mono text-slate-300">{new Date(data.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Immediate Emergency Action Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <PhoneCall size={14} className="text-red-400" /> Immediate Contact Actions
          </h3>

          <div className="space-y-2">
            <a
              href="tel:112"
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow"
            >
              <PhoneCall size={15} /> Dial 112 (National Police Emergency)
            </a>

            <a
              href="tel:139"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-2"
            >
              <PhoneCall size={15} className="text-cyan-400" /> Dial 139 (Railway Police / RPF)
            </a>

            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-400 text-[11px] font-bold border border-slate-800 flex items-center justify-center gap-1.5"
            >
              Open in Google Maps / Navigation <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="text-[11px] text-slate-500 text-center">
        This is an encrypted live-location tracking token generated by RailSafe 2.0. Unrelated passenger data and other incident reports are strictly isolated and inaccessible.
      </div>
    </div>
  );
};
