import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SosEvent } from '../types';
import {
  ShieldAlert,
  AlertCircle,
  MapPin,
  Send,
  PhoneCall,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  Radio,
  Clock,
  Compass,
} from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLiveTracking?: (token: string) => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, onNavigateToLiveTracking }) => {
  const { user, supabaseUser } = useAuth();
  const [stage, setStage] = useState<'confirm' | 'countdown' | 'dispatching' | 'active'>('confirm');
  const [countdown, setCountdown] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('Personal Threat / Harassment');
  const [trainInfo, setTrainInfo] = useState<string>('12626 Kerala Express (Coach B3)');
  const [customNote, setCustomNote] = useState<string>('');
  
  // Location state
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'acquired' | 'denied' | 'timeout'>('pending');
  
  // Activated SOS event state
  const [activeSos, setActiveSos] = useState<SosEvent | null>(null);
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [smsResult, setSmsResult] = useState<any>(null);
  const [smsPrefilledText, setSmsPrefilledText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);

  // Request location immediately upon modal open
  useEffect(() => {
    if (isOpen) {
      setStage('confirm');
      setCountdown(5);
      requestGpsLocation();
    } else {
      stopLocationWatch();
    }
  }, [isOpen]);

  const requestGpsLocation = () => {
    setLocationStatus('pending');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocationStatus('acquired');
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err.message);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  };

  // 5-second countdown timer
  useEffect(() => {
    if (stage === 'countdown') {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            executeSosDispatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  const startCountdown = () => {
    setCountdown(5);
    setStage('countdown');
  };

  const cancelCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('confirm');
  };

  const executeSosDispatch = async () => {
    setStage('dispatching');
    try {
      const response = await api.activateSos({
        userId: user.id,
        passengerName: user.name,
        passengerPhone: user.phone || '+919876543210',
        category: selectedCategory,
        message: customNote || 'Urgent assistance required onboard train.',
        latitude: coords?.lat,
        longitude: coords?.lng,
        accuracy: coords?.accuracy,
        trainNumber: trainInfo.split(' ')[0] || '12626',
        coachSeat: trainInfo,
      });

      setActiveSos(response.sosEvent);
      setLiveUrl(response.liveTrackingUrl);
      setSmsResult(response.smsResult);
      setSmsPrefilledText(response.smsPrefilledText);
      setStage('active');

      // Persist to Supabase if real user session is present
      if (isSupabaseConfigured && supabaseUser) {
        try {
          await supabase.from('sos_events').insert({
            reference_id: response.sosEvent.referenceId,
            user_id: supabaseUser.id,
            passenger_name: user.name,
            passenger_phone: user.phone || null,
            category: selectedCategory,
            message: customNote || 'Urgent assistance required onboard train.',
            status: 'active',
            initial_lat: coords?.lat || null,
            initial_lng: coords?.lng || null,
            current_lat: coords?.lat || null,
            current_lng: coords?.lng || null,
            location_accuracy: coords?.accuracy || null,
            location_updated_at: new Date().toISOString(),
            train_number: trainInfo.split(' ')[0] || '12626',
            coach_seat: trainInfo,
            share_token: response.sosEvent.shareToken,
            share_expires_at: response.sosEvent.shareExpiresAt,
            sms_delivery_status: response.smsResult?.status || 'manual_fallback',
            sms_recipients_count: response.sosEvent.smsRecipientsCount || 0,
            provider_message_id: response.smsResult?.providerMessageId || null,
          });
        } catch (dbErr) {
          console.warn('[SUPABASE SOS SYNC NOTICE]', dbErr);
        }
      }

      // Start continuous watchPosition
      startLocationWatch(response.sosEvent.id, response.sosEvent.shareToken);
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
      alert('Network error while dispatching SOS. Please dial 112 or 139 directly.');
      setStage('confirm');
    }
  };

  const startLocationWatch = (sosId: string, shareToken?: string) => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          api.updateSosLocation(sosId, pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          if (isSupabaseConfigured && supabaseUser && shareToken) {
            supabase
              .from('sos_events')
              .update({
                current_lat: pos.coords.latitude,
                current_lng: pos.coords.longitude,
                location_accuracy: pos.coords.accuracy,
                location_updated_at: new Date().toISOString(),
              })
              .eq('share_token', shareToken)
              .then(
                () => {},
                (err: any) => console.warn('[SUPABASE LOCATION UPDATE NOTICE]', err)
              );
          }
        },
        (err) => console.warn('Continuous GPS watch error:', err),
        { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 }
      );
    }
  };

  const stopLocationWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleResolveSos = async () => {
    if (!activeSos) return;
    setIsResolving(true);
    try {
      await api.resolveSos(activeSos.id);
      if (isSupabaseConfigured && supabaseUser) {
        try {
          await supabase
            .from('sos_events')
            .update({
              status: 'resolved',
              resolved_at: new Date().toISOString(),
            })
            .eq('share_token', activeSos.shareToken);
        } catch (dbErr) {
          console.warn('[SUPABASE RESOLVE NOTICE]', dbErr);
        }
      }
      stopLocationWatch();
      alert('Emergency SOS has been resolved and live location broadcasting stopped.');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  const copyLiveTrackingLink = () => {
    if (liveUrl) {
      navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-red-500/50 rounded-2xl shadow-2xl shadow-red-950/50 p-5 sm:p-6 text-slate-100 overflow-hidden my-8">
        {/* Urgent header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">RAILSAFE EMERGENCY SOS</h2>
              <p className="text-xs text-slate-400 font-mono">AUTOMATED SMS & LIVE LOCATION DISPATCH</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* STAGE 1: Confirm details */}
        {stage === 'confirm' && (
          <div className="mt-4 space-y-4">
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Critical Passenger Safety Action:</span> Activating SOS triggers an immediate emergency broadcast. Your registered emergency contacts will receive an SMS with your verified coordinates and an encrypted live location tracker.
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Emergency Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Personal Threat / Harassment',
                  'Severe Medical Distress',
                  'Theft / Physical Assault',
                  'Accident / Fire / Derailment',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-red-950/60 border-red-500 text-white font-bold'
                        : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Train & Berth context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Current Train & Coach</label>
                <input
                  type="text"
                  value={trainInfo}
                  onChange={(e) => setTrainInfo(e.target.value)}
                  placeholder="e.g. 12626 Coach B3 Berth 42"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">GPS Telemetry Status</label>
                <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs flex items-center justify-between">
                  {locationStatus === 'acquired' && coords ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <MapPin size={12} /> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  ) : locationStatus === 'pending' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Radio size={12} className="animate-spin" /> Acquiring GPS...
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">Coordinates Unavailable</span>
                  )}
                  <button
                    onClick={requestGpsLocation}
                    className="text-[10px] text-cyan-400 underline hover:text-cyan-300 cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Short Emergency Note (Optional)</label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Two men arguing aggressively near door"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={startCountdown}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-950/50 cursor-pointer"
              >
                <ShieldAlert size={18} />
                ACTIVATE SOS (SEND ALERTS)
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: 5-Second Cancellation Window */}
        {stage === 'countdown' && (
          <div className="mt-6 text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 text-red-400 text-4xl font-black animate-pulse">
              {countdown}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Activating Emergency SOS...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Accidental Activation Safeguard: Sending SMS to your emergency contacts in {countdown} seconds unless canceled.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={cancelCountdown}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
              >
                CANCEL ACTIVATION
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Dispatching */}
        {stage === 'dispatching' && (
          <div className="mt-8 text-center py-8 space-y-3">
            <Radio size={40} className="text-red-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Contacting Server & Dispatching SMS...</h3>
            <p className="text-xs text-slate-400 font-mono">Acquiring high-accuracy GPS & creating encrypted live tracker</p>
          </div>
        )}

        {/* STAGE 4: Active SOS Live Session */}
        {stage === 'active' && activeSos && (
          <div className="mt-4 space-y-4">
            {/* Success Notification Banner */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <div>
                  <span className="font-bold">SOS ACTIVE:</span> Ref #{activeSos.referenceId}
                </div>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-mono animate-pulse">
                STREAMING LIVE GPS
              </span>
            </div>

            {/* SMS Delivery Result Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Emergency Alert Dispatch Mode
                </span>
                {smsResult?.status === 'manual_fallback' ? (
                  <span className="text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded text-[10px]">
                    MANUAL SMS FALLBACK
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px]">
                    {smsResult?.status?.toUpperCase() || 'DELIVERED'}
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {smsResult?.notes ||
                  (smsResult?.status === 'manual_fallback'
                    ? 'Automatic SMS gateway is disabled (no external SMS gateway configured). SOS session and live GPS tracking are active. Use the button below to send the emergency SMS via your phone.'
                    : 'Emergency SMS message successfully dispatched to your registered contacts.')}
              </p>

              {smsResult?.providerMessageId && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Gateway Provider Ref: {smsResult.providerMessageId}
                </div>
              )}
            </div>

            {/* Live Location Tracking Link */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Public Live Location Link (For Family & Contacts)
                </span>
                <span className="text-cyan-400 font-mono text-[10px]">Encrypted Token</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
                />
                <button
                  onClick={copyLiveTrackingLink}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={12} /> {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
              {onNavigateToLiveTracking && (
                <button
                  onClick={() => {
                    onNavigateToLiveTracking(activeSos.shareToken);
                    onClose();
                  }}
                  className="w-full text-center text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline flex items-center justify-center gap-1 cursor-pointer pt-1"
                >
                  Preview Public Live Location Page <ExternalLink size={12} />
                </button>
              )}
            </div>

            {/* Clearly Labelled Manual SMS Fallback Action */}
            {smsPrefilledText && (
              <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Send size={13} /> Native Device SMS Fallback
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">READY TO SEND</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Direct carrier dispatch from your smartphone with pre-filled live coordinates, train details, and tracking link.
                </p>
                <a
                  href={`sms:?body=${encodeURIComponent(smsPrefilledText)}`}
                  className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer transition-colors"
                >
                  <Send size={14} /> Open Phone SMS App (Send Pre-Filled Alert)
                </a>
              </div>
            )}

            {/* Direct Official Railway Helplines */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <a
                href="tel:139"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} className="text-cyan-400" />
                Dial 139 (Railway Help)
              </a>
              <a
                href="tel:112"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} className="text-red-400" />
                Dial 112 (Police / Emergency)
              </a>
            </div>

            {/* Resolve & Stop Sharing */}
            <div className="pt-2">
              <button
                onClick={handleResolveSos}
                disabled={isResolving}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition-colors"
              >
                {isResolving ? 'Resolving Emergency...' : 'Stop Sharing & Mark SOS Resolved'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
