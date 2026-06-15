const mongoose = require('mongoose');

const WomanOfTheYearSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    profile: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WomanOfTheYear', WomanOfTheYearSchema);
