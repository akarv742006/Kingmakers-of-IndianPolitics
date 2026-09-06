import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Clock, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

export const HourlyCollectorWidget = () => {
  const {
    accumulatedHourlyRevenue,
    claimHourlyRevenue,
    lastHourlyClaimTime,
  } = useGame();

  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [claimFeedback, setClaimFeedback] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - (lastHourlyClaimTime || Date.now())) / 1000);
      const remaining = Math.max(0, 3600 - (elapsed % 3600));
      setSecondsLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastHourlyClaimTime]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const handleClaim = () => {
    const res = claimHourlyRevenue();
    if (res && res.success) {
      setClaimFeedback(`+ ₹${res.amount.toLocaleString()} Claimed!`);
      setTimeout(() => setClaimFeedback(''), 2500);
    }
  };

  const isReadyToClaim = accumulatedHourlyRevenue > 0;

  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left Details */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shrink-0 shadow-lg shadow-amber-500/10">
          💰
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-mono">
              1-HOUR REVENUE COLLECTOR
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Reset in: <strong>{String(mins).padStart(2, '0')}m {String(secs).padStart(2, '0')}s</strong>
            </span>
          </div>

          <div className="text-white font-extrabold text-base mt-1 flex items-center gap-2">
            <span>Unclaimed Hourly Dividends:</span>
            <span className="text-emerald-400 font-mono font-black text-lg">
              ₹ {(accumulatedHourlyRevenue || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Claim Button */}
      <div className="flex items-center gap-3 shrink-0">
        {claimFeedback ? (
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{claimFeedback}</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={!isReadyToClaim}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center gap-2 ${
              isReadyToClaim
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>COLLECT HOURLY MONEY</span>
          </button>
        )}
      </div>
    </div>
  );
};
