// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
    $.ajax({
        type: "GET",
        url: "/admin/camera/find/all/?type=BINH_RUOU",
        dataType: 'json',
        success: function (response) {
            // alert("Success");
            if(response.value){
                buildListCamera($('#camera-container'),response.value.arr);
            }
        },
        error: function () {
            alert('Error');
        }
    });
});