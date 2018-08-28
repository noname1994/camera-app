var socket = io();
var socket;
var container = $('#mjpeg-container');
var width = container.width();
var height = (9 / 16) * width;
console.log(width, "x", height);
var canvas = document.getElementById('mjpeg-content');
var ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;
// draw preview image

var previewImg = new Image;
previewImg.src = "/static/images/common/no-preview.jpg";
previewImg.onload = function () {
    ctx.drawImage(previewImg, 0, 0, width, height);
};

if (socket) {
    socket.disconnect();
}
console.log("onstart");
socket = io(location.origin + "/cam1");
socket.on('data', function (data) {

    var bytes = new Uint8Array(data);

    var blob = new Blob([bytes], { type: 'application/octet-binary' });

    var url = URL.createObjectURL(blob);

    var img = new Image;

    img.onload = function () {
        URL.revokeObjectURL(url);
        console.log("ondata", width, height);

        ctx.drawImage(img, 0, 0, width, height);
    };

    img.src = url;

    //image.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
});
