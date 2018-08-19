var socket = io();
socket.on('start', function (cou) {
    var divSocket;
    var container = $('#mjpeg-container');
    var width = container.width();
    var height = (9 / 16) * width;
    console.log(width, "x", height);
    var canvas = document.getElementById('mjpeg-content');
    canvas.width = width;
    canvas.height = height;
    if (divSocket) {
        divSocket.disconnect();
    }
    console.log("onstart");
    divSocket = io(location.origin + "/cam1");
    divSocket.on('data', function (data) {

        var bytes = new Uint8Array(data);

        var blob = new Blob([bytes], { type: 'application/octet-binary' });

        var url = URL.createObjectURL(blob);

        var img = new Image;

        var ctx = canvas.getContext("2d");

        img.onload = function () {
            URL.revokeObjectURL(url);
            console.log("ondata", width, height);

            ctx.drawImage(img, 0, 0, width, height);
        };

        img.src = url;

        //image.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
    });
});