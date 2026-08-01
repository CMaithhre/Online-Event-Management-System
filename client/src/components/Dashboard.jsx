import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Collections of multiple professional images for each category
const categoryImages = {
  tech: [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
  ],
  social: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
  ],
  corporate: [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=600&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
  ]
};

// Helper to pick a consistent, sticky image based on the event's unique ID so it doesn't change on refresh
const getStickyEventImage = (event) => {
  const cat = event?.category?.toLowerCase();
  const images = categoryImages[cat] || categoryImages.default;
  
  const eventId = event?._id || event?.id || 'default';
  
  // Convert the ID string into a consistent number hash
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a stable index from the array
  const index = Math.abs(hash) % images.length;
  return images[index];
};

// Individual Event Card Component
function EventCard({ event, onDelete, onUpdateClick }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const formatPrice = (price) => {
    if (!price || price === '0' || price === 0) return 'Free';
    return price.toString().includes('₹') ? price : `₹${price}`;
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const eventId = event._id || event.id;
        await axios.delete(`${API_URL}/api/events/${eventId}`);
        if (onDelete) onDelete();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handleBookTicket = async () => {
    if (!userRole) {
      alert("Please login or register first to book tickets!");
      navigate('/login');
      return;
    }

    const currentSeats = parseInt(event?.seats) || 0;
    if (currentSeats <= 0) {
      alert("Sorry, this event is fully booked (Sold Out)!");
      return;
    }

    try {
      const eventId = event._id || event.id;
      const rawPrice = event?.price ? event.price.toString().replace(/[^\d]/g, '') : '0';
      const priceAmount = parseInt(rawPrice) || 0;

      await axios.post(`${API_URL}/api/payment/create-order`, {
        amount: priceAmount
      });

      await axios.post(`${API_URL}/api/payment/verify`, {
        eventId: eventId
      });

      alert(priceAmount === 0 ? "Free ticket booked successfully!" : "Payment successful and ticket booked!");
      window.location.reload(); // Refresh to reflect decremented seat counts

    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.error || "Failed to process booking/payment");
    }
  };

  const eventImage = getStickyEventImage(event);
  const seatsLeft = parseInt(event?.seats) || 0;
  const isSoldOut = seatsLeft <= 0;

  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderLeft: '6px solid #4fc3f7',
      display: 'flex', flexDirection: 'column', width: '100%'
    }}>
      <img src={eventImage} alt={event?.title || 'Event'} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1e1e2f', fontSize: '18px' }}>{event?.title}</h3>
        <p style={{ margin: '6px 0', color: '#666', fontSize: '14px' }}><strong>Date:</strong> {event?.date}</p>
        <p style={{ margin: '6px 0', color: '#666', fontSize: '14px' }}><strong>Location:</strong> {event?.location}</p>
        <p style={{ margin: '6px 0', color: isSoldOut ? '#d32f2f' : '#666', fontSize: '14px' }}>
          <strong>Available Seats:</strong> {isSoldOut ? <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Sold Out (0 Seats)</span> : seatsLeft}
        </p>
        <p style={{ margin: '6px 0', color: '#444', fontSize: '13px' }}>{event?.description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          <span style={{ padding: '4px 10px', backgroundColor: '#f0f1f5', color: '#1e1e2f', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            {event?.category || 'General'}
          </span>
          <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
            {formatPrice(event?.price)}
          </span>
        </div>

        {userRole === 'admin' ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            <button 
              onClick={() => onUpdateClick(event)} 
              style={{ flex: 1, backgroundColor: '#ffa726', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              style={{ flex: 1, backgroundColor: '#ff5252', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Delete
            </button>
          </div>
        ) : (
          <button 
            onClick={handleBookTicket} 
            disabled={isSoldOut}
            style={{ 
              marginTop: '15px', 
              backgroundColor: isSoldOut ? '#e0e0e0' : '#4fc3f7', 
              color: isSoldOut ? '#888' : '#1e1e2f', 
              fontWeight: 'bold', border: 'none', padding: '10px 12px', borderRadius: '4px', 
              cursor: isSoldOut ? 'not-allowed' : 'pointer', width: '100%' 
            }}
          >
            {isSoldOut ? 'Sold Out' : (formatPrice(event?.price) === 'Free' ? 'Register / Book Ticket' : `Pay & Book (${formatPrice(event?.price)})`)}
          </button>
        )}
      </div>
    </div>
  );
}

// Main Dashboard Page Container Component
function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', seats: '', price: '', category: '', description: '' });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventDeleted = (deletedId) => {
    setEvents(prevEvents => prevEvents.filter(ev => (ev._id || ev.id) !== deletedId));
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: event.date || '',
      location: event.location || '',
      seats: event.seats || '',
      price: event.price || '',
      category: event.category || 'Tech',
      description: event.description || ''
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventId = editingEvent._id || editingEvent.id;
      const res = await axios.put(`${API_URL}/api/events/${eventId}`, formData);
      
      setEvents(prevEvents => prevEvents.map(ev => ((ev._id || ev.id) === eventId ? res.data.updatedEvent : ev)));
      setEditingEvent(null);
      alert("Event updated successfully!");
      fetchEvents();
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to update event.");
    }
  };

  // Filter events based on both Category and Search Query
  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>Loading events...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', position: 'relative' }}>
      <h2 style={{ color: '#1e1e2f', marginBottom: '5px' }}>Event Management Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Managing {events.length} upcoming EventlyZone productions</p>

      {/* Search Bar & Filters Layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        {/* Category Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {["All", "Corporate", "Social", "Tech"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
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

        {/* Search Bar Input */}
        <input 
          type="text"
          placeholder="Search events by title or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            width: '280px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p style={{ color: '#666' }}>No matching events found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredEvents.map((event) => (
            <EventCard 
              key={event._id || event.id} 
              event={event} 
              onDelete={() => handleEventDeleted(event._id || event.id)}
              onUpdateClick={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Edit Event Modal Popup */}
      {editingEvent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e1e2f' }}>Edit Event Details</h3>
            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" placeholder="Title" value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required 
              />
              <input 
                type="text" placeholder="Date (e.g. 2026-08-15)" value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required 
              />
              <input 
                type="text" placeholder="Location" value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required 
              />
              <input 
                type="number" placeholder="Seats" value={formData.seats} 
                onChange={(e) => setFormData({...formData, seats: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required 
              />
              <input 
                type="text" placeholder="Price (e.g. 250 or Free)" value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required 
              />
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Tech">Tech</option>
                <option value="Corporate">Corporate</option>
                <option value="Social">Social</option>
              </select>
              <textarea 
                placeholder="Description" value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', height: '80px' }} required 
              />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#4fc3f7', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingEvent(null)} style={{ flex: 1, backgroundColor: '#ccc', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;