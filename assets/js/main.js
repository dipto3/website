/**
 * RM Fashion BD - Modern Interactive Core Scripts
 * Handles Navigation, Hero Slider, Specialty Carousel, Mobile Drawer,
 * Animated Counters, Product Filters, Modals, RFQ Calculator, and Toast Alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroSlider();
  initMobileProductSlider();
  initSpecialtyCarousel();
  initAnimatedCounters();
  initProductCatalog();
  initQuickViewModal();
  initRfqCalculator();
  initContactForms();
});

/* ----------------------------------------------------
 * 1. NAVBAR SCROLL EFFECT
 * ---------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const onScroll = () => {
    const isScrolled = window.scrollY > 20;
    if (header) {
      header.classList.toggle('header-scrolled', isScrolled);
    }
    navbar.classList.toggle('glass-nav-scrolled', isScrolled);
    if (isScrolled) {
      navbar.classList.remove('py-3.5', 'py-4');
      navbar.classList.add('py-2.5');
    } else {
      navbar.classList.remove('py-2.5');
      navbar.classList.add('py-3.5');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------
 * 2. MOBILE MENU DRAWER
 * ---------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');

  if (!openBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------
 * 3. HERO BANNER CONCEPT SLIDER & BACKGROUND VIDEO
 * ---------------------------------------------------- */
let currentHeroIndex = 0;
let heroSlideTimer = null;

window.goToHeroSlide = function(index) {
  const slides = document.querySelectorAll('.hero-concept-slide');
  if (!slides.length) return;
  const total = slides.length;
  currentHeroIndex = (index + total) % total;

  // Update Slides visibility & class
  slides.forEach((slide, idx) => {
    if (idx === currentHeroIndex) {
      slide.classList.remove('inactive-slide');
      slide.classList.add('active-slide');
    } else {
      slide.classList.remove('active-slide');
      slide.classList.add('inactive-slide');
    }
  });

  // Update Dots
  const dots = document.querySelectorAll('#hero-dots button');
  dots.forEach((dot, idx) => {
    if (idx === currentHeroIndex) {
      dot.className = 'h-2.5 rounded-full transition-all duration-300 cursor-pointer bg-lime-400 w-8';
    } else {
      dot.className = 'h-2.5 rounded-full transition-all duration-300 cursor-pointer bg-white/40 hover:bg-white/70 w-2.5';
    }
  });

  // Update Counter
  const counterEl = document.getElementById('hero-counter');
  if (counterEl) {
    const curFormatted = String(currentHeroIndex + 1).padStart(2, '0');
    const totFormatted = String(total).padStart(2, '0');
    counterEl.textContent = `${curFormatted} / ${totFormatted}`;
  }

  // Update Progress Fill
  const progressFill = document.getElementById('hero-progress-fill');
  if (progressFill) {
    const pct = ((currentHeroIndex + 1) / total) * 100;
    progressFill.style.width = `${pct}%`;
  }
};

window.nextHeroSlide = function() {
  const slides = document.querySelectorAll('.hero-concept-slide');
  if (!slides.length) return;
  window.goToHeroSlide(currentHeroIndex + 1);
};

window.prevHeroSlide = function() {
  const slides = document.querySelectorAll('.hero-concept-slide');
  if (!slides.length) return;
  window.goToHeroSlide(currentHeroIndex - 1);
};

function initHeroSlider() {
  const slidesWrapper = document.getElementById('hero-slides-wrapper');
  const slides = document.querySelectorAll('.hero-concept-slide');
  if (!slides.length) return;

  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const video = document.getElementById('hero-bg-video');

  // Video Autoplay policy handling
  if (video) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay restricted: fallback poster image remains visible
      });
    }
  }

  function startHeroTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
      window.nextHeroSlide();
    }, 5500);
  }

  function restartHeroTimer() {
    clearInterval(heroSlideTimer);
    startHeroTimer();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.nextHeroSlide();
      restartHeroTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.prevHeroSlide();
      restartHeroTimer();
    });
  }

  // Mouse hover pause on hero section
  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(heroSlideTimer));
    heroSection.addEventListener('mouseleave', startHeroTimer);
  }

  // Touch Swipe Support for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      clearInterval(heroSlideTimer);
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          window.nextHeroSlide();
        } else {
          window.prevHeroSlide();
        }
      }
      startHeroTimer();
    }, { passive: true });
  }

  // Keyboard navigation when in viewport
  document.addEventListener('keydown', (e) => {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') {
        window.nextHeroSlide();
        restartHeroTimer();
      } else if (e.key === 'ArrowLeft') {
        window.prevHeroSlide();
        restartHeroTimer();
      }
    }
  });

  // Initial display
  window.goToHeroSlide(0);
  startHeroTimer();
}

