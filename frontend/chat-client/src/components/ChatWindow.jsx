import React, { useEffect, useRef } from 'react';
import '../styles/ChatWindow.css';

export default function ChatWindow({ messages, username }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.user === username ? 'self' : ''}`}>
          <div className="avatar">
            {msg.user.charAt(0).toUpperCase()}
          </div>
          <div className="message-content">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        </div>
      ))}

      {/* 👇 Add this to make auto-scroll work */}
      <div ref={bottomRef} />
    </div>
  );
}

