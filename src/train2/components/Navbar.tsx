import React, { useState } from 'react';
import { 
  Train, 
  Bell, 
  Sparkles, 
  Navigation, 
  Calendar, 
  LayoutGrid, 
  Ticket, 
  ShieldAlert, 
  Compass, 
  Languages, 
  User, 
  Utensils, 
  FileText,
  Calculator,
  Building2,
  CheckSquare
} from 'lucide-react';
import { DestinationAlarm, SupportedLanguage, UserProfile } from '../types/railway';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../utils/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alarm: DestinationAlarm;
  onOpenAlarmModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenSosModal: () => void;
  onOpenAuthModal: () => void;
  onOpenComplaintModal: () => void;
  onOpenFoodModal: () => void;
  onOpenTranslateModal: () => void;
  activeTrainNumber: string;
  activeTrainName: string;
  currentLang: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  userProfile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  alarm,
  onOpenAlarmModal,
  onOpenAiAssistant,
  onOpenSosModal,
  onOpenAuthModal,
  onOpenComplaintModal,
  onOpenFoodModal,
  onOpenTranslateModal,
  activeTrainNumber,
  activeTrainName,
  currentLang,
  onChangeLanguage,
  userProfile,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'tracking', label: t.liveTracking, icon: Navigation },
    { id: 'route', label: t.routeHalts, icon: Train },
    { id: 'planner', label: t.journeyPlanner, icon: Calendar },
    { id: 'pnr-status', label: t.pnrStatus, icon: Ticket },
    { id: 'fare-calculator', label: 'Fare Calc', icon: Calculator },
    { id: 'coach-position', label: 'Coach Pos', icon: LayoutGrid },
    { id: 'station-info', label: 'Station Info', icon: Building2 },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'nearby', label: t.nearbyServices, icon: Compass },
    { id: 'ai', label: t.aiAssistant, icon: Sparkles },
    { id: 'utilities', label: t.travelUtilities, icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('tracking')}
            className="flex items-center gap-2 text-left focus:outline-none rounded"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 neon-glow-amber">
              <Train className="h-5 w-5" strokeWidth={2.3} />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white block leading-none">
                TRAVELLING GUIDE
              </span>
              <span className="text-[10px] text-amber-400/90 font-semibold tracking-wide hidden sm:block">
                Indian Railways Companion
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'pnr-status' && activeTab === 'pnr') ||
              (item.id === 'coach-position' && activeTab === 'coach');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold transition-all rounded-lg ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (SOS, Language, Account, AI) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Neon SOS Emergency Trigger */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/40 neon-glow-red transition-all animate-pulse"
            title="Emergency SOS / RPF 182 / Police"
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="tracking-wider">SOS</span>
          </button>

          {/* Real-time Translate button */}
          <button
            onClick={onOpenTranslateModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold transition-colors"
            title="Real-time translation"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Translate</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
            >
              <span className="font-bold uppercase text-[11px] text-amber-400">
                {currentLang}
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50 animate-fade-in">
                <div className="text-[10px] text-slate-400 px-2 py-1 font-semibold uppercase">
                  Select Language
                </div>
                {LANGUAGE_OPTIONS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      currentLang === l.code
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[11px] opacity-75 font-mono">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
            title="User Account & History"
          >
            <div className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
              {userProfile.fullName.charAt(0)}
            </div>
            <span className="hidden lg:inline truncate max-w-[80px]">
              {userProfile.fullName.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-bar for Mobile navigation */}
      <div className="xl:hidden flex items-center overflow-x-auto px-3 py-2 border-t border-slate-900 bg-slate-950 gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'pnr-status' && activeTab === 'pnr') ||
            (item.id === 'coach-position' && activeTab === 'coach');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
