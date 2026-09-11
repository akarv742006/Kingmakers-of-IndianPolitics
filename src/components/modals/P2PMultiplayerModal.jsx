import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Globe, Users, Copy, Check, Radio, Zap, ShieldCheck, X, Share2, KeyRound, Sparkles } from 'lucide-react';

export const P2PMultiplayerModal = ({ isOpen, onClose }) => {
  const {
    p2pRoomCode,
    isP2PConnected,
    isP2PHost,
    connectedPeers,
    joinP2PRoom,
    leaveP2PRoom,
    userHandle,
  } = useGame();

  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateNewRoom = () => {
    const randomCode = `LOK-SABHA-${Math.floor(1000 + Math.random() * 9000)}`;
    joinP2PRoom(randomCode);
  };

  const handleJoinCustomRoom = (e) => {
    e.preventDefault();
    if (inputRoomCode.trim()) {
      joinP2PRoom(inputRoomCode.trim());
      setInputRoomCode('');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(p2pRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-wide">P2P Real-Time Multiplayer</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                100% Free ($0 Server)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct browser-to-browser WebRTC synchronization. Zero backend servers needed.
            </p>
          </div>
        </div>

        {/* Connection Status Banner */}
        <div
          className={`p-4 rounded-xl mb-6 border flex items-center justify-between ${
            isP2PConnected
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className={`relative flex h-3 w-3`}>
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isP2PConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isP2PConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <div>
              <span className="font-semibold text-sm">
                {isP2PConnected ? `Connected to Room: ${p2pRoomCode}` : 'Single-Player Local Mode'}
              </span>
              <p className="text-xs opacity-80">
                {isP2PConnected
                  ? isP2PHost
                    ? '👑 You are the Room Host (Authoritative Engine Node)'
                    : '🤝 Connected to Room Host Node'
                  : 'Join or create a room code below to sync live with friends!'}
              </p>
            </div>
          </div>

          {isP2PConnected && (
            <button
              onClick={leaveP2PRoom}
              className="text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-lg transition"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Room Code Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Create Room */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Host a New Session</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Generate a unique room code and share it with your parliament members.
              </p>
            </div>
            <button
              onClick={handleCreateNewRoom}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Create New Room</span>
            </button>
          </div>

          {/* Join Room */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm mb-1">
              <KeyRound className="w-4 h-4" />
              <span>Join Existing Room</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Enter a room code provided by another player.
            </p>
            <form onSubmit={handleJoinCustomRoom} className="flex space-x-2">
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. LOK-SABHA-1947"
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-3 py-2 rounded-lg transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Current Active Room Info & Copy Code */}
        {isP2PConnected && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Room Code</span>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">{p2pRoomCode}</div>
              </div>
              <button
                onClick={copyRoomCode}
                className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg transition border border-slate-600"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Connected Peers List */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-slate-300">
                Connected MPs & Players ({connectedPeers.length + 1})
              </span>
            </div>
            <span className="text-[10px] text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>WebRTC Encrypted P2P</span>
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {/* Self */}
            <div className="bg-slate-900/80 border border-slate-700/60 p-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-medium text-white">{userHandle} (You)</span>
              </div>
              {isP2PHost && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-semibold">
                  👑 Room Host
                </span>
              )}
            </div>

            {/* Other Peers */}
            {connectedPeers.map((peer, idx) => (
              <div
                key={peer.id || idx}
                className="bg-slate-900/50 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-xs text-slate-300 font-medium">{peer.handle || 'Connected MP'}</span>
                  <span className="text-[10px] text-slate-500">({peer.constituency || 'Lok Sabha'})</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                  {peer.partyId || 'MP'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
