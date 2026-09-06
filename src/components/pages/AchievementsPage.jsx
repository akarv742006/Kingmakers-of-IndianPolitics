import React from 'react';
import { Trophy, Star, Award, CheckCircle2, Crown } from 'lucide-react';

export const AchievementsPage = () => {
  const achievements = [
    { title: 'Sovereign Election Victory', desc: 'Secure 272+ Lok Sabha seats in national polls', unlocked: true, reward: '₹50,000,000' },
    { title: 'Legislative Mastermind', desc: 'Pass 10 Acts in Parliament with Presidential Assent', unlocked: true, reward: '₹20,000,000' },
    { title: 'Constitutional Custodian', desc: 'Obtain Supreme Court bench verdict in your favor', unlocked: false, reward: '₹15,000,000' },
    { title: 'Mass Mobilizer', desc: 'Organize mega campaign rallies in 10 major states', unlocked: true, reward: '₹25,000,000' },
    { title: 'Clean Mandate', desc: 'Achieve 80%+ voter satisfaction in 50 constituencies', unlocked: false, reward: '₹30,000,000' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0">
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-display">Political Achievements & Trophies</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Unlock national milestones, constitutional badges, and financial bounty rewards.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className={`p-5 rounded-3xl border transition space-y-2 ${ach.unlocked ? 'bg-slate-900 border-amber-500/40 shadow-xl' : 'bg-slate-950/60 border-slate-800 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${ach.unlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {ach.unlocked ? 'UNLOCKED 🏆' : 'LOCKED 🔒'}
              </span>
              <span className="text-xs font-mono font-black text-emerald-400">Reward: {ach.reward}</span>
            </div>

            <h4 className="font-extrabold text-base text-white">{ach.title}</h4>
            <p className="text-xs text-slate-400">{ach.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
