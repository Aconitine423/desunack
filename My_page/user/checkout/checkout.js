/* ==========================================================
 * 주문/결제 checkout.js 
 * 기능: 아이템 로드, 주소 모달 토글, 쿠폰 자동 로드, 포인트 토글,
 *       선불/착불·일반/빠른 배송비 자동 계산, 합계 계산, 결제 제출
 * 고정 파라미터: userUID, orderID, orderDetail(JSON 문자열)
 * ========================================================== */

/* ===== 환경 ===== */
const DEV_MODE = true; // 실서버 연동 시 false로 변경

/* ===== 유틸 ===== */
const qs  = o => new URLSearchParams(o).toString();
const $   = s => document.querySelector(s);
const $$  = s => Array.from(document.querySelectorAll(s));
const won = n => `₩${Number(n || 0).toLocaleString('ko-KR')}`;

/* ===== 고정 파라미터(쿼리) ===== */
const url = new URLSearchParams(location.search);
const userUID = url.get('userUID') || '700001';            // 문자열 유지
const orderID = url.get('orderID') || String(Date.now());  // 예시 기본값

/* ===== 전역 상태 ===== */
const state = {
  items: [],                 // [{goodsID,name,option,price,qty,image}]
  coupon: null,              // {code, amountType:'percent'|'amount', amount, label}
  points: 0,                 // 입력값
  usePoints: false,          // 포인트 사용 토글
  shipFee: 0,                // 자동 계산 결과(결제 금액에 반영될 배송비)
  totals: { products:0, discount:0, ship:0, total:0 },
  flags: { couponsLoaded:false }
};

