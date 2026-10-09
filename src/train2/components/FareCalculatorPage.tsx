import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Info, Train, Users, IndianRupee } from 'lucide-react';
import { calculateEstimatedFare, FareClass, FareEstimateResult } from '../services/fareService';
import { MAJOR_STATIONS } from '../data/trainsData';

export const FareCalculatorPage: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('NDLS');
  const [destCode, setDestCode] = useState('BSB');
  const [travelClass, setTravelClass] = useState<FareClass>('3A');
  const [passengerCount, setPassengerCount] = useState(1);
  const [distanceKm, setDistanceKm] = useState(759);
  const [result, setResult] = useState<FareEstimateResult | null>(() =>
    calculateEstimatedFare('New Delhi (NDLS)', 'Varanasi Junction (BSB)', 759, '3A', 1)
  );

  const classes: FareClass[] = ['General', '2S', 'Sleeper', 'CC', '3A', '2A', '1A'];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const srcObj = MAJOR_STATIONS.find((s) => s.code === sourceCode);
    const destObj = MAJOR_STATIONS.find((s) => s.code === destCode);

    const srcName = srcObj ? `${srcObj.name} (${srcObj.code})` : sourceCode;
    const destName = destObj ? `${destObj.name} (${destObj.code})` : destCode;

    // Approximate distance if same corridor
    let dist = distanceKm;
    if (sourceCode === destCode) dist = 50;

    const res = calculateEstimatedFare(srcName, destName, dist, travelClass, passengerCount);
    setResult(res);
  };

  const handleSwap = () => {
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl neon-glow-cyan">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Calculator className="h-4 w-4" />
          <span>Indian Railways Telescopic Fare Estimator</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Train Fare Calculator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Estimate travel expenses across all railway classes with telescopic fare breakdown
        </p>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Source Station
              </label>
              <select
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {MAJOR_STATIONS.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code}) - {st.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-center py-1">
              <button
                type="button"
                onClick={handleSwap}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                title="Swap source and destination"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Destination Station
              </label>
              <select
                value={destCode}
                onChange={(e) => setDestCode(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {MAJOR_STATIONS.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code}) - {st.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Class of Travel
              </label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value as FareClass)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Passenger Count
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={passengerCount}
                onChange={(e) => setPassengerCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Distance (km)
              </label>
              <input
                type="number"
                min={50}
                max={4000}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Math.max(50, parseInt(e.target.value) || 350))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md neon-glow-cyan"
            >
              Calculate Estimated Fare
            </button>
          </div>
        </form>
      </div>

      {/* Fare Breakdown Result */}
      {result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl neon-glow-cyan">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {result.disclaimer.split('.')[0]}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Total Estimated Fare: ₹{result.grandTotal}
              </h3>
              <p className="text-xs text-slate-400">
                For {result.passengerCount} passenger(s) in {result.travelClass} Class ({result.distanceKm} km)
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Per Passenger:</span>
              <div className="text-lg font-mono font-bold text-cyan-400">
                ₹{result.totalPerPerson}
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Base Fare</span>
              <strong className="text-white font-mono text-sm">₹{result.baseFarePerPerson}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Reservation Fee</span>
              <strong className="text-white font-mono text-sm">₹{result.reservationCharge}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Superfast Surcharge</span>
              <strong className="text-white font-mono text-sm">₹{result.superfastCharge}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">GST (5% for AC)</span>
              <strong className="text-white font-mono text-sm">₹{result.gstAmount}</strong>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Important Disclosure:</strong> {result.disclaimer} Dynamic surge pricing, Tatkal charges, premium express supplements, and catering fees will apply on official booking portals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
