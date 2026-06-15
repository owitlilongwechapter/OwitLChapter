(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const dropdownButtons = document.querySelectorAll('.drop-btn');
  const sliderTimers = new WeakMap();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        button.parentElement.classList.toggle('open');
      }
    });
  });

  const initSlider = (sliderEl) => {
    const slideTrack = sliderEl.querySelector('.slide-track');
    const slides = sliderEl.querySelectorAll('.slide');
    const prevBtn = sliderEl.querySelector('.slider-btn.prev');
    const nextBtn = sliderEl.querySelector('.slider-btn.next');

    if (!slideTrack || slides.length === 0) {
      return;
    }

    if (sliderTimers.has(sliderEl)) {
      clearInterval(sliderTimers.get(sliderEl));
      sliderTimers.delete(sliderEl);
    }

    if (slides.length === 1) {
      if (prevBtn) {
        prevBtn.style.display = 'none';
      }
      if (nextBtn) {
        nextBtn.style.display = 'none';
      }
      slideTrack.style.transform = 'translateX(0)';
      return;
    }

    if (prevBtn) {
      prevBtn.style.display = '';
    }
    if (nextBtn) {
      nextBtn.style.display = '';
    }

    let index = 0;

    const moveSlide = () => {
      slideTrack.style.transform = `translateX(-${index * 100}%)`;
    };

    const goNext = () => {
      index = (index + 1) % slides.length;
      moveSlide();
    };

    const goPrev = () => {
      index = (index - 1 + slides.length) % slides.length;
      moveSlide();
    };

    if (nextBtn) {
      nextBtn.onclick = goNext;
    }

    if (prevBtn) {
      prevBtn.onclick = goPrev;
    }

    const timer = setInterval(goNext, 5000);
    sliderTimers.set(sliderEl, timer);
  };

  const initAllSliders = () => {
    document.querySelectorAll('.slider').forEach((sliderEl) => {
      initSlider(sliderEl);
    });
  };

  initAllSliders();
  window.addEventListener('owitl:slides-updated', initAllSliders);
})();
