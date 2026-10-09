export interface FavoriteTrain {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  savedAt: string;
}

const FAVORITES_KEY = 'tg_favorite_trains_v1';

export function getFavoriteTrains(): FavoriteTrain[] {
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  // Default favorite
  const initial = [
    {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      source: 'New Delhi (NDLS)',
      destination: 'Varanasi Junction (BSB)',
      savedAt: '2026-09-24',
    },
  ];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(initial));
  return initial;
}

export function isTrainFavorite(trainNumber: string): boolean {
  const favs = getFavoriteTrains();
  return favs.some((f) => f.trainNumber === trainNumber);
}

export function toggleFavoriteTrain(train: {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
}): boolean {
  const current = getFavoriteTrains();
  const exists = current.some((f) => f.trainNumber === train.trainNumber);

  let updated: FavoriteTrain[];
  if (exists) {
    updated = current.filter((f) => f.trainNumber !== train.trainNumber);
  } else {
    updated = [
      {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        source: train.source,
        destination: train.destination,
        savedAt: new Date().toISOString().split('T')[0],
      },
      ...current,
    ];
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

export function removeFavoriteTrain(trainNumber: string): FavoriteTrain[] {
  const current = getFavoriteTrains();
  const updated = current.filter((f) => f.trainNumber !== trainNumber);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
