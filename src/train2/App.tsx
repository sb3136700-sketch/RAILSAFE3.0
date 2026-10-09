import React, { useState } from 'react';
import './index.css';
import { 
  Train, 
  Navigation, 
  MapPin, 
  Calendar, 
  LayoutGrid, 
  Ticket, 
  ShieldAlert, 
  Utensils, 
  Bell, 
  Sparkles,
  PhoneCall,
  Search,
  CheckCircle2,
  ArrowRight,
  Compass,
  FileText,
  Languages,
  User,
  Car,
  Calculator,
  Building2,
  CheckSquare
} from 'lucide-react';

import { ALL_TRAINS } from './data/trainsData';
import { TrainDetails, DestinationAlarm, SupportedLanguage, UserProfile } from './types/railway';
import { getUserProfile } from './utils/userStore';
import { TRANSLATIONS } from './utils/i18n';

import { Navbar } from './components/Navbar';
import { JourneyTracker } from './components/JourneyTracker';
import { RouteTimeline } from './components/RouteTimeline';
import { JourneyPlanner } from './components/JourneyPlanner';
import { CoachSeatMap } from './components/CoachSeatMap';
import { PnrChecker } from './components/PnrChecker';
import { TravelUtilities } from './components/TravelUtilities';
import { StationFoodGuide } from './components/StationFoodGuide';
import { NearbyServices } from './components/NearbyServices';
import { AiAssistantPage } from './components/AiAssistantPage';

// New Pages
import { PnrStatusPage } from './components/PnrStatusPage';
import { FareCalculatorPage } from './components/FareCalculatorPage';
import { CoachPositionPage } from './components/CoachPositionPage';
import { StationInfoPage } from './components/StationInfoPage';
import { TravelChecklistPage } from './components/TravelChecklistPage';

// Modals
import { AlarmModal } from './components/AlarmModal';
import { SosModal } from './components/SosModal';
import { AuthModal } from './components/AuthModal';
import { RailComplaintModal } from './components/RailComplaintModal';
import { TicketBookingModal } from './components/TicketBookingModal';
import { FoodOrderModal } from './components/FoodOrderModal';
import { RealtimeTranslateModal } from './components/RealtimeTranslateModal';

export interface Train2AppProps {
  onTriggerRailSafeSos?: () => void;
}

