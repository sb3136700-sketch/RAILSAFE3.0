import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { SafetyIncident, IncidentAuditLog, IncidentStatus, IncidentSeverity } from '../types';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Sparkles,
  ArrowRight,
  Send,
  RefreshCw,
  PhoneCall,
  Lock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isOperatorOrResponder, switchRole, openAuthModal } = useAuth();
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);
  const [auditLogs, setAuditLogs] = useState<IncidentAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Triage Action form
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>('assigned');
  const [assignedResponder, setAssignedResponder] = useState<string>('usr-responder-1');
  const [assignedResponderName, setAssignedResponderName] = useState<string>('SI Vikram Singh (RPF)');
  const [assignedDepartment, setAssignedDepartment] = useState<string>('Railway Protection Force (RPF)');
  const [operatorNotes, setOperatorNotes] = useState<string>('');
  const [isEscalated, setIsEscalated] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    loadAllIncidents();
  }, [user]);

  const loadAllIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getIncidents(user.role, user.id);
      setIncidents(data);
      if (data.length > 0 && !selectedIncident) {
        handleSelectIncident(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIncident = async (inc: SafetyIncident) => {
    setSelectedIncident(inc);
    setTargetStatus(inc.status);
    setOperatorNotes(inc.operatorNotes || '');
    setIsEscalated(inc.isEscalated);
    if (inc.assignedResponderName) {
      setAssignedResponderName(inc.assignedResponderName);
    }
    if (inc.assignedDepartment) {
      setAssignedDepartment(inc.assignedDepartment);
    }

    try {
      const details = await api.getIncidentById(inc.id);
      setAuditLogs(details.auditLogs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    setIsSaving(true);
    try {
      const updated = await api.updateIncident(
        selectedIncident.id,
        {
          status: targetStatus,
          assignedResponder,
          assignedResponderName,
          assignedDepartment,
          operatorNotes,
          isEscalated,
          escalationReason: isEscalated ? 'Escalated by Central Triage Controller' : undefined,
        },
        user.role,
        user.id,
        user.name
      );

      setSelectedIncident(updated);
      setIncidents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

      // Reload audit history
      const details = await api.getIncidentById(updated.id);
      setAuditLogs(details.auditLogs || []);
      alert(`Case ${updated.referenceId} updated to ${updated.status.toUpperCase()} and logged to audit trail.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update incident.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        inc.referenceId.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        (inc.trainNumber && inc.trainNumber.toLowerCase().includes(q)) ||
        inc.reporterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate real metrics
  const totalReports = incidents.length;
  const unresolvedReports = incidents.filter((i) => i.status !== 'resolved').length;
  const criticalCount = incidents.filter((i) => i.severity === 'critical' || i.severity === 'high').length;
  const escalatedCount = incidents.filter((i) => i.isEscalated).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-wide">RAILWAY SAFETY OPERATIONS HUB</h1>
            <span className="text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
              CENTRAL CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident triage, Gemini AI risk classification review, responder dispatch, and audit logging.
          </p>
        </div>

        {/* User Role status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isOperatorOrResponder ? (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl px-3 py-2 text-xs flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold">Passenger Access Mode:</span>
              <button
                onClick={() => switchRole('operator')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[11px] cursor-pointer"
              >
                Test Operator Role (Aditi)
              </button>
              <button
                onClick={openAuthModal}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer"
              >
                Sign In with Supabase
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <div>
                <span className="font-bold text-white font-mono">{user.name}</span>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">{user.role} • {user.badgeNumber || 'AUTH'}</span>
              </div>
            </div>
          )}

          <button
            onClick={loadAllIncidents}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reports</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalReports}</div>
          <div className="text-[10px] text-slate-500 mt-1">Database Records</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unresolved Cases</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{unresolvedReports}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Pending Resolution</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical / High Risk</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{criticalCount}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">Immediate Action Required</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Escalations</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{escalatedCount}</div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Automated & Manual Rules</div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-48">
            <Search className="absolute left-2.5 top-2 text-slate-500" size={14} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search reference, train, passenger..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredIncidents.length} of {incidents.length} incidents
        </span>
      </div>

      {/* Main Grid: Incident Queue + Detailed Triage Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Incidents Triage Queue (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 max-h-[640px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 flex items-center justify-between">
            <span>Incident Queue</span>
            <span className="text-[10px] font-mono text-cyan-400">SELECT TO TRIAGE</span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching safety reports found.
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCrit = inc.severity === 'critical' || inc.severity === 'high';
              return (
                <button
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-lg'
                      : isCrit
                      ? 'bg-slate-950/70 border-rose-900/40 text-slate-200 hover:bg-slate-850'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-cyan-400">{inc.referenceId}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        inc.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : inc.severity === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded uppercase">
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-100 mt-1.5 line-clamp-1">{inc.title}</div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>Train: {inc.trainNumber || 'N/A'} ({inc.coach || 'Coach ?'})</span>
                    <span className="text-slate-500">{new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {inc.isEscalated && (
                    <div className="mt-1.5 text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                      <AlertTriangle size={11} /> ESCALATED CASE
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Case Review, AI Analysis & Triage Form (7 cols) */}
        {selectedIncident ? (
          <div className="lg:col-span-7 space-y-4">
            {/* Incident Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedIncident.title}</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{selectedIncident.referenceId}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Reported by <strong className="text-slate-200">{selectedIncident.reporterName}</strong> ({selectedIncident.reporterPhone || 'No Phone'})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">
                    {new Date(selectedIncident.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs text-slate-200 leading-relaxed">
                {selectedIncident.description}
              </div>

              {/* Location & Berth */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Train</span>
                  <div className="text-cyan-400 font-mono font-bold">{selectedIncident.trainNumber || 'N/A'}</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Coach & Seat</span>
                  <div className="text-slate-200 font-medium">{selectedIncident.coach || 'N/A'} {selectedIncident.seat || ''}</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Nearest Station</span>
                  <div className="text-slate-200 truncate">{selectedIncident.station || 'In transit'}</div>
                </div>
              </div>
            </div>

            {/* AI Recommendations vs Human Review (Crucial for Hackathon Step 4 & 5) */}
            {selectedIncident.aiClassification && (
              <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between text-indigo-300">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles size={15} className="text-indigo-400" />
                    Gemini 3.8 AI Recommendation (Human Review Required)
                  </span>
                  <span className="text-[10px] bg-indigo-900/80 px-2 py-0.5 rounded font-mono">
                    Urgency Rating: {selectedIncident.aiClassification.urgencyScore} / 10
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-indigo-900/40">
                  <strong className="text-indigo-300 block mb-1">Recommended Response Protocol:</strong>
                  {selectedIncident.aiClassification.recommendedAction}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Suggested Department: <strong className="text-amber-300">{selectedIncident.aiClassification.suggestedDepartment}</strong></span>
                  <span>Safety Policy: Non-autonomous (Human Confirmed)</span>
                </div>
              </div>
            )}

            {/* Operator Triage & Assignment Form */}
            <form onSubmit={handleSaveTriage} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>Authorized Operator Case Action & Assignment</span>
                <span className="text-[10px] font-mono text-cyan-400">AUDIT LOG RECORDED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Case Status</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IncidentStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="under_review">Under Review</option>
                    <option value="assigned">Assigned to Field Unit</option>
                    <option value="in_progress">In Progress (Unit Onboard)</option>
                    <option value="escalated">Escalated to Division Superintendent</option>
                    <option value="resolved">Resolved & Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Assign Responder Officer</label>
                  <select
                    value={assignedResponderName}
                    onChange={(e) => {
                      setAssignedResponderName(e.target.value);
                      if (e.target.value.includes('RPF')) {
                        setAssignedDepartment('Railway Protection Force (RPF)');
                      } else if (e.target.value.includes('Medical')) {
                        setAssignedDepartment('Railway Medical Emergency Team');
                      } else {
                        setAssignedDepartment('Commercial & Ticket Control (TTE)');
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SI Vikram Singh (RPF)">SI Vikram Singh (RPF - Bhopal Div)</option>
                    <option value="Lady Constable Sneha (RPF)">Lady Constable Sneha (RPF Women Cell)</option>
                    <option value="Dr. Anand (Railway Medical)">Dr. Anand (Railway Medical Standby)</option>
                    <option value="TTE Rajesh Sharma (Coach In-Charge)">TTE Rajesh Sharma (Coach In-Charge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Operator Directives & Notes</label>
                <input
                  type="text"
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder="e.g. Officer Vikram Singh dispatched to platform 2 to board train at next halt."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  id="escalateToggle"
                  checked={isEscalated}
                  onChange={(e) => setIsEscalated(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-red-500"
                />
                <label htmlFor="escalateToggle" className="text-slate-300 font-medium cursor-pointer">
                  Flag as Priority Escalation (Sends urgent notification to division controller)
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {isSaving ? 'UPDATING CASE & WRITING AUDIT LOG...' : 'COMMIT TRIAGE UPDATE & RECORD TO AUDIT'}
              </button>
            </form>

            {/* Audit Trail for this Case */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock size={13} className="text-cyan-400" />
                Case Audit Trail ({auditLogs.length} Events)
              </h4>
              <div className="space-y-1.5 pt-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[11px] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-cyan-400 font-mono">{log.action}</span>
                      <span className="text-slate-400 ml-2">by {log.actorName}</span>
                      {log.notes && <div className="text-slate-300 mt-0.5">{log.notes}</div>}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
            Select an incident from the queue to start triage and assign responders.
          </div>
        )}
      </div>
    </div>
  );
};
