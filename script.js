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

  // Slider Scroll Hint - Show after inactivity if no horizontal scroll
  const sliderContainer = document.getElementById('sliderContainer');
  const sliderScrollHint = document.getElementById('sliderScrollHint');

  if (sliderContainer && sliderScrollHint) {
    let sliderHintTimeout;
    let hasSliderScrolled = false;

    // Show hint after 2 seconds of inactivity
    const showSliderHint = () => {
      if (!hasSliderScrolled && sliderContainer.scrollLeft < 50) {
        sliderScrollHint.classList.add('visible');
      }
    };

    // Hide hint on horizontal scroll
    const hideSliderHint = () => {
      if (sliderContainer.scrollLeft > 50) {
        hasSliderScrolled = true;
        sliderScrollHint.classList.remove('visible');
        clearTimeout(sliderHintTimeout);
      }
    };

    // Listen for horizontal scroll on slider
    sliderContainer.addEventListener('scroll', hideSliderHint, { passive: true });

    // Also hide on touch/mouse interaction
    sliderContainer.addEventListener('mousedown', () => {
      hasSliderScrolled = true;
      sliderScrollHint.classList.remove('visible');
    }, { once: true });

    sliderContainer.addEventListener('touchstart', () => {
      hasSliderScrolled = true;
      sliderScrollHint.classList.remove('visible');
    }, { once: true });

    // Start timeout when slider is visible
    const sliderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasSliderScrolled) {
          sliderHintTimeout = setTimeout(showSliderHint, 2000);
        }
      });
    }, { threshold: 0.5 });

    sliderObserver.observe(sliderContainer);
  }

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

  // ================================
  // VIDEO PREVIEWS (HOVER)
  // ================================
  document.querySelectorAll('.project-card').forEach(card => {
    let video = null;
    let hasError = false;

    // Get project ID from href
    // Expecting href="projets/projet_X/index.html"
    const link = card.getAttribute('href');
    if (!link) return;

    // Extract folder name e.g. "projet_12"
    const match = link.match(/projets\/(.*?)\//);
    if (!match) return;

    const projectId = match[1];
    const previewPath = `assets/previews/${projectId}.mp4`;

    card.addEventListener('mouseenter', () => {
      if (hasError) return;

      if (!video) {
        // Create video element on first hover
        video = document.createElement('video');
        video.src = previewPath;
        video.className = 'project-preview-video';
        video.muted = true;
        video.loop = true;
        video.playsInline = true; // Capitalized I for JS property

        // Handle load success
        video.addEventListener('loadeddata', () => {
          video.classList.add('active');
          video.play().catch(e => console.log('Preview playback failed:', e));
        });

        // Handle error (file missing)
        video.addEventListener('error', () => {
          hasError = true;
          video.remove();
          video = null;
        });

        const thumbnail = card.querySelector('.project-thumbnail');
        if (thumbnail) thumbnail.appendChild(video);
      } else {
        // Video already exists, just play
        video.currentTime = 0;
        video.play().catch(e => { });
        video.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      if (video) {
        video.classList.remove('active');
        setTimeout(() => {
          if (video) video.pause();
        }, 400); // Wait for fade out
      }
    });
  });

  // ================================
  // CUSTOM CURSOR
  // ================================
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update dot immediately
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follow for the main cursor circle
    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const addHoverListeners = () => {
      const hoverElements = document.querySelectorAll('a, button, .project-card, .slider-btn');

      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hover');
          cursorDot.style.opacity = '0'; // Hide dot on hover
        });

        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover');
          cursorDot.style.opacity = '1'; // Show dot again
        });
      });
    };

    addHoverListeners();
  }

  // FORCE EMAIL BUTTON CLICK
  const emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      // Allow default behavior, but also force it just in case
      console.log('Email button clicked');
      // setTimeout(() => {
      //     window.location.href = "mailto:maxime.perigny.50@gmail.com";
      // }, 100);
    });
  }
});
