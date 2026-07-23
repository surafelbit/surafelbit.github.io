// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ============================================
// NAV TOGGLE INDICATOR
// ============================================
const indicator = document.getElementById('nav-indicator');
const workBtn = document.getElementById('work-btn');
const infoBtn = document.getElementById('info-btn');

// Set indicator position based on active page
if (indicator && infoBtn && infoBtn.classList.contains('active')) {
  indicator.classList.add('right');
}

if (workBtn && infoBtn) {
  workBtn.addEventListener('click', () => {
    workBtn.classList.add('active');
    infoBtn.classList.remove('active');
    indicator.classList.remove('right');
  });
  infoBtn.addEventListener('click', () => {
    infoBtn.classList.add('active');
    workBtn.classList.remove('active');
    indicator.classList.add('right');
  });
}

// ============================================
// SCROLL-IN ANIMATIONS (IntersectionObserver)
// ============================================
const observeElements = () => {
  const elements = document.querySelectorAll(
    '.work-card, .experience-entry, .friend-entry, .info-story-text, .info-photo-wrap'
  );

  elements.forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
};

// ============================================
// CURSOR GLOW EFFECT (subtle)
// ============================================
const initCursorGlow = () => {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
};

// ============================================
// WORK CARD HOVER TILT (subtle 3D)
// ============================================
const initCardTilt = () => {
  const cards = document.querySelectorAll('.work-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  observeElements();
  initCursorGlow();
  initCardTilt();
});
