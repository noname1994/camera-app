// Shorthand for $( document ).ready()
$(function () {
    console.log("ready!");
    let camId =  getUrlParam("camId");
    console.log(camId);
    // get detail of camera
    $.ajax({
        type: "GET",
        url: "/admin/camera/detail?cameraId="+camId,
        contentType: "application/json",
        success: function (response) {
            if (response.value) {
                var camera = response.value;
                if(camera){
                    $('#idCameraTitle').text(camera.name);
                    $('#idBtnDatHang').attr("href", "/dat-hang-ga?camId="+camId);
                }       
            }
        },
        error: function () {
            console.log("Can not load list camera")
        }
    });
    // get list video related with
    $.ajax({
        type: "GET",
        url: "/admin/video/find/all?camera_id="+camId,
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listVideo = response.value.arr;
                buildListRelatedVideo($('#listView'), listVideo)
            }
        },
        error: function () {
            console.log("Can not load related video")
            buildListRelatedVideo($('#listView', null));
        }
    });
    // get list related product
    $.ajax({
        type: "GET",
        url: "/product/find/all", 
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listProduct = response.value.arr;
                buildListProduct($('#product-container'), listProduct, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            console.log("Can not load related product")
        }
    });

});

