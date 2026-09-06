import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Serve static frontend files if built
app.use(express.static(path.join(__dirname, '../dist')));

// Shared National State
const nationalWorldState = {
  activePlayers: {},
  hansardMessages: [
    {
      id: 'h-init-1',
      authorHandle: '@OmBirlaSpeaker',
      authorRole: 'Speaker Chair',
      authorParty: 'BJP',
      text: 'Order, Order! The House is called to order. 24-Hour Parliamentary Voting on legislative bills & custom schemes is now open.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSpeakerApproved: true,
      category: 'SPEAKER_ORDER',
    },
  ],
  parliamentBills: [],
  speakerElection: {
    candidates: [
      { id: 'ombirla', name: 'Om Birla', party: 'BJP', votes: 290 },
      { id: 'ksuresh', name: 'K. Suresh', party: 'INC', votes: 245 },
    ],
    votingExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    hasVotedUserHandles: [],
  },
  tweets: [
    {
      id: 'tweet-init-1',
      author: 'Prime Minister Office',
      handle: '@PMOIndia',
      partyId: 'bjp',
      content: 'Chaired high-level cabinet meeting today. India’s economic growth remains robust. #ViksitBharat #LokSabha2026',
      mediaUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      timestamp: '10m ago',
      likes: 1420,
      retweets: 380,
      verified: true,
    },
  ],
  eciNotices: [
    {
      id: 'eci-init-1',
      title: 'Model Code of Conduct Enforced',
      content: 'Strict compliance required across all 543 Lok Sabha constituencies. No cabinet announcements permitted during active voting phases.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: 'HIGH',
    },
  ],
  courtroomMessages: [
    {
      id: 'court-init-1',
      sender: '@ChiefJustice_Bench',
      senderRole: 'CJI Constitutional Bench',
      text: '⚖️ Open Court Proceedings Commenced: The Bench is listening to writ petitions, anti-defection challenges, and MCC violation appeals.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'CJI_QUESTION',
    },
  ],
  emergencyCrises: [],
};

