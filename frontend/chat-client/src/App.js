import React, { useEffect, useState } from 'react';
import { connect, sendMessage, disconnect } from './WebSocketService';
import ChatWindow from './components/ChatWindow';
import UserList from './components/UserList';
import MessageInput from './components/MessageInput';
import './App.css';


function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const handleConnect = () => {
    connect(
      tempName,
      (msg) => {
        console.log(msg, 'msg')
        if (msg.user && msg.message) {
          setMessages(prev => [...prev, msg]);
        }
      },
      (userList) => {
        setUsers(userList);
      }
    );
    setUsername(tempName);
  };

  const handleSend = (text) => {
    sendMessage(username, text);
  };

  const handleDisconnect = () => {
    disconnect(username);
    setUsername('');
    setUsers([]);
    setMessages([]);
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
        <input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="e.g. Patrick, Corbin .."
        />
        <button onClick={handleConnect} disabled={!tempName.trim()}>Join Server</button>
      </div>
    );
  }
  

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>
        Welcome, {username}{' '}
        <button onClick={handleDisconnect} style={{ marginLeft: '1rem' }}>
          Exit
        </button>
      </h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          <ChatWindow messages={messages} username={username} />
          <MessageInput onSend={handleSend} />
        </div>
        <div style={{ flex: 1 }}>
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}

export default App;
