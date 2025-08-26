// 전역 변수에 서버에서 받은 난수 보관
let randCodeId = 0;
let randCodePw = 0;

// 탭 전환
document.getElementById('tab-find-id').addEventListener('click', () => toggleTab('id'));
document.getElementById('tab-find-pw').addEventListener('click', () => toggleTab('pw'));
function toggleTab(mode) {
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    if (mode === 'id') {
        document.getElementById('tab-find-id').classList.add('active');
        document.getElementById('form-find-id').classList.add('active');
    } else {
        document.getElementById('tab-find-pw').classList.add('active');
        document.getElementById('form-find-pw').classList.add('active');
    }
}

// 인증번호 받기 (랜덤 코드 생성 예시)
document.getElementById('btn-randcode-id').addEventListener('click',() => {
    randCodeId = Math.floor(100000 + Math.random() * 900000); // 예: 6자리
    document.getElementById('result-id').textContent = `발급된 인증번호: $(randCodeId)`;
});
document.getElementById('btn-randcode-pw').addEventListener('click',() => {
    randCodePw = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('result-pw').textContent = `발급된 인증번호: $(randCodePw)`;
});

// 인증 확인 및 서버 전송

//아이디 
document.getElementById('btn-verify-id').addEventListener('click', () => {
    const params = {
        userName: decument.getElementById('userName').value,
        userEmail: decument.getElementById('userEmail').value,
        authCode: parseInt(document.getElementById('authCodeId').value,10),
        randCode: randCodeId
    };
    sendRequest('/api/find-id', params)
    .then(res => document.getElementById('result-id').textContent = `결과: ${res}`)
    .catch(err => document.getElementById('result-id').textContent = `에러: ${err}`);
});

//비밀번호 

document.getElementById('btn-verify-pw').addEventListener('click',() => { 
    const params = {
        userId:    decument.getElementById('userId').value,
        userEmail: decument.getElementById('userEmailPw').value,
        authCode:  parseInt(document.getElementById('authCodePw').value,10),
        randCode:  randCodePw
    };
    sendRequest('/api/find-password', params)
    .then(res => document.getElementById('result-pw').textContent = `결과: ${res}`)
    .catch(err => document.getElementById('result-pw').textContent = `에러: ${err}`);
});

// 공통 fetch 함수 
async function sendRequest(url, body) {
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body:    JSON.stringify(body)
    });
    if (!resp.ok) throw new Error(resp.statysText);
    return await resp.text(); // JSON이면 resp.json() 사용
}