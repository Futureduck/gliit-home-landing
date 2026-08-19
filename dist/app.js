/* 글잇 랜딩 — 캐러셀 / FAQ 인터랙션
   원본 dc 컴포넌트(renderVals)의 로직을 React 없이 옮긴 것. */
(function () {
  'use strict';

  var N = 5;
  var STEP_RATIO = 340 / 380;  // 원본 데스크톱 비율 (카드폭 380 : 간격 340)
  var INTERVAL = 3400; // 자동 넘김 주기
  var RESUME = 9000;   // 수동 조작 후 자동 넘김 재개까지

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ---------- 캐러셀 ---------- */
  var active = 0;
  var paused = false;
  var timer = null;
  var resumeTimer = null;

  // 간격을 카드 실제 폭에서 산출. 데스크톱(380px)에서는 정확히 340px 로 원본과 동일.
  function step() {
    var c = document.querySelector('[data-gl-card]');
    return c && c.offsetWidth ? c.offsetWidth * STEP_RATIO : 340;
  }

  function applyCarousel(a) {
    var STEP = step();
    for (var i = 0; i < N; i++) {
      var d = (i - a + N) % N;
      if (d > N / 2) d -= N;           // -2..2 부호 있는 거리
      var ad = Math.abs(d);
      var x = d * STEP;

      var card = document.querySelector('[data-gl-card="' + i + '"]');
      if (card) {
        card.style.transform = 'translate3d(calc(-50% + ' + x + 'px), -50%, 0px) scale(' + (ad === 0 ? 1 : 0.78) + ')';
        card.style.opacity = ad > 1 ? '0' : '1';
        card.style.zIndex = String(10 - ad);
        card.style.pointerEvents = ad > 1 ? 'none' : 'auto';
        card.setAttribute('aria-hidden', ad > 1 ? 'true' : 'false');
      }

      var scrim = document.querySelector('[data-gl-scrim="' + i + '"]');
      if (scrim) scrim.style.opacity = ad === 0 ? '0' : '0.55';

      var dot = document.querySelector('[data-gl-dot="' + i + '"]');
      if (dot) {
        dot.style.background = d === 0 ? '#8B3DFF' : 'var(--gliit-mist)';
        dot.setAttribute('aria-current', d === 0 ? 'true' : 'false');
      }
    }
  }

  // 모바일에서 트랙 높이를 카드 실측값에 맞춘다 (769px 이상은 원본 520px 유지)
  var trackH0 = null;   // 원본 인라인 높이(520px) 보존
  function fitTrack() {
    var track = document.querySelector('.gl-carousel');
    if (!track) return;
    if (trackH0 === null) trackH0 = track.style.height || '520px';
    if (window.innerWidth > 768) { track.style.height = trackH0; return; }
    var h = 0;
    document.querySelectorAll('[data-gl-card]').forEach(function (c) {
      if (c.offsetHeight > h) h = c.offsetHeight;
    });
    if (h) track.style.height = (h + 36) + 'px';
  }

  function pick(i) {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { paused = false; }, RESUME);
    active = i;
    applyCarousel(active);
  }

  function startCarousel() {
    if (reduceMotion || timer) return;
    timer = setInterval(function () {
      if (paused || document.hidden) return;
      active = (active + 1) % N;
      applyCarousel(active);
    }, INTERVAL);
  }

  function initCarousel() {
    var cards = document.querySelectorAll('[data-gl-card]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var i = parseInt(card.getAttribute('data-gl-card'), 10);
      card.addEventListener('click', function () { pick(i); });
    });

    document.querySelectorAll('[data-gl-dot]').forEach(function (dot) {
      var i = parseInt(dot.getAttribute('data-gl-dot'), 10);
      dot.addEventListener('click', function () { pick(i); });
    });

    fitTrack();
    applyCarousel(active);
    startCarousel();

    // 뷰포트가 바뀌면 간격을 다시 계산
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { fitTrack(); applyCarousel(active); }, 120);
    });
  }

  /* ---------- FAQ 아코디언 ---------- */
  /* open 은 1-based, 0 이면 전부 닫힘. 원본 초기값은 1(첫 항목 열림). */
  var open = 1;

  function applyFaq() {
    document.querySelectorAll('[data-gl-faq]').forEach(function (header) {
      var i = parseInt(header.getAttribute('data-gl-faq'), 10);
      var on = (i + 1) === open;
      var panel = document.querySelector('[data-gl-faq-panel="' + i + '"]');
      if (panel) panel.style.display = on ? '' : 'none';
      header.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }

  function initFaq() {
    document.querySelectorAll('[data-gl-faq]').forEach(function (header) {
      var i = parseInt(header.getAttribute('data-gl-faq'), 10);
      var panel = document.querySelector('[data-gl-faq-panel="' + i + '"]');
      if (panel) {
        if (!panel.id) panel.id = 'faq-panel-' + i;
        header.setAttribute('aria-controls', panel.id);
      }
      function toggle() {
        open = (open === i + 1) ? 0 : i + 1;
        applyFaq();
      }
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          toggle();
        }
      });
    });
    applyFaq();
  }

  function init() {
    initCarousel();
    initFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
