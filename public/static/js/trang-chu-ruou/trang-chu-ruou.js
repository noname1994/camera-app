// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
    $.ajax({
        type: "GET",
        url: "/admin/camera/find/all/?type=" + CONSTANTS.TYPE_OF_RUOU,
        dataType: 'json',
        success: function (response) {
            // alert("Success");
            if(response.value){
                buildListCamera($('#camera-container'),response.value.arr, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            alert('Error');
        }
    });
});