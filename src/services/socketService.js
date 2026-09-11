import { io } from 'socket.io-client';
import { p2pService } from './p2pService.js';

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
        reconnectionAttempts: 3,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('⚡ Connected to Mandate National WebSocket Server ID:', this.socket.id);
        this.registerPlayer(userProfile);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('🔌 Disconnected from Mandate National WebSocket Server - P2P Fallback Active');
      });

      // Forward registered listeners from Socket.io server
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
          this.triggerCallbacks(evt, data);
        });

        // Also forward P2P service events to the exact same callbacks
        p2pService.on(evt, (data) => {
          this.triggerCallbacks(evt, data);
        });
      });
    } catch (err) {
      console.warn('WebSocket Connection fallback to local/P2P mode:', err);
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
    // Also wire to P2P service
    p2pService.on(event, callback);
  }

  off(event, callback) {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback);
    p2pService.off(event, callback);
  }

  triggerCallbacks(evt, data) {
    if (this.callbacks[evt]) {
      this.callbacks[evt].forEach((cb) => cb(data));
    }
  }

  emitHansardSpeech(msg) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_HANSARD_MESSAGE', msg);
    }
    p2pService.emitHansardSpeech(msg);
  }

  emitProposeBill(bill) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('PROPOSE_PARLIAMENT_BILL', bill);
    }
    p2pService.emitProposeBill(bill);
  }

  emitCastVote(billId, voteType, userHandle) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('CAST_BILL_VOTE', { billId, voteType, userHandle });
    }
    p2pService.emitCastVote(billId, voteType, userHandle);
  }

  emitTweet(tweet) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_NATIONAL_TWEET', tweet);
    }
    p2pService.emitTweet(tweet);
  }

  emitECINotice(notice) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_ECI_NOTICE', notice);
    }
    p2pService.emitECINotice(notice);
  }

  emitCourtroomMessage(msg) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_COURTROOM_MESSAGE', msg);
    }
    p2pService.emitCourtroomMessage(msg);
  }

  emitEmergencyCrisis(crisis) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('EMERGENCY_CRISIS_BROADCAST', crisis);
    }
    p2pService.emitEmergencyCrisis(crisis);
  }

  emitConstituencyVote(voteData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_CONSTITUENCY_VOTE', voteData);
    }
    p2pService.emitConstituencyVote(voteData);
  }

  emitPMTransition(pmData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('POST_PM_TRANSITION', pmData);
    }
    p2pService.emitPMTransition(pmData);
  }
}

export const socketService = new SocketService();

