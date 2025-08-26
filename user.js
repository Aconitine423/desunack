document.addEventListener("DOMContentLoaded",() => {
    fetch("/api/user") // 서버에서 세션 기반으로 닉네임 내려주는 API
    .then(res => res.json())
    .then(data => {
        if (data.nickname){
            document.getElementById("welcome").textContent = data.nickname + " 님";
        } else {
            document.getElementById("welcome").textContent = "로그인 필요";
        }
    });
});