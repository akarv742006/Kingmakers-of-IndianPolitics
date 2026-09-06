import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Scale, Gavel, AlertOctagon, CheckCircle2, X } from 'lucide-react';

export const CourtComplaintModal = ({ isOpen, onClose }) => {
  const { parties, selectedPartyId, filePetition } = useGame();

  const userParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const rivalParties = parties.filter((p) => p.id !== selectedPartyId);

  const [respondent, setRespondent] = useState(rivalParties[0]?.name || 'Bharatiya Janata Party');
  const [category, setCategory] = useState('MCC_VIOLATION');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [evidenceLevel, setEvidenceLevel] = useState('HIGH_CONFIDENCE');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!subject || !details) return;

    filePetition({
      petitioner: `${userParty.name} (${userParty.shortName})`,
      respondent,
      subject,
      category,
      details: `[Evidence: ${evidenceLevel.replace('_', ' ')}] - ${details}`,
    });

    setFeedback(`✅ Writ Complaint filed in Supreme Court Docket! Case registered against ${respondent}.`);
    setTimeout(() => {
      setFeedback('');
      setSubject('');
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
              Supreme Court & Election Commission Docket
            </span>
            <h3 className="text-xl font-black text-white font-display">
              File Legal / Electoral Complaint
            </h3>
          </div>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Petitioner (Your Party):</label>
              <input
                type="text"
                readOnly
                value={`${userParty.name} (${userParty.shortName})`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Respondent Authority / Rival Party:</label>
              <select
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              >
                {rivalParties.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.symbol} {p.name} ({p.shortName})
                  </option>
                ))}
                <option value="Election Commission of India (ECI)">Election Commission of India (ECI)</option>
                <option value="State Police Bureau">State Police Bureau</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Complaint Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
            >
              <option value="MCC_VIOLATION">Model Code of Conduct (MCC) Breach (Rally timing / Bribes)</option>
              <option value="ANTI_DEFECTION">10th Schedule Anti-Defection Petition (Illegal MP Split)</option>
              <option value="CORRUPTION_MALPRACTICE">Electoral Expenditure Excess / Bribing Voters</option>
              <option value="GOVT_MACHINERY_MISUSE">Misuse of Official State Vehicles & Infrastructure</option>
              <option value="HATE_SPEECH">Hate Speech & Inflammatory Propaganda (RPA Act 1951)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Evidence Package Attachment:</label>
            <select
              value={evidenceLevel}
              onChange={(e) => setEvidenceLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold font-mono"
            >
              <option value="HIGH_CONFIDENCE">📹 Video Footage & Audio Tapes (High Injunction Chance)</option>
              <option value="FINANCIAL_LEDGER">📑 Whistleblower Financial Bank Records</option>
              <option value="TRANSCRIPT">📜 Official Public Rally Transcript</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Subject Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Injunction Against Unlawful Cash Distribution in Varanasi"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Factual Grounds & Legal Claim Details *</label>
            <textarea
              required
              rows={3}
              placeholder="Detail the constitutional clauses, statutory breaches, and requested remedy..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" /> Submit Complaint to Supreme Court
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
