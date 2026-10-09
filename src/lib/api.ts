import {
  SafetyIncident,
  SosEvent,
  TrainDetails,
  EmergencyContact,
  LostItemReport,
  IncidentAuditLog,
  SystemHealth,
} from '../types';

function getAuthHeaders(userRole: string = 'passenger', userId: string = 'usr-passenger-1', userName: string = 'Sameer Khan') {
  return {
    'Content-Type': 'application/json',
    'x-user-role': userRole,
    'x-user-id': userId,
    'x-user-name': userName,
  };
}

export const api = {
  // System Health
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // Trains
  async searchTrains(query: string = ''): Promise<TrainDetails[]> {
    const res = await fetch(`/api/trains/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search trains');
    return res.json();
  },

  async getTrainDetails(trainNumber: string): Promise<TrainDetails> {
    const res = await fetch(`/api/trains/track/${trainNumber}`);
    if (!res.ok) throw new Error(`Train ${trainNumber} not found`);
    return res.json();
  },

  // Incidents
  async getIncidents(userRole: string, userId: string): Promise<SafetyIncident[]> {
    const res = await fetch('/api/incidents', {
      headers: getAuthHeaders(userRole, userId),
    });
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getIncidentById(id: string): Promise<{ incident: SafetyIncident; auditLogs: IncidentAuditLog[] }> {
    const res = await fetch(`/api/incidents/${id}`);
    if (!res.ok) throw new Error('Incident not found');
    return res.json();
  },

  async submitIncident(data: Partial<SafetyIncident>, userRole: string, userId: string, userName: string): Promise<SafetyIncident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: getAuthHeaders(userRole, userId, userName),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit incident');
    return res.json();
  },

  async updateIncident(
    id: string,
    updates: Partial<SafetyIncident>,
    userRole: string,
    userId: string,
    userName: string
  ): Promise<SafetyIncident> {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(userRole, userId, userName),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return res.json();
  },

  // Advanced SOS
  async activateSos(data: {
    userId: string;
    passengerName: string;
    passengerPhone?: string;
    category?: string;
    message?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    trainNumber?: string;
    coachSeat?: string;
  }): Promise<{ sosEvent: SosEvent; liveTrackingUrl: string; smsResult: any; smsPrefilledText: string }> {
    const res = await fetch('/api/sos/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to activate SOS');
    return res.json();
  },

  async updateSosLocation(sosId: string, latitude: number, longitude: number, accuracy?: number) {
    const res = await fetch(`/api/sos/${sosId}/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude, accuracy }),
    });
    return res.json();
  },

  async resolveSos(sosId: string): Promise<{ success: boolean; event: SosEvent }> {
    const res = await fetch(`/api/sos/${sosId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to resolve SOS');
    return res.json();
  },

  async getPublicLiveSos(token: string) {
    const res = await fetch(`/api/sos/live/${token}`);
    if (!res.ok) {
      if (res.status === 410) throw new Error('Tracking link expired');
      throw new Error('Tracking link not found');
    }
    return res.json();
  },

  // Emergency Contacts
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    const res = await fetch('/api/emergency-contacts', {
      headers: getAuthHeaders('passenger', userId),
    });
    if (!res.ok) throw new Error('Failed to fetch emergency contacts');
    return res.json();
  },

  async addEmergencyContact(contact: Partial<EmergencyContact>, userId: string): Promise<EmergencyContact> {
    const res = await fetch('/api/emergency-contacts', {
      method: 'POST',
      headers: getAuthHeaders('passenger', userId),
      body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to add contact');
    return res.json();
  },

  async deleteEmergencyContact(id: string, userId: string) {
    const res = await fetch(`/api/emergency-contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders('passenger', userId),
    });
    return res.json();
  },

  async testEmergencyContact(id: string, userId: string) {
    const res = await fetch(`/api/emergency-contacts/${id}/test`, {
      method: 'POST',
      headers: getAuthHeaders('passenger', userId),
    });
    return res.json();
  },

  // AI Assistant
  async askAiAssistant(prompt: string, conversation: any[] = [], language: string = 'en'): Promise<string> {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, conversation, language }),
    });
    if (!res.ok) throw new Error('Failed to call AI assistant');
    const data = await res.json();
    return data.reply;
  },

  // Lost & Found
  async getLostItems(): Promise<LostItemReport[]> {
    const res = await fetch('/api/lost-items');
    if (!res.ok) throw new Error('Failed to fetch lost items');
    return res.json();
  },

  async reportLostItem(data: any): Promise<LostItemReport> {
    const res = await fetch('/api/lost-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit lost item report');
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(): Promise<IncidentAuditLog[]> {
    const res = await fetch('/api/security/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },
};
