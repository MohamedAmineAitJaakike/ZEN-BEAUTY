/* ============================================
   DATA-LOADER.JS - CHARGEMENT DES DONNÉES JSON
   ============================================ */

class DataLoader {
  constructor() {
    this.config = null;
    this.services = null;
    this.pricing = null;
    this.testimonials = null;
    this.gallery = null;
  }
  
  // Charger un fichier JSON
  async loadJSON(file) {
    try {
      const response = await fetch(`data/${file}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors du chargement de ${file}:`, error);
      return null;
    }
  }
  
  // Charger toutes les données
  async loadAll() {
    try {
      const [config, services, pricing, testimonials, gallery] = await Promise.all([
        this.loadJSON('config.json'),
        this.loadJSON('services.json'),
        this.loadJSON('pricing.json'),
        this.loadJSON('testimonials.json'),
        this.loadJSON('gallery.json')
      ]);
      
      this.config = config;
      this.services = services;
      this.pricing = pricing;
      this.testimonials = testimonials;
      this.gallery = gallery;
      
      return {
        config,
        services,
        pricing,
        testimonials,
        gallery
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return null;
    }
  }
  
  // Appliquer la configuration
  applyConfig(config) {
    if (!config) return;
    
    // Mettre à jour le titre de la page
    document.title = `${config.spa.name} | ${config.spa.slogan}`;
    
    // Mettre à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.spa.description);
    }
    
    // Mettre à jour le logo
    const logos = document.querySelectorAll('.navbar-logo img, .footer-logo img');
    logos.forEach(logo => {
      if (logo.classList.contains('logo-white')) {
        logo.src = config.spa.logoWhite;
      } else {
        logo.src = config.spa.logo;
      }
    });
    
    // Mettre à jour le nom du SPA
    const spaNames = document.querySelectorAll('[data-spa-name]');
    spaNames.forEach(el => {
      el.textContent = config.spa.name;
    });
    
    // Mettre à jour le slogan
    const slogans = document.querySelectorAll('[data-slogan]');
    slogans.forEach(el => {
      el.textContent = config.spa.slogan;
    });
    
    // Mettre à jour les coordonnées
    const phones = document.querySelectorAll('[data-phone]');
    phones.forEach(el => {
      el.textContent = config.contact.phone;
      if (el.tagName === 'A') {
        el.href = `tel:${config.contact.phone.replace(/\s/g, '')}`;
      }
    });
    
    const whatsapps = document.querySelectorAll('[data-whatsapp]');
    whatsapps.forEach(el => {
      el.href = config.social.whatsappLink;
    });
    
    const emails = document.querySelectorAll('[data-email]');
    emails.forEach(el => {
      el.textContent = config.contact.email;
      if (el.tagName === 'A') {
        el.href = `mailto:${config.contact.email}`;
      }
    });
    
    const addresses = document.querySelectorAll('[data-address]');
    addresses.forEach(el => {
      el.textContent = config.contact.address;
    });
    
    // Mettre à jour les liens sociaux
    const facebookLinks = document.querySelectorAll('[data-social="facebook"]');
    facebookLinks.forEach(el => {
      el.href = config.social.facebook;
    });
    
    const instagramLinks = document.querySelectorAll('[data-social="instagram"]');
    instagramLinks.forEach(el => {
      el.href = config.social.instagram;
    });
    
    const tiktokLinks = document.querySelectorAll('[data-social="tiktok"]');
    tiktokLinks.forEach(el => {
      el.href = config.social.tiktok;
    });
    
    // Appliquer les couleurs personnalisées
    if (config.theme) {
      document.documentElement.style.setProperty('--color-primary', config.theme.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', config.theme.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', config.theme.accentColor);
    }
    
    console.log('✅ Configuration appliquée');
  }
  
  // Générer les services
  renderServices(services, container) {
    if (!services || !container) return;
    
    let html = '';
    
    services.categories.forEach(category => {
      category.services.forEach(service => {
        html += `
          <div class="service-card" data-aos="fade-up" data-category="${category.id}">
            ${service.popular ? '<span class="service-card-badge">Populaire</span>' : ''}
            <div class="service-card-image">
              <img src="${service.image}" alt="${service.name}" loading="lazy">
              <div class="service-card-overlay"></div>
            </div>
            <div class="service-card-content">
              <span class="service-card-category">${category.name}</span>
              <h3 class="service-card-title">${service.name}</h3>
              <p class="service-card-description">${service.description}</p>
              <div class="service-card-footer">
                <span class="service-card-price">${service.price} <span>MAD</span></span>
                <span class="service-card-duration">
                  <i class="icon-clock"></i> ${service.duration}
                </span>
              </div>
            </div>
            <a href="#contact" class="service-card-link">
              <i class="icon-arrow-right"></i>
            </a>
          </div>
        `;
      });
    });
    
    container.innerHTML = html;
    console.log('✅ Services rendus');
  }
  
