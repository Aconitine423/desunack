/* ============================================================
   oll_menu.js — 메가 메뉴 '항상 전체 보기' + 드롭/브레드 분리 + 검색
   - 프론트 전용(정적 HTML) 이동만 사용 (PHP 없음)
   - 대/소분류 클릭 시 ./detailedpage/detailedpage.html 로 이동
   - 검색 팝업 열기/닫기 + 검색 실행(체크박스 → 쿼리스트링) 포함
   - CSS는 변경하지 않음
   - 모든 이벤트는 "위임 방식"으로 처리 (동적 DOM에도 안전)
   ============================================================ */

(function () {
  'use strict';
  const init = () => {
    // ─────────────────────────────────────
    // 0) 카테고리 데이터 맵 (필요시 수정)
    // ─────────────────────────────────────
    const MAIN_MAP = { headerDrink: 1, headerSnack: 2 };
    const SUB_MAP = {
      headerDrink: [
        { label: "탄산",   value: "headerSoda" },
        { label: "비탄산", value: "headerNonSoda" },
        { label: "분말",   value: "headerPowder" }
      ],
      headerSnack: [
        { label: "과자",     value: "headerCookie" },
        { label: "사탕류",   value: "headerCandy" },
        { label: "초콜릿",   value: "headerChocolate" },
        { label: "아이스크림", value: "headerIcecream" },
        { label: "빵",       value: "headerBread" }
      ]
    };

    // ─────────────────────────────────────
    // 1) 상태
    // ─────────────────────────────────────
    let selectedMainKey = null;  // 'headerDrink' | 'headerSnack'
    let selectedSubKey  = null;  // 'headerSoda' 등
    let lastSource      = null;  // 'mega' | 'headerDrop' | 'breadcrumb' | 'init'

    // ─────────────────────────────────────
    // 2) 공용 선택자
    // ─────────────────────────────────────
    const BREAD_SCOPE_SEL = '#main-menu, #sub-menu, .breadcrumb, .breadcrumb-nav, .breadcrumb-container';
    const togglesSel = [
      '.mega-toggle',
      '.has-dropdown > .dropdown-toggle',
      '.breadcrumb-item.dropdown > .dropdown-toggle',
      '.breadcrumb .dropdown-toggle',
      '.breadcrumb-nav .dropdown-toggle'
    ].join(', ');
    const itemSel = [
      '.mega-menu a',
      '.has-dropdown .dropdown-menu a',
      '#main-menu a',
      '#sub-menu a',
      '.breadcrumb a',
      '.breadcrumb-nav a'
    ].join(', ');
    const rootsSel = [
      '.mega-dropdown',
      '.has-dropdown',
      '.breadcrumb-item.dropdown',
      '.breadcrumb',
      '.breadcrumb-nav',
      '.breadcrumb-container',
      '#search-popup'               // 검색 팝업도 바깥 클릭 시 닫히게 포함
    ].join(', ');

    const mainMenu      = document.getElementById('main-menu');
    const subMenu       = document.getElementById('sub-menu');
    const mainLabelSpan = document.getElementById('main-label');
    const subLabelSpan  = document.getElementById('sub-label');

    // 존재 체크(없어도 동작은 계속)
    ['#main-menu', '#sub-menu', '#main-label', '#sub-label'].forEach(sel => {
      if (!document.querySelector(sel)) {
        console.warn('[oll_menu] Missing element:', sel, '— 라벨/목록 갱신 일부 제한.');
      }
    });

    // ─────────────────────────────────────
    // 3) 메가 메뉴 '항상 전체 보기' 강제
    // ─────────────────────────────────────
    function showMegaAll() {
      document.querySelectorAll('.mega-menu .mega-column').forEach(col => {
        col.style.display = 'flex'; // 기본 가정(flex). 실제 값이 달라도 큰 문제 없음
      });
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => {
        h4.classList.remove('active');
      });
    }
    window.updateMegaColumns = function () { showMegaAll(); };
    window.setMegaActive     = function () {
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => h4.classList.remove('active'));
    };

    // ─────────────────────────────────────
    // 4) 드롭/메가 열고 닫기 유틸
    // ─────────────────────────────────────
    function closeAllDropdowns() {
      document.querySelectorAll(rootsSel).forEach(dd => {
        dd.classList.remove('open');
        const t = dd.querySelector('.mega-toggle, .dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
    function toggleDropdownByToggle(toggleEl) {
      const root = toggleEl.closest(rootsSel);
      if (!root) return;
      const willOpen = !root.classList.contains('open');
      closeAllDropdowns();
      if (willOpen) {
        root.classList.add('open');
        toggleEl.setAttribute('aria-expanded', 'true');
      } else {
        toggleEl.setAttribute('aria-expanded', 'false');
      }
    }
    function anyDropdownOpen() {
      return Array.from(document.querySelectorAll(rootsSel))
        .some(el => el.classList.contains('open'));
    }

    // ─────────────────────────────────────
    // 5) 선택 적용(라벨 갱신 + 필요 시 이동)
    // ─────────────────────────────────────
    function applySelection(mainKey, subKey, source) {
      if (selectedMainKey === mainKey && selectedSubKey === subKey && lastSource === source) return;

      const changed = (selectedMainKey !== mainKey) || (selectedSubKey !== subKey);
      selectedMainKey = mainKey || null;
      selectedSubKey  = subKey  || null;
      lastSource      = source;

      // 라벨 갱신
      if (mainLabelSpan) {
        const mainText =
          mainKey === 'headerDrink' ? '음료' :
          mainKey === 'headerSnack' ? '스낵' : '대분류';
        mainLabelSpan.textContent   = mainText;
        mainLabelSpan.dataset.value = mainKey || '';
      }
      if (subLabelSpan) {
        const list  = (SUB_MAP[mainKey] || []);
        const found = list.find(s => s.value === subKey);
        subLabelSpan.textContent   = found ? found.label : '소분류';
        subLabelSpan.dataset.value = subKey || '';
      }

      // 대분류 변경 시 소분류 목록 재생성
      if (changed && mainKey && subMenu && mainMenu) {
        populateSubMenu(mainKey);
      }

      // 메가는 항상 전체 보기 유지
      setTimeout(showMegaAll, 0);

      // 소분류까지 확정되면 상세 페이지로 이동(정적 HTML)
      if (changed && mainKey && subKey) {
        const href = `./detailedpage/detailedpage.html?main=${encodeURIComponent(mainKey)}&sub=${encodeURIComponent(subKey)}`;
        location.href = href;
      }

      closeAllDropdowns();
    }

    // // ─────────────────────────────────────
    // // 6) 브레드 메뉴 생성/갱신
    // // ─────────────────────────────────────
    // function populateMainMenu() {
    //   if (!mainMenu) return;
    //   mainMenu.innerHTML = '';
    //   [
    //     { label: '음료', value: 'headerDrink' },
    //     { label: '스낵', value: 'headerSnack' }
    //   ].forEach(item => {
    //     const li = document.createElement('li');
    //     const a  = document.createElement('a');
    //     a.href = '#';
    //     a.textContent = item.label;
    //     a.setAttribute('data-main', item.value); // 대분류 키
    //     a.addEventListener('click', e => {
    //       e.preventDefault();
    //       applySelection(item.value, null, 'breadcrumb'); // 소분류는 별도
    //     });
    //     li.appendChild(a);
    //     mainMenu.appendChild(li);
    //   });
    // }
    // function populateSubMenu(mainKey) {
    //   if (!subMenu) return;
    //   subMenu.innerHTML = '';
    //   (SUB_MAP[mainKey] || []).forEach(sub => {
    //     const li = document.createElement('li');
    //     const a  = document.createElement('a');
    //     a.href = '#';
    //     a.textContent = sub.label;
    //     a.setAttribute('data-main', mainKey);  // 대분류 유지
    //     a.setAttribute('data-sub',  sub.value); // 소분류 키
    //     a.addEventListener('click', e => {
    //       e.preventDefault();
    //       applySelection(mainKey, sub.value, 'breadcrumb');
    //     });
    //     li.appendChild(a);
    //     subMenu.appendChild(li);
    //   });
    // }
    // populateMainMenu();

    // // URL로 진입했을 때 라벨 복원 (?main=...&sub=...)
    // (function syncFromURL() {
    //   const p  = new URLSearchParams(location.search);
    //   const mk = p.get('main');
    //   const sk = p.get('sub');
    //   if (mk && (mk in MAIN_MAP)) {
    //     const validSub = (SUB_MAP[mk] || []).some(s => s.value === sk) ? sk : null;
    //     applySelection(mk, validSub, 'init');
    //   }
    // })();

    // ─────────────────────────────────────
    // 7) 이벤트 위임 (메가/드롭/브레드 + 검색 팝업 + 검색 실행)
    // ─────────────────────────────────────
    document.addEventListener('click', (e) => {
      // [A] 검색 팝업 열기/닫기
      const searchBtn   = e.target.closest('#search-btn');
      const closePopup  = e.target.closest('#close-popup');
      const searchPopup = document.getElementById('search-popup');

      if (searchBtn && searchPopup) {
        e.preventDefault(); e.stopPropagation();
        searchPopup.classList.toggle('open');
        const first = searchPopup.querySelector('input, select, textarea, button');
        if (first && searchPopup.classList.contains('open')) setTimeout(() => first.focus(), 0);
        return;
      }
      if (closePopup && searchPopup) {
        e.preventDefault(); e.stopPropagation();
        searchPopup.classList.remove('open');
        return;
      }
      // 팝업 바깥 클릭 → 닫기
      if (searchPopup && searchPopup.classList.contains('open')) {
        const inside = e.target.closest('#search-popup') || e.target.closest('#search-btn');
        if (!inside) searchPopup.classList.remove('open');
      }

      // [B] 메가 토글(햄버거)
      const megaToggle = e.target.closest('.mega-toggle');
      if (megaToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(megaToggle);
        const root = megaToggle.closest('.mega-dropdown');
        if (root && root.classList.contains('open')) showMegaAll();
        return;
      }

      // [C] 헤더/브레드 드롭 토글(메가는 건드리지 않음)
      const headerDropToggle = e.target.closest('.has-dropdown > .dropdown-toggle, .breadcrumb-item.dropdown > .dropdown-toggle, .breadcrumb .dropdown-toggle, .breadcrumb-nav .dropdown-toggle');
      if (headerDropToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(headerDropToggle);
        setTimeout(showMegaAll, 0);
        return;
      }

      // [D] 항목 클릭(메가/드롭/브레드 공통) → 라벨 갱신(+이동)
      const item = e.target.closest(itemSel);
      if (item) {
        e.preventDefault(); e.stopPropagation();
        const mainKey = item.getAttribute('data-main') || selectedMainKey;
        const subKey  = item.getAttribute('data-sub')  || null;

        const inBreadcrumb = item.closest(BREAD_SCOPE_SEL);
        const source =
          item.closest('.mega-menu') ? 'mega' :
          inBreadcrumb               ? 'breadcrumb' :
                                       'headerDrop';

        if (!mainKey && inBreadcrumb) {
          console.warn('[oll_menu] breadcrumb item에 data-main이 없습니다. 예: data-main="headerDrink"', item);
        }
        if (mainKey) applySelection(mainKey, subKey, source);
        setTimeout(showMegaAll, 0);
        return;
      }

      // [E] 검색 실행 버튼 (팝업 내부)
      const searchSubmit = e.target.closest('.search-submit-btn, #search-submit-btn');
      if (searchSubmit) {
        e.preventDefault(); e.stopPropagation();

        // 체크박스 값 수집
        const sweeteners = Array.from(document.querySelectorAll('input[name="sweetener"]:checked'))
          .map(cb => cb.value);
        const allergies  = Array.from(document.querySelectorAll('input[name="allergy"]:checked'))
          .map(cb => cb.value);

        // 쿼리스트링 조립
        const params = new URLSearchParams();
        if (sweeteners.length) params.set('sweetener', sweeteners.join(',')); // 공백 없이
        if (allergies.length)  params.set('allergy',  allergies.join(','));

        // 검색 결과 페이지로 이동 (상대경로)
        const qs = params.toString();
        location.href = `./search.html${qs ? `?${qs}` : ''}`;
        return;
      }

      // [F] 메뉴 바깥 클릭 → 모두 닫기
      if (anyDropdownOpen()) {
        const inMenus = e.target.closest(rootsSel);
        if (!inMenus) closeAllDropdowns();
      }
    }, false);

    // 키보드 핸들링: ESC로 닫기, 공백키 스크롤 방지
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && anyDropdownOpen()) {
        e.stopPropagation();
        closeAllDropdowns();
      }
      if (e.key === ' ') {
        const onToggle = e.target.closest(togglesSel);
        const onItem   = e.target.closest(itemSel);
        if (onToggle || onItem) e.preventDefault();
      }
    }, true);

    // ─────────────────────────────────────
    // 8) 접근성 기본 세팅(aria/role)
    // ─────────────────────────────────────
    (function initA11y() {
      document.querySelectorAll(togglesSel).forEach((tg, i) => {
        if (tg.tabIndex < 0) tg.tabIndex = 0;
        tg.setAttribute('aria-haspopup', 'true');
        tg.setAttribute('aria-expanded', 'false');
        const panel = tg.nextElementSibling;
        if (panel) {
          panel.setAttribute('role', 'menu');
          if (!panel.id) panel.id = `menu-panel-${i}`;
          tg.setAttribute('aria-controls', panel.id);
          panel.querySelectorAll('a,button').forEach(mi => {
            mi.setAttribute('role', 'menuitem');
            if (mi.tabIndex < 0) mi.tabIndex = 0;
          });
        }
      });
      showMegaAll();
      document.querySelectorAll('.mega-menu h4[data-main].active')
        .forEach(h4 => h4.classList.remove('active'));
    })();
  };
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inif, {once: true});
  }else{
    init();
  }
})();
