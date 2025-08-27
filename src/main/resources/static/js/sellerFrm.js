const $sellerSignupForm = $('#sellerSignupForm');
const $sellerMessageBox = $('#sellerMessageBox');

// 중복 체크 여부 상태를 저장할 변수 (기본값: false)
let isSellerIdChecked = false; // 중복 체크 여부
let isSellerIdAvailable = false; // 중복 체크 여부 상태 저장

// 아이디 중복체크
function checkSellerId() {
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
        })
}

// 전화번호 입력 필드에 숫자만 입력 가능하도록
$('#tel2, #tel3').on('input', function () {
    const $this = $(this);
    // 숫자 이외의 문자 제거
    $this.val($this.val().replace(/[^0-9]/g, '').substring(0, 4));
});

// 유효성 검사
function validateForm() {
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
        const sellerEmailLocal = $('#sellerEmailLocal').val();
        const sellerEmailDomain = $('#sellerEmailDomain').val();
        const emailRegex = /[^\s@]+\.[^\s@]+$/;
        if (sellerEmailLocal === '' || sellerEmailDomain === '') {
            $('#sellerEmailError').text('이메일은 필수 입력 항목입니다.').css('color', 'red');
            isValid = false;
        } else if (emailRegex.test(sellerEmailDomain)) {
            $('#sellerEmailError').text('유효한 이메일 형식이 아닙니다.').css('color', 'red');
            isValid = false;
        }

        // 8. 택배사 유효성 검사 (선택여부)
        // const userBirthYear = $('#birthYear').val();
        // const userBirthMonth = $('#birthMonth').val();
        // const userBirthDay = $('#birthDay').val();
        // if (!userBirthYear || !userBirthMonth || !userBirthDay) {
        //     $('#birthError').text('생년월일을 모두 선택해주세요.').css('color', 'red');
        //     isValid = false;
        // }

        // 10. 주소 유효성 검사
        const sellerPost = $('#seller_sample3_postcode').val();
        const sellerAddress = $('#seller_sample3_address').val();
        const sellerExtraAddress = $('#seller_sample3_extraAddress').val();
        const sellerAddressDetail = $('#seller_sample3_detailAddress').val();
        if (sellerPost === '' || sellerAddress === '') {
            $('#sellerAddressError').text('주소 검색을 통해 주소를 입력해주세요.').css('color', 'red');
            isValid = false;
        }

        // 이용약관 스크롤링 해야 약관 동의 체크박스 활성화
        const $sellerTermsBox = $('#sellerJoinTermsBox');
        const $sellerTermsCheckbox = $('#sellerJoinTermsCheckBox');
        $sellerTermsBox.on('scroll', function () {
            if (this.scrollHeight - this.scrollTop === this.clientHeight) {
                $sellerTermsCheckbox.prop('disabled', false);
            }
        })

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
            const userPhone = `${phone1}-${phone2}-${phone3}`;

            // 입력된 주소 합치기
            const userAddress = userAddress + userExtraAddress;

            // 입력된 파라미터 묶음
            const formData = {
                userId: $('#userId').val(),
                userPw: $('#userPassword').val(),
                userName: $('#userName').val(),
                customerNickname: $('#userNickname').val(),
                customerGender: $('input[name="userGender"]:checked').val(),
                customerBDay: userBirth,
                userPhone: userPhone,
                userEmail: userEmail,
                userPost: $('#sample3_postcode').val(),
                userAddress: userAddress,
                userAddressDetail: $('#sample3_detailAddress').val(),
                userKind: 'C',
                userStatus: '1',
                userSignupDate: new Date(),
                userRecentDate: new Date()
            };

            console.log('formData', formData);

            // 엑시오스로 데이터 전송
            axios.post('/signup/customerJoin', formData)
                .then(function (response) {
                    console.log("회원가입 성공: ", response.data);
                    $messageBox.text('회원가입이 완료되었습니다.').css('display', 'block').css('color', 'blue');
                    setTimeout(function () {
                        $messageBox.hide();
                        window.location.href = '/member/login'; // 로그인 페이지로
                    }, 3000);
                })
                .catch(function (error) {
                    console.log("회원가입 실패:", error);
                    if (error.response && error.response.data) {
                        $messageBox.text(error.response.data).css('display', 'block').css('color', 'red');
                    } else {
                        $messageBox.text('회원가입에 실패했습니다.').css('display', 'block').css('color', 'red');
                    }
                });
        } else {
            // 유효성검사 실패시 메시지박스에 표시
            $messageBox.text('입력 정보를 다시 확인해주세요.').css('display', 'block').css('color', 'red');
        }
        return isValid;
}