/* ===== 안전 fetch(JSON) ===== */
async function safeFetchJson(url, opt = {}){
  const res = await fetch(url, { cache:'no-store', ...opt });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

/* ===== 초기 로드 ===== */
async function loadCheckout(){
  if (DEV_MODE){
    // 1순위: 동일 폴더 → 2순위: 상위 폴더 → 3순위: 내장 폴백
    let data;
    try{ data = await safeFetchJson('./checkout.json'); }
    catch{
      try{ data = await safeFetchJson('../checkout.json'); }
      catch{
        data = { items: [
          { goodsID:'G-DEMO-1', name:'데모 상품 A', option:'기본', price:12000, qty:1, image:'/common/img/placeholder-1.png' },
          { goodsID:'G-DEMO-2', name:'데모 상품 B', option:'블랙', price:34000, qty:2, image:'/common/img/placeholder-2.png' }
        ]};
      }
    }
    state.items = Array.isArray(data) ? data : (data.items || []);
  }else{
    const data = await safeFetchJson(`/api/order/checkout?${qs({ userUID, orderID })}`);
    state.items = data.items || [];
  }

  renderItems();
  setupShipPayUI();     // 선불/착불 옵션·안내 보장
  recomputeShipFee();   // 배송비 자동 계산
  calcTotals();
}

/* ===== 렌더링: 우측 주문 상품 목록 ===== */
function renderItems(){
  const ul = $('#itemList');
  if (!ul) return;
  ul.innerHTML = '';
  state.items.forEach(it=>{
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <img src="${it.image}" alt="">
      <div>
        <div class="name">${it.name}</div>
        <div class="opt">${it.option || ''} × ${it.qty}</div>
      </div>
      <div class="price">${won(it.price * it.qty)}</div>
    `;
    ul.appendChild(li);
  });
}

/* ===== 배송비 정책 =====
 * - 합계 5만원 미만: 3,000원 / 이상: 0원
 * - 빠른배송(express): +2,000원
 * - 착불(collect): 결제 금액에는 0원으로 표기(수령자 부담) */
// 기존 정책 함수 교체
function policyShipFee(items, shipType, shipPay){
  const base = 2500;                              // 일반 배송 기본 2,500원
  const expressAdd = shipType === 'express' ? 2000 : 0;  // 빠른배송 추가 2,000원
  const fee = base + expressAdd;
  return shipPay === 'collect' ? 0 : fee;         // 착불이면 결제액 0원(표시는 "₩0 (착불)")
}


/* ===== 배송비 재계산 + 입력칸 반영(읽기전용) ===== */
function recomputeShipFee(){
  const typeSel = $('#shipType');
  const paySel  = $('#shipPay');
  if (typeSel && !typeSel.value) typeSel.value = 'normal';
  if (paySel  && !paySel.value)  paySel.value  = 'prepaid';

  const type = typeSel?.value || 'normal';
  const pay  = paySel?.value  || 'prepaid';

  state.shipFee = policyShipFee(state.items, type, pay);

  const shipFeeInput = $('#shipFee');
  if (shipFeeInput){
    shipFeeInput.value = state.shipFee;
    shipFeeInput.readOnly = true;
    shipFeeInput.setAttribute('aria-readonly','true');
  }
}

/* ===== 합계 표에 '쿠폰/포인트' 줄이 없으면 생성 ===== */
function ensureTotalsRows(){
  const dl = document.querySelector('.summary .totals');
  if (!dl) return;
  const totalRow = dl.querySelector('.total');

  if (!$('#rowCoupon')){
    const r = document.createElement('div');
    r.id = 'rowCoupon';
    r.innerHTML = `<dt>쿠폰 할인</dt><dd id="sumCoupon">-₩0</dd>`;
    dl.insertBefore(r, totalRow);
  }
  if (!$('#rowPoints')){
    const r = document.createElement('div');
    r.id = 'rowPoints';
    r.innerHTML = `<dt>포인트 사용</dt><dd id="sumPoints">-₩0</dd>`;
    dl.insertBefore(r, totalRow);
  }
}

/* ===== 포인트 사용 힌트(인풋 아래 표시) ===== */
function updatePointsHint(){
  const input = $('#points');
  if (!input) return;
  let hint = $('#pointsHint');
  if (!hint){
    hint = document.createElement('div');
    hint.id = 'pointsHint';
    hint.style.cssText = 'margin-top:6px;font-size:12px;color:#6b7280';
    (input.closest('label') || input.parentElement).appendChild(hint);
  }
  hint.textContent = state.usePoints ? `사용 금액: ${won(state.points)}` : '포인트 사용 안 함';
}
function normalizeCoupon(raw){
  if (!raw) return null;
  let t = (raw.amountType || raw.type || raw.kind || '').toLowerCase();
  if (t === 'percentage' || t === '%') t = 'percent';
  if (t === 'fixed' || t === 'value' || t === 'won') t = 'amount';
  if (!['percent','amount'].includes(t)) return null;
  const amt = Number(raw.amount ?? raw.value ?? raw.rate ?? 0);
  return { code: raw.code || raw.label || 'COUPON', amountType: t, amount: isNaN(amt)?0:amt, label: raw.label || raw.code || '' };
}

function applyCouponFromSelect(){
  const v = document.getElementById('couponSelect')?.value;
  try{
    state.coupon = v ? normalizeCoupon(JSON.parse(v)) : null;
  }catch{
    state.coupon = null;
  }
  calcTotals();
}


/* ===== 합계 계산 ===== */
function calcTotals(){
  ensureTotalsRows();

  const products = state.items.reduce((a,b)=> a + b.price*b.qty, 0);
  const shipPay = $('#shipPay')?.value || 'prepaid';
  const ship = state.shipFee;

  // 쿠폰 할인
  let couponDisc = 0;
  if (state.coupon){
    couponDisc = state.coupon.amountType === 'percent'
      ? Math.floor(products * (Number(state.coupon.amount||0) / 100))
      : Math.max(0, Number(state.coupon.amount||0));
  }

  // 포인트(토글 ON일 때만 적용)
  const ptInput = Number($('#points')?.value || 0);
  state.points = state.usePoints ? Math.max(0, ptInput) : 0;

  const discount = Math.min(products, couponDisc + state.points);
  const total = Math.max(0, products + ship - discount);
  state.totals = { products, ship, discount, total };

  // 표시
  const set = (id, v) => { const el = $('#'+id); if (el) el.textContent = v; };
  set('sumProducts', won(products));
  set('sumShip', shipPay === 'collect' ? `${won(0)} (착불)` : won(ship));
  set('sumCoupon', `-${won(couponDisc).slice(1)}`);
  set('sumPoints', `-${won(state.points).slice(1)}`);
  set('sumDiscount', `-${won(discount).slice(1)}`); // 기존 한 줄 합계 계속 노출 시
  set('sumTotal', won(total));
  const btn = $('#btnPay'); if (btn) btn.textContent = `${won(total)} 결제하기`;

  updatePointsHint();
}

/* ===== 선불/착불 UI 보장 + 안내문 ===== */
function setupShipPayUI(){
  const shipPay = $('#shipPay');
  if (shipPay && !shipPay.options.length){
    shipPay.innerHTML = `
      <option value="prepaid">선불</option>
      <option value="collect">착불</option>
    `;
  }
  if (shipPay && !$('#shipPayNote')){
    const note = document.createElement('div');
    note.id = 'shipPayNote';
    note.style.cssText = 'margin-top:6px;color:#6b7280;font-size:12px';
    shipPay.parentElement.appendChild(note);
  }
  updateShipPayNote();
}
function updateShipPayNote(){
  const pay = $('#shipPay')?.value || 'prepaid';
  const note = $('#shipPayNote');
  if (!note) return;
  note.textContent = pay === 'collect'
    ? '착불: 배송비는 수령 시 지불하며 결제 금액에는 포함되지 않습니다.'
    : '선불: 배송비가 결제 금액에 포함됩니다.';
}

/* ===== 주소 모달 토글 ===== */
async function toggleAddrModal(){
  const modal = $('#addrModal');
  const ul = $('#addrList');
  if (!modal || !ul) return;

  if (modal.open){ modal.close(); return; } // 열려 있으면 닫기

  ul.innerHTML = '<li>불러오는 중…</li>';
  let list = [];
  try{
    list = DEV_MODE
      ? [
          { zip:'06236', addr:'서울 강남구 테헤란로 123', detail:'10층' },
          { zip:'04146', addr:'서울 마포구 백범로 12',    detail:'101동 202호' }
        ]
      : await safeFetchJson(`/common/address-list?${qs({ userUID })}`);
  }catch{ list = []; }

  ul.innerHTML = '';
  list.forEach(a=>{
    const li = document.createElement('li');
    li.className = 'addr-item';
    li.textContent = `[${a.zip}] ${a.addr} ${a.detail || ''}`;
    li.addEventListener('click', ()=>{
      $('#zip')  && ($('#zip').value  = a.zip || '');
      $('#addr1')&& ($('#addr1').value= a.addr || '');
      $('#addr2')&& ($('#addr2').value= a.detail || '');
      modal.close();
    });
    ul.appendChild(li);
  });

  modal.showModal();
}

/* ===== 쿠폰: 자동 로드(최초 1회), 버튼은 재로딩 ===== */
async function loadCoupons(forceReload = false){
  if (state.flags.couponsLoaded && !forceReload) return;

  const sel = document.getElementById('couponSelect');
  if (!sel) return;
  sel.hidden = false;
  sel.innerHTML = '<option value="">불러오는 중…</option>';

  let coupons = [];
  try{
    coupons = DEV_MODE
      ? [
          { code:'WELCOME10', amountType:'percent', amount:10,   label:'첫구매 10%' },
          { code:'SAVE2000',  amountType:'amount',  amount:2000, label:'2,000원 할인' }
        ]
      : await safeFetchJson(`/common/coupon-list?${qs({ userUID })}`);
  }catch{ coupons = []; }

  sel.innerHTML = '<option value="">쿠폰을 선택하세요</option>';
  coupons.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = JSON.stringify(c);
    opt.textContent = c.label || c.code;
    sel.appendChild(opt);
  });

  // 변경 시 자동 적용
 sel.onchange = applyCouponFromSelect;

  state.flags.couponsLoaded = true;
  
}


/* ===== 포인트 토글 주입 ===== */
function setupPointsToggle(){
  const input = $('#points');
  if (!input) return;

  // 토글 라벨이 없으면 생성
  let wrap = $('#usePointsWrap');
  if (!wrap){
    wrap = document.createElement('label');
    wrap.id = 'usePointsWrap';
    wrap.className = 'chk-inline';
    wrap.innerHTML = `<input type="checkbox" id="usePoints"> 포인트 사용`;
    const parent = input.closest('label') || input.parentElement;
    parent && parent.insertAdjacentElement('beforebegin', wrap);
  }

  // 초기 상태
  const cbox = $('#usePoints');
  state.usePoints = cbox?.checked || false;
  input.disabled = !state.usePoints;
  input.placeholder = state.usePoints ? '사용할 포인트' : '포인트 사용 안 함';

  // 이벤트
  cbox?.addEventListener('change', ()=>{
    state.usePoints = cbox.checked;
    input.disabled = !state.usePoints;
    input.placeholder = state.usePoints ? '사용할 포인트' : '포인트 사용 안 함';
    calcTotals();
  });
  input.addEventListener('input',  calcTotals);
  input.addEventListener('change', calcTotals);
}

/* ===== 주문 상세 JSON 구성 ===== */
function buildOrderDetail(){
  const method = $$('input[name="pay"]').find(r=>r.checked)?.value || 'card';
  return {
    buyer: {
      name:  $('#buyerName')?.value.trim()  || '',
      phone: $('#buyerPhone')?.value.trim() || '',
      addr:  $('#buyerAddr')?.value.trim()  || ''
    },
    receiver: {
      name:  $('#recvName')?.value.trim()   || '',
      phone: $('#recvPhone')?.value.trim()  || '',
      zip:   $('#zip')?.value.trim()        || '',
      addr1: $('#addr1')?.value.trim()      || '',
      addr2: $('#addr2')?.value.trim()      || '',
      memo:  $('#memo')?.value.trim()       || ''
    },
    discount: { coupon: state.coupon, points: state.points },
    shipping: { type: $('#shipType')?.value || 'normal', pay: $('#shipPay')?.value || 'prepaid', fee: state.shipFee },
    payment:  {
      method,
      cardCompany: $('#cardCompany')?.value || null,
      installment: $('#installment')?.value || '0',
      bankName:    $('#bankName')?.value    || null,
      depositor:   $('#depositor')?.value   || null
    },
    items: state.items,
    totals: state.totals
  };
}

/* ===== 결제 제출 ===== */
async function submitPayment(){
  if (DEV_MODE){
  console.log('[DEV]', { userUID, orderID, orderDetail }); // alert 대신 로그
  // return;  // 실제 호출까지 하고 싶으면 이 줄 삭제
}
  if (!$('#agree')?.checked){ alert('결제 약관에 동의해 주십시오.'); return; }

  const method = $$('input[name="pay"]').find(r=>r.checked)?.value || 'card';
  if (method === 'bank'){
    if (!$('#bankName')?.value){ alert('은행명을 선택해 주십시오.'); return; }
    if (!$('#depositor')?.value.trim()){ alert('입금자명을 입력해 주십시오.'); return; }
  }

  const orderDetail = JSON.stringify(buildOrderDetail()); // 고정 파라미터: 문자열

  if (DEV_MODE){
    alert(`[DEV] /goods/pay\nuserUID=${userUID}\norderID=${orderID}\norderDetail=\n${orderDetail}`);
    return;
  }

  const res = await fetch('/goods/pay', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ userUID, orderID, orderDetail })
  });
  if (!res.ok){ alert('결제 요청에 실패했습니다.'); return; }
  location.href = `/order/complete/?${qs({ userUID, orderID })}`;
}

/* ===== 이벤트 바인딩 ===== */
function bindEvents(){
  // 주문자 → 수령인 복사
  $('#sameAsBuyer')?.addEventListener('change', e=>{
    if (!e.target.checked) return;
    $('#recvName')  && ($('#recvName').value  = $('#buyerName')?.value || '');
    $('#recvPhone') && ($('#recvPhone').value = $('#buyerPhone')?.value || '');
    $('#addr1')     && ($('#addr1').value     = $('#buyerAddr')?.value || '');
  });

  // 배송 유형/선불·착불 변경 시 자동 재계산
  $('#shipType')?.addEventListener('change', ()=>{ recomputeShipFee(); calcTotals(); });
  $('#shipPay') ?.addEventListener('change', ()=>{ updateShipPayNote(); recomputeShipFee(); calcTotals(); });

  // 결제수단 전환
  $$('input[name="pay"]').forEach(r=>{
    r.addEventListener('change', ()=>{
      const isCard = r.value === 'card';
      $('#cardBox') && ($('#cardBox').hidden = !isCard);
      $('#bankBox') && ($('#bankBox').hidden =  isCard);
      if (!isCard) $('#bankName')?.focus();
    });
  });

  // 주소 모달 토글
  $('#btnAddrBook')?.addEventListener('click', toggleAddrModal);
  $('#btnZip')     ?.addEventListener('click', toggleAddrModal);
  $('#addrClose')  ?.addEventListener('click', ()=> $('#addrModal')?.close());

  // 쿠폰: 자동 로드 이후 버튼으로 재로딩, 적용
$('#btnLoadCoupons')?.addEventListener('click', ()=> loadCoupons(true));
$('#btnApplyDiscount')?.addEventListener('click', applyCouponFromSelect);

  // 결제
  $('#btnPay')?.addEventListener('click', submitPayment);
}

/* ===== 시작 ===== */
document.addEventListener('DOMContentLoaded', async ()=>{
  try{
    bindEvents();
    setupShipPayUI();      // 선불/착불 UI 보장
    setupPointsToggle();   // 포인트 토글 주입
    await loadCoupons(false); // 쿠폰 자동 로드
    await loadCheckout();     // 아이템 로드 → 배송비·합계 계산
  }catch(e){
    console.error('[checkout] 초기 로드 에러:', e);
    $('#itemList') && ($('#itemList').innerHTML = `<li style="color:#c00">주문 정보를 불러오지 못했습니다.</li>`);
    recomputeShipFee(); calcTotals();
  }
});
