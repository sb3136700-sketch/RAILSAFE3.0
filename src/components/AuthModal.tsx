import React, { useState } from 'react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  Radio,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    isSupabaseConfigured,
    switchRole,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.success) {
          closeAuthModal();
        } else {
          setErrorMessage(res.error || 'Failed to sign in.');
        }
      } else {
        const res = await signUpWithEmail(email, password, name, phone);
        if (res.success) {
          setSuccessMessage(
            res.message || 'Account successfully created! You are now logged in.'
          );
          if (!res.message?.includes('check your email')) {
            setTimeout(() => {
              closeAuthModal();
            }, 1200);
          }
        } else {
          setErrorMessage(res.error || 'Failed to register account.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'passenger' | 'operator' | 'responder') => {
    switchRole(role);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden my-6">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-wide">
                {mode === 'signin' ? 'PASSENGER & STAFF LOGIN' : 'CREATE RAILSAFE ACCOUNT'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">SUPABASE SECURE AUTHENTICATION</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Supabase Status Indicator */}
        <div className="mt-3.5 mb-2">
          {isSupabaseConfigured ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={14} className="text-emerald-400" /> Supabase Auth Connected
              </span>
              <span className="text-[10px] font-mono text-emerald-400">PostgreSQL Active</span>
            </div>
          ) : (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <strong className="block font-semibold">Local Dev Notice:</strong>
                Supabase credentials not yet provided in <code className="text-amber-200 font-mono">.env.local</code>. Running in simulated session mode.
              </div>
            </div>
          )}
        </div>

        {/* Tab switchers: Sign In vs Sign Up */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 my-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success feedback alerts */}
        {errorMessage && (
          <div className="mb-4 bg-rose-950/40 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-500" size={15} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sameer Khan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={15} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="passenger@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={15} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Mobile Number (for Emergency SOS SMS)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-500" size={15} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Radio size={14} className="animate-spin" /> Authenticating with Supabase...
                </>
              ) : mode === 'signin' ? (
                'Sign In to RailSafe'
              ) : (
                'Register Passenger Account'
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Personas Testing Box */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Instant Role Testing (RBAC)</span>
            <span className="font-mono text-cyan-400">1-CLICK</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickDemoLogin('passenger')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left cursor-pointer"
            >
              <div className="font-bold text-slate-200">Sameer</div>
              <div className="text-[9px] text-cyan-400 uppercase font-mono">Passenger</div>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('operator')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left cursor-pointer"
            >
              <div className="font-bold text-amber-300">Aditi Nair</div>
              <div className="text-[9px] text-amber-400 uppercase font-mono">Operator</div>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('responder')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left cursor-pointer"
            >
              <div className="font-bold text-emerald-300">SI Vikram</div>
              <div className="text-[9px] text-emerald-400 uppercase font-mono">RPF Officer</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
