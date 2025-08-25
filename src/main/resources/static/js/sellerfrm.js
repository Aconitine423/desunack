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

// 이용약관 스크롤링 해야 약관 동의 체크박스 활성화
const $termsBox = $('#joinTermsBox');
const $termsCheckbox = $('#joinTermsCheckBox');
$termsBox.on('scroll', function () {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
        $termsCheckbox.prop('disabled', false);
    }
})

// 회원가입 버튼 클릭시 요소들 유효성 검사
const $signupForm = $('#signupForm');
const $messageBox = $('#messageBox');
$signupForm.on('submit', function (event) {
    event.preventDefault();
    $messageBox.show().removeClass().addClass('message-box');

    // 약관동의 체크 여부 확인
    if (!($termsCheckbox.prop('checked'))) {
        $messageBox.text('이용약관에 동의해주세요.').css('display', 'block');
        return;
    }

    // 입력된 이메일 합치기
    const emailLocal = $('#emailLocal').val();
    const emailDomain = $emailDomain.val();
    let userEmail;

    if ($selectDomain.val() === "custom") {
        const customDomain = $emailDomain.val();
        if (customDomain) {
            userEmail = `${emailLocal}@${customDomain}`;
        } else {
            $messageBox.text('직접입력 도메인을 입력해주세요.').css('display', 'block');
            return;
        }
    } else {
        userEmail = `${emailLocal}@${emailDomain}`;
    }

    // 선택된 전화번호 합치기
    const phone1 = $('#phone1').val();
    const phone2 = $('#phone2').val();
    const phone3 = $('#phone3').val();
    const userPhone = `${phone1}-${phone2}-${phone3}`;

    // 입력된 주소 합치기
    const address1 = $('#sample3_address').val();
    const address2 = $('#sample3_extraAddress').val();
    const userAddress = address1 + address2;

    // 입력된 파라미터 묶음
    const formData = {
        userId: $('#userId').val(),
        userPw: $('#userPassword').val(),
        userName: $('#userName').val(),
        // customerNickname: $('#userNickname').val(),
        // customerGender: $('input[name="userGender"]:checked').val(),
        // customerBDay: userBirth,
        userPhone: userPhone,
        userEmail: userEmail,
        userPost: $('#sample3_postcode').val(),
        userAddress: userAddress,
        userAddressDetail: $('#sample3_detailAddress').val(),
        userKind: 'S',
        userStatus: '1',
        userSignupDate: new Date(),
        // userRecentDate: new Date()
    };

    console.log('formData', formData);

    // 엑시오스로 데이터 전송
    axios.post('/signup/customerJoin', formData)
        .then(function (response) {
            console.log("회원가입 성공:", response.data);
            $messageBox.text(response.data).css('display', 'block').css('color', 'blue');
            setTimeout(function() {
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
})