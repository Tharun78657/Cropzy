// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const mainHeader = document.getElementById('mainHeader');

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav) {
      mainNav.classList.remove('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// Helper: get current filename (e.g., 'index.html' or 'spices.html')
function currentPageFilename() {
  const parts = location.pathname.split('/');
  let fname = parts.pop() || parts.pop(); // handles trailing slash
  if (!fname) fname = 'index.html';
  return fname;
}

// Highlight active nav link across pages
function highlightNavByPage() {
  const fname = currentPageFilename();
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    // If href is an absolute/relative page
    const hrefName = href.split('/').pop();
    if (hrefName && (hrefName === fname || (hrefName === 'index.html' && fname === ''))) {
      link.classList.add('active');
    }
    // If current page is index.html and href is a hash, keep it for scroll logic (handled elsewhere)
  });
}

// Header animation on load and scroll
function animateHeaderOnLoad() {
  if (!mainHeader) return;
  
  // Mark header as loaded
  mainHeader.classList.add('header-loaded');
  
  // Animate logo
  const logo = document.querySelector('.logo');
  if (logo && !logo.classList.contains('logo-animate')) {
    logo.classList.add('logo-animate');
  }
  
  // Animate nav items with stagger effect
  const navItems = document.querySelectorAll('nav ul li');
  navItems.forEach((item, index) => {
    if (!item.classList.contains('nav-item-animate')) {
      setTimeout(() => {
        item.classList.add('nav-item-animate');
      }, 100 * (index + 1));
    }
  });
  
  // Animate mobile menu button
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn && !mobileMenuBtn.classList.contains('menu-btn-animate')) {
    mobileMenuBtn.classList.add('menu-btn-animate');
  }
}

// Re-trigger header animations on scroll (for continuous animation effect)
let lastScrollTop = 0;
function animateHeaderOnScroll() {
  if (!mainHeader) return;
  
  const scrollTop = window.scrollY || window.pageYOffset;
  
  // Animate when scrolling down past 50px or scrolling back to top
  if (scrollTop > 50 || (scrollTop < lastScrollTop && scrollTop < 100)) {
    // Ensure header is visible and animated
    mainHeader.classList.add('header-loaded');
    
    // Re-animate nav items if they're not already animated
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach((item) => {
      if (!item.classList.contains('nav-item-animate')) {
        item.classList.add('nav-item-animate');
      }
    });
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Hero section animation functions
function animateHeroOnLoad() {
  const heroTitle = document.querySelector('.hero h1');
  const heroText = document.querySelector('.hero p');
  const heroBtns = document.querySelector('.hero-btns');
  
  if (heroTitle && !heroTitle.classList.contains('hero-title-animated')) {
    heroTitle.classList.add('hero-title-animated');
  }
  
  if (heroText && !heroText.classList.contains('hero-text-animated')) {
    heroText.classList.add('hero-text-animated');
  }
  
  if (heroBtns && !heroBtns.classList.contains('hero-btns-animated')) {
    heroBtns.classList.add('hero-btns-animated');
  }
}

// Re-trigger hero animations when scrolling back to hero section
let lastHeroScrollY = 0;
function animateHeroOnScroll() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  const scrollY = window.scrollY || window.pageYOffset;
  const heroRect = heroSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Check if hero section is visible in viewport
  const isHeroVisible = heroRect.top < windowHeight && heroRect.bottom > 0;
  const isNearTop = scrollY < 200; // Near the top of the page
  
  // Re-animate when hero is visible and near top, or when scrolling back up
  if ((isHeroVisible && isNearTop) || (scrollY < lastHeroScrollY && scrollY < 300)) {
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const heroBtns = document.querySelector('.hero-btns');
    
    // Re-trigger animations by removing and re-adding classes
    if (heroTitle && !heroTitle.classList.contains('hero-title-animated')) {
      heroTitle.classList.add('hero-title-animated');
    }
    if (heroText && !heroText.classList.contains('hero-text-animated')) {
      heroText.classList.add('hero-text-animated');
    }
    if (heroBtns && !heroBtns.classList.contains('hero-btns-animated')) {
      heroBtns.classList.add('hero-btns-animated');
    }
  }
  
  lastHeroScrollY = scrollY <= 0 ? 0 : scrollY;
}

// Header scroll effect + section highlighting (only runs on pages that contain sections)
function headerAndSectionHandler() {
  if (!mainHeader) return;

  const scrollTop = window.scrollY;
  
  // Add scrolled class for styling changes
  if (scrollTop > 100) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
  
  // Trigger scroll-based animations
  animateHeaderOnScroll();
  
  // Trigger hero animations on scroll
  animateHeroOnScroll();

  // Only perform section-based active link detection on the home page (index)
  const fname = currentPageFilename();
  if (fname === 'index.html' || fname === '' || fname === '/') {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// Run once on load to set page-level nav highlight
highlightNavByPage();

// Animate header and hero on page load
window.addEventListener('load', () => {
  animateHeaderOnLoad();
  animateHeroOnLoad();
});

// Also trigger on DOMContentLoaded for faster initial animation
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure styles are loaded
  setTimeout(() => {
    animateHeaderOnLoad();
    animateHeroOnLoad();
  }, 100);
});

// Header scroll handling
window.addEventListener('scroll', headerAndSectionHandler);

// Trigger handler on initial load to set initial states
window.addEventListener('load', () => {
  headerAndSectionHandler();
});

// Smooth scrolling for hash navigation links (keeps existing behavior)
document.querySelectorAll('nav a, .logo').forEach(anchor => {
  const href = anchor.getAttribute('href') || '';
  // only attach smooth scroll handler for hash links that refer to sections on the current page
  if (href.startsWith('#')) {
    anchor.addEventListener('click', function (e) {
      // If the target exists on this page, perform smooth scroll
      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();
        window.scrollTo({
          top: targetSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
      // otherwise (link to another page's hash) let default navigation happen
    });
  }
});

// -----------------------------
// Products Carousel Functionality (guarded)
// -----------------------------
const carousel = document.getElementById('productsCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const productCards = document.querySelectorAll('.product-card');

let currentIndex = 0;
let cardsPerView = getCardsPerView();

function getCardsPerView() {
  if (window.innerWidth < 576) return 1;
  if (window.innerWidth < 992) return 2;
  return 3;
}

function updateCarousel() {
  if (!carousel || productCards.length === 0) return;
  const cardWidth = productCards[0].offsetWidth + 30; // card width + gap
  const translateX = -currentIndex * cardWidth;
  carousel.style.transform = `translateX(${translateX}px)`;
  updateDots();
}

function updateDots() {
  if (!carouselDots) return;
  carouselDots.innerHTML = '';
  const totalDots = Math.ceil(productCards.length / cardsPerView);

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === currentIndex) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
  }
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (productCards.length === 0) return;
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = Math.ceil(productCards.length / cardsPerView) - 1;
    }
    updateCarousel();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (productCards.length === 0) return;
    const maxIndex = Math.ceil(productCards.length / cardsPerView) - 1;
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  const newCardsPerView = getCardsPerView();
  if (cardsPerView !== newCardsPerView) {
    cardsPerView = newCardsPerView;
    currentIndex = 0;
    updateCarousel();
  } else {
    // still update translate in case widths changed
    updateCarousel();
  }
});

