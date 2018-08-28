// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
    $.ajax({
        type: "GET",
        url: "/product/find/all/?typeName=" + CONSTANTS.TYPE_OF_GA,
        dataType: 'json',
        success: function (response) {
            // alert("Success");
            if(response.value){
                buildListProduct($('#product-container'),response.value.arr, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            alert('Error');
        }
    });
});