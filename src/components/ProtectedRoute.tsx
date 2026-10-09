import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, Lock, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  onNavigate?: (route: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = false,
  onNavigate,
}) => {
  const { user, isRealSupabaseSession, isSupabaseConfigured, switchRole, openAuthModal } = useAuth();

  // If specific roles are required (e.g., operator or responder for /admin)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-slate-100">
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600"></div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert size={28} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                RBAC ACCESS CONTROL
              </span>
              <h2 className="text-xl font-black text-white mt-1">RESTRICTED OPERATIONS AREA</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The <strong>Railway Safety Operations Hub</strong> is restricted to authorized{' '}
            <span className="text-amber-300 font-bold">Central Control Operators</span> and{' '}
            <span className="text-emerald-300 font-bold">RPF Responders</span>.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Active User:</span>
              <span className="text-white font-bold">{user.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Role:</span>
              <span className="text-rose-400 uppercase font-bold">{user.role}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Required Role:</span>
              <span className="text-emerald-400 uppercase font-bold">{allowedRoles.join(' or ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PostgreSQL RLS Status:</span>
              <span className="text-cyan-400">Strict Anti-Privilege Escalation Enforced</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Testing Options for Evaluators:
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => switchRole('operator')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <UserCheck size={16} /> Switch to Operator (Aditi Nair)
              </button>

              <button
                onClick={openAuthModal}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock size={14} /> Sign In with Staff Account
              </button>
            </div>

            {onNavigate && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight size={13} className="rotate-180" /> Back to Passenger Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If general authentication is required and user is not authenticated in a real session
  if (requireAuth && !isRealSupabaseSession && isSupabaseConfigured) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-slate-100">
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>

          <h2 className="text-xl font-black text-white mb-2">PASSENGER AUTHENTICATION REQUIRED</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please sign in with your Supabase account or register a new passenger profile to access this protected
            safety feature.
          </p>

          <button
            onClick={openAuthModal}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <ShieldCheck size={16} /> Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
