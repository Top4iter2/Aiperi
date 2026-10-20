/* ==========================================
   САЙТ-ПОЗДРАВЛЕНИЕ ДЛЯ АЙПЕРИ (20 ЛЕТ)
   Полностью оптимизирован для мобильных
   ========================================== */

/* ---------- 1. Плавающие звёздочки на splash ---------- */
(function floatingHearts() {
  const container = document.getElementById('heartsBg');
  const symbols = ['✦', '✧', '❤', '♥', '❋'];
  const count = 15; // ограничено для плавности
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (10 + Math.random() * 20) + 'px';
    s.style.animationDuration = (8 + Math.random() * 8) + 's';
    s.style.animationDelay = (Math.random() * 8) + 's';
    s.style.opacity = 0.25 + Math.random() * 0.5;
    container.appendChild(s);
  }
})();

/* ---------- 2. Canvas-конфетти ---------- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiRunning = false;
const MAX_PARTICLES = 100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 150);
});

function drawHeart(c, x, y, size) {
  c.beginPath();
  const s = size / 16;
  c.moveTo(x, y + 4 * s);
  c.bezierCurveTo(x, y, x - 8 * s, y, x - 8 * s, y + 4 * s);
  c.bezierCurveTo(x - 8 * s, y + 8 * s, x, y + 14 * s, x, y + 16 * s);
  c.bezierCurveTo(x, y + 14 * s, x + 8 * s, y + 8 * s, x + 8 * s, y + 4 * s);
  c.bezierCurveTo(x + 8 * s, y, x, y, x, y + 4 * s);
  c.fill();
}

function drawStar(c, size) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? size * 0.5 : size * 0.2;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  c.closePath();
  c.fill();
}

function createConfetti(count = 70) {
  // Ограничиваем количество для плавности
  if (particles.length + count > MAX_PARTICLES) {
    count = MAX_PARTICLES - particles.length;
  }
  if (count <= 0) return;

  const colors = ['#e05a7c', '#e8c977', '#f5c6d3', '#ffffff', '#a83a5a', '#ffe0ea'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -30 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2 + Math.random() * 4,
      size: 6 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.5 ? 'heart' : 'star'
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.y < canvas.height + 60);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.vx *= 0.995;
    p.rotation += p.rotSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.95;
    if (p.shape === 'heart') drawHeart(ctx, 0, -p.size / 2, p.size);
    else drawStar(ctx, p.size);
    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ---------- 3. Вспышка на экране ---------- */
function triggerFlash() {
  const flash = document.getElementById('flash');
  flash.classList.remove('active');
  void flash.offsetWidth; // reflow, чтобы анимация перезапустилась
  flash.classList.add('active');
}

/* ---------- 4. Взрыв звёзд из точки ---------- */
function burstAt(x, y, count = 24) {
  const burst = document.createElement('div');
  burst.className = 'burst';
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';

  const symbols = ['✦', '✧', '❤', '★'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.fontSize = (10 + Math.random() * 14) + 'px';
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 100 + Math.random() * 200;
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    s.style.animationDelay = (Math.random() * 0.2) + 's';
    burst.appendChild(s);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 2000);
}

/* ---------- 5. Открытие splash ---------- */
const splash = document.getElementById('splash');
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  if (navigator.vibrate) navigator.vibrate(25);
  splash.classList.add('hidden');
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  setTimeout(() => createConfetti(80), 200);
  setTimeout(() => createConfetti(50), 800);
  startMusic();
});

/* ---------- 6. Reveal при скролле ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.06 + 's';
  observer.observe(el);
});

/* ---------- 7. Музыка (Web Audio) ---------- */
let audioCtx = null, musicPlaying = false, musicTimer = null, noteIndex = 0;
const musicBtn = document.getElementById('musicToggle');

const melody = [
  523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 587.33, 698.46,
  880.00, 1046.50, 880.00, 698.46, 523.25, 659.25, 783.99, 659.25
];

function startMusic() {
  if (musicPlaying) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  musicPlaying = true;
  musicBtn.classList.add('playing');

  const playNote = () => {
    if (!musicPlaying) return;
    const now = audioCtx.currentTime;
    const freq = melody[noteIndex % melody.length];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine
