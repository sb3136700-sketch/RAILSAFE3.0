import { TravelNote } from '../types/railway';

const NOTES_KEY = 'tg_travel_notes_v1';

export const INITIAL_NOTES: TravelNote[] = [
  {
    id: 'note_1',
    title: 'Meet brother at platform exit',
    content: 'Brother Rahul will wait near Gate 3 auto stand at Varanasi Cantt. Bring Kanpur laddus.',
    category: 'Contact',
    date: '2026-09-24',
    trainNumber: '22436',
  },
  {
    id: 'note_2',
    title: 'Hotel Booking Confirmation',
    content: 'IRCTC Retiring Room Booking ID: RR-894102. Check-in after 2:30 PM.',
    category: 'Stay',
    date: '2026-09-24',
    trainNumber: '22436',
  },
];

export function getTravelNotes(): TravelNote[] {
  const saved = localStorage.getItem(NOTES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_NOTES;
    }
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
  return INITIAL_NOTES;
}

export function saveTravelNote(note: Omit<TravelNote, 'id' | 'date'> & { id?: string }): TravelNote[] {
  const current = getTravelNotes();
  if (note.id) {
    // Edit
    const updated = current.map((n) =>
      n.id === note.id ? { ...n, ...note, date: new Date().toISOString().split('T')[0] } : n
    );
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  } else {
    // Create new
    const newNote: TravelNote = {
      ...note,
      id: `note_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newNote, ...current];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  }
}

export function deleteTravelNote(id: string): TravelNote[] {
  const current = getTravelNotes();
  const updated = current.filter((n) => n.id !== id);
  localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  return updated;
}
