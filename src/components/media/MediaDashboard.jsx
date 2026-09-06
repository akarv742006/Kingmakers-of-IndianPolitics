import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Newspaper, Send, Radio, PieChart, TrendingUp } from 'lucide-react';

export const MediaDashboard = () => {
  const {
    articles,
    publishNewsArticle,
    polls,
    runOpinionPoll,
    parties,
    autoMediaPublishing,
    setAutoMediaPublishing,
  } = useGame();

  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Times News Bureau');
  const [targetPartyId, setTargetPartyId] = useState(parties[0]?.id || 'bjp');
  const [approvalChange, setApprovalChange] = useState(3);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!headline || !content) return;

    publishNewsArticle({
      headline,
      content,
      author,
      bias: approvalChange > 0 ? 'PRO_GOVT' : approvalChange < 0 ? 'CRITICAL' : 'NEUTRAL',
      impactOnPartyId: targetPartyId,
      approvalChange,
    });

    setHeadline('');
    setContent('');
  };

  const latestPoll = polls[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Newspaper className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">National Media & Broadcasting Center</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold border border-sky-500/30">
                Live Studio Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Broadcast prime-time breaking news, investigative exposes, exit polls, and fact-checks.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setAutoMediaPublishing(!autoMediaPublishing)}
            className={`p-3 rounded-2xl border transition flex items-center gap-2.5 text-xs font-black ${
              autoMediaPublishing
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-lg shadow-sky-950/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className={`w-4 h-4 ${autoMediaPublishing ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider">Auto Media Publisher</div>
              <div>{autoMediaPublishing ? '📡 1-Min Auto Ticker ACTIVE' : '⏸️ Paused'}</div>
            </div>
          </button>

          <button
            onClick={runOpinionPoll}
            className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition shadow-lg shadow-sky-900/30 flex items-center gap-1.5 shrink-0"
          >
            <PieChart className="w-4 h-4" /> Conduct Opinion Poll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Publisher Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            Publish Breaking Headline
          </h3>

          <form onSubmit={handlePublish} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">News Outlet / Agency</label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Times News Bureau">Times News Bureau</option>
                <option value="NDTV Elections Desk">NDTV Elections Desk</option>
                <option value="India Today Network">India Today Network</option>
                <option value="Press Trust of India (PTI)">Press Trust of India (PTI)</option>
                <option value="AltNews FactCheck">AltNews FactCheck Bureau</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Headline Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Explosive Exit Poll Predicts Tight Battle in UP & Bihar"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Article Body / Story Text *</label>
              <textarea
                required
                rows={3}
                placeholder="Write news analysis..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Party Impact</label>
                <select
                  value={targetPartyId}
                  onChange={(e) => setTargetPartyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                >
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.symbol} {p.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Popularity Shift</label>
                <select
                  value={approvalChange}
                  onChange={(e) => setApprovalChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-mono"
                >
                  <option value={5}>+5% (Major Boost)</option>
                  <option value={3}>+3% (Positive)</option>
                  <option value={0}>0% (Neutral)</option>
                  <option value={-3}>-3% (Scandal Damage)</option>
                  <option value={-5}>-5% (Severe Crisis)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Broadcast News Story
            </button>
          </form>
        </div>

        {/* Live News Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Opinion Poll Card */}
          {latestPoll && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-extrabold text-white">{latestPoll.agencyName}</h3>
                </div>
                <span className="text-xs text-slate-400">Sample: {latestPoll.sampleSize.toLocaleString()} voters</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(latestPoll.projectedSeats).map(([pId, count]) => {
                  const p = parties.find((party) => party.id === pId);
                  if (!p) return null;
                  return (
                    <div key={pId} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                      <div className="text-xl">{p.symbol}</div>
                      <div className="text-xs font-bold text-white mt-1">{p.shortName}</div>
                      <div className="text-xl font-black text-white mt-1" style={{ color: p.color }}>
                        {count} <span className="text-xs text-slate-400 font-normal">Seats</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Published Articles Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-white border-b border-slate-800 pb-3">
              Live National News Stream ({articles.length})
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {articles.map((art) => (
                <div key={art.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400">{art.author}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{art.timestamp}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{art.headline}</h4>
                  <p className="text-slate-300">{art.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
