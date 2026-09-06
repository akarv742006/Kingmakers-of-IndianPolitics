import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { MessageSquare, Send, Users, ShieldCheck, Radio, CheckCircle2, Lock, Sparkles, UserCheck } from 'lucide-react';

export const PlayerMessagingConsole = () => {
  const { parties, selectedPartyId, userHandle } = useGame();
  const currentHandle = userHandle || '@Candidate';

  const [activeChannel, setActiveChannel] = useState('DIRECT'); // 'DIRECT', 'PARLIAMENT_FLOOR', 'COALITION'
  const [selectedTargetUser, setSelectedTargetUser] = useState('@NarendraModi');
  const [messageInput, setMessageInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: '@NarendraModi',
      target: currentHandle,
      text: 'Greetings. We need to secure voter mobilization in South India for the upcoming phase.',
      time: '10:15 AM',
      type: 'DIRECT',
    },
    {
      id: 2,
      sender: '@RahulGandhi',
      target: 'PARLIAMENT_FLOOR',
      text: 'We are raising a point of order on the new MSP Bill in the Lok Sabha today!',
      time: '10:22 AM',
      type: 'PARLIAMENT_FLOOR',
    },
    {
      id: 3,
      sender: '@StalinMK',
      target: currentHandle,
      text: 'Our alliance door is open for state infrastructure negotiations if devolution funds are released.',
      time: '10:30 AM',
      type: 'DIRECT',
    },
  ]);

  const activePoliticians = [
    { handle: '@NarendraModi', name: 'Narendra Modi', post: 'Prime Minister of India', party: 'BJP', isOnline: true },
    { handle: '@RahulGandhi', name: 'Rahul Gandhi', post: 'Leader of Opposition', party: 'INC', isOnline: true },
    { handle: '@MamataOfficial', name: 'Mamata Banerjee', post: 'Chief Minister (WB)', party: 'TMC', isOnline: true },
    { handle: '@StalinMK', name: 'M.K. Stalin', post: 'Chief Minister (TN)', party: 'DMK', isOnline: true },
    { handle: '@ArvindKejriwal', name: 'Arvind Kejriwal', post: 'National Convenor', party: 'AAP', isOnline: true },
    { handle: '@PawanKalyan', name: 'Pawan Kalyan', post: 'Deputy CM (AP)', party: 'JSP', isOnline: true },
    { handle: '@VikramadityaSingh', name: 'Vikramaditya Singh', post: 'RVS Independent Front', party: 'RVS', isOnline: true },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: currentHandle,
      target: activeChannel === 'DIRECT' ? selectedTargetUser : activeChannel,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: activeChannel,
    };

    setChatLog((prev) => [...prev, newMsg]);
    setMessageInput('');

    // Simulate AI politician direct response
    if (activeChannel === 'DIRECT') {
      setTimeout(() => {
        const targetObj = activePoliticians.find((p) => p.handle === selectedTargetUser);
        const autoResponses = [
          `Message received, Leader. Our party leadership will discuss this proposal immediately.`,
          `Agreed! Let us align our 3-line whips for the upcoming parliamentary vote.`,
          `Thank you for reaching out. We are open to coalition discussions on seat sharing.`,
        ];
        const randomResp = autoResponses[Math.floor(Math.random() * autoResponses.length)];
        const replyMsg = {
          id: Date.now() + 1,
          sender: selectedTargetUser,
          target: currentHandle,
          text: randomResp,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'DIRECT',
        };
        setChatLog((prev) => [...prev, replyMsg]);
      }, 1200);
    }
  };

  const filteredChat = chatLog.filter((m) => {
    if (activeChannel === 'PARLIAMENT_FLOOR') return m.type === 'PARLIAMENT_FLOOR';
    if (activeChannel === 'COALITION') return m.type === 'COALITION';
    return (
      m.type === 'DIRECT' &&
      ((m.sender === currentHandle && m.target === selectedTargetUser) ||
        (m.sender === selectedTargetUser && m.target === currentHandle))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Live Connection Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl text-white shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white font-display">REAL-TIME POLITICIAN DIPLOMACY & CHAT CONSOLE</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black font-mono">
                SIMULTANEOUS CONNECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct encrypted 1-on-1 politician messaging, coalition negotiation rooms, and parliamentary floor chat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono font-bold shrink-0">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Active User: <strong className="text-amber-400">{currentHandle}</strong></span>
        </div>
      </div>

      {/* Main Messaging Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Politicians & Channels (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Politicians & Channels
            </h3>
          </div>

          {/* Channel Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveChannel('DIRECT')}
              className={`py-2 rounded-xl transition ${
                activeChannel === 'DIRECT' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct PM
            </button>
            <button
              onClick={() => setActiveChannel('PARLIAMENT_FLOOR')}
              className={`py-2 rounded-xl transition ${
                activeChannel === 'PARLIAMENT_FLOOR' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              House Chat
            </button>
            <button
              onClick={() => setActiveChannel('COALITION')}
              className={`py-2 rounded-xl transition ${
                activeChannel === 'COALITION' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coalition
            </button>
          </div>

          {/* Target Politician List (for DIRECT PM) */}
          {activeChannel === 'DIRECT' && (
            <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Select Politician to Message:</span>
              {activePoliticians.map((pol) => (
                <div
                  key={pol.handle}
                  onClick={() => setSelectedTargetUser(pol.handle)}
                  className={`p-3 rounded-2xl bg-slate-950 border transition cursor-pointer flex items-center justify-between gap-2 hover:border-sky-500/60 ${
                    selectedTargetUser === pol.handle ? 'border-sky-500 bg-slate-900/90' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <span>{pol.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">({pol.party})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pol.post}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-mono text-emerald-400">ONLINE</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Chat Messages Window & Input Box (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between min-h-[460px]">
          {/* Chat Window Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                💬
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  {activeChannel === 'DIRECT' ? `Private Chat with ${selectedTargetUser}` : activeChannel === 'PARLIAMENT_FLOOR' ? '🏛️ Lok Sabha Parliamentary Floor Chat' : '🤝 Coalition Alliance Room'}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">End-to-End Encrypted Political Transmission</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar p-2 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            {filteredChat.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No messages in this chat stream yet. Send a direct message to start political discussions!
              </div>
            ) : (
              filteredChat.map((msg) => {
                const isMe = msg.sender === currentHandle;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-amber-500/20 border border-amber-500/40 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-slate-400 border-b border-slate-800/50 pb-1">
                        <span className="font-bold text-amber-400">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="pt-0.5 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Preset Message Chips */}
          {activeChannel === 'DIRECT' && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Propose Alliance Seat Sharing',
                'Request 3-Line Whip Floor Support',
                'Offer Cabinet Minister Portfolio',
                'Discuss State Infrastructure Dev',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMessageInput(preset)}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 font-bold transition"
                >
                  + {preset}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <input
              type="text"
              required
              placeholder={`Send message as ${currentHandle}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-900/40 flex items-center gap-2 shrink-0 transition"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
