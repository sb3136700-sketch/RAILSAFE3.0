import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DemoModeProvider } from './context/DemoModeContext';
import { Language } from './lib/i18n';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { SosModal } from './components/SosModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { TrainTrackingPage } from './pages/TrainTrackingPage';
import { IncidentReportPage } from './pages/IncidentReportPage';
import { IncidentTrackingPage } from './pages/IncidentTrackingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SecurityPage } from './pages/SecurityPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { NearbyServicesPage } from './pages/NearbyServicesPage';
import { LostAndFoundPage } from './pages/LostAndFoundPage';
import { SavedJourneysPage } from './pages/SavedJourneysPage';
import { LiveSosTrackingPage } from './pages/LiveSosTrackingPage';
import Train2TravelModule from './train2/App';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('railsafe_lang') as Language) || 'en';
  });

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [selectedIncidentRef, setSelectedIncidentRef] = useState<string | undefined>(undefined);

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('railsafe_lang', lang);
  };

  // Route matching
  const renderCurrentPage = () => {
    // Check if route is live SOS tracking link: /sos/live/:token
    if (currentRoute.startsWith('/sos/live/')) {
      const token = currentRoute.replace('/sos/live/', '');
      return <LiveSosTrackingPage token={token} />;
    }

    switch (currentRoute) {
      case '/travel-tools':
        return <Train2TravelModule onTriggerRailSafeSos={() => setIsSosOpen(true)} />;
      case '/trains':
        return <TrainTrackingPage />;
      case '/report-incident':
        return (
          <IncidentReportPage
            onNavigateToStatus={(refId) => {
              setSelectedIncidentRef(refId);
              navigate('/incident-status');
            }}
          />
        );
      case '/incident-status':
        return <IncidentTrackingPage initialReferenceId={selectedIncidentRef} />;
      case '/admin':
        return (
          <ProtectedRoute allowedRoles={['operator', 'responder']} onNavigate={navigate}>
            <AdminDashboardPage />
          </ProtectedRoute>
        );
      case '/security':
        return <SecurityPage />;
      case '/contacts':
        return <EmergencyContactsPage />;
      case '/nearby':
        return <NearbyServicesPage />;
      case '/lost-found':
        return <LostAndFoundPage />;
      case '/saved-journeys':
        return <SavedJourneysPage />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onTriggerSos={() => setIsSosOpen(true)}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            currentLanguage={currentLanguage}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <DemoModeProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
          {/* Top Demo Mode Controller Banner */}
          {currentRoute !== '/travel-tools' && <DemoBanner onNavigate={navigate} />}

          {currentRoute !== '/travel-tools' && (
            {/* Primary Navbar */}
            <Navbar
              currentRoute={currentRoute}
              onNavigate={navigate}
              onTriggerSos={() => setIsSosOpen(true)}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}

          {/* Main Content Area */}
          <main className={currentRoute === '/travel-tools' ? "flex-1 w-full" : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6"}>
            {renderCurrentPage()}
          </main>

          {currentRoute !== '/travel-tools' && (
            {/* Footer */}
            <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">RailSafe 2.0</span>
                  <span>• AI Fusion 2K26 Hackathon Platform (Cybersecurity & Passenger Safety)</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <button onClick={() => navigate('/security')} className="hover:text-cyan-400 cursor-pointer">
                    Security Overview (RLS)
                  </button>
                  <span>•</span>
                  <button onClick={() => navigate('/trains')} className="hover:text-cyan-400 cursor-pointer">
                    Live Train Radar
                  </button>
                  <span>•</span>
                  <a href="tel:139" className="text-cyan-400 hover:underline">
                    Railway Helpline: 139
                  </a>
                </div>
              </div>
            </footer>
          )}

          {/* Critical SOS Modal */}
          <SosModal
            isOpen={isSosOpen}
            onClose={() => setIsSosOpen(false)}
            onNavigateToLiveTracking={(token) => navigate(`/sos/live/${token}`)}
          />

          {/* Gemini AI Advisor Modal */}
          <AiAssistantModal
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            currentLanguage={currentLanguage}
          />

          {/* Supabase Authentication Modal */}
          <AuthModal />
        </div>
      </DemoModeProvider>
    </AuthProvider>
  );
}
