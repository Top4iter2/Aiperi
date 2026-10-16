/* =================================================================
   Для неё — скрипты
   Три вещи: пылинки в свете, мягкое появление глав, отпускание.
   ================================================================= */

/* ----------------------------------------------------------------
   1. ✦ ПЫЛИНКИ В СВЕТЕ ЛАМПЫ
   Мелкие тёплые точки, мерцают. Без will-change, штук немного.
   ---------------------------------------------------------------- */
(function initDust() {
  const layer = document.getElementById('dust');
  if (!layer) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COUNT = 38;

  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('span');
    const size = 0.8 + Math.random() * 2;

    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.background = Math.random() > 0.5
      ? 'rgba(232,178,115,.85)'   // янтарь
      : 'rgba(244,233,220,.6)';    // крем
    s.style.animationDelay = (Math.random() * 8) + 's';
    s.style.animationDuration = (4 + Math.random() * 6) + 's';

    layer.appendChild(s);
  }
})();


/* ----------------------------------------------------------------
   2. ✦ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
   Строфы всплывают одна за другой, с задержкой между ними.
   ---------------------------------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  items.forEach(el => io.observe(el));
})();


/* ----------------------------------------------------------------
   3. ✦ ОТПУСКАЮ — финальный жест
   Орб гаснет, слова появляются. Один раз. Навсегда.
   ---------------------------------------------------------------- */
(function initRelease() {
  const orb  = document.getElementById('releaseOrb');
  const hint = document.getElementById('releaseHint');
  const msg  = document.getElementById('releaseMessage');
  if (!orb || !msg) return;

  let done = false;

  function release() {
    if (done) return;
    done = true;

    orb.classList.add('released');

    if (hint) {
      hint.classList.add('gone');
      setTimeout(() => { hint.style.display = 'none'; }, 900);
    }

    setTimeout(() => {
      msg.removeAttribute('hidden');
      setTimeout(() => {
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }, 900);
  }

  orb.addEventListener('click', release);
  orb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      release();
    }
  });
})();


/* ----------------------------------------------------------------
   4. ✦ ФОНОВАЯ МУЗЫКА — M'Dee «Нужна»
   Плавное появление громкости, старт при первом касании.
   Положи файл в music/mdee-nuzhna.mp3
   ---------------------------------------------------------------- */
(function initMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  const TARGET_VOLUME = 0.32;
  const FADE_MS = 3000;

  audio.volume = 0;
  let started = false;

  function fadeIn() {
    const step = TARGET_VOLUME / (FADE_MS / 50);
    const t = setInterval(() => {
      if (audio.volume + step < TARGET_VOLUME) {
        audio.volume = Math.min(audio.volume + step, TARGET_VOLUME);
      } else {
        audio.volume = TARGET_VOLUME;
        clearInterval(t);
      }
    }, 50);
  }

  function tryStart() {
    if (started) return;
    audio.play()
      .then(() => {
        started = true;
        fadeIn();
        removeListeners();
      })
      .catch(() => { /* ещё ждём */ });
  }

  function removeListeners() {
    ['click', 'touchstart', 'touchend', 'keydown', 'scroll']
      .forEach(evt => window.removeEventListener(evt, tryStart));
  }

  // Пробуем автозапуск (разрешён на некоторых браузерах)
  audio.play()
    .then(() => { started = true; audio.volume = TARGET_VOLUME; })
    .catch(() => {
      ['click', 'touchstart', 'touchend', 'keydown', 'scroll']
        .forEach(evt =>
          window.addEventListener(evt, tryStart, { passive: true })
        );
    });
})();


/* ----------------------------------------------------------------
   5. ✦ ТЕКУЩИЙ ГОД В ПОДВАЛЕ
   ---------------------------------------------------------------- */
(function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();


/* ----------------------------------------------------------------
   6. ✦ ХАК ДЛЯ ТАЧ-УСТРОЙСТВ
   ---------------------------------------------------------------- */
(function initTap() {
  if (window.matchMedia('(hover: none)').matches) {
    document.documentElement.classList.add('touch');
  }
})();