// sidebar-behavior.js
// - sidebar-loader.js로 삽입된 HTML, 혹은 서버 include된 sidebar.html에 대해
//   active 클래스/아코디언 토글을 보장합니다.
// - index.html 바디 끝에 로드 (defer).

(function(){
  // 안전하게 실행: DOM 준비 후
  function init(){
    const container = document.getElementById('site-side') || document.getElementById('mp-sidebar');
    if(!container) return;

    // 1) 토글 버튼이 있는 경우 처리 (기존 markup에 맞춰 .group-toggle 사용)
    container.querySelectorAll('.has-children .group-toggle').forEach(btn=>{
      btn.setAttribute('aria-expanded', btn.closest('li').classList.contains('active') ? 'true' : 'false');
      btn.addEventListener('click', ()=> {
        const li = btn.closest('li');
        const sub = li.querySelector('.sublist');
        if(!sub) return;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        sub.setAttribute('aria-hidden', String(expanded));
        li.classList.toggle('active', !expanded);
      });
    });

    // 2) 링크 활성화 (경로 매칭: 가장 긴 href 우선)
    try {
      const path = location.pathname.replace(/\/+$/,'') || '/';
      const links = Array.from(container.querySelectorAll('a'));
      links.sort((a,b)=> (b.getAttribute('href')||'').length - (a.getAttribute('href')||'').length);
      for(const a of links){
        const href = (a.getAttribute('href')||'').replace(/\/+$/,'') || '/';
        if(href !== '/' && path.startsWith(href)){
          a.classList.add('is-active'); a.closest('li')?.classList.add('active');
          // 열린 submenu가 있으면 펼치기
          const parent = a.closest('.sublist');
          if(parent){ parent.setAttribute('aria-hidden','false'); parent.parentElement.classList.add('active'); parent.parentElement.querySelector('.group-toggle')?.setAttribute('aria-expanded','true'); }
          break;
        } else if(href === '/' && path === '/'){
          a.classList.add('is-active'); a.closest('li')?.classList.add('active'); break;
        }
      }
    } catch(e){ console.warn('sidebar active logic fail', e); }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // 현재 페이지 경로와 매칭되는 링크 찾기
  document.querySelectorAll(".sidebar .menu-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href && path.includes(href)) {
      link.classList.add("active");
      const parent = link.closest(".menu-item.has-sub");
      if (parent) parent.classList.add("open");
    }
  });

  // 아코디언 토글
  document.querySelectorAll(".menu-item.has-sub > a").forEach(menu => {
    menu.addEventListener("click", e => {
      e.preventDefault();
      const parent = menu.parentElement;
      parent.classList.toggle("open");
    });
  });
});