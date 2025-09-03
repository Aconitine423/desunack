/* product.js — 판매자 주문관리(테이블 버전)
- JSON(product.json)만 읽어 렌더
- 탭/검색/일괄 상태변경 지원
- 공통 사이드바는 절대 수정/치환하지 않음
- '주문 내역 관리' 라벨을 사이드바에서 영구 강조
*/

'use strict';

/* ========= 설정 ========= */
const DATA_URL = './product.json';               // 백엔드 붙이면 API로 대체
const FORCE_SIDEBAR_LABEL = '주문 내역 관리';     // 사이드바 강조 라벨
const BLOCK_NAV_ON_FORCED = true;                // 강조 항목 클릭시 이동 막기

/* ========= 유틸 ========= */
const STATUS_LABEL = {
  received : '주문 접수',
  preparing: '상품 준비중',
  shipping : '배송중',
  done     : '배송완료'
};
const STATUS_KEYS = ['received','preparing','shipping','done'];
const KRW = n => '₩' + Number(n||0).toLocaleString();

function normStatus(raw){
  if (typeof raw === 'number') return STATUS_KEYS[raw] || 'received';
  const s = String(raw||'').trim().toLowerCase();
  if (['received','접수','주문 접수'].includes(s)) return 'received';
  if (['preparing','준비','준비중'].includes(s))     return 'preparing';
  if (['shipping','배송','배송중'].includes(s))      return 'shipping';
  if (['done','완료','배송완료','픽업 완료'].includes(s)) return 'done';
  return 'received';
}

async function loadJSON(url){
  try{
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) return null;            // 404여도 조용히 null
    return await r.json();
  }catch{ return null; }
}

/* 선택 주문 상세 렌더링 */
function renderDetail(order){
  if(!order) return;
  const box = document.getElementById('order-detail');
  if(!box) return;
  
  // 딘계 인덱스 계산
  const STEP = {received:0, preparing:1, shipping:2, done:3}[order.status] ??0;
  
  box.innerHTML =`
  <div class="detail-card detail-enter">
  <h2 style="margin:0 0 12px;font-size:16px;font-weight:700">주문 상세 내역</h2>
     <div class="steps">
      ${['주문확인','준비중','배송중','배송 완료'].map((t,i)=>`
      <div class="step ${i<=STEP?'active':''}">
      <laberl>${t}</laberl>
      </div>
      `).join('')}  
  </div>

  <section style="display:grid;grid-template-columns:110px 1fr;gap:8px 12px">
        <div class="meta">주문일시</div><div>${order.at||'-'}</div>
        <div class="meta">구매자</div><div>${order.customer||'-'}</div>
        <div class="meta">주문번호</div><div>${order.id||'-'}</div>
        <div class="meta">상품정보</div><div>${order.product||'-'} × ${order.qty??1}</div>
        <div class="meta">결제금액</div><div>${KRW(order.amount)}</div>
        <div class="meta">주문상태</div><div>${STATUS_LABEL[order.status]||'-'}</div>
      </section>
  </div>`;
        box.hidden = false;
}

/* ========= 데이터 상태 ========= */
let ORDERS = [];   // 원본
let VIEW   = [];   // 검색/필터 적용 목록
let ACTIVE_TAB = 'all';

/* ========= 사이드바 영구 강조 ========= */
(function injectForceStyle(){
  const style = document.createElement('style');
  style.textContent =
`#site-side .mp-section-list a[data-force-active="1"],
 #site-side .mp-section-list a[data-force-active="1"]:hover{background:#fff;color:#ff6f61;font-weight:700}`;
  document.head.appendChild(style);
})();
function forceSidebarActiveByLabel(label,{blockNav=true}={}){
  const side = document.getElementById('site-side') || document.getElementById('mp-sidebar');
  if(!side) return;
  // 자식 링크 우선 검색
  let a = [...side.querySelectorAll('.mp-section-list a')]
  .find(el => el.textContent.trim().includes(label));
  if(a){
    a.setAttribute('data-force-active','1');
    const sub = a.closest('.sublist');
    if(sub){
      sub.setAttribute('aria-hidden','false');
      const li = sub.parentElement; li?.classList.add('active');
      li?.querySelector('.group-toggle')?.setAttribute('aria-expanded','true');
    }
    if(blockNav) a.addEventListener('click', e=>e.preventDefault());
    return;
  }
  // 부모 버튼 매칭(필요시)
  const btn = [...side.querySelectorAll('button.group-toggle')]
  .find(el => el.textContent.trim().includes(label));
  if(btn){
    btn.setAttribute('aria-expanded','true');
    const li = btn.closest('li'); const sub = li?.querySelector(':scope > .sublist');
    if(sub){ sub.setAttribute('aria-hidden','false'); li.classList.add('active'); }
  }
}

