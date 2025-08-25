/* ============================================================
   app.ui.main.fixed.js — 메인(브레드 없음) 슬라이더 + 메가/헤더 드롭 + 검색 팝업
   - 이 스크립트 하나로 슬라이더, 메가메뉴, 드롭다운, 검색 팝업을 제어합니다.
   - HTML의 셀렉터(id/class)가 아래 주석에 나온 이름과 일치해야 정상 동작합니다.
   ============================================================ */
(function () {
  'use strict'; // 엄격 모드 활성화

  // DOM 트리가 완전히 준비된 후 실행
  document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       [A] 슬라이더 초기화
       - 구조: 
         - 컨테이너: .slider-container
         - 슬라이드: .slide (연속 배치)
         - 도트: .dot (페이지 네비)
       - 기능:
         - 앞/뒤 복제 슬라이드로 무한 루프 구현
         - 도트 클릭 이동
         - 3초 간격 자동 재생
       ========================= */
    (function initSlider() {
      const sliderContainer = document.querySelector('.slider-container'); // 슬라이더 트랙 컨테이너
      const slides = document.querySelectorAll('.slide');                  // 원본 슬라이드 목록
      const dots = document.querySelectorAll('.dot');                      // 도트 네비 목록
      if (!sliderContainer || slides.length === 0) return;                 // 요소 없으면 기능 비활성

      let currentSlide = 1; // 현재 인덱스(복제 포함 기준). 시작은 1(앞에 lastClone이 들어감)

      // 첫 슬라이드/마지막 슬라이드 복제해서 앞뒤로 추가(무한 루프용)
      const firstClone = slides[0].cloneNode(true);
      const lastClone = slides[slides.length - 1].cloneNode(true);
      firstClone.classList.add('clone'); // 복제 표시용 클래스
      lastClone.classList.add('clone');

      sliderContainer.appendChild(firstClone);            // 맨 뒤에 첫 슬라이드 복제 추가
      sliderContainer.insertBefore(lastClone, slides[0]); // 맨 앞에 마지막 슬라이드 복제 추가

      const allSlides = sliderContainer.querySelectorAll('.slide'); // 복제 포함 전체 슬라이드
      const totalSlides = allSlides.length;                         // 전체 개수(원본+복제)

      // 초기 위치: 인덱스 1(실제 첫 원본)로 보이도록 트랜스폼 설정
      sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

      // 현재 인덱스에 맞춰 도트 활성화 표시
      function updateDots(n) {
        if (!dots.length) return;
        dots.forEach(d => d.classList.remove('active'));
        // 복제 포함 인덱스를 원본 기준 도트 인덱스로 보정
        dots[(n - 1 + slides.length) % slides.length].classList.add('active');
      }

      // 특정 인덱스 n으로 슬라이더 이동(애니메이션 포함)
      function showSlide(n) {
        sliderContainer.style.transition = 'transform 0.5s';     // 부드럽게 이동
        sliderContainer.style.transform = `translateX(-${n * 100}%)`;
        updateDots(n);                                            // 도트 상태 갱신
      }

      // 다음/이전 이동 헬퍼
      function nextSlide() { currentSlide++; showSlide(currentSlide); }
      function prevSlide() { currentSlide--; showSlide(currentSlide); }

      // 트랜지션 종료 시점에 복제 구간이면 실제 위치로 순간 점프(무한 루프 유지)
      sliderContainer.addEventListener('transitionend', () => {
        if (
          currentSlide >= 0 &&
          currentSlide < totalSlides &&
          allSlides[currentSlide] &&
          allSlides[currentSlide].classList.contains('clone') // 복제 구간 여부
        ) {
          sliderContainer.style.transition = 'none'; // 점프는 애니메이션 없이
          if (currentSlide === totalSlides - 1) {
            currentSlide = 1;                // 맨 끝 복제 → 첫 원본으로 점프
          } else if (currentSlide === 0) {
            currentSlide = slides.length;    // 맨 앞 복제 → 마지막 원본으로 점프
          }
          sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`; // 점프 적용
          void sliderContainer.offsetWidth;                                         // 리플로우로 상태 반영
          sliderContainer.style.transition = 'transform 0.5s';                      // 다시 애니메이션 복귀
        }
      });

      // 도트 클릭 시 해당 슬라이드로 이동(복제 보정: index + 1)
      if (dots.length) {
        dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            currentSlide = index + 1; // 원본 인덱스를 복제 포함 인덱스로 변환
            showSlide(currentSlide);
          });
        });
      }

      // 자동 재생(3초 간격)
      const autoplay = setInterval(nextSlide, 3000);

      // 외부 제어용(필요 시 버튼 등에서 호출)
      window.sliderNext = nextSlide;
      window.sliderPrev = prevSlide;
      window.sliderStop = () => clearInterval(autoplay);

      // 초기 도트 표시
      updateDots(currentSlide);
    })();


    /* =========================
       [B] 메가 메뉴/헤더 드롭다운 + 검색 팝업
       - 구조:
         - 메가 메뉴: .mega-dropdown > .mega-toggle + .mega-menu
         - 드롭다운:  .has-dropdown > .dropdown-toggle + .dropdown-menu
         - 검색 팝업: #search-btn, #search-popup, #close-popup, .search-submit-btn
       - 기능:
         - 토글 클릭으로 열기/닫기(.open 클래스 사용)
         - 항목 클릭 시 data-main/data-sub 기준으로 이동
         - 검색 팝업 체크박스를 쿼리스트링으로 전달
       ========================= */

    // 대/소분류 키-라벨 매핑(필요 시 확장)
    const MAIN_MAP = { headerDrink: 1, headerSnack: 2 };
    const SUB_MAP = {
      headerDrink: [
        { label: "탄산",   value: "headerSoda" },
        { label: "비탄산", value: "headerNonSoda" },
        { label: "분말",   value: "headerPowder" }
      ],
      headerSnack: [
        { label: "과자",       value: "headerCookie" },
        { label: "사탕류",     value: "headerCandy" },
        { label: "초콜릿",     value: "headerChocolate" },
        { label: "아이스크림", value: "headerIcecream" },
        { label: "빵",         value: "headerBread" }
      ]
    };

    // 현재 선택 상태(라벨 표시나 이동에 사용)
    let selectedMainKey = null; // 'headerDrink' | 'headerSnack'
    let selectedSubKey  = null; // 예: 'headerSoda'
    let lastSource      = null; // 클릭 출처 표시('mega' | 'headerDrop' | 'init')

    // 라벨 요소(선택 사항: 없으면 무시)
    const mainLabelSpan = document.getElementById('main-label'); // 현재 대분류 이름 출력
    const subLabelSpan  = document.getElementById('sub-label');  // 현재 소분류 이름 출력

    // 메가 메뉴는 항상 전체 컬럼 보이도록 강제
    function showMegaAll() {
      document.querySelectorAll('.mega-menu .mega-column').forEach(col => {
        col.style.display = 'flex'; // 컬럼 보이기
      });
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => {
        h4.classList.remove('active'); // 활성 표시 초기화
      });
    }
    // 필요 시 외부에서 호출 가능한 공개 함수
    window.updateMegaColumns = function () { showMegaAll(); };
    window.setMegaActive     = function () {
      document.querySelectorAll('.mega-menu h4[data-main]').forEach(h4 => h4.classList.remove('active'));
    };

    // 토글/아이템/루트 셀렉터 문자열(이벤트 위임에서 사용)
    const togglesSel = [
      '.mega-toggle',
      '.has-dropdown > .dropdown-toggle'
    ].join(', ');

    const itemSel = [
      '.mega-menu a',
      '.has-dropdown .dropdown-menu a'
    ].join(', ');

    const rootsSel = [
      '.mega-dropdown',
      '.has-dropdown',
      '#search-popup'
    ].join(', ');

    // 모든 드롭다운/메가 메뉴를 닫는 유틸리티(.open 제거)
    function closeAllDropdowns() {
      document.querySelectorAll(rootsSel).forEach(dd => {
        dd.classList.remove('open'); // 열림 상태 제거
        const t = dd.querySelector('.mega-toggle, .dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false'); // 접근성 속성 업데이트
      });
    }

    // 토글 요소 클릭 시 해당 루트 열고, 다른 루트는 닫기
    function toggleDropdownByToggle(toggleEl) {
      // 메가/드롭 공용: 가장 가까운 루트(.mega-dropdown 또는 .has-dropdown) 찾기
      const root = toggleEl.closest('.mega-dropdown, .has-dropdown');
      if (!root) return;
      const willOpen = !root.classList.contains('open'); // 현재 반대 상태로 전환
      closeAllDropdowns(); // 먼저 모두 닫고
      if (willOpen) {
        root.classList.add('open');                 // 해당 루트만 열기
        toggleEl.setAttribute('aria-expanded', 'true');
      } else {
        toggleEl.setAttribute('aria-expanded', 'false');
      }
    }

    // 페이지 내에 열린 드롭다운/메가 메뉴가 하나라도 있는지 여부
    function anyDropdownOpen() {
      return Array.from(document.querySelectorAll(rootsSel))
        .some(el => el.classList.contains('open'));
    }

    // 항목 선택 적용(라벨 갱신 + 필요 시 상세 페이지 이동)
    function applySelection(mainKey, subKey, source) {
      // 동일 선택/출처이면 갱신 생략
      if (selectedMainKey === mainKey && selectedSubKey === subKey && lastSource === source) return;

      const changed = (selectedMainKey !== mainKey) || (selectedSubKey !== subKey); // 변경 여부
      selectedMainKey = mainKey || null;
      selectedSubKey  = subKey  || null;
      lastSource      = source;

      // 라벨 요소가 있으면 텍스트 갱신
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

      // 메가 메뉴 컬럼 상태를 항상 전체 보이기 유지
      setTimeout(showMegaAll, 0);

      // 대/소분류가 확정되면 상세 페이지로 이동(정적 링크)
      if (changed && mainKey && subKey) {
        const href = `./detailedpage/detailedpage.html?main=${encodeURIComponent(mainKey)}&sub=${encodeURIComponent(subKey)}`;
        location.href = href;
      }

      // 선택 후 모든 드롭/메가 닫기
      closeAllDropdowns();
    }

    // URL 쿼리(?main=...&sub=...)로 진입 시 라벨만 복원
    (function syncFromURL() {
      const p  = new URLSearchParams(location.search); // 현재 URL 파라미터
      const mk = p.get('main');                        // main 파라미터
      const sk = p.get('sub');                         // sub 파라미터
      if (mk && (mk in MAIN_MAP)) {
        const validSub = (SUB_MAP[mk] || []).some(s => s.value === sk) ? sk : null; // 유효한 소분류만 반영
        applySelection(mk, validSub, 'init'); // 초기화 출처로 라벨 복원
      }
    })();

    // 클릭 이벤트 위임: 문서 전체에서 필요한 요소를 감지해 동작
    document.addEventListener('click', (e) => {
      // [A] 검색 팝업 열기/닫기
      const searchBtn   = e.target.closest('#search-btn');     // 검색 버튼
      const closePopup  = e.target.closest('#close-popup');    // 팝업 닫기 버튼
      const searchPopup = document.getElementById('search-popup'); // 팝업 레이어

      // 검색 버튼 클릭: 팝업 열기/닫기 토글
      if (searchBtn && searchPopup) {
        e.preventDefault(); e.stopPropagation();
        searchPopup.classList.toggle('open');
        // 열릴 때 포커스를 내부 첫 입력 요소로 이동
        const first = searchPopup.querySelector('input, select, textarea, button');
        if (first && searchPopup.classList.contains('open')) setTimeout(() => first.focus(), 0);
        return;
      }

      // 닫기 버튼 클릭: 팝업 닫기
      if (closePopup && searchPopup) {
        e.preventDefault(); e.stopPropagation();
        searchPopup.classList.remove('open');
        return;
      }

      // 팝업 외부 클릭: 팝업이 열려 있으면 닫기
      if (searchPopup && searchPopup.classList.contains('open')) {
        const inside = e.target.closest('#search-popup') || e.target.closest('#search-btn');
        if (!inside) searchPopup.classList.remove('open');
      }

      // [B] 메가 메뉴 토글(.mega-toggle)
      const megaToggle = e.target.closest('.mega-toggle');
      if (megaToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(megaToggle);                // 해당 루트만 열기/닫기
        const root = megaToggle.closest('.mega-dropdown'); // 메가 루트
        if (root && root.classList.contains('open')) showMegaAll(); // 열렸다면 컬럼 전체 표시
        return;
      }

      // [C] 헤더 드롭다운 토글(.has-dropdown > .dropdown-toggle)
      const headerDropToggle = e.target.closest('.has-dropdown > .dropdown-toggle');
      if (headerDropToggle) {
        e.preventDefault(); e.stopPropagation();
        toggleDropdownByToggle(headerDropToggle); // 해당 드롭다운만 토글
        setTimeout(showMegaAll, 0);               // 레이아웃 보정
        return;
      }

      // [D] 메뉴/메가 항목 클릭 시 선택 적용 및 이동
      const item = e.target.closest(itemSel);
      if (item) {
        e.preventDefault(); e.stopPropagation();
        const mainKey = item.getAttribute('data-main') || selectedMainKey; // 항목에 명시된 대분류 키
        const subKey  = item.getAttribute('data-sub')  || null;            // 항목에 명시된 소분류 키
        const source  = item.closest('.mega-menu') ? 'mega' : 'headerDrop'; // 클릭 출처 구분
        if (mainKey) applySelection(mainKey, subKey, source);               // 선택 반영
        setTimeout(showMegaAll, 0);
        return;
      }

      // [E] 검색 실행 버튼: 체크박스 값 수집 → 쿼리스트링으로 이동
      const searchSubmit = e.target.closest('.search-submit-btn, #search-submit-btn');
      if (searchSubmit) {
        e.preventDefault(); e.stopPropagation();

        // sweetener/allergy 체크된 값만 배열로 수집
        const sweeteners = Array.from(document.querySelectorAll('input[name="sweetener"]:checked')).map(cb => cb.value);
        const allergies  = Array.from(document.querySelectorAll('input[name="allergy"]:checked')).map(cb => cb.value);

        // URLSearchParams로 쿼리 문자열 구성(공백 없이 콤마로 합침)
        const params = new URLSearchParams();
        if (sweeteners.length) params.set('sweetener', sweeteners.join(','));
        if (allergies.length)  params.set('allergy',  allergies.join(','));

        // search.html로 이동(필터 없으면 쿼리 없음)
        const qs = params.toString();
        location.href = `./search.html${qs ? `?${qs}` : ''}`;
        return;
      }

      // [F] 메뉴 바깥 클릭 시 열린 드롭/메가 전부 닫기
      if (anyDropdownOpen()) {
        const inMenus = e.target.closest(rootsSel); // 클릭한 곳이 메뉴 계통 내부인지
        if (!inMenus) closeAllDropdowns();          // 외부라면 모두 닫기
      }
    }, false);

    // 키보드 접근성: ESC로 닫기, 스페이스로 스크롤 방지(토글/아이템 포커스 시)
    document.addEventListener('keydown', (e) => {
      // ESC: 열려 있는 드롭/메가 모두 닫기
      if (e.key === 'Escape' && anyDropdownOpen()) {
        e.stopPropagation();
        closeAllDropdowns();
      }
      // Space: 토글/아이템에 포커스가 있을 때는 페이지 스크롤 방지
      if (e.key === ' ') {
        const onToggle = e.target.closest(togglesSel);
        const onItem   = e.target.closest(itemSel);
        if (onToggle || onItem) e.preventDefault();
      }
    }, true);

    // 접근성 속성(aria/role) 기본 세팅
    (function initA11y() {
      // 모든 토글에 포커스 가능/aria 속성/연결 패널(role=menu) 설정
      document.querySelectorAll(togglesSel).forEach((tg, i) => {
        if (tg.tabIndex < 0) tg.tabIndex = 0;               // 키보드 포커스 가능
        tg.setAttribute('aria-haspopup', 'true');           // 하위 메뉴 보유
        tg.setAttribute('aria-expanded', 'false');          // 초기 닫힘 상태
        const panel = tg.nextElementSibling;                // 토글 다음 형제 요소(메뉴 패널)
        if (panel) {
          panel.setAttribute('role', 'menu');               // 메뉴 역할 지정
          if (!panel.id) panel.id = `menu-panel-${i}`;      // 패널 id가 없으면 생성
          tg.setAttribute('aria-controls', panel.id);       // 토글이 컨트롤하는 패널 id 지정
          // 패널 내부 메뉴 항목에 role=menuitem 지정 및 포커스 가능
          panel.querySelectorAll('a,button').forEach(mi => {
            mi.setAttribute('role', 'menuitem');
            if (mi.tabIndex < 0) mi.tabIndex = 0;
          });
        }
      });
      // 초기 메가메뉴 컬럼 상태 정리
      showMegaAll();
      // 활성 표시 초기화
      document.querySelectorAll('.mega-menu h4[data-main].active')
        .forEach(h4 => h4.classList.remove('active'));
    })();

  });
})();
