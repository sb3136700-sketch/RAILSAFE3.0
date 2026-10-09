import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { IncidentCategory, IncidentSeverity, SafetyIncident } from '../types';
import {
  AlertTriangle,
  Send,
  MapPin,
  Train,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Upload,
} from 'lucide-react';

interface IncidentReportPageProps {
  onNavigateToStatus: (referenceId?: string) => void;
}

export const IncidentReportPage: React.FC<IncidentReportPageProps> = ({ onNavigateToStatus }) => {
  const { user } = useAuth();

  const [category, setCategory] = useState<IncidentCategory>('harassment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainNumber, setTrainNumber] = useState('12626');
  const [trainName, setTrainName] = useState('Kerala Superfast Express');
  const [coach, setCoach] = useState('B3');
  const [seat, setSeat] = useState('Berth 42');
  const [station, setStation] = useState('Bhopal Junction (BPL)');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [contactPreference, setContactPreference] = useState<'call' | 'sms' | 'in_app'>('call');
  const [reporterPhone, setReporterPhone] = useState(user.phone || '+919876543210');
  
  // Geolocation
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<SafetyIncident | null>(null);

  const captureLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation not supported on this browser.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        console.warn(err);
        setIsLocating(false);
        alert('Could not acquire GPS position. You can still submit with coach & train details.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and incident description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.submitIncident(
        {
          userId: user.id,
          reporterName: user.name,
          reporterPhone,
          category,
          title,
          description,
          trainNumber,
          trainName,
          coach,
          seat,
          station,
          latitude: coords?.lat,
          longitude: coords?.lng,
          severity,
          contactPreference,
        },
        user.role,
        user.id,
        user.name
      );

      setSubmittedIncident(result);
    } catch (err: any) {
      console.error(err);
      alert('Failed to submit incident report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill samples for hackathon demonstration
  const handleQuickFill = (type: 'harassment' | 'medical' | 'theft') => {
    if (type === 'harassment') {
      setCategory('harassment');
      setTitle('Intimidation and harassment in Coach B3');
      setDescription('Two unauthorized passengers without tickets are verbally harassing solo women passengers near berth 45.');
      setTrainNumber('12626');
      setTrainName('Kerala Express');
      setCoach('B3');
      setSeat('Berth 45');
      setSeverity('high');
    } else if (type === 'medical') {
      setCategory('medical');
      setTitle('Passenger severe chest pain & breathing difficulty');
      setDescription('Elderly passenger in Berth 12 experiencing acute chest pain, requiring urgent doctor attention at next stop.');
      setTrainNumber('12951');
      setTrainName('Mumbai Rajdhani');
      setCoach('H1');
      setSeat('Berth 12');
      setSeverity('critical');
    } else {
      setCategory('theft');
      setTitle('Stolen laptop backpack from upper luggage rack');
      setDescription('Brown laptop bag taken while train was stopped at Agra station platform.');
      setTrainNumber('12002');
      setTrainName('Bhopal Shatabdi');
      setCoach('C2');
      setSeat('Seat 28');
      setSeverity('medium');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-wide">SUBMIT PASSENGER SAFETY INCIDENT</h1>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            CONFIDENTIAL & SECURE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Reports are encrypted, reviewed with Gemini AI risk assessment, and dispatched to the on-duty Railway Protection Force (RPF) or medical team.
        </p>
      </div>

      {/* Submission Success Screen */}
      {submittedIncident ? (
        <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={32} />
            <div>
              <h2 className="text-xl font-black text-white">Incident Submitted Successfully</h2>
              <p className="text-xs text-emerald-400/90 font-mono">
                Tracking Reference: {submittedIncident.referenceId}
              </p>
            </div>
          </div>

          {/* AI classification summary card */}
          {submittedIncident.aiClassification && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> Gemini 3.8 Automated Assessment
                </span>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                  CONFIDENCE: {Math.round((submittedIncident.aiClassification.confidence || 0.95) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Severity Rating</span>
                  <div className="font-bold text-white uppercase mt-0.5">{submittedIncident.aiClassification.severity}</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Urgency Score</span>
                  <div className="font-bold text-cyan-400 mt-0.5 font-mono">{submittedIncident.aiClassification.urgencyScore} / 10</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Routed Department</span>
                  <div className="font-bold text-amber-300 truncate mt-0.5">{submittedIncident.aiClassification.suggestedDepartment}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                <strong className="text-slate-200">Recommended Action:</strong> {submittedIncident.aiClassification.recommendedAction}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigateToStatus(submittedIncident.referenceId)}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <FileText size={16} /> Track Incident Status Live
            </button>
            <button
              onClick={() => setSubmittedIncident(null)}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Submission Form */
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
          {/* Hackathon Quick Fill Demo Pills */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-400" />
              Demo Fast-Fill Scenarios:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('harassment')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 text-[10px] cursor-pointer"
              >
                Harassment in B3
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('medical')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-rose-300 border border-slate-700 text-[10px] cursor-pointer"
              >
                Cardiac Medical
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('theft')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-[10px] cursor-pointer"
              >
                Luggage Theft
              </button>
            </div>
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Incident Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="harassment">Harassment / Stalking / Misbehavior</option>
                <option value="medical">Severe Medical Emergency</option>
                <option value="theft">Theft / Pickpocketing / Stolen Baggage</option>
                <option value="suspicious_activity">Suspicious Unattended Object / Activity</option>
                <option value="overcrowding">Unsafe Overcrowding in Reserved Coach</option>
                <option value="facility_damage">Broken Door / AC Failure / Hazard</option>
                <option value="accessibility">Wheelchair / Elderly Assistance Needed</option>
                <option value="other">Other Passenger Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Severity Assessment
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="low">Low — General enquiry / minor facility issue</option>
                <option value="medium">Medium — Action required at next station</option>
                <option value="high">High — Urgent threat / immediate coach intervention</option>
                <option value="critical">Critical — Life-threatening / ambulance required</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Incident Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Verbal harassment by unauthorized passenger near berth 45"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details including physical appearance, berth location, timeline, and whether immediate onboard staff intervention is requested..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Train, Coach, Seat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Train Number</label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="12626"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Coach Number</label>
              <input
                type="text"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                placeholder="B3"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Berth / Seat</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                placeholder="Berth 42"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Station / Halt</label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="Bhopal Junction"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* GPS Coordinates attach */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-cyan-400" />
              <div>
                <span className="font-bold text-slate-200">Device GPS Coordinates</span>
                <div className="text-[11px] text-slate-400">
                  {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (Attached)` : 'Not attached yet'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              {isLocating ? 'Acquiring...' : coords ? 'Re-acquire GPS' : 'Attach GPS Location'}
            </button>
          </div>

          {/* Contact Preference & Privacy Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Callback Phone Number</label>
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Contact Preference</label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="call">Phone Call from RPF Controller</option>
                <option value="sms">SMS Text Alert Only (Silent)</option>
                <option value="in_app">In-App Live Status Only</option>
              </select>
            </div>
          </div>

          {/* Cybersecurity & Confidentiality Guarantee */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
            <Lock size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Cybersecurity Isolation Guarantee:</strong> Your report is protected by Supabase Row-Level Security (RLS). Fellow passengers cannot access your identity, contact details, or reports.
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-cyan-500/20 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Radio size={16} className="animate-spin" />
                  ANALYZING WITH GEMINI AI & RECORDING TO DATABASE...
                </>
              ) : (
                <>
                  <Send size={16} />
                  SUBMIT CONFIDENTIAL SAFETY REPORT
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
