document.addEventListener('DOMContentLoaded',() => {
//탭 전환
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.login-form');

tabs.forEach(tab => {
    tab.addEventListener('click', ()=>{
        // 1 탭 active 토근
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 2 폼 active 토근
        const targetId = tab.dataset.target;
        forms.forEach(f => {
            if (f.id === targetId ) f.classList.add('active');
            else                 f.classList.remove('active');
        });
    });
});  

// 입력창 focus/blur 시 테두리 강조
document.querySelectorAll('.login-form input').forEach(input =>{
    input.addEventListener('focus',() => input.classList.add('focused'));
    input.addEventListener('blur', () => input.classList.remove('focused'));
});

// submit 직전 공백(앞뒤) 제거
forms.forEach(form => {
    form.addEventListener('submit', e =>{
        const uid = form.querySelector('input[name="userId"]');
        const pwd = form.querySelector('input[name="password"]');
        if (uid) uid.value = uid.value.trim();
        if (pwd) pwd.value = pwd.value.trim();
    });
});

//로그인 실패 시 url 파라미터(error=login)에 따라 alert
const params = new URLSearchParams(window.location.search);
if (params.get('error') === 'login'){
    alert('로그인에 실패했습니다.');
}
});