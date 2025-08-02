// src/WebSocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connect(username, onMessageReceived, onUserListUpdate) {
  const socket = new SockJS('http://localhost:8082/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: str => console.log(str),
    onConnect: () => {
      console.log('Connected');

      // Notify server user connected
      stompClient.publish({
        destination: "/app/connect",
        body: username
      });

      // Handle chat messages
      stompClient.subscribe('/topic/messages', message => {
        const payload = JSON.parse(message.body);
        onMessageReceived(payload);
      });

      // Handle connected users list
      stompClient.subscribe('/topic/users', message => {
        const userList = JSON.parse(message.body);
        console.log('Connected users:', userList);
        onUserListUpdate(userList);
      });
    },
    onStompError: frame => {
      console.error('Broker error:', frame.headers['message']);
    }
  });

  stompClient.activate();
}

export function sendMessage(username, message) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/message",
      body: JSON.stringify({ user: username, message })
    });
  }
}

export function disconnect(username) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/disconnect",
      body: username
    });
    stompClient.deactivate();
  }
}
