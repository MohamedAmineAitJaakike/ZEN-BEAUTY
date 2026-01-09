'use strict';

/* =========================================================
   Zen & Beauté SPA - main.js (robuste / production)
   Compatible avec TON HTML (IDs/classes exacts)
   ========================================================= */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    cursorEnabled: false,
    menuOpen: false,
    lightbox: null,
    rafId: null,
  };

  const els = {
    // Cursor
    cursor: $('#cursor'),
    cursorFollower: $('#cursor-follower'),

    // Preloader
    preloader: $('#preloader'),

    // Header / Nav
    header: $('#header'),
    navToggle: $('#nav-toggle'),
    navMobile: $('#nav-mobile'),
    navLinks: $$('.nav__link'),
    navMobileLinks: $$('.nav__mobile-link'),
    sections: $$('section[id]'),

    // Video
    heroVideo: $('#hero-video'),
    heroFallback: $('.hero__bg-fallback'),

    // Services filter
    serviceTabs: $$('.services__tab'),
    serviceCards: $$('.service-card'),

    // Gallery filter
    galleryBtns: $$('.gallery__filter-btn'),
    galleryItems: $$('.gallery__item'),

    // Slider
    testimonialsSlider: $('.testimonials__slider'),
    testimonialsPrev: $('.testimonials__nav-prev'),
    testimonialsNext: $('.testimonials__nav-next'),
    testimonialsPagination: $('.testimonials__pagination'),

    // Stats
    heroStats: $$('.hero__stat-number'),

    // Form
    contactForm: $('#contact-form'),

    // Scroll top
    scrollTopBtn: $('#scroll-top'),

    // Marquee
    marqueeContent: $('.marquee__content'),
  };

  /* -----------------------------
     Helpers
  ------------------------------ */
  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function setNoScroll(on) {
    document.body.classList.toggle('no-scroll', !!on);
  }

  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    const headerH = els.header ? els.header.offsetHeight : 70;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function showEl(el) {
    if (!el) return;
    el.style.display = '';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    });
  }

  function hideEl(el) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.92)';
    setTimeout(() => {
      el.style.display = 'none';
    }, 280);
  }

  /* =========================================================
     1) PRELOADER
  ========================================================= */
  function initPreloader() {
    if (!els.preloader) return;
    setNoScroll(true);

    const hide = () => {
      els.preloader.classList.add('hidden');
      setNoScroll(false);
      setTimeout(() => {
        els.preloader.style.display = 'none';
      }, 600);
    };

    window.addEventListener('load', () => {
      // petit délai premium
      setTimeout(hide, 900);
    });

    // fallback sécurité
    setTimeout(() => {
      if (els.preloader.style.display !== 'none') hide();
    }, 4500);
  }

  /* =========================================================
     2) CURSOR (corrigé + fiable)
     Cause fréquente chez toi: détection device / media query.
     Ici on active si pointer = fine ET hover = hover.
  ========================================================= */
  function initCursor() {
    if (!els.cursor || !els.cursorFollower) return;

    const canUseCursor =
      window.matchMedia('(pointer: fine)').matches &&
      window.matchMedia('(hover: hover)').matches;

    state.cursorEnabled = canUseCursor;

    if (!canUseCursor) {
      // Sur mobile/tactile: on cache proprement
      els.cursor.style.display = 'none';
      els.cursorFollower.style.display = 'none';
      return;
    }

    // IMPORTANT: on force visible (au cas où un ancien CSS le cache)
    els.cursor.style.display = 'block';
    els.cursorFollower.style.display = 'block';
    els.cursor.style.opacity = '1';
    els.cursorFollower.style.opacity = '0.6';

    // Position initiale (centre) pour ne pas être “invisible” au début
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let curX = mouseX, curY = mouseY;
    let folX = mouseX, folY = mouseY;

    // Suivi souris
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Animation fluide
    const animate = () => {
      // curseur principal
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      els.cursor.style.left = curX + 'px';
      els.cursor.style.top = curY + 'px';

      // follower
      folX += (mouseX - folX) * 0.12;
      folY += (mouseY - folY) * 0.12;
      els.cursorFollower.style.left = folX + 'px';
      els.cursorFollower.style.top = folY + 'px';

      state.rafId = requestAnimationFrame(animate);
    };
    animate();

    // Hover detection (délégation -> plus fiable)
    const hoverSelector =
      'a, button, input, textarea, select, .btn, .service-card, .gallery__item, .pricing-card, .testimonial-card';

    document.addEventListener('pointerover', (e) => {
      if (!state.cursorEnabled) return;
      const hit = e.target.closest(hoverSelector);
      if (hit) {
        els.cursor.classList.add('hover');
        els.cursorFollower.classList.add('hover');
      }
    });

    document.addEventListener('pointerout', (e) => {
      if (!state.cursorEnabled) return;
      const hit = e.target.closest(hoverSelector);
      if (hit) {
        els.cursor.classList.remove('hover');
        els.cursorFollower.classList.remove('hover');
      }
    });

    // Click effect
    document.addEventListener('pointerdown', () => {
      if (!state.cursorEnabled) return;
      els.cursor.classList.add('click');
      setTimeout(() => els.cursor.classList.remove('click'), 120);
    });

    // Hide on window blur / show on focus
    window.addEventListener('blur', () => {
      if (!state.cursorEnabled) return;
      els.cursor.style.opacity = '0';
      els.cursorFollower.style.opacity = '0';
    });

    window.addEventListener('focus', () => {
      if (!state.cursorEnabled) return;
      els.cursor.style.opacity = '1';
      els.cursorFollower.style.opacity = '0.6';
    });

    // Si tu redimensionnes: on re-check (cas “normal size”)
    window.addEventListener('resize', debounce(() => {
      const stillOk =
        window.matchMedia('(pointer: fine)').matches &&
        window.matchMedia('(hover: hover)').matches;

      if (!stillOk) {
        els.cursor.style.display = 'none';
        els.cursorFollower.style.display = 'none';
        state.cursorEnabled = false;
      } else {
        els.cursor.style.display = 'block';
        els.cursorFollower.style.display = 'block';
        state.cursorEnabled = true;
      }
    }, 150));
  }

  /* =========================================================
     3) HEADER + MENU MOBILE + LIEN ACTIF
  ========================================================= */
  function initNav() {
    if (!els.header) return;

    // Scroll header shadow
    window.addEventListener('scroll', () => {
      els.header.classList.toggle('scrolled', window.scrollY > 20);
      // Scroll top button
      if (els.scrollTopBtn) {
        els.scrollTopBtn.classList.toggle('visible', window.scrollY > 450);
      }
    }, { passive: true });

    // Mobile toggle
    if (els.navToggle && els.navMobile) {
      els.navToggle.addEventListener('click', () => {
        state.menuOpen = !state.menuOpen;
        els.navToggle.classList.toggle('active', state.menuOpen);
        els.navMobile.classList.toggle('active', state.menuOpen);
        setNoScroll(state.menuOpen);
      });
    }

    // Close on link click
    const closeMenu = () => {
      state.menuOpen = false;
      els.navToggle?.classList.remove('active');
      els.navMobile?.classList.remove('active');
      setNoScroll(false);
    };

    [...els.navLinks, ...els.navMobileLinks].forEach((a) => {
      a.addEventListener('click', () => {
        if (state.menuOpen) closeMenu();
      });
    });

    // Escape close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.menuOpen) closeMenu();
    });

    // Active link on section view
    if (!('IntersectionObserver' in window) || els.sections.length === 0) return;

    const allLinks = [...els.navLinks, ...els.navMobileLinks];
    const setActive = (id) => {
      allLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    };

    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          break;
        }
      }
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    els.sections.forEach((sec) => obs.observe(sec));
  }

  /* =========================================================
     4) SMOOTH SCROLL
  ========================================================= */
  function initSmoothScroll() {
    const anchors = $$('a[href^="#"]');
    anchors.forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(target);
      });
    });

    if (els.scrollTopBtn) {
      els.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* =========================================================
     5) VIDEO HERO (fix: fallback ne doit pas cacher la vidéo)
  ========================================================= */
  function initHeroVideo() {
    if (!els.heroVideo || !els.heroFallback) return;

    // Par défaut: on montre le fallback le temps que la vidéo soit prête
    els.heroFallback.style.opacity = '1';
    els.heroFallback.style.visibility = 'visible';
    els.heroFallback.style.pointerEvents = 'none';

    // Assurer que la vidéo est au-dessus si elle joue
    els.heroVideo.style.opacity = '0';

    const enableVideo = () => {
      els.heroVideo.style.opacity = '1';
      els.heroFallback.style.opacity = '0';
      els.heroFallback.style.visibility = 'hidden';
    };

    const fallbackOnly = () => {
      els.heroVideo.style.opacity = '0';
      els.heroVideo.style.display = 'none';
      els.heroFallback.style.opacity = '1';
      els.heroFallback.style.visibility = 'visible';
    };

    els.heroVideo.addEventListener('canplay', () => {
      enableVideo();
      const p = els.heroVideo.play();
      if (p && typeof p.catch === 'function') p.catch(() => fallbackOnly());
    });

    els.heroVideo.addEventListener('error', () => fallbackOnly());

    // Si au bout de 2s rien ne se passe, on garde fallback (sécurité)
    setTimeout(() => {
      // readyState >= 3 => can play
      if (els.heroVideo.readyState >= 3) enableVideo();
    }, 2000);
  }

  /* =========================================================
     6) AOS
  ========================================================= */
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 90,
      delay: 60,
    });
  }

  /* =========================================================
     7) SWIPER (testimonials)
  ========================================================= */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!els.testimonialsSlider) return;

    new Swiper('.testimonials__slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 650,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.testimonials__pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.testimonials__nav-next',
        prevEl: '.testimonials__nav-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 22 },
        1024: { slidesPerView: 3, spaceBetween: 26 },
      },
    });
  }

  /* =========================================================
     8) GLIGHTBOX (gallery)
  ========================================================= */
  function initLightbox() {
    if (typeof GLightbox === 'undefined') return;
    state.lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      closeOnOutsideClick: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
    });
  }

  /* =========================================================
     9) FILTER SERVICES
  ========================================================= */
  function initServiceFilter() {
    if (els.serviceTabs.length === 0 || els.serviceCards.length === 0) return;

    els.serviceTabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        els.serviceTabs.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter || 'all';

        els.serviceCards.forEach((card) => {
          const cat = card.dataset.category || '';
          if (filter === 'all' || cat === filter) showEl(card);
          else hideEl(card);
        });
      });
    });
  }

  /* =========================================================
     10) FILTER GALLERY + refresh lightbox
  ========================================================= */
  function initGalleryFilter() {
    if (els.galleryBtns.length === 0 || els.galleryItems.length === 0) return;

    els.galleryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        els.galleryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter || 'all';

        els.galleryItems.forEach((item) => {
          const cat = item.dataset.category || '';
          if (filter === 'all' || cat === filter) showEl(item);
          else hideEl(item);
        });

        // refresh lightbox après animation
        setTimeout(() => {
          if (state.lightbox && typeof state.lightbox.reload === 'function') {
            state.lightbox.reload();
          }
        }, 350);
      });
    });
  }

  /* =========================================================
     11) HERO STATS COUNTUP
  ========================================================= */
  function initStatsCount() {
    if (els.heroStats.length === 0) return;
    if (!('IntersectionObserver' in window)) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count || '0', 10);
      if (!Number.isFinite(target) || target <= 0) return;

      const duration = 1600; // ms
      const start = performance.now();
      const from = 0;

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(from + (target - from) * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    els.heroStats.forEach((s) => obs.observe(s));
  }

  /* =========================================================
     12) CONTACT FORM (simple + propre)
  ========================================================= */
  function initContactForm() {
    if (!els.contactForm) return;

    const showMessage = (type, text) => {
      const existing = els.contactForm.querySelector('.form-message');
      if (existing) existing.remove();

      const div = document.createElement('div');
      div.className = `form-message form-message--${type}`;
      div.textContent = text;
      els.contactForm.insertBefore(div, els.contactForm.firstChild);

      setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
      }, 4500);
    };

    const validate = () => {
      let ok = true;
      const required = $$('[required]', els.contactForm);

      required.forEach((field) => {
        if (!field.value || !field.value.trim()) {
          ok = false;
          field.style.borderColor = '#dc3545';
          field.addEventListener('input', () => (field.style.borderColor = ''), { once: true });
        }
      });

      const email = els.contactForm.querySelector('input[type="email"]');
      if (email && email.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.value)) {
          ok = false;
          email.style.borderColor = '#dc3545';
        }
      }

      return ok;
    };

    els.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = els.contactForm.querySelector('button[type="submit"]');
      const oldHTML = submitBtn ? submitBtn.innerHTML : '';

      if (!validate()) {
        showMessage('error', 'Veuillez remplir correctement les champs obligatoires.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi...</span>';
      }

      // Ici tu peux remplacer par EmailJS / Formspree plus tard
      await new Promise((r) => setTimeout(r, 900));

      showMessage('success', '✅ Message envoyé ! Nous vous contacterons bientôt.');
      els.contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldHTML;
      }
    });
  }

  /* =========================================================
     13) MARQUEE (duplication pour boucle parfaite)
  ========================================================= */
  function initMarquee() {
    if (!els.marqueeContent) return;
    if (els.marqueeContent.dataset.duplicated === '1') return;

    els.marqueeContent.dataset.duplicated = '1';
    els.marqueeContent.innerHTML = els.marqueeContent.innerHTML + els.marqueeContent.innerHTML;
  }

  /* =========================================================
     INIT
  ========================================================= */
  function init() {
    initPreloader();
    initCursor();
    initNav();
    initSmoothScroll();
    initHeroVideo();
    initAOS();
    initSwiper();
    initLightbox();
    initServiceFilter();
    initGalleryFilter();
    initStatsCount();
    initContactForm();
    initMarquee();
  }
  

  document.addEventListener('DOMContentLoaded', init);
})();

