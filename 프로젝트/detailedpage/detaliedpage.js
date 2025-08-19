// ScrollSpy + Smooth Scroll (리셋.css 무관, 확실판)
// - 클릭: 기본 앵커 점프 막고, 섹션.scrollIntoView 사용
// (scroll-mergin-top을 존중하므로 스크롤 컨테이너/ 브라우저 상관없이 동작)
// 스크롤: 헤더+탭 높이 보정 기준으로 현재 탭 .active 갱신

// ScrollSpy + Smooth Scroll + Bottom 하드가드 + "더보기" 토글
(()=> {
  document.addEventListener('DOMContentLoaded', () => {
    const NAV_ID = 'scrollspy-nav';
    const nav = document.getElementById(NAV_ID);
    if (!nav) return;

    // 1) 네비 내부 앵커 수집 a[href^="#"]만 대상 (외부 링크 제외)
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    // 2) 링크 => 섹션 매핑
   const items = links
   .map(a => {
    const href = (a.getAttribute('href') || '').trim(); // getAttribute로 읽기
    if (!href || !href.startsWith('#')) return null;
    const section = document.querySelector(href);
    return section ? { a, section, href } : null;
   })
   .filter(Boolean);
    if (!items.length) return;

    // 3) 섹션의 'DOM 실제 등장 순서'로 정렬한 배열
    const itemsByDoc = [...items].sort((x, y) => {
      // x.section이 y.section보다 문서에서 먼저 나오면 음수
      const pos = x.section.compareDocumentPosition(y.section);
      // x가 y 앞에 오면 FOLLOWING 플래그가 켜진다 -> x 먼저(-1)
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0; // 같은 노드이거나 포함환계 등: 영향 없게 0
    });

    // 4) .css 변수 읽기 (헤더/탭 높이)
    const readVarPx = (name) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : null;
    };
    const measure = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().height) : 0;
    };
    const currentOffset = () => {
      // 1 순위: css 변수, 2 순위: 실측(헤더/탭), 3 순위: 안전 기본값
      const vHdr = readVarPx('--hdr-h');
      const vTab = readVarPx('--scrollnav-h');
      if (vHdr != null && vTab !== null) return vHdr + vTab + 8;
      const h = measure('header');
      const t = measure('#' + NAV_ID); // 가로 스크롤 탭 컨테이너
      const sum = h + t;
      return (sum > 0 ? sum : 112) + 8; // 기본값 60+52+여유
    };

    // 5) 탭 .active 토글
    const setActive = (el) => {
      links.forEach(x => x.classList.remove('active'));
      if (el) el.classList.add('active');
    };        

    // 6) 탭 클릭 -> 스무스 스크롤 (중간 onScroll 무시락)
    let lockUntil = 0;
    const lockFor = (ms) => { lockUntil = performance.now() + ms; };
    const isLocked = () => performance.now() < lockUntil;

    // ) 클릭 이동 - scrollIntoView 사용 (컨테이너 자동 탐지)
    links.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = (a.getAttribute('href') || '').trim();
        if (!href || !href.startsWith('#')) return;

        // items에서 해당 섹션 재사용 (중복 DOM 탐색 피함)
        const it = items.find(it => it.a === a || it.href === href);
        const target = it ? it.section : null;
        if (!target) return;
        e.preventDefault(); //기본 앵커 점프 방지(우리가 제어)
        setActive(a); // 먼저 활성화
        lockFor(500); // 0.5s 정도 잠금 (스무스 중 튐 방지)
        // css의 scroll-margin-top을 활용해 정확히 상단 정렬
        target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
        // 해시 갱신(선택)
        try{ history.replaceState(null, '', href); } catch {}
        // 보조:스무스 스크롤 중간에도 활성화 재판정
        setTimeout(onScroll, 220);
      }, { capture: true}); //다른 핸들러가 가로채기 전에 선점
    });
 
    // 7) 스크롤러 수집/ 바인딩 
    const scrollers = new Set([window]); // 먼저 선언 필수
    // 7-1) window + 섹션들의 '스크롤 가능한' 조상들을 모두 수집
    const isScrollable = (el) => {
    const cs = getComputedStyle(el);
    const o = cs.overflow, ox = cs.overflowX, oy = cs.overflowY;
    const canY = (oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight;
    const canX = (ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth;
    const canO = (o  === 'auto' || o  === 'scroll') &&
                 (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
    return canY || canX || canO;
   };
   // 7-2 섹션의 스크롤 가능한 조상들 수집 
   const addScrollableAncestors = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      if (isScrollable(p)) scrollers.add(p);
      p = p.parentElement;
    }
   };
   items.forEach(it => addScrollableAncestors(it.section));

   // 8) 문서 높이 / 바닥 판정(브라우저 차이 흡수 + 여유 4px)
   function getDocMetrics() {
    const de = document.documentElement, b = document.body;
    const scrollY = window.pageYOffset !== undefined ? window.pageYOffset : window.scrollY;
    const innerH  = window.innerHeight;
    const docH    = Math.max(de.scrollHeight, b.scrollHeight);
    return { scrollY, innerH, docH};
   }
   // 추가) '실제로 스크롤 기능' 하고 '바닥 근처'일 때만 true
   const isAtBottom = (el) => {
    if (el === window){
      const { scrollY, innerH, docH } = getDocMetrics();
      const maxScroll = docH - innerH;
      if (maxScroll <= 2) return false; // 스크롤 자체가 불가
      return scrollY >= (maxScroll - 4); // 여유 4px
    } else {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 2 ) return false;
      return el.scrollTop >= (maxScroll - 2);
   }
   };
    // 9) 스크롤 스파이 - 뷰포트 기준으로 판정
    let ticking = false; // 추가: 스크롤 처리 중복 방지 플래그 (선언 먼저 )
    const onScroll = () => {
      if (isLocked()) return;
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = currentOffset(); // 헤더 + 탭 보정선(화면 위에서 y만큼 내려간 선)
        let cur = itemsByDoc[0];

        // DOM 순서대로 위->아래 스캔
        for (const it of itemsByDoc) {
          const top = it.section.getBoundingClientRect().top; // 섹션의 뷰포트 상단 거리
          if (top - y <= 0) cur = it; 
          else break;
        }

        // ' 맨 아래' 도달 시 마지막 섹션을 강제로 선택
        // - window 스크롤 하단
      //  const atWindowBottom = isAtBottom(window);
        // - 내부 스크롤러 하단(앞서 만든 scrollers Set 사용)
        let atAnyScrollerBottom = isAtBottom(window);
        if (!atAnyScrollerBottom) {
          scrollers.forEach(s => {
            if (s !== window && isAtBottom(s)) atAnyScrollerBottom = true;
          });
        }

        // 하드가드 : 마지막 섹션 bottom이 뷰포트 안에 들어오면 바닥으로 간주
        const last = itemsByDoc[itemsByDoc.length  - 1];
        if (last) {
          const rect = last.section.getBoundingClientRect();
          const bottomVisible = rect.bottom <= window.innerHeight && rect.bottom > 0;
          if (bottomVisible) atAnyScrollerBottom = true;
        }

        // 실제 스크롤이 있었을 때만 마지막 섹션 강제 선택
        const didScroll =
        window.scrollY > 0 ||
          Array.from(scrollers).some(s => s !== window && s.scrollTop > 0);
       
          if (atAnyScrollerBottom && didScroll) {
          cur = last;
        }

        // 네비 .active 갱신 + 네비 가시영역 유지
        setActive(cur && cur.a);
        if (cur && cur.a){
          cur.a.scrollIntoView({ behavior: 'auto', block: 'nearest',inline: 'center' });
        }

        ticking = false;
      });
    };

    // 바닥 센티널 (가장 확실한 하드가드)
    const lastItem = itemsByDoc[itemsByDoc.length - 1];
    const SENTINEL_ID = 'scrollspy-end-sentinel';
    let endSentinel = document.getElementById(SENTINEL_ID);
    
    // 마지막 섹션 바로 뒤에 1px 센티널 주입(없으면 생성)
    if (!endSentinel && lastItem) {
      endSentinel = document.createElement('div');
      endSentinel.id = SENTINEL_ID;
      endSentinel.setAttribute('aria-hidden', 'true');
      endSentinel.style.cssText = 'position:relative;width:1px;height:1px;margin:0;padding:0;';
      lastItem.section.after(endSentinel);
    }

    let endIO = null;
    const attachEndObserver = () => {
      if (!endSentinel || !lastItem) return;
      if (endIO) endIO.disconnect();

      const marginTop = currentOffset(); // 헤더 + 탭 보정 반영
      endIO = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.target === endSentinel && e.isIntersecting) {
            // 센티널이 보이면 무조건 마지막 탭(문의) 활성화
            setActive(lastItem.a);
            lastItem.a.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center'});
          }
        }
      }, {
        root: null,
        threshold: 0,
        rootMargin: `0px 0px -${marginTop}px 0px`, //바닥 기준선을 위로 올려 조기 판정 
    });

    endIO.observe(endSentinel);
  };

    // 8  모든 스크롤러에 스파이 핸들러 연결 (필수)
    scrollers.forEach(s => s.addEventListener('scroll', onScroll, { passive: true}));

    //보조: 휠/터치로 스크롤할 때도 안전하게 트리거 (키보드/스크롤바 드래그 쓰면 없어도 됨)
    document.addEventListener('wheel', onScroll, {passive: true});
    document.addEventListener('touchmove', onScroll, {passive: true});

    // 3) 보정 이벤트
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll);
    onScroll(); // 초기 1회
    

    // 상세 정보 "더보기 토글"
    // 버튼: .detail-toggle-btn
    // 목록: data-target="#id"로 지정하거나, 같은 .section 안의 .detail-list 자동 탐색
    // .detail-list에 .collapsed가 있으면 접힘(max-height 등은 css에서 처리)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.detail-toggle-btn');
      if (!btn) return;

      // (a) data-target 우선
      let list = null;
      const sel = btn.getAttribute('data-target');
      if (sel) list = document.querySelector(sel);

      // (b) 없으면 같은 섹션 범위에서 탐색
      if (!list) {
        const scope = btn.closest('.section') || document;
        list = scope.querySelector('.detail-list');
       }
       if (!list) return;

       const collapsed = list.classList.toggle('collapsed'); // true면 접힘 상태
       btn. setAttribute('aria-expanded', String(!collapsed));
       const showLabel = btn.getAttribute('data-show') || '더보기';
       const hideLabel = btn.getAttribute('data-hide') || '접기';
       btn.textContent = collapsed ? showLabel : hideLabel;

       // 레이아웃 높이 변화 반영(센티널/스파이 재판정)
       attachEndObserver();
       onScroll();
       });

       // 12) (옵션) 상/하 스크롤 버튼 - 있으면 연동, 없으면 무시
        document.addEventListener('click', (e) => {
          const up   = e.target.closest('.scroll-btn.up');
          const down = e.target.closest('.scroll-btn.down');

          if (up) {
            e.preventDefault();
            lockFor(400);
            const first = itemsByDoc[0];
            if (first && first.section){
              first.section.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
              setActive(first.a);
            }else{
              // 없을 때만 윈도우 스크롤로 폴백
              window.scrollTo({ top: 0, behavior: 'smooth'});
            }
            setTimeout(onScroll, 220);
          }
      

          if (down) {
            e.preventDefault();
            lockFor(500);
            const last = itemsByDoc[itemsByDoc.length - 1];
            if (last && last.section) {
              last.section.scrollIntoView({behavior: 'smooth', block:'start', inline: 'nearest'});
            }else{
              const de = document.documentElement, b = document.body;
              const docH = Math.max(de.scrollHeight, b.scrollHeight);
              window.scrollTo({top: docH, behavior: 'smooth'});
            }
            setTimeout(onScroll, 220);
          }
        });

        // first.section.scrollIntoView() 다음 줄에 선택적으로 추가
        Array.from(scrollers).forEach(s => {
          if (s === window) window.scrollTo({ top: 0, behavior: 'smooth'});
          else if(typeof s.scrollTo === 'function') s.scrollTo({top: 0, behavior: 'smooth'});
          else s.scrollTop = 0;
        });

       // 이벤트 바인딩 + 초기 1 회 편정/옵저버 부착
       const binders = () => {
        scrollers.forEach(s => s.addEventListener('scroll',onScroll, {passive: true}));
        document.addEventListener('wheel', onScroll, {passive: true });
        document.addEventListener('touchmove', onScroll, {passive: true});
        window.addEventListener('resize', () => {onScroll(); attachEndObserver(); });
        window.addEventListener('load', () => {onScroll(); attachEndObserver(); });
       };

       binders();
       onScroll();
       attachEndObserver();
  });
})();