/* ----------------------------------------------------
 * MOBILE EXCLUSIVE PURE PRODUCT IMAGE SLIDER
 * ---------------------------------------------------- */
function initMobileProductSlider() {
  const container = document.getElementById('mobile-product-slider');
  if (!container) return;

  const slides = container.querySelectorAll('.mobile-product-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  const prevBtn = document.getElementById('mobile-slider-prev');
  const nextBtn = document.getElementById('mobile-slider-next');
  const dots = document.querySelectorAll('#mobile-slider-dots .mobile-slider-dot');
  const counterEl = document.getElementById('mobile-slider-counter');

  let currentIndex = 0;
  let autoSlideTimer = null;
  let startX = 0;

  function showSlide(idx) {
    currentIndex = (idx + totalSlides) % totalSlides;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.style.opacity = '1';
        slide.style.zIndex = '10';
        slide.style.pointerEvents = 'auto';
        slide.style.transform = 'scale(1)';
      } else {
        slide.style.opacity = '0';
        slide.style.zIndex = '1';
        slide.style.pointerEvents = 'none';
        slide.style.transform = 'scale(1.03)';
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.className = 'mobile-slider-dot active';
      } else {
        dot.className = 'mobile-slider-dot inactive';
      }
    });

    if (counterEl) {
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoSlideTimer = setInterval(nextSlide, 3200);
  }

  function stopAutoPlay() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      showSlide(idx);
      startAutoPlay();
    });
  });

  // Touch swipe support for mobile
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  }, { passive: true });

  showSlide(0);
  startAutoPlay();
}

/* ----------------------------------------------------
 * 4. SPECIALTY SLIDING PRODUCT IMAGE CAROUSEL
 * ---------------------------------------------------- */
