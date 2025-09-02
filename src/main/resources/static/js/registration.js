let isValid = false; // 필수 입력칸 채웠는지 확인
const $registerFrm = $('#registerFrm');
const $messageBox = $('#messageBox');
const $mainImg = $('#mainImage').val();
const $subImg = $('#detailContent').val();
const fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
function checkValid(){
    isValid = false; // 유효성 초기화

    if($('#goodsName').val() === ''){ // 상품 이름을 입력 안했다면
        isValid = false;
        return;
    }
    if($('#goodsPrice').val() === ''){ // 상품 가격을 입력 안했다면
        isValid = false;
        return;
    }
    if($('#goodsQuantity').val() === ''){ // 상품 수량을 입력 안했다면
        isValid = false;
        return;
    }
    if($('#category').val() === ''){ // 상품 대분류를 입력 안했다면
        isValid = false;
        return;
    }if($('#smallCategory').val() === ''){ // 상품 소분류를 입력 안했다면
        isValid = false;
        return;
    }
    if (!($('input[name="goodsSweetener"]:checked').val())) { // 대체당을 하나도 선택하지 않았다면
        isValid = false;
    }

    if($mainImg !== '' && $mainImg != null){ //파일을 업로드 했다면
        if(!$mainImg.match(fileForm)){
            isvalid = false;
        }else{
            isValid = true;
        }
    }else{
        isValid = false;
    }

    if($subImg !== '' && $subImg != null){ //파일을 업로드 했다면
        if(!$subImg.match(fileForm)){
            isvalid = false;
        }else{
            isValid = true;
        }
    }else{
        isValid = false;
    }

    if($('#deliveryFee').val() === ''){ // 배송료를 입력하지 않았다면
        isValid = false;
        return;
    }
    if($('#brandName').val() === ''){ // 브랜드명을 입력하지 않았다면
        isValid = false;
        return;
    }
    if($('#foodType').val() === ''){ // 식품 유형을 입력하지 않았다면
        isValid = false;
        return;
    }
    if($('#madeIn').val() === ''){ // 원산지를 입력하지 않았다면
        isValid = false;
        return;
    }
    if($('#madeFactory').val() === ''){ // 제조사를 입력 안했다면
        isValid = false;
        return;
    }
    if($('#caution').val() === ''){ // 주의사항을 입력 안했다면
        isValid = false;
        return;
    }
    if($('#csPhone').val() === ''){ // 상담전화번호를 입력 안했다면
        isValid = false;
        return;
    }
    isValid = true;

    if (isValid) {
        // 날짜를 두 자리로 포맷하는 함수
        function formatNumber(num) {
            return num.toString().padStart(2, '0');
        }

        // 날짜 포맷팅
        const startYear = date.getFullYear();
        const startMonth = date.month();
        const startDay = formatNumber($('#birthDay').val());
        const startDate = `${startYear}-${startMonth}-${startDay}`;
        let endYear;
        let endMonth;
        let endDay;
        switch ($('#goodsDate').val()){
            case 'month1':
                endYear = (date.getDate() + 30).getFullYear();
                endMonth = (date.getMonth() + 30).getMonth();
                endDay = (date.getDate() + 30).getDate();
                break;
            case 'month2':
                 endYear = (date.getDate() + 60).getFullYear();
                 endMonth = (date.getDate() + 60).getMonth();
                 endDay = (date.getDate() + 60).getDate();
                break;
            case 'month3':
                endYear = (Date.getDate() + 90).getFullYear();
                endMonth = (date.getMonth() + 90).getMonth();
                endDay = (date.getDate() + 90).getDate();
                break;
        }
        const endDate = `${endyear}-${startMonth}-${startDay}`

        // 입력된 파라미터 묶음
        const formData = {
            g_m_uid: $('').val(), //판매자 uid 세션에서 받아오기
            brand_name: $('#brandName').val(),
            g_name: $('#goodsName').val(),
            company_name: $('').val(), //판매자 회사정보 세션에서 받아오기
            g_value: $('#goodsPrice').val(),
            g_qty: $('#goodsQuantity').val(),
            g_startday: startDate,
            g_endday: endDate,
            g_cat_key: $('#smallCategory').val(),
            g_image: $('#galleryImage').val(),
            g_detail: $('#detailContent').val(),
            g_delivery_kine: $('#deliveryType').val(),
            g_status: '1',
            g_total_rating: 0,
            g_review_count: 0,
            aList: $('input[name="goodsAllergy"]:checked').val(),
            sList: $('input[name="goodsSweetener"]:checked').val()
        };

        console.log('formData', formData);

        // 엑시오스로 데이터 전송
        axios.post('/goods/registrate', formData)
            .then(function (response) {
                console.log("상품등록 성공: ", response.data);
                location.href = '/goods/registrate/done';
            })
            .catch(function (error) {
                console.log("상품등록 실패:", error);
            });
    } else {
        // 유효성검사 실패시 메시지박스에 표시
        $messageBox.text('입력 정보를 다시 확인해주세요.').css('display', 'block').css('color', 'red');
    }
    return isValid;
}
$registerFrm.on('submit', function (event) {
    event.preventDefault();
    checkValid();
})