io.on('connection', (socket) => {
  console.log(`[NATIONAL WORLD SERVER] Player connected: ${socket.id}`);

  // Send current national state upon connection
  socket.emit('INITIAL_NATIONAL_STATE', nationalWorldState);

  // Player Login / Register
  socket.on('REGISTER_PLAYER', (playerData) => {
    nationalWorldState.activePlayers[socket.id] = {
      id: socket.id,
      handle: playerData.handle || 'Anonymous',
      role: playerData.role || 'politician',
      partyId: playerData.partyId || 'bjp',
      constituency: playerData.constituency || 'Coimbatore',
      state: playerData.state || 'Tamil Nadu',
      connectedAt: Date.now(),
    };
    io.emit('PLAYER_LIST_UPDATED', Object.values(nationalWorldState.activePlayers));
    console.log(`[PLAYER REGISTERED] ${playerData.handle} (${playerData.constituency})`);
  });

  // Hansard Floor Speech Post
  socket.on('POST_HANSARD_MESSAGE', (msgData) => {
    const newMessage = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      authorHandle: msgData.authorHandle,
      authorRole: msgData.authorRole || 'MP',
      authorParty: msgData.authorParty || 'IND',
      text: msgData.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSpeakerApproved: msgData.isSpeakerApproved || false,
      category: msgData.category || 'DEBATE_SPEECH',
    };
    nationalWorldState.hansardMessages.unshift(newMessage);
    if (nationalWorldState.hansardMessages.length > 200) {
      nationalWorldState.hansardMessages.pop();
    }
    io.emit('HANSARD_MESSAGE_ADDED', newMessage);
  });

  // Propose Custom Scheme / Bill
  socket.on('PROPOSE_PARLIAMENT_BILL', (billData) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      title: billData.title,
      description: billData.description,
      proposedBy: billData.proposedBy || '@MP_Member',
      proposedByParty: billData.proposedByParty || 'bjp',
      type: billData.type || 'CUSTOM_SCHEME',
      budgetCrores: billData.budgetCrores || 500,
      targetState: billData.targetState || 'All India',
      votingExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      status: 'VOTING_ACTIVE',
      votes: { yes: 1, no: 0, abstain: 0 },
      votedPlayerHandles: [billData.proposedBy],
      createdAt: new Date().toLocaleDateString(),
    };
    nationalWorldState.parliamentBills.unshift(newBill);
    io.emit('BILL_PROPOSED_NATIONAL', newBill);
  });

  // Cast Vote on Bill
  socket.on('CAST_BILL_VOTE', ({ billId, voteType, userHandle }) => {
    const targetBill = nationalWorldState.parliamentBills.find((b) => b.id === billId);
    if (targetBill && targetBill.status === 'VOTING_ACTIVE') {
      if (!targetBill.votedPlayerHandles) targetBill.votedPlayerHandles = [];
      if (!targetBill.votedPlayerHandles.includes(userHandle)) {
        targetBill.votedPlayerHandles.push(userHandle);
        if (voteType === 'YES') targetBill.votes.yes += 1;
        if (voteType === 'NO') targetBill.votes.no += 1;
        if (voteType === 'ABSTAIN') targetBill.votes.abstain += 1;

        io.emit('BILL_VOTE_UPDATED', {
          billId,
          votes: targetBill.votes,
          votedPlayerHandles: targetBill.votedPlayerHandles,
        });
      }
    }
  });

  // Post Tweet to National Feed
  socket.on('POST_NATIONAL_TWEET', (tweetData) => {
    const newTweet = {
      id: `tweet-${Date.now()}`,
      author: tweetData.author || 'Hon. MP',
      handle: tweetData.handle || '@Politician',
      partyId: tweetData.partyId || 'bjp',
      content: tweetData.content,
      mediaUrl: tweetData.mediaUrl || null,
      timestamp: 'Just now',
      likes: 1,
      retweets: 0,
      verified: true,
    };
    nationalWorldState.tweets.unshift(newTweet);
    if (nationalWorldState.tweets.length > 100) {
      nationalWorldState.tweets.pop();
    }
    io.emit('TWEET_POSTED_NATIONAL', newTweet);
  });

  // ECI Gazette Notice
  socket.on('POST_ECI_NOTICE', (noticeData) => {
    const newNotice = {
      id: `eci-${Date.now()}`,
      title: noticeData.title,
      content: noticeData.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: noticeData.priority || 'HIGH',
    };
    nationalWorldState.eciNotices.unshift(newNotice);
    io.emit('ECI_NOTICE_BROADCAST', newNotice);
  });

  // Supreme Courtroom Bench Message
  socket.on('POST_COURTROOM_MESSAGE', (msgData) => {
    const newMsg = {
      id: `court-${Date.now()}`,
      sender: msgData.sender || '@ChiefJustice_Bench',
      senderRole: msgData.senderRole || 'Chief Justice Bench',
      text: msgData.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msgData.type || 'CJI_QUESTION',
    };
    nationalWorldState.courtroomMessages.unshift(newMsg);
    if (nationalWorldState.courtroomMessages.length > 150) {
      nationalWorldState.courtroomMessages.pop();
    }
    io.emit('COURTROOM_MESSAGE_BROADCAST', newMsg);
  });

  // Admin Emergency Crisis Event Broadcast
  socket.on('EMERGENCY_CRISIS_BROADCAST', (crisisData) => {
    const newCrisis = {
      id: `crisis-${Date.now()}`,
      title: crisisData.title,
      description: crisisData.description,
      severity: 'CRITICAL',
      timestamp: new Date().toLocaleTimeString(),
    };
    nationalWorldState.emergencyCrises.unshift(newCrisis);
    io.emit('NATIONAL_EMERGENCY_CRISIS_ADDED', newCrisis);
  });

  // Simultaneous Constituency Vote Broadcast across all connected players
  socket.on('POST_CONSTITUENCY_VOTE', (voteData) => {
    io.emit('CONSTITUENCY_VOTE_CAST_SIMULTANEOUS', voteData);
  });

  // Simultaneous Prime Minister (PM) Transition Broadcast across all connected players
  socket.on('POST_PM_TRANSITION', (pmData) => {
    io.emit('NATIONAL_PM_TRANSITION_EVENT', pmData);
  });

  // Disconnect
  socket.on('disconnect', () => {
    delete nationalWorldState.activePlayers[socket.id];
    io.emit('PLAYER_LIST_UPDATED', Object.values(nationalWorldState.activePlayers));
    console.log(`[PLAYER DISCONNECTED] ${socket.id}`);
  });
});

// Fallback SPA route for NGINX/Direct Express hosting
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🇮🇳 MANDATE NATIONAL WORLD WEBSOCKET SERVER ONLINE `);
  console.log(` Listening on PORT: ${PORT}`);
  console.log(`====================================================`);
});
