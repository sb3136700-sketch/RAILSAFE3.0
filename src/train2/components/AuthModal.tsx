import React, { useState } from 'react';
import { 
  User, 
  X, 
  Check, 
  History, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Train, 
  Lock 
} from 'lucide-react';
import { UserProfile } from '../types/railway';
import { saveUserProfile, DEFAULT_USER } from '../utils/userStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onTrackSavedJourney: (trainNumber: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onTrackSavedJourney,
}) => {
  const [tab, setTab] = useState<'profile' | 'create' | 'history'>('profile');

  // Edit / Create Form states
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [emergencyName, setEmergencyName] = useState(userProfile.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(userProfile.emergencyContactPhone);
  const [preferredBerth, setPreferredBerth] = useState(userProfile.preferredBerth);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      fullName,
      email,
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      preferredBerth: preferredBerth as UserProfile['preferredBerth'],
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      phone,
      preferredLanguage: 'en',
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      preferredBerth: preferredBerth as UserProfile['preferredBerth'],
      savedJourneys: [],
      historySearch: [],
    };
    saveUserProfile(newProfile);
    onUpdateProfile(newProfile);
    setTab('profile');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl neon-glow-amber my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Passenger Account & Database</h3>
              <p className="text-xs text-slate-400">Manage profile, emergency contacts & journey history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <div className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setTab('profile')}
            className={`py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'profile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setTab('create')}
            className={`py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'create' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setTab('history')}
            className={`py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'history' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trip History ({userProfile.savedJourneys.length})
          </button>
        </div>

        {/* Content Tabs */}
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
              <div className="font-semibold text-red-300">Emergency SOS Contact (For Alert Link)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-0.5">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Emergency Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Preferred Berth Choice</label>
              <select
                value={preferredBerth}
                onChange={(e) => setPreferredBerth(e.target.value as UserProfile['preferredBerth'])}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Lower">Lower Berth (Easy movement, senior friendly)</option>
                <option value="Side Lower">Side Lower (Window view, private)</option>
                <option value="Upper">Upper Berth (Undisturbed sleep)</option>
                <option value="Side Upper">Side Upper (Single bunk)</option>
                <option value="Middle">Middle Berth</option>
                <option value="Window">Window Seat (Chair Car)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {tab === 'create' && (
          <form onSubmit={handleCreateAccount} className="mt-4 space-y-3 text-xs">
            <p className="text-slate-400">
              Create a new personalized passenger profile stored locally on your device:
            </p>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">New User Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
              >
                Create Account Now
              </button>
            </div>
          </form>
        )}

        {tab === 'history' && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-slate-400">
              Your saved trips and ticket records from this browser:
            </div>

            {userProfile.savedJourneys.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl">
                No past journeys recorded yet. Track a train to save it automatically!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {userProfile.savedJourneys.map((j) => (
                  <div
                    key={j.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-amber-400">{j.trainNumber}</span>
                        <span className="text-white font-semibold">{j.trainName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {j.fromStation} → {j.toStation} · Date: {j.date}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onTrackSavedJourney(j.trainNumber);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold transition-colors"
                    >
                      Track Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
