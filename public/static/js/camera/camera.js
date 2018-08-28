function playVideo(video) {
    if (video) {
        $('#idVideoTitle').text(video.title);
        $('#idSourceVideo').attr("src", video.url);
        $('#idVideo').load();
    }
}
// Shorthand for $( document ).ready()
$(function () {
    console.log("ready!");
    let camId = getUrlParam("camId");
    let videoId = getUrlParam("videoId");

    // get list video related with
    $.ajax({
        type: "GET",
        url: "/admin/video/find/all?camera_id=" + camId,
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listVideo = response.value.arr;
                buildListRelatedVideo($('#listView'), listVideo);
                if (!videoId) {
                    playVideo(listVideo[0]);
                } else {
                    listVideo.forEach(function (video) {
                        if (videoId == video.id) {
                            playVideo(video);
                        }
                    }, this);
                }
            }
        },
        error: function () {
            console.log("Can not load related video");
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