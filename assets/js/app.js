/* ============================================
   APP.JS - SCRIPT PRINCIPAL SPA TÉTOUAN
   ============================================ */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialiser toutes les fonctionnalités
  initPreloader();
  initNavbar();
  initSmoothScroll();
  initScrollAnimations();
  initScrollTop();
  initGallery();
  initSliders();
  initForms();
  initCounters();
  
  console.log('🧖‍♀️ SPA Tétouan - Site initialisé avec succès!');
});

/* ========================================
   PRELOADER
   ======================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
        
        // Supprimer le preloader après l'animation
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    });
  }
}

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMobile = document.querySelector('.navbar-mobile');
  const navLinks = document.querySelectorAll('.navbar-nav a, .navbar-mobile a');
  
  if (!navbar) return;
  
  // Scroll Effect
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/Remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
    
    // Hide/Show on scroll direction (optional)
    // if (currentScroll > lastScroll && currentScroll > 500) {
    //   navbar.style.transform = 'translateY(-100%)';
    // } else {
    //   navbar.style.transform = 'translateY(0)';
    // }
    
    lastScroll = currentScroll;
  });
  
  // Mobile Toggle
  if (navbarToggle && navbarMobile) {
    navbarToggle.addEventListener('click', () => {
      navbarToggle.classList.toggle('active');
      navbarMobile.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Active Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarMobile && navbarMobile.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        navbarMobile.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ========================================
   SCROLL ANIMATIONS (AOS Alternative)
   ======================================== */
function initScrollAnimations() {
  // Utiliser AOS si disponible
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 100
    });
    return;
  }
  
  // Fallback - Animation personnalisée
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ========================================
   SCROLL TO TOP
   ======================================== */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========================================
   GALLERY
   ======================================== */
function initGallery() {
  // Filter
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Filter items
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // GLightbox
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.gallery-item',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }
}

/* ========================================
   SLIDERS / CAROUSELS
   ======================================== */
function initSliders() {
  // Testimonials Slider
  if (typeof Swiper !== 'undefined') {
    // Testimonials
    const testimonialsSlider = new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.testimonials-dots',
        clickable: true,
        bulletClass: 'testimonials-dot',
        bulletActiveClass: 'active'
      },
      navigation: {
        nextEl: '.testimonials-nav-next',
        prevEl: '.testimonials-nav-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    });
    
    // Gallery Carousel
    const galleryCarousel = new Swiper('.gallery-carousel', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.gallery-nav-next',
        prevEl: '.gallery-nav-prev'
      }
    });
    
    // Hero Slider (if exists)
    const heroSlider = new Swiper('.hero-slider', {
      slidesPerView: 1,
      effect: 'fade',
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true
      }
    });
  }
}

/* ========================================
   FORMS
   ======================================== */
function initForms() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const messageEl = document.querySelector('.form-message');
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Envoi en cours...';
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call (replace with actual endpoint)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      if (messageEl) {
        messageEl.className = 'form-message success';
        messageEl.textContent = '✅ Message envoyé avec succès! Nous vous contacterons bientôt.';
        messageEl.style.display = 'block';
      }
      
      contactForm.reset();
      
    } catch (error) {
      // Error
      if (messageEl) {
        messageEl.className = 'form-message error';
        messageEl.textContent = '❌ Une erreur est survenue. Veuillez réessayer.';
        messageEl.style.display = 'block';
      }
    }
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Hide message after 5 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }, 5000);
  });
  
  // Input animations
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });
}

/* ========================================
   COUNTERS
   ======================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (counters.length === 0) return;
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}