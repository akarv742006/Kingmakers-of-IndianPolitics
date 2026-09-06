import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building,
  Bot,
  Sparkles,
} from 'lucide-react';

export const ECIDashboard = () => {
  const {
    customApplications,
    reviewCustomPartyApplication,
    electionPhase,
    currentPhaseNumber,
    advanceElectionPhase,
    announceGeneralElection,
    aiECIEnabled,
    setAiECIEnabled,
  } = useGame();

  const [commentsMap, setCommentsMap] = useState({});
  const [pressNotes, setPressNotes] = useState('');
  const [phaseCount, setPhaseCount] = useState(7);
  const [announcementSuccessMsg, setAnnouncementSuccessMsg] = useState('');

  const pendingApps = customApplications.filter((a) => a.status === 'PENDING');
  const processedApps = customApplications.filter((a) => a.status !== 'PENDING');

  const handleReview = (id, status) => {
    const comment = commentsMap[id] || (status === 'APPROVED' ? 'Satisfies statutory requirements under RPA 1951.' : 'Documentation incomplete or symbol conflicts with existing reserves.');
    reviewCustomPartyApplication(id, status, comment);
  };

  const handleAnnounceElection = (e) => {
    e.preventDefault();
    const result = announceGeneralElection({
      phases: phaseCount,
      notes: pressNotes.trim() || undefined,
    });
    if (result && result.message) {
      setAnnouncementSuccessMsg(result.message);
      setPressNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* ECI Top Command Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">Election Commission of India (ECI)</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                Nirvachan Sadan Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Statutory authority managing party registrations, Model Code of Conduct (MCC), and 543 Lok Sabha polls.
            </p>
          </div>
        </div>

        {/* Phase Controller & AI Auto-Pilot Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setAiECIEnabled(!aiECIEnabled)}
            className={`p-3.5 rounded-2xl border transition flex items-center gap-2.5 text-xs font-black ${
              aiECIEnabled
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className={`w-4 h-4 ${aiECIEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider">AI ECI Agent</div>
              <div>{aiECIEnabled ? '🤖 Auto-Pilot ACTIVE' : '👤 Manual Desk'}</div>
            </div>
          </button>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">Current Phase</div>
              <div className="text-sm font-extrabold text-white">
                {electionPhase === 'VOTING_PHASE' ? `Voting Phase ${currentPhaseNumber} of ${phaseCount}` : electionPhase.replace(/_/g, ' ')}
              </div>
            </div>
            <button
              onClick={advanceElectionPhase}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Advance Phase
            </button>
          </div>
        </div>
      </div>

      {/* 📢 ECI OFFICIAL PRESS CONFERENCE: ANNOUNCE 543 LOK SABHA ELECTION CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl animate-pulse">
              📢
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Official ECI Press Conference: Announce General Election
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-300">
                Article 324 Power: Announce 543 Lok Sabha Seat Elections, enforce Model Code of Conduct (MCC) nationwide, & schedule 7-phase polling across India.
              </p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-black border text-center ${
            electionPhase === 'PRE_ELECTION' 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {electionPhase === 'PRE_ELECTION' ? 'STATUS: PRE-ELECTION (READY TO ANNOUNCE)' : `MCC ACTIVE (${electionPhase.replace(/_/g, ' ')})`}
          </span>
        </div>

        {announcementSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-black text-white">General Election Officially Promulgated!</div>
              <div>{announcementSuccessMsg}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleAnnounceElection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Official ECI Gazette Announcement Statement & Schedule Notes:
              </label>
              <textarea
                rows={3}
                value={pressNotes}
                onChange={(e) => setPressNotes(e.target.value)}
                placeholder="e.g. Chief Election Commissioner declares 7-Phase Lok Sabha Polls across 543 Seats. Model Code of Conduct (MCC) comes into force immediately. Polling across 10.5 Lakh booths."
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-3.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Polling Phases:
              </label>
              <select
                value={phaseCount}
                onChange={(e) => setPhaseCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value={7}>7 Phases (National LS Polls)</option>
                <option value={5}>5 Phases</option>
                <option value={3}>3 Phases</option>
                <option value={1}>Single Phase Nationwide</option>
              </select>
              <div className="text-[10px] text-slate-400 mt-2">
                543 Lok Sabha Constituencies • 97 Crore Voters nationwide.
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span>📢 ANNOUNCE 543-SEAT LOK SABHA ELECTION & ENFORCE MCC NATIONWIDE</span>
          </button>
        </form>
      </div>

      {/* Custom Party Registration Approvals Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white">Party Registration Approval Queue</h3>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 font-mono font-bold px-2.5 py-1 rounded-lg">
            {pendingApps.length} Pending Application(s)
          </span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            No pending political party registration requests. New applications submitted by players will appear here for ECI review.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApps.map((app) => (
              <div key={app.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                      {app.symbol}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                        {app.partyName}
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                          {app.shortName}
                        </span>
                      </h4>
                      <div className="text-xs text-slate-400">
                        Applicant: <strong>{app.leaderName}</strong> • Ideology: <strong>{app.ideology}</strong> • Submitted: {app.submissionTimestamp}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 block mb-0.5">Proposed Manifesto & Objectives:</span>
                  {app.manifesto}
                </div>

                {/* Official ECI Verdict Input & Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Enter ECI official approval/rejection remarks..."
                    value={commentsMap[app.id] || ''}
                    onChange={(e) => setCommentsMap({ ...commentsMap, [app.id]: e.target.value })}
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleReview(app.id, 'APPROVED')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-900/30"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Grant Approval
                    </button>
                    <button
                      onClick={() => handleReview(app.id, 'REJECTED')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-red-900/30"
                    >
                      <XCircle className="w-4 h-4" /> Reject Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recently Processed Applications */}
        {processedApps.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Recently Reviewed Registrations</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {processedApps.map((app) => (
                <div key={app.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{app.symbol}</span>
                    <div>
                      <span className="font-bold text-white">{app.partyName} ({app.shortName})</span>
                      <div className="text-[10px] text-slate-400">ECI Note: {app.eciComments || 'Processed'}</div>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model Code of Conduct (MCC) Enforcement Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white">Model Code of Conduct (MCC) Compliance Monitor</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold">Rally Time Limits</span>
            <p className="text-white font-extrabold text-sm">10:00 PM Loudspeaker Cutoff</p>
            <p className="text-slate-400 text-[11px]">Strict enforcement across all 543 constituencies.</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold">Campaign Expenditure Limit</span>
            <p className="text-white font-extrabold text-sm">₹95 Lakh / Lok Sabha Seat</p>
            <p className="text-slate-400 text-[11px]">Monitored via candidate bank returns.</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold">Media Advertisement Freeze</span>
            <p className="text-white font-extrabold text-sm">48-Hour Pre-Poll Silence</p>
            <p className="text-slate-400 text-[11px]">Applies prior to each phase voting day.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
