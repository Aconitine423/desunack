// DOM 캐시
const $wrap = document.querySelector('.mypage');
const USER_UID = $wrap?.dataset.userUid; // 예: "U123456"
const ROLE = $wrap?.dataset.role || 'consumer';

/* 좌측 메뉴 템플릿 주입: -data-role에 따라 템플릿(#tpl-menu-)을 #mypage-menu에 복사 */
(function injectSideMenu(){
    const target = document.getElementById('mypage-menu');
    const tplId = ROLE === 'seller' ? '#tpl-menu-seller' : '#tpl-menu-consumer';
    const tpl = document.querySelector(tplId);
    if (tpl && target) target.appendChild(tpl.content.cloneNode(true));
})();

// 토스트 메시지 함수
function showToast(message, isSuccess = true) {
    // 1. jQuery로 토스트 요소를 만들고 클래스와 텍스트를 한 번에 설정 (체이닝)
    const $toast = $('<div>').addClass('toast').text(message);

    // 2. 실패 시 배경색 변경
    if (!isSuccess) {
        $toast.css('background-color', '#d9534f');
    }

    // 3. 토스트 컨테이너에 새로 만든 토스트를 추가
    $('#toast').append($toast);

    // 4. 2.5초 대기 후, 0.5초 동안 서서히 사라지는 애니메이션 실행.
    //    애니메이션이 끝나면 DOM에서 완전히 제거.
    setTimeout(() => {
        $toast.fadeOut(500, function() {
            $(this).remove();
        });
    }, 2500);
}

// 카카오 우편번호 api
// 우편번호 찾기 찾기 화면을 넣을 element
var element_wrap = document.getElementById('wrap');

function foldDaumPostcode() {
    // iframe을 넣은 element를 안보이게 한다.
    element_wrap.style.display = 'none';
}

