const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['strategic', 'community', 'corporate'],
      required: true
    },
    description: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    logoUrl: { type: String, default: '', trim: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', PartnerSchema);
