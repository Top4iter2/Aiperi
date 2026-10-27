/* ==========================================
   САЙТ ДЛЯ АЙПЕРИ - ВСЕ НАСТРОЙКИ ЗДЕСЬ
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. МУЗЫКА (СВОЙ ФАЙЛ) ---------- */
  // 👇 ЗАКИНЬ СВОЙ ФАЙЛ В ПАПКУ С САЙТОМ И НАЗОВИ ЕГО music.mp3
  const bgMusic = new Audio('music.mp3'); 
  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  let musicPlaying = false;
  const musicBtn = document.getElementById('musicBtn');

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(err => {
        console.warn("Музыка не запустилась. Проверь, есть ли файл music.mp3 в папке.", err);
      });
    }
  }
  musicBtn.addEventListener('click', toggleMusic);

  /* ---------- 2. ЭЛЕМЕНТЫ СТРАНИЦЫ ---------- */
  const splash = document.getElementById('splashScreen');
  const startBtn = document.getElementById('startBtn');
  const splashBg = document.getElementById('splashBg');
  const flashOverlay = document.getElementById('flashOverlay');
  
  const reelsContainer = document.getElementById('reelsContainer');
  
  const envelope = document.getElementById('envelope');
  const envHint = document.getElementById('envHint');
  const qrCard = document.getElementById('qrCard');
  const qrImg = document.getElementById('qrImg');
  const magicBtn = document.getElementById('magicBtn');
  
  const miracleScreen = document.getElementById('miracleScreen');
  const miracleStars = document.getElementById('miracleStars');
  const miracleWish = document.getElementById('miracleWish');
  const miracleMsg = document.getElementById('miracleMsg');
  const msgContent = document.getElementById('msgContent');
  const closeMiracleBtn = document.getElementById('closeMiracleBtn');

  /* ---------- 3. ЗАПУСК САЙТА (SPLASH) ---------- */
  const symbols = ['✦', '✧', '❤', '♥', '❋'];
  for (let i = 0; i < 15; i++) {
    const s = document.createElement('span');
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (10 + Math.random() * 20) + 'px';
    s.style.animationDuration = (8 + Math.random() * 8) + 's';
    s.style.animationDelay = (Math.random() * 8) + 's';
    s.style.opacity = 0.3 + Math.random() * 0.5;
    splashBg.appendChild(s);
  }

  startBtn.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(30);
    splash.classList.add('hidden');
    document.body.style.overflow = ''; 
    setTimeout(() => { spawnConfetti(60); }, 200);
    setTimeout(() => { spawnConfetti(40); }, 800);
    
    // Запуск музыки при первом клике
    if (!musicPlaying) {
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(() => {});
    }
  });

  /* ---------- 4. КОНФЕТТИ И ВСПЫШКА ---------- */
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let isAnimating = false;
  
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawHeart(c, x, y, size) {
    c.beginPath(); const s = size / 16;
    c.moveTo(x, y + 4 * s);
    c.bezierCurveTo(x, y, x - 8 * s, y, x - 8 * s, y + 4 * s);
    c.bezierCurveTo(x - 8 * s, y + 8 * s, x, y + 14 * s, x, y + 16 * s);
    c.bezierCurveTo(x, y + 14 * s, x + 8 * s, y + 8 * s, x + 8 * s, y + 4 * s);
    c.bezierCurveTo(x + 8 * s, y, x, y, x, y + 4 * s);
    c.fill();
  }

  function spawnConfetti(count) {
    if (particles.length > 80) return;
    const colors = ['#e05a7c', '#e8c977', '#f5c6d3', '#ffffff', '#a83a5a'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: -30 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        size: 6 + Math.random() * 8, color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'heart' : 'rect'
      });
    }
    if (!isAnimating) { isAnimating = true; requestAnimationFrame(updateConfetti); }
  }

  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.y < canvas.height + 50);
    
    for (let p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.rotSpeed;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180); ctx.fillStyle = p.color;
      if (p.shape === 'heart') drawHeart(ctx, 0, -p.size / 2, p.size);
      else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    if (particles.length > 0) requestAnimationFrame(updateConfetti);
    else { isAnimating = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  function triggerFlash() {
    flashOverlay.classList.remove('flash-active');
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add('flash-active');
  }

  /* ---------- 5. АНИМАЦИИ ПОЯВЛЕНИЯ ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));

  /* ---------- 6. ФОТО-ЛЕНТА (ТТ) ---------- */
  const reelCards = document.querySelectorAll('.reel-card');
  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
      else entry.target.classList.remove('active');
    });
  }, { root: reelsContainer, threshold: 0.6 });

  reelCards.forEach(card => {
    reelObserver.observe(card);
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        card.classList.add('no-img');
      });
    }
  });

  let lastReelIdx = 0;
  reelsContainer.addEventListener('scroll', () => {
    const idx = Math.round(reelsContainer.scrollTop / reelsContainer.clientHeight);
    if (idx !== lastReelIdx && idx < reelCards.length) {
      lastReelIdx = idx;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, { passive: true });

  /* ---------- 7. КОНВЕРТ И QR ---------- */
  let isEnvelopeOpen = false;

  envelope.addEventListener('click', () => {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;
    
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    envelope.classList.add('opened', 'shake');
    
    setTimeout(() => {
      triggerFlash();
      spawnConfetti(40);
    }, 400);

    setTimeout(() => {
      envelope.classList.add('fade-out');
      envHint.classList.add('hidden');
    }, 700);

    setTimeout(() => {
      qrCard.classList.add('show');
      if (!qrImg.complete || qrImg.naturalWidth === 0) {
        qrImg.style.display = 'none';
        document.getElementById('qrFallback').style.display = 'block';
      }
    }, 1200);

    setTimeout(() => { magicBtn.classList.add('show'); }, 1800);
  });

  /* ---------- 8. ЧУДО (MIRACLE SCREEN) ---------- */
  let isMiracleOpened = false;
  let starsGenerated = false;
  let miracleTimeouts = [];

  function generateStars() {
    if (starsGenerated) return;
    starsGenerated = true;
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('span');
      star.className = 'm-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = (Math.random() * 2 + 1) + 'px';
      star.style.width = size; star.style.height = size;
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      miracleStars.appendChild(star);
    }
  }

  const messageLines = [
    { text: 'Айпери,', cls: 'greeting' }, { text: '', cls: 'space' },
    { text: 'из миллиардов людей на этой планете', cls: '' },
    { text: 'я встретил именно тебя.', cls: '' },
    { text: 'И это, если честно, — маленькое чудо.', cls: 'emph' },
    { text: '', cls: 'space' },
    { text: 'Ты делаешь этот мир теплее.', cls: '' },
    { text: 'Просто тем, что ты есть.', cls: '' },
    { text: 'Спасибо, что ты рядом.', cls: '' }
  ];

  function openMiracle() {
    if (isMiracleOpened) return;
    isMiracleOpened = true;

    if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
    miracleScreen.classList.add('active');
    document.body.style.overflow = 'hidden';
    generateStars();

    miracleTimeouts.push(setTimeout(() => { miracleWish.classList.add('show'); }, 1000));

    miracleTimeouts.push(setTimeout(() => {
      triggerFlash(); spawnConfetti(70);
      miracleWish.classList.remove('show'); miracleWish.classList.add('hide');
    }, 4000));

    miracleTimeouts.push(setTimeout(() => {
      msgContent.innerHTML = '';
      messageLines.forEach((line, i) => {
        const p = document.createElement('p');
        p.className = 'msg-line ' + line.cls;
        p.textContent = line.text || '\u00A0';
        p.style.animationDelay = (i * 0.3) + 's';
        msgContent.appendChild(p);
      });
      miracleMsg.classList.add('show');
    }, 4800));
  }

  function closeMiracle() {
    miracleScreen.classList.remove('active');
    document.body.style.overflow = '';
    miracleTimeouts.forEach(clearTimeout);
    miracleTimeouts = [];
    
    miracleTimeouts.push(setTimeout(() => {
      miracleWish.classList.remove('show', 'hide');
      miracleMsg.classList.remove('show');
      isMiracleOpened = false;
    }, 1000));
  }

  magicBtn.addEventListener('click', openMiracle);
  closeMiracleBtn.addEventListener('click', closeMiracle);

  /* ---------- 9. ИСКОРКИ ПРИ КАСАНИИ ---------- */
  let lastTap = 0;
  document.addEventListener('touchstart', (e) => {
    const now = performance.now();
    if (now - lastTap < 150) return;
    lastTap = now;
    
    const touch = e.touches[0];
    if (!touch) return;

    const sparkle = document.createElement('div');
    sparkle.style.cssText = `position:fixed;left:${touch.clientX}px;top:${touch.clientY}px;transform:translate(-50%,-50%);color:${Math.random()>0.5?'#e8c977':'#ffd0e0'};font-size:${10+Math.random()*10}px;pointer-events:none;z-index:9998;text-shadow:0 0 10px rgba(255,200,220,0.9);animation:sparkle 0.6s ease-out forwards;`;
    sparkle.textContent = Math.random() > 0.5 ? '✦' : '✧';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }, { passive: true });

  const style = document.createElement('style');
  style.textContent = `@keyframes sparkle { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 1; } 100% { transform: translate(-50%,-100%) scale(1.2); opacity: 0; } }`;
  document.head.appendChild(style);

  document.addEventListener('gesturestart', e => e.preventDefault());
});
