const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const created = await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ message: 'Message sent successfully.', data: created });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
