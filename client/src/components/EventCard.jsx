import React from 'react';

function EventCard({ event }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderLeft: '6px solid #4fc3f7',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s',
      maxWidth: '400px', // Limits width on laptops
      margin: '0',  // Centers the card
      width: '100%'      // Ensures it fits small screens
    }}>
      {/* Dynamic Banner Image Block */}
      <img 
        src={event.image} 
        alt={event.title}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
      />

      {/* Text Details Area */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1e1e2f', fontSize: '18px' }}>
          {event.title}
        </h3>
        <p style={{ margin: '6px 0', color: '#666', fontSize: '14px' }}>
          <strong>Date:</strong> {event.date}
        </p>
        <p style={{ margin: '6px 0', color: '#666', fontSize: '14px' }}>
          <strong>Location:</strong> {event.location}
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '15px' 
        }}>
          <span style={{
            padding: '4px 10px',
            backgroundColor: '#f0f1f5',
            color: '#1e1e2f',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {event.category}
          </span>
          
          {/* Dynamic Pricing Tag */}
          <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
            {event.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;