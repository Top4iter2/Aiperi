/* ==========================================
   САЙТ-ПОЗДРАВЛЕНИЕ ДЛЯ АЙПЕРИ (20 ЛЕТ)
   ========================================== */

/* ---------- 1. Плавающие сердечки на splash ---------- */
(function floatingHearts() {
  const container = document.getElementById('heartsBg');
  const symbols = ['✦', '✧', '❤', '♥', '❋'];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('span');
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (10 + Math.random() * 22) + 'px';
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

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

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

function createConfetti(count = 90) {
  const colors = ['#e05a7c', '#e8c977', '#f5c6d3', '#ffffff', '#a83a5a', '#ffe0ea'];
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
      shape: Math.random() > 0.5 ? 'heart' : 'star'
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
    p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.995;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.95;
    if (p.shape === 'heart') drawHeart(ctx, 0, -p.size / 2, p.size);
    else drawStar(ctx, p.size);
    ctx.restore();
  });
  if (particles.length > 0) requestAnimationFrame(animateConfetti);
  else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* ---------- 3. Открытие splash ---------- */
const splash = document.getElementById('splash');
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  if (navigator.vibrate) navigator.vibrate(25);
  splash.classList.add('hidden');
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  setTimeout(() => createConfetti(100), 200);
  setTimeout(() => createConfetti(60), 900);
  startMusic();
});

/* ---------- 4. Reveal при скролле ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
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

/* ---------- 5. Музыка (Web Audio — нежная мелодия) ---------- */
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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.7);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.018, now + 0.04);
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
  if (musicPlaying) stopMusic();
  else startMusic();
});

/* ---------- 6. КОНВЕРТ И ЧУДО ---------- */
const envelope = document.getElementById('envelope');
const miracleOverlay = document.getElementById('miracleOverlay');
const miracleStars = document.getElementById('miracleStars');
const miracleWish = document.getElementById('miracleWish');
const miracleMessage = document.getElementById('miracleMessage');
const msgInner = document.getElementById('msgInner');
const miracleClose = document.getElementById('miracleClose');

let miracleTimers = [];
let miracleOpened = false;

function clearMiracleTimers() {
  miracleTimers.forEach(t => clearTimeout(t));
  miracleTimers = [];
}

function generateStars() {
  if (miracleStars.children.length > 0) return;
  for (let i = 0; i < 110; i++) {
    const star = document.createElement('span');
    star.className = 'm-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    const size = (Math.random() * 2.4 + 0.8);
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (2 + Math.random() * 3.5) + 's';
    miracleStars.appendChild(star);
  }
}

function burstFromCenter() {
  const burst = document.createElement('div');
  burst.className = 'burst';
  const symbols = ['✦', '✧', '❤', '★'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.fontSize = (12 + Math.random() * 14) + 'px';
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 120 + Math.random() * 180;
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    s.style.animationDelay = (Math.random() * 0.25) + 's';
    burst.appendChild(s);
  }
  miracleOverlay.appendChild(burst);
  setTimeout(() => burst.remove(), 2200);
}

const messageLines = [
  { text: 'Айпери,', cls: 'greeting' },
  { text: '', cls: 'space' },
  { text: 'из миллиардов людей на этой планете', cls: '' },
  { text: 'я встретил именно тебя.', cls: '' },
  { text: 'И это, если честно, — маленькое чудо.', cls: 'emph' },
  { text: '', cls: 'space' },
  { text: 'Ты делаешь этот мир теплее.', cls: '' },
  { text: 'Просто тем, что ты есть.', cls: '' },
  { text: 'Спасибо, что ты рядом.', cls: '' },
  { text: '', cls: 'space' },
  { text: 'п.с. пусть в этом году сбудется всё,', cls: 'ps' },
  { text: 'о чём ты молчишь.', cls: 'ps' }
];

function renderMessage() {
  msgInner.innerHTML = '';
  messageLines.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'msg-line ' + line.cls;
    p.textContent = line.text || '\u00A0';
    p.style.animationDelay = (i * 0.32) + 's';
    msgInner.appendChild(p);
  });
}

function openMiracle() {
  if (miracleOpened) return;
  miracleOpened = true;

  if (navigator.vibrate) navigator.vibrate([20, 40, 30]);

  // 1. Открываем конверт
  envelope.classList.add('opened');

  // 2. Через 500мс показываем overlay
  miracleTimers.push(setTimeout(() => {
    miracleOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    generateStars();
  }, 500));

  // 3. Через 1.5с — звезда желания
  miracleTimers.push(setTimeout(() => {
    miracleWish.classList.add('show');
  }, 1600));

  // 4. Через 4.5с — всплеск и переход к посланию
  miracleTimers.push(setTimeout(() => {
    burstFromCenter();
    miracleWish.classList.remove('show');
    miracleWish.classList.add('hide');
  }, 4500));

  // 5. Через 5.3с — показываем послание
  miracleTimers.push(setTimeout(() => {
    renderMessage();
    miracleMessage.classList.add('show');
  }, 5300));
}

function closeMiracle() {
  miracleOverlay.classList.remove('active');
  document.body.style.overflow = '';
  miracleTimers.push(setTimeout(() => {
    miracleWish.classList.remove('show', 'hide');
    miracleMessage.classList.remove('show');
    miracleOpened = false;
    envelope.classList.remove('opened');
  }, 1200));
}

envelope.addEventListener('click', openMiracle);
miracleClose.addEventListener('click', closeMiracle);

/* ---------- 7. Защита от случайного зума ---------- */
document.addEventListener('gesturestart', e => e.preventDefault());
