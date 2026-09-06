import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Radio, Newspaper, ChevronRight, Volume2, X } from 'lucide-react';

export const LiveMediaTicker = ({ onNavigateTab }) => {
  const { articles } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % articles.length);
    }, 8000); // cycle headline view every 8 seconds
    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIdx] || articles[0];

  return (
    <>
      {/* Live Breaking News Ticker Bar */}
      <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-950 border border-red-500/40 rounded-2xl p-2.5 shadow-xl flex items-center gap-3 overflow-hidden text-xs">
        {/* Glowing Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 text-white font-mono font-black uppercase text-[10px] tracking-wider shrink-0 shadow-md shadow-red-950/80 animate-pulse">
          <Radio className="w-3.5 h-3.5" />
          <span>🔴 LIVE MEDIA</span>
        </div>

        {/* Dynamic Ticker Headline Text */}
        <div
          onClick={() => setSelectedArticle(currentArticle)}
          className="flex-1 overflow-hidden cursor-pointer group flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-400 font-mono font-bold text-[11px] shrink-0">
              [{currentArticle.author || 'Press Network'}]
            </span>
            <span className="text-white font-extrabold group-hover:text-amber-300 transition truncate font-sans">
              {currentArticle.headline}
            </span>
          </div>

          <span className="text-[10px] text-red-400 font-bold hidden sm:inline-block shrink-0 group-hover:underline">
            Read Full Story &gt;
          </span>
        </div>

        {/* View All Media Tab Button */}
        <button
          onClick={() => onNavigateTab && onNavigateTab('media')}
          className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[10px] shrink-0 transition"
        >
          NEWS FEED
        </button>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                  {selectedArticle.author || 'National Press Desk'} • {selectedArticle.timestamp || 'Just now'}
                </span>
                <h3 className="text-lg font-black text-white font-display mt-0.5">
                  {selectedArticle.headline}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-sans">
              {selectedArticle.content}
            </div>

            {selectedArticle.impactOnPartyId && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold flex items-center justify-between">
                <span>Political Popularity Impact:</span>
                <span className="font-mono text-emerald-400">
                  {selectedArticle.approvalChange >= 0 ? `+${selectedArticle.approvalChange}%` : `${selectedArticle.approvalChange}%`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
