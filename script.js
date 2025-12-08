document.addEventListener('click', function (event) {
  const toggle = event.target.closest('#mobile-menu-toggle');
  if (toggle) {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
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