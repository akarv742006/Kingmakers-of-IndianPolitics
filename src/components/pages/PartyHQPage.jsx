import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Users, Building, GitBranch, GitMerge, Coins, ShieldCheck, CheckCircle2, Trophy, Crown, Award, Plus, UserCheck, Megaphone, Landmark, ArrowRight, UserPlus } from 'lucide-react';
import { PartyFundTransferModal } from '../politician/PartyFundTransferModal.jsx';

export const PartyHQPage = () => {
  const {
    parties,
    selectedPartyId,
    submitCustomPartyApplication,
    userHandle,
    assignPartyPost,
    transferPartyLeadership,
    announceMLACandidate,
    announceMinistryPortfolio,
    partyNominations,
    ministryAnnouncements,
  } = useGame();

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const [partyName, setPartyName] = useState('');
  const [shortName, setShortName] = useState('');
  const [symbol, setSymbol] = useState('⚡');
  const [ideology, setIdeology] = useState('Centrist');
  const [leaderName, setLeaderName] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  // Party Leader Action States
  const [memberHandlePost, setMemberHandlePost] = useState('');
  const [assignedPostRole, setAssignedPostRole] = useState('Vice President');
  const [newLeaderTransferName, setNewLeaderTransferName] = useState('');
  const [nomConstituency, setNomConstituency] = useState('Varanasi');
  const [nomCandidateName, setNomCandidateName] = useState('');
  const [ministryPortfolioName, setMinistryPortfolioName] = useState('Home Affairs');
  const [ministerPersonName, setMinisterPersonName] = useState('');

  const founderName = activeParty.founder || 'Syama Prasad Mukherjee / L. K. Advani';
  const presidentName = activeParty.president || activeParty.leader || 'J. P. Nadda';
  const vicePresidentName = activeParty.vicePresident || 'B. L. Santhosh';

  const partyMembersLeaderboard = [
    { rank: 1, name: userHandle || '@Candidate', role: 'Party President / Supreme Leader', points: 1450, loyalty: '100%', seat: 'National Seat' },
    { rank: 2, name: `@${presidentName.replace(/\s+/g, '')}_Official`, role: 'Party President & Strategy Chief', points: 1380, loyalty: '98%', seat: 'National HQ' },
    { rank: 3, name: `@${vicePresidentName.replace(/\s+/g, '')}_VP`, role: 'Vice President & General Secretary', points: 1250, loyalty: '96%', seat: 'Organization Wing' },
    { rank: 4, name: '@CampaignChief_Cadre', role: 'State Election In-Charge', points: 1190, loyalty: '95%', seat: 'State Assembly Desk' },
    { rank: 5, name: '@Spokesperson_Media', role: 'National Media Spokesperson', points: 1120, loyalty: '94%', seat: 'Press Bureau' },
    { rank: 6, name: '@YouthWing_Leader', role: 'Youth Wing President', points: 1080, loyalty: '93%', seat: 'Youth Mobilization' },
  ];

  const handleAssignPostSubmit = (e) => {
    e.preventDefault();
    if (!memberHandlePost.trim()) return;
    const res = assignPartyPost(activeParty.id, memberHandlePost.trim(), assignedPostRole);
    setStatusMessage(res.message);
    setMemberHandlePost('');
  };

  const handleTransferLeadershipSubmit = (e) => {
    e.preventDefault();
    if (!newLeaderTransferName.trim()) return;
    const res = transferPartyLeadership(activeParty.id, newLeaderTransferName.trim());
    setStatusMessage(res.message);
    setNewLeaderTransferName('');
  };

  const handleAnnounceCandidateSubmit = (e) => {
    e.preventDefault();
    if (!nomCandidateName.trim()) return;
    const res = announceMLACandidate(activeParty.id, nomConstituency, nomCandidateName.trim());
    setStatusMessage(res.message);
    setNomCandidateName('');
  };

  const handleAnnounceMinistrySubmit = (e) => {
    e.preventDefault();
    if (!ministerPersonName.trim()) return;
    const res = announceMinistryPortfolio(activeParty.id, ministryPortfolioName, ministerPersonName.trim());
    setStatusMessage(res.message);
    setMinisterPersonName('');
  };

  const handleRegisterParty = (e) => {
    e.preventDefault();
    if (!partyName || !shortName) return;
    submitCustomPartyApplication({
      partyName,
      shortName,
      symbol,
      ideology,
      leaderName,
      manifesto,
    });
    setStatusMessage(`Application submitted to Election Commission of India for ${partyName}!`);
    setPartyName('');
    setShortName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 border shadow-lg"
            style={{ backgroundColor: `${activeParty.color}20`, borderColor: activeParty.color }}
          >
            {activeParty.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">{activeParty.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono font-black text-slate-950" style={{ backgroundColor: activeParty.color }}>
                {activeParty.shortName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ideology: <strong>{activeParty.ideology}</strong> • Central Headquarters Desk
            </p>
          </div>
        </div>

        {/* Party Treasury HUD Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">PARTY TREASURY</div>
            <div className="text-2xl font-black text-amber-400 font-mono">₹{activeParty.fundsInCrores} Cr</div>
          </div>
          <button
            onClick={() => setIsFundModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Deposit / Transfer</span>
          </button>
        </div>
      </div>

      {/* Leadership Desk: Founder, President, Vice President */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Founder */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shrink-0 font-bold">
            👑
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">PARTY FOUNDER</span>
            <div className="font-extrabold text-sm text-white font-display mt-0.5">{founderName}</div>
            <span className="text-[10px] text-amber-300 font-mono font-semibold">Founding Vision & Legacy</span>
          </div>
        </div>

        {/* Party President */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xl shrink-0 font-bold">
            🎖️
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">PARTY PRESIDENT</span>
            <div className="font-extrabold text-sm text-white font-display mt-0.5">{presidentName}</div>
            <span className="text-[10px] text-sky-300 font-mono font-semibold">Supreme Executive Command</span>
          </div>
        </div>

        {/* Vice President */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl shrink-0 font-bold">
            ⚖️
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">VICE PRESIDENT</span>
            <div className="font-extrabold text-sm text-white font-display mt-0.5">{vicePresidentName}</div>
            <span className="text-[10px] text-emerald-300 font-mono font-semibold">Organizational & Cadre Chief</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* PARTY LEADER EXECUTIVE CONTROL DESK */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2 font-display">
            <Crown className="w-5 h-5 text-amber-400" />
            Party President Executive High Command Desk
          </h3>
          <span className="text-xs text-amber-300 font-mono font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            HIGH COMMAND AUTHORITY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Assign Party Post */}
          <form onSubmit={handleAssignPostSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
              <UserCheck className="w-4 h-4 text-sky-400" /> Assign Party Post
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Cadre Handle / Member Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. @Leader_Cadre"
                value={memberHandlePost}
                onChange={(e) => setMemberHandlePost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Designation / Role:</label>
              <select
                value={assignedPostRole}
                onChange={(e) => setAssignedPostRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-sky-300 font-bold p-2 rounded-xl"
              >
                <option value="Vice President">Vice President</option>
                <option value="General Secretary">General Secretary</option>
                <option value="National Media Spokesperson">National Media Spokesperson</option>
                <option value="State Campaign In-Charge">State Campaign In-Charge</option>
                <option value="Party Treasurer">Party Treasurer</option>
                <option value="Youth Wing President">Youth Wing President</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow transition"
            >
              Assign Designation
            </button>
          </form>

          {/* Card 2: Handover Party Leader Post */}
          <form onSubmit={handleTransferLeadershipSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
              <Crown className="w-4 h-4 text-amber-400" /> Transfer Party President Post
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">New Party Leader Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. J. P. Nadda"
                value={newLeaderTransferName}
                onChange={(e) => setNewLeaderTransferName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl"
              />
            </div>
            <p className="text-[10px] text-slate-400">Formally hands over supreme executive command to another cadre leader.</p>
            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition"
            >
              Handover Party Leadership
            </button>
          </form>

          {/* Card 3: Announce MLA / MP Candidate */}
          <form onSubmit={handleAnnounceCandidateSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
              <Megaphone className="w-4 h-4 text-emerald-400" /> Announce MLA/MP Candidate
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Constituency Seat:</label>
              <input
                type="text"
                required
                placeholder="e.g. Varanasi / Wayanad / New Delhi"
                value={nomConstituency}
                onChange={(e) => setNomConstituency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Candidate Leader Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Party Candidate"
                value={nomCandidateName}
                onChange={(e) => setNomCandidateName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-emerald-300 font-bold p-2 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition"
            >
              Field Candidate
            </button>
          </form>

          {/* Card 4: Announce Cabinet Ministry Portfolio */}
          <form onSubmit={handleAnnounceMinistrySubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
              <Landmark className="w-4 h-4 text-purple-400" /> Announce Cabinet Ministry
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Cabinet Ministry Portfolio:</label>
              <select
                value={ministryPortfolioName}
                onChange={(e) => setMinistryPortfolioName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-purple-300 font-bold p-2 rounded-xl"
              >
                <option value="Home Affairs">Home Affairs Ministry</option>
                <option value="Finance Ministry">Finance Ministry</option>
                <option value="Defence Ministry">Defence Ministry</option>
                <option value="External Affairs">External Affairs Ministry</option>
                <option value="Railways & Roads">Railways & Transport Ministry</option>
                <option value="Education & Healthcare">Education & Health Ministry</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Nominated Minister Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Amit Shah"
                value={ministerPersonName}
                onChange={(e) => setMinisterPersonName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition"
            >
              Announce Cabinet Minister
            </button>
          </form>
        </div>

        {/* Live Announcements Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          {/* Candidate Nominations */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Official Candidate Fieldings ({partyNominations.length})</span>
              <span className="text-[10px] font-mono text-slate-500">ECI BULLETIN</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {partyNominations.map((nom) => (
                <div key={nom.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-white">{nom.candidateName}</span>
                    <span className="text-slate-400"> for </span>
                    <span className="text-amber-300 font-bold">{nom.constituencyName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{nom.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ministry Announcements */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-purple-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Shadow Cabinet & Ministry Portfolios ({ministryAnnouncements.length})</span>
              <span className="text-[10px] font-mono text-slate-500">GOVT BULLETIN</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {ministryAnnouncements.map((min) => (
                <div key={min.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-white">{min.ministerName}</span>
                    <span className="text-slate-400"> - </span>
                    <span className="text-purple-300 font-bold">{min.portfolioName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{min.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intra-Party Members Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <Trophy className="w-5 h-5 text-amber-400" />
            Intra-Party Members Leaderboard & Cadre Ranking
          </h3>
          <span className="text-xs text-amber-400 font-mono font-bold">Top Party Contributors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Member Handle</th>
                <th className="p-3">Designation / Role</th>
                <th className="p-3">Constituency Seat</th>
                <th className="p-3 text-center">Party Loyalty</th>
                <th className="p-3 text-right">Contribution Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {partyMembersLeaderboard.map((m) => (
                <tr key={m.rank} className="hover:bg-slate-950/60 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">#{m.rank}</td>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {m.rank === 1 && <span>👑</span>}
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{m.role}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{m.seat}</td>
                  <td className="p-3 text-center text-emerald-400 font-mono font-bold">{m.loyalty}</td>
                  <td className="p-3 text-right font-mono font-black text-amber-300">{m.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Manifesto & Party Registration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Manifesto & Cadre (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 font-display">
            Party Manifesto & Core Pledges
          </h3>

          <div className="space-y-3">
            {activeParty.manifestoPromises && activeParty.manifestoPromises.map((pledge, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-200 font-medium">{pledge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Register New Political Party Form (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 font-display">
            Register New Party with ECI (RPA 1951)
          </h3>

          <form onSubmit={handleRegisterParty} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Full Party Name:</label>
              <input
                type="text"
                placeholder="e.g. Swaraj Bharat Dal"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Short Name:</label>
                <input
                  type="text"
                  placeholder="e.g. SBD"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-bold p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Symbol Emoji:</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Ideology Spectrum:</label>
              <select
                value={ideology}
                onChange={(e) => setIdeology(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
              >
                <option value="Centrist">Centrist Development</option>
                <option value="Center-Right">Center-Right Economic Reform</option>
                <option value="Center-Left">Center-Left Social Welfare</option>
                <option value="Regional Populist">Regional Autonomy & Federalism</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              Submit Party Registration to ECI
            </button>
          </form>
        </div>
      </div>

      <PartyFundTransferModal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} />
    </div>
  );
};
