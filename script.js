/* ═══════════════════════════════════════
   BIRTHDAY SURPRISE — script.js (FIXED)
════════════════════════════════════════ */

'use strict';

// ── GLOBALS ──────────────────────────────
const PASSCODE = '1465';  // ✅ FIXED PASSWORD
let currentPin = '';
let currentPage = 'page-password';
let typingIndex = 0;
let typingLineIndex = 0;
let fireworksAnim = null;
let audioCtx = null;
let envelopeOpened = false;

const typingLines = [
  'Thank you for being my safe place. 🌸',
  'Every memory with you feels special. 💫',
  'You deserve the happiest birthday ever. 🎂',
  'Here\'s to another year of us being chaotic together. 🥂',
  'You are my favourite person, always. 💖',
];

// ── LOADING SCREEN ───────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    ls.classList.add('hidden');
    setTimeout(() => {
      ls.style.display = 'none';
      initPasswordPage();
    }, 900);
  }, 2800);
});

// ── CUSTOM CURSOR ────────────────────────
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7)');
document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

// ── PAGE NAVIGATION ──────────────────────
function goTo(pageId) {
  const overlay = document.getElementById('transition-overlay');
  overlay.classList.add('flash');
  setTimeout(() => {
    hidePage(currentPage);
    showPage(pageId);
    currentPage = pageId;
    overlay.classList.remove('flash');
    updateNavDots(pageId);
    onPageEnter(pageId);
  }, 500);
}

function hidePage(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}
function showPage(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function onPageEnter(id) {
  if (id === 'page-hero') initHeroPage();
  if (id === 'page-memories') initMemoriesPage();
  if (id === 'page-letter') initLetterPage();
  if (id === 'page-final') initFinalPage();
}

// Nav dots
function updateNavDots(pageId) {
  const dotsEl = document.getElementById('nav-dots');
  const dots = dotsEl.querySelectorAll('.nav-dot');
  const pages = ['page-hero', 'page-memories', 'page-letter', 'page-final'];
  if (pageId === 'page-password') {
    dotsEl.classList.remove('visible');
  } else {
    dotsEl.classList.add('visible');
    dots.forEach((d, i) => {
      d.classList.toggle('active', pages[i] === pageId);
    });
  }
}

document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const target = dot.getAttribute('data-page');
    if (target !== currentPage) goTo(target);
  });
});

// ─────────────────────────────────────────
// PAGE 1 — PASSWORD
// ─────────────────────────────────────────
function initPasswordPage() {
  drawPasswordBg();
  setupKeypad();
}

function setupKeypad() {
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-val');
      if (v === 'clear') {
        currentPin = currentPin.slice(0, -1);
      } else if (v === 'enter') {
        checkPin();
      } else {
        if (currentPin.length < 4) currentPin += v;
        if (currentPin.length === 4) setTimeout(checkPin, 200);
      }
      updatePinDisplay();
      playTick();
    });
  });
}

function updatePinDisplay() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('d' + i);
    dot.classList.toggle('filled', i < currentPin.length);
  }
}

function checkPin() {
  if (currentPin === PASSCODE) {
    playSuccess();
    document.querySelectorAll('.pin-dot').forEach(d => {
      d.style.background = '#00ff88';
      d.style.boxShadow = '0 0 12px #00ff88';
    });
    setTimeout(() => goTo('page-hero'), 700);
  } else {
    playError();
    const lockBox = document.querySelector('.lock-box');
    lockBox.classList.add('shake');
    lockBox.addEventListener('animationend', () => lockBox.classList.remove('shake'), { once: true });
    const errEl = document.getElementById('pin-error');
    errEl.classList.add('show');
    setTimeout(() => errEl.classList.remove('show'), 1800);
    currentPin = '';
    updatePinDisplay();
  }
}

