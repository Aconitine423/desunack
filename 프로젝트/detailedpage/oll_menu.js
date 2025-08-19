// oll_menu.js — 메가 메뉴 '항상 전체 보기' 고정 + 드롭/브레드 동작 분리
// - 드롭/브레드 클릭해도 메가 메뉴 컬럼/하이라이트 절대 바뀌지 않음
// - 메가 토글(햄버거) 열리면 항상 두 컬럼 전체 표시 + 하이라이트 없음
// - 메가 내부 항목 클릭 시에도 필터링 없이 네비게이션/라벨만 갱신
// - CSS 건드리지 않음

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // ─────────────────────────────────────
    // 0) 데이터 맵 (필요시 프로젝트에 맞춰 수정)
    // ─────────────────────────────────────
    const MAIN_MAP = { headerDrink: 1, headerSnack: 2 };
    const SUB_MAP = {
      headerDrink: [
        { label: "탄산", value: "headerSoda" },
        { label: "비탄산", value: "headerNonSoda" },
        { label: "분말", value: "headerPowder" }
      ],
      headerSnack: [
        { label: "과자", value: "headerCookie" },
        { label: "사탕류", value: "headerCandy" },
        { label: "초콜릿", value: "headerChocolate" },
        { label: "아이스크림", value: "headerIcecream" },
        { label: "빵", value: "headerBread" }
      ]
    };


    // ─────────────────────────────────────
    // 1) 상태
    // ─────────────────────────────────────
    let selectedMainKey = null; // 'headerDrink' | 'headerSnack'
    let selectedSubKey  = null; // 'headerSoda' 등
    let lastSource      = null; // 'mega' | 'headerDrop' | 'breadcrumb' | 'init'

    // ─────────────────────────────────────
    // 2) 요소/선택자
    //    - 브레드 영역/토글/항목/루트 셀렉터를 폭넓게 커버
    // ─────────────────────────────────────
    const BREAD_SCOPE_SEL = '#main-menu, #sub-menu, .breadcrumb, .breadcrumb-nav, .breadcrumb-container';

    const togglesSel = [
      '.mega-toggle',                                         // 메가 토글(햄버거)
      '.has-dropdown > .dropdown-toggle',                    // 헤더 드롭다운 토글
      '.breadcrumb-item.dropdown > .dropdown-toggle',        // 브레드 항목 드롭다운 토글
      '.breadcrumb .dropdown-toggle',                        // 브레드 컨테이너 내 토글
      '.breadcrumb-nav .dropdown-toggle'                     // 브레드 컨테이너 내 토글
    ].join(', ');

    const itemSel = [
      '.mega-menu a',                        // 메가 메뉴 항목
      '.has-dropdown .dropdown-menu a',      // 헤더 드롭다운 항목
      '#main-menu a',                        // 브레드 대분류 UL
      '#sub-menu a',                         // 브레드 소분류 UL
      '.breadcrumb a',                       // 브레드 컨테이너 내 링크 (보강)
      '.breadcrumb-nav a'                    // 브레드 컨테이너 내 링크 (보강)
    ].join(', ');

    const rootsSel = [
      '.mega-dropdown',                      // 메가 드롭다운 루트
      '.has-dropdown',                       // 헤더 드롭다운 루트
      '.breadcrumb-item.dropdown',           // 브레드 드롭다운 루트
      '.breadcrumb',                         // 브레드 컨테이너(보강)
      '.breadcrumb-nav',                     // 브레드 컨테이너(보강)
      '.breadcrumb-container',                // 브레드 컨테이너(보강)
      '#search-popup'                        // 검색창 래퍼 추가
    ].join(', ');

    const mainMenu      = document.getElementById('main-menu');   // 브레드 대분류 목록(UL)
    const subMenu       = document.getElementById('sub-menu');    // 브레드 소분류 목록(UL)
    const mainLabelSpan = document.getElementById('main-label');  // 브레드 라벨(대분류)
    const subLabelSpan  = document.getElementById('sub-label');   // 브레드 라벨(소분류)

    // (선택) 초기 존재 체크: 없으면 경고만 남기고 나머지는 계속 동작
    ['#main-menu', '#sub-menu', '#main-label', '#sub-label'].forEach(sel => {
      if (!document.querySelector(sel)) {
        console.warn('[oll_menu] Missing element:', sel, '— breadcrumb UI는 출력되지만 라벨/목록 갱신은 제한됩니다.');
      }
    });

    // ─────────────────────────────────────
    // 3) 메가 메뉴 '항상 전체 보기' 강제 유틸
    // ─────────────────────────────────────

    // (A) 모든 메가 컬럼을 보이고, 모든 하이라이트 제거
    function showMegaAll() {
      // 컬럼 전부 표시 (flex 가정, 다른 값이어도 동작에 지장 없음)
      document.querySelectorAll('.mega-menu .mega-column').forEach(col => {
        col.style.display = 'flex';
      });
      // 하이라이트 제거
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => {
        h4.classList.remove('active');
      });
    }

    // (B) 외부 스크립트가 메가를 건드려도 항상 전체 보기로 강제
    window.updateMegaColumns = function () { showMegaAll(); };
    window.setMegaActive     = function () {
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => h4.classList.remove('active'));
    };

    // ─────────────────────────────────────
    // 4) 공통: 드롭/메가 열고 닫기
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

    // ─────────────────────────────────────
    // 5) 선택 적용(네비게이션 + 브레드 라벨만 갱신)
    //     → 메가 메뉴 시각 상태는 항상 전체 보기 유지
    // ─────────────────────────────────────
    function applySelection(mainKey, subKey, source) {
      // 같은 UI에서 같은 선택 반복 → 무시
      if (selectedMainKey === mainKey && selectedSubKey === subKey && lastSource === source) return;

      const changed = (selectedMainKey !== mainKey) || (selectedSubKey !== subKey);
      selectedMainKey = mainKey || null;
      selectedSubKey  = subKey  || null;
      lastSource      = source;

      // 브레드 라벨 갱신(있을 때만)
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

      // 대분류가 바뀌면 브레드 소분류 목록 재생성
      if (changed && mainKey && subMenu && mainMenu) {
        populateSubMenu(mainKey);
      }

      // 메가 메뉴는 항상 전체 보기 유지 (혹시 외부 코드가 건드려도 즉시 복구)
      setTimeout(showMegaAll, 0);

      // 변경 + 소분류 확정 시에만 이동
      if (changed && mainKey && subKey) {
        location.href = `/detail.php?main=${mainKey}&sub=${subKey}`;
      }

      closeAllDropdowns();
    }

    // ─────────────────────────────────────
    // 6) 브레드 메뉴 생성/갱신
    // ─────────────────────────────────────
    function populateMainMenu() {
      if (!mainMenu) return;
      mainMenu.innerHTML = '';
      [
        { label: '음료', value: 'headerDrink' },
        { label: '스낵', value: 'headerSnack' }
      ].forEach(item => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#';
        a.textContent = item.label;
        a.setAttribute('data-main', item.value);
        a.addEventListener('click', e => {
          e.preventDefault();
          applySelection(item.value, null, 'breadcrumb');
        });
        li.appendChild(a);
        mainMenu.appendChild(li);
      });
    }

    function populateSubMenu(mainKey) {
      if (!subMenu) return;
      subMenu.innerHTML = '';
      (SUB_MAP[mainKey] || []).forEach(sub => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#';
        a.textContent = sub.label;
        a.setAttribute('data-main', mainKey);
        a.setAttribute('data-sub',  sub.value);
        a.addEventListener('click', e => {
          e.preventDefault();
          applySelection(mainKey, sub.value, 'breadcrumb');
        });
        li.appendChild(a);
        subMenu.appendChild(li);
      });
    }

    // 대분류 기본 목록 생성
    populateMainMenu();

    // URL 직진입 시 라벨 복원 (?main=headerDrink&sub=headerSoda)
    (function syncFromURL() {
      const p  = new URLSearchParams(location.search);
      const mk = p.get('main');
      const sk = p.get('sub');
      if (mk && (mk in MAIN_MAP)) {
        const validSub = (SUB_MAP[mk] || []).some(s => s.value === sk) ? sk : null;
        applySelection(mk, validSub, 'init');
      }
    })();

    // ─────────────────────────────────────
    // 7) 이벤트 위임 (메가/드롭/브레드)
    // ─────────────────────────────────────
    document.addEventListener('click', (e) => {
      // ① 메가 토글(햄버거) → 열고 닫기 + 열리면 항상 전체 보기 강제
      const megaToggle = e.target.closest('.mega-toggle');
      if (megaToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(megaToggle);
        const root = megaToggle.closest('.mega-dropdown');
        if (root && root.classList.contains('open')) {
          showMegaAll();
        }
        return;
      }

      // ② 헤더/브레드 드롭 토글(열기/닫기만. 메가는 절대 건드리지 않음)
      const headerDropToggle = e.target.closest('.has-dropdown > .dropdown-toggle, .breadcrumb-item.dropdown > .dropdown-toggle, .breadcrumb .dropdown-toggle, .breadcrumb-nav .dropdown-toggle');
      if (headerDropToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(headerDropToggle);
        setTimeout(showMegaAll, 0); // 혹시 외부 코드가 메가를 건드리면 즉시 원복
        return;
      }

      // ③ 항목 클릭(메가/드롭/브레드 공통) → 네비게이션/라벨만 갱신
      const item = e.target.closest(itemSel);
      if (item) {
        e.preventDefault(); e.stopPropagation();

        const mainKey = item.getAttribute('data-main') || selectedMainKey;
        const subKey  = item.getAttribute('data-sub')  || null;

        // ★ 누락되면 죽는 부분 — 브레드 범위 판정
        const inBreadcrumb = item.closest(BREAD_SCOPE_SEL);

        const source =
          item.closest('.mega-menu') ? 'mega' :
          inBreadcrumb               ? 'breadcrumb' :
                                       'headerDrop';

        if (!mainKey && inBreadcrumb) {
          // 브레드크럼에서 대분류 <a>에 data-main이 없다면 attr이 필요
          console.warn('[oll_menu] breadcrumb item에 data-main이 없습니다. data-main="headerDrink" 같은 속성이 필요합니다.', item);
        }

        if (mainKey) applySelection(mainKey, subKey, source);

        // 어떤 경로로든 클릭 뒤 메가는 항상 전체로 복원
        setTimeout(showMegaAll, 0);
        return;
      }

      // ④ 메뉴 바깥 클릭 → 모두 닫기
      if (document.querySelector(`${rootsSel}.open`)) {
        const inMenus = e.target.closest(rootsSel);
        if (!inMenus) closeAllDropdowns();
      }
    }, false);

    // ⑤ ESC로 닫기 + 스페이스 스크롤 방지(토글/항목에 한함)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.querySelector(`${rootsSel}.open`)) {
          e.stopPropagation();
          closeAllDropdowns();
        }
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
      // 초기에도 메가 전체 보기 맞춰 둠 + 하드코딩 active 제거
      showMegaAll();
      document.querySelectorAll('.mega-menu h4[data-main].active').forEach(h4 => h4.classList.remove('active'));
    })();

  });
})();

