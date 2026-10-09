import { SavedPlace } from '../types/railway';

const SAVED_PLACES_KEY = 'tg_saved_places_v1';

export const INITIAL_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'sp_1',
    name: 'IRCTC Executive Lounge & Retiring Rooms',
    type: 'Hotel',
    stationCode: 'CNB',
    city: 'Kanpur',
    url: 'https://www.rr.irctc.co.in/',
    savedAt: '2026-09-24',
    notes: 'Platform 1 air-conditioned luxury lounge with recliners and shower facility',
  },
  {
    id: 'sp_2',
    name: 'Thaggu Ke Laddu Concourse Stall',
    type: 'Restaurant',
    stationCode: 'CNB',
    city: 'Kanpur',
    url: 'https://www.google.com/maps/search/Thaggu+Ke+Laddu+Kanpur+Central',
    savedAt: '2026-09-24',
    notes: 'Legendary pure mawa laddus during train halt',
  },
];

export function getSavedPlaces(): SavedPlace[] {
  const saved = localStorage.getItem(SAVED_PLACES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_SAVED_PLACES;
    }
  }
  localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(INITIAL_SAVED_PLACES));
  return INITIAL_SAVED_PLACES;
}

export function savePlace(place: Omit<SavedPlace, 'id' | 'savedAt'>): SavedPlace[] {
  const current = getSavedPlaces();
  const exists = current.some((p) => p.name === place.name && p.stationCode === place.stationCode);
  if (exists) return current;

  const newPlace: SavedPlace = {
    ...place,
    id: `place_${Date.now()}`,
    savedAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newPlace, ...current];
  localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
  return updated;
}

export function removeSavedPlace(id: string): SavedPlace[] {
  const current = getSavedPlaces();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
  return updated;
}
