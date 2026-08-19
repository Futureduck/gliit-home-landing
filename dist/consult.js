/* 글잇 학습 상담 신청 폼
   - 필수 검증 / 휴대전화 자동 하이픈 / 300자 카운터 / 개인정보 아코디언
   - 제출 시 Apps Script 웹앱으로 POST, 응답에 따라 완료·마감 모달 분기 */
(function () {
  'use strict';

  /* ============================================================
     ▼▼▼ 배포 전 여기만 채우면 됩니다 ▼▼▼
     Apps Script > 배포 > 새 배포 > 웹 앱 에서 받은 URL
     (예: https://script.google.com/macros/s/AKfycb.../exec)
     비워두면 서버로 보내지 않고 완료 모달만 띄우는 미리보기 모드로 동작합니다.
     ============================================================ */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwU5ggB-SrsKY_diLdf8WtRhcntwbPfw3qdUzeDAg3jfq1VoUJkPW7Z0bETznCH_O_HBQ/exec';

  var MAX_NOTE = 300;

  var $ = function (id) { return document.getElementById(id); };
  var form = $('consultForm');
  if (!form) return;

  /* ---------- 휴대전화 자동 하이픈 ---------- */
  // 010-1234-5678 / 011-123-4567 형태로 맞춘다.
  function formatPhone(raw) {
    var d = String(raw).replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return d.slice(0, 3) + '-' + d.slice(3);
    if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
    return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
  }

  // 010 은 항상 가운데 4자리, 그 외 구번호는 3~4자리를 허용
  function isValidPhone(v) {
    return /^(010-\d{4}|01[16789]-\d{3,4})-\d{4}$/.test(v);
  }

  var phone = $('phone');
  phone.addEventListener('input', function () {
    var before = phone.value;
    var caretAtEnd = phone.selectionStart === before.length;
    var next = formatPhone(before);
    if (next !== before) {
      phone.value = next;
      if (caretAtEnd) phone.setSelectionRange(next.length, next.length);
    }
    clearError(fieldOf(phone));
  });

  /* ---------- 글자 수 카운터 ---------- */
  var note = $('note');
  var noteCount = $('noteCount');
  function syncCount() {
    if (note.value.length > MAX_NOTE) note.value = note.value.slice(0, MAX_NOTE);
    noteCount.textContent = String(note.value.length);
  }
  note.addEventListener('input', syncCount);
  syncCount();

  /* ---------- 개인정보 아코디언 ---------- */
  var accBtn = $('accBtn');
  var accBody = $('accBody');
  accBtn.addEventListener('click', function () {
    var open = accBtn.getAttribute('aria-expanded') === 'true';
    accBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    accBody.classList.toggle('open', !open);
  });

  /* ---------- 검증 ---------- */
  function fieldOf(el) { return el.closest('.q') || el.closest('.consent'); }
  function markError(box) { if (box) box.classList.add('invalid'); }
  function clearError(box) { if (box) box.classList.remove('invalid'); }

  function checkedValue(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function checkedValues(name) {
    return [].map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (e) { return e.value; });
  }

  // 선택하면 그 문항의 오류 표시를 즉시 해제
  form.addEventListener('change', function (e) {
    var box = fieldOf(e.target);
    if (box) clearError(box);
  });
  ['parentName'].forEach(function (id) {
    $(id).addEventListener('input', function () { clearError(fieldOf($(id))); });
  });

  function validate() {
    var bad = [];

    ['grade', 'reading', 'writing', 'reason'].forEach(function (name) {
      var box = form.querySelector('[data-q="' + name + '"]');
      if (!checkedValue(name)) { markError(box); bad.push(box); } else clearError(box);
    });

    var nameBox = form.querySelector('[data-q="parentName"]');
    if (!$('parentName').value.trim()) { markError(nameBox); bad.push(nameBox); } else clearError(nameBox);

    var phoneBox = form.querySelector('[data-q="phone"]');
    if (!isValidPhone(phone.value.trim())) { markError(phoneBox); bad.push(phoneBox); } else clearError(phoneBox);

    var timesBox = form.querySelector('[data-q="times"]');
    if (checkedValues('times').length === 0) { markError(timesBox); bad.push(timesBox); } else clearError(timesBox);

    var consentBox = $('consentBox');
    if (!$('consent').checked) { markError(consentBox); bad.push(consentBox); } else clearError(consentBox);

    return bad;
  }

  /* ---------- 마스킹 ---------- */
  function maskName(v) {
    var s = v.trim();
    if (s.length <= 1) return s;
    return s.charAt(0) + '○'.repeat(s.length - 1);
  }
  function maskPhone(v) {
    var parts = v.split('-');
    if (parts.length !== 3) return v;
    return parts[0] + '-' + '*'.repeat(parts[1].length) + '-' + parts[2];
  }

  /* ---------- 모달 ---------- */
  var okModal = $('okModal');
  var fullModal = $('fullModal');
  var lastFocused = null;

  function openModal(m) {
    lastFocused = document.activeElement;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    var b = m.querySelector('button');
    if (b) b.focus();
  }
  function closeModal(m) {
    m.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    // 완료 모달은 Esc 로 닫아도 무방하지만, 마감 모달은 선택을 받아야 하므로 유지
    if (okModal.classList.contains('open')) { closeModal(okModal); location.href = '/'; }
  });

  $('okClose').addEventListener('click', function () {
    closeModal(okModal);
    location.href = '/';
  });

  /* ---------- 전송 ---------- */
  var submitBtn = $('submitBtn');
  var formErr = $('formErr');
  var pendingPayload = null;   // 마감 시 '연락 받기' 를 누르면 재전송할 내용

  function showFormError(msg) {
    formErr.textContent = msg;
    formErr.classList.add('show');
  }
  function hideFormError() {
    formErr.classList.remove('show');
  }

  function collect() {
    return {
      grade: checkedValue('grade'),
      reading: checkedValue('reading'),
      writing: checkedValue('writing'),
      reason: checkedValue('reason'),
      parentName: $('parentName').value.trim(),
      phone: phone.value.trim(),
      times: checkedValues('times'),
      note: note.value.trim(),
      consent: $('consent').checked,
      hp: $('hp').value,
      page: location.pathname,
      ref: document.referrer || ''
    };
  }

  // Content-Type 을 지정하지 않아 text/plain 으로 전송된다.
  // preflight 가 발생하지 않아 Apps Script 웹앱과 그대로 통신할 수 있다.
  function send(payload) {
    return fetch(ENDPOINT, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  function showSuccess(payload) {
    $('sumName').textContent = maskName(payload.parentName) + ' 학부모님';
    $('sumPhone').textContent = maskPhone(payload.phone);
    $('sumTimes').textContent = payload.times.join(', ');
    openModal(okModal);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideFormError();

    var bad = validate();
    if (bad.length) {
      var first = bad[0];
      var y = first.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
      var focusable = first.querySelector('input:not([type="hidden"]), textarea');
      if (focusable && focusable.type !== 'radio' && focusable.type !== 'checkbox') focusable.focus({ preventScroll: true });
      return;
    }

    var payload = collect();
    pendingPayload = payload;

    if (!ENDPOINT) {
      console.warn('[consult] ENDPOINT 가 비어 있어 미리보기 모드로 동작합니다. 전송될 내용:', payload);
      showSuccess(payload);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '신청 중…';

    send(payload).then(function (res) {
      if (res && res.status === 'accepted') {
        showSuccess(payload);
      } else if (res && res.status === 'closed') {
        openModal(fullModal);
      } else {
        showFormError((res && res.error) || '신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }).catch(function () {
      showFormError('네트워크 오류로 신청하지 못했습니다. 연결을 확인하고 다시 시도해주세요.');
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = '무료 학습 상담 신청하기';
    });
  });

  /* ---------- 마감 시 대기 신청 ---------- */
  $('waitNo').addEventListener('click', function () {
    // 서버에 아무것도 저장하지 않은 상태이므로, 화면의 값만 비우면 폐기가 끝난다.
    pendingPayload = null;
    closeModal(fullModal);
    form.reset();
    syncCount();
    showFormError('신청이 취소되었습니다. 입력하신 정보는 저장되지 않았습니다.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('waitYes').addEventListener('click', function () {
    if (!pendingPayload) { closeModal(fullModal); return; }
    var yes = $('waitYes');
    var no = $('waitNo');
    yes.disabled = true; no.disabled = true;
    yes.textContent = '등록 중…';

    var body = Object.assign({}, pendingPayload, { waitlist: true });

    var done = function (ok) {
      $('fullTitle').textContent = ok ? '대기 신청이 완료되었습니다' : '등록에 실패했습니다';
      $('fullBody').innerHTML = ok
        ? '글잇 2기 모집이 시작되면 남겨주신 번호로 가장 먼저 안내드리겠습니다.'
        : '잠시 후 다시 시도해주세요.';
      $('fullActions').innerHTML = '';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = '확인';
      btn.addEventListener('click', function () { closeModal(fullModal); location.href = '/'; });
      $('fullActions').appendChild(btn);
      btn.focus();
    };

    if (!ENDPOINT) {
      console.warn('[consult] 미리보기 모드 — 대기자 등록 내용:', body);
      done(true);
      return;
    }

    send(body).then(function (res) {
      done(!!(res && res.status === 'waitlisted'));
    }).catch(function () { done(false); });
  });
})();
