const nav = document.getElementById('scrollspy-nev');
const navLinks = document.querySelectorAll('#scrollspy-nev a');
const sections = document.querySelectorAll('.section');

function getNavHeight(){
    return nav ? nav.offsetHeight : 0;
}

function handleScrollSpy(){
    let currentSectionId = '';
    const navHeight = getNavHeight();
    const scrollPosition = window.scrollY + navHeight + 10; // 네비 높이 + 여유값

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop){
            currentSectionId = section.id;
        }
    });

    // 스크롤이 맨 아래에 도달하면 마지막 섹션을 활성화
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight -2){
        currentSectionId = sections[sections.length - 1].id;
    }
    
    // 모든 메뉴에서 active 제거 후, 현재 섹션 메뉴에 active 추가
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
    });

    // 활성 탭이 가로로 넘칠 때 항상 보이게
    const activeLink = document.querySelector('#scrollspy-nev a.active');
    if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest'})
    }
}

// 메뉴 클릭 시 부드럽게 해당 섹션으로 이동
function handleNavClick(event){
    event.preventDefault();
    const targetId = this.getAttribute('href').replace('#', '');
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return; // 섹션이 없을 때 예외 처리

    const navHeight = getNavHeight();

    // 스크롤 애니메이션
    window.scrollTo({
        top: targetSection.offsetTop - navHeight,
        behavior: 'smooth'
    });
}

// 이벤트 리스너 등록
window.addEventListener('scroll', handleScrollSpy);
navLinks.forEach(link => link.addEventListener('click', handleNavClick));

// 페이지 로드 시 한 번 실행
handleScrollSpy();

// 상/하 스크롤 버튼 기능
document.addEventListener('DOMContentLoaded', function() {
    const upBtn = document.querySelector('.scroll-btn.up');
    const downBtn = document.querySelector('.scroll-btn.down');
    if (upBtn) {
        upBtn.onclick = () => {
            // 모든 브라우저에서 강제로 최상단으로!
            window.scrollTo(0,0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };
    }
    if (downBtn) {
        downBtn.onclick = () => {
            const scrollHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
            document.documentElement.scrollTop = scrollHeight;
            document.body.scrollTop = scrollHeight;
        };
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const detailList = document.getElementById('detail-list');
    const toggleBtn = document.getElementById('detail-toggle-btn');
    let expanded = false;

    toggleBtn.addEventListener('click', function() {
        expanded = !expanded;
        detailList.classList.toggle('collapsed', !expanded);
        toggleBtn.textContent = expanded ? '접기' : '더보기';
    });
});