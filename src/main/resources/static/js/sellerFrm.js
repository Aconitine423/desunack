const $sellerTermsBox = $('#sellerJoinTermsBox');
const $sellerTermsCheckbox = $('#sellerJoinTermsCheckBox');
const $sellerSignupForm = $('#sellerSignupForm');
const $sellerMessageBox = $('#sellerMessageBox');

// 중복 체크 여부 상태를 저장할 변수 (기본값: false)
let isSellerIdChecked = false; // 중복 체크 여부
let isSellerIdAvailable = false; // 중복 체크 여부 상태 저장

// 아이디 중복체크
$('#checkSellerId').on('click', function () {
    const sellerId = $('#sellerId').val();
    // 중복 체크 여부 초기화
    isSellerIdChecked = false;

    if (sellerId === '') {
        $('#sellerIdError').text('아이디는 필수 입력 항목입니다.');
        return;
    } else if (sellerId < 5 || sellerId > 20) {
        $('#sellerIdError').text('아이디는 5~20자 사이로 입력해주세요.');
        return;
    }

    // DB 아이디 중복 체크 요청
    axios.post('/signup/checkUserId', {userId: sellerId})
        .then(response => {
            isSellerIdChecked = true;
            isSellerIdAvailable = !response.data;
            if (isSellerIdAvailable) {
                $('#sellerIdError').text('사용 가능한 아이디입니다.').css('color', 'green');
            } else {
                $('#sellerIdError').text('이미 사용중인 아이디입니다.').css('color', 'red');
            }
        })
        .catch(function (error) {
            console.log('아이디 중복체크 실패: ', error);
            $('#sellerIdError').text('아이디 중복체크에 실패했습니다.').css('color', 'red');
        });
});
// function checkSellerId() {
// }

// 전화번호 입력 필드에 숫자만 입력 가능하도록
$('#tel2, #tel3').on('input', function () {
    const $this = $(this);
    // 숫자 이외의 문자 제거
    $this.val($this.val().replace(/[^0-9]/g, '').substring(0, 4));
});

