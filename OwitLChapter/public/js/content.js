(function () {
  const formatDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Date TBA';
    }

    return parsed.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${url}`);
    }

    return response.json();
  };

  const setupHeroSlideshow = async () => {
    const heroImage = document.querySelector('[data-hero-slideshow]');
    if (!heroImage) {
      return;
    }

    try {
      const images = await fetchJson('/api/content/gallery');
      if (!Array.isArray(images) || images.length === 0) {
        return;
      }

      let currentIndex = images.findIndex((image) => image.src === heroImage.getAttribute('src'));
      if (currentIndex < 0) {
        currentIndex = 0;
        heroImage.src = images[0].src;
        heroImage.alt = images[0].alt || 'OWITL featured image';
      }

      if (images.length === 1) {
        return;
      }

      setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        const nextImage = images[currentIndex];

        heroImage.classList.add('is-fading');

        window.setTimeout(() => {
          heroImage.src = nextImage.src;
          heroImage.alt = nextImage.alt || 'OWITL featured image';
          heroImage.classList.remove('is-fading');
        }, 225);
      }, 4000);
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderTestimonials = async () => {
    const track = document.querySelector('.slide-track[data-dynamic="testimonials"]');
    if (!track) {
      return;
    }

    try {
      const testimonials = await fetchJson('/api/testimonials');
      if (!Array.isArray(testimonials) || testimonials.length === 0) {
        track.innerHTML = `
          <article class="slide">
            <div class="info-card">
              <h3>No success stories at the moment</h3>
              <p>Please check back soon.</p>
            </div>
          </article>
        `;
        window.dispatchEvent(new Event('owitl:slides-updated'));
        return;
      }

      track.innerHTML = testimonials.slice(0, 8).map((item) => {
        const image = item.imageUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80';
        const name = item.name || 'OWITL Member';
        const role = item.role || 'Community Voice';
        const quote = item.quote || 'OWITL has positively transformed my professional journey.';

        return `
          <article class="slide success-story-slide">
            <div class="success-story-card">
              <img class="success-story-image" src="${image}" alt="Success story portrait of ${name}" />
              <div class="success-story-content">
                <h3>${name}</h3>
                <p class="success-story-role">${role}</p>
                <p>${quote}</p>
              </div>
            </div>
          </article>
        `;
      }).join('');

      window.dispatchEvent(new Event('owitl:slides-updated'));
    } catch (error) {
      track.innerHTML = `
        <article class="slide">
          <div class="info-card">
            <h3>No success stories at the moment</h3>
            <p>Please check back soon.</p>
          </div>
        </article>
      `;
      window.dispatchEvent(new Event('owitl:slides-updated'));
      console.error(error.message);
    }
  };

  const renderJoinTestimonials = async () => {
    const track = document.querySelector('.slide-track[data-dynamic="member-stories"]');
    if (!track) {
      return;
    }

    try {
      const testimonials = await fetchJson('/api/testimonials');
      if (!Array.isArray(testimonials) || testimonials.length === 0) {
        track.innerHTML = `
          <article class="slide">
            <div class="info-card">
              <h3>No success stories at the moment</h3>
              <p>Please check back soon.</p>
            </div>
          </article>
        `;
        window.dispatchEvent(new Event('owitl:slides-updated'));
        return;
      }

      track.innerHTML = testimonials.slice(0, 8).map((item) => {
        const name = item.name || 'OWITL Member';
        const story = item.quote || 'OWITL has positively transformed my professional journey.';
        const storyParagraphs = story
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph) => `<p>${paragraph}</p>`)
          .join('');

        return `
          <article class="slide simple-slide">
            <div class="info-card join-story-card">
              <h3>${name}</h3>
              <div class="join-story-copy">${storyParagraphs || `<p>${story}</p>`}</div>
            </div>
          </article>
        `;
      }).join('');

      window.dispatchEvent(new Event('owitl:slides-updated'));
    } catch (error) {
      track.innerHTML = `
        <article class="slide">
          <div class="info-card">
            <h3>No success stories at the moment</h3>
            <p>Please check back soon.</p>
          </div>
        </article>
      `;
      window.dispatchEvent(new Event('owitl:slides-updated'));
      console.error(error.message);
    }
  };

  const renderTeam = async () => {
    const track = document.querySelector('.slide-track[data-dynamic="team"]');
    if (!track) {
      return;
    }

    try {
      const teamMembers = await fetchJson('/api/content/team');
      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        track.innerHTML = `
          <article class="slide">
            <div class="info-card">
              <h3>No team data at the moment</h3>
              <p>Please check back soon.</p>
            </div>
          </article>
        `;
        window.dispatchEvent(new Event('owitl:slides-updated'));
        return;
      }

      track.innerHTML = teamMembers.slice(0, 20).map((member) => {
        const name = member.name || 'Team Member';
        const role = member.role || 'OWITL Team';
        const image = member.imageUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80';

        return `
          <article class="slide">
            <img src="${image}" alt="Photo of ${name}" />
            <div>
              <h3>${name}</h3>
              <p>${role}</p>
            </div>
          </article>
        `;
      }).join('');

      window.dispatchEvent(new Event('owitl:slides-updated'));
    } catch (error) {
      track.innerHTML = `
        <article class="slide">
          <div class="info-card">
            <h3>No team data at the moment</h3>
            <p>Please check back soon.</p>
          </div>
        </article>
      `;
      window.dispatchEvent(new Event('owitl:slides-updated'));
      console.error(error.message);
    }
  };

  const recentEventsData = [
    {
      id: 'financial-literacy-training',
      title: 'Financial Literacy Training',
      description: 'OWIT LILONGWE CHAPTER organized a financial literacy training to equip women in cross border trade with knowledge about finance and export readiness.',
      details: 'OWIT LILONGWE CHAPTER organized a financial literacy training to equip women in cross border trade with knowledge about finance and export readiness. Participants learned practical budgeting, export documentation, and financial planning skills to strengthen their businesses.',
      imageUrls: [
        '/events/FINANCIAL%20LITERACY%20TRAINING/photo%201.jpg',
        '/events/FINANCIAL%20LITERACY%20TRAINING/photo%202.jpg',
        '/events/FINANCIAL%20LITERACY%20TRAINING/photo%203.jpg'
      ]
    },
    {
      id: 'mou-signing',
      title: 'MOU Signing',
      description: 'OWIT LILONGWE signed a memorandum of assignment with UNICAF University to increase access to quality higher education for women in business.',
      details: 'OWIT LILONGWE signed a memorandum of assignment with UNICAF University, a strategic partnership aimed at increasing access to quality higher education for women in business. Together we hope to build pathways for empowerment, growth, leadership, and lifelong learning. The event happened on 05 June 2026 at UNICAF premises.',
      imageUrls: [
        '/events/MOU%20SIGNING/group%20photo%202.jpeg',
        '/events/MOU%20SIGNING/group%20photo.jpeg',
        '/events/MOU%20SIGNING/_S1A8981.jpg'
      ]
    },
    {
      id: 'seed-award',
      title: 'Seed Award',
      description: 'An awards ceremony recognizing outstanding women entrepreneurs and providing seed funding to scale their initiatives.',
      details: 'The Seed Award honored trailblazers across sectors and offered winners mentorship and financial support to accelerate their next growth stage.',
      imageUrls: [
        '/events/SEED%20AWARD/seed%20award.jpeg',
        '/events/SEED%20AWARD/WhatsApp%20Image%202026-04-08%20at%2014.48.18.jpeg',
        '/events/SEED%20AWARD/whole%20photo.jpeg'
      ]
    }
  ];

  const renderEventsByType = async (type, targetId, emptyTitle) => {
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    try {
      const events = await fetchJson(`/api/content/events/${type}`);
      if (!Array.isArray(events) || events.length === 0) {
        target.innerHTML = `<article class="info-card"><h3>${emptyTitle}</h3><p>Please check back soon for updates.</p></article>`;
        return;
      }

      target.innerHTML = events.slice(0, 10).map((eventItem) => {
        const title = eventItem.title || 'Event';
        const location = eventItem.location || 'Location TBA';
        const description = eventItem.description || 'Program details will be announced soon.';
        const eventDate = formatDate(eventItem.eventDate);

        return `
          <article class="info-card">
            <h3>${title}</h3>
            <p>${eventDate} - ${location}</p>
            <p>${description}</p>
          </article>
        `;
      }).join('');
    } catch (error) {
      target.innerHTML = `<article class="info-card"><h3>${emptyTitle}</h3><p>Please check back soon for updates.</p></article>`;
      console.error(error.message);
    }
  };

  const renderRecentEvents = (targetId) => {
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    target.innerHTML = `
      <article class="info-card recent-events-card">
        <div class="recent-events-list">
          ${recentEventsData.map((eventItem) => `
            <div class="recent-event-item">
              <h3>${eventItem.title}</h3>
              <p>${eventItem.description}</p>
              <a href="#" class="event-link" data-event-id="${eventItem.id}">Read more about this event</a>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  };

  const openEventModal = (eventId) => {
    const modal = document.querySelector('#event-modal');
    const modalTitle = document.querySelector('#event-modal-title');
    const modalBody = document.querySelector('#event-modal-body');
    if (!modal || !modalTitle || !modalBody) {
      return;
    }

    const eventData = recentEventsData.find((eventItem) => eventItem.id === eventId);
    if (!eventData) {
      return;
    }

    modalTitle.textContent = eventData.title;
    modalBody.innerHTML = `
      <p>${eventData.details}</p>
      <div class="event-gallery">
        ${eventData.imageUrls.map((src) => `<a href="${src}" target="_blank" rel="noreferrer"><img src="${src}" alt="${eventData.title}" /></a>`).join('')}
      </div>
    `;
    modal.hidden = false;
  };

  const closeEventModal = () => {
    const modal = document.querySelector('#event-modal');
    if (!modal) {
      return;
    }

    modal.hidden = true;
  };

  const setupEventModal = () => {
    const modal = document.querySelector('#event-modal');
    if (!modal) {
      return;
    }

    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeEventModal();
      });
    }

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeEventModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal && !modal.hidden) {
        closeEventModal();
      }
    });

    document.body.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('.event-link') : null;
      if (!link) {
        return;
      }

      event.preventDefault();
      const eventId = link.dataset.eventId;
      openEventModal(eventId);
    });
  };

  const renderNews = async () => {
    const newsletterTarget = document.querySelector('#newsletter-content');
    const womanTarget = document.querySelector('#woman-year-content');

    if (newsletterTarget) {
      try {
        const data = await fetchJson('/api/content/newsletter/latest');
        const title = data.title || 'Seed Award News';
        const summary = data.summary || 'The Seed Award celebrated outstanding women entrepreneurs with funding, mentorship, and recognition for accelerating business growth.';
        const imageAlt = title.includes('Seed Award') ? 'Seed Award Newsletter' : title;

        newsletterTarget.innerHTML = `
          <div class="info-card featured-news-card">
            <img class="featured-news-image" src="/newsletters/news%20.jpeg" alt="${imageAlt}" />
            <div class="featured-news-content">
              <h3>${title}</h3>
              <p>Published: ${formatDate(data.publishedAt)}</p>
              <p>${summary}</p>
            </div>
          </div>
        `;
      } catch (error) {
        newsletterTarget.innerHTML = `
          <div class="info-card featured-news-card">
            <img class="featured-news-image" src="/newsletters/news%20.jpeg" alt="Seed Award Newsletter" />
            <div class="featured-news-content">
              <h3>Seed Award News</h3>
              <p>The Seed Award story appears in the newsletter — celebrating the winners, the support, and the event highlights.</p>
            </div>
          </div>
        `;
      }
    }

    if (womanTarget) {
      try {
        const data = await fetchJson('/api/content/woman-of-the-year/latest');
        womanTarget.innerHTML = `
          <div class="info-card">
            <h3>${data.name} - Woman of the Year ${data.year}</h3>
            <p>${data.profile}</p>
          </div>
        `;
      } catch (error) {
        womanTarget.innerHTML = '<div class="info-card"><h3>Woman of the Year</h3><p>No profile at the moment.</p></div>';
      }
    }
  };

  const setupMembershipForm = () => {
    const form = document.querySelector('#membership-form');
    const status = document.querySelector('#membership-form-status');
    if (!form || !status) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Submitting application...';

      const formData = new FormData(form);
      const payload = {
        fullName: String(formData.get('fullName') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        profession: String(formData.get('profession') || '').trim(),
        motivation: String(formData.get('motivation') || '').trim()
      };

      try {
        const response = await fetch('/api/membership/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit application.');
        }

        form.reset();
        status.textContent = 'Application submitted successfully.';
      } catch (error) {
        status.textContent = error.message || 'Failed to submit application.';
      }
    });
  };

  const defaultPartnerData = {
    strategic: [
      {
        name: 'MOU Signing with UNICAF University',
        description: 'The MOU Signing is a strategic partnership with UNICAF University to expand access to higher education and empower women in business through scholarships, mentorship, and career pathways.'
      }
    ],
    corporate: [
      {
        name: 'GIZ',
        description: 'GIZ is supporting OWITL projects focused on women entrepreneurs, leadership development, and regional trade capacity building.'
      },
      {
        name: 'CIPE',
        description: 'CIPE sponsors OWITL initiatives that promote economic empowerment, governance training, and business growth for women-led enterprises.'
      }
    ]
  };

  const renderPartnerCategory = async (card) => {
    if (!card) {
      return;
    }

    const category = card.dataset.partnerCategory;
    const list = card.querySelector('.partner-list');
    if (!category || !list) {
      return;
    }

    list.innerHTML = '<p>Loading...</p>';
    try {
      const partners = await fetchJson(`/api/content/partners/${category}`);
      const resolvedPartners = Array.isArray(partners) && partners.length > 0 ? partners : defaultPartnerData[category] || [];
      if (resolvedPartners.length === 0) {
        list.innerHTML = '<p>No partners as of yet.</p>';
        return;
      }

      list.innerHTML = resolvedPartners.map((partner) => {
        const name = partner.name || 'Partner';
        const description = partner.description || '';
        const website = partner.website || '';
        const linkMarkup = website ? `<p><a href="${website}" target="_blank" rel="noreferrer">Visit Website</a></p>` : '';
        return `<div class="partner-item"><h4>${name}</h4><p>${description}</p>${linkMarkup}</div>`;
      }).join('');
    } catch (error) {
      const fallback = defaultPartnerData[category] || [];
      if (fallback.length === 0) {
        list.innerHTML = '<p>No partners as of yet.</p>';
      } else {
        list.innerHTML = fallback.map((partner) => {
          const name = partner.name || 'Partner';
          const description = partner.description || '';
          return `<div class="partner-item"><h4>${name}</h4><p>${description}</p></div>`;
        }).join('');
      }
      console.error(error.message);
    }
  };

  const setupPartnersExpand = () => {
    const cards = document.querySelectorAll('.expandable-card[data-partner-category]');
    if (!cards.length) {
      return;
    }

    cards.forEach((card) => {
      const button = card.querySelector('.partner-view-btn');
      const list = card.querySelector('.partner-list');
      if (!button || !list) {
        return;
      }

      button.addEventListener('click', async () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          button.setAttribute('aria-expanded', 'false');
          list.hidden = true;
          return;
        }

        button.setAttribute('aria-expanded', 'true');
        list.hidden = false;
        if (!list.dataset.loaded) {
          await renderPartnerCategory(card);
          list.dataset.loaded = 'true';
        }
      });
    });
  };

  renderTestimonials();
  renderJoinTestimonials();
  renderTeam();
  renderEventsByType('upcoming', '#upcoming-events-list', 'No events at the moment');
  renderEventsByType('conferences', '#conferences-list', 'No conferences at the moment');
  renderRecentEvents('#recent-events-list');
  renderNews();
  setupMembershipForm();
  setupEventModal();
  setupPartnersExpand();
  setupHeroSlideshow();
})();
