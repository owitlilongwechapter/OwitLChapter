const mongoose = require('mongoose');

const MembershipApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    profession: { type: String, default: '', trim: true },
    motivation: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipApplication', MembershipApplicationSchema);
