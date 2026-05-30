/* ══════════════════════════════════════════════════════════════
   Svaneeng A/S – main.js
   Generel sidefunktionalitet: navigation, scroll, reveal, GDPR,
   kontaktformular-placeholder.
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── HAMBURGER MENU / MOBILE NAV ──────────────────────────────
  const hamburger    = document.querySelector('.hamburger');
  const mobileNav    = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMenu() {
    mobileNav.classList.add('open');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger)    hamburger.addEventListener('click', openMenu);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);

  // Luk ved klik på navigationlinks i mobile menu
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ── NAV SCROLL-EFFEKT ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(function (el) { observer.observe(el); });

  // ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── GDPR MODAL – LUK VED BACKDROP-KLIK ───────────────────────
  const gdprModal = document.getElementById('gdpr-modal');
  if (gdprModal) {
    gdprModal.addEventListener('click', function (e) {
      if (e.target === this) this.style.display = 'none';
    });
  }

  // ── KONTAKTFORMULAR (PLACEHOLDER – BACKEND IKKE KOBLET) ───────
  // OBS: Formularen er ikke koblet til en rigtig backend endnu.
  // Erstat action="" på <form class="kontakt-form"> og håndter submit
  // med et fetch/POST-kald til jeres backend-endpoint inden go-live.
  const kontaktForm = document.querySelector('form.kontakt-form');
  if (kontaktForm) {
    kontaktForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name  = document.getElementById('field-name')?.value?.trim();
      const email = document.getElementById('field-email')?.value?.trim();
      if (!name || !email) {
        alert('Udfyld venligst navn og e-mail.');
        return;
      }
      alert('Tak for din henvendelse, ' + name + '!\nVi vender tilbage hurtigst muligt.');
    });
  }

});