/* ========= 렌더: 테이블 ========= */
// 상태 배지 DOM
function badge(status){
  const span = document.createElement('span');
  span.className = 'badge ' + status; // 색상은 CSS에서
  span.textContent = STATUS_LABEL[status] || status;
  return span;
}

// 테이블 생성
function renderTable(container, rows){
  container.innerHTML = '';
  
  // 상단: 일괄 상태 변경 바
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:10px;align-items:center;margin:8px 0;';
  const sel = document.createElement('select');
  sel.id = 'bulkStatus';
  STATUS_KEYS.forEach(k=>{
    const o=document.createElement('option');
    o.value=k; o.textContent=STATUS_LABEL[k]; sel.appendChild(o);
  });
  const btn = document.createElement('button');
  btn.id='btnBulkApply';
  btn.textContent='선택 변경';
  btn.style.cssText='padding:6px 10px;border-radius:8px;border:1px solid #ddd;background:#ffedea;color:#ff6f61;font-weight:600;cursor:pointer';
  bar.appendChild((()=>{const t=document.createElement('span');t.textContent='상태 ';return t;})());
  bar.appendChild(sel); bar.appendChild(btn);
  container.appendChild(bar);
  
  // 테이블
  const table = document.createElement('table');
  table.style.cssText='width:100%;border-collapse:separate;border-spacing:0 10px;';
  const thead = document.createElement('thead');
  thead.innerHTML =
  `<tr style="color:#6b6b6b;font-size:13px">
       <th style="width:36px;text-align:center;"><input type="checkbox" id="chkAll"></th>
       <th style="width:110px;text-align:left;">주문일시</th>
       <th style="width:120px;text-align:left;">구매자</th>
       <th style="width:120px;text-align:left;">주문번호</th>
       <th style="text-align:left;">상품정보</th>
       <th style="width:70px;text-align:right;">수량</th>
       <th style="width:110px;text-align:right;">결제금액</th>
       <th style="width:110px;text-align:center;">주문상태</th>
     </tr>`;
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  
  rows.forEach(o=>{
    const tr = document.createElement('tr');
    tr.style.cssText='background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.04);';
    tr.dataset.id = o.id;
    
    // 1. 체크박스
    const td0 = document.createElement('td'); td0.style.textAlign='center';
    const cb = document.createElement('input'); cb.type='checkbox'; cb.className='rowChk';
    td0.appendChild(cb);
    
    // 2. 주문일시
    const td1 = document.createElement('td'); td1.textContent = o.at || '-';
    
    // 3. 구매자
    const td2 = document.createElement('td'); td2.textContent = o.customer || '-';
    
    // 4. 주문번호
    const td3 = document.createElement('td');
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'order-link';
    link.dataset.id = o.id;
    link.textContent = o.id || '-';
    td3.appendChild(link);
    
    // 5. 상품정보
    const td4 = document.createElement('td'); td4.textContent = o.product || '-';
    
    // 6. 수량(없으면 1)
    const td5 = document.createElement('td'); td5.style.textAlign='right';
    td5.textContent = String(o.qty ?? o.quantity ?? 1);
    
    // 7. 결제금액
    const td6 = document.createElement('td'); td6.style.textAlign='right';
    td6.textContent = KRW(o.amount);
    
    // 8. 상태 배지
    const td7 = document.createElement('td'); td7.style.textAlign='center';
    td7.appendChild(badge(o.status));
    
    [td0,td1,td2,td3,td4,td5,td6,td7].forEach(td=>{
      td.style.padding='12px 14px'; td.style.background='#fff';
      td.style.borderTopLeftRadius='10px'; td.style.borderBottomLeftRadius='10px';
    });
    // 라운드 처리(양 끝만 둥글게 보이도록)
    td0.style.borderTopLeftRadius='12px'; td0.style.borderBottomLeftRadius='12px';
    td7.style.borderTopRightRadius='12px'; td7.style.borderBottomRightRadius='12px';
    
    tr.append(td0,td1,td2,td3,td4,td5,td6,td7);
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
  
  // 선택 전체
  const chkAll = table.querySelector('#chkAll');
  chkAll?.addEventListener('change', e=>{
    table.querySelectorAll('.rowChk').forEach(c => { c.checked = e.target.checked; });
  });
  
  // 일괄 변경
  btn.addEventListener('click', ()=>{
    const next = sel.value;
    const ids = [...table.querySelectorAll('.rowChk:checked')]
    .map(c => c.closest('tr').dataset.id);
    if(ids.length === 0) return;
    
    // 메모리 상태 업데이트
    ORDERS.forEach(o => { if(ids.includes(String(o.id))) o.status = next; });
    
    // 현재 탭/검색 유지하여 다시 그리기
    applyFilter(document.getElementById('q')?.value || '');
  });
}

/* ========= 패널/탭/검색 ========= */
function counts(){
  return {
    all: ORDERS.length,
    received: ORDERS.filter(x=>x.status==='received').length,
    preparing: ORDERS.filter(x=>x.status==='preparing').length,
    shipping: ORDERS.filter(x=>x.status==='shipping').length,
    done: ORDERS.filter(x=>x.status==='done').length
  };
}
function updateTabCounts(){
  const c={
    all: ORDERS.length,
    received: ORDERS.filter(x=>x.status==='received').length,
    preparing: ORDERS.filter(x=>x.status=== 'preparing').length,
    shipping: ORDERS.filter(x=>x.status==='shipping').length,
    done: ORDERS.filter(x=>x.status==='done').length
  };
  const root = document.getElementById('statusTabs');
  if(!root) return;
  root.querySelectorAll('[data-filter]').forEach(b=>{
    const key = b.dataset.filter;
    b.querySelector('.count')?.replaceChildren(document.createTextNode(c[key] ?? 0));
  });
}
function applyFilter(keyword=''){
  const k = String(keyword||'').trim().toLowerCase();
  const base = (ACTIVE_TAB==='all') ? ORDERS
  : ORDERS.filter(o => o.status === ACTIVE_TAB);
  VIEW = !k ? base.slice()
  : base.filter(o => (`${o.id} ${o.customer} ${o.product}`).toLowerCase().includes(k));
  
  // 현재 활성 패널의 컨테이너에 테이블 그리기
  const container = document.getElementById('order-list');
  if (!container) return;
  
  if(VIEW.length === 0 ){
    container.innerHTML = '<p class="meta">해당 항목이 없습니다.</p>';
  }else{
    renderTable(container, VIEW); //표만 갈아끼움
  }
  
  updateTabCounts();
}

function bindTabsAndSearch(){
  const root = document.getElementById('statusTabs');
  if(!root) return;
  
  //  탭 클릭: 컨테이너에서 이벤트 위임
  root.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-filter]');
    if(!btn || !root.contains(btn)) return;
    
    ACTIVE_TAB = btn.dataset.filter || 'all';
    
    // 시각 상태 토글
    root.querySelectorAll('[data-filter]').forEach(b=>{
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    
    // 검색어 유지한 채 목록만 갈아끼우기
    applyFilter(document.getElementById('q')?.value || '');
  });
  
  // 검색 입력
  document.getElementById('q')?.addEventListener('input', e=>{
    applyFilter(e.target.value);
  });
  
  // 첫 탭 강제 활성
  root.querySelector('[data-filter]')?.click();
}
/* ========= 부트스트랩 ========= */
document.addEventListener('DOMContentLoaded', async ()=>{
  // 사이드바 강조(공통 수정 없음)
  forceSidebarActiveByLabel(FORCE_SIDEBAR_LABEL, {blockNav: BLOCK_NAV_ON_FORCED});
  
  // 탭/검색 바인딩
  bindTabsAndSearch();
  
  
  // 데이터 로드
  const data = await loadJSON(DATA_URL);
  if(Array.isArray(data)){
    ORDERS = data.map(d=>({
      id: d.orderId ?? d.id ?? '',
      product: d.product ?? d.title ?? '',
      customer: d.customer ?? d.buyer ?? '',
      at: d.orderedAt ?? d.createdAt ?? '',
      amount: d.amount ?? d.price ?? 0,
      qty: d.qty ?? d.quantity ?? 1,
      status: normStatus(d.deliveryStatus ?? d.status),
      thumb: d.thumbnail ?? ''
    }));
  }else{
    ORDERS = [];
  }

  // 주문번호 클릭하면 모달
document.getElementById('order-list').addEventListener('click', (e)=>{
  const a = e.target.closest('.order-link');
  if(!a) return;
  const item = ORDERS.find(x => String(x.id) === String(a.dataset.id));
  if(item) openOrderModal(item);
});
  // 초기 렌더
  applyFilter('');
});
/** 사이드바 DOM이 주입되면 콜백 실행 */
function onSidebarReady(cb){
  const side = document.getElementById('site-side') || document.getElementById('mp-sidebar');
  if(!side) return;
  if (side.querySelector('.mp-section-list a')) { cb(side); return; }
  const mo = new MutationObserver(() => {
    if (side.querySelector('.mp-section-list a')) { mo.disconnect(); cb(side); }
  });
  mo.observe(side, { childList:true, subtree:true });
}

/** 라벨로 찾은 항목 클릭을 항상 차단(페이지 이동 방지) */
function lockSidebarLinkByLabel(label){
  onSidebarReady(side=>{
    side.addEventListener('click', (e)=>{
      const a = e.target.closest('a');
      if(!a) return;
      if(a.textContent.trim().includes(label)){
        e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        e.stopPropagation();
      }
    }, true); // 캡처 단계에서 차단
  });
}

/** 라벨로 영구 강조 + 부모 펼치기 (이 함수는 기존에 쓰던 그대로) */
function forceSidebarActiveByLabel(label,{blockNav=false}={}){
  const side = document.getElementById('site-side') || document.getElementById('mp-sidebar');
  if(!side) return;
  let a = Array.from(side.querySelectorAll('.mp-section-list a'))
  .find(el=>el.textContent.trim().includes(label));
  if(a){
    a.setAttribute('data-force-active','1');
    const sub = a.closest('.sublist');
    if(sub){
      sub.setAttribute('aria-hidden','false');
      const li = sub.parentElement; li?.classList.add('active');
      li?.querySelector('.group-toggle')?.setAttribute('aria-expanded','true');
    }
    return;
  }
  const btn = Array.from(side.querySelectorAll('button.group-toggle'))
  .find(el=>el.textContent.trim().includes(label));
  if(btn){
    btn.setAttribute('aria-expanded','true');
    const li = btn.closest('li');
    const sub = li?.querySelector(':scope > .sublist');
    if(sub){ sub.setAttribute('aria-hidden','false'); li.classList.add('active'); }
  }
}
onSidebarReady(()=> {
  forceSidebarActiveByLabel('주문 내역 관리'); // 강조 유지
});
lockSidebarLinkByLabel('주문 내역 관리');     // 이동 차단

/* 상세 HTML 생성 함수 */
function detailHTML(o){
  const stepIdx = ({received:0, preparing:1, shipping:2, done:3}[o.status] ?? 0);
  const steps = ['주문확인','준비중','배송중','배송 완료']
  .map((t,i)=> `
  <div class="odm-step ${i<=stepIdx?'active':''}">
    <div class="odm-dot">${i+1}</div><label>${t}</label>
    </div>`).join('');
    return `
    <div class="odm-steps">${steps}</div>
     <section style="display:grid;grid-template-columns:110px 1fr;gap:8px 12px">
      <div class="meta">주문일시</div><div>${o.at||'-'}</div>
      <div class="meta">구매자</div><div>${o.customer||'-'}</div>
      <div class="meta">주문번호</div><div>${o.id||'-'}</div>
      <div class="meta">상품정보</div><div>${o.product||'-'} × ${o.qty??1}</div>
      <div class="meta">결제금액</div><div>${KRW(o.amount)}</div>
      <div class="meta">주문상태</div><div>${STATUS_LABEL[o.status]||'-'}</div>
    </section>`;
}

/* 모달 열기/닫기 */

function openOrderModal(order){
  const m = document.getElementById('orderDetailModal');
  if(!m) return;
  if(m.parentElement !== document.body) document.body.appendChild(m); // 최상위로
  document.getElementById('odmBody').innerHTML = detailHTML(order);
  m.hidden = false;
  document.body.style.overflow = 'hidden'; // 스크롤 잠금
}
function closeOrderModal(){
  const m = document.getElementById('orderDetailModal');
  if(!m) return;
  m.hidden = true;
  document.body.style.overflow = '';
}

// 닫기 바인딩(한 번만)
document.addEventListener('DOMContentLoaded', ()=>{
  const m = document.getElementById('orderDetailModeal');
  m?.addEventListener('click', e=>{ if(e.target.classList.contains('odm-dim')) closeOrderModal(); });
  m?.querySelector('.odm-close')?.addEventListener('clock', closeOrderModal);
  document.addEventListener('keydown', e=>{if(!m?.hidden && e.key==='Escape') closeOrderModal(); });
});

// 문서 위임: 닫기 버튼(.odm-close) 또는 딤(.odm-dim) 클릭 시 닫기
document.addEventListener('click', (e) => {
  if (e.target.closest('.odm-close') || e.target.classList?.contains('odm-dim')) {
    closeOrderModal();
  }
});