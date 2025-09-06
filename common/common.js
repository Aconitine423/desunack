
// 한글: data-include 조각을 fetch로 주입하고, 완료 후 사이드바 초기화
(async function initIncludes(){
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  if (!slots.length) return;

  await Promise.all(slots.map(async el => {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(url + ' ' + res.status);
      el.innerHTML = await res.text();
      el.dispatchEvent(new Event('include:ready'));
    } catch (e) {
      console.error('include 실패:', e);
      el.innerHTML = '<!-- include 실패: ' + url + ' -->';
      el.dispatchEvent(new Event('include:ready'));
    }
  }));

  // 한글: 사이드바가 주입된 뒤 초기화
  if (typeof window.initSidebar === 'function') window.initSidebar();
})();

// 선택: 사이드 오픈/닫기 토글(있으면 유지)
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btnMenuToggle') || document.querySelector('.menu-toggle');
  const side = document.getElementById('site-side') || document.querySelector('.site-side');
  const sideClose = document.getElementById('btnSideClose') || side && side.querySelector('.side-close');
  if (!btn || !side) return;

  function openSide() {
    side.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('side-open');
    document.body.classList.add('side-open');
    btn.setAttribute('aria-expanded', 'true');
    const first = side.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (first) first.focus();
  }
  function closeSide() {
    side.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('side-open');
    document.body.classList.remove('side-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  btn.addEventListener('click', () => {
    if (side.getAttribute('aria-hidden') === 'false') closeSide();
    else openSide();
  });
  if (sideClose) sideClose.addEventListener('click', closeSide);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && side.getAttribute('aria-hidden') === 'false') closeSide();
  });
});

// 한글: 사이드바 아코디언 토글(이벤트 위임, include 후에도 항상 동작)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#mp-sidebar .group-toggle');
  if (!btn) return;

  e.preventDefault();
  const sub = btn.nextElementSibling;              // ul.sublist
  if (!sub) return;

  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  sub.setAttribute('aria-hidden', String(open));
  sub.removeAttribute('hidden');                   // hidden 플래그 방지
});
