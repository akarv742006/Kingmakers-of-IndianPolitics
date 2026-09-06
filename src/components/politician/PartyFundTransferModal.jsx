import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Coins, HeartHandshake, CheckCircle2, TrendingUp, X, Sparkles } from 'lucide-react';

export const PartyFundTransferModal = ({ isOpen, onClose }) => {
  const {
    playerSalaryBalance,
    parties,
    selectedPartyId,
    transferPersonalFundsToParty,
  } = useGame();

  const currentParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const [transferAmount, setTransferAmount] = useState(500000); // Default ₹5 Lakhs
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const res = transferPersonalFundsToParty(Number(transferAmount));
    if (res && res.success) {
      setFeedback(res.message);
      setTimeout(() => {
        setFeedback('');
        onClose();
      }, 1800);
    } else {
      setFeedback(res?.message || 'Transfer failed.');
    }
  };

  const presetAmounts = [
    { label: '₹1 Lakh', val: 100000 },
    { label: '₹5 Lakhs', val: 500000 },
    { label: '₹25 Lakhs', val: 2500000 },
    { label: '₹1 Crore', val: 10000000 },
    { label: '₹5 Crores', val: 50000000 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              Party Financial Treasury
            </span>
            <h3 className="text-xl font-black text-white font-display">
              Transfer Earnings to Party Fund
            </h3>
          </div>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Your Personal Cash</span>
            <div className="text-white font-black text-base font-mono">
              ₹ {(playerSalaryBalance || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">From Salary & Allowances</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold uppercase text-[10px]">Party Treasury Fund</span>
            <div className="text-amber-300 font-black text-base font-mono">
              ₹ {currentParty.fundsInCrores || 500} Crores
            </div>
            <span className="text-[10px] text-slate-500 block">{currentParty.shortName} Treasury</span>
          </div>
        </div>

        <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-bold block">Select Transfer Amount:</label>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((p) => (
                <button
                  type="button"
                  key={p.val}
                  onClick={() => setTransferAmount(p.val)}
                  className={`px-3 py-1.5 rounded-xl font-bold font-mono transition border ${
                    transferAmount === p.val
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">Custom Transfer Amount (in ₹):</label>
            <input
              type="number"
              min="10000"
              max={playerSalaryBalance}
              step="50000"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] font-medium leading-relaxed">
            💡 <strong>Benefits of Transferring Money:</strong> Increases {currentParty.shortName} campaign funds, boosts leader standing (+3 Popularity), and unlocks party leader badges!
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={playerSalaryBalance < transferAmount}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 ${
                playerSalaryBalance >= transferAmount
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <HeartHandshake className="w-4 h-4" /> Transfer ₹{Number(transferAmount).toLocaleString()} to Party Fund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
