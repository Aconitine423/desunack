/* product.js — 판매자 주문관리(테이블 버전, 인라인 스타일 제거)
   - JSON(product.json)만 읽어 렌더
   - 탭/검색/일괄 상태변경 지원
   - 공통 사이드바 DOM은 수정/치환하지 않음
*/

'use strict';

/* ===== 설정 ===== */
const DATA_URL = './product.json';                 // 백엔드 연결 시 API로 교체
const FORCE_SIDEBAR_LABEL = '주문 내역 관리';       // 사이드바 강조 라벨
const BLOCK_NAV_ON_FORCED = true;                  // 강조 항목 클릭 시 이동 차단

/* ===== 상태/유틸 ===== */
const STATUS_LABEL = {
  received : '주문 접수',
  preparing: '상품 준비중',
  shipping : '배송중',
  done     : '배송완료'
};
const STATUS_KEYS = ['received','preparing','shipping','done'];
const KRW = n => '₩' + Number(n || 0).toLocaleString();

/* 상태 텍스트를 키로 정규화 */
function normStatus(raw){
  if (typeof raw === 'number') return STATUS_KEYS[raw] || 'received';
  const s = String(raw || '').trim().toLowerCase();
  if (['received','접수','주문 접수'].includes(s)) return 'received';
  if (['preparing','준비','준비중'].includes(s))     return 'preparing';
  if (['shipping','배송','배송중'].includes(s))      return 'shipping';
  if (['done','완료','배송완료','픽업 완료'].includes(s)) return 'done';
  return 'received';
}

async function loadJSON(url){
  try{
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;        // 404여도 조용히 null
    return await r.json();
  }catch{
    return null;
  }
}

/* ===== 전역 상태 ===== */
let ORDERS = [];        // 원본
let VIEW   = [];        // 현재 탭/검색 반영 목록
let ACTIVE_TAB = 'all'; // 'all' | 'received' | 'preparing' | 'shipping' | 'done'

/* ===== 사이드바 강조(공통 파일 손대지 않음) ===== */
(function injectForceStyle(){
  const style = document.createElement('style');
  style.textContent =
`#site-side .mp-section-list a[data-force-active="1"],
 #site-side .mp-section-list a[data-force-active="1"]:hover{
   background:#fff;color:#ff6f61;font-weight:700
 }`;
  document.head.appendChild(style);
})();
function onSidebarReady(cb){
  const side = document.getElementById('site-side') || document.getElementById('mp-sidebar');
  if(!side) return;
  if (side.querySelector('.mp-section-list a')) { cb(side); return; }
  const mo = new MutationObserver(() => {
    if (side.querySelector('.mp-section-list a')) { mo.disconnect(); cb(side); }
  });
  mo.observe(side, { childList:true, subtree:true });
}
function forceSidebarActiveByLabel(label,{blockNav=true}={}){
  onSidebarReady(side=>{
    const link = Array.from(side.querySelectorAll('.mp-section-list a'))
      .find(el => el.textContent.trim().includes(label));
    if (link){
      link.setAttribute('data-force-active','1');
      const sub = link.closest('.sublist');
      if (sub){
        sub.setAttribute('aria-hidden','false');
        const li = sub.parentElement; li?.classList.add('active');
        li?.querySelector('.group-toggle')?.setAttribute('aria-expanded','true');
      }
      if (blockNav){
        link.addEventListener('click', e=>e.preventDefault());
      }
    }
  });
}

/* ===== 테이블 렌더러 =====
   - 인라인 style 금지. 클래스만 출력.
   - 빈 목록도 항상 헤더가 보이도록 렌더.
*/
function renderTable(root, list){
  const rowsHTML = (list || []).map(o=>{
    const st = normStatus(o.status);
    return `
      <tr data-id="${o.id}">
        <td class="chk"><input type="checkbox" class="rowChk"></td>
        <td class="date">${o.at || ''}</td>
        <td class="buyer">${o.customer || ''}</td>
        <td class="orderno">
          <button type="button" class="order-link" data-id="${o.id}">${o.id || ''}</button>
        </td>
        <td class="info">${o.product || ''}</td>
        <td class="qty">${o.qty ?? 1}</td>
        <td class="amount">${KRW(o.amount)}</td>
        <td class="status"><span class="badge ${st}">${STATUS_LABEL[st]}</span></td>
      </tr>`;
  }).join('');

  root.innerHTML = `
    <div class="actions">
      <label for="bulkStatus" class="sr-only">상태</label>
      <select id="bulkStatus">
        ${STATUS_KEYS.map(k=>`<option value="${k}">${STATUS_LABEL[k]}</option>`).join('')}
      </select>
      <button id="btnBulkApply" type="button">선택 변경</button>
    </div>
    <table class="order-table" role="table" aria-label="주문 목록">
      <colgroup>
        <col class="chk"><col class="date"><col class="buyer"><col class="orderno">
        <col class="info"><col class="qty"><col class="amount"><col class="status">
      </colgroup>
      <thead>
        <tr>
          <th><input type="checkbox" id="chkAll"></th>
          <th>주문일시</th><th>구매자</th><th>주문번호</th>
          <th>상품정보</th><th>수량</th><th>결제금액</th><th>주문상태</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML || `<tr><td class="empty" colspan="8">해당 항목이 없습니다.</td></tr>`}
      </tbody>
    </table>
  `;

  // 전체선택
  const table = root.querySelector('table');
  const chkAll = root.querySelector('#chkAll');
  chkAll?.addEventListener('change', e=>{
    table.querySelectorAll('.rowChk').forEach(cb => { cb.checked = e.target.checked; });
  });

  // 일괄 상태 변경
  root.querySelector('#btnBulkApply')?.addEventListener('click', ()=>{
    const next = root.querySelector('#bulkStatus').value;
    const ids = [...table.querySelectorAll('.rowChk:checked')]
      .map(c => c.closest('tr').dataset.id);
    if(!ids.length) return;
    ORDERS.forEach(o => { if(ids.includes(String(o.id))) o.status = next; });
    applyFilter(document.getElementById('q')?.value || '');
  });
}

