import React, { useState } from 'react';
import '../styles/MessageInput.css';


export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="message-input-container">
      <input
        className="message-input-field"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="message-send-button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}