export default function App({ onTriggerRailSafeSos }: Train2AppProps = {}) {
  const [activeTab, setActiveTabState] = useState<string>('tracking');
  const setActiveTab = (tab: string) => setActiveTabState(tab);

  const [currentTrain, setCurrentTrain] = useState<TrainDetails>(ALL_TRAINS[0]);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [quickSearchNumber, setQuickSearchNumber] = useState('');

  // Modals state
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);

  // Destination wake-up alarm state
  const [alarm, setAlarm] = useState<DestinationAlarm>({
    enabled: true,
    stationCode: 'CNB',
    stationName: 'Kanpur Central',
    offsetMinutes: 30,
    soundPlayed: false,
  });

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentApproachingStop = currentTrain.routeStops[1] || currentTrain.routeStops[0];

  const handleSelectTrain = (train: TrainDetails) => {
    setCurrentTrain(train);
    setAlarm((prev) => ({
      ...prev,
      stationCode: train.destCode,
      stationName: train.destName,
    }));
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchNumber.trim()) return;
    const query = quickSearchNumber.trim().toLowerCase();
    const found = ALL_TRAINS.find(
      (t) =>
        t.trainNumber.toLowerCase().includes(query) ||
        t.trainName.toLowerCase().includes(query) ||
        t.sourceName.toLowerCase().includes(query) ||
        t.destName.toLowerCase().includes(query)
    );
    if (found) {
      handleSelectTrain(found);
      setActiveTab('tracking');
      setQuickSearchNumber('');
    }
  };

  const handleSetAlarmForStation = (stationCode: string, stationName: string) => {
    setAlarm({
      enabled: true,
      stationCode,
      stationName,
      offsetMinutes: 30,
      soundPlayed: false,
    });
    setIsAlarmModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      {/* 3-Zone Navigation Header with SOS & Language */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alarm={alarm}
        onOpenAlarmModal={() => setIsAlarmModalOpen(true)}
        onOpenAiAssistant={() => setActiveTab('ai')}
        onOpenSosModal={() => (onTriggerRailSafeSos ? onTriggerRailSafeSos() : setIsSosModalOpen(true))}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenComplaintModal={() => setIsComplaintModalOpen(true)}
        onOpenFoodModal={() => setIsFoodModalOpen(true)}
        onOpenTranslateModal={() => setIsTranslateModalOpen(true)}
        activeTrainNumber={currentTrain.trainNumber}
        activeTrainName={currentTrain.trainName}
        currentLang={currentLang}
        onChangeLanguage={(l) => setCurrentLang(l)}
        userProfile={userProfile}
      />

      {/* Cyber-Rail Hero Strip */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Tagline */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <span className="neon-text-amber">{t.brandName}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{t.tagline}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.tagline}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Accurate live train location, upcoming stations, cabs & autos (Ola/Uber/Rapido), hotels, hospital emergency, IRCTC e-Catering & RailMadad complaint portal.
              </p>
            </div>

            {/* Quick Train Search Bar */}
            <form onSubmit={handleQuickSearch} className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={quickSearchNumber}
                  onChange={(e) => setQuickSearchNumber(e.target.value)}
                  placeholder="Enter Train No. (22436, 12952)..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none shadow-sm font-mono"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0 neon-glow-amber"
              >
                <span>Find Train</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Action Pills for Real-time Services */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Direct Services:</span>
            
            <button
              onClick={() => setActiveTab('pnr-status')}
              className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>Check PNR</span>
            </button>

            <button
              onClick={() => setActiveTab('fare-calculator')}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Fare Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('coach-position')}
              className="px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-slate-900/80 hover:bg-slate-800 text-indigo-300 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Coach Position</span>
            </button>

            <button
              onClick={() => setActiveTab('station-info')}
              className="px-3 py-1.5 rounded-xl border border-purple-500/40 bg-slate-900/80 hover:bg-slate-800 text-purple-300 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Station Info</span>
            </button>

            <button
              onClick={() => setActiveTab('nearby')}
              className="px-3 py-1.5 rounded-xl border border-lime-500/40 bg-slate-900/80 hover:bg-slate-800 text-lime-400 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Car className="h-3.5 w-3.5" />
              <span>Book Cabs (Ola/Uber)</span>
            </button>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>E-Ticket</span>
            </button>

            <button
              onClick={() => setIsFoodModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Order Food</span>
            </button>

            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-red-500/40 bg-slate-900/80 hover:bg-slate-800 text-red-400 font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>RailMadad</span>
            </button>

            <button
              onClick={() => setIsTranslateModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium transition-all flex items-center gap-1.5"
            >
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <span>Translate</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tracking' && (
          <JourneyTracker
            currentTrain={currentTrain}
            allTrains={ALL_TRAINS}
            onSelectTrain={handleSelectTrain}
            alarm={alarm}
            onOpenAlarmModal={() => setIsAlarmModalOpen(true)}
            onNavigateToRoute={() => setActiveTab('route')}
            onNavigateToNearby={() => setActiveTab('nearby')}
            onOpenComplaintModal={() => setIsComplaintModalOpen(true)}
            onOpenFoodModal={() => setIsFoodModalOpen(true)}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            userProfile={userProfile}
            onNavigateToPnrStatus={() => setActiveTab('pnr-status')}
            onNavigateToFareCalculator={() => setActiveTab('fare-calculator')}
            onNavigateToCoachPosition={() => setActiveTab('coach-position')}
            onNavigateToStationInfo={() => setActiveTab('station-info')}
            onNavigateToChecklist={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'route' && (
          <RouteTimeline
            currentTrain={currentTrain}
            currentStopIndex={1}
            alarm={alarm}
            onSetAlarmForStation={handleSetAlarmForStation}
          />
        )}

        {activeTab === 'planner' && (
          <JourneyPlanner
            allTrains={ALL_TRAINS}
            onSelectTrainForTracking={(tr) => {
              handleSelectTrain(tr);
              setActiveTab('tracking');
            }}
            onSelectTrainForRoute={(tr) => {
              handleSelectTrain(tr);
              setActiveTab('route');
            }}
            onSelectTrainForCoach={(tr) => {
              handleSelectTrain(tr);
              setActiveTab('coach-position');
            }}
          />
        )}

        {(activeTab === 'pnr-status' || activeTab === 'pnr') && (
          <PnrStatusPage
            onTrackTrain={(num) => {
              const tr = ALL_TRAINS.find((t) => t.trainNumber === num) || ALL_TRAINS[0];
              handleSelectTrain(tr);
              setActiveTab('tracking');
            }}
            onNavigateToDashboard={() => setActiveTab('tracking')}
          />
        )}

        {activeTab === 'fare-calculator' && (
          <FareCalculatorPage />
        )}

        {(activeTab === 'coach-position' || activeTab === 'coach') && (
          <div className="space-y-8">
            <CoachPositionPage />
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-cyan-400" />
                <span>Interactive Coach & Berth Layout Visualizer</span>
              </h3>
              <CoachSeatMap currentTrain={currentTrain} />
            </div>
          </div>
        )}

        {activeTab === 'station-info' && (
          <StationInfoPage />
        )}

        {activeTab === 'checklist' && (
          <TravelChecklistPage />
        )}

        {activeTab === 'nearby' && (
          <NearbyServices
            currentTrain={currentTrain}
            currentStation={currentApproachingStop}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantPage
            currentTrain={currentTrain}
            currentStation={currentApproachingStop}
          />
        )}

        {activeTab === 'utilities' && (
          <TravelUtilities />
        )}

        {activeTab === 'food' && (
          <StationFoodGuide />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Destination Alarm Modal */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        alarm={alarm}
        onSaveAlarm={(newAlarm) => setAlarm(newAlarm)}
        routeStops={currentTrain.routeStops}
        currentStopIndex={1}
      />

      {!onTriggerRailSafeSos && (
        <>
                {/* 2. SOS Emergency Modal */}
                <SosModal
                  isOpen={isSosModalOpen}
                  onClose={() => setIsSosModalOpen(false)}
                  currentTrain={currentTrain}
                  currentStation={currentApproachingStop}
                  userProfile={userProfile}
                />
        </>
      )}

      {/* 3. User Account & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(p) => setUserProfile(p)}
        onTrackSavedJourney={(trainNo) => {
          const tr = ALL_TRAINS.find((t) => t.trainNumber === trainNo);
          if (tr) handleSelectTrain(tr);
          setActiveTab('tracking');
        }}
      />

      {/* 4. Official RailMadad Complaint Modal */}
      <RailComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        currentTrain={currentTrain}
        currentStation={currentApproachingStop}
        userProfile={userProfile}
      />

      {/* 5. Ticket Booking & E-Ticket Download Modal */}
      <TicketBookingModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        currentTrain={currentTrain}
        userProfile={userProfile}
        onNavigateToPnr={() => setActiveTab('pnr-status')}
      />

      {/* 6. Food Order to Seat Modal */}
      <FoodOrderModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        currentTrain={currentTrain}
        currentStation={currentApproachingStop}
        userProfile={userProfile}
      />

      {/* 7. Real-Time Translation Modal */}
      <RealtimeTranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
      />

      {/* Production Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
              TG
            </div>
            <span className="font-semibold text-slate-300">{t.brandName}</span>
            <span className="text-slate-600">·</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>RailMadad: <strong className="text-white font-mono">139</strong></span>
            <span>·</span>
            <span>RPF Security: <strong className="text-white font-mono">182</strong></span>
            <span>·</span>
            <span>Emergency: <strong className="text-white font-mono">112</strong></span>
          </div>

          <div className="text-slate-500 text-[11px]">
            Designed for Indian Railways passengers · Verified official links for Ola, Uber, Rapido, IRCTC & RailMadad
          </div>
        </div>
      </footer>
    </div>
  );
}
