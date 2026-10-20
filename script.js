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

/* ---------- 7. Музыка (свой MP3) ---------- */
const musicBtn = document.getElementById('musicToggle');
const bgMusic = new Audio('46ceb9e3-35b1-4dbf-a4d8-eddd897fceae_TikTok.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

let musicPlaying = false;

function startMusic() {
  if (musicPlaying) return;
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(err => {
    console.warn('Не удалось запустить музыку:', err);
  });
}

function stopMusic() {
  bgMusic.pause();
  musicPlaying = false;
  musicBtn.classList.remove('playing');
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) stopMusic();
  else startMusic();
});

/* ---------- 8. ВИДЕО ---------- */
document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;

  video.addEventListener('error', () => card.classList.add('empty'));

  card.addEventListener('click', () => {
    if (card.classList.contains('empty')) return;
    if (!video.paused) return; // уже играет — не мешаем

    video.controls = true;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.then(() => {
        card.classList.add('playing');
        pauseOtherVideos(video);
      }).catch(() => {
        // fallback — может, без звука пойдёт
        video.muted = true;
        video.play().then(() => {
          card.classList.add('playing');
          pauseOtherVideos(video);
        }).catch(() => {
          card.classList.add('empty');
        });
      });
    }
  });

  video.addEventListener('ended', () => {
    card.classList.remove('playing');
    video.currentTime = 0;
    video.controls = false;
  });

  video.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) {
      card.classList.remove('playing');
    }
  });
});

function pauseOtherVideos(currentVideo) {
  document.querySelectorAll('.video-card video').forEach(v => {
    if (v !== currentVideo && !v.paused) v.pause();
  });
}

/* ---------- 9. QR-КОД В КОНВЕРТЕ ---------- */
const envelope = document.getElementById('envelope');
const envelopeHint = document.getElementById('envelopeHint');
const qrCard = document.getElementById('qrCard');
const continueBtn = document.getElementById('continueBtn');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrImg = document.getElementById('qrImg');

let envelopeOpened = false;
let qrSetupDone = false;

function generateQRPattern() {
  if (!qrPlaceholder || qrPlaceholder.children.length > 0) return;

  const SIZE = 21;
  const frag = document.createDocumentFragment();

  function finderFilled(lr, lc) {
    const border = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const center = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    return border || center;
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      let filled = false;

      if (r < 7 && c < 7) filled = finderFilled(r, c);
      else if (r < 7 && c >= SIZE - 7) filled = finderFilled(r, c - (SIZE - 7));
      else if (r >= SIZE - 7 && c < 7) filled = finderFilled(r - (SIZE - 7), c);
      else {
        const inGap = (r < 8 && c < 8) || (r < 8 && c >= SIZE - 8) || (r >= SIZE - 8 && c < 8);
        filled = !inGap && Math.random() > 0.5;
      }

      if (filled) cell.style.background = '#1a0d15';
      frag.appendChild(cell);
    }
  }
  qrPlaceholder.appendChild(frag);
}

function setupQR() {
  if (qrSetupDone) return;
  qrSetupDone = true;

  const showPlaceholder = () => {
    qrImg.style.display = 'none';
    qrPlaceholder.style.display = 'grid';
    generateQRPattern();
  };

  // Уже загрузился?
  if (qrImg.complete) {
    if (qrImg.naturalWidth > 0) {
      qrPlaceholder.style.display = 'none';
    } else {
      showPlaceholder();
    }
    return;
  }

  qrImg.addEventListener('load', () => {
    qrPlaceholder.style.display = 'none';
    qrImg.style.display = 'block';
  });
  qrImg.addEventListener('error', showPlaceholder);
}

/* Открытие конверта */
envelope.addEventListener('click', () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  if (navigator.vibrate) navigator.vibrate([20, 40, 30]);

  envelope.classList.add('opened');

  // Вспышка + взрыв + конфетти
  setTimeout(() => {
    triggerFlash();
    const rect = envelope.getBoundingClientRect();
    burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
    createConfetti(50);
  }, 350);

  // Конверт улетает
  setTimeout(() => {
    envelope.classList.add('fade-away');
    envelopeHint.classList.add('hide');
  }, 750);

  // QR-карточка появляется
  setTimeout(() => {
    qrCard.classList.add('show');
    setupQR();
  }, 1250);

  // Кнопка продолжения
  setTimeout(() => {
    continueBtn.classList.add('show');
  }, 2000);
});

