import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REAL_PARTIES } from '../data/realParties.js';
import { INITIAL_543_SEATS } from '../data/seatsData.js';
import { INITIAL_PARLIAMENT_BILLS } from '../data/billTemplates.js';
import { CRISIS_EVENT_TEMPLATES } from '../data/crisisEventsData.js';
import { ServerGameEngine } from '../engine/serverEngine.js';
import { PoliticalMechanicsEngine } from '../engine/politicalMechanicsEngine.js';
import { socketService } from '../services/socketService.js';
import { p2pService } from '../services/p2pService.js';

const GameContext = createContext(undefined);

const DEFAULT_ALLIANCES = [
  {
    id: 'nda',
    name: 'National Democratic Alliance (NDA)',
    leaderPartyId: 'bjp',
    memberPartyIds: ['bjp', 'ss', 'jdu'],
    color: '#FF9933',
  },
  {
    id: 'india',
    name: 'Indian National Developmental Inclusive Alliance (I.N.D.I.A)',
    leaderPartyId: 'inc',
    memberPartyIds: ['inc', 'aap', 'tmc', 'dmk', 'sp', 'cpim'],
    color: '#1976D2',
  },
];

export const GameProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('mandate_theme') || 'royal-sovereign';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('mandate_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [role, setRole] = useState('politician');
  const [selectedPartyId, setSelectedPartyId] = useState('bjp');
  const [parties, setParties] = useState(INITIAL_REAL_PARTIES);
  const [customApplications, setCustomApplications] = useState([
    {
      id: 'app-sample-1',
      partyName: 'Rashtriya Vikas Sena',
      shortName: 'RVS',
      symbol: '🦁',
      ideology: 'Center-Right',
      leaderName: 'Vikramaditya Singh',
      applicantRole: 'Independent Leader',
      manifesto: 'Focus on High-Speed Rail infrastructure, Tech Startup Tax Exemption, and Agri-tech subsidies.',
      status: 'PENDING',
      submissionTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [seats, setSeats] = useState(INITIAL_543_SEATS);
  const [petitions, setPetitions] = useState([
    {
      id: 'pet-1',
      petitioner: 'Indian National Congress',
      respondent: 'Bharatiya Janata Party',
      subject: 'Alleged Model Code of Conduct (MCC) rally time limit violation in Varanasi',
      category: 'MCC_VIOLATION',
      details: 'Rally sound systems allegedly operated past 10:00 PM cutoff line during phase 1 campaigning.',
      status: 'PENDING',
      timestamp: '10:30 AM',
    },
  ]);
  const [articles, setArticles] = useState([
    {
      id: 'news-1',
      headline: 'Election Commission Announces 543 Lok Sabha Seat Poll Schedule',
      content: 'The Election Commission of India has officially declared elections across 7 distinct phases.',
      author: 'NDTV / Times Network',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    },
  ]);
  const [polls, setPolls] = useState([]);
  const [alliances, setAlliances] = useState(DEFAULT_ALLIANCES);
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('mandate_is_logged_in') === 'true';
  });
  const [userHandle, setUserHandle] = useState(() => {
    const saved = localStorage.getItem('mandate_user_handle');
    if (saved && saved !== '@Annamalai k') return saved;
    return '@Candidate';
  });

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('mandate_registered_accounts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [userState, setUserState] = useState(() => {
    return localStorage.getItem('mandate_user_state') || 'Tamil Nadu';
  });
  const [userDistrict, setUserDistrict] = useState(() => {
    return localStorage.getItem('mandate_user_district') || 'Coimbatore';
  });
  const [userConstituency, setUserConstituency] = useState(() => {
    return localStorage.getItem('mandate_user_constituency') || 'Coimbatore South';
  });

  const [primeMinisterDetails, setPrimeMinisterDetails] = useState({
    pmName: 'Narendra Modi',
    pmPartyId: 'bjp',
    pmPartyName: 'Bharatiya Janata Party',
    pmPartyShort: 'BJP',
    totalSeatsWon: 285,
    appointedTimestamp: 'Constitutional Appointment',
  });

  // Dynamic Permanent National Room Code
  const [permanentRoomCode, setPermanentRoomCode] = useState(() => {
    return localStorage.getItem('mandate_permanent_room_code') || 'LOK_SABHA_PERMANENT_PARLIAMENT';
  });

  // P2P WebRTC Multiplayer Room State
  const [p2pRoomCode, setP2PRoomCode] = useState(permanentRoomCode);
  const [isP2PConnected, setIsP2PConnected] = useState(false);
  const [isP2PHost, setIsP2PHost] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState([]);

  const getLocalStateForP2PHost = () => ({
    hansardMessages: hansardFloorMessages,
    parliamentBills: bills,
    articles: articles,
    seats: seats,
  });

  const joinP2PRoom = (code) => {
    const cleanCode = (code || permanentRoomCode || 'LOK_SABHA_PERMANENT_PARLIAMENT').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    setP2PRoomCode(cleanCode);
    p2pService.joinRoom(
      cleanCode,
      {
        handle: userHandle,
        role: role,
        partyId: selectedPartyId,
        constituency: userConstituency,
        state: userState,
      },
      getLocalStateForP2PHost
    );
    setIsP2PConnected(true);
  };

  const setAdminPermanentRoomCode = (newCode) => {
    const clean = (newCode || 'LOK_SABHA_PERMANENT_PARLIAMENT').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    setPermanentRoomCode(clean);
    localStorage.setItem('mandate_permanent_room_code', clean);
    joinP2PRoom(clean);
    return { success: true, message: `Official Permanent National Room Code updated to: ${clean}` };
  };

  const leaveP2PRoom = () => {
    p2pService.leaveRoom();
    setIsP2PConnected(false);
    setIsP2PHost(false);
    setConnectedPeers([]);
  };

  // Auto-connect to Permanent National Room on mount
  useEffect(() => {
    joinP2PRoom(permanentRoomCode);

    p2pService.on('PLAYER_LIST_UPDATED', (peerList) => {
      setConnectedPeers(peerList || []);
      setIsP2PHost(p2pService.isHost);
    });
  }, [userHandle, role, selectedPartyId, permanentRoomCode]);

  const claimLeadershipIfVacant = (targetPartyId, handleInput) => {
    if (!targetPartyId || !handleInput) return;
    const cleanHandle = handleInput.trim().startsWith('@') ? handleInput.trim() : `@${handleInput.trim()}`;
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === targetPartyId) {
          const isVacant =
            !p.leader ||
            p.leader.toLowerCase().includes('vacant') ||
            p.leader.toLowerCase().includes('unclaimed');
          if (isVacant) {
            return {
              ...p,
              leader: cleanHandle,
              president: cleanHandle,
            };
          }
        }
        return p;
      })
    );
  };

  const updateUserLocation = ({ state, district, constituency }) => {
    if (state) {
      setUserState(state);
      localStorage.setItem('mandate_user_state', state);
    }
    if (district) {
      setUserDistrict(district);
      localStorage.setItem('mandate_user_district', district);
    }
    if (constituency) {
      setUserConstituency(constituency);
      localStorage.setItem('mandate_user_constituency', constituency);
    }
  };

  const [partyNominations, setPartyNominations] = useState([
    { id: 'nom-1', partyId: 'bjp', partyShort: 'BJP', constituencyName: 'Varanasi', candidateName: 'Narendra Modi', announcedBy: '@PartyHighCommand', timestamp: 'Yesterday' },
    { id: 'nom-2', partyId: 'inc', partyShort: 'INC', constituencyName: 'Wayanad', candidateName: 'Rahul Gandhi', announcedBy: '@INC_Official', timestamp: '2 days ago' },
  ]);
  const [ministryAnnouncements, setMinistryAnnouncements] = useState([
    { id: 'min-1', partyId: 'bjp', portfolioName: 'Home Affairs', ministerName: 'Amit Shah', announcedBy: '@PartyHighCommand', timestamp: '3 days ago' },
    { id: 'min-2', partyId: 'bjp', portfolioName: 'Finance Ministry', ministerName: 'Nirmala Sitharaman', announcedBy: '@PartyHighCommand', timestamp: '3 days ago' },
  ]);

  const registerPoliticianAccount = ({ handle, password, partyId, constituency, state }) => {
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    const handleKey = cleanHandle.toLowerCase();
    const newAccount = {
      handle: cleanHandle,
      password: password || 'leader123',
      partyId: partyId || 'bjp',
      role: 'politician',
      designation: 'Member of Legislative Assembly (MLA)',
      level: 3,
      constituency: constituency || userConstituency,
      state: state || userState,
      createdAt: Date.now(),
    };

    const updated = {
      ...registeredAccounts,
      [handleKey]: newAccount,
    };
    setRegisteredAccounts(updated);
    localStorage.setItem('mandate_registered_accounts', JSON.stringify(updated));
    claimLeadershipIfVacant(partyId || 'bjp', cleanHandle);
    return { success: true, message: `Account for ${cleanHandle} created! Career progress enabled.` };
  };

  const [rolePasswords, setRolePasswords] = useState(() => {
    try {
      const saved = localStorage.getItem('mandate_role_passwords');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...parsed,
        eci: '2006',
        judge: '2006',
        court: '2006',
        admin: '2006',
        media: parsed.media || 'news123',
        president: parsed.president || 'gov123',
      };
    } catch (e) {
      return {
        eci: '2006',
        judge: '2006',
        court: '2006',
        admin: '2006',
        media: 'news123',
        president: 'gov123',
      };
    }
  });

  const updateRolePassword = (roleKey, newPassword) => {
    const key = String(roleKey).toLowerCase();
    if (['eci', 'court', 'judge', 'admin'].includes(key)) {
      return {
        success: false,
        message: `🔒 Security Policy: The password for ${roleKey.toUpperCase()} is permanently fixed by Constitutional Mandate and CANNOT be customized or changed.`,
      };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }
    const updated = {
      ...rolePasswords,
      [roleKey]: newPassword,
    };
    setRolePasswords(updated);
    localStorage.setItem('mandate_role_passwords', JSON.stringify(updated));
    return { success: true, message: `Successfully updated password for ${roleKey.toUpperCase()} role!` };
  };

  const verifyRolePassword = (roleSelected, passEntered, userHandleInput = '') => {
    const key = String(roleSelected).toLowerCase();
    
    // Fixed passwords for ECI, Court, CJI, and Admin
    if (['eci', 'judge', 'court', 'admin'].includes(key)) {
      return passEntered === '2006';
    }

    if (roleSelected === 'politician') {
      const cleanHandle = userHandleInput.trim().toLowerCase();
      if (cleanHandle && registeredAccounts[cleanHandle]) {
        return registeredAccounts[cleanHandle].password === passEntered;
      }
      return passEntered === 'leader123' || (passEntered && passEntered.length >= 4);
    }

    const expected = rolePasswords[roleSelected];
    if (expected) {
      return passEntered === expected;
    }
    return passEntered && passEntered.length >= 4;
  };

  const assignPartyPost = (partyId, memberHandle, newPost) => {
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === partyId) {
          return {
            ...p,
            posts: {
              ...(p.posts || {}),
              [memberHandle]: newPost,
            },
          };
        }
        return p;
      })
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `PARTY APPOINTMENT: ${memberHandle} Appointed as ${newPost}`,
      content: `Party Leadership has officially assigned the designation of ${newPost} to ${memberHandle}.`,
      author: 'NATIONAL DESK / PRESS TRUST OF INDIA',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Assigned ${newPost} to ${memberHandle} successfully!` };
  };

  const transferPartyLeadership = (partyId, newLeaderName) => {
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === partyId) {
          return {
            ...p,
            leader: newLeaderName,
            president: newLeaderName,
          };
        }
        return p;
      })
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `LEADERSHIP CHANGE: ${newLeaderName} Takes Over as Party President`,
      content: `In a historic announcement, the Party President post has been formally handed over to ${newLeaderName}.`,
      author: 'POLITICAL DESK / ANI',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);
    return { success: true, message: `Party Leadership successfully transferred to ${newLeaderName}!` };
  };

  // --- Lok Sabha Speaker & Parliamentary Floor Hansard Message System ---
  const [speakerDetails, setSpeakerDetails] = useState({
    name: 'Speaker Chair (24H Ballot Active)',
    partyShort: 'IND',
    handle: '@Speaker_Chair',
  });

  const [speakerElection, setSpeakerElection] = useState({
    active: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours Speaker Ballot
    candidates: [
      { id: 'c1', name: 'Nominee A (Ruling Coalition)', partyShort: 'NDA', handle: '@Speaker_NomineeA', votes: 0 },
      { id: 'c2', name: 'Nominee B (Opposition Alliance)', partyShort: 'INDIA', handle: '@Speaker_NomineeB', votes: 0 },
    ],
    playerVotes: {},
  });

  const [hansardFloorMessages, setHansardFloorMessages] = useState([
    {
      id: 'h-1',
      sender: '@Speaker_Chair',
      partyShort: 'IND',
      text: '🎙️ Honorable Members of the 543-Seat Lok Sabha, the floor is open for real-player parliamentary discussions, custom schemes, and policy debates.',
      timestamp: '10:00 AM',
      isOfficialSpeech: true,
    },
  ]);

  const [courtroomMessages, setCourtroomMessages] = useState([
    {
      id: 'court-init-1',
      sender: '@ChiefJustice_Bench',
      senderRole: 'CJI Constitutional Bench',
      text: '⚖️ Open Court Proceedings Commenced: The Bench is listening to writ petitions, anti-defection challenges, and MCC violation appeals.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'CJI_QUESTION',
    },
  ]);

  const [grantedSpeakingHandles, setGrantedSpeakingHandles] = useState(['@Candidate', '@OmBirla', '@narendramodi', '@kharge']);
  const [speakingRequests, setSpeakingRequests] = useState([]);

  const requestFloorSpeakingPermission = (handle) => {
    const targetHandle = handle || userHandle || '@Candidate';
    if (!grantedSpeakingHandles.includes(targetHandle)) {
      setGrantedSpeakingHandles((prev) => [...prev, targetHandle]);
    }
    return { success: true, message: `✅ Speaker ${speakerDetails.name} has granted you floor speaking time! You can now address the House.` };
  };

  const grantFloorSpeakingPermission = (targetHandle, isGranted) => {
    if (isGranted) {
      if (!grantedSpeakingHandles.includes(targetHandle)) {
        setGrantedSpeakingHandles((prev) => [...prev, targetHandle]);
      }
      setSpeakingRequests((prev) => prev.filter((h) => h !== targetHandle));

      const sysMsg = {
        id: `h-grant-${Date.now()}`,
        sender: `${speakerDetails.handle} (Speaker)`,
        partyShort: speakerDetails.partyShort,
        text: `✅ SPEAKER CHAIR ANNOUNCEMENT: Floor speaking time of 5 minutes is granted to ${targetHandle}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfficialSpeech: true,
      };
      setHansardFloorMessages((prev) => [...prev, sysMsg]);
      return { success: true, message: `Granted speaking time to ${targetHandle} on Lok Sabha Floor.` };
    } else {
      setSpeakingRequests((prev) => prev.filter((h) => h !== targetHandle));
      return { success: true, message: `Denied speaking time to ${targetHandle}.` };
    }
  };

  const postHansardFloorMessage = (text) => {
    const handle = userHandle || '@Candidate';
    const activeP = parties.find((p) => p.id === selectedPartyId) || parties[0];

    if (!grantedSpeakingHandles.includes(handle) && role !== 'speaker') {
      return {
        success: false,
        message: `Speaker Permission Required! You must click 'Request Speaker Permission' and get approval from Speaker ${speakerDetails.name} before addressing the House.`,
      };
    }

    const newMsg = {
      id: `h-msg-${Date.now()}`,
      sender: handle,
      partyShort: activeP.shortName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfficialSpeech: false,
    };

    setHansardFloorMessages((prev) => [...prev, newMsg]);

    const newsArticle = {
      id: `news-parl-${Date.now()}`,
      headline: `🏛️ PARLIAMENT ADDRESS: ${handle} Delivers Speech on Lok Sabha Floor`,
      content: `Official Hansard Extract: "${text}". Speech recorded in parliamentary records under Speaker ${speakerDetails.name}.`,
      author: 'LOK SABHA TELEVISION / SANSAD TV',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Speech recorded in Official Hansard Lok Sabha Record!` };
  };

  const castVoteInSpeakerElection = (candidateId) => {
    const handle = userHandle || '@Candidate';
    if (speakerElection.playerVotes[handle]) {
      return { success: false, message: 'You have already cast your vote in the 24-Hour Lok Sabha Speaker Election!' };
    }

    let winnerName = speakerDetails.name;
    let winnerParty = speakerDetails.partyShort;
    let winnerHandle = speakerDetails.handle;

    setSpeakerElection((prev) => {
      const updatedCandidates = prev.candidates.map((c) =>
        c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
      );

      // Find leading candidate
      const sorted = [...updatedCandidates].sort((a, b) => b.votes - a.votes);
      if (sorted[0]) {
        winnerName = sorted[0].name;
        winnerParty = sorted[0].partyShort;
        winnerHandle = sorted[0].handle || `@${sorted[0].name.replace(/\s+/g, '')}`;
      }

      return {
        ...prev,
        candidates: updatedCandidates,
        playerVotes: {
          ...prev.playerVotes,
          [handle]: candidateId,
        },
      };
    });

    setSpeakerDetails({
      name: winnerName,
      partyShort: winnerParty,
      handle: winnerHandle,
    });

    return { success: true, message: `Vote cast in 24-Hour Lok Sabha Speaker Election! Leading candidate: ${winnerName} (${winnerParty}).` };
  };

  const announceMLACandidate = (partyId, constituencyName, candidateName) => {
    const partyObj = parties.find((p) => p.id === partyId);
    const partyShort = partyObj ? partyObj.shortName : 'Party';
    const newNomination = {
      id: `nom-${Date.now()}`,
      partyId,
      partyShort,
      constituencyName,
      candidateName,
      announcedBy: userHandle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPartyNominations((prev) => [newNomination, ...prev]);

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `CANDIDATE ANNOUNCEMENT: ${candidateName} Fielded for ${constituencyName}`,
      content: `${partyShort} High Command has officially declared ${candidateName} as their official candidate for ${constituencyName} seat.`,
      author: 'ELECTION DESK / REPUBLIC NETWORK',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Announced ${candidateName} for ${constituencyName}!` };
  };

  const announceMinistryPortfolio = (partyId, portfolioName, ministerName) => {
    const partyObj = parties.find((p) => p.id === partyId);
    const partyShort = partyObj ? partyObj.shortName : 'Party';
    const newMinistry = {
      id: `min-${Date.now()}`,
      partyId,
      portfolioName,
      ministerName,
      announcedBy: userHandle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMinistryAnnouncements((prev) => [newMinistry, ...prev]);

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `CABINET ANNOUNCEMENT: ${ministerName} Named ${portfolioName} Minister`,
      content: `${partyShort} Party Chief has announced ${ministerName} as Minister for ${portfolioName}.`,
      author: 'GOVERNMENT DESK / TIMES SATELLITE',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Announced ${ministerName} as ${portfolioName} Minister!` };
  };

  const collectVotesThroughRally = ({ constituencyName, costCrores, scale }) => {
    const targetSeat = seats.find((s) => s.constituencyName.toLowerCase() === (constituencyName || userConstituency).toLowerCase()) || seats[0];
    const votesWon = scale === 'MEGA' ? 250000 : scale === 'JAN_SABHA' ? 120000 : 50000;

    const partyObj = parties.find((p) => p.id === selectedPartyId);
    if (partyObj && partyObj.fundsInCrores >= (costCrores || 5)) {
      setParties((prev) =>
        prev.map((p) => (p.id === selectedPartyId ? { ...p, fundsInCrores: Math.max(0, p.fundsInCrores - (costCrores || 5)) } : p))
      );
    } else {
      setPlayerSalaryBalance((bal) => Math.max(0, bal - (costCrores || 5) * 10000000));
    }

    castVoteInConstituency(targetSeat.id, selectedPartyId, votesWon);

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🔥 MASSIVE RALLY: ${userHandle} Mobilizes ${votesWon.toLocaleString()} Supporters in ${targetSeat.constituencyName}!`,
      content: `${scale || 'CAMPAIGN'} Rally organized in ${targetSeat.constituencyName} (${targetSeat.state}). Huge turnout registered!`,
      author: 'ELECTION WAR ROOM WIRE',
      bias: 'PRO_GOVT',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, votesWon, seatName: targetSeat.constituencyName, message: `Rally Success! Collected +${votesWon.toLocaleString()} votes in ${targetSeat.constituencyName}!` };
  };

  const collectVotesThroughPressMeet = ({ headline, statement }) => {
    const votesWon = Math.floor(Math.random() * 50000) + 40000;
    const randomSeat = seats.find((s) => s.state === userState) || seats[0];

    castVoteInConstituency(randomSeat.id, selectedPartyId, votesWon);

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `🎙️ PRESS MEET: ${headline || 'Party High Command Outlines Vision for State'}`,
      content: statement || `${userHandle} held a national press conference outlining key economic & welfare pledges.`,
      author: 'TIMES NATIONAL BUREAU',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, votesWon, message: `Press Conference Published! Gained +${votesWon.toLocaleString()} votes across ${userState}!` };
  };

  const collectVotesThroughDebate = ({ topic, score, votesWon }) => {
    const totalVotes = votesWon || Math.floor(Math.random() * 100000) + 100000;
    const targetSeat = seats.find((s) => s.constituencyName === userConstituency) || seats[0];

    castVoteInConstituency(targetSeat.id, selectedPartyId, totalVotes);

    setParties((prev) =>
      prev.map((p) => (p.id === selectedPartyId ? { ...p, approvalRating: Math.min(100, p.approvalRating + 4) } : p))
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `⚔️ LIVE DEBATE VICTORY: ${userHandle} Dominates Prime Time Debate on '${topic || 'National Issues'}'`,
      content: `Simultaneous message debate concluded. Viewers scored debate performance at ${score || 94}%. Added +${totalVotes.toLocaleString()} votes!`,
      author: 'PRIME TIME DEBATE DESK',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, totalVotes, message: `Debate Victory! Scored ${score || 94}% and collected +${totalVotes.toLocaleString()} votes!` };
  };

  const switchParty = (newPartyId) => {
    if (!newPartyId || newPartyId === selectedPartyId) return { success: false, message: 'Already member of this party.' };

    const oldPartyObj = parties.find((p) => p.id === selectedPartyId);
    const newPartyObj = parties.find((p) => p.id === newPartyId);

    const oldPartyName = oldPartyObj ? oldPartyObj.shortName : 'Old Party';
    const newPartyName = newPartyObj ? newPartyObj.shortName : 'New Party';

    // 1. Remove all party executive posts from old party
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === selectedPartyId) {
          const updatedPosts = { ...(p.posts || {}) };
          delete updatedPosts[userHandle];
          let updatedLeader = p.leader;
          let updatedPresident = p.president;

          if (p.leader === userHandle || p.president === userHandle) {
            updatedLeader = `Interim High Command (${oldPartyName})`;
            updatedPresident = `Interim Board (${oldPartyName})`;
          }

          return {
            ...p,
            leader: updatedLeader,
            president: updatedPresident,
            posts: updatedPosts,
          };
        }
        return p;
      })
    );

    // 2. Remove all MLA/MP Candidate Nominations & Cabinet Ministry Announcements
    setPartyNominations((prev) =>
      prev.filter((nom) => !(nom.partyId === selectedPartyId && (nom.announcedBy === userHandle || nom.candidateName === userHandle)))
    );

    setMinistryAnnouncements((prev) =>
      prev.filter((min) => !(min.partyId === selectedPartyId && (min.announcedBy === userHandle || min.ministerName === userHandle)))
    );

    // 3. Strip MP/MLA Seat Holding in player's primary constituency
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.constituencyName === userConstituency && seat.leadingPartyId === selectedPartyId) {
          return {
            ...seat,
            leadingPartyId: newPartyId,
            marginPercent: 0.5,
            recentWorkDone: ['[BY-ELECTION VACANCY] MP Disqualified under 10th Schedule Anti-Defection Law', ...(seat.recentWorkDone || []).slice(0, 2)],
          };
        }
        return seat;
      })
    );

    // 4. Update player's active party
    setSelectedPartyId(newPartyId);

    // 5. Broadcast 10th Schedule Anti-Defection Gazette Order
    const newsArticle = {
      id: `news-defection-${Date.now()}`,
      headline: `🚨 10TH SCHEDULE ANTI-DEFECTION DISQUALIFICATION: ${userHandle} Defects from ${oldPartyName} to ${newPartyName}!`,
      content: `Under Article 102(2) & 191(2) of the Constitution of India, ${userHandle} has been automatically disqualified from their MLA/MP seat and stripped of all party executive posts upon changing party allegiance to ${newPartyName}.`,
      author: 'SPEAKER OFFICE & SUPREME COURT BENCH',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };

    setArticles((prev) => [newsArticle, ...prev]);

    return {
      success: true,
      message: `Anti-Defection Law Enforced: Disqualified from MLA/MP seat & stripped of ${oldPartyName} posts! Joined ${newPartyName}.`,
    };
  };

  const disqualifyMemberForDefection = (memberHandle, partyId) => {
    const partyObj = parties.find((p) => p.id === partyId);
    const partyShort = partyObj ? partyObj.shortName : 'Party';

    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === partyId) {
          const updatedPosts = { ...(p.posts || {}) };
          delete updatedPosts[memberHandle];
          return {
            ...p,
            posts: updatedPosts,
            leader: p.leader === memberHandle ? `Interim Leader (${partyShort})` : p.leader,
            president: p.president === memberHandle ? `Interim President (${partyShort})` : p.president,
          };
        }
        return p;
      })
    );

    setPartyNominations((prev) =>
      prev.filter((nom) => !(nom.partyId === partyId && (nom.announcedBy === memberHandle || nom.candidateName === memberHandle)))
    );

    setMinistryAnnouncements((prev) =>
      prev.filter((min) => !(min.partyId === partyId && (min.announcedBy === memberHandle || min.ministerName === memberHandle)))
    );

    const newsArticle = {
      id: `news-def-${Date.now()}`,
      headline: `🚨 ANTI-DEFECTION ORDER: ${memberHandle} Disqualified as MLA/MP`,
      content: `${memberHandle} has been disqualified from legislative seat and stripped of all executive posts in ${partyShort} following party defection.`,
      author: 'NIRVACHAN SADAN & SPEAKER DESK',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Disqualified ${memberHandle} and stripped all posts!` };
  };

  const loginUser = ({ handle, role: selectedRole, partyId }) => {
    const finalHandle = handle && handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : '@Candidate';
    const handleKey = finalHandle.toLowerCase();

    // Restore saved account progress
    const savedAccount = registeredAccounts[handleKey];
    const restoredPartyId = savedAccount?.partyId || partyId || selectedPartyId;
    const restoredRole = savedAccount?.role || selectedRole || role;

    if (savedAccount?.state) {
      setUserState(savedAccount.state);
      localStorage.setItem('mandate_user_state', savedAccount.state);
    }
    if (savedAccount?.constituency) {
      setUserConstituency(savedAccount.constituency);
      localStorage.setItem('mandate_user_constituency', savedAccount.constituency);
    }

    if (isLoggedIn && restoredPartyId && restoredPartyId !== selectedPartyId) {
      switchParty(restoredPartyId);
    } else {
      setSelectedPartyId(restoredPartyId);
    }

    setUserHandle(finalHandle);
    setRole(restoredRole);

    localStorage.setItem('mandate_user_handle', finalHandle);
    localStorage.setItem('mandate_user_role', restoredRole);
    localStorage.setItem('mandate_user_party_id', restoredPartyId);
    localStorage.setItem('mandate_is_logged_in', 'true');
    setIsLoggedIn(true);

    if (restoredRole === 'politician') {
      claimLeadershipIfVacant(restoredPartyId, finalHandle);
    }
    return {
      success: true,
      message: `Welcome back, ${finalHandle}! Continued saved career progress (${savedAccount?.designation || restoredRole.toUpperCase()}).`,
    };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('mandate_is_logged_in', 'false');
  };

  const createAlliance = ({ name, shortName, color, description }) => {
    const leaderParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
    const newAlliance = {
      id: `alliance-${Date.now()}`,
      name: name || 'New Sovereign Front',
      shortName: shortName || (name ? name.slice(0, 5).toUpperCase() : 'NSF'),
      leaderPartyId: leaderParty.id,
      memberPartyIds: [leaderParty.id],
      color: color || '#FFD700',
      description: description || `Formed under leadership of ${leaderParty.name}.`,
    };

    setAlliances((prevAlliances) => {
      const cleaned = prevAlliances.map((a) => ({
        ...a,
        memberPartyIds: a.memberPartyIds.filter((pid) => pid !== leaderParty.id),
      })).filter((a) => a.memberPartyIds.length > 0);
      return [...cleaned, newAlliance];
    });

    setParties((prevParties) =>
      prevParties.map((p) => (p.id === leaderParty.id ? { ...p, allianceId: newAlliance.id } : p))
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `BREAKING: ${leaderParty.shortName} Forms New Alliance '${newAlliance.name}'`,
      content: `${leaderParty.name} leader ${userHandle} has officially announced the creation of ${newAlliance.name}. Regional parties are invited to join the coalition.`,
      author: 'ELECTION WIRE / PRESS TRUST OF INDIA',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return {
      success: true,
      alliance: newAlliance,
      message: `Alliance '${newAlliance.name}' created successfully!`,
    };
  };

  const leaveAlliance = (partyId = selectedPartyId) => {
    const partyObj = parties.find((p) => p.id === partyId);
    if (!partyObj || !partyObj.allianceId) {
      return { success: false, message: 'Party is not currently member of any alliance.' };
    }

    const currentAllianceId = partyObj.allianceId;

    setAlliances((prevAlliances) =>
      prevAlliances.map((a) => {
        if (a.id === currentAllianceId) {
          const updatedMembers = a.memberPartyIds.filter((pid) => pid !== partyId);
          let newLeader = a.leaderPartyId;
          if (a.leaderPartyId === partyId) {
            newLeader = updatedMembers[0] || null;
          }
          return {
            ...a,
            leaderPartyId: newLeader,
            memberPartyIds: updatedMembers,
          };
        }
        return a;
      }).filter((a) => a.memberPartyIds.length > 0)
    );

    setParties((prevParties) =>
      prevParties.map((p) => (p.id === partyId ? { ...p, allianceId: null } : p))
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `POLITICAL SHIFT: ${partyObj.shortName} Exits Coalition`,
      content: `${partyObj.name} led by ${userHandle} has formally severed ties with its alliance to maintain an independent political stance.`,
      author: 'NATIONAL DESK / TIMES SATELLITE',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Successfully exited coalition.` };
  };

  const joinAlliance = (targetAllianceId, partyId = selectedPartyId) => {
    const partyObj = parties.find((p) => p.id === partyId);
    const targetAlliance = alliances.find((a) => a.id === targetAllianceId);

    if (!partyObj || !targetAlliance) {
      return { success: false, message: 'Invalid party or alliance target.' };
    }

    if (partyObj.allianceId) {
      leaveAlliance(partyId);
    }

    setAlliances((prevAlliances) =>
      prevAlliances.map((a) => {
        if (a.id === targetAllianceId) {
          if (!a.memberPartyIds.includes(partyId)) {
            return {
              ...a,
              memberPartyIds: [...a.memberPartyIds, partyId],
            };
          }
        }
        return a;
      })
    );

    setParties((prevParties) =>
      prevParties.map((p) => (p.id === partyId ? { ...p, allianceId: targetAllianceId } : p))
    );

    const newsArticle = {
      id: `news-${Date.now()}`,
      headline: `COALITION EXPANSION: ${partyObj.shortName} Joins ${targetAlliance.name}`,
      content: `In a major political realignment, ${partyObj.name} has formally pledged its support and joined the ${targetAlliance.name} coalition block.`,
      author: 'REPUBLIC NETWORK',
      bias: 'NEUTRAL',
      timestamp: 'Just now',
    };
    setArticles((prev) => [newsArticle, ...prev]);

    return { success: true, message: `Joined ${targetAlliance.name} successfully!` };
  };
  const [electionPhase, setElectionPhase] = useState('PRE_ELECTION');
  const [currentPhaseNumber, setCurrentPhaseNumber] = useState(1);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // AI Autonomous Agents state
  const [aiECIEnabled, setAiECIEnabled] = useState(true);
  const [aiChiefJusticeEnabled, setAiChiefJusticeEnabled] = useState(true);

  // Player Personal Finance & Popularity State
  const [playerPopularity, setPlayerPopularity] = useState(68);
  const [playerSalaryBalance, setPlayerSalaryBalance] = useState(1245780);

  // Hourly Money Collector state (1-hour cycle = 3600 seconds)
  const [lastHourlyClaimTime, setLastHourlyClaimTime] = useState(() => Date.now());
  const [accumulatedHourlyRevenue, setAccumulatedHourlyRevenue] = useState(350000); // Initial ₹3.5 Lakhs
  const [hourlyRate] = useState(500000); // Base ₹5 Lakhs per 1 hour

  // 1-Minute Live Media Auto-Publishing State
  const [autoMediaPublishing, setAutoMediaPublishing] = useState(true);

  // AAA Gaming Resources (Matching reference UI)
  const [energy, setEnergy] = useState(120);
  const [maxEnergy] = useState(120);
  const [supporters, setSupporters] = useState(28560);
  const [diamonds, setDiamonds] = useState(1250);
  const [leaderLevel, setLeaderLevel] = useState(18);
  const [levelXpPercent] = useState(64);

  // Daily Tasks State
  const [dailyTasks, setDailyTasks] = useState([
    { id: 't1', title: 'Campaign in 3 constituencies', progress: '1/3', reward: '₹75,000', status: 'GO' },
    { id: 't2', title: 'Win 2 campaign battles', progress: '0/2', reward: '₹1,000,000', status: 'GO' },
    { id: 't3', title: 'Participate in parliament vote', progress: '0/1', reward: '₹50,000', status: 'GO' },
    { id: 't4', title: 'Donate to your party', progress: '0/1', reward: '₹25,000', status: 'GO' },
    { id: 't5', title: 'Invite 3 new players', progress: '0/3', reward: '₹1,000,000', status: 'GO' },
  ]);

  // Earnings Center State
  const [earningsItems, setEarningsItems] = useState([
    { id: 'e1', title: 'Daily Login Bonus', reward: '+ ₹50,000', btnText: 'CLAIM', claimed: false },
    { id: 'e2', title: 'Complete Daily Tasks', reward: '+ ₹1,000,000', btnText: 'GO', claimed: false },
    { id: 'e3', title: 'Watch Advertisement', reward: '+ ₹25,000', btnText: 'WATCH', claimed: false },
    { id: 'e4', title: 'Refer a Friend', reward: '+ ₹2,000,000', btnText: 'INVITE', claimed: false },
    { id: 'e5', title: 'Win Campaign Battle', reward: '+ ₹10,000 / Win', btnText: 'GO', claimed: false },
    { id: 'e6', title: 'Parliament Participation', reward: '+ ₹5,000 / Vote', btnText: 'GO', claimed: false },
  ]);

  // State Assembly & Election Scope state
  const [electionScope, setElectionScope] = useState('NATIONAL_LOK_SABHA');
  const [selectedStateAssemblyId, setSelectedStateAssemblyId] = useState('up-assembly');

  // Union & State Budget Allocation State (PM, Central Ministers & State CMs)
  const [unionBudgetAllocations, setUnionBudgetAllocations] = useState({
    defence: 620000,
    infrastructure: 450000,
    healthcare: 210000,
    agriculture: 180000,
    education: 150000,
    ruralDev: 140000,
  });

  const [stateBudgetAllocations, setStateBudgetAllocations] = useState({
    'Uttar Pradesh': 85000,
    'Maharashtra': 72000,
    'West Bengal': 55000,
    'Bihar': 62000,
    'Tamil Nadu': 48000,
    'Madhya Pradesh': 45000,
    'Karnataka': 46000,
    'Rajasthan': 44000,
    'Gujarat': 42000,
    'Andhra Pradesh': 38000,
  });

  // Public Meter & Parliamentary Bills state
  const [governmentApproval, setGovernmentApproval] = useState(58);
  const [governingPartyId, setGoverningPartyId] = useState('bjp');
  const [bills, setBills] = useState(INITIAL_PARLIAMENT_BILLS);
  const [statePopularity, setStatePopularity] = useState({
    'Uttar Pradesh': { bjp: 58, inc: 28, sp: 48, bsp: 35 },
    'Maharashtra': { bjp: 52, inc: 42, ss: 44 },
    'West Bengal': { tmc: 62, bjp: 45, inc: 22, cpim: 20 },
    'Tamil Nadu': { dmk: 58, aiadmk: 48, bjp: 25, tvk: 38 },
    'Punjab': { aap: 55, inc: 45, bjp: 24 },
    'Bihar': { jdu: 48, bjp: 54, rjd: 52, inc: 32 },
    'Gujarat': { bjp: 68, inc: 30, aap: 25 },
    'Karnataka': { inc: 56, bjp: 50 },
    'Delhi': { aap: 58, bjp: 48, inc: 20 },
    'Telangana': { inc: 54, brs: 46, bjp: 38 },
    'Andhra Pradesh': { tdp: 56, ysrcp: 48, bjp: 32 },
    'Odisha': { bjd: 58, bjp: 52, inc: 24 },
  });

  const [playerFinances, setPlayerFinances] = useState({
    whiteMoneyCrores: 25,
    blackMoneyCrores: 50,
    isLeader: true,
    businesses: [],
    edRaidRiskPercent: 5,
  });

  const allocateCentralAndStateBudgets = ({ unionPortfolios, stateDevolutions, notes }) => {
    if (unionPortfolios) {
      setUnionBudgetAllocations((prev) => ({ ...prev, ...unionPortfolios }));
    }
    if (stateDevolutions) {
      setStateBudgetAllocations((prev) => ({ ...prev, ...stateDevolutions }));

      // Dynamic popularity boost for CM states allocated extra devolution funds
      setStatePopularity((prev) => {
        const next = { ...prev };
        Object.entries(stateDevolutions).forEach(([st, amt]) => {
          if (next[st]) {
            const boost = Math.min(10, Math.floor(amt / 10000));
            Object.keys(next[st]).forEach((pId) => {
              next[st][pId] = Math.min(100, (next[st][pId] || 45) + (pId === governingPartyId ? boost : Math.floor(boost / 2)));
            });
          }
        });
        return next;
      });
    }

    setGovernmentApproval((prev) => Math.min(100, prev + 3));

    setParties((prev) =>
      prev.map((p) => {
        if (p.id === selectedPartyId) {
          return {
            ...p,
            politicalCapital: Math.min(100, (p.politicalCapital || 100) + 15),
            approvalRating: Math.min(100, p.approvalRating + 4),
          };
        }
        return p;
      })
    );

    publishNewsArticle({
      headline: `💰 Union Budget Allocation Released: PM, Central Ministers & All State CM Grants Dispatched`,
      content: `Official Executive Budget Allocation: ${notes || 'Funds allocated for Union Ministries and all 10 State Chief Ministers.'} Overall National Government Approval boosted by +3%.`,
      author: 'Union Finance Secretariat',
      bias: 'PRO_GOVT',
      impactOnPartyId: governingPartyId,
      approvalChange: 3,
    });
  };

  const buyBusiness = (type, name, costCrores) => {
    if ((playerFinances.whiteMoneyCrores || 0) < costCrores) {
      return { success: false, message: `⚠️ Insufficient White Money Treasury! (Required ₹${costCrores} Cr). Balance cannot go negative.` };
    }
    const newAsset = {
      id: `biz-${Date.now()}`,
      name: name || type,
      type,
      costCrores,
      whiteIncomePerTick: Number((costCrores * 0.05).toFixed(1)),
      blackIncomePerTick: Number((costCrores * 0.08).toFixed(1)),
      edRaidRisk: 5,
    };
    setPlayerFinances((prev) => ({
      ...prev,
      whiteMoneyCrores: Math.max(0, prev.whiteMoneyCrores - costCrores),
      businesses: [...prev.businesses, newAsset],
    }));
    return { success: true, message: `🎉 Successfully acquired corporate asset '${name || type}' for ₹${costCrores} Cr!` };
  };

  const launderBlackMoney = (amountCrores) => {
    if (playerFinances.blackMoneyCrores < amountCrores) return;
    setPlayerFinances((prev) => ({
      ...prev,
      blackMoneyCrores: prev.blackMoneyCrores - amountCrores,
      whiteMoneyCrores: prev.whiteMoneyCrores + Math.round(amountCrores * 0.75),
    }));
  };

  const bribeCandidate = (seatId, targetPartyId, bribeCrores) => {
    if (playerFinances.blackMoneyCrores < bribeCrores) return;
    setPlayerFinances((prev) => ({
      ...prev,
      blackMoneyCrores: prev.blackMoneyCrores - bribeCrores,
    }));
    setSeats((prev) =>
      prev.map((s) => (s.id === seatId ? { ...s, leadingPartyId: targetPartyId, marginPercent: Math.min(20, s.marginPercent + 3) } : s))
    );
  };

  const getAuthoritativeState = () => ({
    parties,
    seats,
    bills,
    events,
    articles,
    polls,
    governmentApproval,
    governingPartyId,
    statePopularity,
    playerFinances,
    rolePasswords,
  });

  const applyEngineResult = (res) => {
    if (!res.success) {
      alert(res.message);
      return;
    }
    setParties(res.state.parties);
    setSeats(res.state.seats);
    setBills(res.state.bills);
    setEvents(res.state.events);
    setArticles(res.state.articles);
    setGovernmentApproval(res.state.governmentApproval);
    setStatePopularity(res.state.statePopularity);
  };

  const proposeBill = (billData) => {
    const res = ServerGameEngine.proposeBillWithPoliticalCapital(getAuthoritativeState(), billData);
    applyEngineResult(res);
  };

  const advanceBillStage = (billId, nextStage) => {
    const res = ServerGameEngine.advanceBillStage(getAuthoritativeState(), billId, nextStage);
    applyEngineResult(res);
  };

  const issuePartyWhip = (billId, partyId, direction, whipType) => {
    const res = ServerGameEngine.issuePartyWhip(getAuthoritativeState(), billId, partyId, direction, whipType);
    applyEngineResult(res);
  };

  const processPresidentialAssent = (billId, action) => {
    const res = ServerGameEngine.processPresidentialAssent(getAuthoritativeState(), billId, action);
    if (res.success) {
      let nextState = res.state;
      // If approved, execute real-world bill policy impacts
      if (action === 'APPROVED') {
        const enactedBill = nextState.bills.find((b) => b.id === billId);
        nextState = PoliticalMechanicsEngine.executeEnactedBillPolicy(nextState, enactedBill);
      }
      applyEngineResult({ success: true, state: nextState });
      return { success: true, message: action === 'APPROVED' ? 'Presidential Assent Granted! Policy enacted.' : 'Bill returned to Parliament under Article 111.' };
    } else {
      applyEngineResult(res);
      return res;
    }
  };

  const splitParty = (sourcePartyId, splittingMemberCount, newPartyName, newShortName, newSymbol) => {
    const res = PoliticalMechanicsEngine.processPartySplit(getAuthoritativeState(), sourcePartyId, splittingMemberCount, newPartyName, newShortName, newSymbol);
    if (res && res.state) {
      if (res.state.parties) setParties(res.state.parties);
      if (res.state.seats) setSeats(res.state.seats);
      if (res.state.petitions) setPetitions(res.state.petitions);
      if (res.state.articles) setArticles(res.state.articles);
    }
    return res;
  };

  const mergeParties = (sourcePartyId, targetPartyId) => {
    const res = PoliticalMechanicsEngine.processPartyMerger(getAuthoritativeState(), sourcePartyId, targetPartyId);
    if (res && res.state) {
      if (res.state.parties) setParties(res.state.parties);
      if (res.state.seats) setSeats(res.state.seats);
      if (res.state.articles) setArticles(res.state.articles);
    }
    return res;
  };

  const promulgateOrdinance = (title, category) => {
    const newBill = {
      id: `ordinance-${Date.now()}`,
      title: `📜 GAZETTE ORDINANCE: ${title}`,
      description: `Presidential Emergency Ordinance promulgated under Article 123 in Category: ${category}.`,
      category,
      billType: 'ORDINARY',
      proposerPartyId: governingPartyId,
      status: 'ENACTED',
    };

    let nextState = {
      ...getAuthoritativeState(),
      bills: [newBill, ...bills],
    };

    nextState = PoliticalMechanicsEngine.executeEnactedBillPolicy(nextState, newBill);
    applyEngineResult({ success: true, state: nextState });
    return { success: true, message: `Presidential Ordinance '${title}' Promulgated under Article 123!` };
  };

  const invokePresidentsRule = (stateName) => {
    const newsArticle = {
      id: `news-art356-${Date.now()}`,
      headline: `🚨 CONSTITUTIONAL EMERGENCY (Article 356): President's Rule Imposed in ${stateName}`,
      content: `State assembly suspended under Article 356 following Raj Bhavan Governor report on breakdown of constitutional machinery in ${stateName}.`,
      author: 'Rashtrapati Bhavan Press Bureau',
      category: 'GOVERNANCE',
      bias: 'NEUTRAL',
      sentiment: 'NEGATIVE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setArticles((prev) => [newsArticle, ...prev]);
    return { success: true, message: `President's Rule (Article 356) imposed in ${stateName}.` };
  };

  const certifyMoneyBill = (billId) => {
    const res = ServerGameEngine.certifyMoneyBillBySpeaker(getAuthoritativeState(), billId);
    applyEngineResult(res);
  };

  const moveSpecialParliamentaryMotion = (motionType) => {
    const res = ServerGameEngine.moveSpecialParliamentaryMotion(getAuthoritativeState(), motionType, selectedPartyId);
    applyEngineResult(res);
  };

  const voteAndProcessBill = (billId, playerVote) => {
    const res = ServerGameEngine.processFloorVote(getAuthoritativeState(), billId, selectedPartyId, playerVote);
    applyEngineResult(res);
  };

  const submitCustomPartyApplication = (data) => {
    const newApp = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'PENDING',
      submissionTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCustomApplications((prev) => [newApp, ...prev]);

    publishNewsArticle({
      headline: `🚨 New Political Party '${data.partyName}' Files Registration Request with ECI`,
      content: `Party founder ${data.leaderName} has submitted registration papers for '${data.partyName}' (${data.shortName}) under ${data.ideology} platform. Pending Election Commission approval.`,
      author: 'ECI Bureau News',
      bias: 'NEUTRAL',
    });
  };

  const reviewCustomPartyApplication = (id, status, comments) => {
    setCustomApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, eciComments: comments } : app))
    );

    const app = customApplications.find((a) => a.id === id);
    if (app && status === 'APPROVED') {
      const newPartyId = app.shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const newParty = {
        id: newPartyId,
        name: app.partyName,
        shortName: app.shortName,
        symbol: app.symbol,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
        ideology: app.ideology,
        leader: app.leaderName,
        isRegistered: true,
        fundsInCrores: 500,
        approvalRating: 35,
        seatsWon: 0,
        voteSharePercent: 2.0,
        manifestoPromises: [app.manifesto.slice(0, 40) + '...'],
        isAIControlled: false,
      };

      setParties((prev) => [...prev, newParty]);

      publishNewsArticle({
        headline: `✅ Election Commission Grants Official Recognition to '${app.partyName}'`,
        content: `ECI has approved party symbol ${app.symbol} for ${app.partyName}. The party can now field candidates across all 543 Lok Sabha seats!`,
        author: 'Press Trust of India (PTI)',
        bias: 'NEUTRAL',
        impactOnPartyId: newPartyId,
        approvalChange: 5,
      });
    }
  };

  const holdRally = (seatId, partyId) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, fundsInCrores: Math.max(0, p.fundsInCrores - 15) } : p))
    );

    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          const isLeading = seat.leadingPartyId === partyId;
          const newMargin = isLeading ? seat.marginPercent + 1.5 : Math.max(0.5, seat.marginPercent - 1.2);
          const newLeading = !isLeading && newMargin <= 0.5 ? partyId : seat.leadingPartyId;
          return {
            ...seat,
            campaignHeat: Math.min(100, seat.campaignHeat + 12),
            leadingPartyId: newLeading,
            marginPercent: Number(newMargin.toFixed(1)),
          };
        }
        return seat;
      })
    );
  };

  const announceScheme = (partyId, costCrores, manifestoText) => {
    setParties((prev) =>
      prev.map((p) => {
        if (p.id === partyId) {
          return {
            ...p,
            fundsInCrores: Math.max(0, p.fundsInCrores - costCrores),
            approvalRating: Math.min(100, p.approvalRating + 3),
            manifestoPromises: [...p.manifestoPromises, manifestoText],
          };
        }
        return p;
      })
    );

    publishNewsArticle({
      headline: `📢 Major Manifesto Guarantee Announced by ${parties.find((p) => p.id === partyId)?.shortName}`,
      content: `Pledged: "${manifestoText}". Estimated budget impact ₹${costCrores} Cr.`,
      author: 'Political Bureau',
      bias: 'NEUTRAL',
      impactOnPartyId: partyId,
      approvalChange: 3,
    });
  };

  const performMPWork = (seatId, category, title, costCrores) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId) {
          const currentParty = parties.find((p) => p.id === seat.leadingPartyId);
          if (currentParty && currentParty.fundsInCrores >= costCrores) {
            setParties((pPrev) =>
              pPrev.map((p) => (p.id === currentParty.id ? { ...p, fundsInCrores: p.fundsInCrores - costCrores } : p))
            );
          }

          const scoreGain = category === 'INFRASTRUCTURE' ? 25 : category === 'HEALTHCARE' ? 20 : category === 'SKILL_CENTER' ? 18 : 15;
          const satisfactionGain = category === 'INFRASTRUCTURE' ? 18 : category === 'HEALTHCARE' ? 15 : category === 'SKILL_CENTER' ? 12 : 10;
          const newMargin = Math.min(30, seat.marginPercent + (category === 'INFRASTRUCTURE' ? 2.5 : 1.5));

          return {
            ...seat,
            mpWorkScore: Math.min(100, seat.mpWorkScore + scoreGain),
            voterSatisfaction: Math.min(100, seat.voterSatisfaction + satisfactionGain),
            marginPercent: Number(newMargin.toFixed(1)),
            recentWorkDone: [title, ...(seat.recentWorkDone || []).slice(0, 3)],
          };
        }
        return seat;
      })
    );

    const seatObj = seats.find((s) => s.id === seatId);
    if (seatObj) {
      publishNewsArticle({
        headline: `🏗️ MP Development Project Completed in ${seatObj.constituencyName} (${seatObj.state})`,
        content: `MP Work: "${title}". Local voter satisfaction boosted to ${Math.min(100, seatObj.voterSatisfaction + 15)}%.`,
        author: 'State Infrastructure Bureau',
        bias: 'PRO_GOVT',
      });
    }
  };

  const hostTVDebate = (topic, participatingPartyIds) => {
    const scores = participatingPartyIds.map((pId) => {
      const party = parties.find((p) => p.id === pId);
      const score = (party?.approvalRating || 50) + Math.floor(Math.random() * 30);
      return { partyId: pId, score };
    });

    scores.sort((a, b) => b.score - a.score);
    const winnerId = scores[0].partyId;
    const winnerParty = parties.find((p) => p.id === winnerId);

    setParties((prev) =>
      prev.map((p) => (p.id === winnerId ? { ...p, approvalRating: Math.min(100, p.approvalRating + 4) } : p))
    );

    publishNewsArticle({
      headline: `🎙️ PRIME TIME TV DEBATE: ${winnerParty?.shortName} Dominates Discussion on '${topic}'`,
      content: `National TV debate concluded. Political analysts credit ${winnerParty?.leader} for sharp arguments, boosting national vote sentiment.`,
      author: 'National Debate Studio',
      bias: 'NEUTRAL',
      impactOnPartyId: winnerId,
      approvalChange: 4,
    });
  };

  const filePetition = (petitionData) => {
    const newPet = {
      ...petitionData,
      id: `pet-${Date.now()}`,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPetitions((prev) => [newPet, ...prev]);
  };

  const deliverVerdict = (id, verdict, note) => {
    setPetitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'VERDICT_DELIVERED', verdict, judgeOrderNote: note } : p))
    );

    const pet = petitions.find((p) => p.id === id);
    const orderText = note || 'Judgment pronounced in open court by Chief Justice Bench.';

    const courtMsg = {
      id: `court-verdict-${Date.now()}`,
      sender: userHandle || '@ChiefJustice_Bench',
      senderRole: 'Chief Justice Bench',
      text: `🔨 BINDING JUDICIAL ORDER: Petition by ${pet ? pet.petitioner : 'Party'} ${verdict.replace(/_/g, ' ')}. ${orderText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'JUDICIAL_VERDICT',
    };
    setCourtroomMessages((prev) => [courtMsg, ...prev]);

    if (pet) {
      publishNewsArticle({
        headline: `⚖️ Supreme Court Verdict: Petition by ${pet.petitioner} ${verdict.replace(/_/g, ' ')}`,
        content: `Bench Order: "${orderText}". Judgment pronounced in open court.`,
        author: 'Legal Correspondent',
        bias: 'NEUTRAL',
      });
    }

    if (socketService.socket && socketService.socket.connected) {
      socketService.emitCourtroomMessage(courtMsg);
    }
  };

  const askCourtQuestion = (questionText) => {
    if (!questionText || !questionText.trim()) return;
    const newMsg = {
      id: `court-${Date.now()}`,
      sender: userHandle || '@ChiefJustice_Bench',
      senderRole: role === 'judge' || role === 'court' ? 'Chief Justice Bench' : 'Petitioner Counsel',
      text: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: role === 'judge' || role === 'court' ? 'CJI_QUESTION' : 'PETITIONER_ARGUMENT',
    };
    setCourtroomMessages((prev) => [newMsg, ...prev]);

    publishNewsArticle({
      headline: `⚖️ SUPREME COURT PROCEEDINGS: ${role === 'judge' ? 'Chief Justice Bench Directives' : 'Counsel Argument Submitted'}`,
      content: `Court Statement: "${questionText.trim()}"`,
      author: 'Supreme Court Press Desk',
      bias: 'NEUTRAL',
    });

    if (socketService.socket && socketService.socket.connected) {
      socketService.emitCourtroomMessage(newMsg);
    }
  };

  const triggerSuddenEmergencyCrisis = (crisisType, customTitle, detailsText) => {
    const crisisPresets = {
      FLOOD: {
        title: '🌊 DEVASTATING NATIONAL FLASH FLOOD & CYCLONE EMERGENCY',
        desc: 'Severe monsoon flooding & cyclone inundates 12 coastal and riverine states. Mass relief deployment required.',
        approvalChange: -5,
      },
      WAR: {
        title: '⚔️ BORDER SECURITY ESCALATION & WAR ALERT CRISIS',
        desc: 'High tension escalation along northern frontiers. Defense Forces placed on Red Alert Status. Parliament Emergency Session convened.',
        approvalChange: +4,
      },
      FINANCIAL_CRASH: {
        title: '📉 STOCK MARKET CRASH & HIGH INFLATION EMERGENCY',
        desc: 'Global economic shock causes Sensex drop of 1,800 points. Retail inflation spikes. Emergency Union RBI intervention needed.',
        approvalChange: -6,
      },
      DROUGHT: {
        title: '🌾 SEVERE AGRICULTURAL DROUGHT & FARMERS DISTRESS',
        desc: 'Deficit monsoon causes severe crop loss across Central India. Farmers demand immediate loan waiver package.',
        approvalChange: -4,
      },
      PANDEMIC: {
        title: '☣️ PUBLIC HEALTH PANDEMIC ALERT & HIGH CONTAGION CRISIS',
        desc: 'New viral strain detected in metro cities. ICMR guidelines mandate emergency hospital beds and vaccine procurement.',
        approvalChange: -3,
      },
    };

    const config = crisisPresets[crisisType] || {
      title: customTitle || '🚨 SUDDEN EMERGENCY NATIONAL CRISIS',
      desc: detailsText || 'National emergency declared by Sovereign Game Admin.',
      approvalChange: -3,
    };

    publishNewsArticle({
      headline: config.title,
      content: `BREAKING ADMIN EMERGENCY: ${config.desc}`,
      author: 'SOVEREIGN GAME MASTER / UNION CABINET DESK',
      bias: 'NEUTRAL',
      impactOnPartyId: governingPartyId,
      approvalChange: config.approvalChange,
    });

    const newEvent = {
      id: `crisis-${Date.now()}`,
      title: config.title,
      description: config.desc,
      severity: 'CRITICAL',
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents((prev) => [newEvent, ...prev]);

    if (socketService.socket && socketService.socket.connected) {
      socketService.emitEmergencyCrisis(newEvent);
    }

    return { success: true, message: `Emergency Crisis '${config.title}' triggered nationwide!` };
  };

  const publishNewsArticle = (articleData) => {
    const newArt = {
      ...articleData,
      id: `news-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setArticles((prev) => [newArt, ...prev]);

    if (articleData.impactOnPartyId && articleData.approvalChange) {
      const pId = articleData.impactOnPartyId;
      const change = articleData.approvalChange;
      setParties((prev) =>
        prev.map((p) => (p.id === pId ? { ...p, approvalRating: Math.min(100, Math.max(0, p.approvalRating + change)) } : p))
      );
    }
  };

  const runOpinionPoll = () => {
    const seatProjections = {};
    parties.forEach((p) => (seatProjections[p.id] = 0));

    seats.forEach((seat) => {
      let topPartyId = seat.leadingPartyId;
      let topScore = -1;

      parties.forEach((party) => {
        const isGovt = party.id === governingPartyId;
        const stPop = statePopularity[seat.state]?.[party.id] || party.approvalRating;
        const isSeatIncumbent = seat.leadingPartyId === party.id;

        const score =
          (isSeatIncumbent ? seat.mpWorkScore : 40) * 0.25 +
          (isSeatIncumbent ? seat.voterSatisfaction : 50) * 0.25 +
          stPop * 0.20 +
          party.approvalRating * 0.15 +
          (isGovt ? governmentApproval : 45) * 0.10 +
          (isSeatIncumbent ? seat.campaignHeat : 30) * 0.05;

        if (score > topScore) {
          topScore = score;
          topPartyId = party.id;
        }
      });

      if (seatProjections[topPartyId] !== undefined) {
        seatProjections[topPartyId]++;
      }
    });

    const voteShareProjections = {};
    const totalPartiesRating = parties.reduce((acc, p) => acc + p.approvalRating, 0);
    parties.forEach((p) => {
      voteShareProjections[p.id] = Number(((p.approvalRating / (totalPartiesRating || 1)) * 100).toFixed(1));
    });

    const newPoll = {
      id: `poll-${Date.now()}`,
      agencyName: 'CVoter & India Today Multi-Factor Lok Sabha Poll',
      sampleSize: 150000,
      projectedSeats: seatProjections,
      projectedVoteShare: voteShareProjections,
      confidenceLevel: 95,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPolls((prev) => [newPoll, ...prev]);
  };

  const respondToCrisis = (eventId, choiceId) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt || !evt.choices) return;

    const choice = evt.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    if (choice.costCrores > 0) {
      setParties((prev) =>
        prev.map((p) => (p.id === governingPartyId ? { ...p, fundsInCrores: Math.max(0, p.fundsInCrores - choice.costCrores) } : p))
      );
    }

    setGovernmentApproval((prev) => Math.min(100, Math.max(0, prev + choice.approvalDelta)));

    setParties((prev) =>
      prev.map((p) => {
        let delta = 0;
        if (p.id === governingPartyId) {
          delta = choice.approvalDelta;
        } else if (choice.approvalDelta < 0) {
          delta = Math.abs(choice.approvalDelta) * 0.4;
        }
        return {
          ...p,
          approvalRating: Math.min(100, Math.max(0, p.approvalRating + Math.round(delta))),
        };
      })
    );

    if (evt.affectedStates && evt.affectedStates.length > 0) {
      setStatePopularity((prev) => {
        const next = { ...prev };
        evt.affectedStates.forEach((st) => {
          if (!next[st]) next[st] = {};
          next[st][governingPartyId] = Math.min(100, Math.max(0, (next[st][governingPartyId] || 45) + choice.statePopularityDelta));
        });
        return next;
      });

      setSeats((prev) =>
        prev.map((seat) => {
          if (evt.affectedStates?.includes(seat.state)) {
            const satChange = choice.approvalDelta >= 0 ? 8 : -12;
            return {
              ...seat,
              voterSatisfaction: Math.min(100, Math.max(0, seat.voterSatisfaction + satChange)),
            };
          }
          return seat;
        })
      );
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: choice.id === 'delay-ignore' ? 'IGNORED' : 'RESOLVED', chosenChoiceId: choiceId } : e))
    );

    publishNewsArticle({
      headline: `🏛️ GOVT CRISIS DIRECTIVE: Executive Policy Issued for '${evt.title}'`,
      content: `Directive: "${choice.title}". ${choice.publicReactionNote} Budget Outlay: ₹${choice.costCrores} Cr.`,
      author: 'Cabinet Secretariat Desk',
      bias: choice.approvalDelta >= 0 ? 'PRO_GOVT' : 'CRITICAL',
    });
  };

  const triggerEvent = () => {
    const randIndex = Math.floor(Math.random() * CRISIS_EVENT_TEMPLATES.length);
    const selectedTmpl = CRISIS_EVENT_TEMPLATES[randIndex];

    const newEvt = {
      ...selectedTmpl,
      id: `evt-${Date.now()}`,
      status: 'PENDING_RESPONSE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setEvents((prev) => [newEvt, ...prev]);

    publishNewsArticle({
      headline: `🚨 EMERGENCY ALERT: ${selectedTmpl.title}`,
      content: `${selectedTmpl.description} Union Cabinet convened for emergency response choices.`,
      author: 'National Press Bureau',
      bias: 'NEUTRAL',
    });
  };

  const announceGeneralElection = ({ phases = 7, notes } = {}) => {
    setElectionPhase('MODEL_CODE_IN_FORCE');
    setCurrentPhaseNumber(1);

    const announcementTitle = '🗳️ ECI PRESS CONFERENCE: 543 Lok Sabha General Election Officially Announced!';
    const announcementContent =
      notes ||
      `Chief Election Commissioner has declared the 7-Phase Lok Sabha General Election poll schedule across all 543 constituencies. Model Code of Conduct (MCC) is enforced with immediate effect.`;

    publishNewsArticle({
      headline: announcementTitle,
      content: announcementContent,
      author: 'ELECTION COMMISSION OF INDIA (NIRVACHAN SADAN)',
      bias: 'NEUTRAL',
    });

    const eciNotice = {
      id: `eci-announce-${Date.now()}`,
      title: announcementTitle,
      content: announcementContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: 'HIGH',
    };

    if (socketService.socket && socketService.socket.connected) {
      socketService.emitECINotice(eciNotice);
    }

    return { success: true, message: `🎉 General Election Officially Announced by ECI! MCC enforced nationwide across 543 seats.` };
  };

  const advanceElectionPhase = () => {
    if (electionPhase === 'PRE_ELECTION') {
      setElectionPhase('MODEL_CODE_IN_FORCE');
      publishNewsArticle({
        headline: '📋 Model Code of Conduct (MCC) Comes Into Direct Effect Across India',
        content: 'ECI places strict restrictions on government announcements and election expenditures.',
        author: 'ECI Official Desk',
        bias: 'NEUTRAL',
      });
    } else if (electionPhase === 'MODEL_CODE_IN_FORCE') {
      setElectionPhase('VOTING_PHASE');
      setCurrentPhaseNumber(1);
    } else if (electionPhase === 'VOTING_PHASE') {
      if (currentPhaseNumber < 7) {
        setCurrentPhaseNumber((prev) => prev + 1);
      } else {
        setElectionPhase('COUNTING_DAY');
      }
    } else if (electionPhase === 'COUNTING_DAY') {
      setElectionPhase('RESULTS_DECLARED');
      const wins = {};
      seats.forEach((seat) => {
        wins[seat.leadingPartyId] = (wins[seat.leadingPartyId] || 0) + 1;
      });
      setParties((prev) =>
        prev.map((p) => ({
          ...p,
          seatsWon: wins[p.id] || 0,
        }))
      );
    }
  };

  useEffect(() => {
    if (!isSimulationRunning) return;

    const intervalTime = 10000 / simulationSpeed;
    const timer = setInterval(() => {
      const aiParties = parties.filter((p) => p.isAIControlled);
      if (aiParties.length > 0) {
        const randomSeatId = Math.floor(Math.random() * 543) + 1;

        setSeats((prev) =>
          prev.map((seat) => {
            if (seat.id === randomSeatId) {
              const heatInc = Math.floor(Math.random() * 5) + 1;
              return { ...seat, campaignHeat: Math.min(100, seat.campaignHeat + heatInc) };
            }

            let newWorkScore = Math.max(0, seat.mpWorkScore - 1);
            let newSatisfaction = seat.voterSatisfaction;
            let newMargin = seat.marginPercent;

            if (seat.mpWorkScore < 35) {
              newSatisfaction = Math.max(0, seat.voterSatisfaction - 1.5);
              newMargin = Math.max(0.5, seat.marginPercent - 0.4);
            } else if (seat.mpWorkScore >= 60) {
              newSatisfaction = Math.min(100, seat.voterSatisfaction + 0.5);
            }

            return {
              ...seat,
              mpWorkScore: newWorkScore,
              voterSatisfaction: Number(newSatisfaction.toFixed(1)),
              marginPercent: Number(newMargin.toFixed(1)),
            };
          })
        );
      }

      setEvents((prevEvents) =>
        prevEvents.map((evt) => {
          if ((evt.status === 'PENDING_RESPONSE' || evt.status === 'IGNORED') && evt.affectedStates && evt.affectedStates.length > 0) {
            const decay = evt.status === 'IGNORED' ? 1.0 : 0.4;
            setGovernmentApproval((g) => Math.max(15, Number((g - decay * 0.2).toFixed(1))));

            setStatePopularity((sPrev) => {
              const next = { ...sPrev };
              evt.affectedStates.forEach((st) => {
                if (!next[st]) next[st] = {};
                next[st][governingPartyId] = Math.max(15, Number(((next[st][governingPartyId] || 45) - decay).toFixed(1)));
              });
              return next;
            });
          }
          return evt;
        })
      );

      // Increment hourly revenue accumulation during simulation tick
      setAccumulatedHourlyRevenue((prev) => prev + Math.floor(hourlyRate / 360));

      // Dispatch Daily Salary based on active post/role
      const salaryInfo = PoliticalMechanicsEngine.getDailySalary(role);
      if (salaryInfo && salaryInfo.dailyFundsCrores) {
        setPlayerSalaryBalance((prev) => Number((prev + salaryInfo.dailyFundsCrores).toFixed(2)));
      }

      // Execute AI Agents & Server engine simulation tick
      const tickState = ServerGameEngine.processSimulationTick({
        governmentApproval,
        statePopularity,
        bills,
        parties,
        events,
        articles,
        seats,
        petitions,
        customApplications,
        governingPartyId,
        aiECIEnabled,
        aiChiefJusticeEnabled,
      });

      if (tickState) {
        setGovernmentApproval(tickState.governmentApproval);
        setStatePopularity(tickState.statePopularity);
        setBills(tickState.bills);
        setParties(tickState.parties);
        setEvents(tickState.events);
        setArticles(tickState.articles);
        if (tickState.petitions) setPetitions(tickState.petitions);
        if (tickState.customApplications) setCustomApplications(tickState.customApplications);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulationRunning, simulationSpeed, parties, aiECIEnabled, aiChiefJusticeEnabled, hourlyRate]);

  // 1-Minute Live Media Publishing Auto-Timer
  useEffect(() => {
    if (!autoMediaPublishing || !isSimulationRunning) return;

    const mediaTimer = setInterval(() => {
      if (parties.length === 0 || seats.length === 0) return;
      const randomParty = parties[Math.floor(Math.random() * parties.length)];
      const randomSeat = seats[Math.floor(Math.random() * seats.length)];

      const sampleHeadlines = [
        {
          headline: `📢 LIVE MEDIA (1m Update): ${randomParty.shortName} President Holds Rally in ${randomSeat.constituencyName}`,
          content: `${randomParty.name} leader addressed a major crowd in ${randomSeat.state}. Local poll swing recorded at +2.8%!`,
          author: 'NDTV Live Broadcast',
          bias: 'PRO_GOVT',
          impactOnPartyId: randomParty.id,
          approvalChange: 2,
        },
        {
          headline: `⚖️ COURT NOTICE: Supreme Court Bench Reviews MCC Complaint in ${randomSeat.state}`,
          content: `Chief Justice Bench issues notice on petition regarding campaign rules compliance in ${randomSeat.constituencyName}.`,
          author: 'Legal Press Desk',
          bias: 'NEUTRAL',
        },
        {
          headline: `📊 OPINION POLL TICKER: ${randomParty.shortName} Popularity Surges in ${randomSeat.state} Belt`,
          content: `Voter survey shows independent swing voters favoring infrastructure manifesto pledges.`,
          author: 'Times Poll Bureau',
          bias: 'NEUTRAL',
        },
        {
          headline: `💼 LOCAL DEVELOPMENT: MP Launches ₹85 Cr Healthcare Project in ${randomSeat.constituencyName}`,
          content: `Constituency MP work score boosted to ${Math.min(100, (randomSeat.mpWorkScore || 40) + 15)}%. Voter satisfaction rising.`,
          author: 'Press Trust of India (PTI)',
          bias: 'PRO_GOVT',
        },
        {
          headline: `🚨 ECI WARNING: Model Code of Conduct Enforced for Phase ${currentPhaseNumber} Campaigning`,
          content: `Election Commission warns candidates against unapproved expenditures exceeding statutory limits.`,
          author: 'ECI News Bureau',
          bias: 'NEUTRAL',
        },
      ];

      const chosen = sampleHeadlines[Math.floor(Math.random() * sampleHeadlines.length)];
      publishNewsArticle(chosen);
    }, 60000); // Auto publish every 60 seconds (1 minute)

    return () => clearInterval(mediaTimer);
  }, [autoMediaPublishing, isSimulationRunning, parties, seats, currentPhaseNumber]);

  // Socket.io Real-Time Multiplayer Sync Effect
  useEffect(() => {
    try {
      socketService.connect({
        handle: userHandle,
        role: role,
        partyId: selectedPartyId,
        constituency: userState?.constituency || 'Coimbatore',
        state: userState?.state || 'Tamil Nadu',
      });

      socketService.on('INITIAL_NATIONAL_STATE', (nationalState) => {
        if (nationalState && nationalState.hansardMessages && nationalState.hansardMessages.length > 0) {
          setHansardFloorMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newItems = nationalState.hansardMessages.filter((m) => !existingIds.has(m.id));
            return [...newItems, ...prev];
          });
        }
        if (nationalState && nationalState.parliamentBills && nationalState.parliamentBills.length > 0) {
          setBills((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const newItems = nationalState.parliamentBills.filter((b) => !existingIds.has(b.id));
            return [...prev, ...newItems];
          });
        }
      });

      socketService.on('HANSARD_MESSAGE_ADDED', (newMsg) => {
        setHansardFloorMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [newMsg, ...prev];
        });
      });

      socketService.on('BILL_PROPOSED_NATIONAL', (newBill) => {
        setBills((prev) => {
          if (prev.some((b) => b.id === newBill.id)) return prev;
          return [newBill, ...prev];
        });
      });

      socketService.on('BILL_VOTE_UPDATED', ({ billId, votes, votedPlayerHandles }) => {
        setBills((prev) =>
          prev.map((b) => (b.id === billId ? { ...b, votes, votedPlayerHandles } : b))
        );
      });

      socketService.on('CONSTITUENCY_VOTE_CAST_SIMULTANEOUS', (voteData) => {
        if (voteData && voteData.seatId) {
          setSeats((prevSeats) =>
            prevSeats.map((seat) => {
              if (seat.id === voteData.seatId) {
                const currentMap = seat.votesMap || {};
                const newMap = {
                  ...currentMap,
                  [voteData.partyId]: (currentMap[voteData.partyId] || 0) + Number(voteData.voteCount || 0),
                };
                let winParty = voteData.partyId;
                let maxV = -1;
                Object.entries(newMap).forEach(([pId, cnt]) => {
                  if (cnt > maxV) {
                    maxV = cnt;
                    winParty = pId;
                  }
                });
                return {
                  ...seat,
                  votesMap: newMap,
                  leadingPartyId: winParty,
                  winnerPartyId: winParty,
                  totalVotesCast: Object.values(newMap).reduce((a, b) => a + b, 0),
                };
              }
              return seat;
            })
          );
        }
      });

      socketService.on('NATIONAL_PM_TRANSITION_EVENT', (pmData) => {
        if (pmData && pmData.governingPartyId) {
          setGoverningPartyId(pmData.governingPartyId);
          if (pmData.primeMinisterDetails) {
            setPrimeMinisterDetails(pmData.primeMinisterDetails);
          }
        }
      });
    } catch (err) {
      console.warn('Socket connection error fallback:', err);
    }
  }, [userHandle, role, selectedPartyId, userState]);

  // Transfer Personal Money -> Party Fund Treasury
  const transferPersonalFundsToParty = (amountInRupees) => {
    if (!amountInRupees || amountInRupees <= 0 || playerSalaryBalance < amountInRupees) {
      return { success: false, message: 'Insufficient personal funds for transfer.' };
    }

    const amountInCrores = Number((amountInRupees / 10000000).toFixed(2));

    setPlayerSalaryBalance((prev) => Math.max(0, prev - amountInRupees));

    setParties((prev) =>
      prev.map((p) => {
        if (p.id === selectedPartyId) {
          return {
            ...p,
            fundsInCrores: Number(((p.fundsInCrores || 500) + (amountInCrores || 0.01)).toFixed(2)),
            approvalRating: Math.min(100, (p.approvalRating || 50) + (amountInCrores >= 1 ? 3 : 1)),
          };
        }
        return p;
      })
    );

    setPlayerPopularity((prev) => Math.min(100, prev + 3));

    publishNewsArticle({
      headline: `💰 VOLUNTARY PARTY FUND TRANSFER: Leader Arjun Singh Donates ₹${(amountInRupees / 100000).toLocaleString()} Lakhs to Party Treasury!`,
      content: `Voluntary financial contribution registered in party treasury. Party campaign fund boosted!`,
      author: 'Electoral Finance Bureau',
      bias: 'PRO_GOVT',
      impactOnPartyId: selectedPartyId,
      approvalChange: 3,
    });

    const partyObj = parties.find((p) => p.id === selectedPartyId);
    return {
      success: true,
      message: `Successfully transferred ₹${amountInRupees.toLocaleString()} into ${partyObj?.shortName || 'Party'} Treasury Fund!`,
    };
  };

  // Claim Hourly Revenue
  const claimHourlyRevenue = () => {
    if (accumulatedHourlyRevenue <= 0) {
      return { success: false, message: 'No accumulated hourly revenue to collect yet.' };
    }
    const claimedAmt = accumulatedHourlyRevenue;
    setPlayerSalaryBalance((prev) => prev + claimedAmt);
    setAccumulatedHourlyRevenue(0);
    setLastHourlyClaimTime(Date.now());

    return {
      success: true,
      amount: claimedAmt,
      message: `Successfully collected ₹${claimedAmt.toLocaleString()} hourly revenue yield!`,
    };
  };

  const castVoteInConstituency = (seatId, partyId, voteCount) => {
    const currentState = {
      seats,
      parties,
      articles,
      governingPartyId,
      primeMinisterDetails,
    };
    const res = ServerGameEngine.castVoteInConstituency(currentState, seatId, partyId, voteCount);
    if (res && res.success) {
      setSeats(res.state.seats);
      setParties(res.state.parties);
      setArticles(res.state.articles);
      if (res.state.governingPartyId) setGoverningPartyId(res.state.governingPartyId);
      if (res.state.primeMinisterDetails) setPrimeMinisterDetails(res.state.primeMinisterDetails);

      // Emit simultaneous WebSocket update to all connected players
      socketService.emitConstituencyVote({
        seatId,
        partyId,
        voteCount,
        postedBy: userHandle,
      });

      if (res.state.governingPartyId && res.state.governingPartyId !== governingPartyId) {
        socketService.emitPMTransition({
          governingPartyId: res.state.governingPartyId,
          primeMinisterDetails: res.state.primeMinisterDetails,
        });
      }
    }
    return res;
  };

  const postEVMVotesToConstituency = (seatId, partyVotesObject) => {
    const currentState = {
      seats,
      parties,
      articles,
      governingPartyId,
      primeMinisterDetails,
    };
    const res = ServerGameEngine.postEVMVotesToConstituency(currentState, seatId, partyVotesObject);
    if (res && res.success) {
      setSeats(res.state.seats);
      setParties(res.state.parties);
      setArticles(res.state.articles);
      if (res.state.governingPartyId) setGoverningPartyId(res.state.governingPartyId);
      if (res.state.primeMinisterDetails) setPrimeMinisterDetails(res.state.primeMinisterDetails);

      Object.entries(partyVotesObject).forEach(([pId, vCount]) => {
        socketService.emitConstituencyVote({
          seatId,
          partyId: pId,
          voteCount: vCount,
          postedBy: userHandle,
        });
      });

      if (res.state.governingPartyId && res.state.governingPartyId !== governingPartyId) {
        socketService.emitPMTransition({
          governingPartyId: res.state.governingPartyId,
          primeMinisterDetails: res.state.primeMinisterDetails,
        });
      }
    }
    return res;
  };

  const tallyAllConstituenciesAndElectPM = () => {
    const currentState = {
      seats,
      parties,
      articles,
      governingPartyId,
      primeMinisterDetails,
    };
    const newState = ServerGameEngine.evaluatePMTransition(currentState);
    setParties(newState.parties);
    setGoverningPartyId(newState.governingPartyId);
    setPrimeMinisterDetails(newState.primeMinisterDetails);
    setArticles(newState.articles);

    socketService.emitPMTransition({
      governingPartyId: newState.governingPartyId,
      primeMinisterDetails: newState.primeMinisterDetails,
    });

    return {
      success: true,
      message: `🏆 Nationwide 543 Seat Tally Complete! ${newState.primeMinisterDetails.pmPartyShort} leads with ${newState.primeMinisterDetails.totalSeatsWon} seats. Prime Minister: ${newState.primeMinisterDetails.pmName}!`,
    };
  };

  const resetGame = () => {
    setParties(INITIAL_REAL_PARTIES);
    setSeats(INITIAL_543_SEATS);
    setElectionPhase('PRE_ELECTION');
    setCurrentPhaseNumber(1);
    setPetitions([]);
    setArticles([]);
  };

  return (
    <GameContext.Provider
      value={{
        theme,
        setTheme,
        role,
        setRole,
        rolePasswords,
        verifyRolePassword,
        updateRolePassword,
        selectedPartyId,
        setSelectedPartyId,
        parties,
        customApplications,
        seats,
        petitions,
        articles,
        polls,
        alliances,
        createAlliance,
        leaveAlliance,
        joinAlliance,
        isLoggedIn,
        userHandle,
        userState,
        setUserState,
        userDistrict,
        setUserDistrict,
        userConstituency,
        setUserConstituency,
        updateUserLocation,
        collectVotesThroughRally,
        collectVotesThroughPressMeet,
        collectVotesThroughDebate,
        loginUser,
        logoutUser,
        events,
        electionPhase,
        currentPhaseNumber,
        isSimulationRunning,
        simulationSpeed,
        aiECIEnabled,
        setAiECIEnabled,
        aiChiefJusticeEnabled,
        setAiChiefJusticeEnabled,
        castVoteInConstituency,
        electionScope,
        setElectionScope,
        selectedStateAssemblyId,
        setSelectedStateAssemblyId,
        unionBudgetAllocations,
        stateBudgetAllocations,
        allocateCentralAndStateBudgets,
        governmentApproval,
        governingPartyId,
        bills,
        statePopularity,
        proposeBill,
        advanceBillStage,
        issuePartyWhip,
        processPresidentialAssent,
        certifyMoneyBill,
        moveSpecialParliamentaryMotion,
        voteAndProcessBill,
        respondToCrisis,
        playerFinances,
        isCurrentPlayerLeader: playerFinances.isLeader,
        buyBusiness,
        launderBlackMoney,
        bribeCandidate,
        submitCustomPartyApplication,
        reviewCustomPartyApplication,
        holdRally,
        announceScheme,
        performMPWork,
        hostTVDebate,
        filePetition,
        deliverVerdict,
        publishNewsArticle,
        runOpinionPoll,
        triggerEvent,
        playerPopularity,
        setPlayerPopularity,
        playerSalaryBalance,
        setPlayerSalaryBalance,
        buyGameCash: (cashAmount) => {
          setPlayerSalaryBalance((bal) => bal + cashAmount);
          return { success: true, message: `Successfully added ₹${cashAmount.toLocaleString()} Game Cash to balance!` };
        },
        autoMediaPublishing,
        setAutoMediaPublishing,
        lastHourlyClaimTime,
        accumulatedHourlyRevenue,
        hourlyRate,
        claimHourlyRevenue,
        transferPersonalFundsToParty,
        energy,
        setEnergy,
        maxEnergy,
        supporters,
        diamonds,
        leaderLevel,
        levelXpPercent,
        dailyTasks,
        earningsItems,
        claimEarningItem: (id) => {
          setEarningsItems((prev) =>
            prev.map((item) => {
              if (item.id === id && !item.claimed) {
                setPlayerSalaryBalance((bal) => bal + 50000);
                return { ...item, claimed: true, btnText: 'CLAIMED' };
              }
              return item;
            })
          );
        },
        registeredAccounts,
        registerPoliticianAccount,
        verifyRolePassword,
        assignPartyPost,
        transferPartyLeadership,
        announceMLACandidate,
        announceMinistryPortfolio,
        partyNominations,
        ministryAnnouncements,
        speakerDetails,
        speakerElection,
        hansardFloorMessages,
        grantedSpeakingHandles,
        speakingRequests,
        requestFloorSpeakingPermission,
        grantFloorSpeakingPermission,
        postHansardFloorMessage,
        castVoteInSpeakerElection,
        splitParty,
        mergeParties,
        switchParty,
        disqualifyMemberForDefection,
        promulgateOrdinance,
        invokePresidentsRule,
        courtroomMessages,
        governingPartyId,
        setGoverningPartyId,
        primeMinisterDetails,
        setPrimeMinisterDetails,
        postEVMVotesToConstituency,
        tallyAllConstituenciesAndElectPM,
        triggerSuddenEmergencyCrisis,
        announceGeneralElection,
        advanceElectionPhase,
        toggleSimulation: () => setIsSimulationRunning((prev) => !prev),
        setSimulationSpeed,
        resetGame,
        p2pRoomCode,
        PERMANENT_NATIONAL_ROOM_CODE: permanentRoomCode,
        setAdminPermanentRoomCode,
        isP2PConnected,
        isP2PHost,
        connectedPeers,
        joinP2PRoom,
        leaveP2PRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
