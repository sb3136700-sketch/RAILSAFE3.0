import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Plus, 
  PhoneCall, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Trash2,
  Lock,
  HeartPulse
} from 'lucide-react';
import { TRAVEL_CHECKLIST_TEMPLATE, EMERGENCY_NUMBERS, TATKAL_GUIDE } from '../data/trainsData';

export const TravelUtilities: React.FC = () => {
  // Checklist state
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('tg_packing_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return TRAVEL_CHECKLIST_TEMPLATE;
      }
    }
    return TRAVEL_CHECKLIST_TEMPLATE;
  });

  const [newItemTitle, setNewItemTitle] = useState('');

  // Save checklist
  useEffect(() => {
    localStorage.setItem('tg_packing_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev: Array<{ id: string; title: string; category: string; checked: boolean }>) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      category: 'Custom',
      checked: false,
    };
    setChecklist((prev: Array<{ id: string; title: string; category: string; checked: boolean }>) => [
      ...prev,
      newItem,
    ]);
    setNewItemTitle('');
  };

  const removeItem = (id: string) => {
    setChecklist((prev: Array<{ id: string; title: string; category: string; checked: boolean }>) =>
      prev.filter((i) => i.id !== id)
    );
  };

  // Tatkal Countdown Timer (Calculates time until next 10:00 AM IST)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTatkal = () => {
      const now = new Date();
      // Target next 10:00 AM
      const target = new Date();
      target.setHours(10, 0, 0, 0);
      if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTatkal();
    const interval = setInterval(calculateTatkal, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = checklist.filter((i: { checked: boolean }) => i.checked).length;
  const checklistPercent = Math.round((completedCount / checklist.length) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Tatkal Assistant Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Clock className="h-4 w-4" />
              <span>IRCTC High-Speed Tatkal Window</span>
            </div>
            <h2 className="text-xl font-bold text-white">Next Tatkal Booking Countdown</h2>
            <p className="text-xs text-slate-400 mt-1">
              AC Tatkal opens daily at 10:00 AM IST · Non-AC Sleeper opens at 11:00 AM IST
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 font-mono">
            <div className="flex flex-col items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 min-w-[70px]">
              <span className="text-2xl font-extrabold text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Hours</span>
            </div>
            <span className="text-xl font-bold text-slate-600">:</span>
            <div className="flex flex-col items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 min-w-[70px]">
              <span className="text-2xl font-extrabold text-amber-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Mins</span>
            </div>
            <span className="text-xl font-bold text-slate-600">:</span>
            <div className="flex flex-col items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 min-w-[70px]">
              <span className="text-2xl font-extrabold text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Secs</span>
            </div>
          </div>
        </div>

        {/* Tatkal Pro Rules Checklist */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {TATKAL_GUIDE.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="text-slate-300 leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Packing Checklist & Emergency Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Indian Railways Packing Checklist */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Smart Train Packing Checklist</h3>
                <p className="text-xs text-slate-400">Tailored essentials for comfortable Indian train travel</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {completedCount}/{checklist.length} Packed ({checklistPercent}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 my-4 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {checklist.map((item: { id: string; title: string; category: string; checked: boolean }) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    item.checked
                      ? 'border-slate-800 bg-slate-950/40 text-slate-500'
                      : 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    {item.checked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span className={item.checked ? 'line-through' : 'font-medium'}>
                      {item.title}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Item form */}
          <form onSubmit={addItem} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Add personal item (e.g. Earphones, Medicine)..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Module 2: Emergency Helplines Directory */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Emergency Helplines & Security</h3>
              <p className="text-xs text-slate-400">Direct 24x7 official assistance contacts</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>

          {/* Emergency numbers list */}
          <div className="mt-4 space-y-3">
            {EMERGENCY_NUMBERS.map((em, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-white">
                      {em.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {em.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {em.desc}
                  </p>
                </div>

                <a
                  href={`tel:${em.code}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold transition-colors shrink-0 ml-2"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>

          {/* In-Train Medical Protocol */}
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-300">
              <HeartPulse className="h-4 w-4" />
              <span>Medical Emergency On Board:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              If a passenger falls sick or needs urgent medical attention, immediately notify the Train Ticket Examiner (TTE) or Coach Attendant, or tweet to @RailMinIndia / dial 139 with your Coach & Berth number. Railway doctors will attend at the next scheduled halt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