function initSpecialtyCarousel() {
  const container = document.getElementById('specialty-carousel');
  if (!container) return;

  const slides = container.querySelectorAll('.specialty-slide');
  const prevBtn = document.getElementById('spec-carousel-prev');
  const nextBtn = document.getElementById('spec-carousel-next');
  const dotsContainer = document.getElementById('spec-carousel-dots');

  if (!slides.length) return;
  let currentIdx = 0;
  let carouselTimer = null;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `w-2 h-2 rounded-full transition-all ${
        i === 0 ? 'bg-lime-500 w-6' : 'bg-slate-300 hover:bg-slate-400'
      }`;
      dot.addEventListener('click', () => {
        goTo(i);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function update() {
    slides.forEach((slide, i) => {
      if (i === currentIdx) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((d, i) => {
        if (i === currentIdx) {
          d.className = 'w-6 h-2 rounded-full bg-lime-500 transition-all';
        } else {
          d.className = 'w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 transition-all';
        }
      });
    }
  }

  function goTo(i) {
    currentIdx = (i + slides.length) % slides.length;
    update();
  }

  function next() { goTo(currentIdx + 1); }
  function prev() { goTo(currentIdx - 1); }

  function start() {
    carouselTimer = setInterval(next, 3200);
  }

  function resetTimer() {
    clearInterval(carouselTimer);
    start();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  container.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  container.addEventListener('mouseleave', start);

  update();
  start();
}

/* ----------------------------------------------------
 * 5. ANIMATED STATISTICS COUNTER
 * ---------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const isDecimal = entry.target.getAttribute('data-decimal') === 'true';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1800;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            entry.target.innerText = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
            clearInterval(timer);
          } else {
            entry.target.innerText = (isDecimal ? start.toFixed(1) : Math.round(start)) + suffix;
          }
        }, stepTime);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

/* ----------------------------------------------------
 * HERO PRODUCT SHOWCASE CARD INTERACTION
 * ---------------------------------------------------- */
const HERO_PRODUCTS = [
  {
    title: "Tailored Pique Polo Shirt",
    category: "Knitwear Collection",
    gsm: "220 GSM",
    fabric: "100% Combed Cotton",
    moq: "MOQ 500 pcs/color",
    image: "assets/images/hero-featured-polo.jpg"
  },
  {
    title: "Selvedge Denim & Hoodies",
    category: "Streetwear & Denim",
    gsm: "340 GSM",
    fabric: "French Terry & Raw Denim",
    moq: "MOQ 600 pcs/style",
    image: "assets/images/hero-featured-denim.jpg"
  },
  {
    title: "Quilted Puffer Outerwear",
    category: "Winter & Technical",
    gsm: "180 GSM",
    fabric: "Polyfill & Water-Repel",
    moq: "MOQ 400 pcs/style",
    image: "assets/images/products/ladies-jacket.jpg"
  },
  {
    title: "Vintage Distressed Jeans",
    category: "Woven Denim Line",
    gsm: "12.5 Oz",
    fabric: "Ring-Spun Stretch Cotton",
    moq: "MOQ 800 pcs/wash",
    image: "assets/images/products/ripped-jeans.jpg"
  }
];

window.switchHeroProduct = function(index) {
  const product = HERO_PRODUCTS[index];
  if (!product) return;
  
  const imgEl = document.getElementById('hero-card-img');
  const titleEl = document.getElementById('hero-card-title');
  const catEl = document.getElementById('hero-card-cat');
  const gsmEl = document.getElementById('hero-card-gsm');
  const fabricEl = document.getElementById('hero-card-fabric');
  const moqEl = document.getElementById('hero-card-moq');

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = product.image;
      imgEl.style.opacity = '1';
    }, 120);
  }
  if (titleEl) titleEl.textContent = product.title;
  if (catEl) catEl.textContent = product.category;
  if (gsmEl) gsmEl.textContent = product.gsm;
  if (fabricEl) fabricEl.textContent = product.fabric;
  if (moqEl) moqEl.textContent = product.moq;

  // Update active thumbnail border
  document.querySelectorAll('.hero-thumb-btn').forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('border-lime-500');
      btn.classList.remove('border-transparent');
    } else {
      btn.classList.remove('border-lime-500');
      btn.classList.add('border-transparent');
    }
  });
};

/* ----------------------------------------------------
 * 6. PRODUCT CATALOG DATA & FILTERING
 * ---------------------------------------------------- */
