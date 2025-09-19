$('#same').on('click', function(){
    console.log("3");
    if($(this).is(":checked")){
        console.log("1");
        $('#recvName').val($('#buyerName').val());
        $('#recvPhone1').val($('#buyerPhone1').val());
        $('#recvPhone2').val($('#buyerPhone2').val());
        $('#recvPhone3').val($('#buyerPhone3').val());
        $('#recvPost').val($('#buyerPost').val());
        $('#recvAddr').val($('#buyerAddr').val());
        $('#recvDetail').val($('#buyerDetail').val());
    }else{
        console.log("2");
        $('#recvName').val('');
        $('#recvPhone1').val('');
        $('#recvPhone2').val('');
        $('#recvPhone3').val('');
        $('#recvPost').val('');
        $('#recvAddr').val('');
        $('#recvDetail').val('');
    }
})

function buyConfirm(){
    const idbox = $('.goodsId');
    const idList = [];

    idbox.each(function(){
        idList.push($(this).val())
    });

    const OrderEntity = {
        go_num : $(`#order${orderNum}`).val(),
        go_m_uid : $(`#uid`).val(),
        go_receiver_name : $('#recvName').val(),
        go_receiver_phone : $('#recvPhone1').val() + '-' + $('#recvPhone2').val() + '-' + $('#recvPhone3').val(),
        go_receiver_post : $('#recvPost').val(),
        go_receiver_address : $('#recvAddr').val(),
        go_receiver_address_detail : $('#recvDetail').val(),
        go_payments : $('input[name="pay"]:checked').val(),
        goc_card_com : $('#cardCompany').val(),
        goc_card_installment : $('#installment').val(),
        go_kind : 2,
        gop_pay_type : 1,
        gop_cost : 3000

    }

    const formData = new FormData();
    formData.append('idList', new Blob([JSON.stringify(idList)], {type: 'application/json'}));
    formData.append('OrderEntity', new Blob([JSON.stringify(OrderEntity)], {type: 'application/json'}));

    console.log(OrderEntity);
    console.log(idList);
    axios.post('/order/orderUpdate',formData).then(function(response){
        console.log("주문 성공", response.data);
        location.href = "/";
    })
        .catch(function(error){
            console.log(error);
        })

}
