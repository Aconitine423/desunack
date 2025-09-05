$(document).ready(function () {
    const megaDropdown = $('#mega-dropdown');
    const megaToggle = megaDropdown.find('.mega-toggle');
    const megaMenu = $('#mega-menu');
    const megaCategories = megaMenu.find('.mega-category');

    const searchBtn = $('#search-btn');
    const searchPopup = $('#search-popup');
    const closePopupBtn = $('#close-popup');
    const searchSubmitBtn = $('.search-submit-btn');

    const loginBtn = $('#login-btn');
    const signupBtn = $('#signup-btn');
    const logoutBtn = $('#logout-btn');
    const mypageBtn = $('#mypage-btn');

    // 메가 메뉴 토글 기능
    megaToggle.on('click', function (e) {
        e.stopPropagation();
        megaMenu.toggleClass('open');
        // 검색 팝업이 열려있으면 닫기
        if (searchPopup.hasClass('open')) {
            searchPopup.removeClass('open');
        }
    });

    // 메가 메뉴 카테고리 활성화
    megaCategories.on('click', function () {
        megaCategories.removeClass('active');
        $(this).addClass('active');
    });

    // 검색 팝업 토글 기능
    searchBtn.on('click', function (e) {
        e.stopPropagation();
        searchPopup.toggleClass('open');
        // 메가 메뉴가 열려있으면 닫기
        if (megaMenu.hasClass('open')) {
            megaMenu.removeClass('open');
        }
    });
    closePopupBtn.on('click', function () {
        searchPopup.removeClass('open');
    });

    // 드롭다운 메뉴 토글 기능
    $('.has-dropdown > .dropdown-toggle').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const root = $(this).parent('.has-dropdown');
        $('.has-dropdown').not(root).removeClass('open');
        root.toggleClass('open');
    });
    // 외부 클릭 시 모든 드롭다운 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.has-dropdown').length) {
            $('.has-dropdown').removeClass('open');
        }
    });

    // 검색 실행 버튼 - Axios 통신 예시
    searchSubmitBtn.on('click', function (e) {
        e.preventDefault();
        const sweeteners = $('input[name="sweetener"]:checked').map(function () {
            return this.value;
        }).get();
        const allergies = $('input[name="allergy"]:checked').map(function () {
            return this.value;
        }).get();

        console.log("Axios를 사용하여 검색 요청을 보냅니다:", {sweeteners, allergies});

        // Axios를 사용하여 검색 데이터를 서버로 전송하는 예시
        axios.get('/api/search', {
            params: {
                sweetener: sweeteners.join(','),
                allergy: allergies.join(',')
            }
        })
            .then(response => {
                console.log('검색 결과:', response.data);
            })
            .catch(error => {
                console.error('검색 요청 실패:', error);
            });
    });

    // 외부 클릭 시 메뉴 및 팝업 닫기
    $(document.body).on('click', function (e) {
        if (megaMenu.hasClass('open') && !$(e.target).closest('#mega-dropdown').length) {
            megaMenu.removeClass('open');
        }
        if (searchPopup.hasClass('open') && !$(e.target).closest('.search-container').length) {
            searchPopup.removeClass('open');
        }
    });

    /**
     * @brief 회원 분류에 따라 헤더 버튼을 변경합니다.
     * @param {string|null} m_kind 회원의 분류 ("C", "S", "A" 또는 null)
     */
    window.setMembershipKind = function (m_kind) {
        // 모든 버튼을 초기 상태로 숨김
        loginBtn.addClass('hidden');
        signupBtn.addClass('hidden');
        logoutBtn.addClass('hidden');
        mypageBtn.addClass('hidden');
        mypageBtn.attr('href', '#'); // 링크 초기화

        // 회원 분류에 따라 버튼 표시
        if (!m_kind) { // 비회원
            loginBtn.removeClass('hidden');
            signupBtn.removeClass('hidden');
        } else {
            logoutBtn.removeClass('hidden');
            mypageBtn.removeClass('hidden');

            if (m_kind === 'C') {
                mypageBtn.find('span').text('내 정보');
                mypageBtn.attr('href', '/member/mypage');
            } else if (m_kind === 'S') {
                mypageBtn.find('span').text('판매자 페이지');
                mypageBtn.attr('href', '/member/mypage');
            } else if (m_kind === 'A') {
                mypageBtn.find('span').text('관리자 페이지');
                mypageBtn.attr('href', '/admin/mypage.html');
            }
        }
    };

    // 초기 상태 설정
    window.setMembershipKind(null);
});