const PRODUCTS_DATA = [
  {
    id: 'men-01',
    category: 'men',
    name: "Classic Pique Knit Polo Shirt",
    fabric: '95% Combed Cotton, 5% Elastane Pique',
    weight: '220-240 GSM Honeycomb Pique',
    moq: '500 pcs/color',
    leadTime: '30-40 days',
    colors: ['Deep Navy', 'Forest Green', 'Chalk White', 'Charcoal'],
    sizes: 'XS to 4XL',
    image: 'assets/images/hero-featured-polo.jpg',
    description: 'Export grade polo shirt with mother-of-pearl buttons, flat knit collar & cuffs with yarn-dyed contrast tipping. Pre-shrunk with enzyme wash.',
    tags: ['Best Seller', 'Oeko-Tex Standard 100']
  },
  {
    id: 'men-02',
    category: 'men',
    name: "Heavy French Terry Pullover Hoodie",
    fabric: '100% Ring Spun Combed Cotton Fleece',
    weight: '340 GSM Heavyweight Terry',
    moq: '400 pcs/color',
    leadTime: '35-45 days',
    colors: ['Heather Grey', 'Midnight Black', 'Washed Navy', 'Earth Olive'],
    sizes: 'S to 3XL',
    image: 'assets/images/hero-featured-denim.jpg',
    description: 'Ultra-dense double-faced fleece with double-lined hood, metal eyelets, custom dipped drawstring cords, and kangaroo front pocket.',
    tags: ['Streetwear Export', 'Accord Audited']
  },
  {
    id: 'men-03',
    category: 'men',
    name: "Vintage Wash Men's Denim Jeans",
    fabric: '98% Cotton, 2% Spandex Indigo Denim',
    weight: '12.5 Oz Ring Spun Denim',
    moq: '800 pcs/style',
    leadTime: '50-60 days',
    colors: ['Vintage Tint Medium Blue', 'Raw Dark Indigo', 'Washed Black'],
    sizes: '28 to 42 Waist',
    image: 'assets/images/products/ripped-jeans.jpg',
    description: 'Constructed using genuine YKK brass zippers, reinforced rivets at stress points, whiskering and subtle hand-scrape distress effects.',
    tags: ['Sustainable Wash', 'Water Recycle']
  },
  {
    id: 'women-01',
    category: 'women',
    name: "Women's Quilted Lightweight Jacket",
    fabric: '100% Water-Resistant Polyester Shell / Taffeta Lining',
    weight: '180 GSM Outer + 100 GSM Polyfill',
    moq: '400 pcs/style',
    leadTime: '45-55 days',
    colors: ['Dove Grey', 'Olive Moss', 'Matte Black'],
    sizes: 'XS to XL',
    image: 'assets/images/products/ladies-jacket.jpg',
    description: 'Diamond pattern quilting, collarless modern neck, smooth metal zip closure, bound hems, and wind-resistant inner placket.',
    tags: ['Winter Line', 'Water Repellent']
  },
  {
    id: 'women-02',
    category: 'women',
    name: "Ladies Fine Knit Designer Cardigan",
    fabric: '85% Fine Combed Cotton, 15% Soft Acrylic',
    weight: '12 Gauge Computerized Knit',
    moq: '350 pcs/color',
    leadTime: '40-50 days',
    colors: ['Camel Heather', 'Oatmeal Melange', 'Deep Navy'],
    sizes: 'XS to XXL',
    image: 'assets/images/products/designer-cardigan.jpg',
    description: 'Contemporary drop-shoulder relaxed silhouette, button-down placket with genuine horn buttons, ribbed cuffs and bottom band.',
    tags: ['Trend Collection', 'GOTS Certified']
  },
  {
    id: 'women-03',
    category: 'women',
    name: "Ladies Tailored Stretch Chino Pant",
    fabric: '97% BCI Cotton, 3% Spandex Twill',
    weight: '8.5 Oz Stretch Twill',
    moq: '500 pcs/color',
    leadTime: '45-55 days',
    colors: ['Khaki', 'Dark Slate', 'Sand Cream'],
    sizes: '24 to 34 Waist',
    image: 'assets/images/products/ladies-formal-pant.jpg',
    description: 'Clean front waistband with internal comfort stretch, rear welt pockets, bar-tacked stress seams, and smooth garment enzyme wash.',
    tags: ['Office Casual', 'WRAP Certified']
  },
  {
    id: 'kids-01',
    category: 'kids',
    name: "Kids Floral Organic Cotton Dress",
    fabric: '100% GOTS Certified Organic Cotton Poplin',
    weight: '130 GSM Soft Weave',
    moq: '500 pcs/design',
    leadTime: '30-40 days',
    colors: ['Ruby Floral', 'Sky Daisy', 'Pastel Peach'],
    sizes: '2T to 10 Years',
    image: 'assets/images/products/baby-girls-dress.jpg',
    description: 'Gentle on sensitive skin, back button keyhole closure, breathable lightweight weave, zero formaldehyde or harmful azo dyes.',
    tags: ['OEKO-TEX Class 1', 'Kids Safe']
  },
  {
    id: 'kids-02',
    category: 'kids',
    name: "Toddler Pastel Crewneck T-Shirt",
    fabric: '100% Combed Cotton Single Jersey',
    weight: '160 GSM Single Jersey',
    moq: '600 pcs/color',
    leadTime: '25-35 days',
    colors: ['Baby Pink', 'Mint Green', 'Chalk White'],
    sizes: '6M to 4T',
    image: 'assets/images/products/baby-pink-tee.jpg',
    description: 'Shoulder snap buttons for easy dressing, ultra-soft bio-polished cotton, flat-lock smooth seams that prevent chafing.',
    tags: ['Baby Soft', 'GOTS Certified']
  }
];

