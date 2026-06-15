const Testimonial = require('../models/Testimonial');

const featuredSuccessStories = [
  {
    name: 'Susan Mkangama',
    role: 'Founder of Nuswe Products',
    quote: 'Susan Mkangama founded Nuswe Products to provide affordable, high-quality detergents and soaps for households facing everyday hygiene challenges. Through research, testing, and customer feedback, she built a practical business that turns limited resources into reliable solutions.\n\nHer work earned recognition through the OWITL Seed Fund Awards, and the support is now helping her expand her reach, strengthen community hygiene, and create local economic opportunity.',
    imageUrl: `/images/${encodeURIComponent('susan mkangama.jpeg')}`,
    featured: true
  }
];

const getPublicTestimonials = async (limit = 12) => {
  const testimonials = await Testimonial.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit);

  const normalizedNames = new Set(
    featuredSuccessStories.map((story) => story.name.toLowerCase())
  );

  const filteredTestimonials = testimonials.filter(
    (story) => !normalizedNames.has(String(story.name || '').toLowerCase())
  );

  return [...featuredSuccessStories, ...filteredTestimonials];
};

module.exports = {
  featuredSuccessStories,
  getPublicTestimonials
};
