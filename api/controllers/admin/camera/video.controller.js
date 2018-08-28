"use strict";
const VideoService = require("../../../service/camera/video.service");
const videoService = new VideoService();
const CameraService = require("../../../service/camera/camera.service");
const cameraService = new CameraService();
const VideoDTO = require("../../../dto/camera/video.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;

const CustomizeError = require("../../../exception/customize-error");
const TAG = "VIDEO_CONTROLLER";

const constant = require("../../../common/constants");

const MergeVideoService = require("../../../../lib/merge-video");
const mergeVideoService = new MergeVideoService();

class VideoController {
    createVideo(req, res, next) {
        let _body = req.body;
        let newVideo = VideoDTO.infoCreate(_body);

        Promise.all([cameraService.findById(newVideo.camera_id)]).then(value => {
            if (!value[0]) {
                let error = new CustomizeError(TAG, 400, `Camera ID (${newVideo.camera_id})  is not existed`);
                next(error);
                return;
            }

            videoService
                .create(newVideo)
                .then(result => {
                    let videoResponse = VideoDTO.infoResponse(result);
                    let successResponse = new SuccessResponse(200, "Success", videoResponse);
                    res.status(200).json(successResponse);
                })
                .catch(error => {
                    next(error);
                });

        }).catch(error => {
            next(error);
        })
    }

    buildVideo(req, res, next) {
        let _body = req.body;
        let newVideo = VideoDTO.infoCreate(_body);

        Promise.all([cameraService.findById(newVideo.camera_id)]).then(value => {
            if (!value[0]) {
                let error = new CustomizeError(TAG, 400, `Camera ID (${newVideo.camera_id})  is not existed`);
                next(error);
                return;
            }

            videoService
                .create(newVideo)
                .then(result => {
                    let videoResponse = VideoDTO.infoResponse(result);
                    let successResponse = new SuccessResponse(200, "Success", videoResponse);
                    res.status(200).json(successResponse);
                    mergeVideoService.buildVideo(value[0], videoResponse);
                })
                .catch(error => {
                    next(error);
                });

        }).catch(error => {
            next(error);
        })
    }

    updateVideo(req, res, next) {
        let _body = req.body;
        let newVideo = VideoDTO.infoUpdate(_body);
    
        if (!newVideo.id) {
          let error = new CustomizeError(TAG, 400, "id of product must have");
          next(error);
        }
    
        // check name product
        videoService.findById(newVideo.id).then(result => {
          console.log(JSON.stringify(result));
          if (!result) {
            let error = new CustomizeError(TAG, 400, `Video Id (${newVideo.id}) is not exist`);
            next(error);
          } else {
            videoService.update(newVideo, newVideo.id).then(result => {
              let successResponse = new SuccessResponse(200, "Success", result);
              res.status(200);
              return res.json(successResponse);
            }).catch(error => {
              next(error);
            })
          }
        }).catch(error => {
          next(error);
        })
    }

    findAll(req, res, next) {
        let created_type = req.query.created_type;
        let searchText = req.query.searchText;
        let camera_id = req.query.camera_id;
        let pageNum = req.query.pageNum || constant.PAGENUM_DEFAULT;
        let pageSize = req.query.pageSize || constant.PAGESIZE_DEFAULT;
        let limit = pageSize;
        let offset = pageNum * pageSize;
        let params = { searchText, camera_id, created_type, limit, offset };
    
        videoService.findAll(params).then(result => {
          let total = result.count || 0;
          let rows = result.rows || [];
    
          let arr = [];
          rows.forEach(el => {
            arr.push(VideoDTO.infoResponse(el));
          });
    
          let value = { total, arr };
          let successResponse = new SuccessResponse(200, "Success", value);
          return res.status(200).json(successResponse);
        }).catch(error => {
          next(error);
        })
      }
    findAllForDataTable(req, res, next) {
        let draw = req.query.draw;
        let offset = req.query.start || constant.OFFSET_DEFAULT; // default bootstrap start page offset at 0
        let pageSize = req.query.length || constant.PAGESIZE_DEFAULT;
        let limit = pageSize;
        // let created_type = "BY_PRODUCT";
        let params = {limit, offset };
    
        videoService.findAll(params).then(result => {
          let total = result.count || 0;
          let rows = result.rows || [];
    
          let arr = [];
          rows.forEach(el => {
            arr.push(VideoDTO.infoResponse(el));
          });
    
          let value = { total, arr };
          let successResponse = new DataTableResponse(draw, total, arr);
          return res.status(200).json(successResponse);
        }).catch(error => {
          next(error);
        })
      }

      deleteVideo(req, res, next) {
        let arrId = req.query.arrId;
        console.log(arrId);
        if (!arrId) {
          let error = new CustomizeError(TAG, 400, "arrId of video must have");
          next(error);
        } else {
          videoService.delete(arrId).then(result => {
            if (result) {
              let successReponse = new SuccessResponse(200, "Success", result);
              return res.status(200).json(successReponse);
            } else {
              let errorResponse = new ErrorResponse(400, "No video is deleted", null);
              return res.status(200).json(errorResponse);
            }
          }).catch(error => {
            next(error);
          })
        }
      }
    
}

module.exports = VideoController;