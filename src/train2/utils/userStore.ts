import { UserProfile, SupportedLanguage } from '../types/railway';

const STORAGE_KEY = 'tg_user_profile_v1';
const HISTORY_KEY = 'tg_journey_history_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_raja_1411',
  fullName: 'Raja Sabari',
  email: 'rajasabari1411@gmail.com',
  phone: '+91 98401 23456',
  preferredLanguage: 'en',
  emergencyContactName: 'Family Contact',
  emergencyContactPhone: '+91 94441 98765',
  preferredBerth: 'Side Lower',
  savedJourneys: [
    {
      id: 'j1',
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      fromStation: 'New Delhi (NDLS)',
      toStation: 'Varanasi Junction (BSB)',
      date: '2026-09-26',
      pnr: '8249102834',
    },
    {
      id: 'j2',
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani',
      fromStation: 'New Delhi (NDLS)',
      toStation: 'Mumbai Central (MMCT)',
      date: '2026-08-15',
      pnr: '4198273615',
    },
  ],
  historySearch: ['New Delhi to Varanasi', 'Chennai to Mysuru', 'Mumbai to Ahmedabad'],
};

export function getUserProfile(): UserProfile {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_USER;
    }
  }
  // Store default initially
  saveUserProfile(DEFAULT_USER);
  return DEFAULT_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function addJourneyToHistory(journey: {
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  date: string;
  pnr?: string;
}): UserProfile {
  const current = getUserProfile();
  const exists = current.savedJourneys.some(
    (j) => j.trainNumber === journey.trainNumber && j.date === journey.date
  );

  const updated: UserProfile = {
    ...current,
    savedJourneys: exists
      ? current.savedJourneys
      : [
          { id: `j_${Date.now()}`, ...journey },
          ...current.savedJourneys.slice(0, 19),
        ],
  };

  saveUserProfile(updated);
  return updated;
}