/* ---------- 10. МИРАКЛ OVERLAY ---------- */
const miracleOverlay = document.getElementById('miracleOverlay');
const miracleStars = document.getElementById('miracleStars');
const miracleShower = document.getElementById('miracleShower');
const miracleWish = document.getElementById('miracleWish');
const miracleMessage = document.getElementById('miracleMessage');
const msgInner = document.getElementById('msgInner');
const miracleClose = document.getElementById('miracleClose');

let miracleTimers = [];
let miracleOpened = false;
let starsGenerated = false;

function clearMiracleTimers() {
  miracleTimers.forEach(t => clearTimeout(t));
  miracleTimers = [];
}

function generateStars() {
  if (starsGenerated) return;
  starsGenerated = true;

  // Мерцающие звёзды (40 — оптимум для плавности)
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('span');
    star.className = 'm-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    const size = (Math.random() * 2.2 + 0.8).toFixed(2);
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (2 + Math.random() * 3.5) + 's';
    miracleStars.appendChild(star);
  }

  // Падающие звёзды (12 — кинематографично, но не тяжело)
  for (let i = 0; i < 12; i++) {
    const sh = document.createElement('span');
    sh.className = 'shower-star';
    sh.textContent = Math.random() > 0.5 ? '✦' : '✧';
    sh.style.left = Math.random() * 100 + '%';
    sh.style.fontSize = (8 + Math.random() * 6) + 'px';
    sh.style.animationDuration = (6 + Math.random() * 6) + 's';
    sh.style.animationDelay = (Math.random() * 8) + 's';
    miracleShower.appendChild(sh);
  }
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

  miracleOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  generateStars();

  // Звезда желания через 1.5с
  miracleTimers.push(setTimeout(() => {
    miracleWish.classList.add('show');
  }, 1500));

  // Всплеск + переход к посланию
  miracleTimers.push(setTimeout(() => {
    const rect = miracleWish.getBoundingClientRect();
    burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 32);
    triggerFlash();
    createConfetti(70);
    miracleWish.classList.remove('show');
    miracleWish.classList.add('hide');
  }, 4500));

  // Послание
  miracleTimers.push(setTimeout(() => {
    renderMessage();
    miracleMessage.classList.add('show');
  }, 5400));
}

function closeMiracle() {
  miracleOverlay.classList.remove('active');
  document.body.style.overflow = '';
  clearMiracleTimers();

  miracleTimers.push(setTimeout(() => {
    miracleWish.classList.remove('show', 'hide');
    miracleMessage.classList.remove('show');
    miracleOpened = false;
  }, 1200));
}

continueBtn.addEventListener('click', openMiracle);
miracleClose.addEventListener('click', closeMiracle);

/* ---------- 11. Лёгкая звёздная пыль при касании ---------- */
let lastSparkleTime = 0;
function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'touch-sparkle';
  sparkle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${8 + Math.random() * 8}px;
    color: ${Math.random() > 0.5 ? '#e8c977' : '#ffd0e0'};
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    text-shadow: 0 0 10px rgba(255,200,220,0.9);
    animation: sparkleFade 0.8s ease-out forwards;
  `;
  sparkle.textContent = Math.random() > 0.5 ? '✦' : '✧';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 850);
}

// CSS-анимация для искорки (добавим динамически)
if (!document.getElementById('sparkleStyle')) {
  const style = document.createElement('style');
  style.id = 'sparkleStyle';
  style.textContent = `
    @keyframes sparkleFade {
      0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
      100% { transform: translate(-50%, calc(-50% - 40px)) scale(1.4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('touchstart', (e) => {
  const now = performance.now();
  if (now - lastSparkleTime < 120) return;
  lastSparkleTime = now;
  const t = e.touches[0];
  if (t) createSparkle(t.clientX, t.clientY);
}, { passive: true });

/* ---------- 12. Защита от случайного зума ---------- */
document.addEventListener('gesturestart', e => e.preventDefault());
