// Portfolio - JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        // Remove animation class after it completes to allow hover transforms
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('animate-fade-in-up');
          entry.target.style.opacity = '1';
        }, { once: true });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe project cards for scroll animations
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Smooth page transitions (optional enhancement)
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        // Could add page transition animations here
      });
    }
  });

  // Video autoplay handling (when you add your video)
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Autoplay was prevented, that's okay
      console.log('Video autoplay prevented by browser');
    });
  }

  // Navbar scroll effect (optional)
  let lastScroll = 0;
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      nav.style.background = 'rgba(10, 10, 10, 0.95)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.background = 'linear-gradient(to bottom, var(--bg-primary), transparent)';
      nav.style.backdropFilter = 'none';
    }

    lastScroll = currentScroll;
  });

  // ================================
  // PROJECTS SLIDER
  // ================================
  const sliderTrack = document.querySelector('.slider-track');
  const sliderCards = document.querySelectorAll('.slider-card');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (sliderTrack && sliderCards.length > 0) {
    let currentIndex = 0;
    const cardsPerView = window.innerWidth <= 768 ? 1 : 2;
    const totalSlides = Math.ceil(sliderCards.length / cardsPerView);

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
      const cardWidth = sliderCards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(sliderTrack).gap) || 32;
      const offset = currentIndex * (cardWidth + gap) * cardsPerView;
      sliderTrack.style.transform = `translateX(-${offset}px)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Update buttons
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - 1;
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      updateSlider();
    }

    function nextSlide() {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateSlider();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      updateSlider();
    });

    // Initialize
    updateSlider();
  }
});
