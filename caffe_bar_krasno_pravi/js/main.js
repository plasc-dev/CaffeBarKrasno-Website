/* Caffe bar Krasno — interakcije */
(function () {
  'use strict';

  /* ---- NAVBAR scrolled state ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- MOBILE MENU ---- */
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- MENI tabs ---- */
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        tabs.forEach((t) => t.classList.toggle('active', t === tab));
        sections.forEach((s) => s.classList.toggle('active', s.id === target));
      });
    });
  }

  /* ---- RECENZIJE carousel ---- */
  const cards = Array.from(document.querySelectorAll('.review-card'));
  if (cards.length) {
    let idx = 0;
    const total = cards.length;

    const update = () => {
      cards.forEach((card, i) => {
        const diff = (i - idx + total) % total;
        let pos = 'hidden';
        if (diff === 0) pos = 'center';
        else if (diff === 1) pos = 'right';
        else if (diff === total - 1) pos = 'left';
        card.dataset.pos = pos;
      });
      document.querySelectorAll('.review-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    };

    const next = () => { idx = (idx + 1) % total; update(); };
    const prev = () => { idx = (idx - 1 + total) % total; update(); };

    document.querySelector('.review-next')?.addEventListener('click', next);
    document.querySelector('.review-prev')?.addEventListener('click', prev);

    document.querySelectorAll('.review-dot').forEach((d, i) => {
      d.addEventListener('click', () => { idx = i; update(); });
    });

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (card.dataset.pos === 'center') return;
        idx = i;
        update();
      });
    });

    /* swipe na mobitelu */
    let touchStart = null;
    const stage = document.querySelector('.reviews-stage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        if (touchStart === null) return;
        const dx = e.changedTouches[0].clientX - touchStart;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchStart = null;
      });
    }

    /* tipke ← → */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    update();
  }

  /* ---- LIGHTBOX galerija ---- */
  const items = document.querySelectorAll('.gallery-item');
  if (items.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Zatvori">×</button>
      <img alt="" />
    `;
    document.body.appendChild(lightbox);
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');

    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    items.forEach((it) => {
      it.addEventListener('click', () => {
        const img = it.querySelector('img');
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    lbClose.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  /* ---- HIGHLIGHT trenutnog dana u radnom vremenu ---- */
  const hoursList = document.querySelector('.hours-list');
  if (hoursList) {
    const today = new Date().getDay(); // 0 ned ... 6 sub
    const map = { 1: 'pon', 2: 'uto', 3: 'sri', 4: 'cet', 5: 'pet', 6: 'sub', 0: 'ned' };
    const key = map[today];
    const li = hoursList.querySelector(`li[data-day="${key}"]`);
    if (li) li.classList.add('today');
  }

  /* ---- BLAGE entrance animacije pri scrollu ---- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
  }
})();
