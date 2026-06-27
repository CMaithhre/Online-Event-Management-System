import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';

function App() {
  const [events] = useState([
    { 
      _id: 1, 
      title: "Corporate Strategy Summit", 
      date: "2026-07-15", 
      location: "Hyderabad Convention Center", 
      category: "Corporate", 
      price: "₹25,000", // Updated to Rupees
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400" 
    },
    { 
      _id: 2, 
      title: "Tech Innovation Meetup", 
      date: "2026-08-10", 
      location: "Bangalore Tech Park", 
      category: "Tech", 
      price: "₹12,500", // Updated to Rupees
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400" 
    },
    { 
      _id: 3, 
      title: "Annual Charity Gala", 
      date: "2026-09-05", 
      location: "Chittoor Heritage Hall", 
      category: "Social", 
      price: "₹18,000", // Updated to Rupees
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400" 
    }
  ]);
  
  const [activeCategory, setActiveCategory] = useState("All");

  const HomeDashboard = () => (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Event Management Dashboard</h1>
      <p>Managing {events.length} upcoming brand productions</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        {["All", "Corporate", "Social", "Tech"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeCategory === cat ? '#4fc3f7' : '#1e1e2f',
              color: activeCategory === cat ? '#1e1e2f' : '#fff',
              fontWeight: 'bold'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {events
          .filter((event) => activeCategory === "All" || event.category === activeCategory)
          .map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
      </div>
    </div>
  );

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;