/* ===== 카운트/필터 ===== */
function updateTabCounts(){
  const c = {
    all: ORDERS.length,
    received: ORDERS.filter(x=>x.status==='received').length,
    preparing: ORDERS.filter(x=>x.status==='preparing').length,
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
  const k = String(keyword || '').trim().toLowerCase();
  const base = (ACTIVE_TAB === 'all') ? ORDERS : ORDERS.filter(o => o.status === ACTIVE_TAB);
  VIEW = !k ? base.slice()
            : base.filter(o => (`${o.id} ${o.customer} ${o.product}`).toLowerCase().includes(k));

  const container = document.getElementById('order-list');
  if(!container) return;
  renderTable(container, VIEW);
  updateTabCounts();
}

/* ===== 탭/검색 바인딩 ===== */
function bindTabsAndSearch(){
  const root = document.getElementById('statusTabs');
  if(!root) return;

  root.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-filter]');
    if(!btn || !root.contains(btn)) return;
    ACTIVE_TAB = btn.dataset.filter || 'all';
    root.querySelectorAll('[data-filter]').forEach(b=>{
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    applyFilter(document.getElementById('q')?.value || '');
  });

  document.getElementById('q')?.addEventListener('input', e=>{
    applyFilter(e.target.value);
  });

  // 첫 탭 활성
  root.querySelector('[data-filter]')?.click();
}

/* ===== 모달 ===== */
function detailHTML(o){
  const stepIdx = ({received:0, preparing:1, shipping:2, done:3}[o.status] ?? 0);
  const steps = ['주문확인','준비중','배송중','배송 완료']
    .map((t,i)=>`
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
function openOrderModal(order){
  const m = document.getElementById('orderDetailModal');
  if(!m) return;
  if(m.parentElement !== document.body) document.body.appendChild(m);
  document.getElementById('odmBody').innerHTML = detailHTML(order);
  m.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeOrderModal(){
  const m = document.getElementById('orderDetailModal');
  if(!m) return;
  m.hidden = true;
  document.body.style.overflow = '';
}
// 닫기: 버튼/딤, ESC
document.addEventListener('click', (e)=>{
  if (e.target.closest('.odm-close') || e.target.classList?.contains('odm-dim')) closeOrderModal();
});
document.addEventListener('keydown', (e)=>{
  const m = document.getElementById('orderDetailModal');
  if (!m?.hidden && e.key === 'Escape') closeOrderModal();
});

/* ===== 부트스트랩 ===== */
document.addEventListener('DOMContentLoaded', async ()=>{
  forceSidebarActiveByLabel(FORCE_SIDEBAR_LABEL, { blockNav: BLOCK_NAV_ON_FORCED });
  bindTabsAndSearch();

  // 데이터 로드 및 정규화
  const data = await loadJSON(DATA_URL);
  ORDERS = Array.isArray(data) ? data.map(d=>({
    id: d.orderId ?? d.id ?? '',
    product: d.product ?? d.title ?? '',
    customer: d.customer ?? d.buyer ?? '',
    at: d.orderedAt ?? d.createdAt ?? '',
    amount: d.amount ?? d.price ?? 0,
    qty: d.qty ?? d.quantity ?? 1,
    status: normStatus(d.deliveryStatus ?? d.status),
    thumb: d.thumbnail ?? ''
  })) : [];

  // 주문번호 클릭 → 모달
  document.getElementById('order-list')?.addEventListener('click', (e)=>{
    const a = e.target.closest('.order-link');
    if(!a) return;
    const item = ORDERS.find(x => String(x.id) === String(a.dataset.id));
    if(item) openOrderModal(item);
  });

  // 초기 렌더
  applyFilter('');
});

// 검색 버튼 클릭/엔터로 필터 적용
document.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('q');
  const btn   = document.getElementById('btnSearch');
  btn?.addEventListener('click', ()=> applyFilter(input?.value || ''));
  input?.addEventListener('keydown', e=>{
    if(e.key === 'Enter') applyFilter(input.value);
  });
});
