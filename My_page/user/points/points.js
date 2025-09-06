/**
 * 포인트 조회 페이지 스크립트 (points.js)
 * - 통일된 UL 테이블 레이아웃에 포인트 내역을 렌더링합니다.
 * - 총 포인트와 '30일 이내 만료' 포인트를 계산해 요약 영역에 반영합니다.
 * - 일반회원 사이드바에서 현재 메뉴를 강조합니다.
 *
 * [목데이터 형식]
 *  [
 *    { "date":"25.07.22", "orderId":"123456", "items":"상품명 외 2개", "price":16000, "points":160, "expiresAt":"26.07.22" },
 *    ...
 *  ]
 *
 * [백엔드 연동 시]
 *  - 아래 CONFIG.SRC 를 실제 API URL로 교체하십시오. (예: '/api/member/points')
 */

(() => {
  'use strict';

  /* ================= 설정값 ================= */
  const CONFIG = {
    SRC: 'points.json',           // 데이터 소스 (목데이터 파일 경로 또는 API URL)
    EXPIRY_DAYS: 30,              // '이내 만료'로 간주할 기간(일)
    SIDEBAR_MATCH: '/My_page/points/' // 사이드바 강조 시 href 매칭 기준
  };

  /* ================= DOM 캐시 ================= */
  const $list = document.getElementById('pointsList');     // UL 테이블
  const $total = document.getElementById('totalPoints');   // 총 포인트
  const $expiring = document.getElementById('expiringPoints'); // 만료 예정 포인트
  const $memberName = document.querySelector('.member-name');   // 선택사항: 회원명 표시

  /* ================= 유틸 함수 ================= */

  // (한글 주석) 숫자 안전 변환
  const toInt = v => Number(v || 0);

  // (한글 주석) 한국어 천단위 표기
  const fmtNumber = n => toInt(n).toLocaleString('ko-KR');

  // (한글 주석) 두 날짜 사이 '정수 일수' 차이
  const daysBetween = (a, b) => Math.floor((b - a) / (1000 * 60 * 60 * 24));

  // (한글 주석) 다양한 문자열 날짜를 Date로 정규화
  // 허용: '25.07.22' | '2025-07-22' | Date 파싱 가능한 문자열
  function parseDate(s) {
    if (!s) return new Date('Invalid');
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(s)) {
      const [yy, mm, dd] = s.split('.');
      return new Date(2000 + parseInt(yy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-');
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    }
    const d = new Date(s);
    return isNaN(d) ? new Date('Invalid') : d;
  }

  // (한글 주석) 한 행 객체를 안전한 형태로 표준화
  function normalizeRow(r) {
    return {
      date: r.date ?? '',
      orderId: r.orderId ?? '',
      items: r.items ?? '',
      price: toInt(r.price),
      points: toInt(r.points),
      expiresAt: r.expiresAt ?? ''
    };
  }

  /* ================= 렌더링 ================= */

  // (한글 주석) 데이터 행을 UL 테이블에 그리기
  function renderRows(rows) {
    if (!$list) return;
    const frag = document.createDocumentFragment();

    rows.forEach(r => {
      const li = document.createElement('li');
      li.className = 'row';

      // (한글 주석) 각 칼럼 셀 정의: [라벨, 값, 클래스]
      const cells = [
        ['일시', r.date, 'cell cell--center'],
        ['주문번호', r.orderId, 'cell cell--center'],
        ['주문 내역', r.items, 'cell item-summary'],
        ['가격', fmtNumber(r.price), 'cell cell--right'],
        ['적립 포인트', fmtNumber(r.points), 'cell cell--right'],
        ['유효기간', r.expiresAt, 'cell cell--center']
      ];

      // (한글 주석) 모바일 대응을 위해 data-label 사용
      cells.forEach(([label, value, cls]) => {
        const d = document.createElement('div');
        d.className = cls;
        d.dataset.label = label;
        d.textContent = value;
        li.appendChild(d);
      });

      frag.appendChild(li);
    });

    $list.appendChild(frag);
  }

  // (한글 주석) 비어있을 때 UI
  function renderEmpty() {
    if (!$list) return;
    const li = document.createElement('li');
    li.className = 'row';
    const d = document.createElement('div');
    d.className = 'cell cell--center';
    d.style.gridColumn = '1 / -1';
    d.textContent = '포인트 내역이 없습니다.';
    li.appendChild(d);
    $list.appendChild(li);
  }

  // (한글 주석) 합계 및 30일 이내 만료 포인트 계산
  function summarize(rows) {
    const now = new Date();
    const total = rows.reduce((acc, r) => acc + toInt(r.points), 0);
    const expiring = rows.reduce((acc, r) => {
      const exp = parseDate(r.expiresAt);
      if (isNaN(exp)) return acc;
      const left = daysBetween(now, exp);
      return (left >= 0 && left <= CONFIG.EXPIRY_DAYS) ? acc + toInt(r.points) : acc;
    }, 0);
    return { total, expiring };
  }

  /* ================= 사이드바 현재 메뉴 강조 ================= */

  // (한글 주석) include로 사이드바가 늦게 삽입되는 케이스를 고려해 감시
  function highlightSidebar() {
    const side = document.getElementById('site-side');
    if (!side) return;

    const apply = () => {
      // (한글 주석) 우선 폴더 기준으로 매칭. 실패 시 파일명 매칭 보조
      const byFolder = side.querySelector(`a[href*="${CONFIG.SIDEBAR_MATCH}"]`);
      const byFile = side.querySelector('a[href$="points.html"]');
      const link = byFolder || byFile;
      if (link) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
        return true;
      }
      return false;
    };

    if (apply()) return;

    const mo = new MutationObserver(() => {
      if (apply()) mo.disconnect();
    });
    mo.observe(side, { childList: true, subtree: true });
  }

  /* ================= 초기화 ================= */

  async function init() {
    try {
      // (한글 주석) 데이터 로드: 목데이터 또는 API
      const res = await fetch(CONFIG.SRC, { cache: 'no-store' });
      if (!res.ok) throw new Error('데이터 로드 실패');
      const raw = await res.json();

      // (한글 주석) 배열 또는 {items:[...]} 형태 모두 수용
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw.items) ? raw.items : []);
      const rows = list.map(normalizeRow);

      if (rows.length) renderRows(rows);
      else renderEmpty();

      const { total, expiring } = summarize(rows);
      if ($total) $total.textContent = fmtNumber(total);
      if ($expiring) $expiring.textContent = fmtNumber(expiring);
    } catch (err) {
      console.error('[points] 로드 오류:', err);
      renderEmpty();
      if ($total) $total.textContent = '0';
      if ($expiring) $expiring.textContent = '0';
    } finally {
      highlightSidebar();

      // (선택) 회원명 자동 주입: 로컬 저장소나 body dataset 등을 사용하려면 아래 예시 활용
      // const name = document.body?.dataset?.memberName || localStorage.getItem('memberName');
      // if (name && $memberName) $memberName.textContent = name;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
