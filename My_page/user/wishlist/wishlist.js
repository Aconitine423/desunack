/* ==========================================================
 * 찜한 상품 페이지 스크립트 (from scratch)
 * 기능: 목록 로드, 상세 이동, 선택·일괄구매, 개별 삭제
 * 고정 파라미터: userUID, goodsID
 * ========================================================== */

/* ====== 환경 ====== */
const DEV_MODE = true; // true: wishlist.json 사용 / false: 실제 API 사용
const SEL = {
  tbody: '#wishTbody',
  chkAll: '#chkAll',
  btnBuy: '#btnBuy',
  selCount: '#selCount',
};
const FORCE_SIDEBAR_HREF = '/My_page/member/wishlist/'; // 사이드바 강조 링크

/* ====== 유틸 ====== */
/** 숫자 → 원화 문자열 */
const won = n => Number(n || 0).toLocaleString('ko-KR');

/** 객체 → 쿼리스트링 */
const qs = obj => new URLSearchParams(obj).toString();

/** DOM 헬퍼 */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/** 로그인 회원 고유번호 얻기
 *  1순위: <body data-user-uid="...">
 *  2순위: localStorage('userUID')
 */
function getUserUID(){
  const v = document.body?.getAttribute('data-user-uid');
  if (v && v !== 'null' && v !== 'undefined') return v;
  return localStorage.getItem('userUID') || '';
}

/* ====== 데이터 로드 ====== */
/** 찜 목록 조회
 *  DEV_MODE: wishlist.json
 *  실서버:   GET /api/wishlist?userUID=...
 */
async function loadWishlist(){
  const userUID = getUserUID();
  const url = DEV_MODE ? 'wishlist.json' : `/api/wishlist?${qs({ userUID })}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('찜 목록을 불러오지 못했습니다.');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
}

/* ====== 렌더링 ====== */
function renderRows(items){
  const tbody = $(SEL.tbody);
  tbody.innerHTML = '';

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.goodsId = item.goodsID;            // 고정 파라미터: goodsID

    tr.innerHTML = `
      <td>
        <!-- 행 선택 체크박스: 일괄 구매용 -->
        <input type="checkbox" class="row-chk" aria-label="선택">
      </td>
      <td>${item.likedAt || ''}</td>
      <td>
        <!-- 상품정보 전체 영역 클릭 시 상세로 이동 -->
        <div class="prod" role="button" tabindex="0" aria-label="상품 상세 보기">
          <img class="prod-img" src="${item.image}" alt="${item.name || ''}"
               onerror="this.src='/common/images/placeholder.png'">
          <div class="prod-info">
            <div class="prod-brand">${item.brand || ''}</div>
            <div class="prod-name">
              <a href="/product/detail/?${qs({ goodsID: item.goodsID, userUID: getUserUID() })}">
                ${item.name || ''}
              </a>
            </div>
            ${item.option ? `<div class="prod-opt">${item.option}</div>` : ''}
          </div>
        </div>
      </td>
      <td class="price">₩${won(item.price)}</td>
      <td>
        <!-- 개별 삭제 버튼 -->
        <button type="button" class="btn btn-danger btn-del">삭제</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectionUI(); // 선택 수 갱신
}

/* ====== 동작 ====== */
/** 상세 페이지로 이동 */
function goDetail(goodsID){
  const userUID = getUserUID();
  location.href = `/product/detail/?${qs({ goodsID, userUID })}`;
}

/** 선택된 goodsID 배열 반환 */
function selectedGoodsIDs(){
  return $$('.row-chk')
    .filter(chk => chk.checked)
    .map(chk => chk.closest('tr')?.dataset.goodsId)
    .filter(Boolean);
}

/** 선택 수 UI 갱신 */
function updateSelectionUI(){
  const n = selectedGoodsIDs().length;
  $(SEL.selCount).textContent = n;
  $(SEL.btnBuy).disabled = n === 0;
}

/** 개별 삭제 API 호출
 *  DELETE /api/wishlist?userUID=&goodsID=
 */
