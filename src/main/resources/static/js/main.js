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