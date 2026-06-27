import React from 'react';

function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap', // This allows the items to drop to a new line on small screens
      padding: '15px',  // Reduced padding for better fit on phones
      backgroundColor: '#1e1e2f',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h2 style={{ margin: 0, color: '#4fc3f7', fontSize: '1.2rem' }}>M's Creation Events</h2>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '15px',
        margin: '10px 0 0 0', // Added a little top margin when it wraps
        padding: 0
      }}>
        <li style={{ cursor: 'pointer' }}>Home</li>
        <li style={{ cursor: 'pointer' }}>Dashboard</li>
        <li style={{ cursor: 'pointer' }}>Create Event</li>
      </ul>
    </nav>
  );
}

export default Navbar;