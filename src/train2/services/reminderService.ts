import { JourneyReminder } from '../types/railway';

const REMINDERS_KEY = 'tg_journey_reminders_v1';

export const INITIAL_REMINDERS: JourneyReminder[] = [
  {
    id: 'rem_1',
    title: 'Train Departure in 1 hour',
    trainNumber: '22436',
    departureTime: '06:00 AM',
    offsetMinutes: 60,
    active: true,
    fired: false,
    type: 'departure',
  },
];

export function getJourneyReminders(): JourneyReminder[] {
  const saved = localStorage.getItem(REMINDERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_REMINDERS;
    }
  }
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(INITIAL_REMINDERS));
  return INITIAL_REMINDERS;
}

export function saveJourneyReminder(reminder: Omit<JourneyReminder, 'id' | 'fired'>): JourneyReminder[] {
  const current = getJourneyReminders();
  const newRem: JourneyReminder = {
    ...reminder,
    id: `rem_${Date.now()}`,
    fired: false,
  };
  const updated = [newRem, ...current];
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
}

export function toggleJourneyReminder(id: string): JourneyReminder[] {
  const current = getJourneyReminders();
  const updated = current.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteJourneyReminder(id: string): JourneyReminder[] {
  const current = getJourneyReminders();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Requests browser notification permission ONLY when user triggers an alert/reminder action.
 * Never called on page load.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const res = await Notification.requestPermission();
    return res === 'granted';
  }
  return false;
}

export function triggerSystemNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch {
      // fallback
    }
  }
}
