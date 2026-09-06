import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import confetti from 'canvas-confetti';
import { Share2, MessageSquare, Heart, Repeat, Sparkles, CheckCircle2, TrendingUp, Send, Award, ShieldCheck } from 'lucide-react';

export const TwitterXFeedPage = () => {
  const { userHandle, parties, selectedPartyId, setPlayerPopularity, publishNewsArticle } = useGame();

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const [tweetText, setTweetText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#LokSabha2026');
  const [statusMsg, setStatusMsg] = useState('');

  const [tweets, setTweets] = useState([
    {
      id: 't-1',
      author: 'Narendra Modi',
      handle: '@narendramodi',
      partySymbol: '🪷',
      partyColor: '#FF9933',
      verified: true,
      time: '12m ago',
      content: 'Serving the nation with unwavering commitment. Our collective vision for #ViksitBharat 2047 will empower 140 Cr citizens across every constituency! 🇮🇳',
      likes: 45200,
      retweets: 12400,
      replies: 3100,
      userLiked: false,
      userRetweeted: false,
    },
    {
      id: 't-2',
      author: 'Mallikarjun Kharge',
      handle: '@kharge',
      partySymbol: '✋',
      partyColor: '#1976D2',
      verified: true,
      time: '35m ago',
      content: 'Justice for youth and farmers is non-negotiable. We demand MSP Legal Guarantee and 30 Lakh vacant government jobs filled immediately! #YouthJobs #LokSabha2026',
      likes: 28900,
      retweets: 8900,
      replies: 1850,
      userLiked: false,
      userRetweeted: false,
    },
    {
      id: 't-3',
      author: 'Arvind Kejriwal',
      handle: '@ArvindKejriwal',
      partySymbol: '🧹',
      partyColor: '#00BCD4',
      verified: true,
      time: '1h ago',
      content: 'World-class education and free healthcare clinics for every family. Honest governance is the true strength of democracy! 🧹 #CleanPolitics',
      likes: 19400,
      retweets: 5400,
      replies: 920,
      userLiked: false,
      userRetweeted: false,
    },
    {
      id: 't-4',
      author: 'Mamata Banerjee',
      handle: '@MamataOfficial',
      partySymbol: '🌱',
      partyColor: '#2E7D32',
      verified: true,
      time: '2h ago',
      content: 'Federal autonomy and regional rights will prevail! Bengal will continue to lead in social welfare guarantees for women and farmers. 🌱 #RegionalPower',
      likes: 16800,
      retweets: 4200,
      replies: 810,
      userLiked: false,
      userRetweeted: false,
    },
  ]);

  const trendingHashtags = [
    { tag: '#LokSabha2026', posts: '1.4M Posts', category: 'Elections' },
    { tag: '#ViksitBharat', posts: '890K Posts', category: 'National Governance' },
    { tag: '#ElectionCommission', posts: '640K Posts', category: 'Constitutional' },
    { tag: '#ProtestRally', posts: '510K Posts', category: 'Campaigns' },
    { tag: '#UnionBudget', posts: '380K Posts', category: 'Economy' },
  ];

  const [selectedImage, setSelectedImage] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  const imagePresets = [
    { label: '🏛️ Parliament Speech', url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop' },
    { label: '📣 Million Rally', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop' },
    { label: '🎙️ Press Meet', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop' },
    { label: '🏗️ Expressway Infra', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1000&auto=format&fit=crop' },
    { label: '🏏 Sports Stadium', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop' },
  ];

  const handlePostTweet = (e) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    const finalImage = selectedImage || customImageUrl || '';
    const fullContent = `${tweetText.trim()} ${selectedTag}`;
    const newTweet = {
      id: `t-user-${Date.now()}`,
      author: `${activeParty.shortName} Leader`,
      handle: userHandle || '@Candidate',
      partySymbol: activeParty.symbol || '☸️',
      partyColor: activeParty.color || '#FF9933',
      verified: true,
      time: 'Just now',
      content: fullContent,
      imageUrl: finalImage,
      likes: Math.floor(Math.random() * 500) + 120,
      retweets: Math.floor(Math.random() * 150) + 40,
      replies: Math.floor(Math.random() * 50) + 10,
      userLiked: true,
      userRetweeted: true,
    };

    setTweets([newTweet, ...tweets]);
    setTweetText('');
    setSelectedImage('');
    setCustomImageUrl('');
    setPlayerPopularity((pop) => Math.min(100, pop + 2));

    publishNewsArticle({
      headline: `📱 VIRAL X MEDIA TWEET: ${userHandle} Posts Statement on ${selectedTag}`,
      content: `Public response: "${fullContent}". Social media engagement boosted player popularity by +2%!`,
      author: 'POLITICAL X MEDIA WIRE',
      bias: 'NEUTRAL',
      impactOnPartyId: selectedPartyId,
      approvalChange: 2,
    });

    setStatusMsg(`🚀 Tweet with media published to Political X! Gained +2% Popularity boost.`);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleLike = (id) => {
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isLiked = t.userLiked;
          return {
            ...t,
            userLiked: !isLiked,
            likes: isLiked ? t.likes - 1 : t.likes + 1,
          };
        }
        return t;
      })
    );
  };

  const handleRetweet = (id) => {
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isRetweeted = t.userRetweeted;
          return {
            ...t,
            userRetweeted: !isRetweeted,
            retweets: isRetweeted ? t.retweets - 1 : t.retweets + 1,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-3xl font-black shrink-0">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">Political X (Twitter) Command Feed</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold border border-sky-500/30">
                Live Media Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Post official party statements, engage with national political leaders, and drive viral hashtags across India.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shrink-0 font-mono text-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Official Verified Handle</div>
          <div className="text-base font-black text-sky-400">{userHandle || '@Candidate'}</div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg('')} className="text-slate-400 hover:text-white font-mono text-[10px] underline">
            DISMISS
          </button>
        </div>
      )}

      {/* Main Grid: Left Compose & Feed (8 Cols) + Right Trending Hashtags (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Compose & Feed (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Compose X Tweet Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 font-display">
                <Send className="w-4 h-4 text-sky-400" />
                Post Official Tweet / Political Announcement
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Reaches 140 Cr Citizens</span>
            </div>

            <form onSubmit={handlePostTweet} className="space-y-4">
              <textarea
                rows={3}
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What is happening in Indian politics today? Share your vision..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
              />

              {/* Image Preset & Upload Attachment Row */}
              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <span className="text-[11px] font-bold text-slate-400 font-mono block">🖼️ Attach Political Campaign Photo / Image:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {imagePresets.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img.url);
                        setCustomImageUrl('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                        selectedImage === img.url
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-inner'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setSelectedImage('');
                  }}
                  placeholder="Or paste custom image URL (e.g. https://...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Hashtags preset chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-400 font-mono">Attach Hashtag:</span>
                {['#LokSabha2026', '#ViksitBharat', '#ElectionCommission', '#YouthJobs', '#ProtestRally'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border ${
                      selectedTag === tag
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-inner'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeParty.color }} />
                  <span>Posting as <strong>{activeParty.shortName}</strong></span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>POST TWEET (𝕏)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live X Tweets Timeline Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Share2 className="w-4 h-4 text-sky-400" />
              Live Political X Feed & National Leaders
            </h3>

            <div className="space-y-4">
              {tweets.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900 border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition"
                >
                  {/* Tweet Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold border"
                        style={{ backgroundColor: `${t.partyColor}20`, borderColor: `${t.partyColor}40` }}
                      >
                        {t.partySymbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                          <span>{t.author}</span>
                          {t.verified && <span className="text-sky-400 text-xs">☑️</span>}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{t.handle} • {t.time}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      LIVE BROADCAST
                    </span>
                  </div>

                  {/* Tweet Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{t.content}</p>

                  {/* Attached Image if present */}
                  {t.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-slate-800/90 shadow-md">
                      <img src={t.imageUrl} alt="Attached Tweet Media" className="w-full h-52 sm:h-64 object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Interactive Engagement Row */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-800/80 text-xs font-mono">
                    <button
                      onClick={() => handleLike(t.id)}
                      className={`flex items-center gap-1.5 transition ${
                        t.userLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${t.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{t.likes.toLocaleString()}</span>
                    </button>

                    <button
                      onClick={() => handleRetweet(t.id)}
                      className={`flex items-center gap-1.5 transition ${
                        t.userRetweeted ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      <Repeat className="w-4 h-4" />
                      <span>{t.retweets.toLocaleString()}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{t.replies.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Trending Hashtags & Pulse (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-display">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Trending Political Hashtags in India
            </h3>

            <div className="space-y-3">
              {trendingHashtags.map((h, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-sky-500/40 transition">
                  <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">{h.category} • Trending</div>
                  <div className="font-extrabold text-sm text-sky-400 font-mono mt-0.5">{h.tag}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{h.posts}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
