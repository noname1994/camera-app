// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
    $.ajax({
        type: "GET",
        url: "/product/find/all/?typeName=" + CONSTANTS.TYPE_OF_RUOU,
        dataType: 'json',
        success: function (response) {
            // alert("Success");
            console.log("response: ", response);
            if(response.value){
                buildListProduct($('#product-container'),response.value.arr, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            alert('Error');
        }
    });
});