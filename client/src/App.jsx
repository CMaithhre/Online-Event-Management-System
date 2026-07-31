import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';

function App() {
  const Home = () => (
    <div style={{ fontFamily: 'sans-serif', color: '#1e1e2f' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)', 
        color: '#fff', 
        padding: '80px 20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 15px 0' }}>Welcome to EventlyZone</h1>
        <p style={{ fontSize: '1.25rem', color: '#b0bec5', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          Explore upcoming brand productions, professional corporate gatherings, and secure your tickets seamlessly.
        </p>
        <Link 
          to="/dashboard" 
          style={{ 
            backgroundColor: '#4fc3f7', 
            color: '#1e1e2f', 
            padding: '12px 30px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(79, 195, 247, 0.4)',
            display: 'inline-block'
          }}
        >
          Explore Events & Book Now
        </Link>
      </div>

      {/* Features / Highlights Section */}
      <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'center' }}>
        <div style={{ padding: '25px', borderRadius: '12px', background: '#f8f9fa', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#0288d1', marginBottom: '10px' }}>🎬 Brand Productions</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Top-tier corporate events, social functions, and exclusive tech productions curated by EventlyZone.</p>
        </div>
        <div style={{ padding: '25px', borderRadius: '12px', background: '#f8f9fa', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#0288d1', marginBottom: '10px' }}>⚡ Instant Booking</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Real-time seat tracking and quick registration for both free and paid event entries.</p>
        </div>
        <div style={{ padding: '25px', borderRadius: '12px', background: '#f8f9fa', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#0288d1', marginBottom: '10px' }}>🔒 Secure Management</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Dedicated dashboards for admins to manage events and users to keep track of bookings.</p>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;