import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  Crown,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  FileCheck,
  Building,
  Sparkles,
  Scroll,
} from 'lucide-react';

export const PresidentGovernorDashboard = () => {
  const {
    bills,
    processPresidentialAssent,
    promulgateOrdinance,
    invokePresidentsRule,
    articles,
  } = useGame();

  const [ordinanceTitle, setOrdinanceTitle] = useState('');
  const [ordinanceCategory, setOrdinanceCategory] = useState('INFRASTRUCTURE');
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [actionMessage, setActionMessage] = useState('');

  // Filter bills waiting for Presidential Assent
  const pendingAssentBills = bills.filter(
    (b) => b.status === 'PRESIDENTIAL_ASSENT' || (b.status === 'RAJYA_SABHA_VOTE' && b.rajyaSabhaPassed)
  );

  const enactedBills = bills.filter((b) => b.status === 'ENACTED');

  const handleAssent = (billId, status) => {
    const res = processPresidentialAssent(billId, status);
    if (res && res.message) {
      setActionMessage(res.message);
    }
  };

  const handleIssueOrdinance = (e) => {
    e.preventDefault();
    if (!ordinanceTitle) return;
    const res = promulgateOrdinance(ordinanceTitle, ordinanceCategory);
    if (res && res.message) {
      setActionMessage(res.message);
      setOrdinanceTitle('');
    }
  };

  const handleImposePresidentsRule = () => {
    const res = invokePresidentsRule(selectedState);
    if (res && res.message) {
      setActionMessage(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rashtrapati Bhavan Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Rashtrapati Bhavan & Raj Bhavan</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                Head of State Sovereign Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Constitutional custodian for Presidential Assent (Article 111), Emergency Ordinances (Article 123), and State Governor Reports (Article 356).
            </p>
          </div>
        </div>

        {/* Quick Duty Pill */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shrink-0 flex items-center gap-4">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Assent Pending</div>
            <div className="text-lg font-black text-amber-400 font-mono">{pendingAssentBills.length} Bills</div>
          </div>
          <div className="text-center px-2 border-l border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Enacted Acts</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{enactedBills.length} Acts</div>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bills Pending Presidential Assent (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
              <Scroll className="w-5 h-5 text-amber-400" />
              Parliamentary Bills Awaiting Presidential Assent ({pendingAssentBills.length})
            </h3>
          </div>

          {pendingAssentBills.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
              <FileCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              No pending bills currently waiting for Presidential Assent. Bills passed by Lok Sabha & Rajya Sabha will arrive here for final seal and enactment.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAssentBills.map((bill) => (
                <div key={bill.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      BILL #{bill.id} • {bill.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Passed Both Houses</span>
                  </div>

                  <h4 className="font-extrabold text-base text-white">{bill.title}</h4>
                  <p className="text-xs text-slate-400">{bill.description}</p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => handleAssent(bill.id, 'APPROVED')}
                      className="w-full sm:flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Grant Presidential Assent (Enact Policy)
                    </button>

                    <button
                      onClick={() => handleAssent(bill.id, 'REJECTED')}
                      className="w-full sm:w-auto px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <XCircle className="w-4 h-4" /> Return to Parliament (Article 111)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Emergency Ordinances & Governor Desk (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Promulgate Emergency Ordinance (Article 123) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Promulgate Presidential Ordinance (Article 123)
            </h3>

            <form onSubmit={handleIssueOrdinance} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Ordinance Title:</label>
                <input
                  type="text"
                  placeholder="e.g. National Cyber Security Emergency Ordinance 2026"
                  value={ordinanceTitle}
                  onChange={(e) => setOrdinanceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Category Sector:</label>
                <select
                  value={ordinanceCategory}
                  onChange={(e) => setOrdinanceCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-bold p-2.5 rounded-xl text-xs focus:outline-none"
                >
                  <option value="INFRASTRUCTURE">Infrastructure & Energy</option>
                  <option value="AGRICULTURE">Agriculture & Farmer Relief</option>
                  <option value="WELFARE">Healthcare & Social Security</option>
                  <option value="CORRUPTION">Anti-Corruption Enforcement</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
              >
                <Scroll className="w-4 h-4" /> Promulgate Gazette Ordinance
              </button>
            </form>
          </div>

          {/* State Governor Raj Bhavan Desk (Article 356) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4 text-rose-400" />
              State Raj Bhavan • President's Rule (Article 356)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Select Target State:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-2.5 rounded-xl text-xs focus:outline-none"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleImposePresidentsRule}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-950/40 transition flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> Impose President's Rule in {selectedState}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
