'use strict';

const DATA_URL = './coupon.json';
let COUPONS = [];

/* JSON 불러오기 */
async function loadJSON(){
  const r = await fetch(DATA_URL,{cache:'no-store'});
  return r.ok ? r.json() : [];
}

/* 테이블 렌더링 */
function renderTable(data){
  const tbody = document.querySelector('#coupon-list tbody');
  if(!tbody) return;

  if(!data.length){
    tbody.innerHTML = `<tr><td colspan="6">발급된 쿠폰이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(c=>{
    let statusBadge = '';
    if(c.active === false){
      statusBadge = `<span class="badge stopped">발급중지</span>`;
    } else {
      statusBadge = `<span class="badge ${c.visible ? 'visible':'hidden'}">${c.visible?'노출':'비노출'}</span>`;
    }

    return `
      <tr>
        <td><input type="checkbox" class="rowChk" data-num="${c.couponNum}"></td>
        <td>${c.startDate}</td>
        <td>${c.couponNum}</td>
        <td>[${c.couponType}] ${c.discountPrice ? c.discountPrice+'원' : c.discountPercent+'%'} 할인</td>
        <td>${c.minPrice}원 이상</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

/* 선택된 쿠폰번호 반환 */
function getSelectedCoupons(){
  return [...document.querySelectorAll('.rowChk:checked')].map(c=>c.dataset.num);
}

/* DOM 로드 후 실행 */
document.addEventListener('DOMContentLoaded', async ()=> {
  // 초기 로드
  COUPONS = await loadJSON();
  renderTable(COUPONS);

  /* 검색 */
document.getElementById('btnSearch').addEventListener('click', ()=>{
  const q = document.getElementById('q').value.trim();
  const f = document.getElementById('filterType').value;

  let filtered = COUPONS.filter(c => {
    let matchText = true;
    let matchFilter = true;

    // 검색어 필터
    if (q) {
      matchText = c.couponNum.includes(q);
    }
      // 상태 필터
      if (f === 'visible') matchFilter = (c.visible === true && c.active !== false);
      if (f === 'hidden') matchFilter =  (c.visible === false && c.active !== false);
    if (f === 'all') matchFilter = true;

      return matchText && matchFilter;
  });

  renderTable(filtered);
});

  /* 전체 선택 */
  document.getElementById('btnSelectAll').addEventListener('click', ()=>{
    document.querySelectorAll('.rowChk').forEach(c => c.checked = true);
  });

  /* 노출 처리 */
  document.getElementById('btnShow').addEventListener('click', ()=>{
    const selected = getSelectedCoupons();
    if(!selected.length) return alert("선택된 쿠폰이 없습니다.");
    COUPONS.forEach(c => { if(selected.includes(c.couponNum)) { c.visible=true; c.active=true; } });
    renderTable(COUPONS);
  });

  /* 비노출 처리 */
  document.getElementById('btnHide').addEventListener('click', ()=>{
    const selected = getSelectedCoupons();
    if(!selected.length) return alert("선택된 쿠폰이 없습니다.");
    COUPONS.forEach(c => { if(selected.includes(c.couponNum)) { c.visible=false; c.active=true; } });
    renderTable(COUPONS);
  });

  /* 발급 중지 */
  document.getElementById('btnStop').addEventListener('click', ()=>{
    const selected = getSelectedCoupons();
    if(!selected.length) return alert("선택된 쿠폰이 없습니다.");
    COUPONS.forEach(c => { if(selected.includes(c.couponNum)) { c.active=false; } });
    renderTable(COUPONS);
  });

  /* 발급 재개 */
  document.getElementById('btnResume').addEventListener('click', ()=>{
    const selected = getSelectedCoupons();
    if(!selected.length) return alert("선택된 쿠폰이 없습니다.");
    COUPONS.forEach(c => { if(selected.includes(c.couponNum)) { c.active=true; } });
    renderTable(COUPONS);
  });
/* 모달 열기/닫기 */
const modal = document.getElementById('couponModal');
const btnAdd = document.getElementById('btnAdd');

if (modal && btnAdd) {
  // 열기
  btnAdd.addEventListener('click', () => {
    modal.hidden = false;
  });

  // 닫기
  function closeModal() {
    modal.hidden = true;
  }

  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.querySelector('#btnCancel')?.addEventListener('click', closeModal);
  modal.querySelector('.modal-dim')?.addEventListener('click', closeModal);
}

  /* 신청 처리 (데모) */
  document.getElementById('couponForm').addEventListener('submit', e=>{
    e.preventDefault();
    alert("프론트엔드 데모: 실제 저장은 백엔드 연동 필요");
    closeModal();
  });
});
