const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  price: String,
  image: String,
  description: String,
  seats: String
});

module.exports = mongoose.model('Event', eventSchema);