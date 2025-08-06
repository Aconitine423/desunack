// joins.js
window.addEventListener('DOMContentLoaded', () => {
  // ─ 요소 가져오기 ─
  const memberCard   = document.getElementById('memberCard');             // 일반회원 카드
  const sellerCard   = document.getElementById('sellerCard');             // 판매자용 카드
  const modalOverlay = document.getElementById('modalOverlay');           // 모달 오버레이
  const modalBox     = modalOverlay.querySelector('.modal-box');          // 모달 박스
  const normalForm   = modalBox.querySelector('.signup-form:not(.seller-signup)'); // 일반회원 폼
  const sellerForm   = modalBox.querySelector('.signup-form.seller-signup');      // 판매자 폼
  const modalClose   = modalBox.querySelector('.modal-close');           // 닫기 버튼

  // ─ 모달 열기 함수 ─
  function openModal(isSeller) {
    if (isSeller) {
      normalForm.style.display = 'none';   // 일반 폼 숨기기
      sellerForm.style.display = 'block';  // 판매자 폼 보이기
    } else {
      sellerForm.style.display = 'none';   // 판매자 폼 숨기기
      normalForm.style.display = 'block';  // 일반 폼 보이기
    }
    modalOverlay.classList.add('active');  // 오버레이 보이기
  }

  // ─ 모달 닫기 함수 ─
  function closeModal() {
    modalOverlay.classList.remove('active'); // 오버레이 숨기기
    normalForm.style.display = 'none';       // 모든 폼 숨기기
    sellerForm.style.display = 'none';
  }

  // ─ 카드 클릭으로 모달 열기 ─
  memberCard.addEventListener('click', () => openModal(false)); // 일반회원
  sellerCard.addEventListener('click', () => openModal(true));  // 판매자용

  // ─ 닫기 버튼 및 배경 클릭으로 모달 닫기 ─
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ─ 기존 전화번호 3분할 합치기 로직 유지 ─
  const p1 = sellerForm.querySelector('#sellerphone1');
  const p2 = sellerForm.querySelector('#sellerphone2');
  const p3 = sellerForm.querySelector('#sellerphone3');
  const hiddenPhone = sellerForm.querySelector('#sellerPhone');
  [p1, p2, p3].forEach(input => {
    input.addEventListener('input', () => {
      hiddenPhone.value = [p1.value, p2.value, p3.value]
        .filter(v => v)
        .join('-');
    });
  });

  // ─ 기존 이메일 분리형 합치기 로직 유지 ─
  const emailLocal  = sellerForm.querySelector('#selleremailLocal');
  const emailSelect = sellerForm.querySelector('#sellerEmailDomainSelect');
  const emailCustom = sellerForm.querySelector('#sellerEmailCustom');
  const emailHidden = sellerForm.querySelector('#sellerEmailHidden');

  function updateEmail() {
    const local = emailLocal.value.trim();
    let domain = emailSelect.value;

    if (domain === 'custom') {
      emailCustom.style.display = 'inline-block';
      domain = emailCustom.value.trim();
    } else {
      emailCustom.style.display = 'none';
      emailCustom.value = '';
    }

    emailHidden.value = local && domain
      ? `${local}@${domain}`
      : '';
  }

  [emailLocal, emailSelect, emailCustom].forEach(el => {
    el.addEventListener('input', updateEmail);
  });
});
