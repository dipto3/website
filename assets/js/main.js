/**
 * RM Fashion BD - Modern Interactive Core Scripts
 * Handles Navigation, Hero Slider, Specialty Carousel, Mobile Drawer,
 * Animated Counters, Product Filters, Modals, RFQ Calculator, and Toast Alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroSlider();
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
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('glass-nav-scrolled');
      navbar.classList.remove('py-4');
      navbar.classList.add('py-2.5');
    } else {
      navbar.classList.remove('glass-nav-scrolled');
      navbar.classList.add('py-4');
      navbar.classList.remove('py-2.5');
    }
  });
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
 * 3. HERO BANNER SLIDER
 * ---------------------------------------------------- */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const track = document.getElementById('hero-track');
  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const dotsContainer = document.getElementById('hero-dots');

  if (!slides.length) return;
  let current = 0;
  let slideInterval = null;
  const totalSlides = slides.length;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `h-3 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
        idx === 0 ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70 w-3'
      }`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlidePosition() {
    if (track) {
      track.style.transform = `translateX(-${current * 100}%)`;
    }

    // Update active dot indicators
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        if (idx === current) {
          dot.className = 'w-8 h-3 rounded-full bg-amber-400 transition-all duration-300 cursor-pointer focus:outline-none';
        } else {
          dot.className = 'w-3 h-3 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer focus:outline-none';
        }
      });
    }
  }

  function goToSlide(index) {
    current = (index + totalSlides) % totalSlides;
    updateSlidePosition();
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  function startTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  function restartTimer() {
    clearInterval(slideInterval);
    startTimer();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      restartTimer();
    });
  }

  // Pause on desktop mouse hover
  slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slider.addEventListener('mouseleave', startTimer);

  // Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    clearInterval(slideInterval);
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    startTimer();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    // Horizontal swipe threshold (40px) and ensure horizontal intent
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard navigation when in viewport
  document.addEventListener('keydown', (e) => {
    const rect = slider.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        restartTimer();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        restartTimer();
      }
    }
  });

  updateSlidePosition();
  startTimer();
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
        i === 0 ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
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
          d.className = 'w-6 h-2 rounded-full bg-blue-600 transition-all';
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
 * 6. PRODUCT CATALOG DATA & FILTERING
 * ---------------------------------------------------- */
