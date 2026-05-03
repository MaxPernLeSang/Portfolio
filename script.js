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

  // Observe scroll-animate elements (like About section)
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-animate').forEach(el => {
    scrollObserver.observe(el);
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
  document.querySelectorAll('.project-card, .timeline-card').forEach(card => {
    let video = null;
    let hasError = false;

    // Get project ID from href
    const link = card.getAttribute('href');
    if (!link) return;

    // Extract folder name e.g. "projet_12"
    const match = link.match(/projets\/(.*?)\//);
    const projectId = match ? match[1] : null;
    let previewPath = card.dataset.preview || (projectId ? `assets/previews/${projectId}.mp4` : null);

    // Ajustement dynamique de la qualité vidéo pour mobile vs desktop
    if (previewPath && previewPath.includes('res.cloudinary.com')) {
      const isMobile = window.innerWidth <= 768 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (isMobile) {
        // Compression extrême et basse résolution pour mobile
        previewPath = previewPath.replace('/upload/', '/upload/q_auto:eco,w_300,');
      } else {
        // Bonne qualité pour desktop
        previewPath = previewPath.replace('/upload/', '/upload/q_auto:good,w_800,');
      }
    }

    card.playPreview = () => {
      card.wantsToPlay = true;
      if (hasError || !previewPath) return;

      if (!video) {
        // MP4 Preview
        video = document.createElement('video');
        video.src = previewPath;
        video.className = 'project-preview-video';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
          if (!card.wantsToPlay) return; // Ne pas jouer si l'élément n'est plus actif
          if (video.videoHeight > video.videoWidth) {
            video.style.objectFit = 'contain';
          }
          video.classList.add('active');
          video.play().catch(e => console.log('Preview playback failed:', e));
        });

        video.addEventListener('error', () => {
          hasError = true;
          video.remove();
          video = null;
        });

        const thumbnail = card.querySelector('.project-thumbnail') || (card.classList.contains('timeline-card') ? (card.style.position = 'relative', card) : card);
        if (thumbnail) thumbnail.appendChild(video);
      } else {
        if (!card.wantsToPlay) return;
        video.currentTime = 0;
        video.play().catch(e => { });
        video.classList.add('active');
      }
    };

    card.stopPreview = () => {
      card.wantsToPlay = false;
      if (video) {
        video.classList.remove('active');
        setTimeout(() => {
          if (video && !video.classList.contains('active')) {
            video.pause();
          }
        }, 400); // Wait for fade out
      }
    };

    // Pour desktop (souris)
    card.addEventListener('mouseenter', card.playPreview);
    card.addEventListener('mouseleave', card.stopPreview);
  });

  // Pour mobile (tactile), on utilise l'IntersectionObserver pour lire la vidéo quand elle est au centre de l'écran
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (isTouchDevice) {
    const previewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.playPreview();
        } else {
          entry.target.stopPreview();
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('.project-card, .timeline-card').forEach(card => {
      previewObserver.observe(card);
    });
  }

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

  // UNIVERSAL EMAIL COPY LOGIC (NO MAILTO ALLOWED)
  const emailLinks = document.querySelectorAll('.footer-email-block, #emailBtn');
  const EMAIL = "maxime.perigny.50@gmail.com";

  function copyEmailToClipboard() {
    // Method 1: Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(EMAIL).then(() => true).catch(() => false);
    }
    // Method 2: Legacy execCommand fallback
    return new Promise((resolve) => {
      try {
        const el = document.createElement('textarea');
        el.value = EMAIL;
        el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 99999);
        const success = document.execCommand('copy');
        document.body.removeChild(el);
        resolve(success);
      } catch (e) {
        resolve(false);
      }
    });
  }

  function showEmailCopiedFeedback(el) {
    const originalText = el.textContent.trim();
    const originalBg = el.style.backgroundColor;
    const originalColor = el.style.color;
    const originalBorder = el.style.borderColor || '';

    el.textContent = "EMAIL COPIÉ !";
    el.style.backgroundColor = "#4CA154";
    el.style.color = "#FFFFFF";
    el.style.borderColor = "#4CA154";

    setTimeout(() => {
      el.textContent = originalText;
      el.style.backgroundColor = originalBg;
      el.style.color = originalColor;
      el.style.borderColor = originalBorder;
    }, 2000);
  }

  emailLinks.forEach(el => {
    el.removeAttribute('href');
    el.style.cursor = 'pointer';

    el.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Always show feedback immediately — don't wait for clipboard
      showEmailCopiedFeedback(el);

      // Try to copy in background
      await copyEmailToClipboard();
    });
  });

  // ================================
  // PROJECT FILTERS
  // ================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#grid-view .project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // 1. Update Buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. Filter Projects
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');

          // Reset animation classes
          card.classList.remove('animating-in');
          card.classList.remove('animating-out');

          if (filter === 'all' || filter === category) {
            // SHOW
            if (card.classList.contains('filter-hidden')) {
              card.classList.remove('filter-hidden');
              card.classList.add('animating-in');
            } else {
              card.style.display = '';
            }
          } else {
            // HIDE
            if (!card.classList.contains('filter-hidden')) {
              card.classList.add('animating-out');
              setTimeout(() => {
                // Check if it's still supposed to be hidden (user might have clicked quickly)
                if (card.classList.contains('animating-out')) {
                  card.classList.add('filter-hidden');
                  card.classList.remove('animating-out');
                }
              }, 300);
            }
          }
        });
      });
    });
  }

  // ================================
  // TIMELINE SCROLL SPY
  // ================================
  const timelineYears = document.querySelectorAll('.timeline-year-badge');

  if (timelineYears.length > 0) {
    const yearObserverOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when element is in the middle 20% of viewport
      threshold: 0
    };

    const yearObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, yearObserverOptions);

    timelineYears.forEach(year => yearObserver.observe(year));
  }

  // ================================
  // TAG MODAL SYSTEM
  // ================================
  
  const PROJECTS_DATABASE = [
    { id: "projet_18", title: "Freeride Qualifier 4☆", category: "Sport", tags: ["Sport", "Événement", "Prise de vue"], thumb: "https://i.ytimg.com/vi/YR2tEMqG_XM/hqdefault.jpg" },
    { id: "projet_17", title: "Coucou La Rosière Vlog", category: "Vlog", tags: ["Vlog", "Websérie", "Montage"], thumb: "https://i.ytimg.com/vi/lX4GxFVD1zQ/hqdefault.jpg" },
    { id: "projet_16", title: "Le décor est posé", category: "Nature", tags: ["Nature", "Social Media", "Montage"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/d37350197104915.662a83d294937.jpg" },
    { id: "projet_15", title: "Coucou La Rosière FAQ", category: "Websérie", tags: ["Websérie", "FAQ", "Social Media"], thumb: "https://i.ytimg.com/vi/1dzWt-Lpazg/hqdefault.jpg" },
    { id: "projet_14", title: "Tour de l'Avenir 2025", category: "Cyclisme", tags: ["Cyclisme", "Reportage", "Prise de vue"], thumb: "projets/projet_14/DSC05861.jpg" },
    { id: "projet_13", title: "Site Officiel La Rosière", category: "Contenu Web", tags: ["Contenu Web", "Photographie", "Prise de vue"], thumb: "assets/thumbnails/la_rosiere_site_v2.png" },
    { id: "projet_12", title: "Explore Savoie", category: "Websérie", tags: ["Websérie", "Montagne", "Prise de vue"], thumb: "assets/thumbnails/explore_savoie_video.jpeg" },
    { id: "projet_11", title: "Les Matins Nostalgie", category: "Événement", tags: ["Événement", "Prise de vue", "Photographie"], thumb: "assets/thumbnails/nostalgie.png" },
    { id: "projet_10", title: "Dameuse La Rosière", category: "Social Media", tags: ["Montagne", "Social Media", "Montage"], thumb: "assets/thumbnails/dameuse.png" },
    { id: "projet_9", title: "Vue Drone La Rosière", category: "Drone", tags: ["Drone", "Paysage", "Social Media"], thumb: "assets/thumbnails/drone.png" },
    { id: "projet_8", title: "Tennis La Rosière", category: "Sport", tags: ["Sport", "Social Media", "Montage"], thumb: "assets/thumbnails/tennis.png" },
    { id: "projet_7", title: "Trail Blanc La Rosière", category: "Sport", tags: ["Sport", "Événement", "Montage"], thumb: "https://i.ytimg.com/vi/wIfZ9nyZeyE/maxresdefault.jpg" },
    { id: "projet_6", title: "Last Man Riding", category: "Sport", tags: ["Sport", "Événement", "Montage"], thumb: "https://i.ytimg.com/vi/wraUG-eyWt4/maxresdefault.jpg" },
    { id: "projet_5", title: "Tour de l'Abitibi 2024", category: "Sport", tags: ["Cyclisme", "Sport", "Prise de vue"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/859133208608647.66f1bd54e0d03.jpg" },
    { id: "projet_4", title: "Réussir Autrement", category: "Portraits", tags: ["Portraits", "Social", "Montage"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/dc0890205601801.66bdcf8489032.png" },
    { id: "projet_3", title: "DaVinci l'Expérience", category: "Interactif", tags: ["IA", "Interactif", "Design"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/3cc018205524947.66bc87830dbda.jpg" },
    { id: "projet_2", title: "Table Forêt", category: "Nature", tags: ["360°", "Nature", "Expérience"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/8c0677205524451.66bc86ec55799.jpg" },
    { id: "projet_1", title: "GRWM", category: "Court-métrage", tags: ["Court-métrage", "Festivals", "Réalisation"], thumb: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/d37350197104915.662a83d294937.jpg" }
  ];

  // Create Modal Structure
  const modalHTML = `
    <div class="tag-modal-overlay" id="tagModal">
      <div class="tag-modal-container">
        <div class="tag-modal-close" id="closeTagModal">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <div class="tag-modal-header">
          <span class="tag-modal-label">Projets liés au tag</span>
          <h2 class="tag-modal-title" id="tagModalTitle">Tag Name</h2>
        </div>
        <div class="tag-results-grid" id="tagResultsGrid">
          <!-- Results injected here -->
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const tagModal = document.getElementById('tagModal');
  const tagModalTitle = document.getElementById('tagModalTitle');
  const tagResultsGrid = document.getElementById('tagResultsGrid');
  const closeTagModal = document.getElementById('closeTagModal');

  // Detect if we are in a subfolder (projets/projet_x/)
  const isSubfolder = window.location.pathname.includes('/projets/');
  const pathPrefix = isSubfolder ? '../../' : '';

  function openTagModal(tagName) {
    tagModalTitle.textContent = tagName;
    tagResultsGrid.innerHTML = '';

    const filteredProjects = PROJECTS_DATABASE.filter(p => p.tags.includes(tagName));

    filteredProjects.forEach(project => {
      const card = document.createElement('a');
      card.href = pathPrefix + "projets/" + project.id + "/index.html";
      card.className = 'tag-result-card';
      
      // Fix thumb path
      let thumbSrc = project.thumb;
      if (!thumbSrc.startsWith('http') && !thumbSrc.startsWith('/')) {
        thumbSrc = pathPrefix + thumbSrc;
      }

      card.innerHTML = `
        <div class="tag-result-thumb">
          <img src="${thumbSrc}" alt="${project.title}">
        </div>
        <div class="tag-result-info">
          <span class="tag-result-title">${project.title}</span>
          <span class="tag-result-category">${project.category}</span>
        </div>
      `;
      tagResultsGrid.appendChild(card);
    });

    tagModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }

  function closeTagModalFunc() {
    tagModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event Listeners for tags
  document.addEventListener('click', (e) => {
    const tagBadge = e.target.closest('.skill-badge');
    if (tagBadge) {
      const tagName = tagBadge.textContent.trim();
      openTagModal(tagName);
    }
  });

  closeTagModal.addEventListener('click', closeTagModalFunc);
  tagModal.addEventListener('click', (e) => {
    if (e.target === tagModal) closeTagModalFunc();
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTagModalFunc();
  });

});

// ================================
// EMAIL COPY — outside DOMContentLoaded
// ================================
(function initEmailCopy() {
  const EMAIL = "maxime.perigny.50@gmail.com";

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).catch(() => {});
      return;
    }
    try {
      const el = document.createElement('textarea');
      el.value = EMAIL;
      el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    } catch (e) {}
  }

  function showFeedback(btn) {
    if (btn.querySelector('.email-text-default')) {
      btn.classList.add('copied');
      setTimeout(function() { btn.classList.remove('copied'); }, 2200);
    } else {
      const orig = btn.textContent.trim();
      btn.textContent = '✓ EMAIL COPIÉ !';
      btn.style.backgroundColor = '#2d9e4f';
      btn.style.color = '#fff';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 2200);
    }
  }

  function attachListeners() {
    var btns = document.querySelectorAll('.footer-email-block, #emailBtn');
    btns.forEach(function(btn) {
      btn.removeAttribute('href');
      var newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showFeedback(newBtn);
        copyEmail();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
  } else {
    attachListeners();
  }
})();
