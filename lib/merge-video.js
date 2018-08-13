
var fluent_ffmpeg = require("fluent-ffmpeg");
var fs = require('fs');
var path = require("path");
var dateFormat = require('dateformat');
const models = require("../api/models/index");
const VideoService = require("../api/service/camera/video.service");
const videoService = new VideoService();
var FacebookVideoUploadService = require("./facebook-video-upload");
const VideoDTO = require("../api/dto/camera/video.dto");

var facebookVideoUploadService = new FacebookVideoUploadService();

// const folder = 'test/cam1/';
// const hour = '20180513';

class MergeVideoService {
    mergeVideo(cameraDto, hour, videoDto) {
        var folder = path.resolve("./video/" + cameraDto.namespace + "/");
        var fluentFFmpeg = fluent_ffmpeg();
        var videoNames = [];

        fs.readdirSync(folder).forEach(file => {
            console.log(file);
            if (file.startsWith(hour)) {
                videoNames.push(folder + "/" + file);
            }
        })
        if (videoNames.length == 0) {
            console.log("No video to merge");
            return;
        }
        videoNames.forEach(function (videoName) {
            fluentFFmpeg = fluentFFmpeg.addInput(videoName);
        });

        console.log("Start merging video");
        var start = Date.now();

        this.merge(fluentFFmpeg, videoNames, cameraDto, "/merged_" + hour + '.mp4', 1, videoDto)

        function deleteFiles(files, callback) {
            var i = files.length;
            files.forEach(function (filepath) {
                fs.unlink(filepath, function (err) {
                    i--;
                    if (err) {
                        callback(err);
                        return;
                    } else if (i <= 0) {
                        callback(null);
                    }
                });
            });
        }

    }

    merge(fluentFFmpeg, videoNames, cameraDto, outFileName, count, videoDto) {
        console.log("try: " + count);
        var self = this; // Get a reference to your object.
        var folder = path.resolve("./video/" + cameraDto.namespace + "/");
        count++;
        if(count  > 5){
            // send email to admin
            return;
        }
        fluentFFmpeg.mergeToFile(folder + "/" + outFileName + '.mp4')
            .on('error', function (err) {
                console.log('Error ' + err.message);
                // Error ffmpeg exited with code 1: D:\Programing\NodeJS\CameraApp\video\cam2/20180524_220510camera2.mp4: Invalid data found when processing input
                var errFilePath = err.message.replace('ffmpeg exited with code 1: ', '');
                var x = errFilePath.indexOf('mp4:');
                errFilePath = errFilePath.substring(0, x + 3);
                console.log("file error: " + errFilePath);
                // report to admin
                fluentFFmpeg = fluent_ffmpeg();
                videoNames.forEach(function (videoName, index) {
                    if(errFilePath.indexOf(videoName) > -1){
                        videoNames.splice(index,1);
                    }
                });
               
                videoNames.forEach(function (videoName) {
                    fluentFFmpeg = fluentFFmpeg.addInput(videoName);
                });
                self.merge(fluentFFmpeg, videoNames, cameraDto, outFileName, count, videoDto);
            })
            .on('end', function () {
                console.log('Finished!');

                // delete  children file
                // deleteFiles(videoNames, function (err) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log('all child files are removed');
                //     }
                // });
                facebookVideoUploadService.upload(folder + "/" + outFileName + '.mp4', videoDto);
            });

    }      
    mergeAll() {
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
            var date = new Date();
            date.setHours(date.getHours() - 1);
            var videoStartAt = new Date();
            var videoEndAt = new Date();
            videoStartAt.setHours(date.getHours() - 1);
            videoStartAt.setMinutes(0);
            videoStartAt.setSeconds(0);
            videoStartAt.setMilliseconds(0);

            videoEndAt.setHours(date.getHours());
            videoEndAt.setMinutes(0);
            videoEndAt.setSeconds(0);
            videoEndAt.setMilliseconds(0);


            var hour = dateFormat(date, "yyyymmdd_HH"); // HH: 24h format
            arrCams.forEach(cam => {
                let newVideo ={
                    hosted_by: "FACEBOOK",
                    title: hour,
                    description: "Every hour video",
                    started_at: videoStartAt.getTime(),
                    ended_at: videoEndAt.getTime(),
                    created_type: "FREQUENCY",
                    camera_id: cam.id
                };
                var videoDto = VideoDTO.infoCreate(newVideo);
                videoService.create(videoDto).then(video => {
                    this.mergeVideo(cam, hour, video);
                });
            });
        }).catch(error => {
            console.log(error);
        });

    }
    buildVideo(cameraDto, videoDto){
        var fluentFFmpeg = fluent_ffmpeg();
        var videoNames = [];
        var folder = path.resolve("./video/" + cameraDto.namespace + "/");
        if(videoDto.started_at && videoDto.ended_at){
            var timeFrom = dateFormat(videoDto.started_at, "yyyymmdd_HHMMss");
            var timeTo = dateFormat(videoDto.ended_at, "yyyymmdd_HHMMss")

            fs.readdirSync(folder).forEach(file => {
                var timeOfFile = file.substring(0, 15);
                if (timeOfFile >=timeFrom && timeOfFile <= timeTo) {
                    videoNames.push(folder + "/" + file);
                }
            })
            if (videoNames.length == 0) {
                console.log("No video to merge");
                return;
            }
            videoNames.forEach(function (videoName) {
                fluentFFmpeg = fluentFFmpeg.addInput(videoName);
            });
            console.log("Start merging video");
            var outFileName = "video" + videoDto.id;
            this.merge(fluentFFmpeg, videoNames, cameraDto, "/" + outFileName + '.mp4', 1, videoDto)
        }
    }
}
module.exports = MergeVideoService;