function initProductCatalog() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const categoryBtns = document.querySelectorAll('.filter-tab-btn');
  const searchInput = document.getElementById('product-search-input');
  const fabricSelect = document.getElementById('filter-fabric');

  let currentCategory = 'all';
  let currentSearch = '';
  let currentFabric = 'all';

  function render() {
    const filtered = PRODUCTS_DATA.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = currentSearch === '' || 
        item.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
        item.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
        item.fabric.toLowerCase().includes(currentSearch.toLowerCase());
      const matchFabric = currentFabric === 'all' || item.fabric.toLowerCase().includes(currentFabric.toLowerCase());
      return matchCat && matchSearch && matchFabric;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-500">
          <i class="fa-solid fa-shirt text-5xl mb-4 text-slate-300"></i>
          <h3 class="text-xl font-bold text-slate-800">No garment items found</h3>
          <p class="mt-2 text-sm text-slate-500">Try adjusting your category or search keywords.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden">
        <div class="relative h-64 w-full overflow-hidden bg-slate-100">
          <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700">
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            ${item.tags.map(t => `<span class="px-2.5 py-1 text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-white rounded-full">${t}</span>`).join('')}
          </div>
          <div class="absolute top-3 right-3">
            <span class="px-2.5 py-1 text-[10px] font-bold bg-amber-500/90 text-slate-950 rounded-full uppercase">
              ${item.category}
            </span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[10px] font-semibold text-lime-600 tracking-wider uppercase mb-1">
              ${item.fabric}
            </div>
            <h3 class="font-bold text-slate-900 text-sm leading-snug group-hover:text-lime-600 transition-colors">
              ${item.name}
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 line-clamp-2">
              ${item.description}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">${item.weight.split(' ')[0]} GSM</span>
            <button onclick="window.openQuickView('${item.id}')" class="px-3 py-1.5 bg-slate-900 hover:bg-lime-500 hover:text-slate-950 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5">
              <i class="fa-solid fa-eye text-[10px]"></i> Quick View
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('bg-lime-500', 'text-slate-950', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-lime-500', 'text-slate-950', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      currentCategory = btn.getAttribute('data-category');
      render();
    });
  });

  if (searchInput) searchInput.addEventListener('input', (e) => { currentSearch = e.target.value; render(); });
  if (fabricSelect) fabricSelect.addEventListener('change', (e) => { currentFabric = e.target.value; render(); });

  render();
}

/* ----------------------------------------------------
 * 7. QUICK VIEW MODAL
 * ---------------------------------------------------- */
