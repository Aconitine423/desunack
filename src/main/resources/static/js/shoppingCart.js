const checkbox = $('row-chk');
const idList = [];
checkbox.each(function(){
    if($(this).is(':checked')){
        idList.push($(this).getAttribute('id'));
    }
})

function goodsOrder(){
    axios.post('/goods/order',idList).then(function(response){
        location.href="/goods/order";
    }).catch(function(error){
        console.log(error);
    })
}