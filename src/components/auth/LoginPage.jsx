import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  Crown,
  ShieldCheck,
  Scale,
  Newspaper,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Vote,
  KeyRound,
  AlertCircle,
  UserPlus,
  LogIn
} from 'lucide-react';

export const LoginPage = () => {
  const { parties, loginUser, verifyRolePassword, registerPoliticianAccount, updateUserLocation, rolePasswords, updateRolePassword } = useGame();

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [handle, setHandle] = useState('');
  const [selectedRole, setSelectedRole] = useState('politician');
  const [selectedPartyId, setSelectedPartyId] = useState('bjp');
  const [password, setPassword] = useState('leader123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regState, setRegState] = useState('Tamil Nadu');
  const [regDistrict, setRegDistrict] = useState('Coimbatore');
  const [regConstituency, setRegConstituency] = useState('Coimbatore South');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Change custom role password panel state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newRolePass, setNewRolePass] = useState('');

  const roleOptions = [
    {
      id: 'politician',
      title: 'Party Leader & Candidate',
      icon: Crown,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500/50',
      badge: 'MULTI-PLAYER (MANY USERS)',
      desc: 'Form alliances, manage party funds, campaign across 543 Lok Sabha seats.',
      passLabel: 'Custom Account Password',
    },
    {
      id: 'eci',
      title: 'Chief Election Commissioner',
      icon: ShieldCheck,
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/50',
      badge: 'SINGLE-USER CONSTITUTIONAL',
      desc: 'Dedicated ECI Constitutional Portal: Enforce MCC, symbol allotment, EVM audits, & Gazette orders.',
      passLabel: '🔒 Protected Constitutional Password',
    },
    {
      id: 'judge',
      title: 'Chief Justice of India (Court)',
      icon: Scale,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/50',
      badge: 'SINGLE-USER COURT BENCH',
      desc: 'Preside over judicial petitions in message format, examine parties, & issue stay orders/verdicts.',
      passLabel: '🔒 Protected Constitutional Password',
    },
    {
      id: 'media',
      title: 'National Media Editor',
      icon: Newspaper,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500/50',
      badge: '4TH ESTATE PRESS',
      desc: 'Publish breaking political news, run exit polls, influence public opinion.',
      passLabel: '🔒 Restricted Role Security PIN',
    },
    {
      id: 'admin',
      title: 'Sovereign Game Admin',
      icon: KeyRound,
      color: 'from-red-500 to-orange-700',
      borderColor: 'border-red-500/50',
      badge: 'SINGLE-USER ADMIN',
      desc: 'Inject sudden emergency crises (floods, war, crash), allocate union budgets, & control game speed.',
      passLabel: '🔒 Protected Constitutional Password',
    },
  ];

  const isFixedRole = ['eci', 'judge', 'court', 'admin'].includes(selectedRole);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setSuccessMsg('');
    setIsChangingPass(false);
    setPassword(''); // Reset password input so security PIN is not exposed in UI
  };

  const handleSaveNewRolePassword = (e) => {
    e.preventDefault();
    if (isFixedRole) {
      setErrorMsg(`🔒 Password for ${selectedRole.toUpperCase()} is permanently locked and cannot be customized.`);
      return;
    }
    if (!newRolePass || newRolePass.length < 4) {
      setErrorMsg('New password must be at least 4 characters long.');
      return;
    }
    const res = updateRolePassword(selectedRole, newRolePass);
    if (res && res.success) {
      setPassword(newRolePass);
      setSuccessMsg(`🎉 Security Password for ${selectedRole.toUpperCase()} role updated to custom PIN!`);
      setIsChangingPass(false);
      setNewRolePass('');
    } else if (res && res.message) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!handle.trim()) {
      setErrorMsg('Please enter your politician handle name.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check again.');
      return;
    }

    const res = registerPoliticianAccount({ handle, password, partyId: selectedPartyId });
    if (res && res.success) {
      updateUserLocation({
        state: regState,
        district: regDistrict,
        constituency: regConstituency,
      });

      setSuccessMsg(`🎉 Account created for ${handle} in ${regConstituency}, ${regState}! Logging in...`);
      setTimeout(() => {
        loginUser({
          handle: handle.trim(),
          role: 'politician',
          partyId: selectedPartyId,
        });
      }, 1000);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!handle.trim()) {
      setErrorMsg('Please enter your player handle name.');
      return;
    }

    if (verifyRolePassword) {
      const isValid = verifyRolePassword(selectedRole, password, handle);
      if (!isValid) {
        setErrorMsg(`Incorrect security password for ${selectedRole.toUpperCase()} role.`);
        return;
      }
    }

    loginUser({
      handle: handle.trim(),
      role: selectedRole,
      partyId: selectedPartyId,
    });
  };

  const currentRoleOpt = roleOptions.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#050810] game-bg-grid text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Radial Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-1 shadow-2xl shadow-amber-500/30 overflow-hidden mb-2">
            <img
              src="https://cdn.discordapp.com/attachments/1538232204956532829/1547676199356997775/1b6aa2012-57c8-48a2-93c4-c4c2231d233c.png?ex=6aa4f208&is=6aa3a088&hm=93da735dadad4601564ceefcec3e94e4b1c8cc21f4765cd10c0dc6872e6e6cf2"
              alt="Kingmakers Logo"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-black font-mono tracking-widest uppercase shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            KINGMAKERS OF INDIAN POLITICS • SOVEREIGN SIM
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
            CONSTITUTIONAL LOGIN & ROLE PORTAL
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Step into the 543-seat Lok Sabha political battlefield. Log in as a Politician with your custom password, or enter as Court, ECI, or Admin.
          </p>
        </div>

        {/* Auth Mode Toggle (For Politician Account Creation) */}
        <div className="flex items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In to Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setSelectedRole('politician');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Create Politician Account
          </button>
        </div>

        {authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-8">
            {/* Section 1: Player Handle */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-black text-amber-400 font-mono uppercase tracking-wider">
                1. PLAYER HANDLE / LEADER NAME
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@YourLeaderName"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>

            {/* Section 2: Constitutional Role Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-amber-400 font-mono uppercase tracking-wider">
                2. SELECT CONSTITUTIONAL ROLE & PORTAL WORKSPACE
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleRoleSelect(opt.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                        isSelected
                          ? `bg-slate-800/90 ${opt.borderColor} shadow-xl ring-2 ring-amber-500/40`
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-amber-400">
                          <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${opt.color} text-white shadow-md`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-amber-400/90 uppercase">{opt.badge}</div>
                          <div className="text-sm font-extrabold text-white leading-snug">{opt.title}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Party Selection (If Politician) */}
            {selectedRole === 'politician' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <label className="block text-xs font-black text-amber-400 font-mono uppercase tracking-wider">
                  3. SELECT YOUR POLITICAL PARTY LEADER AVATAR
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                  {parties.map((p) => {
                    const isSelected = selectedPartyId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPartyId(p.id)}
                        className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="text-2xl shrink-0">{p.symbol || '☸️'}</div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black truncate">{p.shortName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{p.leader}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 4: Security Password Check & Custom Password Setup */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-400 font-mono uppercase tracking-wider">
                  {selectedRole === 'politician' ? '4.' : '3.'} ENTER SECURITY PASSWORD ({selectedRole.toUpperCase()})
                </label>
                {isFixedRole ? (
                  <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Constitutional PIN Locked
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsChangingPass(!isChangingPass)}
                    className="text-[11px] font-mono text-amber-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    {isChangingPass ? 'Close Password Setup' : '🔑 Set Custom Password'}
                  </button>
                )}
              </div>

              {!isChangingPass ? (
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isFixedRole
                        ? `Enter security PIN for ${selectedRole.toUpperCase()}...`
                        : selectedRole === 'politician'
                        ? 'Enter password for politician account...'
                        : `Enter security PIN for ${selectedRole.toUpperCase()}...`
                    }
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 font-mono font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                  />
                </div>
              ) : (
                <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Set Custom Security Password for {selectedRole.toUpperCase()} Role:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={newRolePass}
                      onChange={(e) => setNewRolePass(e.target.value)}
                      placeholder="Type new custom password (min 4 chars)..."
                      className="flex-1 bg-slate-950 border border-slate-700 text-white font-mono text-xs p-3 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewRolePassword}
                      className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow transition shrink-0"
                    >
                      Save Password 💾
                    </button>
                  </div>
                </div>
              )}

              {isFixedRole && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Constitutional Security Policy: Password for <strong className="text-amber-300">{selectedRole.toUpperCase()}</strong> is permanently fixed and cannot be customized or changed.</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            {/* Enter Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>ENTER {selectedRole.toUpperCase()} PORTAL</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          /* REGISTER NEW POLITICIAN ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-400 font-mono uppercase tracking-wider">
                REGISTER CUSTOM POLITICIAN ACCOUNT
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">1. Choose Politician Handle Name:</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@YourLeaderName"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-12 pr-4 text-white font-semibold text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">2. Select Your Political Party Avatar:</label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-bold p-3 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
                >
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.symbol} {p.name} ({p.shortName}) - Leader: {p.leader}
                    </option>
                  ))}
                </select>
              </div>

              {/* State, District, and Constituency Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Select State:</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white font-bold p-2.5 rounded-xl text-xs"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">District Name:</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Coimbatore"
                    className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Constituency Seat:</label>
                  <input
                    type="text"
                    value={regConstituency}
                    onChange={(e) => setRegConstituency(e.target.value)}
                    placeholder="e.g. Coimbatore South"
                    className="w-full bg-slate-900 border border-slate-700 text-amber-300 p-2.5 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">3. Create Custom Password:</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Custom password..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">4. Confirm Password:</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm custom password..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>CREATE ACCOUNT & START CAMPAIGN</span>
              <UserPlus className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4 font-mono">
          👑 Kingmakers of Indian Politics • 543 Constituencies • 272 Majority Threshold
        </div>
      </div>
    </div>
  );
};