function sample3_execDaumPostcode() {
    // 현재 scroll 위치를 저장해놓는다.
    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new daum.Postcode({
        oncomplete: function (data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("sample3_extraAddress").value = extraAddr;

            } else {
                document.getElementById("sample3_extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample3_postcode').value = data.zonecode;
            document.getElementById("sample3_address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            // document.getElementById("sample3_detailAddress").focus();

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            element_wrap.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);

    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
}

// 이메일 도메인 선택시 직접입력창에 value값 입력
const $emailDomain = $("#emailDomain");
const $selectDomain = $("#selectDomain");
$selectDomain.on('change', function () {
    if ($selectDomain.val() === "custom") {
        $emailDomain.val("");
    } else {
        $emailDomain.val($selectDomain.val());
    }
});

const $updateForm = $('#updateForm');

// // 중복 체크 여부 상태를 저장할 변수 (기본값: false)
// let isNicknameChecked = false;
// let isNicknameAvailable = false;
//
// // 닉네임 중복체크
// function checkUserNickname() {
//     const userNickname = $('#userNickname').val();
//     const originalNickname = $('#originalNickname').val();
//     // 중복 체크 여부 초기화
//     isNicknameChecked = false;
//
//     if (userNickname === '') {
//         $('#nicknameError').text('닉네임은 필수 입력 항목입니다.').css('color', 'red');
//         return;
//     } else if (userNickname > 20) {
//         $('#nicknameError').text('닉네임은 최대 20자까지 가능합니다.').css('color', 'red');
//         return;
//     } else if (userNickname === originalNickname) {
//         // 닉네임값이 변하지 않으면 중복체크 통과한것으로 처리
//         isNicknameChecked = true;
//         isNicknameAvailable = true;
//         $('#nicknameError').text('');
//         console.log('닉네임 변경없음. 중복체크 통과')
//         return;
//     }
//
//     // DB 닉네임 중복 체크 요청
//     axios.post('/signup/checkUserNickname', {customerNickname: userNickname})
//         .then(response => {
//             isNicknameChecked = true;
//             isNicknameAvailable = !response.data;
//             if (isNicknameAvailable) {
//                 $('#nicknameError').text('사용 가능한 닉네임입니다.').css('color', 'green');
//             } else {
//                 $('#nicknameError').text('이미 사용중인 닉네임입니다.').css('color', 'red');
//             }
//         })
//         .catch(function (error) {
//             console.log('닉네임 중복체크 실패: ', error);
//             $('#nicknameError').text('닉네임 중복체크에 실패했습니다.').css('color', 'red');
//         })
// }

// 전화번호 입력 필드에 숫자만 입력 가능하도록
$('#tel1, #tel2, #tel3').on('input', function () {
    const $this = $(this);
    // 숫자 이외의 문자 제거
    $this.val($this.val().replace(/[^0-9]/g, ''));
});

// 유효성 검사
function validateForm() {
    let isValid = true;

    // 모든 오류 메시지 초기화
    $('.errorMsg').text('');

    // // 사업자명 유효성 검사 (필수, 길이)
    // const sellerName = $('#sellerName').val();
    // if (sellerName === '') {
    //     $('#nameError').text('이름은 필수 입력 항목입니다.').css('color', 'red');
    //     isValid = false;
    // } else if (sellerName.length > 20) {
    //     $('#nameError').text('이름은 최대 20자까지 가능합니다.').css('color', 'red');
    //     isValid = false;
    // }
    //
    // // 사업자번호 유효성 검사 (필수, 길이)
    // const sellerNum = $('#sellerNum').val();
    // if (sellerNum === '') {
    //     $('#sellerNumError').text('닉네임은 필수 입력 항목입니다.').css('color', 'red');
    //     isValid = false;
    // } else if (sellerNum.length > 20) {
    //     $('#sellerNumError').text('닉네임은 최대 20자까지 가능합니다.').css('color', 'red');
    //     isValid = false;
    // }

    // 전화번호 유효성 검사 (필수, 형식)
    const tel1 = $('#tel1').val();
    const tel2 = $('#tel2').val();
    const tel3 = $('#tel3').val();
    const tel1Regex = /^\d{2,4}$/;
    const tel2Regex = /^\d{3,4}$/;
    const tel3Regex = /^\d{4}$/;
    let errorMsg = '';
    if (tel1 === '' || tel2 === '' || tel3 === '') {
        errorMsg = '전화번호는 필수 입력 항목입니다.';
        // $('#telError').text('전화번호는 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (isValid && !tel1Regex.test(tel1)) {
        errorMsg = '첫번째 전화번호는 2~4자리 숫자로 입력해주세요.';
        // $('#telError').text('첫번째 전화번호는 2~4자리 숫자로 입력해주세요.').css('color', 'red');
        isValid = false;
    } else if (isValid && !tel2Regex.text(tel2)) {
        errorMsg = '두번째 전화번호를 3~4자리 숫자로 입력해주세요.';
        // $('#telError').text('두번째 전화번호는 3~4자리 숫자로 입력해주세요.').css('color', 'red');
        isValid = false;
    } else if (isValid && !tel3Regex.test(tel3)) {
        errorMsg = '세번째 전화번호는 4자리 숫자로 입력해주세요.';
        // $('#telError').text('세번째 전화번호는 4자리 숫자로 입력해주세요.').css('color', 'red');
        isValid = false;
    }
    if (!isValid) {
        $('#telError').text(errorMsg).css('color', 'red');
    } else {
        $('#telError').text('').css('color', '');
    }

    // 이메일 유효성 검사 (필수, 형식)
    const userEmailLocal = $('#emailLocal').val();
    const userEmailDomain = $('#emailDomain').val();
    const emailRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
    if (userEmailLocal === '' || userEmailDomain === '') {
        $('#emailError').text('이메일은 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (!emailRegex.test(userEmailDomain)) {
        $('#emailError').text('유효한 이메일 형식이 아닙니다.').css('color', 'red');
        isValid = false;
    }

    // 주소 유효성 검사
    const userPost = $('#sample3_postcode').val();
    const userAddressInput = $('#sample3_address').val();
    const userExtraAddress = $('#sample3_extraAddress').val();
    // const userAddressDetail = $('#sample3_detailAddress').val();
    if (userPost === '' || userAddressInput === '') {
        $('#addressError').text('주소 검색을 통해 주소를 입력해주세요.').css('color', 'red');
        isValid = false;
    }

    // 계좌 유효성 검사
    const sellerBank = $('#sellerBank').val();
    const sellerAccount = $('#sellerAccount').val();
    if (!sellerBank) {
        $('#bankError').text('은행을 선택해주세요.').css('color', 'red');
        isValid = false;
    } else if (sellerAccount === '') {
        $('#bankError').text('계좌번호를 입력해주세요.').css('color', 'red');
    }

    // 배송방식 선택 유효성 검사
    const sellerDelivery = $('#sellerDelivery').val();
    if (!sellerDelivery) {
        $('#deliveryError').text('배송방식을 선택해주세요.').css('color', 'red');
        isValid = false;
    }

    // 최종 유효성검사 통과시
    if (isValid) {
        // 입력된 이메일 합치기
        let userEmail = `${userEmailLocal}@${userEmailDomain}`;


        // 선택된 전화번호 합치기
        const tel1 = $('#tel1').val();
        const tel2 = $('#tel2').val();
        const tel3 = $('#tel3').val();
        const userTel = `${tel1}-${tel2}-${tel3}`;

        // 입력된 주소 합치기
        const userAddress = userAddressInput + userExtraAddress;

        // 입력된 파라미터 묶음
        const formData = {
            userUid: $('#userUid').val(),
            userPhone: userTel,
            userEmail: userEmail,
            userPost: $('#sample3_postcode').val(),
            userAddress: userAddress,
            userAddressDetail: $('#sample3_detailAddress').val(),
            sellerBank: $('#sellerBank').val(),
            sellerAccount: $('#sellerAccount').val(),
            sellerDelivery: $('#sellerDelivery').val()
        };

        console.log('formData', formData);

        // 엑시오스로 데이터 전송
        axios.post('/member/sellerUpdate', formData)
            .then(function (response) {
                console.log("회원정보 수정 성공: ", response.data);
                showToast("회원정보 수정이 완료되었습니다.", true);
            })
            .catch(function (error) {
                console.log("회원정보 수정 실패:", error);
                if (error.response && error.response.data) {
                    showToast(error.response.data.message, false);
                } else {
                    showToast("회원정보 수정에 실패했습니다.", false);
                }
            });
    } else {
        // 유효성검사 실패시 메시지박스에 표시
        showToast("입력 정보를 다시 확인해주세요.", false);
    }
    return isValid;
}

// 수정하기 버튼 클릭시 이벤트 제어
$updateForm.on('submit', function (event) {
    event.preventDefault();
    validateForm();
})

// 입력필드 포커스아웃 이벤트 발생 추가 (실시간으로 유효성 검사)
// 전화번호 입력창
const tel1Regex = /^\d{2,4}$/;
$('#tel1').on('focusout', function () {
    const tel1 = $('#tel1').val();
    if (tel1 === '') {
        $('#telError').text('전화번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (!tel1Regex.test(tel1)) {
        $('#telError').text('첫번째 전화번호는 2~4자리 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#telError').text('');
    }
});
const tel2Regex = /^\d{3,4}$/;
$('#tel2').on('focusout', function () {
    const tel2 = $('#tel2').val();
    if (tel2 === '') {
        $('#telError').text('전화번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (!tel2Regex.test(tel2)) {
        $('#telError').text('두번째 전화번호는 3~4자리 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#telError').text('');
    }
});
const tel3Regex = /^\d{4}$/;
$('#tel3').on('focusout', function () {
    const tel3 = $('#tel3').val();
    if (tel3 === '') {
        $('#telError').text("전화번호는 필수 입력 항목입니다.").css('color', 'red');
    } else if (!tel3Regex.test(tel3)) {
        $('#telError').text('세번째 전화번호는 4자리 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#telError').text('');
    }
})

// 이메일 입력창
$('#emailLocal').on('focusout', function () {
    const userEmailLocal = $('#emailLocal').val();
    if (userEmailLocal === '') {
        $('#emailError').text('이메일 주소 아이디를 입력해주세요.').css('color', 'red');
    } else {
        $('#emailError').text('');
    }
})
$('#emailDomain').on('focusout', function () {
    const userEmailDomain = $('#emailDomain').val();
    const emailRegex = /[^\s@]+\.[^\s@]+$/;
    if (userEmailDomain === '') {
        $('#emailError').text('이메일 주소 도메인을 입력해주세요.').css('color', 'red');
    } else if (!emailRegex.test(userEmailDomain)) {
        $('#emailError').text('유효한 이메일 형식이 아닙니다.').css('color', 'red');
    } else {
        $('#emailError').text('');
    }
})

// 계좌 입력창
$('#sellerBank').on('focusout', function () {
    const sellerBank = $('#sellerBank').val();
    if (!sellerBank) {
        $('#bankError').text('은행을 선택해주세요.').css('color', 'red');
    }
})
$('#sellerAccount').on('focusout', function () {
    const sellerAccount = $('#sellerAccount').val();
    if (sellerAccount === '') {
        $('#bankError').text('계좌번호를 입력해주세요.').css('color', 'red');
    }
})