// 회원가입 버튼 클릭시 이벤트 제어
$signupForm.on('submit', function (event) {
    event.preventDefault();
    validateForm();
    $messageBox.show().removeClass().addClass('message-box');
})

// 입력필드 포커스아웃 이벤트 발생 추가 (실시간으로 유효성 검사)
// 1. 아이디 입력창
$('#userId').on('focusout', function () {
    const userId = $('#userId').val();
    if (userId === '') {
        $('#idError').text('아이디는 필수 입력 항목입니다.').css('color', 'red');
    } else if (userId.length < 5 || userId.length > 20) {
        $('#idError').text('아이디는 5~20자 사이로 입력해주세요.').css('color', 'red');
    } else {
        $('#idError').text('');
    }
});

// 2. 비밀번호 입력창
$('#userPassword').on('focusout', function () {
    const userPw = $('#userPassword').val();
    if (userPw === '') {
        $('#pwError').text('비밀번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (userPw.length < 8) {
        $('#pwError').text('비밀번호는 8자 이상이어야 합니다.').css('color', 'red');
    } else {
        $('#pwError').text('');
    }
});

// 3. 비밀번호 확인창
$('#passwordConfirm').on('focusout', function () {
    const userPw = $('#userPassword').val();
    const userPwConfirm = $('#userPasswordConfirm').val();
    if (userPwConfirm === '') {
        $('#checkPwError').text('비밀번호를 다시 한 번 입력해주세요.').css('color', 'red');
    } else if (userPw !== userPwConfirm) {
        $('#checkPwError').text('비밀번호가 일치하지 않습니다.').css('color', 'red');
    } else {
        $('#checkPwError').text('');
    }
});

// 4. 이름 입력창
$('#userName').on('focusout', function () {
    const userName = $('#userName').val();
    if (userName === '') {
        $('#nameError').text('이름은 필수 입력 항목입니다.').css('color', 'red');
    } else if (userName.length > 20) {
        $('#nameError').text('이름은 최대 20자까지 가능합니다.').css('color', 'red');
    } else {
        $('#nameError').text('');
    }
});

// 5. 계좌번호 입력창
$('#userNickname').on('focusout', function () {
    const userNickname = $('#userNickname').val();
    if (userNickname === '') {
        $('#nicknameError').text('닉네임은 필수 입력 항목입니다.').css('color', 'red');
    } else if (userNickname.length < 20) {
        $('#nicknameError').text('닉네임은 최대 20자까지 가능합니다.').css('color', 'red');
    } else {
        $('#nicknameError').text('');
    }
});

// 6. 전화번호 입력창
$('#phone2').on('focusout', function () {
    const userPhone2 = $('#phone2').val();
    if (userPhone2 === '') {
        $('#phoneError').text('휴대폰 번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (typeof userPhone2 !== 'number') {
        $('#phoneError').text('휴대폰 번호는 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#phoneError').text('');
    }
});
$('#phone3').on('focusout', function () {
    const userPhone3 = $('#phone3').val();
    if (userPhone3 === '') {
        $('#phoneError').text('휴대폰 번호는 필수 입력 항목입니다.').css('color', 'red');
    } else if (typeof userPhone3 !== 'number') {
        $('#phoneError').text('휴대폰 번호는 숫자로 입력해주세요.').css('color', 'red');
    } else {
        $('#phoneError').text('');
    }
})

// 7. 이메일 입력창
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
    if (userEmailDomain === '') {
        $('#emailError').text('이메일 주소 도메인을 입력해주세요.').css('color', 'red');
    } else {
        $('#emailError').text('');
    }
})

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