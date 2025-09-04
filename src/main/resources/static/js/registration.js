let isValid = false; // 필수 입력칸 채웠는지 확인
const $registerFrm = $('#registerFrm');
const $messageBox = $('#messageBox');
const $mainImg = $('#mainImage');
const $subImg = $('#detailContent');
// const fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
$registerFrm.on('submit', function (event) {
    event.preventDefault();
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

    if($mainImg[0].files.length === 0){
        isValid = false;
    }else{
        const mainImgFileFormList = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'];
        const mainImgFileExtension = $mainImg[0].files[0].name.split('.').pop().toLowerCase();
        if(!mainImgFileFormList.includes(mainImgFileExtension)) {
            isValid = false;
        }
        isValid = true;
    }



    if($subImg[0].files.length === 0){
        isValid = false;
        }else{
            const subImgFileFormList = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'];
            const subImgFileExtension = $subImg[0].files[0].name.split('.').pop().toLowerCase();
            if(!subImgFileFormList.includes(subImgFileExtension)) {
                isValid = false;
            }
            isValid = true;
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
        const today = new Date();
        const startYear = today.getFullYear();
        const startMonth = formatNumber(today.getMonth());
        const startDay = formatNumber(today.getDate());
        const startDate = `${startYear}-${startMonth}-${startDay}`;
        const futureDay = new Date();
        let endYear;
        let endMonth;
        let endDay;
        switch ($('#goodsDate').val()){
            case 'month1':
                futureDay.setDate(futureDay.getDate() + 30);

                break;
            case 'month2':
                futureDay.setDate(futureDay.getDate() + 60);
                break;
            case 'month3':
                futureDay.setDate(futureDay.getDate() + 90);
                break;
        }
        endYear = futureDay.getFullYear();
        endMonth = formatNumber(futureDay.getMonth());
        endDay = formatNumber(futureDay.getDate());
        const endDate = `${endYear}-${endMonth}-${endDay}`;
        const tAllergy = {
            allergy1: $('#Allergy1').is(":checked"),
            allergy2: $('#Allergy2').is(":checked"),
            allergy3: $('#Allergy3').is(":checked"),
            allergy4: $('#Allergy4').is(":checked"),
            allergy5: $('#Allergy5').is(":checked"),
            allergy6: $('#Allergy6').is(":checked"),
            allergy7: $('#Allergy7').is(":checked"),
            allergy8: $('#Allergy8').is(":checked"),
        }
        const tSweetener = {
            sweetener1: $('#Sweetener1').is(":checked"),
            sweetener2: $('#Sweetener2').is(":checked"),
            sweetener3: $('#Sweetener3').is(":checked"),
            sweetener4: $('#Sweetener4').is(":checked"),
            sweetener5: $('#Sweetener5').is(":checked"),
            sweetener6: $('#Sweetener6').is(":checked"),
            sweetener7: $('#Sweetener7').is(":checked"),
            sweetener8: $('#Sweetener8').is(":checked"),
            sweetener9: $('#Sweetener9').is(":checked"),
            sweetener10: $('#Sweetener10').is(":checked"),
        }
        console.log(tAllergy);
        console.log(tSweetener);
        // 입력된 파라미터 묶음
        const goodsDto = {
            g_m_uid: Number($('#uid')), //판매자 uid 세션에서 받아오기
            brand_name: $('#brandName').val(),
            g_name: $('#goodsName').val(),
            company_name: $('#companyName'), //판매자 회사정보 세션에서 받아오기
            g_value: Number($('#goodsPrice').val()),
            g_qty: Number($('#goodsQuantity').val()),
            g_startday: startDate,
            g_endday: endDate,
            g_cat_key: $('#smallCategory').val(),
            g_delivery_kind: $('#deliveryType').val(),
            g_status: '1',
            g_total_rating: 0,
            g_review_count: 0,
        };
        const goodsInfoDto ={
            gi_kind: $('#foodType').val(),
            gi_origin: $('#madeIn').val(),
            gi_factory: $('#madeFactory').val(),
            gi_caution: $('#caution').val(),
            gi_cs_phone: $('#csPhone').val()
        }
        const mainImgFile = $mainImg[0].files[0];
        console.log('mainImg:', mainImgFile);
        const subImgFile = $subImg[0].files[0];
        console.log('File:', subImgFile);
        console.log('formData', goodsDto);
        console.log(JSON.stringify(goodsDto));
        const goodsFormData = new FormData();
        goodsFormData.append('mainFile', mainImgFile);
        goodsFormData.append('subFile', subImgFile);
        goodsFormData.append('goodsDto', new Blob([JSON.stringify(goodsDto)], {type: 'application/json'}));
        goodsFormData.append('tAllergy', new Blob([JSON.stringify(tAllergy)], {type: 'application/json'}));
        goodsFormData.append('tSweetener', new Blob([JSON.stringify(tSweetener)], {type: 'application/json'}));
        goodsFormData.append('goodsInfoDto', new Blob([JSON.stringify(goodsInfoDto)], {type: 'application/json'}))
        // 엑시오스로 데이터 전송
        console.log(goodsFormData)
        axios.post('/goods/registrate', goodsFormData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log("상품등록 성공: ", response.data);
                location.href = 'redirect:/';
            })
            .catch(function (error) {
                console.log("상품등록 실패:", error);
            });
    } else {
        // 유효성검사 실패시 메시지박스에 표시
        $messageBox.text('입력 정보를 다시 확인해주세요.').css('display', 'block').css('color', 'red');
    }
    return isValid;
})
