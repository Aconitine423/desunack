// 연도선택
const $year = $("#birthYear");
const $month = $("#birthMonth");
const $day = $("#birthDay");
const thisYear = new Date().getFullYear();
for (let y = thisYear; y >= thisYear - 100; y--) {
    const $option = $("<option>");
    $option.val(y);
    $option.text(y);
    $year.append($option);
}

// 월 선택
$year.on('change', function () {
    $month.empty();
    $month.append("<option value='' selected disabled hidden>월</option>");
    $day.empty();
    $day.append("<option value='' selected disabled hidden>일</option>");
    for (let m = 1; m <= 12; m++) {
        const $option = $("<option>");
        $option.val(m);
        $option.text(m);
        $month.append($option);
    }
});

// 일 선택
$month.change(function () {
    let $selectMonth = parseInt($month.val());
    let $selectYear = parseInt($year.val());
    $day.empty();
    $day.append("<option value='' selected disabled hidden>일</option>");
    let day;
    // console.log($selectMonth, typeof $selectMonth);
    if (isNaN($selectYear) || isNaN($selectMonth)) {
        return;
    }
    switch ($selectMonth) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            day = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            day = 30;
            break;
        case 2:
            if ($selectYear % 4 === 0) {
                day = 29;
            } else {
                day = 28;
            }
    }
    for (let d = 1; d <= day; d++) {
        const $option = $("<option>");
        $option.val(d);
        $option.text(d);
        $day.append($option);
    }
});

// 이메일 직접입력 선택시 직접입력창 display 활성화
const $emailDomainSelect = $("#emailDomain");
const $emailCustomDomainSelect = $("#emailCustomDomain");
$emailDomainSelect.on('change', function () {
    if ($emailDomainSelect.val() === "custom") {
        $emailCustomDomainSelect.css('display', 'block');
        $emailCustomDomainSelect.attr('required', 'required');
    }else {
        $emailCustomDomainSelect.css('display', 'none');
        $emailCustomDomainSelect.removeAttr('required', 'required');
    }
});