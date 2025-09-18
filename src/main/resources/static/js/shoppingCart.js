


function goodsOrder(){
    const checkbox = $('.row-chk');
    const idList = [];
    console.log(checkbox);
    checkbox.each(function(){
        console.log("id", $(this).attr('id'));
        if($(this).is(':checked')){
            idList.push($(this).attr('id'));

        }
    })
    axios.post('/order/order',idList).then(function(response){
        location.href="/order/order";
    }).catch(function(error){
        console.log(error);
    })
}