const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['upcoming', 'conference', 'webinar'],
      default: 'upcoming'
    },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
