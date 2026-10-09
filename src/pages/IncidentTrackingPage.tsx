import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { SafetyIncident, IncidentAuditLog } from '../types';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  User,
  ArrowRight,
  Radio,
  Lock,
  Sparkles,
} from 'lucide-react';

interface IncidentTrackingPageProps {
  initialReferenceId?: string;
}

export const IncidentTrackingPage: React.FC<IncidentTrackingPageProps> = ({ initialReferenceId }) => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);
  const [auditLogs, setAuditLogs] = useState<IncidentAuditLog[]>([]);
  const [lookupQuery, setLookupQuery] = useState(initialReferenceId || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserIncidents();
  }, [user]);

  const loadUserIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getIncidents(user.role, user.id);
      setIncidents(data);

      if (initialReferenceId) {
        const match = data.find((i) => i.referenceId === initialReferenceId || i.id === initialReferenceId);
        if (match) {
          handleSelectIncident(match);
        } else if (data.length > 0) {
          handleSelectIncident(data[0]);
        }
      } else if (data.length > 0) {
        handleSelectIncident(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIncident = async (incident: SafetyIncident) => {
    setSelectedIncident(incident);
    try {
      const details = await api.getIncidentById(incident.id);
      setAuditLogs(details.auditLogs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupQuery.trim().toLowerCase();
    const match = incidents.find(
      (i) => i.referenceId.toLowerCase().includes(query) || i.title.toLowerCase().includes(query)
    );
    if (match) {
      handleSelectIncident(match);
    } else {
      alert(`No incident found matching "${lookupQuery}" for this user.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">SUBMITTED</span>;
      case 'under_review':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-mono text-[10px]">UNDER REVIEW</span>;
      case 'assigned':
        return <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono text-[10px]">RPF ASSIGNED</span>;
      case 'in_progress':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono text-[10px]">IN PROGRESS</span>;
      case 'escalated':
        return <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono text-[10px] animate-pulse">ESCALATED</span>;
      case 'resolved':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono text-[10px]">RESOLVED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-wide">PASSENGER INCIDENT STATUS TRACKER</h1>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              RLS PROTECTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status progression, AI classification audit, and responder assignment notes.
          </p>
        </div>

        {/* Reference lookup bar */}
        <form onSubmit={handleSearchLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Search Reference ID (RS-2026-INC-...)"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono w-56 sm:w-64"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Reports List for Authenticated Passenger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              My Submitted Reports ({incidents.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Passenger: {user.name}</span>
          </div>

          {incidents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No incidents filed yet. Submit a report from the menu.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {incidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => handleSelectIncident(inc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">{inc.referenceId}</span>
                      {getStatusBadge(inc.status)}
                    </div>
                    <div className="text-xs font-bold text-slate-100 mt-1 truncate">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                      <span>Train: {inc.trainNumber || 'N/A'}</span>
                      <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Incident Comprehensive Tracker */}
        {selectedIncident ? (
          <div className="md:col-span-2 space-y-4">
            {/* Status lifecycle progression bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Case Lifecycle Status
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-lg font-black text-white">{selectedIncident.referenceId}</h3>
                    {getStatusBadge(selectedIncident.status)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  Reported: {new Date(selectedIncident.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Lifecycle Step Tracker */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { step: 'submitted', label: '1. Submitted' },
                  { step: 'under_review', label: '2. Under Review' },
                  { step: 'assigned', label: '3. RPF Assigned' },
                  { step: 'resolved', label: '4. Case Resolved' },
                ].map((s, idx) => {
                  const isDone =
                    selectedIncident.status === 'resolved' ||
                    (s.step === 'assigned' && ['assigned', 'in_progress', 'escalated'].includes(selectedIncident.status)) ||
                    (s.step === 'under_review' && ['under_review', 'assigned', 'in_progress', 'escalated'].includes(selectedIncident.status)) ||
                    s.step === 'submitted';

                  const isCurrent = selectedIncident.status === s.step;

                  return (
                    <div
                      key={s.step}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : isDone
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-850 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono leading-tight">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incident Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">{selectedIncident.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Train and Seat details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Train</span>
                  <div className="font-mono text-cyan-400 font-bold">{selectedIncident.trainNumber || 'N/A'}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Coach & Seat</span>
                  <div className="text-slate-200 font-medium">{selectedIncident.coach || 'N/A'} {selectedIncident.seat || ''}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Assigned Unit</span>
                  <div className="text-amber-300 font-medium truncate">{selectedIncident.assignedDepartment || 'Triage Control'}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Assigned Officer</span>
                  <div className="text-emerald-300 font-medium truncate">{selectedIncident.assignedResponderName || 'Pending Assignment'}</div>
                </div>
              </div>

              {/* AI Classification Insights */}
              {selectedIncident.aiClassification && (
                <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-indigo-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} /> Gemini Automated Analysis & Response Protocol
                    </span>
                    <span className="font-mono text-[10px]">Urgency: {selectedIncident.aiClassification.urgencyScore}/10</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed text-[11px]">
                    <strong>AI Recommended Protocol:</strong> {selectedIncident.aiClassification.recommendedAction}
                  </div>
                </div>
              )}

              {/* Operator Notes if present */}
              {selectedIncident.operatorNotes && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200">
                  <strong className="text-amber-400 block mb-1">Official Response Update:</strong>
                  {selectedIncident.operatorNotes}
                </div>
              )}
            </div>

            {/* Audit History Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                Immutable Audit History & Activity Log
              </h4>

              <div className="space-y-2.5 pt-2">
                {auditLogs.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2">No status updates logged yet.</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-400 font-mono text-[11px]">{log.action}</span>
                          <span className="text-slate-400 font-medium">• By {log.actorName} ({log.actorRole})</span>
                        </div>
                        {log.notes && <p className="text-slate-300 mt-1 text-[11px]">{log.notes}</p>}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            Select an incident from the list to inspect status progression and responder actions.
          </div>
        )}
      </div>
    </div>
  );
};
