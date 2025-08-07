// 검색 팝업 기능 설정
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const searchBtn    = document.getElementById('search-btn');
        const searchPopup  = document.getElementById('search-popup');
        const popupContent = document.getElementById('popup-content');
        const closePopup   = document.getElementById('close-popup');

        if (!(searchBtn && searchPopup && popupContent && closePopup)) return;

        // 팝업 숨김/표시 토글
        function showPopupAboveButton() {
            searchPopup.classList.add('open');
            popupContent.style.visibility = 'hidden';
            requestAnimationFrame(() => {
                const btnRect    = searchBtn.getBoundingClientRect();
                const w          = popupContent.offsetWidth;
                const h          = popupContent.offsetHeight;
                const top  = Math.min(window.innerHeight - h - 80, btnRect.bottom + 12);
                const left = Math.min(window.innerWidth - w - 80,
                                      Math.max(0, btnRect.left + btnRect.width/2 - w/2));
                popupContent.style.top        = `${top}px`;
                popupContent.style.left       = `${left}px`;
                popupContent.style.visibility = 'visible';
            });
        }
        function hidePopup() {
            searchPopup.classList.remove('open');
        }

        searchBtn.addEventListener('click', () => {
            searchPopup.classList.toggle('open')
              ? showPopupAboveButton()
              : hidePopup();
        });
        closePopup.addEventListener('click', hidePopup);
        document.addEventListener('click', e => {
            if (!searchBtn.contains(e.target) && !popupContent.contains(e.target)) {
                hidePopup();
            }
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') hidePopup();
        });
        window.addEventListener('resize', () => {
            if (searchPopup.classList.contains('open')) showPopupAboveButton();
        });
        window.addEventListener('scroll', () => {
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