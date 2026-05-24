/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BotHub — app.js
   Premium interactions & animations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

/* ── 1. CURSOR GLOW ──────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  const LERP = 0.1;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateCursor() {
    cx += (mx - cx) * LERP;
    cy += (my - cy) * LERP;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  // Expand on interactive elements
  const interactives = 'a,button,.bot-card,.price-card,.how-step,.ad-format';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.width  = '600px';
      glow.style.height = '600px';
      glow.style.background = 'radial-gradient(circle, rgba(245,200,66,.18) 0%, transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.width  = '400px';
      glow.style.height = '400px';
      glow.style.background = 'radial-gradient(circle, rgba(124,58,237,.12) 0%, transparent 70%)';
    });
  });
})();

/* ── 2. PARTICLE CANVAS ──────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x    = Math.random() * W;
      this.y    = randomY ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.life   = Math.random();
      this.maxLife= Math.random() * 0.5 + 0.5;
      this.hue    = Math.random() > 0.65 ? 42 : (Math.random() > 0.5 ? 265 : 200);
    }
    update() {
      this.x    += this.speedX;
      this.y    += this.speedY;
      this.life += 0.003;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.55;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 70%, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ── 3. NAVBAR SCROLL BEHAVIOR ───────────────────────────── */
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!nav) return;

  let lastY = 0, hidden = false;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Scrolled state (blur backdrop)
    nav.classList.toggle('scrolled', y > 40);

    // Auto-hide on scroll down, show on scroll up
    if (y > 200) {
      if (y > lastY + 8 && !hidden) {
        nav.style.transform = 'translateY(-100%)';
        nav.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
        hidden = true;
      } else if (y < lastY - 8 && hidden) {
        nav.style.transform = 'translateY(0)';
        hidden = false;
      }
    } else {
      nav.style.transform = 'translateY(0)';
      hidden = false;
    }
    lastY = y;
  }, { passive: true });

  // Mobile menu
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      const spans = burger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }
})();

/* ── 4. SCROLL REVEAL (IntersectionObserver) ─────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal--left, .reveal--right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── 5. COUNTER ANIMATION ────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    (function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(performance.now());
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ── 6. LIVE SUBSCRIBER COUNT (Simulated) ────────────────── */
(function initSubCount() {
  const el = document.getElementById('heroSubCount');
  if (!el) return;

  // Start from a realistic base and animate up
  const base = 2341;
  const end  = 2461;
  const duration = 2200;
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function format(n) {
    return n.toLocaleString('de-DE') + ' Abonnenten';
  }

  // Wait for element to be visible
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      io.disconnect();
      const start = performance.now();
      (function tick() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const val = Math.floor(base + easeOut(progress) * (end - base));
        el.textContent = format(val);
        if (progress < 1) requestAnimationFrame(tick);
        else {
          // Simulate live updates: random +1 every few seconds
          setInterval(() => {
            const current = parseInt(el.textContent.replace(/\D/g, ''));
            if (Math.random() > 0.5) el.textContent = format(current + 1);
          }, 4500 + Math.random() * 3000);
        }
      })();
    }
  }, { threshold: 0.1 });
  io.observe(el);
})();

/* ── 7. SMOOTH SCROLL for anchor links ───────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 8. CARD TILT EFFECT (subtle 3D) ─────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.bot-card, .price-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxTilt = 6;
      card.style.transform = `translateY(-8px) rotateX(${-dy * maxTilt}deg) rotateY(${dx * maxTilt}deg)`;
      card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    });
  });
})();

/* ── 9. MARQUEE pause on hover (CSS handles, JS backup) ─── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  const wrap  = document.querySelector('.marquee-wrap');
  if (!track || !wrap) return;
  wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ── 10. BUTTON RIPPLE EFFECT ────────────────────────────── */
(function initRipple() {
  const buttons = document.querySelectorAll('.btn-hero-primary,.btn-hero-secondary,.card-cta,.price-cta,.ad-cta,.btn-nav-cta');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        width:4px;height:4px;
        border-radius:50%;
        background:rgba(255,255,255,0.4);
        transform:translate(-50%,-50%) scale(0);
        animation:rippleAnim .6s ease-out forwards;
        left:${x}px;top:${y}px;
        pointer-events:none;z-index:10;
      `;
      if (!btn.style.position || btn.style.position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: translate(-50%,-50%) scale(80); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── 11. CONNECTOR LINE DRAW ANIMATION ───────────────────── */
(function initConnectors() {
  const lines = document.querySelectorAll('.connector-line');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.cssText += `
          background: linear-gradient(90deg, rgba(124,58,237,.4), rgba(245,200,66,.4));
          animation: drawLine .8s ease-out forwards;
        `;
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const style = document.createElement('style');
  style.textContent = `
    .connector-line { transform-origin: left; }
    @keyframes drawLine {
      from { clip-path: inset(0 100% 0 0); }
      to   { clip-path: inset(0 0% 0 0); }
    }
  `;
  document.head.appendChild(style);
  lines.forEach(l => io.observe(l));
})();

/* ── 12. PAGE LOAD ANIMATION ─────────────────────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Trigger hero elements after load
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 200);
  });
})();

/* ── 13. ACTIVE NAV LINK ON SCROLL ───────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

console.log('%c⚡ BotHub', 'color:#f5c842;font-size:24px;font-weight:900;');
console.log('%cPowered by Gemini AI • Made in Germany', 'color:#94a3b8;font-size:12px;');
