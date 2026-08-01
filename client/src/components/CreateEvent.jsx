import React, { useState } from 'react';
import axios from 'axios';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: 'Corporate',
    price: '',
    seats: '',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/events`, formData);
      alert("Event created successfully!");
      setFormData({ title: '', date: '', location: '', category: 'Corporate', price: '', seats: '', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400', description: '' });
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e1e2f', borderBottom: '2px solid #4fc3f7', paddingBottom: '10px' }}>Create Event Workspace</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <input type="text" name="title" placeholder="Event Name" value={formData.title} onChange={handleChange} style={{ padding: '10px' }} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ padding: '10px' }} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} style={{ padding: '10px' }} required />
        
        {/* Category Dropdown Selector */}
        <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px' }} required>
          <option value="Corporate">Corporate</option>
          <option value="Social">Social</option>
          <option value="Tech">Tech</option>
        </select>

        <input type="number" name="seats" placeholder="No. of Seats" value={formData.seats} onChange={handleChange} style={{ padding: '10px' }} required />
        <input type="number" name="price" placeholder="Price per Seat" value={formData.price} onChange={handleChange} style={{ padding: '10px' }} required />
        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} style={{ padding: '10px' }} required />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#1e1e2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Publish EventlyZone Launch</button>
      </form>
    </div>
  );
}

export default CreateEvent;