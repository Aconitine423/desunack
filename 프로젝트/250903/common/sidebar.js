// common/sidebar.js
// 한글 주석: 이 파일은 '부모 페이지'에서 불러옵니다.
(function(){
  // 한글: include로 sidebar.html이 주입된 '뒤에' 호출할 초기화 함수
  function initSidebar(){
    const root = document.getElementById('mp-sidebar');
    if (!root) return;

    // 1) 역할 필터링(member/seller)
    const role = document.body.dataset.userRole || 'member'; // 기본 member
    root.querySelectorAll('.mp-section').forEach(sec=>{
      sec.hidden = (sec.dataset.role !== role);
    });

    // 2) 아코디언 토글
    root.querySelectorAll('.has-children > .group-toggle').forEach(btn=>{
      const sub = btn.nextElementSibling; // ul.sublist
      if (!sub) return;
      const closed = sub.getAttribute('aria-hidden') !== 'false';
      sub.hidden = closed;
      btn.addEventListener('click', ()=>{
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        sub.hidden = open;
        sub.setAttribute('aria-hidden', String(open));
      });
    });

    // 3) 활성 링크 표시(가장 긴 경로 우선)
    const here = location.pathname.replace(/\/index\.html?$/,'/').toLowerCase();
    const pairs = Array.from(root.querySelectorAll('a[href]')).map(a=>{
      const href = new URL(a.getAttribute('href'), location.origin)
        .pathname.replace(/\/index\.html?$/,'/').toLowerCase();
      return [a, href];
    }).sort((a,b)=> b[1].length - a[1].length);

    for (const [a, href] of pairs){
      if (href === here || (href !== '/' && here.startsWith(href))){
        a.classList.add('is-active');
        const sub = a.closest('.sublist');
        if (sub){
          sub.hidden = false;
          sub.setAttribute('aria-hidden','false');
          sub.previousElementSibling?.setAttribute('aria-expanded','true');
        }
        break;
      }
    }
  }

  // 전역 노출: include 스크립트가 호출할 수 있게 함
  window.initSidebar = initSidebar;
})();
// 한글 주석: 동적 include여도 동작하도록 위임 처리
document.addEventListener('DOMContentLoaded', () => {
  const side = document.getElementById('site-side');
  if (!side) return;

  // 그룹 열고 닫기
  side.addEventListener('click', (e) => {
    const btn = e.target.closest('.group-toggle');
    if (!btn) return;
    const group = btn.closest('.has-children');
    const list  = group?.querySelector('.sublist');
    if (!list) return;

    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    list.setAttribute('aria-hidden', String(expanded));
  });

  // 현재 경로에 해당하는 하위 링크가 있으면 자동으로 펼침 + 강조
  const path = location.pathname.replace(/\/index\.html?$/,'');
  const active =
    side.querySelector(`a[href="${path}"]`) ||
    side.querySelector(`a[href="${path}/"]`);
  if (active) {
    active.classList.add('is-active');
    const group = active.closest('.has-children');
    const btn = group?.querySelector('.group-toggle');
    const list = group?.querySelector('.sublist');
    if (btn && list) {
      btn.setAttribute('aria-expanded','true');
      list.setAttribute('aria-hidden','false');
    }
  }
});