const PRODUCTS_DATA = [
  {
    id: 'men-01',
    category: 'men',
    name: "Men's Premium Combed Cotton T-Shirt",
    fabric: '100% Organic Combed Cotton',
    weight: '180-200 GSM Single Jersey',
    moq: '500 pcs/color',
    leadTime: '30-45 days',
    colors: ['Jet Black', 'Optic White', 'Navy Heather', 'Olive'],
    sizes: 'XS to 4XL',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'High-density knit single jersey, bio-washed, silicon finished for ultra-soft hand feel. Double-needle stitch and lycra ribbed collar.',
    tags: ['Best Seller', 'Oeko-Tex Standard 100']
  },
  {
    id: 'men-02',
    category: 'men',
    name: "Classic Pique Knit Polo Shirt",
    fabric: '95% Combed Cotton, 5% Elastane Pique',
    weight: '220-240 GSM Honeycomb Pique',
    moq: '600 pcs/color',
    leadTime: '40-50 days',
    colors: ['Royal Blue', 'Burgundy', 'Mustard Yellow', 'Pure White'],
    sizes: 'S to 3XL',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    description: 'Export grade polo shirt with mother-of-pearl buttons, flat knit collar & cuffs with yarn-dyed contrast tipping. Pre-shrunk with enzyme wash.',
    tags: ['Export Classic', 'Accord Audited']
  },
  {
    id: 'men-03',
    category: 'men',
    name: "Vintage Wash Men's Denim Jeans",
    fabric: '98% Cotton, 2% Spandex Indigo Denim',
    weight: '11.5 - 12.5 Oz Ring Spun Denim',
    moq: '800 pcs/style',
    leadTime: '55-65 days',
    colors: ['Vintage Tint Medium Blue', 'Raw Dark Indigo', 'Washed Black'],
    sizes: '28 to 42 Waist',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    description: 'Constructed using genuine YKK brass zippers, reinforced rivets at stress points, whiskering and subtle hand-scrape distress effects.',
    tags: ['Sustainable Wash', 'Water Recycle']
  },
  {
    id: 'men-04',
    category: 'men',
    name: "Men's Urban Utility Bomber Jacket",
    fabric: '100% Water-Resistant Polyester Shell / Taffeta Lining',
    weight: '180 GSM Outer + 120 GSM Polyfill',
    moq: '400 pcs/style',
    leadTime: '50-60 days',
    colors: ['Armory Green', 'Burnt Ochre', 'Matte Black'],
    sizes: 'S to XXL',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    description: 'Ribbed storm collar and cuffs, heavy metal front zipper, utility sleeve pocket with zip, dual fleece-lined hand pockets.',
    tags: ['Winter Line', 'Water Repellent']
  },
  {
    id: 'women-01',
    category: 'women',
    name: "Ladies Drop-Shoulder Relaxed Tee",
    fabric: '100% Ring Spun Slub Cotton',
    weight: '160 GSM Slub Jersey',
    moq: '500 pcs/color',
    leadTime: '30-40 days',
    colors: ['Dusty Rose', 'Chalk White', 'Sage Green', 'Charcoal'],
    sizes: 'XS to XXL',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary drop-shoulder relaxed silhouette with raw-edge folded cuffs. Acid wash and garment-dyed options available.',
    tags: ['Trend Collection', 'GOTS Certified']
  },
  {
    id: 'women-02',
    category: 'women',
    name: "Ladies High-Rise Stretch Denim Pant",
    fabric: '72% Cotton, 25% Polyester, 3% Elastane',
    weight: '10.5 Oz Super Stretch Denim',
    moq: '600 pcs/wash',
    leadTime: '50-60 days',
    colors: ['Medium Ocean Wash', 'Deep Indigo', 'Charcoal Fade'],
    sizes: '24 to 36 Waist',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description: '4-way high recovery stretch denim. Gap-proof contoured waistband, pocket stay technology, antique brass hardware.',
    tags: ['4-Way Stretch', 'BSCI Audited']
  },
  {
    id: 'women-03',
    category: 'women',
    name: "Women's Cropped Trucker Denim Jacket",
    fabric: '100% Rigid BCI Cotton Denim',
    weight: '12 Oz Broken Twill',
    moq: '500 pcs/style',
    leadTime: '55-65 days',
    colors: ['Classic Stonewash', 'Vintage Cream', 'Overdyed Sand'],
    sizes: 'XS to XL',
    image: 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?auto=format&fit=crop&w=800&q=80',
    description: 'Boxy cropped silhouette, flap chest pockets, dual welt pockets, adjustable waist tabs, shank buttons with custom brand engraving.',
    tags: ['Editorial Top Pick', 'WRAP Certified']
  },
  {
    id: 'kids-01',
    category: 'kids',
    name: "Kids Graphic Organic Cotton T-Shirt",
    fabric: '100% GOTS Certified Organic Cotton',
    weight: '160 GSM Single Jersey',
    moq: '600 pcs/design',
    leadTime: '30-40 days',
    colors: ['Sunburst Yellow', 'Sky Blue', 'Mint', 'Coral'],
    sizes: '2T to 14 Years',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
    description: 'Eco-friendly water-based and puff printing that is nickel-free and formaldehyde-free. Safe for tender skin with tear-away neck tags.',
    tags: ['OEKO-TEX Class 1', 'Kids Safe']
  },
  {
    id: 'sweater-01',
    category: 'sweater',
    name: "Men's 12GG Cashmere-Blend Cardigan",
    fabric: '85% Fine Merino Wool, 15% Cashmere',
    weight: '12 Gauge Flat Knit',
    moq: '350 pcs/color',
    leadTime: '55-70 days',
    colors: ['Camel Heather', 'Midnight Navy', 'Charcoal Fleck'],
    sizes: 'S to 3XL',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'Engineered on computerized flat knitting machines. Ribbed V-neckline, genuine horn buttons, reinforced side seam pockets.',
    tags: ['Luxury Knit', 'AQL 1.5 Inspected']
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
            <div class="text-[10px] font-semibold text-blue-600 tracking-wider uppercase mb-1">
              ${item.fabric}
            </div>
            <h3 class="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
              ${item.name}
            </h3>
            <p class="mt-1.5 text-xs text-slate-500 line-clamp-2">
              ${item.description}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">${item.weight.split(' ')[0]} GSM</span>
            <button onclick="window.openQuickView('${item.id}')" class="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5">
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
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
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
        showToast("Inquiry Received!", "Your RFQ specifications have been logged with RM Fashion BD Uttara HQ. Our Senior Merchandiser will contact you within 6 business hours with detailed costing.", "success");
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
    toastBox.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none';
    document.body.appendChild(toastBox);
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md transform transition-all duration-500 translate-y-8 opacity-0 flex items-start gap-3.5 ${
    type === 'success' ? 'bg-slate-900/95 text-white border-blue-500/40' : 'bg-white text-slate-800 border-slate-200'
  }`;

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check text-emerald-400 text-xl' : 'fa-solid fa-circle-info text-blue-500 text-xl';

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