// 유효성 검사
function validateSellerForm() {
    let isValid = true;


    // 모든 오류 메시지 초기화
    $('.errorMsg').text('');

    // 1. 아이디 유효성 검사 (필수, 길이, 중복체크)
    const sellerId = $('#sellerId').val();
    if (sellerId === '') {
        $('#sellerIdError').text('아이디는 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (sellerId.length < 5 || sellerId.length > 20) {
        $('#sellerIdError').text('아이디는 5~20자 사이로 입력해주세요.').css('color', 'red');
        isValid = false;
    } else if (!isSellerIdChecked || !isSellerIdAvailable) {
        $('#sellerIdError').text('아이디 중복 체크를 해주세요.').css('color', 'red');
        isValid = false;
    }

    // 2. 비밀번호 유효성 검사 (필수, 길이, 영문자포함)
    const sellerPw = $('#sellerPassword').val();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 영문자, 숫자 포함 8자 이상
    if (sellerPw === '') {
        $('#sellerPwError').text('비밀번호는 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (sellerPw.length < 8) {
        $('#sellerPwError').text('비밀번호는 8자 이상이어야 합니다.').css('color', 'red');
        isValid = false;
    } else if (!(passwordRegex.test(sellerPw))) {
        $('#sellerPwError').text('비밀번호는 영문자와 숫자를 모두 포함해야 합니다.').css('color', 'red');
        isValid = false;
    }

    // 3. 비밀번호 확인 유효성 검사
    const sellerPwConfirm = $('#sellerPasswordConfirm').val();
    if (sellerPwConfirm === '') {
        $('#checkSellerPwError').text('비밀번호를 다시 한 번 입력해주세요.').css('color', 'red');
        isValid = false;
    } else if (sellerPw !== sellerPwConfirm) {
        $('#checkSellerPwError').text('비밀번호가 일치하지 않습니다.').css('color', 'red');
        isValid = false;
    }

    // 4. 사업자명 유효성 검사 (필수, 길이)
    const sellerName = $('#sellerName').val();
    if (sellerName === '') {
        $('#sellerNameError').text('사업자명은 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (sellerName.length > 20) {
        $('#sellerNameError').text('사업자명은 최대 20자까지 가능합니다.').css('color', 'red');
        isValid = false;
    }

    // 5. 전화번호 유효성 검사 (필수)
    const sellerTel1 = $('#tel1').val();
    const sellerTel2 = $('#tel2').val();
    const sellerTel3 = $('#tel3').val();
    if (sellerTel1 === '' || sellerTel2 === '' || sellerTel3 === '') {
        $('#sellerTelError').text('전화번호는 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    }

    // 6. 계좌번호 유효성 검사 (필수)
    const sellerBank = $('#sellerBank').val();
    const sellerAccount = $('#sellerAccount').val();
    if (sellerAccount === '') {
        $('#sellerAccountError').text('계좌번호는 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (!sellerBank) {
        $('#sellerAccountError').text('은행을 선택해주세요.').css('color', 'red');
        isValid = false;
    }

    // 7. 이메일 유효성 검사 (필수, 형식)
    const sellerEmailLocal = $('#sellerEmailLocal').val().trim();
    const sellerEmailDomain = $('#sellerEmailDomain').val().trim();
    const emailRegex = /[^\s@]+\.[^\s@]+$/;
    // /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/gm
    // /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
    // /[^\s@]+\.[^\s@]+$/gm
    if (sellerEmailLocal === '' || sellerEmailDomain === '') {
        $('#sellerEmailError').text('이메일은 필수 입력 항목입니다.').css('color', 'red');
        isValid = false;
    } else if (emailRegex.test(sellerEmailDomain)) {
        $('#sellerEmailError').text('유효한 이메일 형식이 아닙니다.').css('color', 'red');
        isValid = false;
    }

    // 8. 사업자번호 유효성 검사
    const sellerNum = $('#sellerNum').val();
    if (sellerNum === '') {
        $('#sellerNumError').text('사업자번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (sellerNum.length !== 12) {
        $('#sellerNumError').text('사업자번호는 하이픈 (-) 포함하여 12자로 입력해주세요.').css('color', 'red');
    }

    // 9. 주소 유효성 검사
    const sellerPost = $('#seller_sample3_postcode').val();
    const sellerAddress = $('#seller_sample3_address').val();
    const sellerExtraAddress = $('#seller_sample3_extraAddress').val();
    const sellerAddressDetail = $('#seller_sample3_detailAddress').val();
    if (sellerPost === '' || sellerAddress === '') {
        $('#sellerAddressError').text('주소 검색을 통해 주소를 입력해주세요.').css('color', 'red');
        isValid = false;
    }


    // 11. 약관 동의 체크 여부 확인
    if (!($sellerTermsCheckbox.prop('checked'))) {
        $sellerMessageBox.text('이용약관에 동의해주세요.').css('display', 'block');
        return;
    }

    // 최종 유효성검사 통과시
    if (isValid) {
        // 입력된 이메일 합치기
        let sellerEmail = `${sellerEmailLocal}@${sellerEmailDomain}`;


        // 선택된 전화번호 합치기
        const tel1 = $('#tel1').val();
        const tel2 = $('#tel2').val();
        const tel3 = $('#tel3').val();
        const sellerTel = `${tel1}-${tel2}-${tel3}`;

        // 입력된 주소 합치기
        const userAddress = sellerAddress + sellerExtraAddress;

        // 입력된 파라미터 묶음
        const sellerDto = {
            userId: $('#sellerId').val(),
            userPw: $('#sellerPassword').val(),
            userName: $('#sellerName').val(),
            sellerNum: $('#sellerNum').val(),
            userPhone: sellerTel,
            sellerBank: $('#sellerBank').val(),
            sellerAccount: $('#sellerAccount').val(),
            userEmail: sellerEmail,
            sellerDelivery: $('#sellerDelivery').val(),
            userPost: $('#seller_sample3_postcode').val(),
            userAddress: userAddress,
            userAddressDetail: $('#seller_sample3_detailAddress').val(),
            userKind: 'S',
            userStatus: '1',
            userSignupDate: new Date(),
            userRecentDate: new Date()
        };
        console.log('sellerDto', sellerDto);

        // 업로드받는 파일 관련
        const sellerNumFileInput = $('#uploadSellerNum');
        const sellerNumFile = sellerNumFileInput[0].files[0];
        console.log('File:', sellerNumFile);

        const sellerFormData = new FormData();
        sellerFormData.append('file', sellerNumFile);
        sellerFormData.append('sellerDto', new Blob([JSON.stringify(sellerDto)], { type: 'application/json' }));

        console.log("FormData content:");
        for(let pair of sellerFormData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }

        // 엑시오스로 데이터 전송
        axios.post('/signup/sellerJoin', sellerFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log("회원가입 성공: ", response.data);
                $sellerMessageBox.text('회원가입이 완료되었습니다.').css('display', 'block').css('color', 'blue');
                setTimeout(function () {
                    $sellerMessageBox.hide();
                    window.parent.location.href = '/member/login'; // 로그인 페이지로
                }, 3000);
            })
            .catch(function (error) {
                console.log("회원가입 실패:", error);
                if (error.response && error.response.data) {
                    $sellerMessageBox.text(error.response.data).css('display', 'block').css('color', 'red');
                } else {
                    $sellerMessageBox.text('회원가입에 실패했습니다.').css('display', 'block').css('color', 'red');
                }
            });
    } else {
        // 유효성검사 실패시 메시지박스에 표시
        $sellerMessageBox.text('입력 정보를 다시 확인해주세요.').css('display', 'block').css('color', 'red');
    }
    return isValid;
}

// 회원가입 버튼 클릭시 이벤트 제어
$sellerSignupForm.on('submit', function (event) {
    event.preventDefault();
    validateSellerForm();
    $sellerMessageBox.show().removeClass().addClass('message-box');
})

// 이용약관 스크롤링 해야 약관 동의 체크박스 활성화
$sellerTermsBox.on('scroll', function () {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
        $sellerTermsCheckbox.prop('disabled', false);
    }
})

// 입력필드 포커스아웃 이벤트 발생 추가 (실시간으로 유효성 검사)
// 1. 아이디 입력창
$('#sellerId').on('focusout', function () {
    const sellerId = $('#sellerId').val();
    if (sellerId === '') {
        $('#sellerIdError').text('아이디는 필수 입력 항목입니다.').css('color', 'red');
    } else if (sellerId.length < 5 || sellerId.length > 20) {
        $('#sellerIdError').text('아이디는 5~20자 사이로 입력해주세요.').css('color', 'red');
    } else {
        $('#sellerIdError').text('');
    }
});

// 2. 비밀번호 입력창
$('#sellerPassword').on('focusout', function () {
    const sellerPw = $('#sellerPassword').val();
    if (sellerPw === '') {
        $('#sellerPwError').text('비밀번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (sellerPw.length < 8) {
        $('#sellerPwError').text('비밀번호는 8자 이상이어야 합니다.').css('color', 'red');
    } else {
        $('#sellerPwError').text('');
    }
});

// 3. 비밀번호 확인창
$('#sellerPasswordConfirm').on('focusout', function () {
    const sellerPw = $('#sellerPassword').val();
    const sellerPwConfirm = $('#sellerPasswordConfirm').val();
    if (sellerPwConfirm === '') {
        $('#checkSellerPwError').text('비밀번호를 다시 한 번 입력해주세요.').css('color', 'red');
    } else if (sellerPw !== sellerPwConfirm) {
        $('#checkSellerPwError').text('비밀번호가 일치하지 않습니다.').css('color', 'red');
    } else {
        $('#checkSellerPwError').text('');
    }
});

// 4. 이름 입력창
$('#sellerName').on('focusout', function () {
    const sellerName = $('#sellerName').val();
    if (sellerName === '') {
        $('#sellerNameError').text('이름은 필수 입력 항목입니다.').css('color', 'red');
    } else if (sellerName.length > 20) {
        $('#sellerNameError').text('이름은 최대 20자까지 가능합니다.').css('color', 'red');
    } else {
        $('#sellerNameError').text('');
    }
});

// 5. 사업자번호 입력창
$('#sellerNum').on('focusout', function () {
    const sellerNum = $('#sellerNum').val();
    if (sellerNum === '') {
        $('#sellerNumError').text('사업자번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (sellerNum.length !== 12) {
        $('#sellerNumError').text('사업자번호는 하이픈 (-) 포함하여 12자로 입력해주세요.').css('color', 'red');
    } else {
        $('#sellerNumError').text('');
    }
});

// 6. 전화번호 입력창
const $tel = ($('#tel2') || $('#tel3'));
$tel.on('focusout', function () {
    // const tel1Regex = /^\d{2,3}$/;
    const tel2Regex = /^\d{3,4}$/;
    const tel3Regex = /^\d{4}$/;
    // const sellerTel1 = $('#tel1').val();
    const sellerTel2 = $('#tel2').val();
    const sellerTel3 = $('#tel3').val();
    if (sellerTel2 === '' || sellerTel3 === '') {
        $('#sellrTelError').text('전화번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (!tel2Regex.test(sellerTel2)) {
        $('#sellerTelError').text('전화번호 두번째 자리는 3~4자리 숫자로 입력해주세요.').css('color', 'red');
    } else if (!tel3Regex.test(sellerTel3)) {
        $('#sellerTelError').text('전화번호 세번째 자리는 4자리 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#sellerTelError').text('');
    }
});

// 7. 이메일 입력창
$('#sellerEmailLocal').on('focusout', function () {
    const sellerEmailLocal = $('#sellerEmailLocal').val().trim();
    if (sellerEmailLocal === '') {
        $('#sellerEmailError').text('이메일 주소 아이디를 입력해주세요.').css('color', 'red');
    } else {
        $('#sellerEmailError').text('');
    }
})
$('#sellerEmailDomain').on('focusout', function () {
    const sellerEmailDomain = $('#sellerEmailDomain').val().trim();
    const emailRegex = /[^\s@]+\.[^\s@]+$/;
    if (sellerEmailDomain === '') {
        $('#sellerEmailError').text('이메일 주소 도메인을 입력해주세요.').css('color', 'red');
    } else if (!emailRegex.test(sellerEmailDomain)) {
        $('#sellerEmailError').text('유효한 이메일 형식이 아닙니다.').css('color', 'red');
    }else {
        $('#sellerEmailError').text('');
    }
})

// 이메일 도메인 선택시 직접입력창에 value값 입력
const $sellerEmailDomain = $("#sellerEmailDomain");
const $sellerSelectDomain = $("#sellerSelectDomain");
$sellerSelectDomain.on('change', function () {
    if ($sellerSelectDomain.val() === "custom") {
        $sellerEmailDomain.val("");
    } else {
        $sellerEmailDomain.val($sellerSelectDomain.val());
    }
});

// 사업자등록번호 이미지 등록 함수
// $('#uploadSellerNum').on('click', function () {
//
// })