import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { P2PMultiplayerModal } from '../modals/P2PMultiplayerModal.jsx';
import {
  Radio,
  Vote,
  Scale,
  Newspaper,
  ShieldCheck,
  Flame,
  PlusCircle,
  Play,
  Pause,
  FastForward,
  Trophy,
  Palette,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Sun,
  Crown,
  LayoutGrid,
  Globe2,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenNewPartyModal }) => {
  const {
    theme,
    setTheme,
    role,
    setRole,
    selectedPartyId,
    setSelectedPartyId,
    switchParty,
    parties,
    seats,
    electionPhase,
    currentPhaseNumber,
    isSimulationRunning,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    advanceElectionPhase,
    governmentApproval,
    isP2PConnected,
    p2pRoomCode,
  } = useGame();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isP2PModalOpen, setIsP2PModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'royal-sovereign');
  }, [theme]);

  const isLightTheme = theme && theme.startsWith('light');

  const seatCounts = {};
  seats.forEach((seat) => {
    seatCounts[seat.leadingPartyId] = (seatCounts[seat.leadingPartyId] || 0) + 1;
  });

  const leadingPartyEntry = Object.entries(seatCounts).sort((a, b) => b[1] - a[1])[0] || ['bjp', 0];
  const leadingPartyObj = parties.find((p) => p.id === leadingPartyEntry[0]) || parties[0];
  const activePartyObj = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const activePC = activePartyObj.politicalCapital ?? 100;

  const roleConfigs = [
    { id: 'politician', label: 'Party Leader / MP', icon: Vote, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', desc: 'Campaign, form coalitions & propose laws' },
    { id: 'president', label: 'President & Governor', icon: Crown, color: 'text-amber-300 border-amber-500/30 bg-amber-500/10', desc: 'Presidential Assent, Ordinances & Art 356' },
    { id: 'eci', label: 'Election Commission', icon: ShieldCheck, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', desc: 'Party approvals, MCC & 7 voting phases' },
    { id: 'judge', label: 'Supreme Court Judge', icon: Scale, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', desc: 'Adjudicate writs, anti-defection & stays' },
    { id: 'media', label: 'Media House Chief', icon: Newspaper, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10', desc: 'Broadcast news, exit polls & fact-checks' },
    { id: 'admin', label: 'Simulation Master', icon: Flame, color: 'text-red-400 border-red-500/30 bg-red-500/10', desc: 'God mode, speed clock & crisis injector' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d18]/95 backdrop-blur-xl border-b border-amber-500/20 text-white shadow-2xl transition-all">
      {/* Top Mini Live HUD Strip */}
      <div className="bg-[#050811] px-4 lg:px-8 py-1 flex items-center justify-between text-xs font-mono border-b border-slate-800/60 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 tracking-wide text-[11px]">
            <Crown className="w-3 h-3 text-amber-400 animate-pulse" />
            LOK SABHA 2026
          </span>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span>Phase:</span>
            <strong className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900 font-extrabold text-amber-300">
              {electionPhase === 'VOTING_PHASE' ? `Phase ${currentPhaseNumber}/7` : electionPhase.replace(/_/g, ' ')}
            </strong>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span>Govt Approval:</span>
            <span
              className={`px-2 py-0.5 rounded font-black text-slate-950 text-[11px] ${
                governmentApproval >= 60
                  ? 'bg-emerald-400'
                  : governmentApproval >= 45
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              }`}
            >
              {governmentApproval}%
            </span>
          </div>

          {role === 'politician' && (
            <>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>PC: <strong className="text-white">{activePC}</strong>/100</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Leading:</span>
            <strong style={{ color: leadingPartyObj.color }} className="font-extrabold">
              {leadingPartyObj.shortName} ({leadingPartyEntry[1]} / 543)
            </strong>
          </div>

          {/* Speed & Pause */}
          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={toggleSimulation}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 transition"
              title={isSimulationRunning ? 'Pause Engine' : 'Resume Engine'}
            >
              {isSimulationRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 5 ? 1 : simulationSpeed + 1)}
              className="px-1.5 py-0.5 text-[10px] font-bold text-amber-400 hover:bg-slate-800 rounded flex items-center gap-0.5"
            >
              <FastForward className="w-3 h-3" /> {simulationSpeed}x
            </button>
          </div>
        </div>
      </div>

      {/* Main Consolidated Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0 overflow-hidden">
            <img
              src="https://cdn.discordapp.com/attachments/1538232204956532829/1547676199356997775/1b6aa2012-57c8-48a2-93c4-c4c2231d233c.png?ex=6aa4f208&is=6aa3a088&hm=93da735dadad4601564ceefcec3e94e4b1c8cc21f4765cd10c0dc6872e6e6cf2"
              alt="Mandate Logo"
              className="w-full h-full object-cover rounded-[9px]"
            />
          </div>
          <div>
            <h1 className="font-black text-base lg:text-lg tracking-tight font-display text-white flex items-center gap-2">
              KINGMAKERS <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest font-mono">OF INDIAN POLITICS</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden lg:block">Lok Sabha Sovereign Engine</p>
          </div>
        </div>

        {/* Primary Navigation Desk Switcher (Desktop Tabs) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'workspace'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Control Desk ({role.toUpperCase()})
          </button>

          <button
            onClick={() => setActiveTab('elections')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'elections'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Elections Hub
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            543 Results
          </button>
        </nav>

        {/* Right Side Actions & Settings */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Party Selector (if Politician) */}
          {role === 'politician' && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <select
                value={selectedPartyId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val !== selectedPartyId) {
                    if (window.confirm("⚠️ ANTI-DEFECTION WARNING!\n\nSwitching your party allegiance will automatically trigger 10th Schedule Anti-Defection Law: You will lose your MLA/MP seat, candidate nominations, and all executive posts in your former party.\n\nDo you want to proceed?")) {
                      const res = switchParty(val);
                      if (res && res.message) alert(res.message);
                    }
                  }
                }}
                className="bg-transparent text-amber-300 font-bold px-2 py-1 focus:outline-none cursor-pointer text-xs"
              >
                {parties.map((party) => (
                  <option key={party.id} value={party.id} className="bg-slate-950 text-white">
                    {party.symbol} {party.shortName}
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenNewPartyModal}
                className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition"
                title="Register New Custom Party"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* P2P Multiplayer Button */}
          <button
            onClick={() => setIsP2PModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              isP2PConnected
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-emerald-600/30 border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-600/50'
            }`}
            title="P2P Multiplayer Room Control"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{isP2PConnected ? `🟢 P2P: ${p2pRoomCode}` : '⚡ MULTIPLAYER (P2P)'}</span>
          </button>

          {/* Theme Dropdown */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {isLightTheme ? <Sun className="w-3.5 h-3.5 text-amber-400 ml-1.5" /> : <Palette className="w-3.5 h-3.5 text-amber-400 ml-1.5" />}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent text-slate-300 font-medium px-2 py-1 focus:outline-none cursor-pointer text-xs"
              title="UI Theme"
            >
              <option value="royal-sovereign" className="bg-slate-950 text-amber-300">👑 Royal Gold</option>
              <option value="saffron-sovereign" className="bg-slate-950 text-amber-400">🇮🇳 Saffron Dark</option>
              <option value="light-sovereign" className="bg-slate-100 text-slate-900">☀️ Saffron Light</option>
              <option value="light-parliamentary" className="bg-emerald-50 text-slate-900">🏛️ Emerald Light</option>
              <option value="parliamentary-emerald" className="bg-slate-950 text-emerald-400">🏛️ Emerald Dark</option>
              <option value="midnight-obsidian" className="bg-slate-950 text-indigo-400">⚡ Obsidian Dark</option>
              <option value="rashtrapati-bronze" className="bg-slate-950 text-amber-500">📜 Bronze Dark</option>
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-bold transition text-amber-300"
            >
              <span className="capitalize">{roleConfigs.find((r) => r.id === role)?.label.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 bg-slate-950/95 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-black text-amber-400 px-3 py-1.5 border-b border-slate-800/80 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Role Desk</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1 mt-1.5">
                  {roleConfigs.map((r) => {
                    const Icon = r.icon;
                    const isActive = role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-2.5 ${
                          isActive
                            ? 'bg-slate-900 border border-amber-500/40 text-white font-bold'
                            : 'hover:bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border ${r.color} shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-black flex items-center justify-between">
                            {r.label}
                            {isActive && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Next Phase Action Button */}
          <button
            onClick={advanceElectionPhase}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-1 shrink-0"
          >
            <span>Next Phase</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-amber-500/20 p-4 space-y-4 bg-slate-950">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setActiveTab('workspace'); setIsMobileMenuOpen(false); }}
              className={`p-2 rounded-xl text-xs font-bold text-center border ${activeTab === 'workspace' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              Control Desk
            </button>
            <button
              onClick={() => { setActiveTab('elections'); setIsMobileMenuOpen(false); }}
              className={`p-2 rounded-xl text-xs font-bold text-center border ${activeTab === 'elections' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              Elections
            </button>
            <button
              onClick={() => { setActiveTab('results'); setIsMobileMenuOpen(false); }}
              className={`p-2 rounded-xl text-xs font-bold text-center border ${activeTab === 'results' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              543 Results
            </button>
          </div>

          {role === 'politician' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Active Party:</label>
              <select
                value={selectedPartyId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val !== selectedPartyId) {
                    if (window.confirm("⚠️ ANTI-DEFECTION WARNING!\n\nSwitching your party allegiance will automatically trigger 10th Schedule Anti-Defection Law: You will lose your MLA/MP seat, candidate nominations, and all executive posts in your former party.\n\nDo you want to proceed?")) {
                      const res = switchParty(val);
                      if (res && res.message) alert(res.message);
                    }
                  }
                }}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-amber-300"
              >
                {parties.map((party) => (
                  <option key={party.id} value={party.id} className="bg-slate-950 text-white">
                    {party.symbol} {party.shortName} - {party.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={advanceElectionPhase}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow text-center"
            >
              Advance Phase ➔
            </button>
          </div>
        </div>
      )}

      {/* P2P Multiplayer Room Control Modal */}
      <P2PMultiplayerModal isOpen={isP2PModalOpen} onClose={() => setIsP2PModalOpen(false)} />
    </header>
  );
};
