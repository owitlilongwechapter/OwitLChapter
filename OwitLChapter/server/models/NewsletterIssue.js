const mongoose = require('mongoose');

const NewsletterIssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    publishedAt: { type: Date, required: true },
    summary: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NewsletterIssue', NewsletterIssueSchema);
