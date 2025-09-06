document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("order-list");
  
  // 실제로는 /api/orders (DB 연동)
  fetch("./mock/orders.json")
  .then(res => res.json())
  .then(orders => {
    orders.forEach(order => {
      const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const section = document.createElement("section");
      section.classList.add("order-section");
      
      section.innerHTML = `
          <header class="order-header">
            <button type="button" class="order-link" data-toggle="order-detail-${order.orderId}">
              주문번호: ${order.orderId}
            </button>
            <span class="order-date">${order.orderDate}</span>
            <span class="order-status">${order.status}</span>
          </header>
      
          <div class="order-detail" id="order-detail-${order.orderId}" hidden>
            
            <!-- 주문상품 -->
            <section class="detail-block">
              <h3 class="detail-title">주문상품</h3>
              <ul class="order-items">
                ${order.items.map(item => `
                  <li>
                    <div class="item-thumb"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="item-info">
                      <p class="item-name">${item.name}</p>
                      <p class="item-qty">${item.quantity}개</p>
                    </div>
                    <div class="item-price">
                      ${item.originalPrice ? `<span class="original">₩${item.originalPrice.toLocaleString()}</span>` : ""}
                      <span class="discount">₩${item.price.toLocaleString()}</span>
                    </div>
                  </li>
                `).join("")}
              </ul>
            </section>
      
            ${order.deliveryType === "shipping" ? `
            <!-- 배송 상황 -->
            <section class="detail-block">
              <h3 class="detail-title">배송 상황</h3>
              <div class="progress-track">
                <ul class="progress-steps">
                  <li data-step="1">결제완료</li>
                  <li data-step="2">상품 준비중</li>
                  <li data-step="3">배송중</li>
                  <li data-step="4">배송완료</li>
                </ul>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:0%"></div>
                </div>
              </div>
            </section>
            <!-- 배송 정보 -->
            <section class="detail-block">
              <h3 class="detail-title">배송 정보</h3>
              <ul>
                <li>받는 분: ${order.receiver}</li>
                <li>전화번호: ${order.phone}</li>
                <li>주소: ${order.address}</li>
              </ul>
            </section>
            ` : `
            <!-- 픽업 정보 -->
            <section class="detail-block">
              <h3 class="detail-title">픽업 정보</h3>
              <ul>
                <li>받는 분: ${order.receiver}</li>
                <li>전화번호: ${order.phone}</li>
                <li>픽업 장소: ${order.pickupPlace}</li>
              </ul>
            </section>
            `}
      
            <!-- 결제정보 -->
            <section class="detail-block">
  <h3 class="detail-title">결제정보</h3>
  <ul>
    <li>총 주문금액: ₩${totalPrice.toLocaleString()}</li>
    <li>쿠폰 할인: -₩${order.couponDiscount.toLocaleString()}</li>
    <li>포인트 사용: -${order.usedPoint.toLocaleString()}P</li>
    <li>총 할인금액: -₩${order.discount.toLocaleString()}</li>
    <li><strong>최종 결제금액: ₩${order.finalPrice.toLocaleString()}</strong></li>
    <li>결제수단: ${order.payment.method} (${order.payment.card})</li>
  </ul>
</section>
  <!-- 주문 관련 버튼 -->
              <section class="detail-block order-actions">
                <!-- 배송 주문 -->
              ${order.deliveryType === "shipping" && order.status === "배송중"
      ?`<button class="btn-cancel">주문 취소</button>` : ""}
      
              ${order.deliveryType === "shipping" && order.status === "배송완료"
      ?`<button class="btn-refund">반품/환불</button><button class="btn-review">리뷰 작성</button>` : ""}
              
                  <!-- 픽업 주문 -->
                ${order.deliveryType === "pickup" && order.statusStep === 1
      ?`<button class="btn-cancel">주문 취소</button>` : ""}
      
              ${order.deliveryType === "pickup" && order.statusStep === 3
      ?`<button class="btn-refund">반품/환불</button><button class="btn-review">리뷰 작성</button>` : ""}
              </section>
          </div>
        `;
      
      orderList.appendChild(section);
      
      // 배송 상황 진행바 업데이트
      if (order.deliveryType === "shipping") {
        updateProgress(`order-detail-${order.orderId}`, order.statusStep);
      } else if(order.deliveryType === "pickup"){
        // 픽업 주문 -> 픽업 진행바 생성
        const section = document.getElementById(`order-detail-${order.orderId}`);
        const pickupHTML = `
        <section class="detail-block">
      <h3 class="detail-title">픽업 진행상황</h3>
      <div class="progress-track">
        <ul class="progress-steps pickup-steps">
          <li data-step="1">픽업 준비중</li>
          <li data-step="2">픽업 가능</li>
          <li data-step="3">픽업 완료</li>
        </ul>
          <div class="progress-bar">
          <div class="progress-fill" style="width:0%">
          </div>
          </div>
          </section>
          `;
        section.insertAdjacentHTML("afterbegin", pickupHTML);
        updateProgress(`order-detail-${order.orderId}`, order.statusStep);
      }
    });
    
    // 아코디언 토글
    document.querySelectorAll(".order-link").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-toggle");
        const detail = document.getElementById(targetId);
        detail.toggleAttribute("hidden");
      });
    });
  });
});

