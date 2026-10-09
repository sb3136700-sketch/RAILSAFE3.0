import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Share2, 
  Train, 
  Copy, 
  Check 
} from 'lucide-react';
import { PnrRecord } from '../types/railway';
import { DEMO_PNRS } from '../data/trainsData';

interface PnrCheckerProps {
  onTrackTrainByNumber: (trainNumber: string) => void;
}

export const PnrChecker: React.FC<PnrCheckerProps> = ({ onTrackTrainByNumber }) => {
  const [pnrInput, setPnrInput] = useState('8249102834');
  const [activeRecord, setActiveRecord] = useState<PnrRecord | null>(DEMO_PNRS[0]);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleLookup = (pnrToSearch?: string) => {
    const pnr = (pnrToSearch || pnrInput).trim();
    if (pnr.length !== 10 || !/^\d+$/.test(pnr)) {
      setErrorMessage('Please enter a valid 10-digit Indian Railways PNR number');
      return;
    }
    setErrorMessage('');

    // Check demo records or synthesize realistic dynamic record
    const found = DEMO_PNRS.find((r) => r.pnrNumber === pnr);
    if (found) {
      setActiveRecord(found);
    } else {
      // Dynamic simulated response for any valid 10-digit input
      const dynamicRecord: PnrRecord = {
        pnrNumber: pnr,
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        dateOfJourney: '27 Sep 2026',
        fromStation: 'New Delhi (NDLS)',
        fromCode: 'NDLS',
        toStation: 'Varanasi Junction (BSB)',
        toCode: 'BSB',
        boardingStation: 'NDLS',
        reservationClass: 'CC',
        chartStatus: 'Prepared',
        confirmationProbability: 95,
        passengers: [
          {
            passengerNumber: 1,
            bookingStatus: 'RAC 4',
            currentStatus: 'CNF C2/18',
            berthPreference: 'Window Seat',
            allocatedCoach: 'C2',
            allocatedBerth: '18',
            berthType: 'Window',
          },
        ],
      };
      setActiveRecord(dynamicRecord);
    }
  };

  const handleShare = () => {
    if (!activeRecord) return;
    const p = activeRecord.passengers[0];
    const text = `🎟️ PNR Status: ${activeRecord.pnrNumber}
Train: ${activeRecord.trainNumber} - ${activeRecord.trainName}
Date: ${activeRecord.dateOfJourney}
Route: ${activeRecord.fromStation} → ${activeRecord.toStation}
Status: ${p.currentStatus} (${activeRecord.chartStatus === 'Prepared' ? 'Chart Prepared' : 'Chart Not Prepared'})`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* PNR Search Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-3">
            <Ticket className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Check PNR Status & Confirmation Chance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Indian Railways passenger reservation status, coach & berth details
          </p>
        </div>

        {/* Input */}
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => {
                  setPnrInput(e.target.value.replace(/\D/g, ''));
                  setErrorMessage('');
                }}
                placeholder="Enter 10-digit PNR (e.g. 8249102834)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleLookup()}
              className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Check Status</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo PNRs */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500">Quick Test PNRs:</span>
            {DEMO_PNRS.map((demo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPnrInput(demo.pnrNumber);
                  handleLookup(demo.pnrNumber);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 font-mono text-[11px]"
              >
                {demo.pnrNumber} ({demo.trainName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PNR Result Details */}
      {activeRecord && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>PNR: <strong className="font-mono text-white text-sm">{activeRecord.pnrNumber}</strong></span>
                <span>·</span>
                <span>Class: <strong className="text-amber-400">{activeRecord.reservationClass}</strong></span>
                <span>·</span>
                <span className={`font-semibold ${activeRecord.chartStatus === 'Prepared' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {activeRecord.chartStatus === 'Prepared' ? '● Chart Prepared' : '○ Chart Not Prepared'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeRecord.trainNumber} - {activeRecord.trainName}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                {activeRecord.fromStation} → {activeRecord.toStation} · Date: {activeRecord.dateOfJourney}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Share Status'}</span>
              </button>

              <button
                onClick={() => onTrackTrainByNumber(activeRecord.trainNumber)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow transition-colors"
              >
                <Train className="h-3.5 w-3.5" />
                <span>Track Live</span>
              </button>
            </div>
          </div>

          {/* Confirmation Probability Indicator */}
          <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400">Historical Confirmation Chance</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {activeRecord.confirmationProbability >= 90
                  ? 'High Likelihood of Confirmation'
                  : activeRecord.confirmationProbability >= 70
                  ? 'Moderate Confirmation Chance'
                  : 'Low Chance (Waitlisted high traffic)'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    activeRecord.confirmationProbability >= 85 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${activeRecord.confirmationProbability}%` }}
                />
              </div>
              <span className="text-sm font-mono font-bold text-white">
                {activeRecord.confirmationProbability}%
              </span>
            </div>
          </div>

          {/* Passenger Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Passenger</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Coach / Berth</th>
                  <th className="py-3 px-4">Berth Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeRecord.passengers.map((p) => {
                  const isConfirmed = p.currentStatus.startsWith('CNF');
                  const isRac = p.currentStatus.startsWith('RAC');

                  return (
                    <tr key={p.passengerNumber} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                          <User className="h-3 w-3" />
                        </div>
                        <span>Passenger {p.passengerNumber}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {p.bookingStatus}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-semibold ${
                            isConfirmed
                              ? 'text-emerald-400'
                              : isRac
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {p.currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-white font-semibold">
                        {p.allocatedCoach && p.allocatedBerth
                          ? `${p.allocatedCoach} / ${p.allocatedBerth}`
                          : 'Will allocate at charting'}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {p.berthType || p.berthPreference || 'Not assigned'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
