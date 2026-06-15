const express = require('express');
const {
  featuredSuccessStories,
  getPublicTestimonials
} = require('../services/testimonialService');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const testimonials = await getPublicTestimonials(20);

    return res.json(testimonials);
  } catch (error) {
    return res.json(featuredSuccessStories);
  }
});

module.exports = router;