// 진행바 업데이트 함수
function updateProgress(sectionId, statusStep) {
  const section = document.getElementById(sectionId);
  const steps = section.querySelectorAll(".progress-steps li");
  const fill = section.querySelector(".progress-fill");
  
  steps.forEach(li => {
    const step = parseInt(li.dataset.step);
    if (step < statusStep) li.classList.add("done");
    else if (step === statusStep) li.classList.add("active");
  });
  
  const percent = ((statusStep - 1) / (steps.length - 1)) * 100;
  fill.style.width = `${percent}%`;
}

// 리뷰 버튼 클릭 이벤트 연결
document.addEventListener("click", e=>{
  if(e.target.classList.contains("btn-review")){
    // json의 첫 번째 상품만 전달(멀티상품이면 확장 필요)
    const orderSection = e.target.closest(".order-section");
    const orderId = orderSection.querySelector(".order-link").textContent.split(": ")[1];

    fetch("./mock/orders.json")
    .then(res=>res.json())
    .then(orders=>{
      const order = orders.find(o=>o.orderId == orderId);
      openReviewModal(order.items[0]);
    });
  }
});
/* 한글 주석: 상태별 배지 클래스와 포인트 색상 */
const STATUS_STYLE = {
  "배송중":     { badge: "badge badge--shipping", accent: "#2f8cff" },
  "배송 완료":  { badge: "badge badge--done",     accent: "#10b981" },
  "픽업 준비중": { badge: "badge badge--pickup",   accent: "#f59e0b" },
  "픽업 완료":  { badge: "badge badge--done",     accent: "#10b981" }
};

/* 한글 주석: 주문 배열(DB or JSON)을 카드로 렌더링 */
function renderOrders(orders = []) {
  const wrap = document.getElementById("order-list");
  if (!wrap) return;
  wrap.innerHTML = orders.map(toCardHTML).join("");
}

/* 한글 주석: 한 건을 카드 HTML 문자열로 변환 */
function toCardHTML(o) {
  // o 예시 필드: { orderId, date, statusText, itemCount, totalPrice, deliveryType }
  const st = STATUS_STYLE[o.statusText] || { badge: "badge badge--shipping", accent: "#2f8cff" };
  const total = typeof o.totalPrice === "number" ? `₩${o.totalPrice.toLocaleString()}` : (o.totalPrice || "");
  const typeLabel = o.deliveryType === "pickup" ? "픽업" : "택배";
  return `
  <article class="order-card" style="--accent:${st.accent}">
    <div class="order-head">
      <a class="order-id" href="/My_page/user/order/${o.orderId || ""}">주문번호: ${o.orderId || "-"}</a>
      <time class="order-date">${o.date || ""}</time>
      <span class="status ${st.badge}">${o.statusText || ""}</span>
    </div>
    <div class="order-summary">
      <span>상품 ${o.itemCount ?? "-"}개 · ${typeLabel}</span>
      <strong class="order-total">${total}</strong>
    </div>
  </article>`;
}

/* 한글 주석: DB에서 받아오면 그 결과로 호출하세요 */
// fetch('/api/orders').then(r=>r.json()).then(renderOrders);

// 한글 주석: JSON 테스트용 예시
// renderOrders([
//   {orderId:2001, date:"2025-08-29 18:12", statusText:"배송중", itemCount:2, totalPrice:34500, deliveryType:"shipping"},
//   {orderId:1001, date:"2025-08-31 20:30", statusText:"픽업 완료", itemCount:1, totalPrice:12000, deliveryType:"pickup"}
// ]);
