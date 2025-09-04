let products = []; // JSON 데이터 저장용

// ===== 리스트 렌더링 =====
function renderList(list) {
  const ul = document.querySelector(".product-list");
  if (!ul) return;

  ul.innerHTML = list.map(item => `
    <li class="product-item">
      <div class="col check"><input type="checkbox" value="${item.goodsId}"></div>
      <div class="col regdate">${item.regDate}</div>
      <div class="col code">${item.goodsId}</div>
      <div class="col info">${item.name}</div>
      <div class="col price">${item.price.toLocaleString()}원</div>
      <div class="col status">
        <span class="badge ${item.status === "selling" ? "visible" : "hidden"}">
          ${item.status === "selling" ? "판매중" : "판매중지"}
        </span>
        <span class="badge ${item.visible ? "visible" : "hidden"}">
          ${item.visible ? "노출" : "비노출"}
        </span>
      </div>
      <div class="col action">
        <button class="btn-edit" data-code="${item.goodsId}">수정</button>
      </div>
    </li>
  `).join("");
}

// ===== 상태 업데이트 =====
function updateStatus(status) {
  const checked = [...document.querySelectorAll(".product-list input[type=checkbox]:checked")]
    .map(chk => chk.value);

  if (checked.length === 0) {
    alert("선택된 상품이 없습니다.");
    return;
  }

  products.forEach(p => {
    if (checked.includes(p.goodsId)) {
      if (status === "selling") p.status = "selling";
      if (status === "stopped") p.status = "stopped";
      if (status === "visible") p.visible = true;
      if (status === "hidden") p.visible = false;
    }
  });

  renderList(products);
}

// ===== DOM 로드 후 이벤트 바인딩 =====
document.addEventListener("DOMContentLoaded", () => {
  // 1. JSON 불러오기
  fetch("product.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderList(products);
    });

  // 2. 수정 버튼
  document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-edit")) {
      const code = e.target.dataset.code;
      console.log("수정 페이지 이동:", code);
      // location.href = `/goods/update?goods-code=${code}`;
    }
  });

  // 3. 전체 선택
  document.getElementById("btnSelectAll").addEventListener("click", () => {
    document.querySelectorAll(".product-list input[type=checkbox]")
      .forEach(chk => chk.checked = true);
  });

  // 4. 상태 변경 버튼
  document.getElementById("btnSelling").addEventListener("click", () => updateStatus("selling"));
  document.getElementById("btnStopped").addEventListener("click", () => updateStatus("stopped"));
  document.getElementById("btnVisible").addEventListener("click", () => updateStatus("visible"));
  document.getElementById("btnHidden").addEventListener("click", () => updateStatus("hidden"));

  // 5. 검색 기능
  document.getElementById("btnSearch").addEventListener("click", () => {
    const type = document.getElementById("filterType").value;
    const q = document.getElementById("q").value.trim();

    let filtered = [...products];

    if (type === "visible") filtered = filtered.filter(p => p.visible === true);
    if (type === "hidden") filtered = filtered.filter(p => p.visible === false);
    if (type === "selling") filtered = filtered.filter(p => p.status === "selling");
    if (type === "stopped") filtered = filtered.filter(p => p.status === "stopped");

    if (q) {
      filtered = filtered.filter(p =>
        p.name.includes(q) || String(p.goodsId).includes(q)
      );
    }

    renderList(filtered);
  });
});
