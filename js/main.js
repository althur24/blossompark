/* ============================================
   BLOSSOM PARK RESIDENCE — Main JavaScript
   Lead Generation Landing Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // 0. PRELOADER
  // ==============================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Remove preloader when page fully loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        
        // Remove from DOM after transition completes to free memory
        setTimeout(() => {
          preloader.remove();
        }, 1000);
      }, 1500); // Allow animation to be seen
    });

    // Fallback in case load takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        setTimeout(() => preloader.remove(), 1000);
      }
    }, 6000);
  }
  // ==============================
  // 1. SCROLL PROGRESS BAR
  // ==============================
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }

  // ==============================
  // 2. STICKY NAVIGATION
  // ==============================
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ==============================
  // 3. ACTIVE MENU HIGHLIGHT
  // ==============================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[data-nav]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==============================
  // 4. COMBINED SCROLL HANDLER
  // ==============================
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavbarScroll();
        highlightActiveNav();
        handleBackToTop();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==============================
  // 5. MOBILE NAVIGATION
  // ==============================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('show');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ==============================
  // 6. SMOOTH SCROLL
  // ==============================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offsetTop = targetEl.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // ==============================
  // 7. SCROLL REVEAL ANIMATIONS
  // ==============================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==============================
  // 8. COUNTER ANIMATION
  // ==============================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * (target - start) + start);

              counter.textContent = current + (target >= 100 ? '+' : '');

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target + (target >= 100 ? '+' : '');
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const communityStats = document.querySelector('.community-stats');
  if (communityStats) {
    counterObserver.observe(communityStats);
  }

  // ==============================
  // 9. UNIT TABS
  // ==============================
  const unitTabs = document.querySelectorAll('.unit-tab');
  const unitPanels = document.querySelectorAll('.unit-panel');

  unitTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-unit');

      // Update tabs
      unitTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      unitPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === 'panel-' + target) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==============================
  // 9B. MOBILE CAROUSEL (COLLECTIONS)
  // ==============================
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const unitPanelsContainer = document.querySelector('.unit-panels');

  if (unitPanelsContainer && carouselDots.length > 0) {
    // Update active dot based on scroll position
    function updateCarouselDots() {
      if (window.innerWidth > 768) return;

      const panels = unitPanelsContainer.querySelectorAll('.unit-panel');
      const containerRect = unitPanelsContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      panels.forEach((panel, index) => {
        const panelRect = panel.getBoundingClientRect();
        const panelCenter = panelRect.left + panelRect.width / 2;
        const distance = Math.abs(panelCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === closestIndex);
      });
    }

    let carouselTicking = false;
    const swipeGesture = document.getElementById('swipeGesture');

    unitPanelsContainer.addEventListener('scroll', () => {
      // Hide swipe gesture on first scroll
      if (swipeGesture && !swipeGesture.classList.contains('hidden')) {
        swipeGesture.classList.add('hidden');
      }

      if (!carouselTicking) {
        requestAnimationFrame(() => {
          updateCarouselDots();
          carouselTicking = false;
        });
        carouselTicking = true;
      }
    });

    // Dot click → scroll to panel
    carouselDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        const panels = unitPanelsContainer.querySelectorAll('.unit-panel');
        if (panels[index]) {
          panels[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      });
    });
  }

  // ==============================
  // 10. FAQ ACCORDION
  // ==============================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if not already active)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==============================
  // 11. GALLERY LIGHTBOX
  // ==============================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIndex = 0;

  const galleryImages = Array.from(galleryItems).map((item) => ({
    src: item.querySelector('img').src,
    caption: item.getAttribute('data-caption'),
  }));

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxCaption.textContent = galleryImages[index].caption;
    lightbox.style.display = 'flex';
    // Trigger reflow for CSS transition
    void lightbox.offsetWidth;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    // Wait for fade-out transition before hiding
    setTimeout(() => {
      if (!lightbox.classList.contains('show')) {
        lightbox.style.display = 'none';
      }
    }, 300);
  }

  function navigateLightbox(direction) {
    currentGalleryIndex =
      (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex].src;
    lightboxCaption.textContent = galleryImages[currentGalleryIndex].caption;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ==============================
  // 12. FORM VALIDATION & SUBMISSION
  // ==============================

  // --- Utility: Toast Notification ---
  function showFormToast(message) {
    const existing = document.querySelector('.form-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'form-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // --- Utility: Validate Form ---
  function validateForm(form) {
    let isValid = true;
    const nameInput = form.querySelector('input[name="name"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');
    const unitSelect = form.querySelector('select[name="unit"]');

    // Reset all errors first
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // Validate name (min 2 chars)
    if (nameInput && (!nameInput.value.trim() || nameInput.value.trim().length < 2)) {
      nameInput.closest('.form-group').classList.add('error');
      isValid = false;
    }

    // Validate select (must have chosen an option)
    if (unitSelect && (!unitSelect.value || unitSelect.value === '')) {
      unitSelect.closest('.form-group').classList.add('error');
      isValid = false;
    }

    // Validate WhatsApp (Indonesian phone format)
    if (whatsappInput) {
      const waValue = whatsappInput.value.trim();
      const digits = waValue.replace(/\D/g, '');
      const startsCorrectly = /^(\+?62|0)/.test(waValue);

      if (!waValue || !startsCorrectly || digits.length < 10 || digits.length > 15) {
        whatsappInput.closest('.form-group').classList.add('error');
        isValid = false;
      }
    }

    return isValid;
  }

  // --- Utility: Show Validation Errors ---
  function showValidationFeedback(form) {
    showFormToast('⚠️ Mohon lengkapi semua data sebelum mengirim form.');

    // Shake error fields
    form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.add('shake');
      setTimeout(() => group.classList.remove('shake'), 600);
    });

    // Scroll to first error
    const firstError = form.querySelector('.form-group.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // --- CTA Form (WhatsApp Redirect) ---
  const ctaForm = document.getElementById('ctaLeadForm');
  const ctaSuccess = document.getElementById('ctaFormSuccess');
  const ctaSubmitBtn = document.getElementById('ctaSubmitBtn');

  if (ctaForm && ctaSubmitBtn) {
    ctaSubmitBtn.addEventListener('click', () => {

      // Step 1: Validate
      if (!validateForm(ctaForm)) {
        showValidationFeedback(ctaForm);
        return;
      }

      // Step 2: Loading state
      const originalText = ctaSubmitBtn.innerHTML;
      ctaSubmitBtn.disabled = true;
      ctaSubmitBtn.classList.add('loading');
      ctaSubmitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> <span>Memproses...</span>';

      // Step 3: Fire Pixel (if exists)
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }

      // Step 4: Build WhatsApp URL
      const adminWA = '6281234567890'; // GANTI DENGAN NOMOR ADMIN ASLI
      const name = ctaForm.querySelector('input[name="name"]').value.trim();
      const unit = ctaForm.querySelector('select[name="unit"]').value;
      const message = 'Halo Admin Blossom Park Residence 🏡\n\n'
        + 'Perkenalkan, saya *' + name + '*.\n'
        + 'Saya tertarik untuk mendapatkan informasi lengkap mengenai rumah *Tipe ' + unit + '* di Blossom Park Residence.\n\n'
        + 'Mohon bantuannya untuk:\n'
        + '✅ Pricelist terbaru\n'
        + '✅ Jadwal survey lokasi\n'
        + '✅ Info promo yang sedang berlaku\n\n'
        + 'Terima kasih 🙏';

      const waURL = 'https://wa.me/' + adminWA + '?text=' + encodeURIComponent(message);

      // Step 5: Delay then redirect
      setTimeout(() => {
        // Show success state (visible when user returns)
        if (ctaSuccess) {
          ctaForm.style.display = 'none';
          ctaSuccess.classList.add('show');
        }

        // Redirect to WhatsApp
        window.open(waURL, '_blank');

        // Reset button
        ctaSubmitBtn.disabled = false;
        ctaSubmitBtn.classList.remove('loading');
        ctaSubmitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  // --- Real-time: Clear errors on input ---
  document.querySelectorAll('.lead-form input').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

  document.querySelectorAll('.lead-form select').forEach(select => {
    select.addEventListener('change', () => {
      select.closest('.form-group').classList.remove('error');
    });
  });

  // ==============================
  // 13. BACK TO TOP
  // ==============================
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==============================
  // 14. PARALLAX HERO
  // ==============================
  const heroBgImg = document.getElementById('heroBgImg');

  function handleParallax() {
    if (window.innerWidth > 768 && heroBgImg) {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      heroBgImg.style.transform = `scale(1.05) translateY(${rate}px)`;
    }
  }

  // ==============================
  // 15. INITIAL CALLS
  // ==============================
  updateScrollProgress();
  handleNavbarScroll();
  handleBackToTop();
  // ==============================
  // 9. SPECS ACCORDION
  // ==============================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current accordion
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
