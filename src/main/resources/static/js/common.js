// common/common.js — data-include 처리 + 최소 공통 유틸
(async function initIncludes(){
  const includes = Array.from(document.querySelectorAll('[data-include]'));
  if (!includes.length) return;
  await Promise.all(includes.map(async el => {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('include fail: ' + res.status);
      const text = await res.text();
      const tmp = document.createElement('div');
      tmp.innerHTML = text;

      // 분리된 <script> 수집
      const scripts = Array.from(tmp.querySelectorAll('script'));
      scripts.forEach(s => s.parentNode && s.parentNode.removeChild(s));
      el.innerHTML = tmp.innerHTML;

      // 스크립트 실행 (inline / external)
      for (const s of scripts) {
        const ns = document.createElement('script');
        if (s.src) ns.src = s.src;
        else ns.textContent = s.textContent;
        if (s.type) ns.type = s.type;
        el.appendChild(ns);
      }
      el.dispatchEvent(new Event('include:ready'));
    } catch (err) {
      console.warn('include error', err);
      el.innerHTML = '<!-- include fail -->';
      el.dispatchEvent(new Event('include:ready'));
    }
  }));
})();
// 사이드 토글 안정화 코드 — 파일: /common/header.js (또는 common.js)
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
    // 포커스 관리: 사이드의 첫 번째 포커스 가능한 요소
    const first = side.querySelector('a, button, input');
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

  // ESC로 닫기(접근성)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && side.getAttribute('aria-hidden') === 'false') {
      closeSide();
    }
  });
});
