/* ============================================================
mypage.js — 프론트엔드 전용 로직
(1) 좌측 메뉴 템플릿을 data-role에 따라 주입
(2) 상단 탭 전환 및 최초 진입 시 데이터 로딩
(3) API 호출: JSON/HTML 자동 판별(fetchAuto)
(4) 주문/찜 렌더링 (스켈레톤/빈 상태 토글)
(5) 프로필 수정/비번 확인 모달 오픈/닫기/제출
* 백엔드가 인증/권한 데이터를 책임, 프론트는 렌더만 담당 
============================================================ */

/* ---------- [공통 유틸] ---------- */
// 통화(KRW) 포맷
const krw = (n) => (Number(n) || 0).toLocaleString('ko-KR') + '원';

// 텍스트 이스케이프(XSS 방지)
const esc = (s) => 
  String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

// fetch 응답을 content-type 보고 JSON/HTML로 자동 판별
async function fetchAuto(url, options = {}) {
  const res = await fetch(url, { credentials: 'include', ...options});
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json'))return {type: 'json', data: await res.json() };
  return { type: 'html', data: await res.text() };
}

// 간단 토스트
function toast(msg){
  const wrap = document.getElementById('toast');
  if (!wrap) return;
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 2200);
}

// DOM 캐시
const $wrap = document.querySelector('.mypage');
const USER_UID = $wrap?.dataset.userUid; // 예: "U123456"
const ROLE = $wrap?.dataset.role || 'consumer';

/* 좌측 메뉴 템플릿 주입: -data-role에 따라 템플릿(#tpl-menu-)을 #mypage-menu에 복사 */
(function injectSideMenu(){
  const target = document.getElementById('mypage-menu');
  const tplId = ROLE === 'seller' ? '#tpl-menu-seller' : '#tpl-menu-consumer';
  const tpl = document.querySelector(tplId);
  if (tpl && target) target.appendChild(tpl.content.cloneNode(true));
})();

/* 탭 전환 & 최초 로딩 */
(function setupTabs(){
  const tabs = document.querySelectorAll('.mypage-tab');
  const panes = document.querySelectorAll('.mypage-card[data-pane]');
  const onceLoaded = {orders:false, wish:false}; // 최초 1 회만 자동 로딩
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      // 탭 UI 상태 갱신t
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      
      panes.forEach(p => p.classList.toggle('is-hidden', p.dataset.pane !== target));
      
      //탭 최초 진입 시 데이터 로딩
      if (target === 'orders' && !onceLoaded.orders) {
        loadOrders(); onceLoaded.orders = true; 
      }
      if (target === 'wish' && !onceLoaded.wish) {
        loadWish();   onceLoaded.wish   = true;
      }
    });
  });
})();

/* 잡리스트 기반 엔드포인트 빌더 */
//  주의: 정확한 파라미터 스펙은 서버에 따라 다를 수 있음 일단 관례(page/size/q/period)로 구성 -> 서버 확정되면 조정

const API = {
  orderList:    (uid, qs='')     => `/mypage/${uid}/order-list${qs ? ('?' + qs) : ''}`, // GET
  orderDetail:  (uid, orderId)   => `/mypage/${uid}/order/${orderId}`,                  // POST(조회)
  favoriteList: (uid, qs='')     => `/mypage/${uid}/favorite${qs ? ('?' + qs) : ''}`,   // GET
  favoriteDelete:(uid, goodsId)  => `/mypage/${uid}/favorite-delete/${goodsId}`,        // POST
  update:       (uid)            => `/mypage/${uid}/update`,                            // POST (프로필 수정)
  passCheck:    (uid)            => `/mypage/${uid}/pass-check`                         // POST? (미정)
};

/* [주문 내역] 로딩 / 렌더 */
// - 응답이 json이면 파싱해서 카드 렌더, html이면 그대로 삽입
// - 실패/빈값 -> 빈 상태 표시

async function loadOrders(){
  if (!USER_UID) { console.warn('userUID 없음'); return; }
  
  const root = document.getElementById('orders-root');
  const empty = document.getElementById('orders-empty');
  if(!root || !empty) return;
  
  // 스켈레톤 표시
  root.innerHTML = '<div class="skeleton" data-skel="orders"></div>';
  empty.classList.add('is-hidden');
  
  // 기간/검색 파라미터 (관례)
  const qInput = document.getElementById('q');
  const q      = qInput ? qInput.value.trim() : '';
  const periodSel = document.getElementById('sel-period');
  const period = periodSel ? periodSel.value : ''; //3m/6m/12m 
  
  const qs = new URLSearchParams();
  qs.set('page', '1');
  qs.set('size', '10');
  if (q) qs.set('q', q);
  if (period) qs.set('period', period);
  
  try {
    const {type, data } = await fetchAuto(API.orderList(USER_UID, qs.toString()));
    root.innerHTML = ''; // 스켈레톤 제거
    
    if (type === 'html') {
      root.innerHTML = data;
      const hasContent = root.textContent.trim() !== '';
      empty.classList.toggle('is-hidden', hasContent);
      return;
    }
    
    const items = data?.items || [];
    if (!items.length){
      empty.classList.remove('is-hidden');
      return;
    }
    items.forEach(o => root.appendChild(renderOrderCard(o)));
  } catch (e) {
    console.error('ORDER_LIST_FAIL', e);
    root.innerHTML = '';
    empty.classList.remove('is-hidden');
  }
}

