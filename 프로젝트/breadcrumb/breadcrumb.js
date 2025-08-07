document.addEventListener('DOMContentLoaded', ()=>{
// 1) 파라미터 매핑 정의
const mainCategories = [
    { label: "음료", value: "drink"},
    { label: "간식", value: "snack"}
];
const subCategories = {
    drink:[
        {label: "탄산", value: "soda"},
        {label: "비탄산", value: "nonSoda"},
        {label: "분말", value: "powder"},
    ],
    snack:[
        {label: "과자", value:"cookie" },
        {label: "사탕류", value:"candy" },
        {label: "초콜릿", value:"chocolate" },
        {label: "아이스크림", value:"icecream" },
        {label: "빵", value:"bread" },
    ]
};

// 2) 요소 참조
const mainMenu = document.getElementById('main-menu');
const subMenu = document.getElementById('sub-menu');
const mainLabel = document.getElementById('main-label');
const subLabel = document.getElementById('sub-label');

// 3) 대분류 메뉴 생성
mainCategories.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href                     = "#";
    a.textContent              = item.label;
    a.dataset.value            = item.value;


    a.addEventListener('click', e => {
        e.preventDefault();
        // 대분류 선택 반영
        mainLabel.textContent   = item.label;
        mainLabel.dataset.value = item.value;
        // 소분류 메뉴 갱신
        populateSubMenu(item.value);
        // 열린 드롭다운 닫기
        closeAllDropdowns(); 
    });

    li.appendChild(a);
    mainMenu.appendChild(li);
});

// 4) 소분류 갱신 함수
function populateSubMenu(mainValue) {
    subMenu.innerHTML      =""; //기존 항목 삭제
    subLabel.textContent   ="소분류"; // 라벨 초기화
    subLabel.dataset.value ="";  // value 초기화

    (subCategories[mainValue] || []).forEach(sub => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href          = "#";
        a.textContent   = sub.label;
        a.dataset.value = sub.value;
        a. addEventListener('click', e => {
            e.preventDefault();
            subLabel.textContent   = sub.label;
            subLabel.dataset.value = sub.value;
        closeAllDropdowns();
        // 선택 완료 후 페이지 이동
        const mv = mainLabel.dataset.value;
        const sv = subLabel.dataset.value;
        window.location.href = `/detail.php?main=${mainLabel.dataset.value}&sub=${subLabel.dataset.value}`;
    });

    li.appendChild(a);
    subMenu.appendChild(li);
});
}

// 5) 드롭다운 열고 닫기 (토글 로직)
const toggles = document.querySelectorAll('.dropdown-toggle');
toggles.forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const dd = btn.closest('.dropdown');
        dd.classList.toggle('open');
    });
});

// 6) 바깥 클릭 시 모두 닫기 함수 정의
function closeAllDropdowns(){
    document.querySelectorAll('.dropdown.open')
            .forEach( dd => dd.classList.remove('open'));
}

// 7) 바깥 클릭 시 닫기 핸들러 등록
document.addEventListener('click', closeAllDropdowns);
});