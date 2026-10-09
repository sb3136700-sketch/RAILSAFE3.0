export type UserRole = 'passenger' | 'operator' | 'responder';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  badgeNumber?: string; // for operator/responder
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  isVerified: boolean;
  enabledForSos: boolean;
  createdAt: string;
}

export type IncidentCategory =
  | 'harassment'
  | 'theft'
  | 'suspicious_activity'
  | 'medical'
  | 'overcrowding'
  | 'facility_damage'
  | 'accessibility'
  | 'lost_property'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'escalated'
  | 'resolved';

export interface AiClassification {
  category: IncidentCategory;
  severity: IncidentSeverity;
  urgencyScore: number; // 1 - 10
  summary: string;
  recommendedAction: string;
  suggestedDepartment: string;
  keywords: string[];
  isAiGenerated: boolean;
  confidence: number;
}

export interface SafetyIncident {
  id: string;
  referenceId: string; // e.g. RS-2026-INC-8120
  userId: string;
  reporterName: string;
  reporterPhone?: string;
  category: IncidentCategory;
  title: string;
  description: string;
  trainNumber?: string;
  trainName?: string;
  coach?: string;
  seat?: string;
  station?: string;
  latitude?: number;
  longitude?: number;
  severity: IncidentSeverity;
  status: IncidentStatus;
  aiClassification?: AiClassification;
  operatorNotes?: string;
  assignedResponder?: string;
  assignedResponderName?: string;
  assignedDepartment?: string;
  isEscalated: boolean;
  escalationReason?: string;
  evidenceUrls?: string[];
  contactPreference: 'call' | 'sms' | 'in_app';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface IncidentAuditLog {
  id: string;
  incidentId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  timestamp: string;
}

export interface SosEvent {
  id: string;
  referenceId: string; // e.g. RS-SOS-9912
  userId: string;
  passengerName: string;
  passengerPhone?: string;
  category: string;
  message?: string;
  status: 'active' | 'resolved' | 'cancelled';
  initialLatitude?: number;
  initialLongitude?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  locationAccuracy?: number;
  locationUpdatedAt?: string;
  trainNumber?: string;
  coachSeat?: string;
  shareToken: string; // unguessable tracking token
  shareExpiresAt: string;
  smsDeliveryStatus: 'queued' | 'sent' | 'delivered' | 'failed' | 'fallback_opened' | 'manual_fallback';
  smsRecipientsCount: number;
  providerMessageId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SosLocationUpdate {
  id: string;
  sosEventId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface TrainStationStop {
  code: string;
  name: string;
  platform?: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  delayMinutes: number;
  distanceKm: number;
  isCompleted: boolean;
  isCurrent: boolean;
  lat: number;
  lng: number;
}

export interface TrainDetails {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  sourceCode: string;
  destinationCode: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  delayMinutes: number;
  status: 'on_time' | 'delayed' | 'halted' | 'arriving';
  lastUpdated: string;
  dataSource: 'live_railradar' | 'demo_simulated' | 'unavailable';
  isDemoData: boolean;
  stations: TrainStationStop[];
  totalDistanceKm: number;
}

export interface SavedJourney {
  id: string;
  userId: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  pnr?: string;
  coach?: string;
  seat?: string;
  status: string;
  createdAt: string;
}

export interface LostItemReport {
  id: string;
  referenceId: string;
  userId: string;
  reporterName: string;
  itemType: string;
  description: string;
  color?: string;
  trainNumber?: string;
  stationOrCoach?: string;
  lossDate: string;
  status: 'reported' | 'matched' | 'claimed' | 'closed';
  matchScore?: number;
  matchedFoundItemId?: string;
  createdAt: string;
}

export interface NearbyFacility {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'railway_police' | 'pharmacy' | 'clinic';
  distanceKm: number;
  address: string;
  phone: string;
  emergencyNumber: string;
  lat: number;
  lng: number;
  isOpen24Hours: boolean;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded';
  timestamp: string;
  services: {
    database: { status: 'connected' | 'fallback_mode'; latencyMs: number };
    geminiAi: { status: 'connected' | 'unconfigured'; model: string };
    railwayApi: { status: 'connected' | 'demo_mode'; provider: string };
    smsProvider: { status: 'configured' | 'demo_mock'; provider: string };
    auth: { status: 'active'; mode: string };
  };
}