// 주문 카드 DOM 생성
function renderOrderCard(o) {
  /* 예상 스키마(추측):
  {
  orderId:'O20250827001', orderedAt:'2025-08-26T12:30:00',
  status:'PAID', items:[{name:'상품',opt:'옵션',qty:2,price:12000}],
  total:27000
  }
  */
  const el = document.createElement('article');
  el.className = 'order-card';
  
  const time = o.orderedAt ? new Date(o.orderedAt) : null;
  const dateStr = time ? time.toLocaleDateString('ko-KR') : '-';
  const statusMap = {PAID:'결제완료', READY:'상품준비중', SHIPPED:'배송중',DONE:'구매확정', CANCEL:'취소' };
  const statusText = statusMap[o.status] || o.status || '-';
  
  el.innerHTML = `
    <div class="order-head">
    <div>${esc(dateStr)} · 주문번호 <strong>${esc(o.orderId)}</strong></div>
      <div class="tag">${esc(statusText)}</div>
    </div>
    <div class="order-items">
      ${(o.items||[]).slice(0,3).map(it=>{
  const name = esc(it.name || '상품명');
  const opt  = it.opt ? ` / ${esc(it.opt)}` : '';
  return `<span>${name}${opt} × ${it.qty||1}</span>`;
}).join('')}
      ${ (o.items||[]).length>3 ? `<span>외 ${ (o.items||[]).length - 3 }건</span>` : '' }
    </div>
    <div class="order-head">
      <div>결제금액</div>
      <div><strong>${krw(o.total)}</strong></div>
    </div>
  `;

// 카드 클릭 -> 상세(서버 표기상 POST로 조회)
el.addEventListener('click',async() => {
  try {
    const { type, data } = await fetchAuto(API.orderDetail(USER_UID, o.orderId),{
      method:'POST', 
      headers:{ 'X-Requested-With':'fetch'}
    });
    if (type === 'html'){
      // TODO: 상세 모달로 주입
      toast('주문 상세(HTML) 응답 수신. 모달에 주입하세요.');
      console.log('[ORDER_DETAIL_HTML]',data);
    } else {
      toast('주문 상세(JSON) 응답 수신. 콘솔 확인.');
      console.log('[ORDER_DETAIL_JSON]',data);
    }
  } catch (e){
    console.error('ORDER_DETAIL_FAIL', e);
    toast('상세 조회에 실패했습니다.');
  }
});

return el;
}

/* [찜 목록] 로딩/렌더 */

async function loadWish(){
  if (!USER_UID) { console.warn('userUID 없음'); return; }
  
  const root = document.getElementById('wish-root');
  const empty = document.getElementById('wish-empty');
  if (!root || !empty) return;

  root.innerHTML = '<div class="skeleton" data-skel="wish"></div>';
  empty.classList.add('is-hidden');
  
  try{
    const qs = new URLSearchParams({ page:1, size:12 });
    const { type, data } = await fetchAuto(API.favoriteList(USER_UID, qs.toString()));
    root.innerHTML = '';
    
    if (type === 'html') {
      root.innerHTML = data;
      const hasContent = root.textContent.trim() !== '';
      empty.classList.toggle('is-hidden', hasContent);
      return;
    }
    
    const items = data?.items || [];
    if (!items.length){
      empty.classList.remove('is-hidden');
      return;
    }
    items.forEach(g => root.appendChild(renderWishCard(g)));
  } catch (e) {
    console.error('FAVORITE_LIST_FAIL', e);
    root.innerHTML = '';
    empty.classList.remove('is-hidden');
  }
}

// 찜 카드 DOM
function renderWishCard(g) {
  // 예상 스키마(추측): { goodsId:'G001', name:'상품명', price:12000, thumb:'/img.jpg' }
  const el = document.createElement('article');
  el.className = 'wish-card';
  el.innerHTML = `
    <div class="thumb" style="background-image:url('${esc(g.thumb||'')}'); background-size:cover; background-position:center;"></div>
    <div class="name">${esc(g.name||'상품명')}</div>
    <div class="price"><strong>${krw(g.price)}</strong></div>
    <div style="margin-top:6px; display:flex; gap:6px;">
      <button class="btn" data-act="cart"><i class="fa-solid fa-cart-plus"></i> 장바구니</button>
      <button class="btn" data-act="del"><i class="fa-regular fa-trash-can"></i> 삭제</button>
    </div>
  `;
  
  //삭제
  el.querySelector('[data-act="del"]').addEventListener('click',async (ev) => {
    ev.stopPropagation();
    try{
      await fetchAuto(API.favoriteDelete(USER_UID, g.goodsId),{
        method:'POST', headers:{ 'X-Requested-With':'fetch'}
      });
      el.remove();
      toast('찜에서 삭제했습니다.');
    } catch (e) {
      console.error('FAVORITE_DELETE_FAIL', e);
      toast('삭제에 실패했습니다.');
    }
  });
  
  return el;
}

