// src/WebSocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let client = null;


const SAME_ORIGIN_WS = new URL('/ws', window.location.origin).toString();
const WS_HTTP_BASE =
  process.env.NODE_ENV === 'production'
    ? SAME_ORIGIN_WS
    : (process.env.REACT_APP_WS_HTTP_BASE || SAME_ORIGIN_WS);

export function connect(username, onMessageReceived, onUserListUpdate, onConnected) {
  if (!username || !String(username).trim()) {
    throw new Error('username is required');
  }

  console.log('[ws] SockJS base:', WS_HTTP_BASE);

  const socket = new SockJS(WS_HTTP_BASE);
  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 2000,
    debug: (msg) => console.log('[stomp]', msg),
  });

  client.onConnect = () => {
    console.log('[ws] connected');

    // let server know we joined
    client.publish({ destination: '/app/connect', body: String(username) });

    // all chat messages (including our __AVATAR__ control frames)
    client.subscribe('/topic/messages', (frame) => {
      try {
        const payload = JSON.parse(frame.body);
        onMessageReceived?.(payload);
      } catch (e) {
        console.error('[ws] bad /topic/messages payload', e, frame.body);
      }
    });

    // connected users list
    client.subscribe('/topic/users', (frame) => {
      try {
        const list = JSON.parse(frame.body);
        onUserListUpdate?.(list);
      } catch (e) {
        console.error('[ws] bad /topic/users payload', e, frame.body);
      }
    });

    onConnected?.();
  };

  client.onStompError = (frame) => {
    console.error('[ws] broker error:', frame.headers['message'], frame.body);
  };

  client.onWebSocketClose = (evt) => {
    console.warn('[ws] socket closed', evt?.code, evt?.reason || '');
  };

  client.activate();
}

export function sendMessage(username, message) {
  if (!client?.connected) return;
  client.publish({
    destination: '/app/message',
    body: JSON.stringify({ user: username, message }),
  });
}

export function sendAvatar(username, avatarUrl) {
  if (!client?.connected) return;
  if (!username || !avatarUrl) return;
  client.publish({
    destination: '/app/message',
    body: JSON.stringify({
      user: username,
      message: '__AVATAR__',
      avatar_url: avatarUrl,
    }),
  });
}

export function disconnect(username) {
  try {
    if (client?.connected) {
      client.publish({ destination: '/app/disconnect', body: String(username) });
    }
  } catch {}
  client?.deactivate();
  client = null;
}

export function isConnected() {
  return !!client?.connected;
}

