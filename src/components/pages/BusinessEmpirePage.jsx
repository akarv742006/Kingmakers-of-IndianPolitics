import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import confetti from 'canvas-confetti';
import { Briefcase, Building, TrendingUp, Coins, Sparkles, CheckCircle2, Lock, Unlock, Award, ChevronRight, Zap, Clock } from 'lucide-react';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 Hours = 7,200,000 ms

export const BusinessEmpirePage = () => {
  const { playerSalaryBalance, setPlayerSalaryBalance } = useGame();

  const [purchasedAssets, setPurchasedAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('mandate_purchased_businesses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [lastBusinessClaimTime, setLastBusinessClaimTime] = useState(() => {
    try {
      const saved = localStorage.getItem('mandate_last_business_claim_time');
      return saved ? Number(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('mandate_purchased_businesses', JSON.stringify(purchasedAssets));
    } catch (e) {
      console.warn('Could not save businesses to localStorage:', e);
    }
  }, [purchasedAssets]);

  // Live 1-Second Countdown Ticker for 2-Hour Cooldown
  useEffect(() => {
    const updateTimer = () => {
      if (!lastBusinessClaimTime) {
        setTimeRemainingMs(0);
        return;
      }
      const elapsed = Date.now() - lastBusinessClaimTime;
      const remaining = Math.max(0, TWO_HOURS_MS - elapsed);
      setTimeRemainingMs(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lastBusinessClaimTime]);

  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const catalogBusinesses = [
    { id: 'cat-mining', title: 'Deccan Coal & Iron Ore Mines', sector: 'MINING', costCrores: 25, hourlyYield: 1500000, icon: '⛏️', desc: 'Leased mineral mining blocks in Odisha & Jharkhand generating heavy industrial royalties.' },
    { id: 'cat-cine', title: 'Bollywood Cine Studio & Multiplex Chain', sector: 'CINE_INDUSTRY', costCrores: 15, hourlyYield: 900000, icon: '🎬', desc: 'Nationwide 500-screen theater chain, film production studio, and OTT streaming network.' },
    { id: 'cat-cricket', title: 'Royal Sovereign Cricket Franchise (IPL)', sector: 'CRICKET_SPORTS', costCrores: 40, hourlyYield: 2800000, icon: '🏏', desc: 'Premier League Cricket Franchise team ownership, stadium broadcasting rights & merchandise.' },
    { id: 'cat-realestate', title: 'Cyber City Commercial IT Towers', sector: 'REAL_ESTATE', costCrores: 30, hourlyYield: 1800000, icon: '🏢', desc: 'Grade-A commercial office space in Bengaluru & Gurugram tech hubs.' },
    { id: 'cat-tech', title: '5G Telecom & Cloud Infrastructure', sector: 'TECH_TELECOM', costCrores: 20, hourlyYield: 1200000, icon: '🚀', desc: 'Nationwide fiber optic network, data centers, and digital payment gateway.' },
  ];

  const totalHourlyYield = purchasedAssets.reduce((sum, a) => sum + (a.hourlyYield * a.level), 0);
  const total2HourYield = totalHourlyYield * 2;
  const totalEmpireValue = purchasedAssets.reduce((sum, a) => sum + a.costCrores, 0);

  const handleBuyCatalog = (biz) => {
    const costInRupees = biz.costCrores * 10000000;
    
    // STRICT NON-NEGATIVE MONEY CHECK
    if ((playerSalaryBalance || 0) < costInRupees) {
      setStatusMessage(`⚠️ Insufficient Game Money! Transaction blocked to prevent negative balance (Requires ₹${biz.costCrores} Cr).`);
      return;
    }

    // Deduct safely (never negative)
    setPlayerSalaryBalance((bal) => Math.max(0, bal - costInRupees));

    setPurchasedAssets((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        title: biz.title,
        sector: biz.sector,
        costCrores: biz.costCrores,
        hourlyYield: biz.hourlyYield,
        level: 1,
        icon: biz.icon,
        color: biz.sector === 'MINING' ? 'from-amber-600 to-yellow-700' : biz.sector === 'CINE_INDUSTRY' ? 'from-purple-600 to-pink-600' : biz.sector === 'CRICKET_SPORTS' ? 'from-sky-500 to-blue-600' : 'from-emerald-600 to-teal-600',
      },
    ]);

    setStatusMessage(`🎉 Congratulations! Successfully acquired ${biz.title} for ₹${biz.costCrores} Cr! You can now collect 2-hour business profits.`);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const handleUpgradeAsset = (assetId) => {
    const asset = purchasedAssets.find((a) => a.id === assetId);
    if (!asset) return;

    const upgradeCost = Math.round(asset.costCrores * 0.4 * 10000000);
    
    // STRICT NON-NEGATIVE MONEY CHECK
    if ((playerSalaryBalance || 0) < upgradeCost) {
      setStatusMessage(`⚠️ Insufficient Game Money! Need ₹${(upgradeCost / 10000000).toFixed(1)} Cr to upgrade ${asset.title}. Your balance cannot go negative.`);
      return;
    }

    setPlayerSalaryBalance((bal) => Math.max(0, bal - upgradeCost));
    setPurchasedAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return { ...a, level: a.level + 1 };
        }
        return a;
      })
    );
    setStatusMessage(`⚡ Upgraded ${asset.title} to Level ${asset.level + 1}! Yield increased by +25%!`);
  };

  const handleClaimYield = () => {
    if (purchasedAssets.length === 0) {
      setStatusMessage(`⚠️ No active business owned. You must first buy a business from the Store Catalog!`);
      return;
    }

    if (totalHourlyYield <= 0) {
      setStatusMessage(`⚠️ No active business yield available. Buy a business first to start earning!`);
      return;
    }

    if (timeRemainingMs > 0 && lastBusinessClaimTime > 0) {
      setStatusMessage(`⏳ 2-Hour Cooldown Active! Next business earnings collection available in ${formatCountdown(timeRemainingMs)}.`);
      return;
    }

    // Collect 2-Hour accumulated yield (2x hourly yield)
    setPlayerSalaryBalance((bal) => Math.max(0, (bal || 0) + total2HourYield));
    const now = Date.now();
    setLastBusinessClaimTime(now);
    try {
      localStorage.setItem('mandate_last_business_claim_time', String(now));
    } catch (e) {}

    setStatusMessage(`🎉 2-Hour Business Profits Collected! +₹${total2HourYield.toLocaleString()} added to your game money balance!`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const isClaimReady = purchasedAssets.length > 0 && totalHourlyYield > 0 && timeRemainingMs === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0">
            💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Business & Corporate Empire Hub</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                2-Hour Earnings Rule
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Buy businesses with game money to unlock corporate holdings. Business earnings accumulate every 2 hours (Max 1 collection per 2 hours). Negative balances are strictly disabled!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Personal Balance</div>
            <div className="text-xl font-black text-amber-400 font-mono">₹ {(playerSalaryBalance || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ⏳ 2-HOUR COOLDOWN TIMER NOTICE BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xl font-bold">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-2 font-display">
              2-Hour Profit Collection Cycle
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                7200s Rule
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {purchasedAssets.length === 0 
                ? 'Buy a business from the catalog below to unlock 2-hour profits.' 
                : isClaimReady 
                  ? '✨ 2-Hour Business Earnings Ready for Collection!' 
                  : `⏳ Next 2-Hour Collection unlocks in ${formatCountdown(timeRemainingMs)}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleClaimYield}
          disabled={!isClaimReady}
          className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 shrink-0 ${
            isClaimReady
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-950/50 transform active:scale-95'
              : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>
            {purchasedAssets.length === 0
              ? '🔒 Buy Business First'
              : isClaimReady
                ? `💰 COLLECT 2-HR PROFITS (+₹${total2HourYield.toLocaleString()})`
                : `⏳ AVAILABLE IN ${formatCountdown(timeRemainingMs)}`}
          </span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-slate-400 hover:text-white font-mono text-[10px] underline">
            DISMISS
          </button>
        </div>
      )}

      {/* Top 3 Empire Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Empire Valuation */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Total Business Assets</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">₹{totalEmpireValue} Cr</div>
            <span className="text-[10px] text-slate-400">Valuation across {purchasedAssets.length} Sectors</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl font-bold">
            🏢
          </div>
        </div>

        {/* 2-Hour Yield */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">2-Hour Profit Yield</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              +₹{total2HourYield.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300">Accumulated Every 2 Hours</span>
          </div>
          <button
            onClick={handleClaimYield}
            disabled={!isClaimReady}
            className={`px-3.5 py-2 rounded-xl font-black text-xs transition shadow flex items-center gap-1 shrink-0 ${
              isClaimReady ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>{isClaimReady ? 'Collect' : 'Wait 2h'}</span>
          </button>
        </div>

        {/* Industry Diversity */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Active Portfolios</span>
            <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">{purchasedAssets.length} Holdings</div>
            <span className="text-[10px] text-sky-300">Mining • Cine • Cricket • Real Estate</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xl font-bold">
            📈
          </div>
        </div>
      </div>

      {/* Active Business Empire Holdings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <Briefcase className="w-5 h-5 text-amber-400" />
            My Active Corporate Holdings ({purchasedAssets.length})
          </h3>
          <button
            onClick={handleClaimYield}
            disabled={!isClaimReady}
            className={`px-4 py-2 rounded-xl text-xs font-black shadow flex items-center gap-1.5 ${
              isClaimReady
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>
              {isClaimReady 
                ? `Collect 2-Hr Yield (+₹${total2HourYield.toLocaleString()})`
                : `Cooldown Active (${formatCountdown(timeRemainingMs)})`}
            </span>
          </button>
        </div>

        {purchasedAssets.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs space-y-2">
            <Lock className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
            <div className="text-sm font-bold text-white">No Businesses Owned Yet</div>
            <p className="max-w-md mx-auto text-slate-400">
              You must first purchase a business from the Store Catalog below using your game money to unlock corporate holdings and start earning continuous passive income.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {purchasedAssets.map((asset) => {
              const yieldAmount = asset.hourlyYield * asset.level;
              const upgradePriceCrores = (asset.costCrores * 0.4).toFixed(1);

              return (
                <div
                  key={asset.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{asset.icon}</span>
                      <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-300 uppercase">
                        LEVEL {asset.level}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white font-display">{asset.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mt-0.5">
                        SECTOR: {asset.sector.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Valuation:</span>
                        <span className="text-white font-bold">₹{asset.costCrores} Cr</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Hourly Yield:</span>
                        <span className="font-bold">+₹{yieldAmount.toLocaleString()}/hr</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgradeAsset(asset.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upgrade Asset (₹{upgradePriceCrores} Cr)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Business Investments Store Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <Building className="w-5 h-5 text-sky-400" />
            Corporate Store Catalog (Buy to Unlock Earnings)
          </h3>
          <span className="text-xs text-amber-400 font-mono font-bold border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
            No Negative Money Allowed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogBusinesses.map((biz) => {
            const isOwned = purchasedAssets.some(a => a.sector === biz.sector || a.title === biz.title);

            return (
              <div key={biz.id} className={`bg-slate-950 border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 ${
                isOwned ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800/80'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{biz.icon}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                      isOwned 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isOwned ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                      <span>{isOwned ? 'UNLOCKED & EARNING' : 'LOCKED STORE ITEM'}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white font-display">{biz.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">{biz.desc}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Acquisition Price:</span>
                      <strong className="text-amber-400">₹{biz.costCrores} Cr</strong>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Expected Yield:</span>
                      <strong className="text-emerald-400">+₹{biz.hourlyYield.toLocaleString()}/hr</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyCatalog(biz)}
                  className={`w-full py-2.5 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${
                    isOwned
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                  }`}
                >
                  {isOwned ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Buy Additional Block (₹{biz.costCrores} Cr)</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Acquire & Unlock (₹{biz.costCrores} Cr)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

