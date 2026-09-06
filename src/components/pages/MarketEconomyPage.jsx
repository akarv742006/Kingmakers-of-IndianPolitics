import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { TrendingUp, Coins, Building, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

export const MarketEconomyPage = () => {
  const {
    playerFinances,
    buyBusiness,
    launderBlackMoney,
    bribeCandidate,
    parties,
    seats,
  } = useGame();

  const [bribeSeatId, setBribeSeatId] = useState(1);
  const [bribePartyId, setBribePartyId] = useState('bjp');
  const [bribeCrores, setBribeCrores] = useState(10);
  const [launderingAmount, setLaunderingAmount] = useState(20);
  const [statusMessage, setStatusMessage] = useState('');

  const handleLaunder = (e) => {
    e.preventDefault();
    launderBlackMoney(launderingAmount);
    setStatusMessage(`Laundered ₹${launderingAmount} Cr black money into clean campaign funds!`);
  };

  const handleBribe = (e) => {
    e.preventDefault();
    bribeCandidate(bribeSeatId, bribePartyId, bribeCrores);
    setStatusMessage(`Bribe dispatched for Seat #${bribeSeatId}! Candidate support flipped.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0">
            📈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Political Capital & Financial Market</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                Treasury & Campaign Finance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Acquire corporate businesses, launder black campaign funds, and execute strategic candidate campaign finance.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shrink-0">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Black Money Vault</div>
          <div className="text-2xl font-black text-amber-400 font-mono">₹{playerFinances.blackMoneyCrores} Cr</div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: Business Acquisition & Money Laundering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Business Buying Desk (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 font-display">
            Corporate Business Investments (Yields Daily Cash)
          </h3>

          <div className="space-y-3">
            {[
              { type: 'MEDIA_HOUSE', title: 'National TV News Channel', cost: 150, yield: '₹5 Cr/day' },
              { type: 'REAL_ESTATE', title: 'Infra & Highway Realty Trust', cost: 300, yield: '₹12 Cr/day' },
              { type: 'MINING', title: 'State Minerals & Coal Concession', cost: 500, yield: '₹25 Cr/day' },
            ].map((biz) => (
              <div key={biz.type} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-extrabold text-white">{biz.title}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Yield: {biz.yield}</div>
                </div>

                <button
                  onClick={() => {
                    const res = buyBusiness(biz.type, biz.title, biz.cost);
                    if (res && res.message) {
                      setStatusMessage(res.message);
                    } else {
                      setStatusMessage(`Acquired ${biz.title} for ₹${biz.cost} Cr!`);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition"
                >
                  Buy (₹{biz.cost} Cr)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Black Money Laundering & Bribing (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 font-display">
            Money Laundering & Candidate Bribing
          </h3>

          <form onSubmit={handleLaunder} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-slate-200">Launder Black Money into Clean Treasury:</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max={playerFinances.blackMoneyCrores}
                value={launderingAmount}
                onChange={(e) => setLaunderingAmount(Number(e.target.value))}
                className="flex-1 bg-slate-900 border border-slate-800 text-white font-mono p-2.5 rounded-xl"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition"
              >
                Launder Funds
              </button>
            </div>
          </form>

          <form onSubmit={handleBribe} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-slate-200">Bribe Opposition Candidate in Seat:</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="1"
                max="543"
                value={bribeSeatId}
                onChange={(e) => setBribeSeatId(Number(e.target.value))}
                placeholder="Seat ID (1-543)"
                className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl font-mono"
              />
              <select
                value={bribePartyId}
                onChange={(e) => setBribePartyId(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-amber-300 font-bold p-2.5 rounded-xl"
              >
                {parties.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-950 text-white">
                    {p.shortName}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition"
            >
              Dispatch Candidate Bribe (₹{bribeCrores} Cr)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