function initQuickViewModal() {
  const modal = document.getElementById('quickview-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('quickview-close');
  const backdrop = document.getElementById('quickview-backdrop');

  window.closeQuickView = function() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.openQuickView = function(productId) {
    const item = PRODUCTS_DATA.find(p => p.id === productId);
    if (!item) return;

    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-img').alt = item.name;
    document.getElementById('modal-name').innerText = item.name;
    document.getElementById('modal-category').innerText = item.category.toUpperCase();
    document.getElementById('modal-fabric').innerText = item.fabric;
    document.getElementById('modal-weight').innerText = item.weight;
    document.getElementById('modal-moq').innerText = item.moq;
    document.getElementById('modal-leadtime').innerText = item.leadTime;
    document.getElementById('modal-sizes').innerText = item.sizes;
    document.getElementById('modal-desc').innerText = item.description;

    const colorsContainer = document.getElementById('modal-colors');
    if (colorsContainer) {
      colorsContainer.innerHTML = item.colors.map(c => `
        <span class="px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
          ${c}
        </span>
      `).join('');
    }

    const tagsContainer = document.getElementById('modal-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = item.tags.map(t => `
        <span class="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200">
          <i class="fa-solid fa-certificate text-[10px] mr-1"></i> ${t}
        </span>
      `).join('');
    }

    const sampleBtn = document.getElementById('modal-sample-btn');
    if (sampleBtn) {
      sampleBtn.onclick = () => {
        window.closeQuickView();
        window.requestSampleModal(item.name);
      };
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeQuickView);
  if (backdrop) backdrop.addEventListener('click', window.closeQuickView);
}

/* ----------------------------------------------------
 * 8. INTERACTIVE RFQ ESTIMATOR & COST CALCULATOR
 * ---------------------------------------------------- */
function initRfqCalculator() {
  const calcForm = document.getElementById('rfq-calculator-form');
  if (!calcForm) return;

  const categorySelect = document.getElementById('calc-category');
  const qtyInput = document.getElementById('calc-qty');
  const qtyDisplay = document.getElementById('calc-qty-val');
  const fabricSelect = document.getElementById('calc-fabric');
  const estCost = document.getElementById('est-cost-output');
  const estDays = document.getElementById('est-days-output');
  const estCompliance = document.getElementById('est-compliance-badge');

  function calculate() {
    const qty = parseInt(qtyInput ? qtyInput.value : 2000, 10);
    if (qtyDisplay) qtyDisplay.innerText = qty.toLocaleString() + ' Pieces';

    const cat = categorySelect ? categorySelect.value : 'tshirt';
    const fabric = fabricSelect ? fabricSelect.value : 'cotton';

    let baseFob = 2.40;
    let days = 35;

    if (cat === 'tshirt') { baseFob = 2.10; days = 30; }
    else if (cat === 'polo') { baseFob = 3.80; days = 38; }
    else if (cat === 'denim') { baseFob = 7.50; days = 55; }
    else if (cat === 'jacket') { baseFob = 14.20; days = 55; }
    else if (cat === 'sweater') { baseFob = 9.80; days = 60; }
    else if (cat === 'kids') { baseFob = 2.60; days = 32; }

    if (fabric === 'organic') baseFob *= 1.25;
    else if (fabric === 'blended') baseFob *= 0.92;
    else if (fabric === 'fleece') baseFob *= 1.40;
    else if (fabric === 'merino') baseFob *= 2.10;

    if (qty >= 10000) { baseFob *= 0.82; days += 10; }
    else if (qty >= 5000) { baseFob *= 0.88; days += 5; }
    else if (qty >= 2000) { baseFob *= 0.94; }
    else if (qty < 1000) { baseFob *= 1.15; }

    const lowRange = (baseFob * 0.95).toFixed(2);
    const highRange = (baseFob * 1.10).toFixed(2);

    if (estCost) estCost.innerText = `$${lowRange} - $${highRange} / pc`;
    if (estDays) estDays.innerText = `${days} - ${days + 10} Days (Ex-Factory)`;
    if (estCompliance) estCompliance.innerText = qty >= 5000 ? 'Dedicated Production Line Assigned' : 'Rapid Batch Sampling Available';
  }

  if (categorySelect) categorySelect.addEventListener('change', calculate);
  if (qtyInput) qtyInput.addEventListener('input', calculate);
  if (fabricSelect) fabricSelect.addEventListener('change', calculate);

  calculate();
}

/* ----------------------------------------------------
 * 9. FORM SUBMISSIONS & TOAST NOTIFICATIONS
 * ---------------------------------------------------- */
function initContactForms() {
  window.requestSampleModal = function(productTitle) {
    window.location.href = `contact.html?product=${encodeURIComponent(productTitle)}#rfq-section`;
  };

  const allForms = document.querySelectorAll('form.js-interactive-form');
  allForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Transmitting to Sourcing Team...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();
        showToast("Inquiry Received!", "Your RFQ specifications have been logged with RSG Apparels HQ. Our Senior Merchandiser will contact you within 6 business hours with detailed costing.", "success");
      }, 1200);
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const sampleParam = urlParams.get('product');
  if (sampleParam) {
    const field = document.getElementById('rfq-product-name');
    if (field) field.value = sampleParam;
  }
}

function showToast(title, message, type = 'info') {
  let toastBox = document.getElementById('toast-container');
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.id = 'toast-container';
    toastBox.className = 'fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none';
    document.body.appendChild(toastBox);
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md transform transition-all duration-500 translate-y-8 opacity-0 flex items-start gap-3.5 ${
    type === 'success' ? 'bg-[#070a0e]/95 text-white border-lime-500/40 shadow-lime-500/10' : 'bg-white text-slate-800 border-slate-200'
  }`;

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check text-lime-400 text-xl' : 'fa-solid fa-circle-info text-lime-500 text-xl';

  toast.innerHTML = `
    <i class="${iconClass} mt-0.5 flex-shrink-0"></i>
    <div class="flex-1">
      <h4 class="font-bold text-sm leading-tight">${title}</h4>
      <p class="text-xs mt-1 text-slate-300 leading-relaxed">${message}</p>
    </div>
    <button class="text-slate-400 hover:text-white text-sm" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  toastBox.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-8', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

window.downloadCompanyProfile = function() {
  showToast("Profile Download Initiated", "RM-Fashion-BD-Corporate-Profile-2026.pdf is downloading. It includes factory audit IDs, monthly output capacities, and machinery listings.", "success");
};
