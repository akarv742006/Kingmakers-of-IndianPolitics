import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Scale, CheckCircle, XCircle, AlertOctagon, Gavel, PlusCircle, Bot } from 'lucide-react';

export const JudgeDashboard = () => {
  const {
    petitions,
    deliverVerdict,
    filePetition,
    parties,
    aiChiefJusticeEnabled,
    setAiChiefJusticeEnabled,
    courtroomMessages,
    askCourtQuestion,
  } = useGame();

  const [selectedPetition, setSelectedPetition] = useState(null);
  const [judgeNote, setJudgeNote] = useState('');
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState(false);

  // New petition form state
  const [petitioner, setPetitioner] = useState(parties[0]?.name || 'Indian National Congress');
  const [respondent, setRespondent] = useState('Bharatiya Janata Party');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('MCC_VIOLATION');
  const [details, setDetails] = useState('');

  const pendingPetitions = petitions.filter((p) => p.status === 'PENDING' || p.status === 'HEARING');
  const resolvedPetitions = petitions.filter((p) => p.status === 'VERDICT_DELIVERED');

  const handleDeliver = (verdict) => {
    if (!selectedPetition) return;
    deliverVerdict(selectedPetition.id, verdict, judgeNote || 'Order passed by Supreme Court Constitutional Bench.');
    setSelectedPetition(null);
    setJudgeNote('');
  };

  const handleCreatePetition = (e) => {
    e.preventDefault();
    if (!subject || !details) return;
    filePetition({
      petitioner,
      respondent,
      subject,
      category,
      details,
    });
    setIsNewPetModalOpen(false);
    setSubject('');
    setDetails('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Scale className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">Supreme Court of India</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold border border-purple-500/30">
                Chief Justice Bench
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Constitutional adjudication of election disputes, anti-defection law petitions, and Model Code injunctions.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setAiChiefJusticeEnabled(!aiChiefJusticeEnabled)}
            className={`p-3 rounded-2xl border transition flex items-center gap-2.5 text-xs font-black ${
              aiChiefJusticeEnabled
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-950/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className={`w-4 h-4 ${aiChiefJusticeEnabled ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider">AI Chief Justice</div>
              <div>{aiChiefJusticeEnabled ? '⚖️ Auto-Adjudication ACTIVE' : '👤 Manual Bench'}</div>
            </div>
          </button>

          <button
            onClick={() => setIsNewPetModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition shadow-lg shadow-purple-900/30 flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> File New Writ Petition
          </button>
        </div>
      </div>

      {/* Interactive Courtroom Bench Stream in Message Format */}
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Interactive Supreme Courtroom Bench (Live Message Format)
            </h3>
            <p className="text-xs text-slate-400">
              Chief Justice examines petitioners, asks direct legal questions, and pronounces binding verdicts live for all connected players.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs font-bold rounded-full border border-purple-500/30">
            💬 LIVE BENCH STREAM
          </span>
        </div>

        {/* Live Message List */}
        <div className="max-h-72 overflow-y-auto space-y-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 custom-scrollbar">
          {courtroomMessages && courtroomMessages.length > 0 ? (
            courtroomMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border transition ${
                  msg.type === 'CJI_QUESTION'
                    ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                    : msg.type === 'JUDICIAL_VERDICT'
                    ? 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-purple-300">{msg.sender}</span>
                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                      {msg.senderRole || 'Bench'}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 text-center py-6">No court messages recorded yet.</div>
          )}
        </div>

        {/* Ask Question / Directive Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.elements.courtQuery;
            if (input && input.value.trim()) {
              askCourtQuestion(input.value.trim());
              input.value = '';
            }
          }}
          className="flex items-center gap-3"
        >
          <input
            name="courtQuery"
            type="text"
            placeholder="⚖️ Ask direct question to petitioner/respondent or issue Bench directive..."
            className="flex-1 bg-slate-950 border border-slate-700 text-xs font-semibold text-white p-3 rounded-xl focus:outline-none focus:border-purple-500 placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition shrink-0"
          >
            ⚖️ Submit Bench Message
          </button>
        </form>
      </div>

      {/* Case Docket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Cases Docket List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-purple-400" />
              Active Judicial Docket ({pendingPetitions.length})
            </h3>
          </div>

          {pendingPetitions.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
              No active judicial petitions in the court docket.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPetitions.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPetition(pet)}
                  className={`p-4 rounded-2xl bg-slate-950 border transition cursor-pointer space-y-2 hover:border-purple-500/60 ${
                    selectedPetition?.id === pet.id ? 'border-purple-500 bg-slate-900' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-purple-400 text-[10px] font-bold">WRIT PETITION #{pet.id}</span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {pet.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{pet.subject}</h4>
                  <div className="text-xs text-slate-400">
                    Petitioner: <strong className="text-slate-200">{pet.petitioner}</strong> vs Respondent: <strong className="text-slate-200">{pet.respondent}</strong>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
                    {pet.details}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bench Hearing & Order Issuance Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-3">
            Open Bench Pronouncement
          </h3>

          {selectedPetition ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="text-purple-400 font-mono font-bold text-[10px]">CASE UNDER ADJUDICATION</div>
                <div className="font-bold text-white text-sm">{selectedPetition.subject}</div>
                <div className="text-slate-400">{selectedPetition.details}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Bench Note & Judicial Order</label>
                <textarea
                  value={judgeNote}
                  onChange={(e) => setJudgeNote(e.target.value)}
                  placeholder="Enter court reasoning and explicit judicial directions..."
                  className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleDeliver('ALLOWED')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Allow Petition (Rule in Favor of Petitioner)
                </button>
                <button
                  onClick={() => handleDeliver('INJUNCTION_ISSUED')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" /> Issue Stay Order / Injunction
                </button>
                <button
                  onClick={() => handleDeliver('DISMISSED')}
                  className="w-full py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Dismiss Petition with Costs
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              Select a petition from the active court docket on the left to pronounce a judicial order.
            </div>
          )}
        </div>
      </div>

      {/* Resolved Judgments Log */}
      {resolvedPetitions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-3">
            Pronounced Judicial Orders History ({resolvedPetitions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resolvedPetitions.map((pet) => (
              <div key={pet.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-white">{pet.subject}</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono text-[10px]">
                    VERDICT: {pet.verdict}
                  </span>
                </div>
                <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                  Bench Note: "{pet.judgeOrderNote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: File New Writ Petition */}
      {isNewPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsNewPetModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xl font-extrabold text-white">File Writ Petition in Supreme Court</h3>
              <p className="text-xs text-slate-400">Article 32 / 226 Constitutional Remedies</p>
            </div>

            <form onSubmit={handleCreatePetition} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Petitioner Party</label>
                <input
                  type="text"
                  value={petitioner}
                  onChange={(e) => setPetitioner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Respondent Party / Authority</label>
                <input
                  type="text"
                  value={respondent}
                  onChange={(e) => setRespondent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="MCC_VIOLATION">MCC Violation</option>
                  <option value="ANTI_DEFECTION">Anti-Defection Dispute</option>
                  <option value="EVM_DISPUTE">EVM / VVPAT Dispute</option>
                  <option value="CAMPAIGN_BAN">Rally / Speech Ban Appeal</option>
                  <option value="HATE_SPEECH">Hate Speech Complaint</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Challenge to Campaign Speech Restraint Order in UP"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Factual Grounds & Evidence *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the constitutional grounds or statutory provisions violated..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPetModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  Submit Petition to Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
