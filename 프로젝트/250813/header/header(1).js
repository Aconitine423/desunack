(function(){
    document.addEventListener('DOMContentLoaded', function () {
        // 1) 대분류 / 소분류 번호 매핑 테이블-
        const MAIN_MAP = {
            headerDrink: 1, //음료
            headerSnack: 2 // 스낵
        };

        const SUB_MAP = {
            headerDrink: {
                headerSoda: 1, // 탄산
                headerNonSoda: 2, //비탄산
                headerPowder: 3 // 분말
            },
            
            headerSnack: {
                headerCookie: 4, // 과자
                headerCandy: 5, // 사탕류
                headerChocolate: 6, // 초콜릿
                headerIcecream: 7, // 아이스크림
                headerBread: 8 // 빵
            }
        };

        const ALLERGY_MAP = {
            peanut: 1,
            nuts: 2, 
            soybean: 3,
            wheat: 4,
            egg: 5,
            milk: 6,
            fish: 7,
            shellfish: 8
        };

        const SWEETENER_MAP = {
            sucralose: 1,
            stevia: 2,
            allulose: 3,
            maltitol: 4,
            sorbitol: 5,
            erythritol: 6,
            xylitol: 7,
            saccharin: 8,
            aspartame: 9,
            "acesulfame-potassium": 10
        };

        // 2 현재 선택된 카테고리 저장용 변수-
        let selectedMain = null; // 대분류
        let selectedSub = null; // 소분류

        // 3 헤더 메뉴 클릭 처리 (대분류, 소분류 선택)-
        document.querySelectorAll('[data-main]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                const mainKey = el.getAttribute('data-main');
                const subKey = el.getAttribute('data-sub');

                // 대분류 설정
                selectedMain = MAIN_MAP[mainKey] || null;

                // 소분류 설정
                if (subKey && SUB_MAP[mainKey] && SUB_MAP[mainKey] [subKey]) {
                    selectedSub = SUB_MAP[mainKey] [subKey];
                } else {
                    selectedSub = null;
                }

                console.log('[선택됨]',{ mainKey, subKey, selectedMain, selectedSub });
            
                updateMegaColumns(mainKey); //  누른 항목만 보여주기
            });
        });

        // 4 검색 팝업에서 체크박스 값 추출 함수 - 
        function getCheckedNumbersByName(name, MAP){
            return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
            .map((cb) => MAP[cb.value])
            .filter((v) => typeof v === 'number');
        }

        // 5 검색 버튼 눌렀을 때 파라미터 만들고 이동 -
        const searchBtnInPopup = document.querySelector('.search-submit-btn');
        if (searchBtnInPopup) {
            searchBtnInPopup.addEventListener('click', function (e){
                e.preventDefault();

                const allergies = getCheckedNumbersByName('allergy', ALLERGY_MAP);
                const sweeteners = getCheckedNumbersByName('sweetener', SWEETENER_MAP);

                const qs = new URLSearchParams();
                if (selectedMain) qs.set('category', String(selectedMain));
                if (selectedSub) qs.set('smallCategory', String(selectedSub));
                if (allergies.length) qs.set('allergy', allergies.join(','));
                if (sweeteners.length) qs.set('sweetener', sweeteners.join(','));

                const url = `/goods/all-search${qs.toString() ? `?${qs.toString()}`: ''}`;
                window.location.href = url;
            });
        }

        // 6 검색 팝업 열기 / 닫기 -
        const openBtn = document.getElementById('search-btn');
        const popup = document.getElementById('search-popup');
        const closeBtn = document.getElementById('close-popup');

        if (openBtn && popup && closeBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                popup.classList.add('open');
            });

            closeBtn.addEventListener('click', () => popup.classList.remove('open'));

            popup.addEventListener('click', (e) => {
                if (e.target === popup) popup.classList.remove('open');
            });
        }

        // 7 메가 메뉴에서 해당 대분류만 보이게 하기 -
        function updateMegaColumns(mainKey){
            document.querySelectorAll('.mega-menu .mega-column').forEach((col) => { 
                const h4 = col.querySelector('h4[data-main]');
                const groupKey = h4 ? h4.dataset.main : null;
                const show = !mainKey || groupKey === mainKey;
                col.style.display = show ? 'flex' : 'none';
            });
        }

        // 8 드롭다운 / 메가메뉴 열고 닫기 -
        document.addEventListener('click', (e) => {
            // 1 드롭다운 메뉴 토글 
            const ddToggle = e.target.closest('.has-dropdown > .dropdown-toggle');
            if (ddToggle) {
                e.preventDefault();
                const li = ddToggle.closest('.has-dropdown');
                // 다른 열린 메뉴 닫기
                document.querySelectorAll('.has-dropdown.open').forEach(other => {
                    if (other !== li) other.classList.remove('open');
                });
                // 현재 항목 토글
                li.classList.toggle('open');
                return;
            }

            // 2 메가메뉴 토글
            const megaToggle = e.target.closest('.mega-toggle');
            if (megaToggle) {
                e.preventDefault();
                const li = megaToggle.closest('.mega-dropdown');
                li.classList.toggle('open');

                // 대분류 선택한 게 있으면 그것만 보여주기
                const lastMainKey = Object.keys(MAIN_MAP).find(k => MAIN_MAP[k] === selectedMain) || '';
                updateMegaColumns(lastMainKey);
                return;
            }
        
                // 3 메뉴 바깥 클릭 -> 모두 닫기
                if (!e.target.closest('.has-dropdown') && !e.target.closest('.mega-dropdown')) {
                    document.querySelectorAll('.has-dropdown.open, .mega-dropdown.open')
                    .forEach((li) => li.classList.remove('open'));
                }
    });
});
})();

