import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { PRESET_BILL_TEMPLATES } from '../../data/billTemplates.js';
import {
  PlusCircle,
  CheckCircle,
  XCircle,
  Vote,
  Building2,
  Sparkles,
  X,
  ShieldAlert,
  Flame,
  Award,
  ChevronRight,
  AlertTriangle,
  FileCheck,
  TrendingDown,
  UserCheck,
  Zap,
  Clock,
} from 'lucide-react';

import { getQualitativeIndicator } from '../../utils/indicators.js';

const BILL_STAGES = [
  { id: 'DRAFT', label: 'Draft', icon: '📝' },
  { id: 'INTRODUCED', label: 'Introduced', icon: '📜' },
  { id: 'DEBATE', label: 'Debate', icon: '🗣️' },
  { id: 'COMMITTEE', label: 'Committee', icon: '🔍' },
  { id: 'LOK_SABHA_VOTE', label: 'Lok Sabha Vote', icon: '🗳️' },
  { id: 'RAJYA_SABHA_VOTE', label: 'Rajya Sabha', icon: '🏛️' },
  { id: 'PRESIDENTIAL_ASSENT', label: 'Presidential Assent', icon: '✒️' },
  { id: 'ENACTED', label: 'Enacted Law', icon: '⚖️' },
];

