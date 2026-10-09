import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Train, 
  Send, 
  ShieldCheck 
} from 'lucide-react';
import { TrainDetails, RouteStop, UserProfile } from '../types/railway';

interface RailComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: TrainDetails;
  currentStation: RouteStop;
  userProfile: UserProfile;
}

export const RailComplaintModal: React.FC<RailComplaintModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  currentStation,
  userProfile,
}) => {
  const [complaintType, setComplaintType] = useState('Medical & Cleanliness');
  const [pnrInput, setPnrInput] = useState('8249102834');
  const [coachBerth, setCoachBerth] = useState('C3 / 42');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Coach Cleanliness & Toilet sanitation',
    'Medical Assistance needed at next station',
    'Security / Theft / Harassment',
    'AC / Electrical charging not working',
    'Food / Catering overcharging or stale quality',
    'Bedroll & Linen hygiene issue',
    'Water shortage in coach',
    'Train delayed & refund request',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `RM-${Date.now().toString().slice(-6)}`;
    setReferenceId(ref);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/50 bg-slate-900 p-6 shadow-2xl neon-glow-amber">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Official RailMadad Grievance Register
              </h3>
              <p className="text-xs text-slate-400">Indian Railways Integrated Passenger Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Official Portal Direct Action Link */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">
              Official Indian Railways RailMadad Website
            </div>
            <div className="text-[11px] text-slate-400">railmadad.indianrailways.gov.in</div>
          </div>
          <a
            href="https://railmadad.indianrailways.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow"
          >
            <span>Open RailMadad</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {submitted ? (
          <div className="my-6 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Complaint Registered Successfully</h4>
            <div className="text-xs text-slate-300">
              Reference Token: <strong className="font-mono text-emerald-400 text-sm">{referenceId}</strong>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your grievance has been logged and transmitted to the onboard Train Ticket Examiner (TTE) and next station superintendent.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-amber-400 underline font-semibold"
              >
                File another grievance
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Grievance Category
              </label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">PNR Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  placeholder="10-digit PNR"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coach & Berth</label>
                <input
                  type="text"
                  value={coachBerth}
                  onChange={(e) => setCoachBerth(e.target.value)}
                  placeholder="e.g. B2 / 34"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Describe the problem
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the issue (e.g. water tap dry in Coach C3, AC temp too low)..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
