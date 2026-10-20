/* ============================================
   РОМАНТИЧЕСКИЙ САЙТ ДЛЯ АЙПЕРИ — 20 ЛЕТ
   ============================================ */

/* ---------- 1. Плавающие сердечки на splash ---------- */
(function createFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const symbols = ['❤', '♥', '♡', '❤'];
  for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.fontSize = (12 + Math.random() * 24) + 'px';
    span.style.animationDuration = (7 + Math.random() * 8) + 's';
    span.style.animationDelay = (Math.random() * 8) + 's';
    span.style.opacity = 0.3 + Math.random() * 0.5;
    container.appendChild(span);
  }
})();

/* ---------- 2. Конфетти на canvas ---------- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const s = size / 16;
  ctx.moveTo(x, y + 4 * s);
  ctx.bezierCurveTo(x, y, x - 8 * s, y, x - 8 * s, y + 4 * s);
  ctx.bezierCurveTo(x - 8 * s, y + 8 * s, x, y + 14 * s, x, y + 16 * s);
  ctx.bezierCurveTo(x, y + 14 * s, x + 8 * s, y + 8 * s, x + 8 * s, y + 4 * s);
  ctx.bezierCurveTo(x + 8 * s, y, x, y, x, y + 4 * s);
  ctx.fill();
}

function createConfetti(count = 90) {
  const colors = ['#ff4d8d', '#f0c975', '#ffb3ce', '#ffffff', '#c2185b', '#ffd0e0'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -30 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2 + Math.random() * 4,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.45 ? 'heart' : 'rect'
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.y < canvas.height + 60);

  particles.forEach(p => {
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

    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
    } else {
      drawHeart(ctx, 0, -p.size / 2, p.size);
    }
    ctx.restore();
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ---------- 3. Открытие подарка (splash) ---------- */
const splash = document.getElementById('splash');
const openBtn = document.getElementById('openBtn');

openBtn.addEventListener('click', () => {
  // Мягкая вибрация (если поддерживается)
  if (navigator.vibrate) navigator.vibrate(30);

  splash.classList.add('hidden');
  document.body.style.overflow = '';
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  // Конфетти
  setTimeout(() => createConfetti(110), 200);
  setTimeout(() => createConfetti(60), 900);

  // Запускаем музыку с первого жеста
  startMusic();
});

/* ---------- 4. Reveal-анимация при скролле ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  observer.observe(el);
});

/* ---------- 5. Музыка (Web Audio API — нежный перезвон) ---------- */
let audioCtx = null;
let musicPlaying = false;
let musicTimer = null;

const musicBtn = document.getElementById('musicToggle');

const melody = [
  523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 587.33, 698.46,
  880.00, 1046.50, 880.00, 698.46, 523.25, 659.25, 783.99, 659.25
];
let noteIndex = 0;

function startMusic() {
  if (musicPlaying) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  musicPlaying = true;
  musicBtn.classList.add('playing');

  const playNote = () => {
    if (!musicPlaying) return;
    const now = audioCtx.currentTime;
    const freq = melody[noteIndex % melody.length];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.6);

    // лёгкий «эхо»-обертон октавой выше
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.025, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2).connect(audioCtx.destination);
    osc2.start(now);
    osc2.stop(now + 1.3);

    noteIndex++;
  };

  playNote();
  musicTimer = setInterval(playNote, 720);
}

function stopMusic() {
  musicPlaying = false;
  musicBtn.classList.remove('playing');
  if (musicTimer) clearInterval(musicTimer);
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});

/* ---------- 6. Финальная кнопка — сердечный взрыв ---------- */
const loveBtn = document.getElementById('loveBtn');
loveBtn.addEventListener('click', (e) => {
  if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
  createConfetti(140);
  setTimeout(() => createConfetti(80), 500);

  // Временная замена текста
  const original = loveBtn.textContent;
  loveBtn.textContent = 'Я так и знал ❤ Я тоже тебя люблю';
  loveBtn.style.background = 'linear-gradient(135deg, #f0c975, #ff4d8d)';

  setTimeout(() => {
    loveBtn.textContent = original;
    loveBtn.style.background = '';
  }, 3200);
});

/* ---------- 7. Лёгкий tilt-эффект фото при наклоне ---------- */
if (window.DeviceOrientationEvent) {
  let lastX = 0;
  window.addEventListener('deviceorientation', (e) => {
    const gamma = e.gamma || 0;
    if (Math.abs(gamma - lastX) > 4) {
      document.querySelectorAll('.photo-card').forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const offset = Math.max(-3, Math.min(3, gamma / 12));
        card.style.transform = `rotate(${dir * 3.5 + offset}deg)`;
      });
      lastX = gamma;
    }
  });
}

/* ---------- 8. Небольшая защита от случайного зума ---------- */
document.addEventListener('gesturestart', (e) => e.preventDefault());
