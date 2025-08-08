// 슬라이더 기능 설정
// const (상수 선언 키워드): 재할당이 불가능한 변수 선언
// document (도큐먼트 객체): 현재 HTML 문서를 가리킴
// querySelectorAll (메서드): 선택자에 매칭되는 모든 요소를 NodeList로 반환
const slides = document.querySelectorAll('.slide');          // .slide 클래스가 적용된 모든 슬라이드 요소 모음
const sliderContainer = document.querySelector('.slider-container');  
                                                           // .slider-container 클래스가 적용된 슬라이더 래퍼 요소
const dots = document.querySelectorAll('.dot');             // .dot 클래스가 적용된 페이지네이션 점(dot) 요소 모음

// 현재 보여줄 슬라이드 인덱스(숫자)를 담을 변수, 초기값 1
let currentSlide = 1;

// 첫 번째 슬라이드와 마지막 슬라이드를 복제(clone)하여 무한 루프 효과를 위해 사용
const firstClone = slides[0].cloneNode(true);               // cloneNode(true): 깊은 복제(자식 노드까지 복제)
const lastClone = slides[slides.length - 1].cloneNode(true); // 마지막 슬라이드를 복제

// 복제된 요소에 'clone' 클래스 추가(DOMTokenList.add)
firstClone.classList.add('clone');  
lastClone.classList.add('clone');

// 복제된 첫 번째 슬라이드를 맨 뒤에 추가 (Node.appendChild)
sliderContainer.appendChild(firstClone);
// 복제된 마지막 슬라이드를 맨 앞에 삽입 (Node.insertBefore)
// insertBefore(newNode, referenceNode): referenceNode 앞에 newNode 삽입
sliderContainer.insertBefore(lastClone, slides[0]);

// 모든 슬라이드를 다시 선택하여 복제 포함된 전체 슬라이드 집합 생성
const allSlides = document.querySelectorAll('.slide');      
// totalSlides (전체 슬라이드 개수) 계산
const totalSlides = allSlides.length;                       

// 초기 위치 설정: translateX(-100%) 만큼 이동하여 currentSlide(1) 위치로 보이게 함
sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

// 슬라이드를 화면에 표시하는 함수 선언
// function (함수 선언 키워드) showSlide, 매개변수 n: 표시할 슬라이드 인덱스
function showSlide(n) {
    // transition 속성: CSS 속성 변화를 애니메이션으로 부드럽게 처리 (duration 0.5s)
    sliderContainer.style.transition = 'transform 0.5s';    
    // transform 속성: translateX()로 컨테이너의 X축 위치 이동
    sliderContainer.style.transform = `translateX(-${n * 100}%)`;  

    // dots 리스트 순회(Foreach)
    dots.forEach(dot => dot.classList.remove('active'));    
    // 현재 페이지에 해당하는 dot에 active 클래스 추가
    // 인덱스 보정: (n - 1 + slides.length) % slides.length
    dots[(n - 1 + slides.length) % slides.length].classList.add('active');
}

// 다음 슬라이드로 이동하는 함수 선언
function nextSlide() {
    currentSlide++;           // ++ 연산자로 currentSlide 값 1 증가
    showSlide(currentSlide);  // 증가된 값으로 showSlide 호출
}

// 이전 슬라이드로 이동하는 함수 선언
function prevSlide() {
    currentSlide--;           // -- 연산자로 currentSlide 값 1 감소
    showSlide(currentSlide);  // 감소된 값으로 showSlide 호출
}

// 무한 루프 처리를 위한 transitionend 이벤트 리스너 등록
// addEventListener: 이벤트 등록, 'transitionend'는 CSS transition 완료 시 발생
sliderContainer.addEventListener('transitionend', () => {
    // currentSlide 위치의 슬라이드에 'clone' 클래스가 있으면(contains 메서드)
        if (currentSlide >= 0 &&   // 마지막 복제 슬라이드일 때
            currentSlide < allSlides.length &&   
            allSlides[currentSlide] &&
            allSlides[currentSlide].classList.contains('clone') 
        ) {
        sliderContainer.style.transition = 'none';
        if (currentSlide === totalSlides - 1){
            currentSlide = 1;
        } else if (currentSlide === 0) {            // 첫 복제 슬라이드일 때
        currentSlide = slides.length;           // 실제 마지막 슬라이드로 인덱스 재설정
        }
                  // 실제 첫 슬라이드로 인덱스 재설정
        // 점프 후 translateX 재설정
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        // 강제 리플로우(forced reflow): offsetWidth 읽어오기
        // void 연산자로 값 사용 안 함, 렌더러에게 스타일 재계산을 강제
        void sliderContainer.offsetWidth;
        // transition 다시 설정
        sliderContainer.style.transition = 'transform 0.5s';
    }
});

// 자동 슬라이드 설정: setInterval(함수, 시간(ms))
// 3000ms(3초)마다 nextSlide 함수 호출
setInterval(() => {
    nextSlide();
}, 3000);

// 도트(dot) 클릭 이벤트로 해당 슬라이드로 이동
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;  // 클릭한 도트의 인덱스를 currentSlide에 할당
        showSlide(currentSlide);// 해당 인덱스 슬라이드로 이동
    });
});

// 초기 슬라이드 표시 호출
showSlide(currentSlide);



