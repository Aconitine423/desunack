/* ============================================================
checkout.js
- 금액 합계(상품/배송/할인/총액) 계산 및 표시
- 쿠폰/포인트 적용
- 배송료 입력 반영, 배송 종류 변경 훅
- 결제 아코디언 토글
- 주문자→수령인 정보 복사
- 주소 검색 모달(더미) 열고/닫기
- 약관(필수) 체크 시 결제 버튼 활성화
- 기본 유효성 검사 + 페이로드 구성(데모: alert/console)
- 모든 주석: 한글 중심
============================================================ */

(function () {
    'use strict';
    
    /* [a] 도우미 */
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
    
    // 통화 포맷: 숫자 -> "12,345원"
    const krw = (n) => (Number(n) || 0).toLocaleString('ko-KR') + '원';
    
    // 텍스트에서 숫자만 추출: "12,345원 -> 12345"
    const parseNum = (txt) => Number(String(txt).replace(/[^\d.-]/g, '')) || 0;
    
    // 요소 텍스트 세팅(안전)
    const setText = (sel, txt) => {const el = $(sel); if(el) el.textContent = txt; };
    
    /* [b] 합계 모델 생성/렌더 */
    function makeModel(){
        const box = $('#orderSummary');
        
        // 1) data-* 초기값 사용 (없으면 0)
        const model = {
            subtotal: Number(box?.dataset.subtotal || 0),
            shipping: Number(box?.dataset.shipping || 0),
            discount: 0, // 정액 할인 (쿠폰)
            percentOff: 0, // % 할인 (쿠폰)
            points: 0, // 포인트 사용 금액
            freeShipt: false // 무료배승 플래그
        };
        
        // 2) 표시 텍스트에 값이 있으면 우선 반영
        const tSub = $('#sumProducts')?.textContent;
        const tShip = $('#sumShipFee')?.textContent;
        if (parseNum(tSub)) model.subtotal = parseNum(tSub);
        if (parseNum(tShip)) model.shipping = parseNum(tShip);
        
        // 3) 입력란 배송료가 있으면 그 값을 최우선 사용
        const shipFeeEl = $('#shipFee');
        if (shipFeeEl && shipFeeEl.value !== '') {
            model.shipping = Math.max(0, Number(shipFeeEl.value) || 0);
        }
        
        // 4) (선택) 서버가 상품 목록을 data-price /data-qty로 주변 합산 
        recalcSubtotalFromProducts(model);
        
        return model;
    }
    
    // (옵션) 상품 목록에서 합계 재계산
    function recalcSubtotalFromProducts(model) {
        const items = $$('#summaryProducts [data-price]');
        if (!items.length) return false;
        let sum = 0;
        items.forEach(el => {
            const price = Number(el.getAttribute('data-price')) || 0;
            const qty   = Number(el.getAttribute('data-qty'))   || 1;
            sum += price * qty;
        });
        model.subtotal = sum;
        return true;
    }
    
    function renderSummary(m) {
        // 할인: 퍼센트(상품합계 기준) + 정액쿠폰 + 포인트
        const percentDiscount = Math.floor(m.subtotal * (m.percentOff / 100));
        const fixedDiscount   = Math.max(0, m.discount) + Math.max(0, m.points);
        const discountTotal   = percentDiscount + fixedDiscount;
        
        const shipCost = m.freeShip ? 0 : Math.max(0, m.shipping);
        const total    = Math.max(0, m.subtotal + shipCost - discountTotal);
        
        setText('#sumProducts', krw(m.subtotal));
        setText('#sumShipFee', krw(shipCost));
        setText('#sumDiscount', discountTotal > 0 ? ('-' + krw(discountTotal)) : '0원');
        setText('#sumTotal', krw(total));
        
        // 결제 버튼에 총액 저장(백엔드 연동 대비)
        const btn = $('#btnPay');
        if (btn) btn.dataset.total = String(total);
    }
    
    /* [c] 바인딩 */
    
    // 주문자 -> 수령인 정보 복사
    function bindCopyToReceiver() {
        const cb = $('#copyToReceiver');
        if (!cb) return;
        cb.addEventListener('change', () => {
            if (!cb.checked) return;
            $('#rcvName').value  = $('#buyerName').value  || '';
            $('#rcvPhone').value = $('#buyerPhone').value || '';
        });
    }
    
    //  주소 검색 모달 (더미)
    function bindAddressModal(){
        const modal  = $('#addrModal');
        const openBt = $('#btnFindAddr');
        const cancel = $('#addrCancel');
        const apply  = $('#addrApply');
        if (!modal || !openBt) return;
        
        const open  = () => { modal.hidden = false; };
        const close = () => { modal.hidden = true; };
        
        openBt.addEventListener('click', open);
        cancel?.addEventListener('click', close);
        apply?.addEventListener('click', ()=> {
            // 데모 데이터 주입
            $('#zip').value   = '06236';
            $('#addr1').value = '서울 강남구 테혜란로 123 (더미)';
            $('#addr2').focus ();
            close();
        });
        
        // ESC / 백드롭
        document.addEventListener('Keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
        modal.addEventListener('click', (e) => {
            if(e.target === modal) close();
        });
    }
    
    // 결제 아코디언: .head 클릭 시 .item만 active
    function bindPayAccordion() {
        const root = $('#payAccordion');
        if (!root) return;
        root.addEventListener('click', (e) => {
            const head = e.target.closest('.head');
            if (!head) return;
            const item = head.closest('.item');
            $$('.pay-accordion .item').forEach(it => {
                const active = (it === item);
                it.classList.toggle('active', active);
                $('.head', it)?.setAttribute('aria-expanded', String(active));
            });
        });
    }

    // 배송 관련: 타입 변경 훅 + 베송료 입력 반영
    function bindshipping(model) {
        // 탑입별 기본 배송비를 쓰고 싶으면 아래 매핑 주석 해제
        // const map = { parcel: 3000, quick: 8000, pickup: 0 };

        $('#shipType')?.addEventListener('change', () => {
            // model.shipping = map[$('#shipType').value] ?? model.shipping;
            renderSummary(model);
        });

        $('#shipFee')?.addEventListener('input', () => {
            model.shipping = Math.max(0, Number($('#shipFee').value) ||0);
            renderSummary(model);
        });
    }

    // 쿠폰/포인트 적용
    function bindDiscounts(model) {
        const couponSel = $('#couponSelect');
        const pointUse  = $('#pointUse');
        const status    = $('#couponStatus');

        function applyCoupon(){
            // 초기화
            model.freeShip   = false;
            model.percentOff = 0;
            model.discount   = 0;

            const val = (couponSel?.value || '').trim().toUpperCase();
            if (!val) { if (status) status.textContent = ''; renderSummary(model); return; }

            if (val === 'FREESHIP') {
                model.freeShip = true;
                status && (status.textContent = '배송비 무료 적용');
                 } else if (val.startsWith('PERCENT:')){
                    const p = Number(val.split)
                 }
        }
    }
))

}
})