/* review.js
   - 간단/상세 탭 전환
   - 별점 선택(호버 미리보기 포함)
   - 글자수 카운트(최대 500, 최소 10)
   - 상세 탭 활성 시 혈당 사진 3장 필수 검증
   - 토스트 알림
   - 로컬 JSON 테스트 저장 또는 서버 전송(FormData)
*/


function openReviewModal(item) {
  const modal = document.getElementById("reviewModal");
  modal.hidden = false; // 보이게 만들기
  console.log("모달 열림");
  
  document.getElementById("reviewItemImg").src = item.image;
  document.getElementById("reviewItemName").textContent = item.name;
  document.getElementById("reviewItemPrice").textContent =
  `₩${item.price.toLocaleString()} x ${item.quantity}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reviewModal");
  const modalContent = document.querySelector(".review-content");
  
  if (!modal || !modalContent) {
    console.error("모달 요소를 찾을 수 없습니다.");
    return;
  }
  
  // 닫기 버튼
  document.querySelectorAll(".modal-close, .btn-cancel").forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("닫기 버튼 눌림"); // 디버깅용
      modal.hidden = true;
    });
  });
  
  // 배경 클릭 시 닫기
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      console.log("배경 클릭됨"); // 디버깅용
      modal.hidden = true;
    }
  }, true);
  
  // 내부 클릭 무시
  modalContent.addEventListener("click", e => {
    e.stopPropagation();
  });
  
  // 리뷰 글자수 카운트
  const reviewText = document.getElementById("reviewText");
  const charCount = document.getElementById("charCount");
  if (reviewText && charCount) {
    reviewText.addEventListener("input", e => {
      charCount.textContent = e.target.value.length;
    });
  }
});

// 리뷰 별점 
document.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", () => {
    const value = parseInt(star.dataset.value);
    document.querySelectorAll(".star").forEach(s => {
      s.textContent = s.dataset.value <= value ? "★" : "☆";
      s.classList.toggle("active", s.dataset.value <= value);
    });
  });
});

// 탭 버튼과 콘텐츠 불러오기
const tabBtns = document.querySelectorAll(".review-tabs .tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    tabContents.forEach(c => c.classList.remove("active"));
    const target = btn.dataset.tab; 
    document.getElementById(target).classList.add("active");
  });
});

// 등록 버튼 이벤트
document.querySelector(".btn-submit").addEventListener("click", async () => {
  const rating = document.querySelectorAll(".star.active").length;
  const reviewText = document.getElementById("reviewText").value.trim();
  
  if (rating === 0) {
    showToast("별점을 선택해주세요.", "error");
    return;
  }
  if (reviewText.length < 10) {
    showToast("리뷰는 최소 10자 이상 작성해주세요.", "error");
    return;
  }
  
  const payload = {
    userUID: 1,
    userNickname: "테스트유저",
    rating: rating,
    review: reviewText
  };
  
  try {
    // 실제 서버 대신 mock JSON 호출
    const res = await fetch("./mock/success.json");
    const data = await res.json();
    
    if (data.success) {
      showToast(`${data.message} 적립된 포인트 : ${data.point}p`, "success");
      document.getElementById("reviewModal").hidden = true;
    } else {
      showToast("등록에 실패했습니다.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("서버 오류가 발생했습니다.", "error");
  }
});

// 토스트 함수
function showToast(message, type="success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  
  toastMsg.textContent = message;
  
  if(type === "success") {
    toastIcon.textContent = "✔";
    toast.classList.add("success");
    toast.classList.remove("error");
  } else {
    toastIcon.textContent = "⚠";
    toast.classList.add("error");
    toast.classList.remove("success");
  }
  
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// 열 때
modal.hidden = false;
document.body.classList.add('modal-open');

// 닫을 때
modal.hidden = true;
document.body.classList.remove('modal-open');