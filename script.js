/* ============================================================
   Interaktive Glückwunsch-Webseite – Skript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Screen Wechsel ---------- */
  const intro      = document.getElementById('intro');
  const bouquet    = document.getElementById('bouquet');
  const revealBtn  = document.getElementById('revealBtn');

  revealBtn.addEventListener('click', () => {
    intro.classList.remove('active');
    intro.style.display = 'none';
    bouquet.classList.add('active');
    bouquet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    burst(window.innerWidth / 2, window.innerHeight / 2, 60);
  });

  /* ---------- Blumen-Interaktion ---------- */
  const flowers = document.querySelectorAll('.flower');
  const bubble  = document.getElementById('msgBubble');
  let bubbleTimer = null;

  flowers.forEach(flower => {
    flower.addEventListener('click', (e) => {
      const msg = flower.getAttribute('data-msg') || '💗';

      // Pop-Animation neu starten
      flower.classList.remove('popped');
      void flower.offsetWidth;
      flower.classList.add('popped');

      // Nachrichten-Bubble einblenden
      bubble.textContent = msg;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 3800);

      // Herzen sprudeln
      const rect = flower.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
    });
  });

  /* ---------- Finale Overlay ---------- */
  const finaleBtn   = document.getElementById('finaleBtn');
  const finale      = document.getElementById('finale');
  const closeFinale = document.getElementById('closeFinale');

  finaleBtn.addEventListener('click', () => {
    finale.classList.add('show');
    finale.setAttribute('aria-hidden', 'false');
    bigBurst();
  });
  closeFinale.addEventListener('click', () => {
    finale.classList.remove('show');
    finale.setAttribute('aria-hidden', 'true');
  });
  finale.addEventListener('click', (e) => {
    if (e.target === finale) {
      finale.classList.remove('show');
      finale.setAttribute('aria-hidden', 'true');
    }
  });

  /* ============================================================
     Partikel-System: schwebende Blütenblätter + Herzen
     ============================================================ */
  const canvas = document.getElementById('petalCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const petalColors = [
    '#ff8ab0', '#ffb3c6', '#ffd1dc',
    '#c79bff', '#ffd54f', '#ff8a65',
    '#f48fb1', '#ce93d8', '#fff0f5'
  ];

  /* ---- Hintergrund-Blütenblätter (kontinuierlich) ---- */
  const ambient = [];
  const AMBIENT_COUNT = Math.min(28, Math.floor(window.innerWidth / 40));

  function createPetal(x, y) {
    return {
      x: x ?? Math.random() * W,
      y: y ?? Math.random() * -H,
      size: 8 + Math.random() * 14,
      vx: -0.4 + Math.random() * 0.8,
      vy: 0.6 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      spin: -0.03 + Math.random() * 0.06,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      alpha: 0.55 + Math.random() * 0.4
    };
  }
  for (let i = 0; i < AMBIENT_COUNT; i++) ambient.push(createPetal());

  /* ---- Burst-Partikel (Herzen, kurzlebig) ---- */
  const bursts = [];
  function burst(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 4;
      bursts.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 2,
        life: 70 + Math.random() * 30,
        age: 0,
        size: 10 + Math.random() * 14,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        kind: Math.random() > 0.5 ? 'heart' : 'petal',
        angle: Math.random() * Math.PI * 2,
        spin: -0.1 + Math.random() * 0.2
      });
    }
  }

  function bigBurst() {
    const cx = W / 2, cy = H / 2;
    for (let r = 0; r < 6; r++) {
      setTimeout(() => burst(cx, cy, 40), r * 120);
    }
  }

  /* ---- Zeichenfunktionen ---- */
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size, -p.size * 0.7, p.size, p.size * 0.2, 0, p.size * 0.3);
    ctx.bezierCurveTo(-p.size, p.size * 0.2, -p.size, -p.size * 0.7, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    const k = p.size / 14;
    ctx.scale(k, k);
    ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.bezierCurveTo(-8, -16, -18, -2, 0, 10);
    ctx.bezierCurveTo(18, -2, 8, -16, 0, -4);
    ctx.fill();
    ctx.restore();
  }

  /* ---- Animations-Loop ---- */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Hintergrund-Blütenblätter
    for (const p of ambient) {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      if (p.y > H + 30) { p.y = -20; p.x = Math.random() * W; }
      if (p.x < -30)    p.x = W + 20;
      if (p.x > W + 30) p.x = -20;
      drawPetal(p);
    }

    // Burst-Partikel
    for (let i = bursts.length - 1; i >= 0; i--) {
      const p = bursts[i];
      p.age++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;                 // Schwerkraft
      p.vx *= 0.99;
      p.angle += p.spin;
      if (p.kind === 'heart') drawHeart(p);
      else drawPetal({ ...p, alpha: Math.max(0, 1 - p.age / p.life) });
      if (p.age >= p.life) bursts.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }
  loop();

  /* ---- Klick irgendwo: kleine Herzen ---- */
  window.addEventListener('click', (e) => {
    if (e.target.closest('.flower')) return; // Blumen haben eigene Bursts
    if (e.target.closest('button'))  return;
    burst(e.clientX, e.clientY, 8);
  });

  /* ---- Tasten-Spaß: Leertaste = Herzen-Regen ---- */
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      for (let i = 0; i < 30; i++) {
        setTimeout(() => burst(Math.random() * W, -20, 4), i * 40);
      }
    }
  });
})();
