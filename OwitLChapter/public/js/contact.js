(function () {
  const contactForm = document.querySelector('#contactForm');
  const formStatus = document.querySelector('#formStatus');

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject.value.trim(),
      message: contactForm.message.value.trim()
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      contactForm.reset();
      formStatus.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      formStatus.textContent = 'Unable to send now. Please try again later.';
    }
  });
})();
