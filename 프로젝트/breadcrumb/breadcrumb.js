
// breadcrumb.js
(function() {
  console.log('▶ breadcrumb init');

  // 1) 요소 참조
  const toggles  = document.querySelectorAll('.dropdown-toggle');
  const mainMenu = document.getElementById('main-menu');
  const subMenu  = document.getElementById('sub-menu');
  // …필요한 요소들…

  if (!toggles.length || !mainMenu || !subMenu) {
    console.error('▶ breadcrumb: 필수 요소 누락');
    return;
  }

  // 2) 대/소분류 생성 로직
  // …populateSubMenu 등…

  // 3) 토글 바인딩
  toggles.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.dropdown').classList.toggle('open');
    });
  });

  // 4) 외부 클릭 시 닫기
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open')
            .forEach(dd => dd.classList.remove('open'));
  });
})();

document.addEventListener('DOMContentLoaded', () => {
    
  // 1) 데이터 정의
  const mainCategories = [
    { label: "음료", value: "drink" },
    { label: "간식", value: "snack" }
  ];
  const subCategories = {
    drink: [
      { label: "탄산", value: "soda" },
      { label: "비탄산", value: "nonSoda" },
      { label: "분말", value: "powder" }
    ],
    snack: [
      { label: "과자", value: "cookie" },
      { label: "사탕류", value: "candy" },
      { label: "초콜릿", value: "chocolate" },
      { label: "아이스크림", value: "icecream" },
      { label: "빵", value: "bread" }
    ]
  };

  // 2) 요소 참조
  const mainMenu   = document.getElementById('main-menu');
  const subMenu    = document.getElementById('sub-menu');
  const mainLabel  = document.getElementById('main-label');
  const subLabel   = document.getElementById('sub-label');
  const toggles    = document.querySelectorAll('.dropdown-toggle');

  // 3) 방어 코드: 필요한 요소가 없으면 중단
  if (!mainMenu || !subMenu || !mainLabel || !subLabel || toggles.length === 0) {
    console.error('breadcrumb.js ▶ 필수 요소를 찾을 수 없습니다.');
    return;
  }

  // 4) 대분류 메뉴 생성
  mainCategories.forEach(item => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href           = "#";
    a.textContent    = item.label;
    a.dataset.value  = item.value;

    a.addEventListener('click', e => {
      e.preventDefault();
      // 대분류 선택
      mainLabel.textContent   = item.label;
      mainLabel.dataset.value = item.value;
      // 소분류 갱신
      populateSubMenu(item.value);
      // 드롭다운 닫기
      closeAllDropdowns();
    });

    li.appendChild(a);
    mainMenu.appendChild(li);
  });

  // 5) 소분류 메뉴 갱신 함수
  function populateSubMenu(mainValue) {
    subMenu.innerHTML      = "";
    subLabel.textContent   = "소분류";
    subLabel.dataset.value = "";

    (subCategories[mainValue] || []).forEach(sub => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href           = "#";
      a.textContent    = sub.label;
      a.dataset.value  = sub.value;

      a.addEventListener('click', e => {
        e.preventDefault();
        // 소분류 선택
        subLabel.textContent   = sub.label;
        subLabel.dataset.value = sub.value;
        closeAllDropdowns();
        // 상세페이지 이동
        window.location.href = `/detail.php?main=${mainLabel.dataset.value}&sub=${subLabel.dataset.value}`;
      });

      li.appendChild(a);
      subMenu.appendChild(li);
    }); // ← forEach 닫기
  }

  // 6) 드롭다운 토글 기능
  toggles.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const dd = btn.closest('.dropdown');
      dd.classList.toggle('open');
    });
  });

  // 7) 열린 드롭다운 모두 닫기 함수
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.open')
            .forEach(dd => dd.classList.remove('open'));
  }

  // 8) 바깥 클릭 시 드롭다운 닫기
  document.addEventListener('click', closeAllDropdowns);
});