// --------------------------------------------------------------------
// 검색 팝업 기능 설정 (IIFE: 즉시 실행 함수 표현식)
// (function(){ ... })() 형태로 정의 즉시 실행
(function() {
    // DOMContentLoaded 이벤트: HTML 문서가 완전히 로드되어 DOM 트리 구성 완료 시 발생
    document.addEventListener('DOMContentLoaded', function() {
        // getElementById: ID 선택자로 요소 선택
        const searchBtn = document.getElementById('search-btn');        
        const searchPopup = document.getElementById('search-popup');    
        const popupContent = document.getElementById('popup-content');  
        const closePopup = document.getElementById('close-popup');      

        // 요소들이 모두 존재할 때만 기능 실행
        if (searchBtn && searchPopup && popupContent && closePopup) {
            searchPopup.classList.remove('open');
            // 팝업을 숨기는 함수 선언
            function hidePopup() {
                searchPopup.classList.remove('open');
            }

            // 버튼 위에 팝업을 표시하는 함수 선언
            function showPopupAboveButton() {
                searchPopup.classList.add('open');       // display 속성: block으로 표시
                popupContent.style.visibility = 'hidden';    // visibility: hidden으로 내용 숨김

                // 브라우저에게 다음 렌더링 타이밍에 콜백 호출 요청
                // requestAnimationFrame: 애니메이션 최적화를 위해 사용
                requestAnimationFrame(() => {
                    // getBoundingClientRect: 뷰포트(viewport) 기준 요소의 크기와 위치 정보 반환
                    const btnRect = searchBtn.getBoundingClientRect();
                    // offsetWidth, offsetHeight: 요소의 총 너비와 높이(패딩과 경계 포함)
                    const popupWidth = popupContent.offsetWidth;
                    const popupHeight = popupContent.offsetHeight;
                    // 계산: 화면 아래로 넘치지 않도록 top 위치 결정
                    const top = Math.min(
                        window.innerHeight - popupHeight - 80,  // 윈도우 높이 - 팝업 높이 - 마진 80px
                        btnRect.bottom + 12                     // 버튼 하단 위치 + 12px
                    );
                    // 계산: 화면 옆으로 넘치지 않도록 left 위치 결정
                    const left = Math.min(
                        window.innerWidth - popupWidth - 80,    // 윈도우 너비 - 팝업 너비 - 마진 80px
                        Math.max(0, btnRect.left + (btnRect.width / 2) - (popupWidth / 2))
                        // 버튼 가로 중앙 기준으로 팝업 중앙 정렬
                    );
                    // 팝업 위치 스타일 적용
                    popupContent.style.top = `${top}px`;      
                    popupContent.style.left = `${left}px`;    
                    popupContent.style.visibility = 'visible'; // visibility: visible로 내용 재표시
                });
            }

            // 검색 버튼 클릭 시 팝업 표시 이벤트 등록
            searchBtn.addEventListener('click', ()=>{
                searchPopup.classList.toggle('open');
            });
            
            // 닫기 버튼 클릭 시 팝업 숨김
            closePopup.addEventListener('click', hidePopup);
            
            // 검색 버튼 외부 클릭 시 팝업 숨김
            document.addEventListener('click', (e) => {
                // 클릭된 요소가 검색 버튼이나 팝업 내용이 아닌 경우에만 팝업 숨김
                if (!searchBtn.contains(e.target) && !popupContent.contains(e.target)) {
                    hidePopup();
                }
            });
            
            // 키보드 이벤트: ESC 키 누르면 팝업 숨김
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') hidePopup();
            });
            
            // 스크롤(scroll) 이벤트: 팝업이 보이는 상태면 위치 재계산
            window.addEventListener('scroll', () => {
                if (searchPopup.classList.contains === 'open') showPopupAboveButton();
            });
            
            // 창 크기 변경(resize) 이벤트: 팝업이 보이는 상태면 위치 재계산
            window.addEventListener('resize', () => {
                if (searchPopup.classList.contains === 'open') showPopupAboveButton();
            });
        }
    });
})(); // IIFE 즉시 실행 종료

// Mega Menu 메가 메뉴 열고 닫기(마우스 오버/아웃 또는 클릭)

// megaDropdown 변수는 오타(maga-dropdown)까지 대응하여 한 번만 선언
const megaDropdown = document.querySelector('.mega-dropdown');
const megaToggle = document.querySelector('.mega-toggle');
const megaMenu = document.querySelector('.mega-menu');

if(megaToggle && megaDropdown){
    megaToggle.addEventListener('click', function(e){
        e.preventDefault();
        megaDropdown.classList.toggle('open');
    });
}
document.addEventListener('click', function(e){
    if(
        megaDropdown &&
        !megaDropdown.contains(e.target) &&
        !e.target.classList.contains('mega-toggle')
    ){
        megaDropdown.classList.remove('open');
    }
});

//드롭다운(음료/스낵) 메뉴: 클릭 토글 JS 제거 (hover로 동작하게 할 것이므로 필요 없음)

// const btn = document.getE1ementById('search-btn');
// const popup = documnt.getE1ementById('search-popup');

// btn.ddEvetListener('click', e => {
//     e.stopPropagation();
//     popup.classList.toggle('show');
// });

// document.addEventListener('click',() =>{
//     popup.classList.remove('show');
// });


// 모든 .dropdown-toggle 요소를 찾아 클릭으로 토글 처리
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle =>{
    toggle.addEventListener('click', function(e){
        e.preventDefault();
        //(선택) 한 번에 하나만 열고 싶으면 아래 주석 해제
        // document.querySelectorAll('.dropdown.open').forEach(dd => dd.classList.remove('open'));
        this.parentElement.classList.toggle('open');
    });
});

// 페이지 빈 곳 클릭 시 열린 메뉴 닫기
document.addEventListener('click', function(e){
    dropdownToggles.forEach(toggle =>{
        const dropdown = toggle.parentElement;
        if(!dropdown.contains(e.target)){
            dropdown.classList.remove('open');
        }
    });
});