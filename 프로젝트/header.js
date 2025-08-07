// 검색 팝업 기능 설정
// 검색 팝업 기능 설정 (IIFE: 즉시 실행 함수)
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const searchBtn    = document.getElementById('search-btn');
        const searchPopup  = document.getElementById('search-popup');
        const popupContent = document.getElementById('popup-content');
        const closePopup   = document.getElementById('close-popup');

        if (!(searchBtn && searchPopup && popupContent && closePopup)) return;

        // 초기 숨김
        searchPopup.classList.remove('open');

        // 팝업 숨기기
        function hidePopup() {
            searchPopup.classList.remove('open');
        }

        // 버튼 아래에 팝업 위치시키고 보이기
        function showPopupAboveButton() {
            searchPopup.classList.add('open');
            popupContent.style.visibility = 'hidden';
            requestAnimationFrame(() => {
                const btnRect    = searchBtn.getBoundingClientRect();
                const popupWidth = popupContent.offsetWidth;
                const popupHeight= popupContent.offsetHeight;
                const top  = Math.min(
                    window.innerHeight - popupHeight - 80,
                    btnRect.bottom + 12
                );
                const left = Math.min(
                    window.innerWidth - popupWidth - 80,
                    Math.max(0, btnRect.left + btnRect.width/2 - popupWidth/2)
                );
                popupContent.style.top        = `${top}px`;
                popupContent.style.left       = `${left}px`;
                popupContent.style.visibility = 'visible';
            });
        }

        // 검색 버튼 클릭 토글
        searchBtn.addEventListener('click', () => {
            if (searchPopup.classList.toggle('open')) {
                showPopupAboveButton();
            } else {
                hidePopup();
            }
        });

        // 닫기 버튼 클릭
        closePopup.addEventListener('click', hidePopup);

        // 버튼 외부 클릭 시 닫기
        document.addEventListener('click', e => {
            if (!searchBtn.contains(e.target) && !popupContent.contains(e.target)) {
                hidePopup();
            }
        });

        // ESC 키 누르면 닫기
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') hidePopup();
        });

        // 스크롤/리사이즈 시 위치 재계산
        window.addEventListener('scroll', () => {
            if (searchPopup.classList.contains('open')) showPopupAboveButton();
        });
        window.addEventListener('resize', () => {
            if (searchPopup.classList.contains('open')) showPopupAboveButton();
        });
    });
})();

// 메가 메뉴 열고 닫기 (헤더 내)
const megaDropdown = document.querySelector('.mega-dropdown');
const megaToggle   = document.querySelector('.mega-toggle');
if (megaToggle && megaDropdown) {
    megaToggle.addEventListener('click', e => {
        e.preventDefault();
        megaDropdown.classList.toggle('open');
    });
}
document.addEventListener('click', e => {
    if (megaDropdown &&
        !megaDropdown.contains(e.target) &&
        !e.target.classList.contains('mega-toggle')) {
        megaDropdown.classList.remove('open');
    }
});

// 일반 드롭다운 토글 (헤더 내 내비게이션)
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        // 여러 개 열리고 싶지 않으면 아래 주석 해제
        // document.querySelectorAll('.dropdown.open').forEach(dd => dd.classList.remove('open'));
        this.parentElement.classList.toggle('open');
    });
});
document.addEventListener('click', e => {
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.parentElement;
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});