import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Flame, X, CheckCircle2, MapPin, Users, Sparkles } from 'lucide-react';

export const RallyOrganizerModal = ({ isOpen, onClose }) => {
  const { holdRally, selectedPartyId, parties } = useGame();

  const [targetState, setTargetState] = useState('Uttar Pradesh');
  const [speechFocus, setSpeechFocus] = useState('Youth Unemployment & Skills');
  const [budgetCrores, setBudgetCrores] = useState(15);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const partyObj = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const estimatedCrowd = (budgetCrores * 18000).toLocaleString();
  const estimatedPopularityGain = (budgetCrores * 0.25).toFixed(1);

  const handleOrganizeRally = (e) => {
    e.preventDefault();
    const res = holdRally(targetState, speechFocus, budgetCrores);
    if (res && res.message) {
      setStatusMessage(res.message);
      setTimeout(() => {
        setStatusMessage('');
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-black shrink-0">
            📢
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Mass Campaign Mobilization
            </span>
            <h3 className="text-2xl font-black text-white font-display">
              Organize Mega Political Rally
            </h3>
          </div>
        </div>

        {/* Feedback Message */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Rally Form */}
        <form onSubmit={handleOrganizeRally} className="space-y-4">
          {/* Target State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Target Rally State:</label>
            <select
              value={targetState}
              onChange={(e) => setTargetState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-bold p-2.5 rounded-xl text-xs focus:outline-none"
            >
              {['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Madhya Pradesh', 'Gujarat', 'Karnataka', 'Rajasthan'].map((st) => (
                <option key={st} value={st} className="bg-slate-950 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Speech Focus */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Speech Focus Topic:</label>
            <select
              value={speechFocus}
              onChange={(e) => setSpeechFocus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none"
            >
              <option value="Youth Unemployment & Skills">Youth Employment & Industry Subsidies</option>
              <option value="Farmer MSP & Debt Waiver">Farmer MSP Legal Guarantee & Debt Waiver</option>
              <option value="Infrastructure & High Speed Rail">Infrastructure & Urban Metro Projects</option>
              <option value="National Pride & Security">National Security & Cultural Heritage</option>
            </select>
          </div>

          {/* Budget Investment Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Campaign Expenditure:</span>
              <span className="text-amber-400 font-mono font-black">₹{budgetCrores} Crores</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={budgetCrores}
              onChange={(e) => setBudgetCrores(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rally Preview Card */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Crowd Turnout</span>
              <strong className="text-white font-mono text-sm">{estimatedCrowd} People</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">State Approval Boost</span>
              <strong className="text-emerald-400 font-mono text-sm">+{estimatedPopularityGain}%</strong>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4" /> Mobilize Rally (₹{budgetCrores} Cr)
          </button>
        </form>
      </div>
    </div>
  );
};
