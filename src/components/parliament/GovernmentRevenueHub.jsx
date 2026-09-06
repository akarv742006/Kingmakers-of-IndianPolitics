import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Landmark, Coins, TrendingUp, Building2, ShieldCheck, Zap, Award, CheckCircle2, DollarSign } from 'lucide-react';

export const GovernmentRevenueHub = () => {
  const {
    role,
    userHandle,
    parties,
    selectedPartyId,
    governingPartyId,
    unionBudgetAllocations,
    publishNewsArticle,
  } = useGame();

  const [treasuryBalanceCrores, setTreasuryBalanceCrores] = useState(145000);
  const [actionStatus, setActionStatus] = useState('');
  const [historyLog, setHistoryLog] = useState([
    { id: 'h-1', title: 'Q3 Direct Tax & GST Collection', amount: 12500, time: '10:00 AM' },
    { id: 'h-2', title: '5G Spectrum Auction Release', amount: 25000, time: 'Yesterday' },
  ]);

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const isGovt = selectedPartyId === governingPartyId || role === 'admin' || role === 'president';

  const handleGenerateRevenue = (title, amountCrores, newsDesc) => {
    setTreasuryBalanceCrores((prev) => prev + amountCrores);
    const newLog = {
      id: `rev-${Date.now()}`,
      title,
      amount: amountCrores,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistoryLog((prev) => [newLog, ...prev]);

    setActionStatus(`🎉 Success! Generated +₹${amountCrores.toLocaleString()} Cr Union Treasury Revenue via ${title}!`);

    publishNewsArticle({
      headline: `💰 GOVERNMENT TREASURY REVENUE: ${title} Generates +₹${amountCrores.toLocaleString()} Cr`,
      content: `Union Finance Ministry & Government Treasury: ${newsDesc} Total National Treasury Balance increased to ₹${(treasuryBalanceCrores + amountCrores).toLocaleString()} Cr.`,
      author: 'Union Ministry of Finance & RBI',
      bias: 'PRO_GOVT',
      impactOnPartyId: governingPartyId,
      approvalChange: 3,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl font-bold shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                EXECUTIVE TREASURY
              </span>
              <span className="text-xs text-slate-400 font-mono">Government Revenue & Earning Engine</span>
            </div>
            <h3 className="text-xl font-black text-white font-display mt-0.5">
              Union & State Government Revenue Generation Hub
            </h3>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/30 font-mono text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">NATIONAL TREASURY BALANCE</div>
          <div className="text-lg font-black text-emerald-400">
            ₹{treasuryBalanceCrores.toLocaleString()} Cr
          </div>
        </div>
      </div>

      {actionStatus && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionStatus}</span>
        </div>
      )}

      {/* Revenue Earning Actions Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-amber-400" /> Government Revenue Earning Opportunities (Click to Earn):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action 1: GST & Tax Collection */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💰</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +₹12,500 Cr
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">GST & Direct Income Tax Revenue</div>
              <p className="text-xs text-slate-400 mt-1">Collect monthly GST, corporate taxes, and customs duties into national reserves.</p>
            </div>
            <button
              onClick={() =>
                handleGenerateRevenue(
                  'Quarterly GST & Income Tax Collection',
                  12500,
                  'Record GST and income tax receipts collected across all 28 states and union territories.'
                )
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" /> Collect Tax Revenue (+₹12,500 Cr)
            </button>
          </div>

          {/* Action 2: 5G Spectrum Auction */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📡</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +₹25,000 Cr
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">5G / 6G Spectrum Auction</div>
              <p className="text-xs text-slate-400 mt-1">Lease telecom radio frequency bands to private mobile network operators.</p>
            </div>
            <button
              onClick={() =>
                handleGenerateRevenue(
                  '5G Spectrum Allocation Auction',
                  25000,
                  'High-speed 5G & satellite spectrum bands auctioned to telecom consortia.'
                )
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Launch Spectrum Auction (+₹25,000 Cr)
            </button>
          </div>

          {/* Action 3: Natural Resource Mining Block Lease */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">⛏️</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +₹18,000 Cr
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">Lithium & Coal Mining Blocks Lease</div>
              <p className="text-xs text-slate-400 mt-1">Auction mineral rights for Jammu Lithium reserves and Commercial Coal fields.</p>
            </div>
            <button
              onClick={() =>
                handleGenerateRevenue(
                  'Commercial Mining Lease Auction',
                  18000,
                  'Lithium and critical mineral extraction blocks leased to mining corporations.'
                )
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Landmark className="w-4 h-4" /> Lease Mining Blocks (+₹18,000 Cr)
            </button>
          </div>

          {/* Action 4: PSU Disinvestment */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🏢</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +₹22,000 Cr
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">PSU Asset Disinvestment</div>
              <p className="text-xs text-slate-400 mt-1">Offload minority stakes in Coal India, LIC & national highway toll assets.</p>
            </div>
            <button
              onClick={() =>
                handleGenerateRevenue(
                  'PSU Share Disinvestment Offer',
                  22000,
                  'Minority equity stakes in central public sector enterprises monetized into capital funds.'
                )
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4" /> Disinvest PSU Equity (+₹22,000 Cr)
            </button>
          </div>

          {/* Action 5: Sovereign Green Bonds Issue */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📜</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +₹30,000 Cr
              </span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">Sovereign Infrastructure Green Bonds</div>
              <p className="text-xs text-slate-400 mt-1">Float government green bonds to fund clean energy & high-speed rail projects.</p>
            </div>
            <button
              onClick={() =>
                handleGenerateRevenue(
                  'Sovereign Infrastructure Bond Issue',
                  30000,
                  'Sovereign green bonds oversubscribed by national and international institutional investors.'
                )
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" /> Float Green Bonds (+₹30,000 Cr)
            </button>
          </div>
        </div>
      </div>

      {/* Revenue History Log */}
      <div className="space-y-2 border-t border-slate-800 pt-4">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Recent Treasury Revenue Inflows:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {historyLog.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <div className="font-bold text-white">{log.title}</div>
                <div className="text-[10px] text-slate-500 font-mono">{log.time}</div>
              </div>
              <span className="font-mono font-black text-emerald-400 text-xs">+₹{log.amount.toLocaleString()} Cr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
