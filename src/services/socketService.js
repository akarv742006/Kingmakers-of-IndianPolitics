import { io } from 'socket.io-client';

// Automatically detect host URL or fallback to localhost:3001
const SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin);

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.callbacks = {};
  }

  connect(userProfile = {}) {
    if (this.socket) return;

    try {
      this.socket = io(SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('⚡ Connected to Mandate National WebSocket Server ID:', this.socket.id);
        this.registerPlayer(userProfile);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('🔌 Disconnected from Mandate National WebSocket Server');
      });

      // Forward registered listeners
      [
        'INITIAL_NATIONAL_STATE',
        'PLAYER_LIST_UPDATED',
        'HANSARD_MESSAGE_ADDED',
        'BILL_PROPOSED_NATIONAL',
        'BILL_VOTE_UPDATED',
        'TWEET_POSTED_NATIONAL',
        'ECI_NOTICE_BROADCAST',
        'COURTROOM_MESSAGE_BROADCAST',
        'NATIONAL_EMERGENCY_CRISIS_ADDED',
        'CONSTITUENCY_VOTE_CAST_SIMULTANEOUS',
        'NATIONAL_PM_TRANSITION_EVENT',
      ].forEach((evt) => {
        this.socket.on(evt, (data) => {
          if (this.callbacks[evt]) {
            this.callbacks[evt].forEach((cb) => cb(data));
          }
        });
      });
    } catch (err) {
      console.warn('WebSocket Connection fallback to local mode:', err);
    }
  }

  registerPlayer(playerData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('REGISTER_PLAYER', playerData);
    }
  }

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

  emitHansardSpeech(msg) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_HANSARD_MESSAGE', msg);
    }
  }

  emitProposeBill(bill) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('PROPOSE_PARLIAMENT_BILL', bill);
    }
  }

  emitCastVote(billId, voteType, userHandle) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('CAST_BILL_VOTE', { billId, voteType, userHandle });
    }
  }

  emitTweet(tweet) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_NATIONAL_TWEET', tweet);
    }
  }

  emitECINotice(notice) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_ECI_NOTICE', notice);
    }
  }

  emitCourtroomMessage(msg) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_COURTROOM_MESSAGE', msg);
    }
  }

  emitEmergencyCrisis(crisis) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('EMERGENCY_CRISIS_BROADCAST', crisis);
    }
  }

  emitConstituencyVote(voteData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_CONSTITUENCY_VOTE', voteData);
    }
  }

  emitPMTransition(pmData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_PM_TRANSITION', pmData);
    }
  }
}

export const socketService = new SocketService();
