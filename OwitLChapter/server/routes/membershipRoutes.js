const express = require('express');
const nodemailer = require('nodemailer');
const MembershipApplication = require('../models/MembershipApplication');

const router = express.Router();
const ORG_EMAIL = 'owitlilongwechapter@gmail.com';

const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

router.post('/apply', async (req, res) => {
  try {
    const { fullName, email, phone, profession, motivation } = req.body;

    if (!fullName || !email || !phone || !motivation) {
      return res.status(400).json({ error: 'Full name, email, phone, and motivation are required.' });
    }

    const created = await MembershipApplication.create({
      fullName,
      email,
      phone,
      profession,
      motivation
    });

    if (transporter) {
      const mailBody = `New OWITL membership application received:\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nProfession or Business: ${profession || 'N/A'}\n\nMotivation:\n${motivation}`;

      await transporter.sendMail({
        from: `OWITL Membership <${process.env.EMAIL_USER}>`,
        to: ORG_EMAIL,
        subject: `New membership application from ${fullName}`,
        text: mailBody
      });
    }

    return res.status(201).json({
      message: 'Membership application submitted.',
      data: created,
      emailSent: Boolean(transporter)
    });
  } catch (error) {
    console.error('Membership application error:', error.message);
    return res.status(500).json({ error: 'Failed to submit membership application.' });
  }
});

module.exports = router;