// -----------------------------
// Contact form (guarded)
// -----------------------------
const enquiryFormCompact = document.getElementById('enquiryFormCompact');
if (enquiryFormCompact) {
  enquiryFormCompact.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values (guarded selectors)
    const nameInput = enquiryFormCompact.querySelector('input[type="text"]');
    const emailInput = enquiryFormCompact.querySelector('input[type="email"]');
    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';

    // Show success message
    alert(`Thank you ${name}! Your enquiry has been submitted. We will contact you at ${email} soon.`);
    enquiryFormCompact.reset();
  });
}

// Initialize carousel on load (only if present)
updateCarousel();

// Initialize header on load
window.dispatchEvent(new Event('scroll'));

// -----------------------------
// Tab functionality for products (guarded)
// -----------------------------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length && tabContents.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Show corresponding content
      const tabId = btn.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) tabContent.classList.add('active');
    });
  });
}

// -----------------------------
// Modal: only bind to elements that still have data-target
// -----------------------------
(function () {
  const modal = document.getElementById('productModal');
  const modalInner = modal ? document.getElementById('modalInner') : null;
  const closeBtn = modal ? modal.querySelector('.close-modal') : null;
  const backdrop = modal ? modal.querySelector('.modal-backdrop') : null;

  if (!modal || !modalInner) return; // modal isn't available on some pages

  function openModal(contentEl) {
    modalInner.innerHTML = '';
    const wrap = document.createElement('div');
    const title = contentEl.previousElementSibling ? contentEl.previousElementSibling.textContent : 'Items';
    wrap.innerHTML = '<h4>' + title + '</h4>' + contentEl.innerHTML;
    // show list (ensure visible)
    wrap.querySelectorAll('[hidden]').forEach(n => n.hidden = false);
    modalInner.appendChild(wrap);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalInner.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Only select view buttons that still have data-target (anchors without data-target won't be bound)
  document.querySelectorAll('.view-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // prevent default only if it's a button (not a link). If it's an anchor with href + data-target we still allow default navigate
      if (btn.tagName.toLowerCase() === 'button') e.preventDefault();
      const id = btn.getAttribute('data-target');
      const source = document.getElementById(id);
      if (source) openModal(source);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
})();

// -----------------------------
// Smooth Scroll Animations (Repeatable)
// -----------------------------
(function () {
  // Add minimal animation styles
  const style = document.createElement('style');
  style.textContent = `
    .fade-in-element {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-element.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class when element enters viewport
          entry.target.classList.add('visible');
        } else {
          // Remove visible class when element leaves viewport
          // This allows animation to trigger again when scrolling back
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);

    // Only animate specific elements, not entire sections
    const animateElements = document.querySelectorAll(
      '.about-card, .service-type-card, .team-member, .section-title-center'
    );

    animateElements.forEach((element, index) => {
      element.classList.add('fade-in-element');
      element.style.transitionDelay = `${(index % 3) * 0.1}s`;
      observer.observe(element);
    });
  }
})();
