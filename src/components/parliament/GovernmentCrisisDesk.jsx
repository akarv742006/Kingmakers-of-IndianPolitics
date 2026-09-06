import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { ShieldAlert, AlertTriangle, Sparkles, CheckCircle2, Flame, MapPin, ChevronRight } from 'lucide-react';

export const GovernmentCrisisDesk = () => {
  const { events, respondToCrisis, triggerEvent, selectedPartyId, governingPartyId, alliances, parties, publishNewsArticle } = useGame();

  const [oppActionMsg, setOppActionMsg] = React.useState('');

  const activeCrises = events.filter((e) => e.choices && e.choices.length > 0);
  const pendingCrisis = activeCrises.find((e) => e.status === 'PENDING_RESPONSE' || !e.status);

  // Determine if player party is in ruling government
  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const governingAlliance = alliances.find((a) => a.memberPartyIds.includes(governingPartyId));
  const isPlayerInGovt = selectedPartyId === governingPartyId || (governingAlliance && governingAlliance.memberPartyIds.includes(selectedPartyId));

  const handleOppositionProtest = (actionType) => {
    const pName = activeParty?.shortName || 'Opposition';
    if (actionType === 'HUNGER_STRIKE') {
      publishNewsArticle({
        headline: `🔥 OPPOSITION HUNGER STRIKE: ${pName} Leaders Launch Fast Unto Death over ${pendingCrisis?.title || 'National Crisis'}`,
        content: `Leaders of ${activeParty?.name} have begun a high-profile hunger strike demanding immediate government accountability and emergency relief. Public sympathy rises.`,
        author: 'NATIONAL PROTEST WIRE',
        bias: 'ANTI_GOVT',
      });
      setOppActionMsg(`🔥 Hunger Strike launched by ${pName}! News broadcasted across national networks.`);
    } else if (actionType === 'NATIONWIDE_BANDH') {
      publishNewsArticle({
        headline: `🚨 NATIONWIDE BANDH: ${pName} Calls 24-Hour General Strike`,
        content: `Commercial centers shut down across major cities as ${pName} cadres enforce a nationwide protest march. Government approval rating dropped by 4%.`,
        author: 'REPUBLIC MEDIA NETWORK',
        bias: 'ANTI_GOVT',
      });
      setOppActionMsg(`🚨 General Strike / Bandh enforced by ${pName}! Mass mobilization achieved.`);
    } else if (actionType === 'JUDICIAL_PROBE') {
      publishNewsArticle({
        headline: `⚖️ SUPREME COURT PETITION: Opposition Demands Judicial Probe into Government Response`,
        content: `${pName} legal cell files urgent writ petition seeking independent judicial inquiry commission into federal response handling.`,
        author: 'LEGAL CORRESPONDENT',
        bias: 'NEUTRAL',
      });
      setOppActionMsg(`⚖️ Supreme Court petition filed by ${pName} demanding independent inquiry commission.`);
    }
  };

  return (
    <div>
      {pendingCrisis ? (
        <div className="bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border-2 border-red-500/80 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
          {/* Emergency Alert Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 animate-pulse shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/30">
                    NATIONAL EMERGENCY RESPONSE REQUIRED
                  </span>
                  <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                    {pendingCrisis.severity || 'CRITICAL'}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white mt-1 font-display">{pendingCrisis.title}</h2>
              </div>
            </div>

            {pendingCrisis.affectedStates && pendingCrisis.affectedStates.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 self-start sm:self-auto">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Affected: <strong className="text-white">{pendingCrisis.affectedStates.join(', ')}</strong></span>
              </div>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            {pendingCrisis.description}
          </p>

          {oppActionMsg && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{oppActionMsg}</span>
            </div>
          )}

          {/* Opposition Action Desk when party is not in ruling govt */}
          {!isPlayerInGovt && (
            <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider flex items-center gap-2">
                  ⚔️ OPPOSITION PROTEST & DEMONSTRATION DESK:
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  {activeParty.shortName} OPPOSITION ROLE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your party is currently in Opposition. Mobilize mass protests, hunger strikes, or demand judicial action against the ruling government's handling of this event.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => handleOppositionProtest('HUNGER_STRIKE')}
                  className="px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-extrabold transition shadow flex items-center gap-1.5"
                >
                  🔥 Organize Hunger Strike / Fast Unto Death
                </button>
                <button
                  onClick={() => handleOppositionProtest('NATIONWIDE_BANDH')}
                  className="px-4 py-2.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-white text-xs font-extrabold transition shadow flex items-center gap-1.5"
                >
                  📢 Call General Bandh & Rally
                </button>
                <button
                  onClick={() => handleOppositionProtest('JUDICIAL_PROBE')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-extrabold transition shadow flex items-center gap-1.5"
                >
                  ⚖️ File Supreme Court Judicial Petition
                </button>
              </div>
            </div>
          )}

          {/* 3 Executive Choice Cards for Govt */}
          <div className="space-y-3">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 font-display">
              <ShieldAlert className="w-4 h-4" />
              Executive Policy Directives (Government Action):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingCrisis.choices?.map((choice) => (
                <div
                  key={choice.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/80 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-xs md:text-sm text-white group-hover:text-amber-400 transition font-display">
                      {choice.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">{choice.description}</p>
                  </div>

                  <div className="space-y-3 border-t border-slate-800 pt-3">
                    <div className="text-xs space-y-1 font-mono">
                      <div className="flex justify-between items-center text-amber-400 font-bold">
                        <span className="font-sans text-[11px] text-slate-400">Outlay:</span>
                        <span>₹{choice.costCrores} Cr</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-sans text-slate-400">Govt Approval:</span>
                        <span className={choice.approvalDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {choice.approvalDelta >= 0 ? `+${choice.approvalDelta}%` : `${choice.approvalDelta}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-sans text-slate-400">State Popularity:</span>
                        <span className={choice.statePopularityDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {choice.statePopularityDelta >= 0 ? `+${choice.statePopularityDelta}%` : `${choice.statePopularityDelta}%`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => respondToCrisis(pendingCrisis.id, choice.id)}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span>Authorize Choice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="game-card rounded-2xl px-4 py-3 flex items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-white">Disaster Management Command Center:</span>
            <span className="text-slate-400 hidden sm:inline">All regional crisis events handled. Engine on standby.</span>
          </div>

          <button
            onClick={triggerEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-800 font-extrabold text-xs rounded-xl transition shrink-0"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Simulate Crisis Event</span>
          </button>
        </div>
      )}
    </div>
  );
};
