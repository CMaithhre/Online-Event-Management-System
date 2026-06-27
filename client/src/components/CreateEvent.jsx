import React, { useState } from 'react';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    capacity: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Event created successfully!");
    setFormData({ title: '', date: '', location: '', capacity: '', description: '' });
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e1e2f', borderBottom: '2px solid #4fc3f7', paddingBottom: '10px' }}>
        Create Event Workspace
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Event Name:</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Brand Strategy Session" 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Date:</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Location / Venue:</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Chittoor Conference Suite" 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Ticket Capacity Limit:</label>
          <input 
            type="number" 
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g., 150" 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Event Description:</label>
          <textarea 
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the goals and schedule of this production..." 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
            required
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#1e1e2f',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Publish Production Launch
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;