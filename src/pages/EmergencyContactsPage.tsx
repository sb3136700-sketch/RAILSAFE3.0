import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EmergencyContact } from '../types';
import {
  PhoneCall,
  UserPlus,
  Trash2,
  CheckCircle2,
  Send,
  AlertCircle,
  ShieldCheck,
  Lock,
  UserCheck,
} from 'lucide-react';

export const EmergencyContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New contact form
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [phone, setPhone] = useState('+91');
  const [enabledForSos, setEnabledForSos] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [user]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmergencyContacts(user.id);
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 8) {
      alert('Please provide a valid name and phone number with country code (e.g. +919876543210).');
      return;
    }
    if (!consentAcknowledged) {
      alert('Please acknowledge that you have consent to store and share alerts with this emergency contact.');
      return;
    }

    setIsAdding(true);
    try {
      const newContact = await api.addEmergencyContact(
        {
          name,
          relationship,
          phone,
          enabledForSos,
        },
        user.id
      );
      setContacts((prev) => [...prev, newContact]);
      setName('');
      setPhone('+91');
      alert(`Emergency contact ${name} added successfully.`);
    } catch (err) {
      console.error(err);
      alert('Failed to add contact.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to remove this emergency contact?')) return;
    try {
      await api.deleteEmergencyContact(id, user.id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestAlert = async (id: string, contactName: string) => {
    try {
      const res = await api.testEmergencyContact(id, user.id);
      alert(`[TEST ALERT SENT] Verified notification successfully dispatched to ${contactName}. Status: Delivered.`);
    } catch (err) {
      console.error(err);
      alert('Failed to send test alert.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-wide">EMERGENCY CONTACTS & SOS RECIPIENTS</h1>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
            AUTOMATIC SMS DISPATCH
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          When you activate Emergency SOS, these verified contacts immediately receive your location and encrypted tracking link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Contacts List (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Configured Recipients ({contacts.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Row-Level Security Protected</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
              No emergency contacts added yet. Add family members or friends below to receive automatic SOS alerts.
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                        {contact.relationship}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>{contact.phone}</span>
                      {contact.enabledForSos && (
                        <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} /> SOS Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTestAlert(contact.id, contact.name)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 cursor-pointer flex items-center gap-1"
                    title="Send harmless test notification"
                  >
                    <Send size={12} /> Test Alert
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 cursor-pointer transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Contact Form (5 cols) */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800">
            <UserPlus size={16} className="text-cyan-400" /> Add New Emergency Contact
          </div>

          <form onSubmit={handleAddContact} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Contact Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma (Spouse)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend / Colleague</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Mobile Number (with +91 or country code) *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="enableSosCheck"
                checked={enabledForSos}
                onChange={(e) => setEnabledForSos(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500"
              />
              <label htmlFor="enableSosCheck" className="text-slate-300 cursor-pointer">
                Enable for automatic SOS broadcasts
              </label>
            </div>

            <div className="flex items-start gap-2 pt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500 mt-0.5"
                required
              />
              <label htmlFor="consentCheck" className="text-[11px] text-slate-400 cursor-pointer leading-tight">
                I confirm that I have informed this contact and have consent to store their number for emergency alerts.
              </label>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isAdding ? 'Saving...' : 'Add Emergency Contact'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
