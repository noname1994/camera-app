const fs = require("fs");
const path = require("path");
const rtsp = require("../lib/rtsp-ffmpeg");
const models = require("../api/models/index");
const CameraDTO = require("../api/dto/camera/camera.dto");
const events = require('events');

// const sequelize = models.sequelize;
// const Sequelize = models.Sequelize;

module.exports = io => {


    models.Camera.findAll().then(result => {
        let arrCams = [];
        if (!result) {
            throw new Error("Not found camera !");
        }

        result.forEach(el => {
            arrCams.push({
                id: el.id,
                name: el.name,
                namespace: el.namespace,
                resolution: el.resolution,
                fileOutput: el.fileOutput,
                uri: el.uri,
                location: el.location,
            });
        })


        // console.log(arrCams);

        // send camera information
        io.on("connection", function (socket) {
            socket.emit("start", arrCams);
        });

        let arrStream = [];

        arrCams.forEach(cam => {
            let stream = new rtsp.FFMpeg({
                input: cam.uri,
                resolution: cam.resolution,
                quality: cam.quality,
                fileOutput: cam.fileOutput,
                namespace: cam.namespace
            });
            stream.on("start", function () {
                console.log("stream " + cam.name + " started");
            });
            stream.on("stop", function () {
                console.log("stream " + cam.name + " stopped");
            });
            arrStream.push(stream);
        });

        //create namespace and  send data
        arrStream.forEach((camStream, i) => {

            var eventEmitter = new events.EventEmitter();

            let ns = io.of(arrCams[i].namespace);

            let tmp;

            var pipeStream = data => {
                // console.log("data of ", i);
                eventEmitter.emit("data", data);
                tmp = data;
            };

            camStream.on("data", pipeStream);

            ns.on("connection", socket => {
                console.log("connected to came", arrCams[i].name);

                var pipeStream1 = data => {
                    // console.log("data1 of", i);
                    socket.emit("data", data);
                };

                eventEmitter.on("data", pipeStream1);

                socket.on("disconnect", () => {
                    console.log("disconnected from /cam" + arrCams[i].name);
                    // camStream.removeListener("data", pipeStream);
                    eventEmitter.removeListener("data", pipeStream);
                });
            });
        });
    }).catch(error => {
        console.log(error);
    });
}
