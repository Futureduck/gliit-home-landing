/**
 * 글잇 학습 상담 신청 접수 — Google Apps Script
 *
 * 배포 방법
 *  1. 구글 시트를 하나 만들고 주소창의 /d/  와  /edit  사이 문자열을 SHEET_ID 에 넣습니다.
 *  2. 시트에서 확장 프로그램 > Apps Script 를 열고 이 파일 내용을 붙여넣습니다.
 *  3. 배포 > 새 배포 > 유형: 웹 앱
 *       - 실행 계정: 나
 *       - 액세스 권한: 모든 사용자   ← 이걸로 해야 폼에서 호출됩니다
 *  4. 발급된 /exec URL 을 dist/consult.js 상단 ENDPOINT 에 붙여넣습니다.
 *
 * 코드를 고친 뒤에는 반드시 "배포 관리 > 편집 > 버전: 새 버전" 으로 다시 배포해야
 * 실제 URL 에 반영됩니다.
 */

var SHEET_ID   = 'YOUR_SHEET_ID_HERE';
var SHEET_MAIN = '상담신청';
var SHEET_WAIT = '대기자';

/** 실제 마감 인원. 페이지 문구는 100명이지만 접수는 이 값에서 끊습니다. */
var CAP = 50;

var HEADERS = [
  '접수시각', '학부모 성함', '연락처', '선호 연락시간', '자녀 학년',
  '책읽기 선호', '글쓰기 선호', '관심 이유', '기타 문의', '개인정보 동의', '유입 경로'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 정원 계산과 기록 사이에 다른 요청이 끼어들면 초과 접수가 생기므로 잠금이 필요합니다.
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: '요청이 몰리고 있습니다. 잠시 후 다시 시도해주세요.' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: '요청 본문이 비어 있습니다.' });
    }

    var d = JSON.parse(e.postData.contents);

    // 봇이 채우는 숨김 필드. 사람이면 항상 비어 있습니다.
    if (d.hp) return json({ ok: true, status: 'accepted' });

    var missing = validate(d);
    if (missing) return json({ ok: false, error: missing });

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var row = [
      new Date(),
      d.parentName,
      "'" + d.phone,                       // 앞의 0 이 잘리지 않도록 텍스트로 저장
      (d.times || []).join(', '),
      d.grade,
      d.reading,
      d.writing,
      d.reason,
      d.note || '',
      d.consent ? 'Y' : 'N',
      d.ref || ''
    ];

    // 2기 대기자는 정원과 무관하게 별도 시트에 적재
    if (d.waitlist) {
      sheet(ss, SHEET_WAIT).appendRow(row);
      return json({ ok: true, status: 'waitlisted' });
    }

    var main = sheet(ss, SHEET_MAIN);
    var count = Math.max(0, main.getLastRow() - 1);   // 헤더 제외

    if (count >= CAP) {
      // 마감된 경우에는 저장하지 않습니다. ("거부 시 즉시 폐기" 를 지키기 위함)
      return json({ ok: true, status: 'closed', count: count });
    }

    main.appendRow(row);
    return json({ ok: true, status: 'accepted', count: count + 1 });

  } catch (err) {
    return json({ ok: false, error: '서버 오류: ' + err.message });
  } finally {
    lock.releaseLock();
  }
}

/** 남은 자리 확인용. 브라우저로 /exec 를 열면 현재 접수 수를 보여줍니다. */
function doGet() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var count = Math.max(0, sheet(ss, SHEET_MAIN).getLastRow() - 1);
    return json({ ok: true, count: count, cap: CAP, closed: count >= CAP });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

function validate(d) {
  if (!d.consent) return '개인정보 수집·이용 동의가 필요합니다.';
  if (!d.parentName || !String(d.parentName).trim()) return '성함이 비어 있습니다.';
  if (!/^(010-\d{4}|01[16789]-\d{3,4})-\d{4}$/.test(String(d.phone || ''))) return '휴대전화 번호 형식이 올바르지 않습니다.';
  if (!d.times || !d.times.length) return '연락 가능한 시간대를 선택해주세요.';
  if (!d.grade || !d.reading || !d.writing || !d.reason) return '필수 문항이 비어 있습니다.';
  if (d.note && String(d.note).length > 300) return '문의 내용이 300자를 넘습니다.';
  return null;
}

/** 시트가 없으면 헤더와 함께 만들어 둡니다. */
function sheet(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
