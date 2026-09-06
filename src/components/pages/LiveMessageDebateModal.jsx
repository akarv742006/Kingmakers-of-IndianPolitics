import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Send,
  Sparkles,
  Zap,
  Award,
  Vote,
  Flame,
  X,
  Volume2,
  ThumbsUp,
  BarChart2,
  Clock,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

export const LiveMessageDebateModal = ({ isOpen, onClose, topic = 'Economic Reforms & Unemployment' }) => {
  const { userHandle, selectedPartyId, parties, collectVotesThroughDebate, userConstituency, registeredAccounts } = useGame();

  const playerParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const rivalParties = parties.filter((p) => p.id !== selectedPartyId);

  // Opponent player selection (Real players / registered politicians)
  const [selectedOpponentId, setSelectedOpponentId] = useState(rivalParties[0]?.id || 'inc');
  const opponentParty = parties.find((p) => p.id === selectedOpponentId) || rivalParties[0] || parties[1];

  // Active speaker toggle for real player messaging (Player 1 vs Player 2)
  const [activeSpeakerMode, setActiveSpeakerMode] = useState('player1'); // 'player1' or 'player2'

  const player1Handle = userHandle || '@Candidate';
  const player2Handle = `@${(opponentParty.leader || 'OppositionLeader').replace(/\s+/g, '')}`;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [debateTimeLeft, setDebateTimeLeft] = useState(60);
  const [playerScore, setPlayerScore] = useState(50);
  const [isDebateFinished, setIsDebateFinished] = useState(false);
  const [debateSummary, setDebateSummary] = useState(null);

  const chatEndRef = useRef(null);

  // Initialize real player debate room messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          sender: 'SYSTEM',
          text: `🎙️ REAL PLAYER DEBATE ARENA IS LIVE! Topic: '${topic}'`,
          timestamp: '00:01',
          type: 'system',
        },
        {
          id: 2,
          sender: 'SYSTEM',
          text: `⚡ REAL PLAYERS CONNECTED: ${player1Handle} (${playerParty.shortName}) VS ${player2Handle} (${opponentParty.shortName})`,
          timestamp: '00:02',
          type: 'system',
        },
      ]);
      setDebateTimeLeft(60);
      setIsDebateFinished(false);
      setDebateSummary(null);
      setPlayerScore(50);
    }
  }, [isOpen, selectedOpponentId, topic]);

  // Debate countdown timer (No AI messages generated)
  useEffect(() => {
    if (!isOpen || isDebateFinished) return;

    const debateTimer = setInterval(() => {
      setDebateTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(debateTimer);
          finishDebate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(debateTimer);
  }, [isOpen, isDebateFinished]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isDebateFinished) return;

    const userMsgText = inputText.trim();
    setInputText('');

    const isPlayer1 = activeSpeakerMode === 'player1';
    const currentSender = isPlayer1 ? player1Handle : player2Handle;
    const currentParty = isPlayer1 ? playerParty.shortName : opponentParty.shortName;

    const newMsg = {
      id: Date.now(),
      sender: currentSender,
      party: currentParty,
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      type: isPlayer1 ? 'player' : 'opponent',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Adjust real applause rating based on real player interaction
    if (isPlayer1) {
      setPlayerScore((s) => Math.min(98, s + Math.floor(Math.random() * 5) + 3));
    } else {
      setPlayerScore((s) => Math.max(12, s - Math.floor(Math.random() * 4) - 2));
    }
  };

  const handleTriggerAction = (actionType) => {
    if (isDebateFinished) return;

    const isPlayer1 = activeSpeakerMode === 'player1';
    const currentSender = isPlayer1 ? player1Handle : player2Handle;
    const currentParty = isPlayer1 ? playerParty.shortName : opponentParty.shortName;

    let actionText = '';
    let boost = 5;

    if (actionType === 'STAT') {
      actionText = `📊 FACT CHECK: Citing official RBI & CAG Economic Survey data proving ${currentParty}'s performance!`;
      boost = 8;
    } else if (actionType === 'CHEER') {
      actionText = `👏 CROWD CHEER: Loud applause erupts in studio as ${currentSender} presents key policy figures!`;
      boost = 6;
    } else if (actionType === 'RETORT') {
      actionText = `🔥 SHARP RETORT: "Why did your administration fail to deliver key promises during your tenure?"`;
      boost = 10;
    }

    const actionMsg = {
      id: Date.now(),
      sender: currentSender,
      party: currentParty,
      text: actionText,
      timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      type: isPlayer1 ? 'player' : 'opponent',
      isSpecialAction: true,
    };

    setMessages((prev) => [...prev, actionMsg]);
    if (isPlayer1) {
      setPlayerScore((s) => Math.min(99, s + boost));
    } else {
      setPlayerScore((s) => Math.max(10, s - boost));
    }
  };

  const finishDebate = () => {
    setIsDebateFinished(true);

    const finalPlayerScore = Math.max(playerScore, 75);
    const votesCalculated = finalPlayerScore * 2200;

    const result = collectVotesThroughDebate({
      topic,
      score: finalPlayerScore,
      votesWon: votesCalculated,
    });

    setDebateSummary({
      finalScore: finalPlayerScore,
      votesWon: votesCalculated,
      seatName: userConstituency || 'Coimbatore South',
    });

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[88vh] flex flex-col justify-between shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Live Broadcast Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-lg animate-pulse shrink-0">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-mono font-black animate-pulse">
                  REAL PLAYER ARENA (NO AI)
                </span>
                <span className="text-xs text-slate-400 font-mono">Topic: {topic}</span>
              </div>
              <h3 className="text-base font-black text-white font-display">Prime Time National TV Face-Off</h3>
            </div>
          </div>

          {/* Timer & Close */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center font-mono">
              <div className="text-[10px] text-slate-400 font-bold">TIME LEFT</div>
              <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {debateTimeLeft}s
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Opponent Selector & Speaker Switcher Bar */}
        <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-400">Rival Player:</label>
            <select
              value={selectedOpponentId}
              onChange={(e) => setSelectedOpponentId(e.target.value)}
              className="bg-slate-900 text-sky-400 font-bold px-2.5 py-1 rounded-lg border border-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              {rivalParties.map((party) => (
                <option key={party.id} value={party.id} className="bg-slate-950 text-white">
                  {party.symbol} {party.shortName} - @{party.leader}
                </option>
              ))}
            </select>
          </div>

          {/* Speaker Switcher for Real Player Messages */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold px-1">Speaking As:</span>
            <button
              type="button"
              onClick={() => setActiveSpeakerMode('player1')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-black transition ${
                activeSpeakerMode === 'player1'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {player1Handle} ({playerParty.shortName})
            </button>

            <button
              type="button"
              onClick={() => setActiveSpeakerMode('player2')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-black transition ${
                activeSpeakerMode === 'player2'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {player2Handle} ({opponentParty.shortName})
            </button>
          </div>
        </div>

        {/* Live Audience Meter Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-4 font-mono text-xs shrink-0">
          <div className="flex items-center gap-2">
            <strong className="text-amber-400 font-bold">{playerParty.shortName} ({player1Handle})</strong>
            <span className="text-emerald-400 font-black">{playerScore}% Applause</span>
          </div>

          <div className="flex-1 max-w-xs bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 flex">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${playerScore}%` }} />
            <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${100 - playerScore}%` }} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-black">{100 - playerScore}%</span>
            <strong className="text-slate-300 font-bold">{opponentParty.shortName} ({player2Handle})</strong>
          </div>
        </div>

        {/* Live Message Chat Stream (100% Real Players) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/40">
          {messages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="px-3 py-1 rounded-full bg-slate-800/80 text-amber-300 text-[11px] font-mono font-bold border border-slate-700">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isPlayer1 = msg.type === 'player';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPlayer1 ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
              >
                <div className="flex items-center gap-2 mb-0.5 text-[10px] font-mono">
                  <span className="font-bold text-slate-300">{msg.sender}</span>
                  <span className={`px-1.5 py-0.2 rounded font-black ${isPlayer1 ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'}`}>
                    {msg.party}
                  </span>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed font-sans shadow-lg ${
                    isPlayer1
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-100 rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Debate Finished Winner Banner */}
        {isDebateFinished && debateSummary && (
          <div className="bg-slate-950 p-5 border-t border-emerald-500/40 text-center space-y-3 animate-in zoom-in-95 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
              <Award className="w-4 h-4 text-emerald-400" /> REAL PLAYER DEBATE CONCLUDED!
            </div>
            <h4 className="text-xl font-black text-white">
              {player1Handle} Scored <span className="text-amber-400 font-mono">{debateSummary.finalScore}%</span> Debate Applause Rating!
            </h4>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">
              🎉 Collected +{debateSummary.votesWon.toLocaleString()} Votes for {debateSummary.seatName}!
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
            >
              Claim Votes & Exit Debate
            </button>
          </div>
        )}

        {/* Input & Quick Action Bar */}
        {!isDebateFinished && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
            {/* Quick Tactical Actions for Active Real Speaker */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => handleTriggerAction('STAT')}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5" /> 📊 Quote RBI Stat
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAction('CHEER')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> 👏 Studio Applause
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAction('RETORT')}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> 🔥 Challenge Record
              </button>

              <button
                type="button"
                onClick={finishDebate}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black whitespace-nowrap ml-auto"
              >
                End & Calculate Votes
              </button>
            </div>

            {/* Real Player Argument Chat Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type real player argument as ${activeSpeakerMode === 'player1' ? player1Handle : player2Handle}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-medium"
              />
              <button
                type="submit"
                className={`px-5 py-3 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 transition ${
                  activeSpeakerMode === 'player1'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                }`}
              >
                <span>SEND</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
