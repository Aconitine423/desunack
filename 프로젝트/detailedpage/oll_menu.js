// oll_menu.js — 메가 메뉴 '항상 전체 보기' 고정 + 드롭/브레드 동작 분리
// - 드롭/브레드 클릭해도 메가 메뉴 컬럼/하이라이트 절대 바뀌지 않음
// - 메가 토글(햄버거) 눌러 열면 항상 두 컬럼 전체 표시 + 하이라이트 없음
// - 메가 내부 항목 클릭 시에도 필터링 없이 네비게이션/라벨만 갱신
// - CSS 건드리지 않음

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // ─────────────────────────────────────
    // 0) 데이터 맵 (필요시 수정)
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
    // ─────────────────────────────────────
    const togglesSel = '.mega-toggle, .has-dropdown > .dropdown-toggle, .breadcrumb-item.dropdown > .dropdown-toggle';
    const itemSel    = '.mega-menu a, .has-dropdown .dropdown-menu a, #main-menu a, #sub-menu a';
    const rootsSel   = '.mega-dropdown, .has-dropdown, .breadcrumb-item.dropdown';

    const mainMenu      = document.getElementById('main-menu');   // 브레드 대분류 목록
    const subMenu       = document.getElementById('sub-menu');    // 브레드 소분류 목록
    const mainLabelSpan = document.getElementById('main-label');  // 브레드 라벨(대분류)
    const subLabelSpan  = document.getElementById('sub-label');   // 브레드 라벨(소분류)

    // ─────────────────────────────────────
    // 3) 메가 메뉴 '항상 전체 보기' 강제 유틸
    // ─────────────────────────────────────

    // (A) 모든 메가 컬럼을 보이고, 모든 하이라이트 제거
    function showMegaAll() {
      // 컬럼 전부 표시
      document.querySelectorAll('.mega-menu .mega-column').forEach(col => {
        col.style.display = 'flex';
      });
      // 하이라이트 제거
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => {
        h4.classList.remove('active');
      });
    }

    // (B) 혹시 다른 스크립트가 호출하더라도 결과를 '전체 보기'로 덮어쓰게 오버라이드
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
        const mainText = mainKey === 'headerDrink' ? '음료'
                        : mainKey === 'headerSnack' ? '스낵' : '대분류';
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
        a.href = '#'; a.textContent = item.label;
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
        a.href = '#'; a.textContent = sub.label;
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
    populateMainMenu();

    // URL 직진입 시 라벨 복원
    (function syncFromURL(){
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
        // 열렸다면 즉시 전체 보기로 맞춤
        const root = megaToggle.closest('.mega-dropdown');
        if (root && root.classList.contains('open')) {
          showMegaAll();
        }
        return;
      }

      // ② 헤더 드롭 토글(음료/스낵 라벨) → 열기/닫기만. 메가는 절대 건드리지 않음.
      const headerDropToggle = e.target.closest('.has-dropdown > .dropdown-toggle');
      if (headerDropToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(headerDropToggle);
        // 혹시 외부 코드가 메가를 건드리면 즉시 원복
        setTimeout(showMegaAll, 0);
        return;
      }

      // ③ 항목 클릭(메가/드롭/브레드 공통) → 네비게이션/라벨만 갱신
      const item = e.target.closest(itemSel);
      if (item) {
        e.preventDefault(); e.stopPropagation();

        const mainKey = item.getAttribute('data-main') || selectedMainKey;
        const subKey  = item.getAttribute('data-sub')  || null;

        const source =
          item.closest('.mega-menu')      ? 'mega' :
          item.closest('.breadcrumb-nav') ? 'breadcrumb' : 'headerDrop';

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
    });

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
    (function initA11y(){
      document.querySelectorAll(togglesSel).forEach((tg, i) => {
        if (tg.tabIndex < 0) tg.tabIndex = 0;
        tg.setAttribute('aria-haspopup', 'true');
        tg.setAttribute('aria-expanded', 'false');
        const panel = tg.nextElementSibling;
        if (panel) {
          panel.setAttribute('role', 'menu');
          if (!panel.id) panel.id = `menu-panel-${i}`;
          tg.setAttribute('aria-controls', panel.id);
          panel.querySelectorAll('a,button').forEach(mi=>{
            mi.setAttribute('role','menuitem');
            if (mi.tabIndex < 0) mi.tabIndex = 0;
          });
        }
      });
      // 초기에도 메가 전체 보기 맞춰 둠
      showMegaAll();
      // 하드코딩된 active가 있다면 제거
      document.querySelectorAll('.mega-menu h4[data-main].active').forEach(h4 => h4.classList.remove('active'));
    })();

  });
})();
