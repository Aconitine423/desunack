// 임시로 생성된 인증번호를 저장할 변수
let generatedAuthCodeId = '';
let generatedAuthCodePw = '';

// 탭 전환 로직
$('.tab').on('click', function () {
    // 모든 탭과 폼에서 'active' 클래스 제거
    $('.tab').removeClass('active');
    $('.form').removeClass('active');
    // 클릭된 탭에 'active' 클래스 추가
    $(this).addClass('active');

    // 해당 탭의 데이터 속성(data-target)을 가져와서 폼에 'active' 클래스 추가
    const targetFormId = $(this).data('target');
    $('#' + targetFormId).addClass('active');

    // 결과 및 입력창 초기화
    $('#result-id').text('');
    $('#authCodeId').val('');
    $('#result-pw').text('');
    $('#authCodePw').val('');
});

// 인증번호 생성 함수 (4자리 난수)
function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

// 아이디 찾기 - 인증번호 받기 버튼 클릭 이벤트
$('#btn-randCode-id').on('click', function () {
    const userName = $('#userName').val();
    const userEmail = $('#userEmail').val();

    if (userName === '' || userEmail === '') {
        alert('이름과 이메일을 모두 입력해주세요.');
        return;
    }

    // 인증번호 생성 및 저장
    generatedAuthCodeId = generateRandomCode();

    // 사용자에게 인증번호를 입력하도록 안내
    alert(`인증번호를 전송했습니다. 이메일로 받은 4자리 숫자를 입력해주세요. (테스트용: ${generatedAuthCodeId})`);

    $('#result-id').text('인증번호가 발송되었습니다.').css('color', '#007bff');
});

// 아이디 찾기 - 인증 확인 버튼 클릭 이벤트
$('#btn-verify-id').on('click', function () {
    const name = $('#userName').val();
    const email = $('#userEmail').val();
    const $authCodeIdInput = $('#authCodeId').val();

    if ($authCodeIdInput === '') {
        alert('인증번호를 입력해주세요.');
        return;
    }
    // 입력된 인증번호와 생성된 인증번호 비교
    if (parseInt($authCodeIdInput) === generatedAuthCodeId) {
        // 성공 시, 서버에서 아이디를 가져와서 표시하는 로직
        axios.post('/find/id', {userName: name, userEmail: email})
            .then(res => {
                const result = res.data;
                if (result) {
                    $('#result-id').text(`인증에 성공했습니다. 회원님의 아이디는 ${result.data} 입니다.`).css('color', 'green');
                    generatedAuthCodeId = ''; // 인증 완료 후 초기화
                } else {
                    $('#result-id').text(result.msg);
                }
            })
            .catch(err => {
                //서버통신 오류
                alert('서버 통신중 오류가 발생했습니다.');
                console.log(err);
            })
    } else {
        $('#result-id').text('인증번호가 일치하지 않습니다.').css('color', 'red');
    }
});

// 비밀번호 찾기 - 인증번호 받기 버튼 클릭 이벤트
$('#btn-randCode-pw').on('click', function () {
    const userId = $('#userId').val();
    const userEmailPw = $('#userEmailPw').val();

    if (userId === '' || userEmailPw === '') {
        alert('아이디와 이메일을 모두 입력해주세요.');
        return;
    }

    // 인증번호 생성 및 저장
    generatedAuthCodePw = generateRandomCode();
    alert(`인증번호를 전송했습니다. 이메일로 받은 4자리 숫자를 입력해주세요. (테스트용: ${generatedAuthCodePw})`);

    $('#result-pw').text('인증번호가 발송되었습니다.').css('color', '#007bff');
});

// 비밀번호 찾기 - 인증 확인 버튼 클릭 이벤트
$('#btn-verify-pw').on('click', function () {
    const id = $('#userId').val();
    const email = $('#userEmailPw').val();
    const authCodePwInput = $('#authCodePw').val();

    if (authCodePwInput === '') {
        alert('인증번호를 입력해주세요.');
        return;
    }

    // 입력된 인증번호와 생성된 인증번호 비교
    if (parseInt(authCodePwInput) === generatedAuthCodePw) {
        // 성공 시, 서버에서 임시 비밀번호를 생성하는 로직
        axios.post('/find/pw', {userId: id, userEmail: email})
        .then(res => {
            const result = res.data;
            if (result) {
                $('#result-pw').text(`인증에 성공했습니다. 입력하신 이메일로 임시 비밀번호가 발송되었습니다. 테스트용 임시비밀번호: ${result.data}`).css('color', 'green');
                generatedAuthCodePw = ''; // 인증 완료 후 초기화
            } else {
                $('#result-pw').text(result.msg);
            }
        })
            .catch(err => {
                alert('서버 통신중 오류가 발생했습니다.');
                console.log(err);
            })
    } else {
        $('#result-pw').text('인증번호가 일치하지 않습니다.').css('color', 'red');
    }
});