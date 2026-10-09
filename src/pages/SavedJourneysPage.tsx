import React, { useState } from 'react';
import { SavedJourney } from '../types';
import {
  Train,
  PlusCircle,
  Download,
  Calendar,
  MapPin,
  ArrowRight,
  Printer,
  FileText,
  AlertCircle,
} from 'lucide-react';

const SEEDED_JOURNEYS: SavedJourney[] = [
  {
    id: 'j-1',
    userId: 'usr-passenger-1',
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Bhopal Junction (BPL)',
    journeyDate: '2026-10-10',
    pnr: '245-8910234',
    coach: 'B3',
    seat: 'Berth 42 (MB)',
    status: 'Upcoming',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'j-2',
    userId: 'usr-passenger-1',
    trainNumber: '12951',
    trainName: 'Mumbai Central Rajdhani',
    fromStation: 'Mumbai Central (MMCT)',
    toStation: 'Kota Junction (KOTA)',
    journeyDate: '2026-10-24',
    pnr: '812-4412980',
    coach: 'H1',
    seat: 'Berth 12 (LB)',
    status: 'Confirmed',
    createdAt: '2026-10-05T12:00:00Z',
  },
];

export const SavedJourneysPage: React.FC = () => {
  const [journeys, setJourneys] = useState<SavedJourney[]>(SEEDED_JOURNEYS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New journey form fields
  const [trainNumber, setTrainNumber] = useState('20607');
  const [trainName, setTrainName] = useState('Vande Bharat Express');
  const [fromStation, setFromStation] = useState('MGR Chennai Central (MAS)');
  const [toStation, setToStation] = useState('KSR Bengaluru (SBC)');
  const [journeyDate, setJourneyDate] = useState('2026-10-15');
  const [pnr, setPnr] = useState('412-9901824');
  const [coach, setCoach] = useState('C1');
  const [seat, setSeat] = useState('Seat 24 (Window)');

  const handleAddJourney = (e: React.FormEvent) => {
    e.preventDefault();
    const newJ: SavedJourney = {
      id: `j-${Date.now()}`,
      userId: 'usr-passenger-1',
      trainNumber,
      trainName,
      fromStation,
      toStation,
      journeyDate,
      pnr,
      coach,
      seat,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
    };
    setJourneys((prev) => [newJ, ...prev]);
    setIsFormOpen(false);
    alert('Journey saved to your profile.');
  };

  const handlePrintItinerary = (j: SavedJourney) => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-wide">SAVED JOURNEYS & ITINERARIES</h1>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              TRAVEL COMPANION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store your train reservations, seat numbers, and export printable travel safety summaries.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle size={15} />
          {isFormOpen ? 'Cancel' : 'Add New Journey'}
        </button>
      </div>

      {/* Disclaimers banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2">
        <AlertCircle size={15} className="text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Passenger Advisory:</strong> Saved journeys stored here are for safety tracking, SOS referencing, and personal itinerary planning. This does not replace your official Indian Railways / IRCTC electronic reservation slip (ERS).
        </span>
      </div>

      {/* Add Journey Form */}
      {isFormOpen && (
        <form onSubmit={handleAddJourney} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800">
            Enter Journey Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Train Number</label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Train Name</label>
              <input
                type="text"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Departure Station</label>
              <input
                type="text"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Destination Station</label>
              <input
                type="text"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Journey Date</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">PNR Number</label>
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Coach</label>
              <input
                type="text"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Seat / Berth</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Save Journey Itinerary
          </button>
        </form>
      )}

      {/* Journeys List */}
      <div className="space-y-4">
        {journeys.map((j) => (
          <div
            key={j.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <Train size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-cyan-400 font-mono">{j.trainNumber}</span>
                    <h3 className="text-sm font-bold text-white">{j.trainName}</h3>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                    <span>PNR: {j.pnr || 'Not set'}</span>
                    <span>• Status: {j.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePrintItinerary(j)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Printer size={13} /> Print / Export Itinerary
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Route Stations</span>
                <div className="text-white font-medium mt-1 flex items-center gap-1.5">
                  <span className="truncate">{j.fromStation}</span>
                  <ArrowRight size={12} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{j.toStation}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Date of Travel</span>
                <div className="text-cyan-300 font-mono font-bold mt-1">{j.journeyDate}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Coach & Seat</span>
                <div className="text-white font-bold mt-1 font-mono">
                  {j.coach} • {j.seat}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
