import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import confetti from 'canvas-confetti';
import { ShoppingBag, Sparkles, Gem, Coins, CheckCircle2, Zap, Crown } from 'lucide-react';

export const PoliticalStorePage = () => {
  const { playerSalaryBalance, buyGameCash } = useGame();
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState('');

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const cashPacks = [
    { price: 10, priceDisplay: '₹10', cashAmount: 10000000, title: 'Starter Cash Pack', tag: 'MINI BOOST', icon: '💰', color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/30' },
    { price: 20, priceDisplay: '₹20', cashAmount: 25000000, title: 'Popular Cash Pack', tag: 'BEST VALUE', icon: '💵', color: 'from-sky-500/20 to-blue-500/20', borderColor: 'border-sky-500/30' },
    { price: 50, priceDisplay: '₹50', cashAmount: 75000000, title: 'Cadre Campaign Pack', tag: 'POPULAR CHOICE', icon: '💸', color: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/30' },
    { price: 100, priceDisplay: '₹100', cashAmount: 180000000, title: 'Rally Commander Pack', tag: 'MEGA PACK', icon: '🪙', color: 'from-purple-500/20 to-indigo-500/20', borderColor: 'border-purple-500/30' },
    { price: 200, priceDisplay: '₹200', cashAmount: 450000000, title: 'State Victory Pack', tag: 'HIGH VALUE', icon: '💎', color: 'from-rose-500/20 to-pink-500/20', borderColor: 'border-rose-500/30' },
    { price: 500, priceDisplay: '₹500', cashAmount: 1200000000, title: 'Sovereign Treasury Pack', tag: 'ULTIMATE PACK', icon: '👑', color: 'from-amber-400/30 to-yellow-500/30', borderColor: 'border-amber-400/40' },
  ];

  const handleBuyCash = (pack) => {
    const res = buyGameCash(pack.cashAmount);
    if (res && res.success) {
      setPurchaseSuccessMsg(`🎉 Successfully purchased ${pack.title} for ${pack.priceDisplay}! Added +${formatCurrency(pack.cashAmount)} Game Cash!`);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0 shadow-lg">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Political Game Cash Store</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                Starting from ₹10
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              For now only in-game treasury cash can be bought, starting from ₹10 up to ₹500 to fund state rallies, media campaigns, candidate security, and constituency operations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 font-mono text-sm shadow-inner">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GAME CASH BALANCE</div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {formatCurrency(playerSalaryBalance || 1245780)}
            </div>
            <div className="text-[10px] text-slate-500">
              ₹{(playerSalaryBalance || 1245780).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {purchaseSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{purchaseSuccessMsg}</span>
          </div>
          <button
            onClick={() => setPurchaseSuccessMsg('')}
            className="text-slate-400 hover:text-white text-xs underline font-mono font-semibold"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Game Cash Packs Grid (₹10 to ₹500) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <Coins className="w-5 h-5 text-amber-400" />
            Official Game Cash Packs (₹10 - ₹500)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Instant Treasury Credit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cashPacks.map((pack, idx) => (
            <div
              key={idx}
              className={`bg-slate-900 border ${pack.borderColor} rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-400/80 transition duration-200 hover:-translate-y-1 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pack.color} blur-2xl -mr-10 -mt-10 rounded-full group-hover:scale-150 transition pointer-events-none`} />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{pack.icon}</span>
                  <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                    {pack.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-lg text-white font-display">{pack.title}</h4>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    +{formatCurrency(pack.cashAmount)} <span className="text-xs text-slate-400 font-normal">Cash</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ₹{pack.cashAmount.toLocaleString('en-IN')} Game Cash
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                <div className="text-xs font-black text-white font-mono">
                  Price: <strong className="text-emerald-400 text-base">{pack.priceDisplay}</strong>
                </div>

                <button
                  onClick={() => handleBuyCash(pack)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-1.5 shrink-0"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>BUY FOR {pack.priceDisplay}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
