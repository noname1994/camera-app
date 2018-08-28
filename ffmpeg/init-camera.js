const fs = require("fs");
const path = require("path");
const rtsp = require("../lib/rtsp-ffmpeg");
const models = require("../api/models/index");
const CameraDTO = require("../api/dto/camera/camera.dto");
const events = require('events');

const CameraService = require("../api/service/camera/camera.service");
const cameraService = new CameraService();

// const sequelize = models.sequelize;
// const Sequelize = models.Sequelize;

module.exports = io => {
    let arrStream = [];

    let updateNamespace = io.of("/admin/camera");
    updateNamespace.on("connection", socket => {
        console.log("connected ");
        socket.on("disconnect", () => {
            console.log("disconnected");
        });
        socket.on("message", function (data) {
            console.log("Admin update camera: " + data);

            cameraService.findById(data.id).then(cam => {
                if (cam) {
                    if (data.type == "UPDATE") {
                        updateCamera(cam);
                    }
                    if (data.type == "DELETE") {
                        deleteCamera(cam);
                    }
                    if (data.type == "REFRESH") {
                        refreshFFmpegJob(cam);
                    }
                }
            });
        });
    });

    function updateCamera(newCamera) {
        console.log("start update FFmpeg job for camera", newCamera.id);
        if (newCamera && newCamera.id) {
            // check if exist cam -> remove
            let existedCam = false;
            arrStream.forEach((camStreamObj, i) => {
                if (newCamera.id == camStreamObj.id) {
                    camStreamObj.stream.restart();
                    existedCam = true;
                }
            });
            if (!existedCam) {
                // start new FFmpeg job
                let camStreamObj = startFFmpegForCamera(newCamera).then(camStreamObj => {
                    arrStream.push(camStreamObj);
                    bridgeDataToSocket(camStreamObj);
                });
                console.log("update FFmpeg job for: " + newCamera.id);
            }
        }
    }

    function deleteCamera(newCamera) {
        console.log("start delete FFmpeg job for camera", newCamera.id);
        console.log(arrStream.length)
        if (newCamera && newCamera.id) {
            // check if exist cam -> remove
            for (var i = 0; i < arrStream.length; i++) {
                var camStreamObj = arrStream[i];
                if (newCamera.id == camStreamObj.id) {
                    camStreamObj.stream.stop();
                    arrStream.splice(i, 1);
                }
            }
        }
    }

    function refreshFFmpegJob(newCamera) {
        // delete job if it is existed
        deleteCamera(newCamera);
        // start new FFmpeg job
        let camStreamObj = startFFmpegForCamera(newCamera).then(camStreamObj => {
            arrStream.push(camStreamObj);
            bridgeDataToSocket(camStreamObj);
        });
        console.log("refresh FFmpeg job for: " + newCamera.id);
    }

    function startFFmpegForCamera(cam) {
        return cameraService.updateStatus(cam.id, "ON").then(result => {
            if (result) {
                console.log("Update status ON success for ", cam.name);
                let ffmpegStream = new rtsp.FFMpeg({
                    input: cam.uri,
                    resolution: cam.resolution,
                    quality: cam.quality,
                    fileOutput: cam.fileOutput,
                    namespace: cam.namespace
                });
                ffmpegStream.on("start", function () {
                    console.log("stream " + cam.name + " started");
                });
                ffmpegStream.on("stop", function () {
                    console.log("stream " + cam.name + " stopped");
                });
                ffmpegStream.on("dead", function () {
                    console.log("stream " + cam.name + " DEAD");
                    cameraService.updateStatus(cam.id, "OFF").then(result1 => {
                        if (result1) {
                            console.log("Update status OFF success for ", cam.name);
                        } else {
                            console.log("Update status OFF failed for ", cam.name);
                        }
                    });
                });
                streamObj = { id: cam.id, camera: cam, stream: ffmpegStream };
                return streamObj;
            } else {
                console.log("Update status ON failed for ", cam.name);
                return null;
            }
        });
    }

    function bridgeDataToSocket(camStreamObj) {
        let camStream = camStreamObj.stream;
        let cam = camStreamObj.camera;
        var eventEmitter = new events.EventEmitter();

        let ns = io.of(cam.namespace);

        var pipeStream = data => {
            // console.log("data of ", i);
            eventEmitter.emit("data", data);
        };

        camStream.on("data", pipeStream);

        ns.on("connection", socket => {
            console.log("connected to camera", camStreamObj.id);

            var pipeStream1 = data => {
                socket.emit("data", data);
            };

            eventEmitter.on("data", pipeStream1);

            socket.on("disconnect", () => {
                console.log("disconnected from /cam" + camStreamObj.id);
                // camStream.removeListener("data", pipeStream);
                eventEmitter.removeListener("data", pipeStream);
            });
        });
    }


    // init serving ALL camera
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
        // io.on("connection", function (socket) {
        //     socket.emit("start", arrCams);
        // });

        for (var i = 0; i < arrCams.length; i++) {
            var cam = arrCams[i];
            startFFmpegForCamera(cam).then(streamObj => {
                arrStream.push(streamObj);
                bridgeDataToSocket(streamObj);
            });
        }

    }).catch(error => {
        console.log(error);
    });
}
