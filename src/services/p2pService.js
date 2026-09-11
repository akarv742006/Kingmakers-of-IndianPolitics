import { joinRoom } from 'trystero';

class P2PService {
  constructor() {
    this.room = null;
    this.roomCode = null;
    this.userProfile = null;
    this.peers = {}; // peerId -> profile
    this.isHost = false;
    this.callbacks = {};
    this.actions = {};
  }

  joinRoom(roomCode, userProfile = {}, getLocalStateForHost = null) {
    if (this.room) {
      this.leaveRoom();
    }

    const cleanCode = (roomCode || 'LOK_SABHA_MAIN').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    this.roomCode = cleanCode;
    this.userProfile = userProfile;

    try {
      this.room = joinRoom({ appId: 'mandate-lok-sabha-p2p' }, cleanCode);
      console.log(`🌐 [P2P WEBRTC] Joined Room Code: ${cleanCode}`);

      // Action Handlers
      const actionNames = [
        'PLAYER_PRESENCE',
        'REQUEST_STATE',
        'SYNC_STATE',
        'POST_HANSARD_MESSAGE',
        'PROPOSE_PARLIAMENT_BILL',
        'CAST_BILL_VOTE',
        'POST_NATIONAL_TWEET',
        'POST_ECI_NOTICE',
        'POST_COURTROOM_MESSAGE',
        'EMERGENCY_CRISIS_BROADCAST',
        'POST_CONSTITUENCY_VOTE',
        'POST_PM_TRANSITION',
      ];

      actionNames.forEach((actionName) => {
        const [send, get] = this.room.makeAction(actionName);
        this.actions[actionName] = send;

        get((data, peerId) => {
          this.handleIncomingAction(actionName, data, peerId, getLocalStateForHost);
        });
      });

      // Peer Join Handler
      this.room.onPeerJoin((peerId) => {
        console.log(`🤝 [P2P PEER JOINED]: ${peerId}`);
        if (this.actions.PLAYER_PRESENCE) {
          this.actions.PLAYER_PRESENCE({
            profile: this.userProfile,
            isHost: this.isHost,
          });
        }

        if (this.actions.REQUEST_STATE) {
          this.actions.REQUEST_STATE({});
        }

        this.updateHostElection();
      });

      // Peer Leave Handler
      this.room.onPeerLeave((peerId) => {
        console.log(`👋 [P2P PEER LEFT]: ${peerId}`);
        delete this.peers[peerId];
        this.updateHostElection();
        this.emitToCallbacks('PLAYER_LIST_UPDATED', Object.values(this.peers));
      });

      // Announce initial presence
      setTimeout(() => {
        if (this.actions.PLAYER_PRESENCE) {
          this.actions.PLAYER_PRESENCE({
            profile: this.userProfile,
            isHost: this.isHost,
          });
        }
      }, 500);

      this.updateHostElection();

    } catch (err) {
      console.warn('⚠️ WebRTC P2P initialization fallback:', err);
    }
  }

  leaveRoom() {
    if (this.room) {
      try {
        this.room.leave();
      } catch (e) {
        console.warn('Error leaving P2P room:', e);
      }
      this.room = null;
      this.roomCode = null;
      this.peers = {};
      this.isHost = false;
      this.actions = {};
      this.emitToCallbacks('PLAYER_LIST_UPDATED', []);
    }
  }

  updateHostElection() {
    if (!this.room) return;
    const peerIds = Object.keys(this.peers);
    const allIds = [this.userProfile?.handle || 'self', ...peerIds].sort();
    const leadingId = allIds[0];
    const newIsHost = leadingId === (this.userProfile?.handle || 'self');

    if (newIsHost !== this.isHost) {
      this.isHost = newIsHost;
      console.log(`👑 [P2P HOST STATUS] Am I Host? ${this.isHost}`);
    }
  }

  handleIncomingAction(actionName, data, peerId, getLocalStateForHost) {
    switch (actionName) {
      case 'PLAYER_PRESENCE':
        if (data && data.profile) {
          this.peers[peerId] = {
            id: peerId,
            handle: data.profile.handle || 'MP Candidate',
            role: data.profile.role || 'politician',
            partyId: data.profile.partyId || 'bjp',
            constituency: data.profile.constituency || 'Coimbatore',
            state: data.profile.state || 'Tamil Nadu',
            connectedAt: Date.now(),
          };
          this.updateHostElection();
          this.emitToCallbacks('PLAYER_LIST_UPDATED', Object.values(this.peers));
        }
        break;

      case 'REQUEST_STATE':
        if (this.isHost && getLocalStateForHost) {
          const currentState = getLocalStateForHost();
          if (this.actions.SYNC_STATE && currentState) {
            this.actions.SYNC_STATE(currentState);
          }
        }
        break;

      case 'SYNC_STATE':
        this.emitToCallbacks('INITIAL_NATIONAL_STATE', data);
        break;

      case 'POST_HANSARD_MESSAGE':
        this.emitToCallbacks('HANSARD_MESSAGE_ADDED', data);
        break;

      case 'PROPOSE_PARLIAMENT_BILL':
        this.emitToCallbacks('BILL_PROPOSED_NATIONAL', data);
        break;

      case 'CAST_BILL_VOTE':
        this.emitToCallbacks('BILL_VOTE_UPDATED', data);
        break;

      case 'POST_NATIONAL_TWEET':
        this.emitToCallbacks('TWEET_POSTED_NATIONAL', data);
        break;

      case 'POST_ECI_NOTICE':
        this.emitToCallbacks('ECI_NOTICE_BROADCAST', data);
        break;

      case 'POST_COURTROOM_MESSAGE':
        this.emitToCallbacks('COURTROOM_MESSAGE_BROADCAST', data);
        break;

      case 'EMERGENCY_CRISIS_BROADCAST':
        this.emitToCallbacks('NATIONAL_EMERGENCY_CRISIS_ADDED', data);
        break;

      case 'POST_CONSTITUENCY_VOTE':
        this.emitToCallbacks('CONSTITUENCY_VOTE_CAST_SIMULTANEOUS', data);
        break;

      case 'POST_PM_TRANSITION':
        this.emitToCallbacks('NATIONAL_PM_TRANSITION_EVENT', data);
        break;

      default:
        break;
    }
  }

  // --- Broadcast Emitters ---
  emit(actionName, data) {
    if (this.actions[actionName]) {
      this.actions[actionName](data);
    }
  }

  emitHansardSpeech(msg) {
    this.emit('POST_HANSARD_MESSAGE', msg);
  }

  emitProposeBill(bill) {
    this.emit('PROPOSE_PARLIAMENT_BILL', bill);
  }

  emitCastVote(billId, voteType, userHandle) {
    this.emit('CAST_BILL_VOTE', { billId, voteType, userHandle });
  }

  emitTweet(tweet) {
    this.emit('POST_NATIONAL_TWEET', tweet);
  }

  emitECINotice(notice) {
    this.emit('POST_ECI_NOTICE', notice);
  }

  emitCourtroomMessage(msg) {
    this.emit('POST_COURTROOM_MESSAGE', msg);
  }

  emitEmergencyCrisis(crisis) {
    this.emit('EMERGENCY_CRISIS_BROADCAST', crisis);
  }

  emitConstituencyVote(voteData) {
    this.emit('POST_CONSTITUENCY_VOTE', voteData);
  }

  emitPMTransition(pmData) {
    this.emit('POST_PM_TRANSITION', pmData);
  }

  // --- Event Listener Registration ---
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback);
  }

  emitToCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((cb) => cb(data));
    }
  }
}

export const p2pService = new P2PService();