async function removeWishlistItem(goodsID){
  const userUID = getUserUID();

  if (DEV_MODE){
    // 목업 모드: 실제 삭제 대신 콘솔 로그 후 통과
    console.log('[DEV] DELETE /api/wishlist', { userUID, goodsID });
    return;
  }

  const url = `/api/wishlist?${qs({ userUID, goodsID })}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error('삭제 실패');
}

/** 일괄 구매
 *  1) 장바구니 일괄 추가: POST /api/cart/bulk-add
 *     body: { userUID, items:[{ goodsID, qty }] }
 *  2) 결제 이동: /order/checkout/?userUID=&goodsIDs=gid1,gid2
 */
async function onBuy(){
  const ids = selectedGoodsIDs();
  if (ids.length === 0) return;

  const userUID = getUserUID();

  if (DEV_MODE){
    alert(`[DEV] 구매 진행\nuserUID=${userUID}\ngoodsIDs=${ids.join(',')}`);
    return;
  }

  const res = await fetch('/api/cart/bulk-add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userUID,
      items: ids.map(gid => ({ goodsID: gid, qty: 1 }))
    })
  });
  if (!res.ok){
    alert('구매 준비에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }
  location.href = `/order/checkout/?${qs({ userUID, goodsIDs: ids.join(',') })}`;
}

/* ====== 이벤트(위임으로 단단하게) ====== */
function bindEvents(){
  // 1) 전체 선택
  $(SEL.chkAll).addEventListener('change', e=>{
    $$('.row-chk').forEach(chk => chk.checked = e.target.checked);
    updateSelectionUI();
  });

  // 2) tbody 위임: 체크박스, 삭제, 상세 이동
  $(SEL.tbody).addEventListener('change', e=>{
    if (e.target.classList.contains('row-chk')){
      // 헤더 체크박스 상태 동기화
      const rows = $$('.row-chk');
      $(SEL.chkAll).checked = rows.length && rows.every(c => c.checked);
      updateSelectionUI();
    }
  });

  $(SEL.tbody).addEventListener('click', async e=>{
    // 삭제 버튼
    const delBtn = e.target.closest('.btn-del');
    if (delBtn){
      e.preventDefault();
      const tr = delBtn.closest('tr');
      const goodsID = tr?.dataset.goodsId;
      if (!goodsID) return;
      if (!confirm('이 상품을 찜 목록에서 삭제하시겠습니까?')) return;
      try{
        await removeWishlistItem(goodsID);
        tr.remove();
        updateSelectionUI();
      }catch(err){
        console.error(err);
        alert('삭제에 실패했습니다.');
      }
      return;
    }

    // 상품 정보 영역 클릭 → 상세 이동
    const prod = e.target.closest('.prod');
    if (prod){
      const tr = prod.closest('tr');
      const goodsID = tr?.dataset.goodsId;
      if (goodsID) goDetail(goodsID);
      return;
    }
  });

  // 키보드 접근성: Enter/Space로 상세 이동
  $(SEL.tbody).addEventListener('keydown', e=>{
    if (!e.target.closest('.prod')) return;
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      const tr = e.target.closest('tr');
      const goodsID = tr?.dataset.goodsId;
      if (goodsID) goDetail(goodsID);
    }
  });

  // 3) 구매하기
  $(SEL.btnBuy).addEventListener('click', onBuy);
}

/* ====== 초기화 ====== */
async function init(){
  try{
    const items = await loadWishlist();
    renderRows(items);
    bindEvents();
  }catch(err){
    console.error(err);
    $(SEL.tbody).innerHTML = `
      <tr><td colspan="5" style="text-align:center;padding:24px">
        목록을 불러오지 못했습니다.
      </td></tr>
    `;
  }

  // 사이드바 강조(인클루드 지연 대비)
  setTimeout(()=>{
    const side = document.querySelector('#site-side');
    const a = side && side.querySelector(`a[href="${FORCE_SIDEBAR_HREF}"]`);
    if (a) a.classList.add('is-active');
  }, 120);
}

document.addEventListener('DOMContentLoaded', init);