/* 검색 / 기간 이벤트 */
document.getElementById('btn-search')?.addEventListener('click',() => loadOrders());
document.getElementById('q')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {e.preventDefault(); loadOrders(); }
});
document.getElementById('sel-period')?.addEventListener('change',()=> loadOrders());

/* 모달 /오픈/닫기/제출 */ 
function openModal(id){ const m = document.getElementById(id); if(m){ m.classList.add('show'); m.setAttribute('aria-hidden','false'); } }
function closeModal(id){ const m = document.getElementById(id); if(m){ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); } }

// 공통: dim/닫기 버튼 클릭, esc
document.addEventListener('click', (e)=> {
  const t = e.target;
  if (t.matches('[data-close]')) {
    const modal = t.closest('.modal'); if (modal) closeModal(modal.id);
  }
});
document.addEventListener('keydown', (e)=> {
  if (e.key === 'Escape') document.querySelectorAll('.modal.show').forEach(m => closeModal(m.id));
});

// 프로필 수정 열기
document.getElementById('btn-edit')?.addEventListener('click', ()=>{
  // 폼 초기값을 현재 표시값으로 채움
  document.getElementById('name').value = document.getElementById('pf-name').textContent.trim();
  const [p1,p2,p3] = (document.getElementById('pf-phone').textContent.trim().split('-').concat(['','',''])).slice(0,3);
  document.getElementById('phone1').value = p1; document.getElementById('phone2').value = p2; document.getElementById('phone3').value = p3;
  const email = document.getElementById('pf-email').textContent.trim();
  const at = email.indexOf('@');
  document.getElementById('emailLocal').value = at> 0 ? email.slice(0,at) : '';
  document.getElementById('emailDomain').value = at> 0 ? email.slice(at+1) : '';
  openModal('modal-profile');
});

// 프로필 저장
document.getElementById('form-profile')?.addEventListener('submit',async (e) => {
  e.preventDefault();
  if (!USER_UID) return;
  
  // 간단 검증
  const name = document.getElementById('name').value.trim();
  const phone = [ 'phone1','phone2','phone3' ].map(id => document.getElementById(id).value.trim());
  const email = `${document.getElementById('emailLocal').value.trim()}@${document.getElementById('emailDomain').value.trim()}`.replace('@','@');
  if (!name || phone.some(x=>!x)) { toast('이름/연락처를 입력하세요.'); return; }
  
  // 서버 형식 미확정 -> JSON POST 가정
  const payload = {
    name,
    phone: phone.join ('-'),
    email,
    address: {
      postcode: document.getElementById('postcode').value.trim(),
      addr1: document.getElementById('addr1').value.trim(),
      addr2: document.getElementById('addr2').value.trim(),
      isDefault: document.getElementById('isDefaultAddr').checked
    }
  };
  
  try{
    const { type, data } = await fetchAuto(API.update(USER_UID), {
      method: 'POST',
      headers: {'Content-Type':'application/json', 'X-Requested-With':'fetch'},
      body: JSON.stringify(payload)
    });
    
    // 성공 시 화면 값 갱신 (응답 스키마 확정 전: 요청값으로 반영)
    document.getElementById('pf-name').textContent = name;
    document.getElementById('pf-phone').textContent = payload.phone;
    document.getElementById('pf-email').textContent = email;
    
    closeModal('modal-profile');
    toast('프로필을 저장했습니다.');
    console.log('[PROFILE_SAVE]', type, data);
  } catch (e){
    console.error('PROFILE_SAVE_FAIL', e);
    toast('저장에 실패했습니다.');
  }
});

// 비밀번호 확인 (엔드포인트 미정 -> 안내만 )
document.getElementById('btn-passcheck')?.addEventListener('click', ()=> openModal('modal-pass'));
document.getElementById('form-pass')?.addEventListener('submit', async (e)=> {
  e.preventDefault();
  if (!USER_UID) return;
  const password = document.getElementById('password').value;
  if (!password) { toast('비밀번호를 입력하세요.'); return;}
  
    // TODO: 서버 엔드포인트 확정 시 fetch 연결
  toast('비밀번호 확인 API 엔드포인트가 확정되면 연결하세요. ');
  closeModal('modal-pass');
});