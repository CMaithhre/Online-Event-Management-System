require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const Event = require('./models/Event');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// --- ROOT ROUTE ---
app.get('/', (req, res) => {
  res.send('Online Event Management System API is running!');
});

// --- EVENT ROUTES ---

// GET all events (Accessible to attendees and organizers)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST a new event (Restricted workspace for event creation & scheduling with dynamic image assignment)
app.post('/api/events', async (req, res) => {
  try {
    const { title, category, image } = req.body;
    
    let assignedImage = image;
    if (!assignedImage || assignedImage.includes('via.placeholder.com')) {
      const lowerTitle = title?.toLowerCase() || '';
      if (lowerTitle.includes('independence') || lowerTitle.includes('flag') || lowerTitle.includes('patriot')) {
        assignedImage = 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80';
      } else if (lowerTitle.includes('wedding') || lowerTitle.includes('marriage')) {
        assignedImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
      } else if (lowerTitle.includes('birthday') || lowerTitle.includes('party')) {
        assignedImage = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80';
      } else if (lowerTitle.includes('tech') || lowerTitle.includes('full stack') || lowerTitle.includes('development') || lowerTitle.includes('workshop')) {
        assignedImage = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80';
      } else if (lowerTitle.includes('meetup') || lowerTitle.includes('gathering') || lowerTitle.includes('community')) {
        assignedImage = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
      } else {
        switch (category?.toLowerCase()) {
          case 'tech':
            assignedImage = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80';
            break;
          case 'social':
            assignedImage = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
            break;
          case 'corporate':
            assignedImage = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80';
            break;
          default:
            assignedImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80';
        }
      }
    }

    const newEvent = new Event({
      ...req.body,
      image: assignedImage
    });

    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// UPDATE an event by ID (Administrative management control)
app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// MOCKED CREATE Order for Ticket Booking (Bypasses Razorpay account requirement)
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    const mockOrder = {
      id: 'order_mock_' + Math.random().toString(36).substring(2, 9),
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    res.json(mockOrder);
  } catch (err) {
    console.error("Mock order error:", err);
    res.status(500).json({ error: "Internal server error during payment initialization" });
  }
});

// MOCKED VERIFY Payment & Decrement Seat
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const currentSeats = parseInt(event.seats) || 0;
    if (currentSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    event.seats = currentSeats - 1;
    const updatedEvent = await event.save();

    res.status(200).json({ 
      message: "Payment verified and seat booked successfully", 
      updatedEvent,
      paymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 9)
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Failed to verify payment and update seats" });
  }
});

// DECREMENT available seats when a ticket is booked (Fallback/Free events)
app.patch('/api/events/:id/book', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const currentSeats = parseInt(event.seats) || 0;
    if (currentSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    event.seats = currentSeats - 1;
    const updatedEvent = await event.save();

    res.status(200).json({ message: "Seat booked successfully", updatedEvent });
  } catch (err) {
    res.status(500).json({ error: "Failed to book seat" });
  }
});

// DELETE an event by ID (Administrative management control)
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// --- AUTHENTICATION ROUTES ---

// Register Route (User Authentication & Profiles module)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const newUser = new User({ email, password, role });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login Route (Secure gateway for hosts and participants)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Selected role does not match this account." });
    }

    res.status(200).json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = app;