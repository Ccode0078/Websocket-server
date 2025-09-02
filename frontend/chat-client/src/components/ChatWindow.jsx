// src/components/ChatWindow.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/ChatWindow.css';

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
       <rect width="100%" height="100%" rx="14" fill="#444"/>
       <circle cx="14" cy="11" r="5" fill="#888"/>
       <rect x="6" y="17" width="16" height="7" rx="3.5" fill="#acb5a4"/>
     </svg>`
  );

const normalize = (s) => (s || '').trim();
const keyOf = (s) => normalize(s).toLowerCase(); // must match App.js & UserList.jsx

export default function ChatWindow({ messages, username, avatars = {} }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const myKey = keyOf(username);

  return (
    <div style={{ border: '1px solid #918989', padding: 12, height: 360, overflowY: 'auto' }}>
      {messages.map((m, idx) => {
        const displayName =
          typeof m.user === 'string' ? m.user : (m.user?.name ?? m.user) || 'Unknown';
        const key = keyOf(displayName);
        const mine = key === myKey;

        // Prefer normalized key from avatars map; fall back to any avatar_url on the message; then default
        const src =
          avatars?.[key] ||
          avatars?.[normalize(displayName)] || // belt & suspenders
          m?.user?.avatar_url ||
          DEFAULT_AVATAR;

        const ts = m.ts ? new Date(m.ts) : null;

        return (
          <div
            key={m.id ?? idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: 10,
              flexDirection: mine ? 'row-reverse' : 'row',
              gap: 8
            }}
          >
            <img src={src} alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
            <div
              style={{
                maxWidth: '70%',
                background: mine ? '#84ba2dff' : '#393b3fff',
                padding: '8px 10px',
                borderRadius: 8
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>
                {displayName} {ts && <span style={{ marginLeft: 6 }}>{ts.toLocaleTimeString()}</span>}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {String(m.message ?? '')}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

