import React, { createContext, useContext, useState } from 'react';

export interface DemoStep {
  stepNumber: number;
  title: string;
  duration: string;
  instruction: string;
  route: string;
  suggestedPersona: 'passenger' | 'operator';
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Problem & Passenger Hub',
    duration: '20–30s',
    instruction: 'Present the passenger command center. Explain how millions of railway travelers lack unified safety reporting, journey status, and prompt emergency response.',
    route: '/',
    suggestedPersona: 'passenger',
  },
  {
    stepNumber: 2,
    title: 'Real Train Tracking & Radar',
    duration: '30–45s',
    instruction: 'Inspect Train 12626 (Kerala Superfast Express) or 12951 (Mumbai Rajdhani). Note the verified schedule, route polyline, and honest "DEMO MODE" badge when live GPS is unconfigured.',
    route: '/trains',
    suggestedPersona: 'passenger',
  },
  {
    stepNumber: 3,
    title: 'Submit Safety Incident',
    duration: '45–60s',
    instruction: 'File a passenger incident (e.g. harassment or medical distress in Coach B3). Observe the instant generated Reference ID (RS-2026-INC-xxxx).',
    route: '/report-incident',
    suggestedPersona: 'passenger',
  },
  {
    stepNumber: 4,
    title: 'Gemini AI Automation',
    duration: '45–60s',
    instruction: 'Witness server-side Gemini 3.8 Flash classifying severity, urgency rating, recommended actions, and routing to the Railway Protection Force (RPF).',
    route: '/incident-status',
    suggestedPersona: 'passenger',
  },
  {
    stepNumber: 5,
    title: 'Control Center Operations',
    duration: '45–60s',
    instruction: 'Switch to Operator persona (Aditi Nair). Triage incoming report, review AI recommendations vs operator override, assign to Sub-Inspector Vikram Singh, and append to the audit trail.',
    route: '/admin',
    suggestedPersona: 'operator',
  },
  {
    stepNumber: 6,
    title: 'Cybersecurity Hub & Verification',
    duration: '30–45s',
    instruction: 'Verify Row-Level Security (RLS) preventing unauthorized access, review real-time audit logs, secret hygiene verification, and active system health status.',
    route: '/security',
    suggestedPersona: 'operator',
  },
];

interface DemoModeContextType {
  isDemoModeActive: boolean;
  toggleDemoMode: () => void;
  currentStepIndex: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  currentStep: DemoStep;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const toggleDemoMode = () => {
    setIsDemoModeActive((prev) => !prev);
  };

  const goToNextStep = () => {
    setCurrentStepIndex((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1));
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoModeActive,
        toggleDemoMode,
        currentStepIndex,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        currentStep: DEMO_STEPS[currentStepIndex],
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) throw new Error('useDemoMode must be used within a DemoModeProvider');
  return context;
};
