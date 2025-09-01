// 입력창 focus/blur 시 테두리 강조
document.querySelectorAll('.login-form input').forEach(input =>{
    input.addEventListener('focus',() => input.classList.add('focused'));
    input.addEventListener('blur', () => input.classList.remove('focused'));
});

// submit 직전 공백(앞뒤) 제거
    $('loginBtn').on('submit', function (event) {
        event.preventDefault();
        const uid = $('input[name="id"]');
        const pwd = $('input[name="pw"]');
        if (uid.length > 0) {
            uid.val(uid.val().trim());
        }
        if (pwd.length > 0) {
            pwd.val(pwd.val().trim());
        }
    });

//로그인 실패 시 url 파라미터(error=login)에 따라 alert
const params = new URLSearchParams(window.location.search);
if (params.get('error') === 'login'){
    alert('로그인에 실패했습니다.');
}

const $modal = $('#findModal');

// 모달을 열고 findInfoFrm.html 내용을 로드
$('.modal-trigger').on('click', function(e) {
    e.preventDefault();
    $modal.find('.modal-content').load('/member/find-info', function() {
        $modal.fadeIn(300);
        initializeModalEvents();
    });
});

// 모달 이벤트(닫기, 탭) 초기화 함수
function initializeModalEvents() {
    // 모달 닫기
    $('.close-button').on('click', function() {
        $modal.fadeOut(300);
    });

    // 모달 외부 클릭 시 닫기
    $(window).on('click', function(e) {
        if ($(e.target).is($modal)) {
            $modal.fadeOut(300);
        }
    });

    // 모달 탭 기능
    $('.modal-tab').on('click', function() {
        $('.modal-tab').removeClass('active');
        $(this).addClass('active');

        const target = $(this).data('target');
        $('.modal-form').removeClass('active');
        $('#' + target).addClass('active');
    });
}