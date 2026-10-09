import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Train, 
  Calendar, 
  User, 
  Share2, 
  Copy, 
  Check 
} from 'lucide-react';
import { checkPnrStatus, OFFICIAL_RAILWAY_PNR_URL, PnrServiceResponse } from '../services/pnrService';

interface PnrStatusPageProps {
  onTrackTrain: (trainNumber: string) => void;
  onNavigateToDashboard: () => void;
}

export const PnrStatusPage: React.FC<PnrStatusPageProps> = ({
  onTrackTrain,
  onNavigateToDashboard,
}) => {
  const [pnrInput, setPnrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PnrServiceResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = async (e?: React.FormEvent, customPnr?: string) => {
    if (e) e.preventDefault();
    const query = customPnr || pnrInput;
    if (!query.trim()) return;

    setLoading(true);
    const resp = await checkPnrStatus(query, true);
    setResult(resp);
    setLoading(false);
  };

  const handleShare = () => {
    if (!result?.record) return;
    const r = result.record;
    const text = `🎫 PNR Status (${r.pnrNumber}):
Train: ${r.trainNumber} ${r.trainName}
Date: ${r.dateOfJourney}
From: ${r.fromStation} → ${r.toStation}
Status: ${r.passengers[0]?.currentStatus || 'Waiting'}
Chart: ${r.chartStatus}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl neon-glow-amber">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Ticket className="h-4 w-4" />
              <span>Indian Railways Passenger Name Record</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Official PNR Status Checker
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Check live passenger reservation status, confirmation, coach & berth assignment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToDashboard}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Dashboard
            </button>
            <a
              href={OFFICIAL_RAILWAY_PNR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
            >
              <span>Official IRCTC PNR</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* PNR Search Input Form */}
        <form onSubmit={(e) => handleCheck(e)} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={10}
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit PNR Number..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none tracking-widest shadow-inner"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || pnrInput.length !== 10}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md disabled:opacity-40 shrink-0"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Checking...' : 'Check PNR'}</span>
          </button>
        </form>

        {/* Demo PNR Quick Test Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Quick Test PNRs (Demo Data):</span>
          {['8249102834', '4198273615', '6291048291'].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => {
                setPnrInput(demo);
                handleCheck(undefined, demo);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition-colors border border-slate-700/60"
            >
              {demo}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card or Graceful Fallback */}
      {result && (
        <div className="space-y-4">
          {result.success && result.record ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl neon-glow-cyan">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>PNR: <strong className="font-mono text-white text-sm">{result.record.pnrNumber}</strong></span>
                    <span>·</span>
                    <span>Class: <strong className="text-amber-400">{result.record.reservationClass}</strong></span>
                    <span>·</span>
                    <span className={`font-semibold ${result.record.chartStatus === 'Prepared' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {result.record.chartStatus === 'Prepared' ? '● Chart Prepared' : '○ Chart Not Prepared'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {result.record.trainNumber} - {result.record.trainName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {result.record.fromStation} → {result.record.toStation} · Date: {result.record.dateOfJourney}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>

                  <button
                    onClick={() => onTrackTrain(result.record!.trainNumber)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow transition-colors"
                  >
                    <Train className="h-3.5 w-3.5" />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>

              {!result.isLiveApi && (
                <div className="my-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Displaying Demo PNR Data (Live PNR API not configured in environment).</span>
                  </div>
                  <a
                    href={OFFICIAL_RAILWAY_PNR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white font-semibold text-[11px]"
                  >
                    Open Official IRCTC PNR Portal →
                  </a>
                </div>
              )}

              {/* Passengers Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Passenger</th>
                      <th className="py-3 px-4">Booking Status</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4">Coach</th>
                      <th className="py-3 px-4">Berth / Seat</th>
                      <th className="py-3 px-4">Berth Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.record.passengers.map((p) => (
                      <tr key={p.passengerNumber} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>Passenger {p.passengerNumber}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{p.bookingStatus}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">{p.currentStatus}</td>
                        <td className="py-3 px-4 font-mono text-white font-semibold">{p.allocatedCoach || 'Will Chart'}</td>
                        <td className="py-3 px-4 font-mono text-amber-400 font-bold">{p.allocatedBerth || '—'}</td>
                        <td className="py-3 px-4 text-slate-300">{p.berthType || p.berthPreference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">PNR Service is Currently Unavailable</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {result.message || 'No authorized railway PNR API is currently configured for live queries.'}
              </p>
              <div className="pt-2">
                <a
                  href={OFFICIAL_RAILWAY_PNR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
                >
                  <span>Query on Official Railway PNR Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
