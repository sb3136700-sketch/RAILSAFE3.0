import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language, translations } from '../lib/i18n';
import {
  ShieldAlert,
  Radio,
  Train,
  AlertTriangle,
  FileText,
  LifeBuoy,
  Lock,
  Globe,
  User,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  Search,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onTriggerSos: () => void;
  onOpenAiAssistant: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onTriggerSos,
  onOpenAiAssistant,
  currentLanguage,
  onLanguageChange,
}) => {
  const {
    user,
    switchRole,
    isOperatorOrResponder,
    isRealSupabaseSession,
    openAuthModal,
    logout,
  } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const t = translations[currentLanguage];

  const navLinks = [
    { label: t.trackTrain, route: '/trains', icon: Train },
    { label: t.reportIncident, route: '/report-incident', icon: AlertTriangle },
    { label: 'My Incidents', route: '/incident-status', icon: FileText },
    { label: t.emergencyContacts, route: '/contacts', icon: PhoneCall },
    { label: 'Nearby Facilities', route: '/nearby', icon: LifeBuoy },
    { label: 'Lost & Found', route: '/lost-found', icon: Search },
    { label: t.adminPortal, route: '/admin', icon: Activity, badge: 'OPS' },
    { label: t.securityOverview, route: '/security', icon: Lock, badge: 'RLS' },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Radio className="text-cyan-400 group-hover:scale-110 transition-transform" size={20} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-wider text-white">RAILSAFE</span>
                  <span className="text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono">
                    2.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 tracking-tight font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PASSENGER SAFETY RADAR
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNav(link.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded border border-slate-700 font-mono">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition-colors cursor-pointer"
              title="Open Gemini Travel & Safety Advisor"
            >
              <Sparkles size={14} className="text-indigo-400 animate-spin-slow" />
              <span>AI Advisor</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsRoleDropdownOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                title="Change Language"
              >
                <Globe size={15} className="text-cyan-400" />
                <span className="uppercase">{currentLanguage}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Select Language
                  </div>
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'हिंदी (Hindi)' },
                    { code: 'ta', name: 'தமிழ் (Tamil)' },
                    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
                    { code: 'te', name: 'తెలుగు (Telugu)' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code as Language);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                        currentLanguage === l.code ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      {l.name}
                      {currentLanguage === l.code && <span className="text-cyan-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Supabase Account & Auth Button */}
            {isRealSupabaseSession ? (
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  title="Supabase Account"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="text-left hidden md:block">
                    <div className="text-[11px] font-bold leading-none truncate max-w-28">{user.name}</div>
                    <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">SUPABASE: {user.role}</div>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Sign In or Register with Supabase"
              >
                <Lock size={13} className="text-cyan-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Persona / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  user.role === 'operator'
                    ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                    : user.role === 'responder'
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Switch Persona Role"
              >
                <User size={14} />
                <div className="text-left hidden md:block">
                  <div className="text-[11px] font-bold leading-none">{user.name.split(' ')[0]}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-75 font-mono">{user.role}</div>
                </div>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  {isRealSupabaseSession && (
                    <div className="px-3 pb-2 border-b border-slate-800 mb-1.5">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                        Supabase Authenticated
                      </div>
                      <div className="text-[11px] text-slate-200 truncate mt-0.5">{user.email}</div>
                      <button
                        onClick={async () => {
                          await logout();
                          setIsRoleDropdownOpen(false);
                        }}
                        className="mt-2 w-full py-1 px-2 rounded bg-slate-800 hover:bg-slate-750 text-rose-400 hover:text-rose-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                      >
                        Sign Out of Supabase
                      </button>
                    </div>
                  )}

                  <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Switch Test Persona (RBAC)
                  </div>
                  <button
                    onClick={() => {
                      switchRole('passenger');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex flex-col hover:bg-slate-800 cursor-pointer ${
                      user.role === 'passenger' ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    <span className="font-bold text-slate-200">Sameer Khan</span>
                    <span className="text-[11px] text-slate-400">Role: Passenger (Standard User)</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('operator');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex flex-col hover:bg-slate-800 cursor-pointer ${
                      user.role === 'operator' ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                    }`}
                  >
                    <span className="font-bold text-amber-300">Aditi Nair (Officer)</span>
                    <span className="text-[11px] text-slate-400">Role: Safety Operator (Full Triage Hub)</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('responder');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex flex-col hover:bg-slate-800 cursor-pointer ${
                      user.role === 'responder' ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
                    }`}
                  >
                    <span className="font-bold text-emerald-300">SI Vikram Singh (RPF)</span>
                    <span className="text-[11px] text-slate-400">Role: Field Responder (Assigned cases)</span>
                  </button>

                  {!isRealSupabaseSession && (
                    <div className="pt-2 px-3 border-t border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          setIsRoleDropdownOpen(false);
                          openAuthModal();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Lock size={12} /> Sign In with Supabase
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CRITICAL SOS BUTTON */}
            <button
              onClick={onTriggerSos}
              className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all cursor-pointer border border-red-400/30 animate-pulse"
              title="Activate Emergency SOS & Automatic SMS Dispatch"
            >
              <ShieldAlert size={16} />
              <span>SOS</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                  {link.label}
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                onOpenAiAssistant();
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} /> AI Advisor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
