import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language, translations } from '../lib/i18n';
import {
  ShieldAlert,
  Train,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  Search,
  Activity,
  Lock,
  ChevronRight,
  LifeBuoy,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onTriggerSos: () => void;
  onOpenAiAssistant: () => void;
  currentLanguage: Language;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onTriggerSos,
  onOpenAiAssistant,
  currentLanguage,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[currentLanguage];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/trains');
  };

  const emergencyNumbers = [
    { label: 'Railway All-in-One Helpline', number: '139', desc: 'Security, Medical, Complaints & Information', tel: 'tel:139' },
    { label: 'National Emergency Service', number: '112', desc: 'Police, Ambulance & Fire Rescue', tel: 'tel:112' },
    { label: 'Railway Protection Force', number: '182', desc: 'Direct Onboard Passenger Security Hub', tel: 'tel:182' },
    { label: 'Women Passenger Helpline', number: '1091', desc: 'Dedicated 24x7 Safety Assistance', tel: 'tel:1091' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI FUSION 2K26 • CYBERSECURITY & SAFETY PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Next-Gen Railway Safety & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Passenger Care</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.safetyDescription}
          </p>

          {/* Search Trains form */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-750 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Train size={16} /> Track Train
            </button>
          </form>

          {/* Quick train search tags */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
            <span className="font-mono text-slate-500">Popular:</span>
            {['12626 Kerala Express', '12951 Mumbai Rajdhani', '20607 Vande Bharat', '12002 Shatabdi'].map((tName) => (
              <button
                key={tName}
                onClick={() => onNavigate('/trains')}
                className="hover:text-cyan-400 underline cursor-pointer"
              >
                {tName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Action Matrix (Priority 0 & 35) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Critical SOS */}
        <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 border border-red-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-red-400 transition-all shadow-xl group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldAlert size={26} className="animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Emergency SOS</h3>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-mono">
                SMS + GPS
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Instant automated SMS alerts to your emergency contacts with verified coordinates, train info, and live GPS tracking link.
            </p>
          </div>
          <button
            onClick={onTriggerSos}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
          >
            ACTIVATE SOS WORKFLOW <ChevronRight size={14} />
          </button>
        </div>

        {/* Card 2: Report Safety Incident */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-xl group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle size={24} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{t.reportIncident}</h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
                AI TRIAGE
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Report harassment, theft, overcrowding, or medical distress. Gemini classifies severity and escalates to the Railway Protection Force.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/report-incident')}
            className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            SUBMIT SAFETY REPORT <ChevronRight size={14} />
          </button>
        </div>

        {/* Card 3: AI Travel Advisor */}
        <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-400/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-xl group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">AI Travel Advisor</h3>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.5 rounded font-mono">
                GEMINI 3.8
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Conversational travel and passenger safety guide grounded in official Indian Railway policies, delay compensation, and station facilities.
            </p>
          </div>
          <button
            onClick={onOpenAiAssistant}
            className="mt-5 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-indigo-950/50"
          >
            OPEN AI ASSISTANT <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Official Railway Helplines Grid */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall size={18} className="text-cyan-400" />
              Verified Official Railway Emergency Numbers
            </h2>
            <p className="text-xs text-slate-400">Available 24x7 across all Indian railway networks</p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
            TOLL-FREE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyNumbers.map((item) => (
            <a
              key={item.number}
              href={item.tel}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all group block"
            >
              <div className="text-2xl font-black text-cyan-400 group-hover:text-cyan-300 font-mono">
                {item.number}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">{item.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Secondary Quick Utilities */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => onNavigate('/contacts')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
        >
          <PhoneCall size={18} className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-200">Emergency Contacts</div>
          <div className="text-[11px] text-slate-400">Manage SMS alert recipients</div>
        </button>

        <button
          onClick={() => onNavigate('/nearby')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
        >
          <LifeBuoy size={18} className="text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-200">Nearby Facilities</div>
          <div className="text-[11px] text-slate-400">Hospitals, Clinics & Police</div>
        </button>

        <button
          onClick={() => onNavigate('/lost-found')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
        >
          <Search size={18} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-200">Lost & Found Registry</div>
          <div className="text-[11px] text-slate-400">Match lost baggage or gadgets</div>
        </button>

        <button
          onClick={() => onNavigate('/security')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
        >
          <Lock size={18} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-200">Cybersecurity Hub</div>
          <div className="text-[11px] text-slate-400">RLS audit & penetration tests</div>
        </button>
      </section>

      {/* Useful Railway External Resource Links */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs flex flex-wrap items-center justify-between gap-4">
        <span className="text-slate-400 font-medium">Quick External Travel Shortcuts:</span>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.irctc.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1 font-medium"
          >
            Official IRCTC Portal <ExternalLink size={11} />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://www.ecatering.irctc.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1 font-medium"
          >
            Food on Track <ExternalLink size={11} />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://www.olacabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1 font-medium"
          >
            Ola Cabs <ExternalLink size={11} />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://www.rapido.bike"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-400 flex items-center gap-1 font-medium"
          >
            Rapido Bike Taxi <ExternalLink size={11} />
          </a>
        </div>
      </section>
    </div>
  );
};
