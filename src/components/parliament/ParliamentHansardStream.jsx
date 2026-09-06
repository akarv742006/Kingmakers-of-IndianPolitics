import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  MessageSquare,
  Send,
  Award,
  Vote,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  Hand
} from 'lucide-react';

export const ParliamentHansardStream = () => {
  const {
    userHandle,
    role,
    parties,
    selectedPartyId,
    speakerDetails,
    speakerElection,
    hansardFloorMessages,
    grantedSpeakingHandles,
    speakingRequests,
    requestFloorSpeakingPermission,
    grantFloorSpeakingPermission,
    postHansardFloorMessage,
    castVoteInSpeakerElection,
  } = useGame();

  const [speechText, setSpeechText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const isSpeakerUser = role === 'speaker' || userHandle === speakerDetails.handle;
  const isPermissionGranted = grantedSpeakingHandles.includes(userHandle) || isSpeakerUser;

  const handlePostSpeech = (e) => {
    e.preventDefault();
    if (!speechText.trim()) return;

    const res = postHansardFloorMessage(speechText.trim());
    if (res && res.message) setStatusMsg(res.message);

    if (res && res.success) {
      setSpeechText('');
    }
  };

  const handleRequestPermission = () => {
    const res = requestFloorSpeakingPermission(userHandle);
    if (res && res.message) setStatusMsg(res.message);
  };

  const handleVoteSpeaker = (candidateId) => {
    const res = castVoteInSpeakerElection(candidateId);
    if (res && res.message) setStatusMsg(res.message);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Speaker Information & 24-Hour Election Ballot Banner */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl font-bold shrink-0">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  CONSTITUTIONAL CHAIR
                </span>
                <span className="text-xs text-slate-400 font-mono">543 MP House Presiding Officer</span>
              </div>
              <h3 className="text-lg font-black text-white font-display mt-0.5">
                Lok Sabha Speaker Chair: {speakerDetails.name} ({speakerDetails.partyShort})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-bold">24H SPEAKER ELECTION</div>
              <div className="text-amber-400 font-black flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 animate-pulse" /> 24h Window Active
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Speaker Election Candidates Grid */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Vote className="w-4 h-4" /> 24-Hour Speaker Election Ballot (Cast Vote Below):
            </span>
            <span className="text-[11px] text-slate-400 font-mono">All 543 MPs & Players Can Vote</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {speakerElection.candidates.map((cand) => {
              const hasVoted = speakerElection.playerVotes[userHandle] === cand.id;
              return (
                <div
                  key={cand.id}
                  className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-amber-500/40 transition"
                >
                  <div>
                    <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <span>{cand.name}</span>
                      <span className="text-xs px-2 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                        {cand.partyShort}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Current Votes: <strong className="text-emerald-400 font-bold">{cand.votes} MPs</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVoteSpeaker(cand.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                      hasVoted
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md'
                    }`}
                  >
                    {hasVoted ? 'Voted ✅' : 'Vote Speaker 🗳️'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="text-slate-400 hover:text-white font-mono text-[10px] underline">
            DISMISS
          </button>
        </div>
      )}

      {/* Speaker Permission & Floor Message Controls */}
      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Parliament Floor Hansard Address Stream</h4>
              <p className="text-[11px] text-slate-400">Official transcript recorded in Lok Sabha Hansard records.</p>
            </div>
          </div>

          {/* Speaker Permission Status Indicator */}
          <div className="flex items-center gap-2">
            {isPermissionGranted ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Speaker Permission Granted
              </span>
            ) : (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-black text-xs rounded-xl border border-amber-500/40 transition flex items-center gap-1.5"
              >
                <Hand className="w-4 h-4" /> 🖐️ Request Speaker Permission
              </button>
            )}
          </div>
        </div>

        {/* Pending Speaking Requests (Visible to Speaker Chair) */}
        {isSpeakerUser && speakingRequests.length > 0 && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase font-mono">
              Pending Speaking Requests for Speaker Chair ({speakerDetails.name}):
            </div>
            <div className="flex flex-wrap gap-2">
              {speakingRequests.map((reqHandle) => (
                <div key={reqHandle} className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-white font-mono">{reqHandle}</span>
                  <button
                    onClick={() => grantFloorSpeakingPermission(reqHandle, true)}
                    className="px-2 py-0.5 bg-emerald-600 text-white font-black rounded text-[10px]"
                  >
                    Grant ✅
                  </button>
                  <button
                    onClick={() => grantFloorSpeakingPermission(reqHandle, false)}
                    className="px-2 py-0.5 bg-red-600 text-white font-black rounded text-[10px]"
                  >
                    Deny 🚫
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parliamentary Hansard Live Stream */}
        <div className="max-h-64 overflow-y-auto space-y-3 p-3 bg-slate-900/60 rounded-2xl border border-slate-800 custom-scrollbar">
          {hansardFloorMessages.map((msg) => (
            <div key={msg.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <strong className="text-amber-300 font-bold">{msg.sender}</strong>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-black text-[10px]">
                    {msg.partyShort}
                  </span>
                  {msg.isOfficialSpeech && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                      SPEAKER STATEMENT
                    </span>
                  )}
                </div>
                <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handlePostSpeech} className="flex items-center gap-2">
          <input
            type="text"
            value={speechText}
            onChange={(e) => setSpeechText(e.target.value)}
            disabled={!isPermissionGranted}
            placeholder={
              isPermissionGranted
                ? `Deliver parliamentary floor speech as ${userHandle}...`
                : `Speaker Permission Required to post speech. Click 'Request Speaker Permission' above.`
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isPermissionGranted}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <span>SPEAK</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