// ─────────────────────────────────────
// 9) 검색창 열기/닫기
// ─────────────────────────────────────
// (function initSearchPopup(){
//   const searchBtn   = document.getElementById('search-btn');
//   const searchPopup = document.getElementById('search-popup');
//   const closeBtn    = document.getElementById('close-popup');

//   if (!searchBtn || !searchPopup) return;

//   function openSearch(){
//     searchPopup.classList.add('open');
//   }
//   function closeSearch(){
//     searchPopup.classList.remove('open');
//   }

//   searchBtn.addEventListener('click', e=>{
//     e.preventDefault();
//     e.stopPropagation(); // 밖 클릭 방지
//     openSearch();
//   });

//   if (closeBtn) {
//     closeBtn.addEventListener('click', e=>{
//       e.preventDefault();
//       closeSearch();
//     });
//   }
// })();

// 9 검색창 열기 /닫기(absolute 유지 + 동적 높이 계산)

(function initSearchPopup(){
  const searchBtn = document.getElementById('search-btn');
  const searchPopup = document.getElementById('search-popup');
  const closeBtn = document.getElementById('close-popup');
  // const popupContent = document.getElementById('popup-conten') || (searchPopup && searchPopup.querySelector('.popup-content'));
  const popupContent = (searchPopup && searchPopup.querySelector('.popup-content')) 
                     ||(searchPopup && document.getElementById('popup-content'));

  if (!searchBtn || !searchPopup) return;

  // [핵심] 팝업 상단(y) 기준으로 화면 바닥까지 남은 높이 계산
  function recalcPopupHeight(){
    if (!searchPopup.classList.contains('open')) return;

    // // 버튼의 화면 기준 위치를 얻어서, 버튼 하단 + 8px에서 팝업이 시작한다고 가정
    // const btnRect = searchBtn.getBoundingClientRect();
    // const topPx   = btnRect.bottom + 8; //css의 top: calc(100% + 8px)과 일치

    // // 화면 높이 - 팝업 시작 y - 하단 여백(16px) 
    // const popupTop = searchPopup.getBoundingClientRect().top;
    // const avail = Math.max(160, Math.floor(window.innerHeight - popupTop - 16));
    
    // 화면 높이 - 팝업(자기 자신)의 화면상 top - 하단 여백(16px)
    const popupTop = searchPopup.getBoundingClientRect().top;
    const avail = Math.max(160, Math.floor(window.innerHeight - popupTop - 16));
     // 팝업은 바깥 스크롤 금지, 내부 콘텐츠만 스크롤
    searchPopup.style.maxHeight = avail + 'px';
    if (popupContent) popupContent.style.maxHeight = avail + 'px';
  }

  function openSearch(){
    searchPopup.classList.add('open');
    // 레이아웃이 잡힌 다음 프레임에 계산 (열리는 transition/폰트 로드 보정)
    requestAnimationFrame(() => {
      recalcPopupHeight();
      setTimeout(recalcPopupHeight, 50); // 혹시 몰라 한 번 더
    });
  }

  function closeSearch(){
    searchPopup.classList.remove('open');
  }

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openSearch();
  });

  if (closeBtn){
    closeBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      closeSearch();
    });
  }

  // 팝업 밖 클릭하면 닫기
   document.addEventListener('click', (e) => {
    if (!searchPopup.contains(e.target) && !searchBtn.contains(e.target)) {
      closeSearch();
    }
   });

   //스크롤/리사이즈 시에도 높이 재계산 (absolute 유지하면서 화면 끝까지)
   window.addEventListener('scroll', recalcPopupHeight, {passive: true});
   window.addEventListener('resize', recalcPopupHeight);
})();

// ─────────────────────────────────────
// 10) 검색 실행 버튼 기능
// ─────────────────────────────────────

(function initSearchAction(){
  const searchSubmitBtn = document.querySelector('.search-submit-btn');
  if (!searchSubmitBtn) return;

  searchSubmitBtn.addEventListener('click', function(e){
    e.preventDefault();

    // 1 선택된 대체당(sweetener) 체크박스 값 읽기
    const sweeteners = Array.from(document.querySelectorAll('input[name="sweetener"]:checked'))
    .map(cb => cb.value);

    // 2 선택된 알러지(allergy) 체크박스 값 읽기
    const allergies = Array.from(document.querySelectorAll('input[name="allergy"]:checked'))
    .map(cb => cb.value);

    // 3 url 파라미터 만들기
    const params = new URLSearchParams();
    if (sweeteners.length) params.set('sweetener', sweeteners.join(','));
    if (allergies.length) params.set('allergy', allergies.join(','));

    // 4 검색 결과 페이지로 이동 (예: search.html)
    location.href = `/search.html?${params.toString()}`;

    });
})();