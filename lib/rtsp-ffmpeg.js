/**
 * Created by Andrew D.Laptev<a.d.laptev@gmail.com> on 30.03.15.
 */
const fs = require('fs');
const VIDEO_FOLDER = "video/";
var numberOfTimesRetry = 0;
const constant = require("../api/common/constants");
const spawn = require("child_process").spawn,
  EventEmitter = require("events").EventEmitter,
  util = require("util");

/**
 * Stream constructor
 * @param {object} options
 * @param {string} options.input Stream uri, for example rtsp://r3---sn-5hn7su76.c.youtube.com/CiILENy73wIaGQnup-1SztVOYBMYESARFEgGUgZ2aWRlb3MM/0/0/0/video.3gp
 * @param {number|string} [options.rate] Framerate
 * @param {string} [options.resolution] Resolution in WxH format
 * @param {string|number} [options.quality] JPEG quality
 * @param {Array<string>} [options.arguments] Custom arguments for ffmpeg
 * @constructor
 */
var FFMpeg = function (options) {
  // console.log("options : ", options);
  if (options.input) {
    this.input = options.input;
  } else {
    throw new Error("no `input` parameter");
  }

  if (options.fileOutput) {
    this.fileOutput = options.fileOutput;
  } else {
    throw new Error("no `fileOutput` parameter");
  }

  if (options.namespace) {
    this.namespace = options.namespace;
    if (!fs.existsSync(VIDEO_FOLDER + this.namespace)){
      fs.mkdirSync(VIDEO_FOLDER + this.namespace);
    }
  } else {
    throw new Error("no `namespace` parameter");
  }

  this.rate = options.rate || 10;
  this.resolution = options.resolution;
  this.quality = options.quality === undefined || options.quality === "" ? 3 : options.quality;
  this.arguments = options.arguments || [];

  this.on("newListener", newListener.bind(this));
  this.on("removeListener", removeListener.bind(this));
  if (Object.observe && typeof Proxy !== "function") {
    Object.observe(this, observer.bind(this));
  }
};

util.inherits(FFMpeg, EventEmitter);

/**
 * FFMpeg command name
 * @type {string}
 */
FFMpeg.cmd = "ffmpeg";

function newListener(event) {
  if (event === "data" && this.listeners(event).length === 0) {
    this.start();
  }
}

function removeListener(event) {
  if (event === "data" && this.listeners(event).length === 0) {
    this.stop();
  }
}

function observer(changes) {
  if (
    changes.some(function (change) {
      return change.type === "update";
    })
  ) {
    this.restart();
  }
}

FFMpeg.prototype._args = function () {
  return this.arguments.concat(
    ["-loglevel", "quiet", "-i", this.input, "-r", this.rate.toString()],
    this.quality ? ["-q:v", this.quality.toString()] : [],
    [
      //, '-vf', 'fps=25'
      //, '-b:v', '32k'
      "-f",
      "image2",
      "-updatefirst",
      "1",
      "-"
    ],
    this.resolution ? ["-s", this.resolution] : []
  );

  // '-loglevel quiet -timeout 2000 -i http://192.168.1.117:8080/video2.mjpg -r 10 -q:v 2 -s 640x480 -f image2 -updatefirst 1 - -f segment -vcodec libx264 -r 15 -s 320*240 -preset fast -an -segment_time 30 -segment_format mp4 -strftime 1 %Y%m%d_%H%M%S_cam1.mp4'.split(' ');
  
  // return this.arguments.concat(
  //   ["-loglevel", "quiet",
  //     "-timeout", "2000",
  //     "-i", this.input,
  //     "-r", this.rate.toString()],
  //   this.quality ? ["-q:v", this.quality.toString()] : [],
  //   [
  //     "-s","320x240",
  //     "-f","image2",
  //     "-updatefirst","1",
  //     "-",
  //     "-f","segment",
  //     "-vcodec","libx264",
  //     "-r","15",
  //     "-s","320x240",
  //     "-preset","fast",
  //     "-an", // not contains audio
  //     "-segment_time","300", // 300s per video
  //     "-segment_format","mp4",
  //     "-strftime", "1",
  //     VIDEO_FOLDER + this.namespace + "/"+ "%Y%m%d_%H%M%S" + this.fileOutput + ".mp4"
  //   ]
  // );
};

/**
 * Start ffmpeg spawn process
 */
FFMpeg.prototype.start = function () {
  if(numberOfTimesRetry > constant.MAX_TIMES_RETRY_FFMPEG){
    console.log("exceed 5 times retry")
    return;
  }
  this.child = spawn(FFMpeg.cmd, this._args());
  console.log(this._args().toString());
  this.child.stdout.on("data", this.emit.bind(this, "data"));
  

  // this.child.stdout.on(
  //   "data",
  //   function() {
  //     this.emit.bind(this, "data");
  //     numberOfTimesRetry = 0;
  //   }.bind(this)
  // );

  this.child.stderr.on("data", function (data) {
    throw new Error(data);
  });
  this.emit("start");
  this.child.on(
    "close",
    function (code) {
      // console.log("close ...");
      // console.log("code :", code);
      // if (code === 0) {
      //   console.log("code1 :", code);
      var time = setTimeout(FFMpeg.prototype.restart.bind(this), 1000);
      // }
    }.bind(this)
  );
  this.child.on("error", function (code) {
    console.log("ffmpeg error with code " + code);
  });

  this.child.on("exit", function (code) {
    numberOfTimesRetry ++;
    console.log("ffmpeg exit with code " + code);
  });
};

/**
 * Stop ffmpeg spawn process
 */
FFMpeg.prototype.stop = function () {
  this.child.kill();
  delete this.child;
  this.emit("stop");
};

/**
 * Restart ffmpeg spawn process
 */
FFMpeg.prototype.restart = function () {
  if (this.child) {
    this.stop();
    this.start();
  }
};

if (typeof Proxy === "function") {
  FFMpeg = new Proxy(FFMpeg, {
    set: function (target, property) {
      if (property !== "super_" && target[property] !== undefined) {
        target.restart();
      }
      return true;
    }
  });
}

module.exports.FFMpeg = FFMpeg;
