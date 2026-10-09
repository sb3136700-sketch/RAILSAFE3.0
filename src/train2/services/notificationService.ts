import { SmartNotification } from '../types/railway';

const NOTIFICATIONS_KEY = 'tg_notifications_v1';

export const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif_1',
    title: 'Approaching Station Alert',
    message: 'Train 22436 is scheduled to arrive at Kanpur Central on Platform 1 in 15 mins.',
    category: 'Destination',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Platform Number Update',
    message: 'Kanpur Central: Platform 1 verified. Train halt duration is 2 minutes.',
    category: 'Train',
    timestamp: '25 mins ago',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Tatkal Booking Window Open',
    message: 'AC Tatkal window is active at 10:00 AM IST for tomorrow departures.',
    category: 'Reminder',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif_4',
    title: 'RailMadad Universal 139',
    message: 'Indian Railways universal helpline 139 is available 24/7 for onboard medical/security.',
    category: 'Emergency',
    timestamp: 'Yesterday',
    read: true,
  },
];

export function getSmartNotifications(): SmartNotification[] {
  const saved = localStorage.getItem(NOTIFICATIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
}

export function markNotificationRead(id: string): SmartNotification[] {
  const current = getSmartNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export function markAllNotificationsRead(): SmartNotification[] {
  const current = getSmartNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export function clearNotifications(): SmartNotification[] {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  return [];
}
