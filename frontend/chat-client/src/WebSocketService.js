
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let client = null;

export function connect(username, onMessageReceived, onUserListUpdate) {
  const socket = new SockJS('http://localhost:8082/ws'); 
  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 2000,
    debug: (msg) => console.log(msg),
    onConnect: () => {
      console.log('[ws] connected');

      // tell server we connected (your backend expects a plain string)
      client.publish({ destination: '/app/connect', body: username });

      // chat messages (includes our avatar control frames)
      client.subscribe('/topic/messages', (frame) => {
        const payload = JSON.parse(frame.body); // { user, message, ... }
        onMessageReceived?.(payload);
      });

      // connected users list
      client.subscribe('/topic/users', (frame) => {
        const list = JSON.parse(frame.body);
        onUserListUpdate?.(list);
      });
    },
    onStompError: (frame) => {
      console.error('[ws] broker error:', frame.headers['message'], frame.body);
    },
  });

  client.activate();
}

export function sendMessage(username, message) {
  if (!client || !client.connected) return;
  client.publish({
    destination: '/app/message',
    body: JSON.stringify({ user: username, message }),
  });
}


export function sendAvatar(username, avatarUrl) {
  if (!client || !client.connected) return;
  if (!username || !avatarUrl) return;
  client.publish({
    destination: '/app/message',
    body: JSON.stringify({
      user: username,
      message: '__AVATAR__',   // control frame the clients intercept
      avatar_url: avatarUrl,   // base64 data URL from FilePond
    }),
  });
}

export function disconnect(username) {
  try {
    if (client?.connected) {
      client.publish({ destination: '/app/disconnect', body: username });
    }
  } catch {}
  client?.deactivate();
  client = null;
}

export function isConnected() {
  return !!(client && client.connected);
}