function drawPasswordBg() {
  const canvas = document.getElementById('password-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.5 + 0.2),
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#ff6b9d' : '#00bfff',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─────────────────────────────────────────
// PAGE 2 — HERO
// ─────────────────────────────────────────
function initHeroPage() {
  startTyping();
  startCountdown();
  spawnFloatingHearts();
  drawHeroBg();
}

function drawHeroBg() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      opacity: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = alpha * s.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function startTyping() {
  const el = document.getElementById('typing-el');
  if (!el) return;
  el.textContent = '';
  typingLineIndex = 0;
  typingIndex = 0;
  typeNextChar(el);
}

function typeNextChar(el) {
  const line = typingLines[typingLineIndex];
  if (typingIndex < line.length) {
    el.textContent += line[typingIndex];
    typingIndex++;
    setTimeout(() => typeNextChar(el), 55 + Math.random() * 30);
  } else {
    setTimeout(() => fadeOutTyping(el), 2400);
  }
}

function fadeOutTyping(el) {
  el.style.transition = 'opacity 0.5s';
  el.style.opacity = '0';
  setTimeout(() => {
    typingLineIndex = (typingLineIndex + 1) % typingLines.length;
    typingIndex = 0;
    el.textContent = '';
    el.style.opacity = '1';
    typeNextChar(el);
  }, 600);
}

// ✅ COUNTDOWN — correctly targeting June 14
function startCountdown() {
  function getNextBirthday() {
    const now = new Date();
    const thisYear = now.getFullYear();
    // Month is 0-indexed: 5 = June, day = 14
    let bday = new Date(thisYear, 5, 14, 0, 0, 0);
    if (now > bday) {
      bday = new Date(thisYear + 1, 5, 14, 0, 0, 0);
    }
    return bday;
  }

  function update() {
    const now = new Date();
    const birthday = getNextBirthday();
    const diff = birthday - now;

    if (diff <= 0) {
      // It's her birthday TODAY!
      document.getElementById('ct-d').textContent = '00';
      document.getElementById('ct-h').textContent = '00';
      document.getElementById('ct-m').textContent = '00';
      document.getElementById('ct-s').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('ct-d').textContent = String(d).padStart(2, '0');
    document.getElementById('ct-h').textContent = String(h).padStart(2, '0');
    document.getElementById('ct-m').textContent = String(m).padStart(2, '0');
    document.getElementById('ct-s').textContent = String(s).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

function spawnFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  if (!container) return;
  container.innerHTML = '';
  const symbols = ['♥', '✦', '✿', '★', '♥', '✨'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('span');
    el.className = 'fh';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.setProperty('--dur', (3 + Math.random() * 5) + 's');
    el.style.setProperty('--delay', (Math.random() * 6) + 's');
    el.style.setProperty('--sz', (0.8 + Math.random() * 1.2) + 'rem');
    el.style.left = (Math.random() * 100) + '%';
    el.style.bottom = (Math.random() * 30) + '%';
    container.appendChild(el);
  }
}

// ─────────────────────────────────────────
// PAGE 3 — MEMORIES
// ─────────────────────────────────────────
function initMemoriesPage() {
  setupLightbox();
}

function setupLightbox() {
  const lb = document.getElementById('lightbox');
  const lbInner = document.getElementById('lightbox-inner');
  const lbClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.mem-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgEl = card.querySelector('.mem-img');
      const cap = card.querySelector('.mem-caption').textContent;
      const bgStyle = imgEl.style.backgroundImage || '';
      lbInner.innerHTML = `
        <div class="lb-img" style="background-image:${bgStyle};background-size:cover;background-position:center;"></div>
        <p class="lb-cap">${cap}</p>
      `;
      lb.classList.add('open');
    });
  });

  lbClose.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
}

// ─────────────────────────────────────────
// PAGE 4 — LETTER
// ─────────────────────────────────────────
function initLetterPage() {
  spawnPetals();
  if (!envelopeOpened) resetEnvelope();
}

function resetEnvelope() {
  const env = document.getElementById('envelope');
  const lp = document.getElementById('letter-paper');
  const btn = document.getElementById('letter-next-btn');
  env.classList.remove('open');
  env.style.display = 'block';
  env.style.opacity = '1';
  lp.innerHTML = buildLetterPaper();
  lp.classList.remove('visible');
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
}

function buildLetterPaper() {
  return `
    <div class="letter-paper-inner">
      <p class="letter-date">on your special day 🌸</p>
      <h3 class="letter-greeting">Dear Moni,</h3>
      <div class="letter-body" id="letter-body"></div>
      <p class="letter-sign">— always yours 💖</p>
      <div class="letter-deco">✦ ✦ ✦</div>
    </div>
  `;
}

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  const env = document.getElementById('envelope');
  env.classList.add('open');
  playChime();
  setTimeout(() => {
    env.style.transition = 'opacity 0.6s ease';
    env.style.opacity = '0';
    setTimeout(() => {
      env.style.display = 'none';
      const lp = document.getElementById('letter-paper');
      lp.classList.add('visible');
      setTimeout(() => typeLetter(), 600);
    }, 600);
  }, 700);
}

const letterText = `Even when life gets messy and the world feels heavy,
thank you for always being by my side and true to our friendship.

You are the kind of person who doesn't leave me alone.
Your presence is my comfort.

Let's forget about the past that was hard and let's look at the future for a moment,
and just celebrate your birthday today, Moni. It's the day you came into this world
and made it a better place for everyone around you, especially me.

I hope this year brings you everything you deserve —
happiness without conditions, love without limits,
and beautiful moments you'll treasure forever.

Thank you for being you. Thank you for being my friend.
Happy Birthday, Moni. 🌸`;

