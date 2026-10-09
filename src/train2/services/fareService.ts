/**
 * Fare Calculation Service
 * Estimates fares for Indian Railways train journeys.
 * Note: Clearly labeled as Estimated / Demo Fare to comply with guidelines.
 */

export type FareClass = 'General' | 'Sleeper' | '3A' | '2A' | '1A' | 'CC' | '2S';

export interface FareEstimateResult {
  source: string;
  destination: string;
  distanceKm: number;
  travelClass: FareClass;
  passengerCount: number;
  baseFarePerPerson: number;
  reservationCharge: number;
  superfastCharge: number;
  gstAmount: number;
  totalPerPerson: number;
  grandTotal: number;
  isOfficial: boolean;
  disclaimer: string;
}

// Approximate rate per km according to Indian Railways standard fare telescopic slabs
const CLASS_RATES: Record<FareClass, { basePerKm: number; minBase: number; resFee: number; sfCharge: number; isAc: boolean }> = {
  'General': { basePerKm: 0.35, minBase: 60, resFee: 0, sfCharge: 15, isAc: false },
  '2S': { basePerKm: 0.42, minBase: 85, resFee: 15, sfCharge: 15, isAc: false },
  'Sleeper': { basePerKm: 0.65, minBase: 175, resFee: 20, sfCharge: 30, isAc: false },
  'CC': { basePerKm: 1.45, minBase: 450, resFee: 40, sfCharge: 45, isAc: true },
  '3A': { basePerKm: 1.75, minBase: 650, resFee: 40, sfCharge: 45, isAc: true },
  '2A': { basePerKm: 2.45, minBase: 950, resFee: 50, sfCharge: 45, isAc: true },
  '1A': { basePerKm: 3.85, minBase: 1600, resFee: 60, sfCharge: 75, isAc: true },
};

export function calculateEstimatedFare(
  source: string,
  destination: string,
  distanceKm: number,
  travelClass: FareClass,
  passengerCount: number = 1
): FareEstimateResult {
  const config = CLASS_RATES[travelClass] || CLASS_RATES['Sleeper'];
  const dist = Math.max(50, distanceKm || 350);

  // Telescopic scaling
  const rawBase = Math.max(config.minBase, Math.round(dist * config.basePerKm));
  const reservationCharge = config.resFee;
  const superfastCharge = config.sfCharge;
  const taxableFare = rawBase + reservationCharge + superfastCharge;
  const gstAmount = config.isAc ? Math.round(taxableFare * 0.05) : 0;
  const totalPerPerson = taxableFare + gstAmount;
  const grandTotal = totalPerPerson * Math.max(1, passengerCount);

  return {
    source,
    destination,
    distanceKm: dist,
    travelClass,
    passengerCount,
    baseFarePerPerson: rawBase,
    reservationCharge,
    superfastCharge,
    gstAmount,
    totalPerPerson,
    grandTotal,
    isOfficial: false,
    disclaimer: 'Estimated / Demo Fare. Official IRCTC dynamic pricing, Tatkal charges, and catering fees may vary.',
  };
}