export const LegislativeBillsPanel = () => {
  const {
    selectedPartyId,
    userHandle,
    parties,
    seats,
    bills,
    proposeBill,
    advanceBillStage,
    issuePartyWhip,
    processPresidentialAssent,
    certifyMoneyBill,
    moveSpecialParliamentaryMotion,
    voteAndProcessBill,
    governingPartyId,
  } = useGame();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('MP');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposeType, setProposeType] = useState('BILL'); // 'BILL' or 'CUSTOM_SCHEME'
  const [votingBill, setVotingBill] = useState(null);
  const [selectedPlayerVote, setSelectedPlayerVote] = useState('YES');
  const [whipDirection, setWhipDirection] = useState('YES');
  const [whipStrictness, setWhipStrictness] = useState('THREE_LINE');

  // Custom/Preset Bill Form State
  const [billTitle, setBillTitle] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [billCategory, setBillCategory] = useState('ECONOMIC');
  const [billType, setBillType] = useState('ORDINARY');
  const [selectedTargetStates, setSelectedTargetStates] = useState([]);
  const [effects, setEffects] = useState({
    economy: 20,
    employment: 20,
    healthcare: 15,
    education: 15,
    agriculture: 15,
    infrastructure: 20,
    environment: 0,
    treasuryCostCrores: 5000,
    publicSentimentIndex: 30,
  });

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const activePC = activeParty.politicalCapital ?? 100;
  const isGovt = selectedPartyId === governingPartyId;

  // Filter bills
  const filteredBills = bills.filter((b) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'QUEUE') return b.status !== 'ENACTED' && b.status !== 'FAILED' && b.status !== 'REJECTED';
    if (activeFilter === 'HISTORY') return b.status === 'ENACTED' || b.status === 'FAILED' || b.status === 'REJECTED';
    if (activeFilter === 'ENACTED') return b.status === 'ENACTED';
    if (activeFilter === 'FAILED') return b.status === 'FAILED' || b.status === 'REJECTED';
    return true;
  });

  // Unique states for target state picker
  const statesList = Array.from(new Set(seats.map((s) => s.state))).sort();

  // Load preset template
  const handleSelectTemplate = (templateId) => {
    const tmpl = PRESET_BILL_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setBillTitle(tmpl.title);
      setBillDescription(tmpl.description);
      setBillCategory(tmpl.category);
      setBillType(tmpl.billType || 'ORDINARY');
      setEffects(tmpl.effects);
      setSelectedTargetStates(tmpl.targetStates || []);
    }
  };

  const handleProposeSubmit = (e) => {
    e.preventDefault();
    if (!billTitle || !billDescription) return;

    proposeBill({
      title: proposeType === 'CUSTOM_SCHEME' ? `🚀 ${billTitle}` : billTitle,
      description: billDescription,
      category: billCategory,
      billType: proposeType === 'CUSTOM_SCHEME' ? 'MONEY' : billType,
      proposerPartyId: selectedPartyId,
      proposedBy: userHandle || '@Candidate',
      isCustomScheme: proposeType === 'CUSTOM_SCHEME',
      effects,
      targetStates: selectedTargetStates.length > 0 ? selectedTargetStates : undefined,
    });

    setIsProposeModalOpen(false);
    setBillTitle('');
    setBillDescription('');
    setSelectedTargetStates([]);
  };

  const handleExecuteVote = () => {
    if (!votingBill) return;
    voteAndProcessBill(votingBill.id, selectedPlayerVote);
    setVotingBill(null);
  };

  const handleIssueWhip = (billId) => {
    issuePartyWhip(billId, selectedPartyId, whipDirection, whipStrictness);
  };

  const getStageIndex = (status) => {
    if (status === 'REJECTED' || status === 'FAILED') return -1;
    return BILL_STAGES.findIndex((s) => s.id === status);
  };

  return (
    <div className="space-y-6">
      {/* Parliament Header & Political Capital Ticker */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              Parliament of India • Constitutional Legislative Mechanism
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Lok Sabha & Rajya Sabha Floor Desk</h2>
            <p className="text-xs text-slate-400 mt-1">
              Article 110 Money Bills, Parliamentary Role Powers, 10th Schedule Anti-Defection Enforcement & Evolving Law Consequences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Political Capital Pool */}
            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">Political Capital</div>
                <div className="text-sm font-black text-white">{activePC} / 100 PC</div>
              </div>
            </div>
            <button
              onClick={() => setIsProposeModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-2xl transition shadow-lg transform active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              + INTRODUCE NEW BILL
            </button>
          </div>
        </div>

        {/* Parliamentary Role Power Action Bar */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300">
              <UserCheck className="w-4 h-4 text-orange-400" />
              <span>Special Parliamentary Role Powers Desk:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {['MP', 'PM', 'MINISTER', 'SPEAKER', 'OPPOSITION_LEADER', 'RS_CHAIRMAN'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition ${
                    selectedRole === r
                      ? 'bg-orange-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {r === 'PM' && '👑 Prime Minister'}
                  {r === 'MINISTER' && '💼 Cabinet Minister'}
                  {r === 'SPEAKER' && '⚖️ Speaker (Lok Sabha)'}
                  {r === 'OPPOSITION_LEADER' && '⚔️ Opposition Leader'}
                  {r === 'RS_CHAIRMAN' && '🏛️ Chairman (Rajya Sabha)'}
                  {r === 'MP' && '🗳️ Member of Parliament'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Role Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
            {selectedRole === 'SPEAKER' && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-amber-400 font-mono font-bold">Speaker Power (Om Birla):</span>
                <span>Select a taxation/economic bill below to certify as a Money Bill under Article 110.</span>
              </div>
            )}

            {selectedRole === 'OPPOSITION_LEADER' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSpecialParliamentaryMotion('NO_CONFIDENCE')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  ⚔️ Move No-Confidence Motion
                </button>
                <button
                  onClick={() => moveSpecialParliamentaryMotion('CUT_MOTION')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl transition shadow-md"
                >
                  Move Budget Cut Motion
                </button>
              </div>
            )}

            {selectedRole === 'PM' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSpecialParliamentaryMotion('CONFIDENCE_MOTION')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow-md"
                >
                  Call Motion of Confidence
                </button>
              </div>
            )}

            {selectedRole === 'MP' && (
              <span className="text-slate-400 text-xs">
                As an MP, introduce new bills, vote on floor motions, and issue party whips under party leader instructions.
              </span>
            )}
          </div>
        </div>

        {/* Filter Pills & Stats for Queue vs History */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'QUEUE', label: '⏳ Bills in Queue' },
              { id: 'HISTORY', label: '📜 Bills History' },
              { id: 'ALL', label: '📋 All Bills' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
                  activeFilter === filter.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-inner'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>Lok Sabha Quorum: <strong className="text-emerald-400 font-mono">55 MPs</strong></span>
            <span>Simple Majority: <strong className="text-yellow-400 font-mono">272 Seats</strong></span>
            <span>Special Majority: <strong className="text-orange-400 font-mono">2/3rd (362 Seats)</strong></span>
          </div>
        </div>
      </div>

      {/* Bill List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBills.map((bill) => {
          const proposer = parties.find((p) => p.id === bill.proposerPartyId) || parties[0];
          const isGovtProposer = bill.proposerPartyId === governingPartyId;
          const currentStageIdx = getStageIndex(bill.status);
          const activeWhip = bill.whips?.find((w) => w.partyId === selectedPartyId);

          return (
            <div
              key={bill.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition-all space-y-5"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border"
                    style={{ backgroundColor: `${proposer.color}20`, borderColor: proposer.color }}
                  >
                    {proposer.symbol}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                        {bill.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {bill.billType || 'ORDINARY'}
                      </span>

                      {/* Speaker Article 110 Certified Money Bill Badge */}
                      {bill.isMoneyBillCertifiedBySpeaker && (
                        <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <FileCheck className="w-3.5 h-3.5" /> Art 110 Money Bill
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        Proposed by: <strong className="text-amber-300">{bill.proposedBy || proposer.shortName}</strong> ({proposer.shortName})
                      </span>
                      {bill.isCustomScheme && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-black uppercase">
                          🚀 Custom Government Scheme
                        </span>
                      )}
                      {isGovtProposer && (
                        <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          TREASURY BENCH
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-1">{bill.title}</h3>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Real Player Direct Vote Button on Card */}
                  {bill.status !== 'ENACTED' && bill.status !== 'FAILED' && (
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold px-1">Player Vote:</span>
                      <button
                        onClick={() => voteAndProcessBill(bill.id, 'YES')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition"
                        title="Vote YES / AYE on Parliamentary Floor"
                      >
                        👍 YES
                      </button>
                      <button
                        onClick={() => voteAndProcessBill(bill.id, 'NO')}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow transition"
                        title="Vote NO / NOE on Parliamentary Floor"
                      >
                        👎 NO
                      </button>
                    </div>
                  )}

                  {/* Pass & Launch Scheme Button (Majority Support) */}
                  {bill.status !== 'ENACTED' && (
                    <button
                      onClick={() => processPresidentialAssent(bill.id, 'GRANTED')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition"
                    >
                      <Zap className="w-4 h-4" />
                      🚀 PASS & LAUNCH SCHEME NATIONWIDE
                    </button>
                  )}

                  {/* Speaker Money Bill Certification Button */}
                  {selectedRole === 'SPEAKER' && !bill.isMoneyBillCertifiedBySpeaker && (
                    <button
                      onClick={() => certifyMoneyBill(bill.id)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
                    >
                      <FileCheck className="w-4 h-4" /> Certify as Money Bill (Art 110)
                    </button>
                  )}

                  {bill.status === 'ENACTED' && (
                    <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-xl uppercase">
                      <CheckCircle className="w-4 h-4" /> Passed & Enacted Law
                    </span>
                  )}
                  {bill.status === 'FAILED' && (
                    <span className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black rounded-xl uppercase">
                      <XCircle className="w-4 h-4" /> Defeated
                    </span>
                  )}
                </div>
              </div>

              {/* 24-Hour Parliamentary Floor Voting Window Banner */}
              {bill.status !== 'ENACTED' && (
                <div className="p-3 bg-amber-950/30 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>24-Hour Parliamentary Floor Voting Window is OPEN for all MPs & Players.</span>
                  </div>
                  <div className="font-extrabold text-amber-400">
                    ⏳ 24h Floor Voting Active
                  </div>
                </div>
              )}

              {/* Rajya Sabha 14-Day Window Banner for Money Bills */}
              {bill.status === 'RAJYA_SABHA_VOTE' && bill.billType === 'MONEY' && (
                <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400" />
                    <span>Article 109/110 Money Bill Procedure: Rajya Sabha cannot reject or amend.</span>
                  </div>
                  <div className="font-mono font-bold text-amber-300">
                    ⏳ {bill.rajyaSabhaDaysRemaining ?? 14} Days Remaining
                  </div>
                </div>
              )}

              {/* Bill Pipeline Stepper */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Parliamentary Lifecycle Pipeline:
                </div>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  {BILL_STAGES.map((stg, idx) => {
                    const isPassed = currentStageIdx > idx || bill.status === 'ENACTED';
                    const isCurrent = currentStageIdx === idx;
                    return (
                      <React.Fragment key={stg.id}>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition ${
                            isCurrent
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500 font-extrabold shadow-md'
                              : isPassed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                              : 'bg-slate-900 text-slate-500 border-slate-800 font-normal'
                          }`}
                        >
                          <span>{stg.icon}</span>
                          <span>{stg.label}</span>
                        </div>
                        {idx < BILL_STAGES.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300">{bill.description}</p>

              {/* Party Whip Controls */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span>Party Leader Whip System (10th Schedule Anti-Defection Enforcement):</span>
                  </div>
                  {activeWhip ? (
                    <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-0.5 rounded font-mono font-bold">
                      Active Whip: {activeWhip.whipType} ({activeWhip.direction})
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">No Whip Issued Yet</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Strictness:</span>
                    <select
                      value={whipStrictness}
                      onChange={(e) => setWhipStrictness(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white p-1.5 rounded-xl font-bold"
                    >
                      <option value="THREE_LINE">3-Line Whip (Strict Mandate)</option>
                      <option value="TWO_LINE">2-Line Whip (Strong Recommendation)</option>
                      <option value="FREE_VOTE">Free Vote (No Restriction)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Direction:</span>
                    <select
                      value={whipDirection}
                      onChange={(e) => setWhipDirection(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white p-1.5 rounded-xl font-bold"
                    >
                      <option value="YES">Vote YES (Support)</option>
                      <option value="NO">Vote NO (Oppose)</option>
                      <option value="FREE_VOTE">Free Vote</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleIssueWhip(bill.id)}
                    className="px-4 py-1.5 bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-slate-950 font-black text-xs rounded-xl border border-orange-500/40 transition"
                  >
                    Issue Whip (10 PC)
                  </button>
                </div>
              </div>

              {/* Predefined Sectoral Effects Grid (Qualitative Indicators) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Predefined Sectoral Impact Matrix (Qualitative Indicators)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Qualitative Outlook Indicator Mode</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                  {[
                    { name: 'Economy', val: bill.effects.economy },
                    { name: 'Employment', val: bill.effects.employment },
                    { name: 'Healthcare', val: bill.effects.healthcare },
                    { name: 'Agriculture', val: bill.effects.agriculture },
                    { name: 'Infrastructure', val: bill.effects.infrastructure },
                    { name: 'Education', val: bill.effects.education },
                    { name: 'Environment', val: bill.effects.environment },
                  ].map((sec) => {
                    const ind = getQualitativeIndicator(sec.val);
                    return (
                      <div key={sec.name} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold block">{sec.name}</span>
                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded border mt-1 w-fit ${ind.badgeClass}`}>
                          {ind.symbol} {ind.label}
                        </span>
                      </div>
                    );
                  })}

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                    <span className="text-[10px] text-amber-400 font-bold block">Treasury Cost</span>
                    <span className="font-mono font-extrabold text-xs text-amber-300 mt-1">
                      ₹{bill.effects.treasuryCostCrores} Cr
                    </span>
                  </div>

                  {(() => {
                    const sentInd = getQualitativeIndicator(bill.effects.publicSentimentIndex);
                    return (
                      <div className="col-span-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Public Sentiment Outlook</span>
                          <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded border mt-1 ${sentInd.badgeClass}`}>
                            {sentInd.symbol} {sentInd.label}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Dynamic Evolving Law Sentiment Indicator for Enacted Laws */}
              {bill.status === 'ENACTED' && bill.evolvingSentimentTrend !== undefined && bill.evolvingSentimentTrend < 0 && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <TrendingDown className="w-4 h-4" />
                    <span>Dynamic Consequence Evolution (Fiscal Drag & Environmental Costs):</span>
                  </div>
                  <span className="font-mono font-bold text-red-400">
                    Sentiment Decay: {bill.evolvingSentimentTrend}% / tick
                  </span>
                </div>
              )}

              {/* Anti-Defection Notices Box */}
              {bill.antiDefectionNotices && bill.antiDefectionNotices.length > 0 && (
                <div className="p-4 bg-red-950/40 rounded-2xl border border-red-500/40 space-y-2">
                  <div className="font-extrabold text-red-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> 10th Schedule Anti-Defection Proceedings:
                  </div>
                  {bill.antiDefectionNotices.map((notice, idx) => (
                    <div key={idx} className="text-xs text-red-200 bg-slate-900/80 p-3 rounded-xl border border-red-500/20">
                      {notice.summary}
                    </div>
                  ))}
                </div>
              )}

              {/* Voting Breakdown if already voted */}
              {bill.votes && (
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-extrabold text-white">
                    <span>Lok Sabha Floor Vote Tally (543 Seats)</span>
                    <span>Quorum Satisfied: {bill.quorumSatisfied !== false ? '✅ Yes (55+ MPs)' : '❌ No'}</span>
                  </div>

                  {/* Seat Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${(bill.votes.totalYesSeats / 543) * 100}%` }}
                      title={`YES: ${bill.votes.totalYesSeats} seats`}
                    />
                    <div
                      className="bg-red-500 h-full transition-all"
                      style={{ width: `${(bill.votes.totalNoSeats / 543) * 100}%` }}
                      title={`NO: ${bill.votes.totalNoSeats} seats`}
                    />
                    <div
                      className="bg-slate-600 h-full transition-all"
                      style={{ width: `${(bill.votes.totalAbstainSeats / 543) * 100}%` }}
                      title={`ABSTAIN: ${bill.votes.totalAbstainSeats} seats`}
                    />
                  </div>

                  <div className="flex flex-wrap justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">YES: {bill.votes.totalYesSeats} Seats</span>
                    <span className="text-red-400 font-bold">NO: {bill.votes.totalNoSeats} Seats</span>
                    <span className="text-slate-400 font-bold">ABSTAIN: {bill.votes.totalAbstainSeats} Seats</span>
                  </div>

                  {bill.publicReaction && (
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
                      <div className="font-extrabold text-amber-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Public Reaction & Meter Impact:
                      </div>
                      <p>{bill.publicReaction.summary}</p>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Govt Approval Change: {bill.publicReaction.nationalApprovalDelta >= 0 ? `+${bill.publicReaction.nationalApprovalDelta}` : bill.publicReaction.nationalApprovalDelta}%
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floor Voting Simulator Modal */}
      {votingBill && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-orange-400">PARLIAMENTARY FLOOR VOTE</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{votingBill.title}</h3>
              </div>
              <button
                onClick={() => setVotingBill(null)}
                className="p-2 hover:bg-slate-800 text-slate-400 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brute-Force Electoral Risk Warning for Governing Parties */}
            {isGovt && votingBill.effects.publicSentimentIndex < 0 && (
              <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-2xl text-xs space-y-1 text-red-200">
                <div className="font-extrabold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Brute-Force Electoral Risk Warning:
                </div>
                <p>
                  Your governing coalition holds a majority to pass this bill, but passing a controversial policy with negative sentiment will trigger a <strong>1.75x Approval Penalty (-18%)</strong> and damage seat projections in the next election!
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white">Select Vote Position for {activeParty.name} ({activeParty.shortName}):</div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => setSelectedPlayerVote('YES')}
                    className={`py-3 px-4 rounded-2xl font-black text-xs border transition ${
                      selectedPlayerVote === 'YES'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    👍 Vote YES (Support)
                  </button>
                  <button
                    onClick={() => setSelectedPlayerVote('NO')}
                    className={`py-3 px-4 rounded-2xl font-black text-xs border transition ${
                      selectedPlayerVote === 'NO'
                        ? 'bg-red-600 text-white border-red-400 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    👎 Vote NO (Oppose)
                  </button>
                  <button
                    onClick={() => setSelectedPlayerVote('ABSTAIN')}
                    className={`py-3 px-4 rounded-2xl font-black text-xs border transition ${
                      selectedPlayerVote === 'ABSTAIN'
                        ? 'bg-slate-700 text-white border-slate-500 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ✋ ABSTAIN
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs space-y-2">
                <div className="font-extrabold text-slate-400 uppercase tracking-wider">Parliamentary Voting Rules:</div>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  <li>
                    Quorum Threshold: <strong>55+ MPs must participate</strong>.
                  </li>
                  <li>
                    Majority Rule: {votingBill.billType === 'CONSTITUTIONAL_AMENDMENT' ? 'Special 2/3rd Majority (362+ Seats)' : 'Simple Majority (272 Seats)'}.
                  </li>
                  <li>
                    If a 3-Line Whip is violated, Anti-Defection proceedings are triggered unless 2/3rd of the party defect together.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setVotingBill(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteVote}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition"
              >
                Cast Floor Vote Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table New Bill Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-orange-400">PARLIAMENTARY DRAFTING & SCHEME CREATOR</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">Propose Bill / Launch Custom Scheme</h3>
              </div>
              <button
                onClick={() => setIsProposeModalOpen(false)}
                className="p-2 hover:bg-slate-800 text-slate-400 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proposal Mode Tabs: Bill vs Custom Scheme */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setProposeType('BILL')}
                className={`py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
                  proposeType === 'BILL'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📜 Standard Parliamentary Bill
              </button>
              <button
                type="button"
                onClick={() => setProposeType('CUSTOM_SCHEME')}
                className={`py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
                  proposeType === 'CUSTOM_SCHEME'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚀 Custom Government Scheme
              </button>
            </div>

            {/* Quick Preset Selector */}
            {proposeType === 'BILL' && (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 block">Select Predefined Bill Template (Optional):</label>
                <select
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs font-semibold text-white p-3 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Choose Preset Indian Parliamentary Template --</option>
                  {PRESET_BILL_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      [{tmpl.category}] {tmpl.title} ({tmpl.billType || 'ORDINARY'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleProposeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-extrabold text-slate-300 block mb-1">
                    {proposeType === 'CUSTOM_SCHEME' ? 'Custom Scheme Name' : 'Bill Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={billTitle}
                    onChange={(e) => setBillTitle(e.target.value)}
                    placeholder={proposeType === 'CUSTOM_SCHEME' ? 'e.g. National Solar Energy Subsidy Scheme' : 'e.g. Universal Healthcare Security Act'}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-300 block mb-1">Bill Type</label>
                  <select
                    value={billType}
                    onChange={(e) => setBillType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="ORDINARY">ORDINARY BILL</option>
                    <option value="MONEY">MONEY BILL (Art 110)</option>
                    <option value="CONSTITUTIONAL_AMENDMENT">CONSTITUTIONAL AMENDMENT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-300 block mb-1">Category</label>
                  <select
                    value={billCategory}
                    onChange={(e) => setBillCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="ECONOMIC">ECONOMIC</option>
                    <option value="WELFARE">WELFARE</option>
                    <option value="AGRICULTURE">AGRICULTURE</option>
                    <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                    <option value="HEALTHCARE">HEALTHCARE</option>
                    <option value="EDUCATION">EDUCATION</option>
                    <option value="ENVIRONMENT">ENVIRONMENT</option>
                    <option value="REFORM">REFORM</option>
                    <option value="DEFENCE">DEFENCE</option>
                    <option value="TAXATION">TAXATION</option>
                    <option value="SOCIAL_WELFARE">SOCIAL WELFARE</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-300 block mb-1">Target States / Focus Regions (Optional):</label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {statesList.map((st) => {
                      const isSelected = selectedTargetStates.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTargetStates(selectedTargetStates.filter((s) => s !== st));
                            } else {
                              setSelectedTargetStates([...selectedTargetStates, st]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            isSelected ? 'bg-orange-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-300 block mb-1">Detailed Objectives & Provisions</label>
                <textarea
                  rows={2}
                  required
                  value={billDescription}
                  onChange={(e) => setBillDescription(e.target.value)}
                  placeholder="Outline key clauses, subsidies, or infrastructural targets..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Sector Sliders */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-extrabold text-slate-300 uppercase tracking-wider text-[11px]">
                  Configure Predefined Sectoral Effects (-100 to +100):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Economy:</span> <span className="text-emerald-400 font-mono">{effects.economy}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.economy}
                      onChange={(e) => setEffects({ ...effects, economy: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Employment:</span> <span className="text-emerald-400 font-mono">{effects.employment}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.employment}
                      onChange={(e) => setEffects({ ...effects, employment: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Healthcare:</span> <span className="text-emerald-400 font-mono">{effects.healthcare}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.healthcare}
                      onChange={(e) => setEffects({ ...effects, healthcare: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Agriculture:</span> <span className="text-emerald-400 font-mono">{effects.agriculture}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.agriculture}
                      onChange={(e) => setEffects({ ...effects, agriculture: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Infrastructure:</span> <span className="text-emerald-400 font-mono">{effects.infrastructure}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.infrastructure}
                      onChange={(e) => setEffects({ ...effects, infrastructure: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold justify-between flex">
                      <span>Public Sentiment Rating:</span> <span className="text-amber-400 font-mono">{effects.publicSentimentIndex}</span>
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={effects.publicSentimentIndex}
                      onChange={(e) => setEffects({ ...effects, publicSentimentIndex: Number(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-amber-400 font-bold justify-between flex">
                      <span>Treasury Budget Required:</span> <span className="font-mono">₹{effects.treasuryCostCrores} Cr</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={effects.treasuryCostCrores}
                      onChange={(e) => setEffects({ ...effects, treasuryCostCrores: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition"
                >
                  Table Bill in Lok Sabha (25 PC)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