function typeLetter() {
  const el = document.getElementById('letter-body');
  if (!el) return;
  let i = 0;
  el.textContent = '';
  const interval = setInterval(() => {
    if (i < letterText.length) {
      el.textContent += letterText[i];
      i++;
    } else {
      clearInterval(interval);
      const btn = document.getElementById('letter-next-btn');
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
    }
  }, 22);
}

function spawnPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  container.innerHTML = '';
  const petalSymbols = ['🌸', '🌺', '✿', '❀', '🌹', '🌷'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
    el.style.left = (Math.random() * 100) + '%';
    el.style.setProperty('--dur', (4 + Math.random() * 6) + 's');
    el.style.setProperty('--delay', (Math.random() * 8) + 's');
    el.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
    container.appendChild(el);
  }
}

// ─────────────────────────────────────────
// PAGE 5 — FINAL
// ─────────────────────────────────────────
function initFinalPage() {
  spawnBalloons();
  spawnConfetti();
  startFireworks();
  animateCake();
  setTimeout(() => playFinalChime(), 200);
}

// ✅ IMPROVED CAKE ANIMATION
function animateCake() {
  const cake = document.getElementById('cake');
  if (!cake) return;
  cake.style.animation = 'none';
  cake.offsetHeight; // reflow
  cake.style.animation = 'cakePop 0.9s cubic-bezier(0.17,0.89,0.32,1.28) both';

  // Animate flames with glow
  const flames = cake.querySelectorAll('.ck-flame');
  flames.forEach((f, i) => {
    f.style.animationDelay = (i * 0.1) + 's';
  });
}

function spawnBalloons() {
  const row = document.getElementById('balloons-row');
  if (!row) return;
  row.innerHTML = '';
  const colors = ['#8b0000', '#c0392b', '#ff6b9d', '#00bfff', '#a855f7', '#ff4488', '#ff6600'];
  for (let i = 0; i < 9; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.background = `radial-gradient(circle at 35% 35%, ${lighten(colors[i % colors.length])}, ${colors[i % colors.length]})`;
    b.style.setProperty('--speed', (2.5 + Math.random() * 2) + 's');
    b.style.setProperty('--delay', (Math.random() * 2) + 's');
    b.style.marginBottom = (Math.random() * 30 + 10) + 'px';
    row.appendChild(b);
  }
}

function lighten(hex) {
  return hex + 'aa';
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#ff6b9d', '#00bfff', '#ffd700', '#ff4444', '#44ff88', '#ff44ff', '#ffaa00'];
  const shapes = [50, 0, 2];
  for (let i = 0; i < 120; i++) {
    const c = document.createElement('div');
    c.className = 'conf-piece';
    c.style.left = (Math.random() * 100) + '%';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.setProperty('--dur', (2 + Math.random() * 3) + 's');
    c.style.setProperty('--delay', (Math.random() * 3) + 's');
    c.style.setProperty('--br', shapes[Math.floor(Math.random() * shapes.length)] + '%');
    c.style.width = (5 + Math.random() * 8) + 'px';
    c.style.height = (5 + Math.random() * 12) + 'px';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(c);
  }
}

function startFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  function createBurst(x, y) {
    const colors = ['#ff6b9d', '#00bfff', '#ffd700', '#ff4444', '#ffffff', '#ff44ff'];
    const count = 55 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        r: 2 + Math.random() * 2,
        decay: 0.013 + Math.random() * 0.01,
        gravity: 0.08,
      });
    }
  }

  function autoLaunch() {
    const x = 100 + Math.random() * (canvas.width - 200);
    const y = 80 + Math.random() * (canvas.height * 0.5);
    createBurst(x, y);
    playFireworkSound();
  }

  let launchCount = 0;
  const launchInterval = setInterval(() => {
    autoLaunch();
    launchCount++;
    if (launchCount >= 20) clearInterval(launchInterval);
  }, 400);

  canvas.addEventListener('click', e => {
    createBurst(e.clientX, e.clientY);
    playFireworkSound();
  });

  function drawFireworks() {
    ctx.fillStyle = 'rgba(5,5,7,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.r * 0.6;
      ctx.globalAlpha = p.alpha * 0.4;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    fireworksAnim = requestAnimationFrame(drawFireworks);
  }
  drawFireworks();
}

// Replay
function replayAll() {
  envelopeOpened = false;
  if (fireworksAnim) cancelAnimationFrame(fireworksAnim);
  goTo('page-password');
  currentPin = '';
  updatePinDisplay();
  setTimeout(() => updateNavDots('page-password'), 600);
}

