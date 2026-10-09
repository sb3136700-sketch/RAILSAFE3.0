import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  Volume2, 
  X, 
  MapPin, 
  AlertTriangle, 
  Check, 
  Radio, 
  HeartHandshake
} from 'lucide-react';
import { TrainDetails, RouteStop, UserProfile } from '../types/railway';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: TrainDetails;
  currentStation: RouteStop;
  userProfile: UserProfile;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  currentStation,
  userProfile,
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Synthesize emergency buzzer / siren using Web Audio API
  const toggleSiren = () => {
    if (sirenPlaying) {
      setSirenPlaying(false);
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      setSirenPlaying(true);
      setTimeout(() => setSirenPlaying(false), 1400);
    } catch {
      setSirenPlaying(false);
    }
  };

  const emergencyMessage = `🚨 EMERGENCY HELP REQUEST:
Passenger: ${userProfile.fullName} (${userProfile.phone})
Train: ${currentTrain.trainNumber} - ${currentTrain.trainName}
Current Location: Near ${currentStation.stationName} (${currentStation.stationCode})
Approaching Platform: PF ${currentStation.platform}
Preferred Berth: ${userProfile.preferredBerth}
Emergency Contact: ${userProfile.emergencyContactName} (${userProfile.emergencyContactPhone})
Please send immediate assistance!`;

  const whatsappEmergencyUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    emergencyMessage
  )}`;

  const handleCopyLocation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emergencyMessage);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border-2 border-red-500 bg-slate-900 p-6 shadow-2xl neon-glow-red">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-slate-950 font-bold shadow-lg shadow-red-500/50 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-wide uppercase neon-text-red">
                Emergency SOS & Police Assistance
              </h3>
              <p className="text-xs text-red-300">Indian Railways RPF & 24/7 National Emergency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current train coordinates snapshot */}
        <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-300 flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-red-400 animate-ping" />
              <span>Live Railway Emergency Coordinates:</span>
            </span>
            <span className="font-mono font-bold text-white">{currentTrain.trainNumber}</span>
          </div>
          <div className="text-slate-200 mt-1 font-medium">
            Train: {currentTrain.trainName} · Near {currentStation.stationName} ({currentStation.stationCode})
          </div>
        </div>

        {/* Quick Emergency Call Dialers */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a
            href="tel:139"
            className="flex items-center justify-between p-3 rounded-xl bg-red-500 hover:bg-red-600 text-slate-950 font-bold transition-all shadow-md group"
          >
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">RailMadad Universal</div>
              <div className="text-lg font-mono font-black">139</div>
            </div>
            <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:182"
            className="flex items-center justify-between p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md group"
          >
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">RPF Security Helpline</div>
              <div className="text-lg font-mono font-black">182</div>
            </div>
            <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:112"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-white font-bold transition-colors group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">National Emergency</div>
              <div className="text-base font-mono font-black text-red-400">112</div>
            </div>
            <PhoneCall className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-white font-bold transition-colors group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">Women Safety</div>
              <div className="text-base font-mono font-black text-purple-400">1091</div>
            </div>
            <PhoneCall className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* Live Location Sharing Actions */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Send Live Distress Signal to Family & RPF:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappEmergencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
            >
              <Share2 className="h-4 w-4" />
              <span>Share on WhatsApp</span>
            </a>

            <button
              onClick={handleCopyLocation}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>{copiedLink ? 'Copied Details' : 'Copy Emergency Info'}</span>
            </button>
          </div>

          {/* Siren Alert button */}
          <button
            onClick={toggleSiren}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
              sirenPlaying
                ? 'border-red-400 bg-red-600 text-white animate-pulse'
                : 'border-red-500/50 bg-red-950/40 text-red-300 hover:bg-red-900/60'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            <span>{sirenPlaying ? 'Sounding Coach Alert Siren...' : 'Sound Coach Audio Alert Siren'}</span>
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
