/* =============================================
   IRONPEAK FITNESS — MAIN.JS
   - Lenis speed tuned: duration 0.7 (fast + crisp)
   - Dynamic scroll speed: slows near sections, faster on open space
   - All CTAs fully functional with modal + toast feedback
   ============================================= */

// ---- LOADER ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
    runHeroEntrance();
  }, 1400);
});
document.body.style.overflow = 'hidden';

// ---- LENIS — FAST & DYNAMIC ----
const lenis = new Lenis({
  duration: 0.72,                                       // was 1.3 — now crisp
  easing: (t) => 1 - Math.pow(1 - t, 4),              // snappier ease-out-quart
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1.1,
  touchMultiplier: 1.8,
});

// Dynamic speed: slow down when entering a section, fast in between
const snapSections = document.querySelectorAll('section');
let dynamicMultiplier = 1;

lenis.on('scroll', ({ scroll, velocity }) => {
  // Detect proximity to section boundaries — reduce speed when close
  let nearBoundary = false;
  snapSections.forEach(sec => {
    const top = sec.offsetTop;
    const distance = Math.abs(scroll - top);
    if (distance < 120) nearBoundary = true;
  });

  // Smoothly adjust Lenis wheelMultiplier feel via CSS-based momentum hint
  dynamicMultiplier = nearBoundary ? 0.7 : 1.15;
  lenis.options.wheelMultiplier = dynamicMultiplier;
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ---- NAV SCROLL STATE ----
const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

// ---- MOBILE MENU ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
  isOpen ? lenis.stop() : lenis.start();
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    lenis.start();
  });
});

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// ---- SCROLL REVEAL ----
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => observer.observe(el));
}

// Stagger grids
function stagger(containerSel, childSel, step = 110) {
  document.querySelectorAll(containerSel).forEach(container => {
    container.querySelectorAll(childSel).forEach((child, i) => {
      child.style.transitionDelay = (i * step) + 'ms';
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  stagger('.classes-grid',      '.class-card');
  stagger('.trainers-grid',     '.trainer-card');
  stagger('.testimonials-grid', '.testimonial-card');
  stagger('.pricing-grid',      '.pricing-card');
  stagger('.why-grid',          '.why-card', 80);
});

// ---- HERO PARALLAX ----
lenis.on('scroll', ({ scroll }) => {
  const heroImg = document.querySelector('.hero-bg .hero-img');
  if (heroImg) heroImg.style.transform = `scale(1.05) translateY(${scroll * 0.28}px)`;
  if (scroll > 80 && !window._statsAnimated) {
    window._statsAnimated = true;
    animateCounters();
  }
});

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(stat => {
    const supEl = stat.querySelector('sup');
    const raw   = stat.textContent.replace(/[^0-9]/g, '');
    const num   = parseFloat(raw);
    const t0    = performance.now();
    const dur   = 1600;
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * num);
      if (supEl) {
        stat.childNodes[0].textContent = v;
      } else {
        stat.textContent = v + (num >= 90 ? '%' : '+');
      }
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -76, duration: 0.9 });
    }
  });
});

