import React from 'react';

function nameOf(u) {
  if (!u) return '';
  if (typeof u === 'string') return u;
  if (u.name) return String(u.name);
  if (u.user) {
    if (typeof u.user === 'string') return u.user;
    if (u.user?.name) return String(u.user.name);
  }
  return String(u);
}

const normalize = (s) => (s || "").trim();

export default function UserList({ users = [], avatars = {} }) {
  // De-dupe by name (keep first occurrence)
  const uniqueUsers = Array.from(
    (users || []).reduce((map, u) => {
      const n = nameOf(u).trim();
      if (n && !map.has(n)) map.set(n, u);
      return map;
    }, new Map()).values()
  );

  return (
    <div>
      <h3>Online</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {uniqueUsers.map((u, i) => {
          const name = nameOf(u) || 'Unknown';
          const key = normalize(name);
          const src =
            avatars?.[key] ||
            u?.avatar_url ||
            u?.user?.avatar_url ||
            // inline fallback avatar – never shows "avatar" text
            'data:image/svg+xml;utf8,' + encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                 <rect width="100%" height="100%" rx="14" fill="#444"/>
                 <circle cx="14" cy="11" r="5" fill="#888"/>
                 <rect x="6" y="17" width="16" height="7" rx="3.5" fill="#888"/>
               </svg>`
            );

          return (
            <li
              key={`${name}:${i}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
            >
              <img src={src} alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}



