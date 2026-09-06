import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { GovernmentCrisisDesk } from '../parliament/GovernmentCrisisDesk.jsx';
import { Briefcase, Coins, ShieldAlert, Building, CheckCircle2, TrendingUp } from 'lucide-react';

const ALL_GOVERNMENTS_LIST = [
  { region: 'Union / National Govt', name: 'Government of India (Central Cabinet)', leader: 'PM Narendra Modi', party: 'BJP (NDA Coalition)', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Uttar Pradesh', leader: 'CM Yogi Adityanath', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Maharashtra', leader: 'CM Eknath Shinde / Devendra Fadnavis', party: 'Shiv Sena / BJP (Mahayuti)', color: '#F57C00', symbol: '🏹' },
  { region: 'State', name: 'West Bengal', leader: 'CM Mamata Banerjee', party: 'TMC', color: '#2E7D32', symbol: '🌱' },
  { region: 'State', name: 'Tamil Nadu', leader: 'CM M. K. Stalin', party: 'DMK (I.N.D.I.A)', color: '#D32F2F', symbol: '☀️' },
  { region: 'State', name: 'Bihar', leader: 'CM Nitish Kumar', party: 'JD(U) / BJP (NDA)', color: '#388E3C', symbol: '🎯' },
  { region: 'State', name: 'Karnataka', leader: 'CM Siddaramaiah', party: 'INC (I.N.D.I.A)', color: '#1976D2', symbol: '✋' },
  { region: 'State', name: 'Gujarat', leader: 'CM Bhupendra Patel', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Rajasthan', leader: 'CM Bhajan Lal Sharma', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Madhya Pradesh', leader: 'CM Mohan Yadav', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Kerala', leader: 'CM Pinarayi Vijayan', party: 'CPI(M) (LDF)', color: '#B71C1C', symbol: '⚒️' },
  { region: 'State', name: 'Telangana', leader: 'CM A. Revanth Reddy', party: 'INC', color: '#1976D2', symbol: '✋' },
  { region: 'State', name: 'Andhra Pradesh', leader: 'CM N. Chandrababu Naidu', party: 'TDP / BJP (NDA)', color: '#FDD835', symbol: '🚲' },
  { region: 'State', name: 'Odisha', leader: 'CM Mohan Charan Majhi', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Punjab', leader: 'CM Bhagwant Mann', party: 'AAP', color: '#00BCD4', symbol: '🧹' },
  { region: 'Union Territory', name: 'Delhi', leader: 'CM Arvind Kejriwal / Atishi', party: 'AAP', color: '#00BCD4', symbol: '🧹' },
  { region: 'State', name: 'Jharkhand', leader: 'CM Hemant Soren', party: 'JMM / INC', color: '#1B5E20', symbol: '🏹' },
  { region: 'State', name: 'Assam', leader: 'CM Himanta Biswa Sarma', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Chhattisgarh', leader: 'CM Vishnu Deo Sai', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Haryana', leader: 'CM Nayab Singh Saini', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Himachal Pradesh', leader: 'CM Sukhvinder Singh Sukhu', party: 'INC', color: '#1976D2', symbol: '✋' },
  { region: 'State', name: 'Uttarakhand', leader: 'CM Pushkar Singh Dhami', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Jammu and Kashmir', leader: 'CM Omar Abdullah', party: 'JKNC / INC', color: '#D84315', symbol: '🪓' },
  { region: 'State', name: 'Goa', leader: 'CM Pramod Sawant', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Tripura', leader: 'CM Manik Saha', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Meghalaya', leader: 'CM Conrad Sangma', party: 'NPP (NDA)', color: '#F4511E', symbol: '📖' },
  { region: 'State', name: 'Manipur', leader: 'CM N. Biren Singh', party: 'BJP', color: '#FF9933', symbol: '🪷' },
  { region: 'State', name: 'Sikkim', leader: 'CM Prem Singh Tamang', party: 'SKM', color: '#0288D1', symbol: '⚽' },
];

export const GovernmentCabinetPage = () => {
  const {
    unionBudgetAllocations,
    stateBudgetAllocations,
    allocateCentralAndStateBudgets,
    governmentApproval,
    selectedPartyId,
    parties,
  } = useGame();

  const [defence, setDefence] = useState(unionBudgetAllocations.defence || 620000);
  const [infra, setInfra] = useState(unionBudgetAllocations.infrastructure || 450000);
  const [health, setHealth] = useState(unionBudgetAllocations.healthcare || 210000);
  const [agri, setAgri] = useState(unionBudgetAllocations.agriculture || 180000);
  const [statusMessage, setStatusMessage] = useState('');
  const [govtFilter, setGovtFilter] = useState('');

  const handleSaveBudget = (e) => {
    e.preventDefault();
    allocateCentralAndStateBudgets(
      { defence, infrastructure: infra, healthcare: health, agriculture: agri, education: 150000, ruralDev: 140000 },
      stateBudgetAllocations
    );
    setStatusMessage('Union Budget allocations updated and gazetted successfully!');
  };

  const filteredGovts = ALL_GOVERNMENTS_LIST.filter(
    (g) =>
      g.name.toLowerCase().includes(govtFilter.toLowerCase()) ||
      g.leader.toLowerCase().includes(govtFilter.toLowerCase()) ||
      g.party.toLowerCase().includes(govtFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl font-black shrink-0">
            💼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Union & State Executive Governments</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                Federal Secretariat
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Inspect ruling governments across all 28 Indian States & Central Union Government, handle events if in power, or organize strikes if in opposition.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shrink-0">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Govt Approval Rating</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{governmentApproval}%</div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* National Crisis Management & Event Desk */}
      <GovernmentCrisisDesk />

      {/* All Governments List (Union + All States & UTs) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
              <Building className="w-5 h-5 text-emerald-400" />
              All Governments of India List (Union + 28 States & UTs)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete directory of current ruling political parties and Chief Ministers across the Republic.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search state, CM or party..."
            value={govtFilter}
            onChange={(e) => setGovtFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl sm:w-64 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredGovts.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  {g.region}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              </div>

              <div className="font-extrabold text-sm text-white flex items-center justify-between">
                <span>{g.name}</span>
                <span className="text-base">{g.symbol}</span>
              </div>

              <div className="text-xs space-y-1 pt-1 border-t border-slate-900">
                <div className="text-slate-300 font-bold">
                  {g.leader}
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Ruling Govt:</span>
                  <span className="font-bold" style={{ color: g.color }}>
                    {g.party}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Union Budget Allocation Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <Coins className="w-5 h-5 text-amber-400" />
            Union Budget Allocation Center (₹ Crores)
          </h3>
        </div>

        <form onSubmit={handleSaveBudget} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Defence Allocation:</label>
            <input
              type="number"
              value={defence}
              onChange={(e) => setDefence(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold p-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Infrastructure & Transport:</label>
            <input
              type="number"
              value={infra}
              onChange={(e) => setInfra(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-sky-400 font-mono font-bold p-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Healthcare & Sanitation:</label>
            <input
              type="number"
              value={health}
              onChange={(e) => setHealth(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold p-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Agriculture & MSP Subsidy:</label>
            <input
              type="number"
              value={agri}
              onChange={(e) => setAgri(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 text-orange-400 font-mono font-bold p-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="lg:col-span-4 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              Authorize & Gazette Union Budget Allocations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