// ---- NAV ACTIVE LINK ----
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-links a');
lenis.on('scroll', ({ scroll }) => {
  let current = '';
  sections.forEach(s => { if (scroll >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

// ---- CARD TILT ----
document.querySelectorAll('.pricing-card, .class-card, .trainer-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -3.5;
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  3.5;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ---- HERO ENTRANCE ----
function runHeroEntrance() {
  document.querySelectorAll('.hero-title .line').forEach((line, i) => {
    Object.assign(line.style, { opacity: '0', transform: 'translateY(44px)',
      transition: 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)' });
    setTimeout(() => { line.style.opacity = '1'; line.style.transform = 'none'; }, 1500 + i * 130);
  });
  ['.hero-eyebrow', '.hero-sub', '.hero-cta'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    Object.assign(el.style, { opacity: '0', transform: 'translateY(22px)',
      transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)' });
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 1950 + i * 140);
  });
}

// ==============================================
// MODAL + TOAST SYSTEM
// ==============================================

// Create toast container
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.style.cssText = `
  position: fixed; bottom: 32px; right: 32px;
  z-index: 99999; display: flex; flex-direction: column; gap: 12px;
  pointer-events: none;
`;
document.body.appendChild(toastContainer);

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bg = type === 'success' ? '#F5A623' : type === 'error' ? '#e74c3c' : '#2ecc71';
  const color = type === 'success' ? '#000' : '#fff';
  toast.style.cssText = `
    background: ${bg}; color: ${color};
    padding: 14px 24px; border-radius: 4px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.88rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; pointer-events: auto;
    transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    max-width: 320px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  });
  setTimeout(() => {
    toast.style.transform = 'translateX(140%)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Generic modal builder
function createModal({ title, subtitle, fields, submitLabel, onSubmit }) {
  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.82);
    backdrop-filter: blur(8px); z-index: 9000;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s;
    padding: 24px;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: #111; border: 1px solid rgba(245,166,35,0.35);
    border-radius: 4px; padding: 48px 44px; width: 100%; max-width: 520px;
    transform: translateY(30px) scale(0.97);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
    opacity: 0; position: relative; max-height: 90vh; overflow-y: auto;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: absolute; top: 16px; right: 20px;
    background: none; border: none; color: #8a8a8a;
    font-size: 1.6rem; cursor: pointer; line-height: 1;
    transition: color 0.2s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.color = '#F5A623';
  closeBtn.onmouseleave = () => closeBtn.style.color = '#8a8a8a';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.6rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #fff; margin-bottom: 6px;
  `;

  const subEl = document.createElement('p');
  subEl.textContent = subtitle;
  subEl.style.cssText = `font-size: 0.88rem; color: #8a8a8a; margin-bottom: 28px;`;

  const form = document.createElement('form');
  form.style.cssText = `display: flex; flex-direction: column; gap: 14px;`;

  const inputStyle = `
    width: 100%; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px; padding: 13px 16px; color: #fff;
    font-family: 'Barlow', sans-serif; font-size: 0.9rem; outline: none;
    transition: border-color 0.2s; appearance: none;
  `;

  fields.forEach(f => {
    let el;
    if (f.type === 'select') {
      el = document.createElement('select');
      el.style.cssText = inputStyle + 'cursor: pointer;';
      const placeholder = document.createElement('option');
      placeholder.value = ''; placeholder.disabled = true; placeholder.selected = true;
      placeholder.textContent = f.placeholder;
      el.appendChild(placeholder);
      f.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        el.appendChild(o);
      });
    } else if (f.type === 'textarea') {
      el = document.createElement('textarea');
      el.rows = 3;
      el.placeholder = f.placeholder;
      el.style.cssText = inputStyle + 'resize: vertical;';
    } else {
      el = document.createElement('input');
      el.type = f.type || 'text';
      el.placeholder = f.placeholder;
      el.required = f.required || false;
      el.style.cssText = inputStyle;
    }
    el.name = f.name;
    el.onfocus = () => el.style.borderColor = '#F5A623';
    el.onblur  = () => el.style.borderColor = 'rgba(255,255,255,0.08)';
    form.appendChild(el);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = submitLabel;
  submitBtn.style.cssText = `
    background: #F5A623; color: #000; border: none;
    padding: 15px 32px; border-radius: 4px; width: 100%;
    font-family: 'Barlow Condensed', sans-serif; font-size: 0.9rem;
    font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; margin-top: 8px;
    transition: background 0.2s, transform 0.15s;
  `;
  submitBtn.onmouseenter = () => submitBtn.style.background = '#e8960f';
  submitBtn.onmouseleave = () => submitBtn.style.background = '#F5A623';
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    closeModal();
    onSubmit(data);
  });

  box.appendChild(closeBtn);
  box.appendChild(titleEl);
  box.appendChild(subEl);
  box.appendChild(form);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
  lenis.stop();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
      box.style.opacity = '1';
      box.style.transform = 'translateY(0) scale(1)';
    });
  });

  function closeModal() {
    backdrop.style.opacity = '0';
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px) scale(0.97)';
    setTimeout(() => { backdrop.remove(); lenis.start(); }, 320);
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); }, { once: true });
}

