const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const Event = require('../models/Event');
const TeamMember = require('../models/TeamMember');
const Partner = require('../models/Partner');
const NewsletterIssue = require('../models/NewsletterIssue');
const WomanOfTheYear = require('../models/WomanOfTheYear');
const {
  featuredSuccessStories,
  getPublicTestimonials
} = require('../services/testimonialService');

const router = express.Router();
const imagesDirectory = path.join(__dirname, '..', '..', 'public', 'images');
const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const excludedImageNames = new Set(['owit logo.jpg']);
const excludedSlideshowImageNames = new Set([
  'photo 2.jpg',
  'seed award.jpeg',
  'susan mkangama.jpeg'
]);
router.get('/events/upcoming', async (_req, res) => {
  try {
    const events = await Event.find({ category: 'upcoming' }).sort({ eventDate: 1 }).limit(10);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load upcoming events.' });
  }
});

router.get('/events/conferences', async (_req, res) => {
  try {
    const events = await Event.find({ category: 'conference' }).sort({ eventDate: 1 }).limit(10);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load conference events.' });
  }
});

router.get('/events/webinars', async (_req, res) => {
  try {
    const events = await Event.find({ category: 'webinar' }).sort({ eventDate: 1 }).limit(10);
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load webinar events.' });
  }
});

router.get('/gallery', async (_req, res) => {
  try {
    const entries = await fs.readdir(imagesDirectory, { withFileTypes: true });
    const images = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => {
        const extension = path.extname(fileName).toLowerCase();
        const normalizedFileName = fileName.toLowerCase();
        return (
          allowedImageExtensions.has(extension) &&
          !excludedImageNames.has(normalizedFileName) &&
          !excludedSlideshowImageNames.has(normalizedFileName)
        );
      })
      .sort((first, second) => first.localeCompare(second))
      .map((fileName) => ({
        src: `/images/${encodeURIComponent(fileName)}`,
        alt: path.parse(fileName).name.replace(/[-_]+/g, ' ')
      }));

    return res.json(images);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load gallery images.' });
  }
});

router.get('/testimonials', async (_req, res) => {
  try {
    const testimonials = await getPublicTestimonials(12);
    return res.json(testimonials);
  } catch (error) {
    return res.json(featuredSuccessStories);
  }
});

router.get('/team', async (_req, res) => {
  try {
    const teamMembers = await TeamMember.find({ active: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(20);
    return res.json(teamMembers);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load team members.' });
  }
});

router.get('/partners/:category', async (req, res) => {
  try {
    const categoryMap = {
      strategic: 'strategic',
      community: 'community',
      corporate: 'corporate'
    };

    const category = categoryMap[req.params.category];
    if (!category) {
      return res.status(400).json({ error: 'Invalid partner category.' });
    }

    const partners = await Partner.find({ category, active: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(50);

    return res.json(partners);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load partners.' });
  }
});

router.get('/newsletter/latest', async (_req, res) => {
  try {
    const latest = await NewsletterIssue.findOne({ active: true }).sort({ publishedAt: -1, createdAt: -1 });
    if (!latest) {
      return res.status(404).json({ error: 'No newsletter available.' });
    }

    return res.json(latest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load newsletter.' });
  }
});

router.get('/woman-of-the-year/latest', async (_req, res) => {
  try {
    const latest = await WomanOfTheYear.findOne({ active: true }).sort({ year: -1, createdAt: -1 });
    if (!latest) {
      return res.status(404).json({ error: 'No woman of the year profile available.' });
    }

    return res.json(latest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load woman of the year profile.' });
  }
});

module.exports = router;
