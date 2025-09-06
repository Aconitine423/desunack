(() => {
  'use strict';

  /* ================= 설정 ================= */
  const CONFIG = {
    SRC: 'points.json',               // 목데이터 or API URL
    EXPIRY_DAYS: 30,                  // 만료 임계(일)
    SIDEBAR_MATCH: '/My_page/points/',
    DEFAULT_TAB: 'earn',              // 초기 탭
    PAGE_SIZE: 10                     // 페이지당 행 수
  };

  /* ================= DOM ================= */
  const $list = document.getElementById('pointsList');          // UL
  const $total = document.getElementById('totalPoints');        // 총/잔액
  const $expiring = document.getElementById('expiringPoints');  // 30일 이내 만료합
  const $tabsWrap = document.querySelector('.points-tabs');     // 탭 버튼 영역
  const $pager = document.getElementById('pointsPagination');   // 페이징

  /* ================= 상태 ================= */
  let rowsAll = [];            // 전체 원천 데이터
  let filtered = [];           // 탭 필터 적용 결과
  let currentTab = CONFIG.DEFAULT_TAB;
  let currentPage = 1;

  /* ================= 유틸 ================= */
  const toInt = v => Number(v || 0);
  const fmt = n => toInt(n).toLocaleString('ko-KR');
  const daysBetween = (a,b) => Math.floor((b-a)/(1000*60*60*24));

  function parseDate(s){
    if (!s) return new Date('Invalid');
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(s)){ const [yy,mm,dd]=s.split('.'); return new Date(2000+ +yy, +mm-1, +dd); }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)){ const [y,m,d]=s.split('-'); return new Date(+y, +m-1, +d); }
    const d = new Date(s); return isNaN(d) ? new Date('Invalid') : d;
  }

  function normalizeRow(r){
    return {
      type: r.type || 'earn',        // 'earn' | 'use'
      date: r.date ?? '',
      orderId: r.orderId ?? '',
      items: r.items ?? '',
      price: toInt(r.price),
      points: toInt(r.points),       // 사용도 양수로 보관. 렌더에서 부호 처리
      expiresAt: r.expiresAt ?? ''
    };
  }

  /* ================= 헤더 보장 / 행 정리 ================= */
  function ensureHeader(){
    if (document.querySelector('#pointsList > li.head')) return;
    const head = document.createElement('li');
    head.className = 'head';
    head.innerHTML = `
      <div>일시</div>
      <div>주문번호</div>
      <div>주문 내역</div>
      <div>가격</div>
      <div>적립 포인트</div>
      <div>유효기간</div>
    `;
    $list.appendChild(head);
  }
  function clearRows(){ document.querySelectorAll('#pointsList > li.row').forEach(n=>n.remove()); }

  /* ================= 합계 ================= */
  function summarize(all){
    const now = new Date();
    const earnSum = all.filter(x=>x.type==='earn').reduce((a,x)=>a+toInt(x.points),0);
    const useSum  = all.filter(x=>x.type==='use').reduce((a,x)=>a+toInt(x.points),0);
    const balance = earnSum - useSum;
    const expiring = all
      .filter(x=>x.type==='earn')
      .filter(x=>{
        const exp = parseDate(x.expiresAt);
        const left = daysBetween(now, exp);
        return left >= 0 && left <= CONFIG.EXPIRY_DAYS;
      })
      .reduce((a,x)=>a+toInt(x.points),0);
    return { balance, expiring };
  }

  /* ================= 렌더 ================= */
  function renderRows(list){
    ensureHeader();
    clearRows();

    if (!list.length){
      const li = document.createElement('li'); li.className='row';
      const d = document.createElement('div');
      d.className='cell cell--center'; d.style.gridColumn='1 / -1';
      d.textContent='포인트 내역이 없습니다.';
      li.appendChild(d); $list.appendChild(li); return;
    }

    const frag = document.createDocumentFragment();
    list.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'row' + (r.type==='use' ? ' is-use' : '');
      const signedPoints = r.type==='use' ? `-${fmt(r.points)}` : fmt(r.points);

      const cells = [
        ['일시', r.date, 'cell cell--center'],
        ['주문번호', r.orderId, 'cell cell--center'],
        ['주문 내역', r.items, 'cell item-summary'],
        ['가격', fmt(r.price), 'cell cell--right'],
        ['적립 포인트', signedPoints, 'cell cell--right'],
        ['유효기간', r.expiresAt || '-', 'cell cell--center']
      ];

      cells.forEach(([label, value, cls])=>{
        const d = document.createElement('div');
        d.className = cls; d.dataset.label = label; d.textContent = value;
        li.appendChild(d);
      });
      frag.appendChild(li);
    });
    $list.appendChild(frag);
  }

  /* ================= 페이징 ================= */
  function totalPages(){ return Math.max(1, Math.ceil(filtered.length / CONFIG.PAGE_SIZE)); }
  function sliceByPage(page){
    const start = (page - 1) * CONFIG.PAGE_SIZE;
    return filtered.slice(start, start + CONFIG.PAGE_SIZE);
  }

  function renderPagination(){
    if (!$pager) return;
    $pager.innerHTML = '';

    const tp = totalPages();

    // Prev
    const prev = document.createElement('button');
    prev.type='button'; prev.textContent='이전';
    prev.dataset.page='prev';
    if (currentPage === 1) prev.disabled = true;
    $pager.appendChild(prev);

    // Page numbers (1부터)
    for (let p=1; p<=tp; p++){
      const btn = document.createElement('button');
      btn.type='button'; btn.textContent=String(p);
      btn.dataset.page=String(p);
      if (p === currentPage) btn.classList.add('is-active');
      $pager.appendChild(btn);
    }

    // Next
    const next = document.createElement('button');
    next.type='button'; next.textContent='다음';
    next.dataset.page='next';
    if (currentPage === tp) next.disabled = true;
    $pager.appendChild(next);
  }

  function bindPagination(){
    if (!$pager) return;
    $pager.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-page]');
      if (!btn) return;

      const tp = totalPages();
      const token = btn.dataset.page;

      if (token === 'prev') currentPage = Math.max(1, currentPage - 1);
      else if (token === 'next') currentPage = Math.min(tp, currentPage + 1);
      else currentPage = Math.min(tp, Math.max(1, parseInt(token, 10) || 1));

      renderRows(sliceByPage(currentPage));
      renderPagination();
    });
  }

  function applyTab(tab){
    currentTab = tab;
    // 탭 필터
    filtered = rowsAll.filter(r => tab === 'earn' ? r.type === 'earn' : r.type === 'use');
    // 항상 1페이지부터 시작
    currentPage = 1;

    renderRows(sliceByPage(currentPage));
    renderPagination();

    // 잔액/만료는 전체 기준
    const { balance, expiring } = summarize(rowsAll);
    if ($total) $total.textContent = fmt(balance);
    if ($expiring) $expiring.textContent = fmt(expiring);
  }

  /* ================= 탭 ================= */
  function bindTabs(){
    if (!$tabsWrap) return;
    $tabsWrap.addEventListener('click', e=>{
      const btn = e.target.closest('.tab'); if (!btn) return;
      $tabsWrap.querySelectorAll('.tab').forEach(t=>{
        const on = t === btn;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      applyTab(btn.dataset.tab);
    });
  }

  /* ================= 사이드바 강조 ================= */
  function highlightSidebar(){
    const side = document.getElementById('site-side'); if(!side) return;
    const link = side.querySelector(`a[href*="${CONFIG.SIDEBAR_MATCH}"]`) || side.querySelector('a[href$="points.html"]');
    if (link){ link.classList.add('is-active'); link.setAttribute('aria-current','page'); }
  }

  /* ================= 초기화 ================= */
  async function init(){
    try{
      const res = await fetch(CONFIG.SRC, { cache:'no-store' });
      if (!res.ok) throw new Error('load failed');
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : (raw.items || []);
      rowsAll = list.map(normalizeRow);
    }catch(e){
      console.error('[points] 데이터 로드 실패:', e);
      rowsAll = [];
    }finally{
      bindTabs();
      bindPagination();
      applyTab(CONFIG.DEFAULT_TAB);   // 탭+페이징 초기 상태 -> 페이지 1 표시
      highlightSidebar();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