// FREE TRIAL modal
function openFreeTrialModal() {
  createModal({
    title: 'Start Your Free Trial',
    subtitle: '7 days free — no credit card required. Cancel anytime.',
    fields: [
      { name: 'name',  type: 'text',  placeholder: 'Full Name',     required: true },
      { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
      { name: 'phone', type: 'tel',   placeholder: 'Phone Number' },
      { name: 'goal',  type: 'select', placeholder: 'Your Primary Goal', options: ['Lose Weight', 'Build Muscle', 'Improve Cardio', 'Increase Strength', 'Overall Fitness'] },
      { name: 'class', type: 'select', placeholder: 'Preferred Class', options: ['Cardio HIIT', 'Body Building', 'Hot Yoga', 'Powerlifting', 'Boxing Fitness', 'Aqua Endurance'] },
    ],
    submitLabel: 'CLAIM FREE TRIAL',
    onSubmit: (data) => {
      showToast('Trial booked! Check your email for details.', 'green');
    }
  });
}

// BOOK CLASS modal
function openBookClassModal(className) {
  createModal({
    title: 'Book a Class',
    subtitle: className ? `Booking: ${className}` : 'Choose your session and reserve your spot.',
    fields: [
      { name: 'name',  type: 'text',  placeholder: 'Full Name',     required: true },
      { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
      { name: 'class', type: 'select', placeholder: 'Select Class', options: ['Cardio HIIT', 'Body Building', 'Hot Yoga', 'Powerlifting', 'Boxing Fitness', 'Aqua Endurance'] },
      { name: 'time',  type: 'select', placeholder: 'Preferred Time', options: ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'] },
    ],
    submitLabel: 'CONFIRM BOOKING',
    onSubmit: () => showToast('Class booked! See you on the floor.', 'green'),
  });
}

// GET STARTED / PRICING modal
function openPricingModal(tier) {
  createModal({
    title: `Join — ${tier || 'Elite'} Plan`,
    subtitle: 'Complete your details and we will contact you within 24 hours.',
    fields: [
      { name: 'name',  type: 'text',  placeholder: 'Full Name',     required: true },
      { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
      { name: 'phone', type: 'tel',   placeholder: 'Phone Number' },
      { name: 'plan',  type: 'select', placeholder: 'Membership Plan', options: ['Starter — Rs 1,499/mo', 'Elite — Rs 3,499/mo', 'Champion — Rs 6,999/mo'] },
      { name: 'notes', type: 'textarea', placeholder: 'Anything else? (optional)' },
    ],
    submitLabel: 'GET STARTED',
    onSubmit: () => showToast('Awesome! Our team will call you shortly.', 'success'),
  });
}

// CONTACT FORM (inline on page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'SENDING...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = 'MESSAGE SENT!';
      btn.style.background = '#2ecc71';
      btn.style.color = '#fff';
      btn.style.opacity = '1';
      contactForm.reset();
      showToast('Message received! We will be in touch.', 'green');
      setTimeout(() => {
        btn.textContent = 'SEND MESSAGE';
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }, 800);
  });
}

// ==============================================
// WIRE UP ALL BUTTONS
// ==============================================
document.addEventListener('DOMContentLoaded', () => {

  // Every "FREE TRIAL" button
  document.querySelectorAll('a[href="#pricing"], .nav-cta').forEach(btn => {
    const text = btn.textContent.trim().toUpperCase();
    if (text.includes('TRIAL') || text.includes('CLAIM') || text.includes('FREE')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openFreeTrialModal();
      });
    }
  });

  // "Book Class" buttons inside class cards
  document.querySelectorAll('.class-card').forEach(card => {
    const bookBtn = card.querySelector('.btn-outline');
    const className = card.querySelector('h3')?.textContent.trim();
    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBookClassModal(className);
      });
    }
  });

  // Pricing "Get Started" buttons
  document.querySelectorAll('.pricing-card').forEach(card => {
    const tier  = card.querySelector('.pricing-tier')?.textContent.trim();
    const getBtn = card.querySelector('.btn');
    if (getBtn) {
      getBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPricingModal(tier);
      });
    }
  });

  // "VIEW ALL CLASSES" and "MORE CLASSES" CTA
  document.querySelectorAll('.classes-cta .btn, .classes-cta a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookClassModal(null);
    });
  });

  // "JOIN US NOW" in about section
  document.querySelectorAll('.about .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFreeTrialModal();
    });
  });

  // "GET STARTED" in why section
  document.querySelectorAll('.why-headline .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFreeTrialModal();
    });
  });

  // CTA banner button
  document.querySelectorAll('.cta-banner .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFreeTrialModal();
    });
  });

  // "READ MORE" / "OUR STORY" button
  document.querySelectorAll('.btn-ghost').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo('#about', { offset: -80, duration: 0.9 });
    });
  });

  // "KNOW MORE" style hero buttons that scroll down
  document.querySelectorAll('.hero-cta .btn-ghost').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo('#about', { offset: -80, duration: 0.9 });
    });
  });

});