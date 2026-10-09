import React from 'react';
import { useDemoMode, DEMO_STEPS } from '../context/DemoModeContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChevronRight, ChevronLeft, ShieldCheck, UserCheck, EyeOff, Navigation } from 'lucide-react';

interface DemoBannerProps {
  onNavigate: (route: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigate }) => {
  const { isDemoModeActive, toggleDemoMode, currentStepIndex, goToNextStep, goToPreviousStep, currentStep, goToStep } = useDemoMode();
  const { user, switchRole } = useAuth();

  if (!isDemoModeActive) {
    return (
      <div className="bg-slate-900 border-b border-cyan-900/40 px-4 py-1.5 flex justify-between items-center text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          RAILSAFE PRODUCTION SIMULATOR
        </span>
        <button
          onClick={toggleDemoMode}
          className="text-cyan-400 hover:text-cyan-300 font-medium underline cursor-pointer"
        >
          Open Hackathon Judge Guided Walkthrough
        </button>
      </div>
    );
  }

  const handleStepClick = (index: number) => {
    goToStep(index);
    const step = DEMO_STEPS[index];
    if (step.suggestedPersona !== user.role) {
      switchRole(step.suggestedPersona);
    }
    onNavigate(step.route);
  };

  const handleAdvance = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      goToNextStep();
      const step = DEMO_STEPS[nextIndex];
      if (step.suggestedPersona !== user.role) {
        switchRole(step.suggestedPersona);
      }
      onNavigate(step.route);
    }
  };

  return (
    <aside aria-label="Hackathon Judge Guided Demo Banner" className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b border-cyan-500/30 text-white px-3 sm:px-6 py-2.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold text-sm shrink-0">
            {currentStep.stepNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Hackathon Judge Runbook — Step {currentStep.stepNumber} of 6
              </span>
              <span className="bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {currentStep.duration}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {currentStep.title}
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                — {currentStep.instruction}
              </span>
            </h4>
          </div>
        </div>

        {/* Step Progress Indicators & Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Step Pill buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => handleStepClick(idx)}
                className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                  idx === currentStepIndex
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                S{s.stepNumber}
              </button>
            ))}
          </div>

          {/* Previous / Next buttons */}
          <button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleAdvance}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
          >
            Next Step <ChevronRight size={14} />
          </button>

          <button
            onClick={toggleDemoMode}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Minimize Demo Mode"
          >
            <EyeOff size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
