// src/App.js
import React, { useEffect, useState } from 'react';
import { connect, sendMessage, disconnect, sendAvatar } from './WebSocketService';
import ChatWindow from './components/ChatWindow';
import UserList from './components/UserList';
import MessageInput from './components/MessageInput';
import AvatarUploaderBase64 from './components/AvatarUploaderBase64';
import './App.css';

const normalize = (s) => (s || '').trim();
const keyOf = (s) => normalize(s).toLowerCase(); // keys for avatars map

function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [avatars, setAvatars] = useState({}); // { [normalizedName]: dataURL }

  // Fired whenever a user picks (or clears) an avatar
  const handlePickedAvatar = (dataUrl) => {
    const whoDisplay = normalize(tempName || username);
    const whoKey = keyOf(whoDisplay);
    localStorage.setItem('my_avatar_dataurl', dataUrl || '');
    if (!whoKey) return;

    setAvatars((prev) => {
      const next = { ...prev };
      if (dataUrl) next[whoKey] = dataUrl;
      else delete next[whoKey];
      return next;
    });

    // Broadcast to others when we have an image
    if (dataUrl) sendAvatar(whoDisplay, dataUrl);
  };

  const handleConnect = () => {
    const name = normalize(tempName);
    if (!name) return;

    connect(
      name,
      (msg) => {
        // Intercept avatar control frames: { user, message: "__AVATAR__", avatar_url }
        if (msg?.message === '__AVATAR__' && msg?.user && msg?.avatar_url) {
          const senderDisplay =
            typeof msg.user === 'string' ? msg.user : (msg.user?.name ?? msg.user);
          const senderKey = keyOf(senderDisplay);
          if (senderKey) setAvatars((prev) => ({ ...prev, [senderKey]: msg.avatar_url }));
          return; // don't render as chat
        }
        if (msg?.user && msg?.message) setMessages((prev) => [...prev, msg]);
      },
      (userList) => setUsers(userList)
    );

    setUsername(name);

    const saved = localStorage.getItem('my_avatar_dataurl');
    if (saved) {
      const myKey = keyOf(name);
      setAvatars((prev) => ({ ...prev, [myKey]: saved })); 
      sendAvatar(name, saved);                              
    }
  };

  const handleSend = (text) => {
    if (username) sendMessage(username, text);
  };

  
  useEffect(() => {
    return () => {
      if (username) disconnect(username);
    };
  }, [username]);

  if (!username) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Enter Username</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="e.g. Corbin"
          />
          <button onClick={handleConnect} disabled={!tempName.trim()}>
            Join Server
          </button>
        </div>

        {/* Avatar picker visible on the login screen */}
        <AvatarUploaderBase64 onPicked={handlePickedAvatar} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>
        Welcome, {username}{' '}
        <button
          onClick={() => {
            disconnect(username);
            setUsername('');
            setUsers([]);
            setMessages([]);
          }}
          style={{ marginLeft: '1rem' }}
        >
          Exit
        </button>
      </h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          <ChatWindow messages={messages} username={username} avatars={avatars} />
          <MessageInput onSend={handleSend} />
        </div>

        <div style={{ flex: 1 }}>
          {/* Allow changing avatar after login */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Change your avatar</div>
            <AvatarUploaderBase64 onPicked={handlePickedAvatar} />
          </div>

          <UserList users={users} avatars={avatars} />
        </div>
      </div>
    </div>
  );
}

export default App;





