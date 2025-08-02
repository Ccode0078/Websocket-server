import React from 'react';

export default function UserList({ users }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h3>Users</h3>
      <ul>
        {users.map((u, i) => <li key={i}>{u}</li>)}
      </ul>
    </div>
  );
}
