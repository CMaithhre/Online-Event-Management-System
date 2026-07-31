import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '15px',
      backgroundColor: '#1e1e2f',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h2 style={{ margin: 0, color: '#4fc3f7', fontSize: '1.2rem' }}>EventlyZone</h2>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '15px',
        margin: '10px 0 0 0',
        padding: 0,
        alignItems: 'center'
      }}>
        <li style={{ cursor: 'pointer' }}><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
        <li style={{ cursor: 'pointer' }}><Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link></li>
        
        {/* Show Create Event only for Admins or hide if not logged in */}
        {userRole === 'admin' && (
          <li style={{ cursor: 'pointer' }}><Link to="/create-event" style={{ color: '#fff', textDecoration: 'none' }}>Create Event</Link></li>
        )}

        {/* Toggle between Login and Logout based on whether userRole exists */}
        {userRole ? (
          <li>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#ff5252',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </li>
        ) : (
          <li style={{ cursor: 'pointer' }}><Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;