/* =========================================================
   RESERVATION: EmailJS (owner + client) + WhatsApp
   ========================================================= */
(function () {
  // Vérifie que EmailJS est bien chargé
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS SDK non chargé. Vérifie le script CDN EmailJS dans le HTML.");
    return;
  }

  // 1) CONFIG EMAILJS
  const EMAILJS_PUBLIC_KEY = "i71kBnzen70lnKZNu";
  const EMAILJS_SERVICE_ID = "service_gokzoho";

  const TEMPLATE_OWNER_ID  = "template_5ns868r";
  const TEMPLATE_CLIENT_ID = "template_140mrke";

  // 2) PROPRIETAIRE
  const OWNER_EMAIL = "aitjaakikemohamedamine@gmail.com";
  const OWNER_WHATSAPP_NUMBER = "212704831881"; // sans +

  // Init EmailJS
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form = document.getElementById("contact-form");
  if (!form) return;

  // Si tu n’as pas d’id="submit-btn", on prend le bouton submit du form
  const submitBtn =
    document.getElementById("submit-btn") || form.querySelector('button[type="submit"]');

  const safe = (v) => (v ?? "").toString().trim();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // remove() fallback
  const safeRemove = (el) => {
    if (!el) return;
    if (typeof el.remove === "function") el.remove();
    else if (el.parentNode) el.parentNode.removeChild(el);
  };

  function buildWhatsAppText(d) {
    return [
      "السلام عليكم",
      "Nouvelle réservation - Zen & Beauté SPA",
      "— — — — —",
      `Nom: ${d.name}`,
      `Téléphone: ${d.phone}`,
      `Email: ${d.email}`,
      `Service: ${d.service}`,
      `Date: ${d.date || "-"}`,
      `Heure: ${d.time || "-"}`,
      "— — — — —",
      `Message: ${d.message}`,
      "",
      "Merci.",
    ].join("\n");
  }

  function showMessage(type, text, waUrl) {
    const old = form.querySelector(".form-message");
    safeRemove(old);

    const box = document.createElement("div");
    box.className = `form-message form-message--${type}`;
    box.textContent = text;

    if (waUrl) {
      const a = document.createElement("a");
      a.href = waUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "btn btn--whatsapp btn--lg";
      a.style.marginTop = "12px";
      a.innerHTML = "<span>Ouvrir WhatsApp</span>";
      box.appendChild(document.createElement("br"));
      box.appendChild(a);
    }

    form.insertBefore(box, form.firstChild);

    setTimeout(() => {
      box.style.opacity = "0";
      setTimeout(() => safeRemove(box), 300);
    }, 8000);
  }

  function lockButton(locked) {
    if (!submitBtn) return;
    submitBtn.disabled = locked;
    submitBtn.style.opacity = locked ? "0.85" : "1";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot anti-spam (si tu as bien ce champ dans le form)
    const bot = safe(form.querySelector('input[name="bot_field"]')?.value);
    if (bot) return;

    // Récupération des champs (compatibles avec ton form)
    const data = {
      name: safe(form.querySelector('[name="name"]')?.value),
      phone: safe(form.querySelector('[name="phone"]')?.value),
      email: safe(form.querySelector('[name="email"]')?.value),
      service: safe(form.querySelector('[name="service"]')?.value),
      date: safe(form.querySelector('[name="date"]')?.value),
      time: safe(form.querySelector('[name="time"]')?.value),
      message: safe(form.querySelector('[name="message"]')?.value),
      send_whatsapp: !!form.querySelector('[name="send_whatsapp"]')?.checked,
    };

    // Validation
    if (!data.name || !data.phone || !data.email || !data.service || !data.message) {
      showMessage("error", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!isValidEmail(data.email)) {
      showMessage("error", "Veuillez entrer un email valide.");
      return;
    }

    // WhatsApp URL
    const waText = buildWhatsAppText(data);
    const waUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Pop-up blocker trick
    let waWin = null;
    if (data.send_whatsapp) {
      waWin = window.open("about:blank", "_blank");
    }

    lockButton(true);

    // ✅ Paramètres communs
    const baseParams = {
      spa_name: "Zen & Beauté SPA",
      spa_city: "Tétouan",

      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      date: data.date || "-",
      time: data.time || "-",
      message: data.message,

      client_name: data.name,
      client_email: data.email,

      whatsapp_link: waUrl,
      owner_whatsapp: `+${OWNER_WHATSAPP_NUMBER}`,
    };

    // ✅ 1) Paramètres OWNER
    const ownerParams = {
      ...baseParams,
      to_email: OWNER_EMAIL, // owner reçoit ici
    };

    // ✅ 2) Paramètres CLIENT
    const clientParams = {
      ...baseParams,
      to_email: data.email, // client reçoit ici
    };

    try {
      // 1) Email propriétaire
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_OWNER_ID, ownerParams);

      // 2) Email client
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_CLIENT_ID, clientParams);

      form.reset();

      if (waWin && data.send_whatsapp) {
        waWin.location.href = waUrl;
      }

      showMessage(
        "success",
        "✅ Réservation envoyée. Un email de confirmation a été envoyé au client.",
        data.send_whatsapp ? waUrl : null
      );
    } catch (err) {
      if (waWin) waWin.close();
      showMessage(
        "error",
        "❌ Envoi email échoué. Vous pouvez envoyer la réservation via WhatsApp :",
        waUrl
      );
      console.error("EmailJS error:", err);
    } finally {
      lockButton(false);
    }
  });
})();