// Easter egg
function showEasterEgg() {
  document.getElementById('easter-egg').classList.add('show');
}
function hideEasterEgg() {
  document.getElementById('easter-egg').classList.remove('show');
}

// ─────────────────────────────────────────
// AUDIO — Web Audio API
// ─────────────────────────────────────────
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function playError() {
  try {
    const ctx = getAudioCtx();
    [200, 170].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.15);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  } catch (e) {}
}

function playSuccess() {
  try {
    const ctx = getAudioCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) {}
}

function playChime() {
  try {
    const ctx = getAudioCtx();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);
      osc.start(ctx.currentTime + i * 0.2);
      osc.stop(ctx.currentTime + i * 0.2 + 0.5);
    });
  } catch (e) {}
}

// ✅ HAPPY BIRTHDAY SONG — played with Web Audio API (no mp3 needed!)
function playFinalChime() {
  try {
    const ctx = getAudioCtx();
    // Happy Birthday notes: C C D C F E | C C D C G F | C C C5 A F E D | Bb Bb A F G F
    const notes = [
      // "Happy Birth-day to you"
      { f: 264, t: 0.00, d: 0.2 },
      { f: 264, t: 0.22, d: 0.2 },
      { f: 297, t: 0.44, d: 0.35 },
      { f: 264, t: 0.82, d: 0.35 },
      { f: 352, t: 1.20, d: 0.35 },
      { f: 330, t: 1.65, d: 0.6  },
      // "Happy Birth-day to you"
      { f: 264, t: 2.40, d: 0.2 },
      { f: 264, t: 2.62, d: 0.2 },
      { f: 297, t: 2.84, d: 0.35 },
      { f: 264, t: 3.22, d: 0.35 },
      { f: 396, t: 3.60, d: 0.35 },
      { f: 352, t: 4.05, d: 0.6  },
      // "Happy Birth-day dear Mo-ni"
      { f: 264, t: 4.80, d: 0.2 },
      { f: 264, t: 5.02, d: 0.2 },
      { f: 528, t: 5.24, d: 0.35 },
      { f: 440, t: 5.62, d: 0.35 },
      { f: 352, t: 6.00, d: 0.35 },
      { f: 330, t: 6.38, d: 0.35 },
      { f: 297, t: 6.76, d: 0.6  },
      // "Happy Birth-day to you"
      { f: 466, t: 7.50, d: 0.2 },
      { f: 466, t: 7.72, d: 0.2 },
      { f: 440, t: 7.94, d: 0.35 },
      { f: 352, t: 8.32, d: 0.35 },
      { f: 396, t: 8.70, d: 0.35 },
      { f: 352, t: 9.15, d: 0.8  },
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Add vibrato for a nicer sound
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 5;
      vibratoGain.gain.value = 4;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(ctx.currentTime + note.t);
      vibrato.stop(ctx.currentTime + note.t + note.d + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = note.f;
      gain.gain.setValueAtTime(0, ctx.currentTime + note.t);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + note.t + 0.02);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + note.t + note.d - 0.03);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + note.t + note.d);
      osc.start(ctx.currentTime + note.t);
      osc.stop(ctx.currentTime + note.t + note.d + 0.05);
    });
  } catch (e) {}
}

function playFireworkSound() {
  try {
    const ctx = getAudioCtx();
    const bufLen = ctx.sampleRate * 0.3;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 800;
    filter.Q.value = 0.5;
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.start();
    src.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// ─────────────────────────────────────────
// WINDOW RESIZE
// ─────────────────────────────────────────
window.addEventListener('resize', () => {
  const pwCanvas = document.getElementById('password-canvas');
  if (pwCanvas) { pwCanvas.width = window.innerWidth; pwCanvas.height = window.innerHeight; }
  const hCanvas = document.getElementById('hero-canvas');
  if (hCanvas) { hCanvas.width = window.innerWidth; hCanvas.height = window.innerHeight; }
  const fCanvas = document.getElementById('fireworks-canvas');
  if (fCanvas) { fCanvas.width = window.innerWidth; fCanvas.height = window.innerHeight; }
});

// ─────────────────────────────────────────
// TOUCH SUPPORT FOR MOBILE
// ─────────────────────────────────────────
document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  cursor.style.left = touch.clientX + 'px';
  cursor.style.top = touch.clientY + 'px';
  cursorTrail.style.left = touch.clientX + 'px';
  cursorTrail.style.top = touch.clientY + 'px';
});

// ─────────────────────────────────────────
// KONAMI CODE EASTER EGG
// ─────────────────────────────────────────
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      showEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