  // Générer les tarifs
  renderPricing(pricing, container) {
    if (!pricing || !container) return;
    
    let html = '';
    
    pricing.packs.forEach(pack => {
      html += `
        <div class="pricing-card ${pack.popular ? 'popular' : ''}" data-aos="fade-up">
          ${pack.popular ? '<span class="pricing-badge">Le Plus Populaire</span>' : ''}
          <div class="pricing-card-icon">
            <i class="icon-${pack.icon}"></i>
          </div>
          <span class="pricing-card-subtitle">${pack.subtitle}</span>
          <h3 class="pricing-card-title">${pack.name}</h3>
          <p class="pricing-card-description">${pack.description}</p>
          <div class="pricing-card-pricing">
            <span class="pricing-card-price">${pack.price} <span>MAD</span></span>
            ${pack.originalPrice ? `<span class="pricing-card-original">${pack.originalPrice} MAD</span>` : ''}
            ${pack.discount ? `<span class="pricing-card-discount">-${pack.discount}%</span>` : ''}
            <p class="pricing-card-duration">Durée: ${pack.duration}</p>
          </div>
          <ul class="pricing-features">
            ${pack.includes.map(item => `
              <li class="pricing-feature">
                <span class="pricing-feature-icon">✓</span>
                ${item}
              </li>
            `).join('')}
          </ul>
          <a href="#contact" class="btn ${pack.popular ? 'btn-primary' : 'btn-outline'}">
            Réserver
          </a>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log('✅ Tarifs rendus');
  }
  
  // Générer les témoignages
  renderTestimonials(testimonials, container) {
    if (!testimonials || !container) return;
    
    let html = '';
    
    testimonials.testimonials.forEach(testimonial => {
      html += `
        <div class="swiper-slide">
          <div class="testimonial-card">
            <div class="testimonial-quote">"</div>
            <div class="testimonial-rating">
              ${this.generateStars(testimonial.rating)}
            </div>
            <p class="testimonial-comment">${testimonial.comment}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar-initials">${testimonial.initial}</div>
              <div class="testimonial-author-info">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.service}</p>
                ${testimonial.verified ? '<span class="testimonial-verified">✓ Vérifié</span>' : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log('✅ Témoignages rendus');
  }
  
  // Générer les étoiles
  generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="testimonial-star ${i > rating ? 'empty' : ''}">★</span>`;
    }
    return stars;
  }
  
  // Générer la galerie
  renderGallery(gallery, container) {
    if (!gallery || !container) return;
    
    let html = '';
    
    gallery.images.forEach(image => {
      html += `
        <a href="${image.src}" class="gallery-item glightbox" data-category="${image.category}" data-glightbox="title: ${image.title}">
          <img src="${image.thumb || image.src}" alt="${image.alt}" loading="lazy">
          <div class="gallery-item-overlay">
            <h4 class="gallery-item-title">${image.title}</h4>
            <span class="gallery-item-category">${image.category}</span>
          </div>
          <div class="gallery-item-zoom">
            <i class="icon-zoom-in"></i>
          </div>
        </a>
      `;
    });
    
    container.innerHTML = html;
    console.log('✅ Galerie rendue');
  }
}

// Instance globale
const dataLoader = new DataLoader();

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', async () => {
  const data = await dataLoader.loadAll();
  
  if (data) {
    // Appliquer la configuration
    dataLoader.applyConfig(data.config);
    
    // Rendre les sections dynamiques
    const servicesContainer = document.querySelector('.services-grid');
    if (servicesContainer) {
      dataLoader.renderServices(data.services, servicesContainer);
    }
    
    const pricingContainer = document.querySelector('.pricing-grid');
    if (pricingContainer) {
      dataLoader.renderPricing(data.pricing, pricingContainer);
    }
    
    const testimonialsContainer = document.querySelector('.testimonials-slider .swiper-wrapper');
    if (testimonialsContainer) {
      dataLoader.renderTestimonials(data.testimonials, testimonialsContainer);
    }
    
    const galleryContainer = document.querySelector('.gallery-grid');
    if (galleryContainer) {
      dataLoader.renderGallery(data.gallery, galleryContainer);
    }
    
    // Réinitialiser AOS après le rendu
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // Réinitialiser les sliders
    if (typeof Swiper !== 'undefined') {
      initSliders();
    }
  }
});