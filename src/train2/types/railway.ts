export type TrainClass = '1A' | '2A' | '3A' | '3E' | 'CC' | 'EC' | 'SL' | '2S';

export type TrainType = 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Tejas' | 'Duronto' | 'Superfast' | 'Mail/Express';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'kn' | 'te' | 'ml' | 'bn';

export interface StationAmenity {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface RouteStop {
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: string;
  wifi: boolean;
  foodPlaza: boolean;
  cloakRoom: boolean;
  waitingRoom: boolean;
  wheelchair: boolean;
  executiveLounge: boolean;
  waterBooth: boolean;
  chargingPoints: boolean;
  localSpecialty?: {
    dish: string;
    description: string;
    platformTips?: string;
  };
}

export interface TrainCoach {
  coachCode: string;
  coachClass: TrainClass | 'GEN' | 'LOCO' | 'EOG' | 'SLR' | 'PANTRY';
  coachName: string;
  totalSeats: number;
}

export interface TrainDetails {
  trainNumber: string;
  trainName: string;
  type: TrainType;
  sourceCode: string;
  sourceName: string;
  sourceDeparture: string;
  destCode: string;
  destName: string;
  destArrival: string;
  duration: string;
  totalDistanceKm: number;
  runsOnDays: string[];
  classes: TrainClass[];
  pantryAvailable: boolean;
  routeStops: RouteStop[];
  coaches: TrainCoach[];
  avgSpeedKmph: number;
  maxSpeedKmph: number;
  fares: Partial<Record<TrainClass, number>>;
}

export interface PnrPassenger {
  passengerNumber: number;
  bookingStatus: string;
  currentStatus: string;
  berthPreference: string;
  allocatedBerth?: string;
  allocatedCoach?: string;
  berthType?: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle';
}

export interface PnrRecord {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  dateOfJourney: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  boardingStation: string;
  reservationClass: TrainClass;
  chartStatus: 'Prepared' | 'Not Prepared';
  confirmationProbability: number;
  passengers: PnrPassenger[];
}

export interface LiveTrackingState {
  trainNumber: string;
  currentStopIndex: number;
  progressPercent: number;
  currentSpeedKmph: number;
  delayMinutes: number;
  distanceCoveredKm: number;
  lastUpdated: string;
  statusText: string;
  nextStationEstimatedArrival: string;
  isSimulating: boolean;
}

export interface DestinationAlarm {
  enabled: boolean;
  stationCode: string;
  stationName: string;
  offsetMinutes: number;
  soundPlayed: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredLanguage: SupportedLanguage;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredBerth: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window';
  savedJourneys: {
    id: string;
    trainNumber: string;
    trainName: string;
    fromStation: string;
    toStation: string;
    date: string;
    pnr?: string;
  }[];
  historySearch: string[];
}

export interface TravelExpense {
  id: string;
  description: string;
  category: 'Ticket' | 'Food' | 'Cab' | 'Auto' | 'Hotel' | 'Shopping' | 'Other';
  amount: number;
  date: string;
  trainNumber?: string;
}

export interface TravelNote {
  id: string;
  title: string;
  content: string;
  category: 'Booking' | 'Contact' | 'Stay' | 'Personal' | 'Other';
  date: string;
  trainNumber?: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  type: 'Hotel' | 'Restaurant' | 'Hospital' | 'Shop' | 'Cinema' | 'Cab';
  stationCode: string;
  city: string;
  url: string;
  savedAt: string;
  notes?: string;
}

export interface JourneyReminder {
  id: string;
  title: string;
  trainNumber: string;
  departureTime: string;
  offsetMinutes: number; // 30, 60, 120
  active: boolean;
  fired: boolean;
  type: 'departure' | 'destination' | 'alarm' | 'custom';
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  category: 'Journey' | 'Train' | 'Destination' | 'Emergency' | 'System' | 'Reminder';
  timestamp: string;
  read: boolean;
}

export interface AppSettings {
  batterySaver: boolean;
  offlineMode: boolean;
  accessibleMode: boolean;
  accessibilityNeeds: ('wheelchair' | 'senior' | 'visual' | 'hearing')[];
  notificationsEnabled: boolean;
  locationSharing: boolean;
  soundEffects: boolean;
}

export interface JourneyFeedback {
  id: string;
  rating: number; // 1 to 5
  comment: string;
  trainNumber: string;
  journeyDate: string;
  createdAt: string;
}

