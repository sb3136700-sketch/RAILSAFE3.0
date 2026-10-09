import React, { useState } from 'react';
import { 
  Ticket, 
  Download, 
  ExternalLink, 
  Printer, 
  X, 
  Check, 
  QrCode, 
  Train, 
  Calendar, 
  User 
} from 'lucide-react';
import { TrainDetails, UserProfile } from '../types/railway';

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: TrainDetails;
  userProfile: UserProfile;
  onNavigateToPnr?: () => void;
}

export const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  userProfile,
  onNavigateToPnr,
}) => {
  const [passengerName, setPassengerName] = useState(userProfile.fullName);
  const [selectedClass, setSelectedClass] = useState(currentTrain.classes[0] || 'CC');
  const [pnrNumber, setPnrNumber] = useState('8249102834');
  const [coachBerth, setCoachBerth] = useState('C3 / 42 (Window)');

  if (!isOpen) return null;

  const fare = currentTrain.fares[selectedClass] || 1250;

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-cyan-500/50 bg-slate-900 p-6 shadow-2xl neon-glow-cyan my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ticket Booking & Download E-Ticket
              </h3>
              <p className="text-xs text-slate-400">IRCTC Next Generation Official e-Ticketing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Official IRCTC Quick Launch Links */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://www.irctc.co.in/nget/train-search"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-slate-950 hover:bg-slate-800 transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-400">
                Official IRCTC Portal
              </div>
              <div className="text-[11px] text-slate-400">Book Reserved Tickets</div>
            </div>
            <ExternalLink className="h-4 w-4 text-cyan-400" />
          </a>

          <a
            href="https://www.utsonmobile.indianrailways.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-400">
                UTS On Mobile (Unreserved)
              </div>
              <div className="text-[11px] text-slate-400">General & Platform Tickets</div>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-cyan-400" />
          </a>
        </div>

        {/* Digital E-Ticket Preview Container */}
        <div className="mt-5 p-5 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                IR
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide">
                  INDIAN RAILWAYS ELECTRONIC RESERVATION SLIP (ERS)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  PNR: {pnrNumber} · Quota: General (GN)
                </div>
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 border border-slate-800 text-slate-300">
              <QrCode className="h-6 w-6" />
            </div>
          </div>

          {/* Ticket Body */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Train No & Name</span>
              <strong className="text-white font-mono">{currentTrain.trainNumber}</strong>
              <div className="text-[11px] text-slate-400 truncate">{currentTrain.trainName}</div>
            </div>

            <div className="p-2 rounded bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Class</span>
              <strong className="text-amber-400 font-bold">{selectedClass}</strong>
              <div className="text-[11px] text-slate-400">Total: ₹{fare}</div>
            </div>

            <div className="p-2 rounded bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Boarding</span>
              <strong className="text-white">{currentTrain.sourceCode}</strong>
              <div className="text-[11px] text-slate-400">{currentTrain.sourceDeparture}</div>
            </div>

            <div className="p-2 rounded bg-slate-900">
              <span className="text-[10px] text-slate-500 block">Destination</span>
              <strong className="text-white">{currentTrain.destCode}</strong>
              <div className="text-[11px] text-slate-400">{currentTrain.destArrival}</div>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Passenger:</span>
              <div className="font-bold text-white">{passengerName}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Coach / Seat:</span>
              <div className="font-mono font-bold text-emerald-400">{coachBerth}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Status:</span>
              <div className="font-semibold text-emerald-400">CONFIRMED (CNF)</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {onNavigateToPnr && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToPnr();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/40 bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-semibold transition-colors"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Check Live PNR Status</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Valid with Govt Photo ID
            </span>
          </div>

          <button
            onClick={handlePrintDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save Ticket PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
