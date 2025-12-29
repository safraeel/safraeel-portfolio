document.addEventListener('click', function (event) {
  const toggle = event.target.closest('#mobile-menu-toggle');
  if (toggle) {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
      document.body.classList.toggle('mobile-open');
    }
    return;
  }

  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  event.preventDefault();

  const header = document.querySelector('header');
  const headerOffset = header ? header.offsetHeight + 12 : 0;
  const elementPosition = target.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset;

  const menu = document.getElementById('mobile-menu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }

  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
});

// Fake contact form handling
document.addEventListener('submit', function (event) {
  const form = event.target.closest('#contact-form');
  if (!form) return;

  event.preventDefault();

  const status = document.getElementById('contact-form-status');
  if (status) {
    status.textContent = 'Got it! This is a demo form – send me a WhatsApp or Telegram message and I will reply there.';
  }
});

// Projects filter + modal logic
document.addEventListener('click', function (event) {
  const filterBtn = event.target.closest('[data-filter]');
  if (filterBtn) {
    const filter = filterBtn.getAttribute('data-filter');
    document.querySelectorAll('[data-project]').forEach(card => {
      const types = card.getAttribute('data-project').split(' ');
      if (filter === 'all' || types.includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    // active state
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('ring-2','ring-white/10'));
    filterBtn.classList.add('ring-2','ring-white/10');
    return;
  }

  // Open modal when clicking project card
  const card = event.target.closest('[data-open-project]');
  if (card) {
    const img = card.querySelector('img').getAttribute('src');
    const title = card.getAttribute('data-title') || '';
    const desc = card.getAttribute('data-desc') || '';
    const link = card.getAttribute('data-link') || '';
    const backdrop = document.getElementById('project-modal');
    if (!backdrop) return;
    backdrop.querySelector('.modal-body img').src = img;
    backdrop.querySelector('.modal-title').textContent = title;
    backdrop.querySelector('.modal-desc').textContent = desc;
    const cta = backdrop.querySelector('.modal-cta');
    if (link) {
      cta.href = link;
      cta.style.display = '';
    } else {
      cta.style.display = 'none';
    }
    // open modal, set aria and lock scroll
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';

    // Focus management: trap focus inside modal
    const modal = backdrop.querySelector('.modal-content');
    if (modal) {
      // save previously focused element
      window.__previousActiveEl = document.activeElement;
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length-1];
      // focus first interactive element (close button or cta)
      if (first) first.focus();

      // attach trap handler
      window.__modalTrap = function(e) {
        if (e.key !== 'Tab') return;
        if (focusable.length === 0) { e.preventDefault(); return; }
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', window.__modalTrap);
    }
    return;
  }

  // Close modal when clicking backdrop (outside modal-content) or data-modal-close
  if (event.target.id === 'project-modal' || event.target.closest('[data-modal-close]')) {
    const backdrop = document.getElementById('project-modal');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      // restore focus and remove trap
      if (window.__modalTrap) {
        document.removeEventListener('keydown', window.__modalTrap);
        window.__modalTrap = null;
      }
      if (window.__previousActiveEl) {
        try { window.__previousActiveEl.focus(); } catch (e) {}
        window.__previousActiveEl = null;
      }
    }
  }
});

// Close modal with Escape key and prevent body scroll while open
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const backdrop = document.getElementById('project-modal');
    if (backdrop && backdrop.classList.contains('open')) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      if (window.__modalTrap) {
        document.removeEventListener('keydown', window.__modalTrap);
        window.__modalTrap = null;
      }
      if (window.__previousActiveEl) {
        try { window.__previousActiveEl.focus(); } catch (e) {}
        window.__previousActiveEl = null;
      }
    }
  }
});

// Sticky nav CTA: toggles `.sticky` class after scrolling past a threshold
(function () {
  const navCta = document.getElementById('nav-cta') || document.querySelector('.nav-cta');
  if (!navCta) return;
  const THRESHOLD = 220;
  let ticking = false;
  function update() {
    if (window.scrollY > THRESHOLD) navCta.classList.add('sticky');
    else navCta.classList.remove('sticky');
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // initialize state
  update();
})();

// Header shrink + logo tweak on scroll, and gentle CTA entrance
(function () {
  const header = document.querySelector('header');
  const logo = document.querySelector('.site-logo');
  const cta = document.getElementById('nav-cta') || document.querySelector('.nav-cta');
  if (!header) return;

  const SCROLL = 40;
  let tickingH = false;
  function check() {
    if (window.scrollY > SCROLL) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    tickingH = false;
  }
  function onScrollH() {
    if (!tickingH) { window.requestAnimationFrame(check); tickingH = true; }
  }
  window.addEventListener('scroll', onScrollH, { passive: true });
  // CTA gentle entrance
  if (cta) { cta.classList.add('enter'); setTimeout(() => cta.classList.remove('enter'), 600); }
})();

// Micro-tilt effect on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});