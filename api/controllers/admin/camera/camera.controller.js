"use strict";
const CameraService = require("../../../service/camera/camera.service");
const cameraService = new CameraService();
const CameraDTO = require("../../../dto/camera/camera.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;


const CustomizeError = require("../../../exception/customize-error");
const TAG = "CAMERA_CONTROLLER";

const constant = require("../../../common/constants");

class CameraManagerController {
  createCamera(req, res, next) {
    let _body = req.body;
    let newCamera = CameraDTO.infoCreate(_body);

    Promise.all([cameraService.findByName(newCamera.name), cameraService.findByUri(newCamera.uri)]).then(value => {

      if (value[0]) {
        let error = new CustomizeError(TAG, 400, `name (${newCamera.name})  is existed`);
        next(error);
        return;
      }

      // if (value[1]) {
      //   let error = new CustomizeError(TAG, 400, `namaspace (${newCamera.namespace}) is existed`);
      //   next(error);
      //   return;
      // }

      if (value[2]) {
        let error = new CustomizeError(TAG, 400, `uri (${newCamera.uri}) are existed`);
        next(error);
        return;
      }

      cameraService
        .create(newCamera)
        .then(result => {
          let cameraResponse = CameraDTO.infoResponse(result);
          let successResponse = new SuccessResponse(200, "Success", cameraResponse);
          res.status(200).json(successResponse);
        })
        .catch(error => {
          next(error);
        });

    }).catch(error => {
      next(error);
    })
  }

  updateCamera(req, res, next) {
    let _body = req.body;
    let cameraId = _body.id;
    if (!cameraId) {
      let error = new CustomizeError(TAG, 400, "id of camera must have");
      next(error);
    }

    let newCamera = CameraDTO.infoUpdate(_body);
    Promise.all([cameraService.findByName(newCamera.name), cameraService.findByUri(newCamera.uri)]).then(value => {

      if (value[0] && value[0].id != newCamera.id) {
        let error = new CustomizeError(TAG, 400, `name (${newCamera.name})  is existed`);
        next(error);
        return;
      }

      // if (value[1] && value[1].id != newCamera.id) {
      //   let error = new CustomizeError(TAG, 400, `namaspace (${newCamera.namespace}) is existed`);
      //   next(error);
      //   return;
      // }

      if (value[2] && value[2].id != newCamera.id) {
        let error = new CustomizeError(TAG, 400, `uri (${newCamera.uri}) are existed`);
        next(error);
        return;
      }

      cameraService.update(newCamera, cameraId).then(result => {
        let cameraResponse = CameraDTO.infoResponse(result);
        let successResponse = new SuccessResponse(200, "Success", cameraResponse);
        return res.status(200).json(successResponse);
      }, error => {
        next(error);
      })

    }).catch(error => {
      next(error);
    })
  }

  updateStatus(req, res, next) {

  }

  findAll(req, res, next) {
    let name = req.query.name;
    let uri = req.query.uri;
    let location = req.query.location;
    let pageNum = req.query.pageNum || constant.PAGENUM_DEFAULT;
    let pageSize = req.query.pageSize || constant.PAGESIZE_DEFAULT;
    let limit = pageSize;
    let offset = pageNum * pageSize;
    let params = { name, uri, location, limit, offset };

    cameraService.findAll(params).then(result => {
      let total = result.count || 0;
      let rows = result.rows || [];

      let arr = [];
      rows.forEach(el => {
        arr.push(CameraDTO.infoResponse(el));
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
    let params = { limit, offset };

    cameraService.findAll(params).then(result => {
      let total = result.count || 0;
      let rows = result.rows || [];

      let arr = [];
      rows.forEach(el => {
        arr.push(CameraDTO.infoResponse(el));
      });

      let value = { total, arr };
      let successResponse = new DataTableResponse(draw, total, arr);
      return res.status(200).json(successResponse);
    }).catch(error => {
      next(error);
    })
  }

  getDetailCamera(req, res, next) {
    let cameraId = req.query.cameraId;

    if (!cameraId) {
      let error = new CustomizeError(TAG, 400, "id of camera must have");
      next(error);
    } else {
      cameraService.findById(cameraId).then(result => {
        if (result) {
          let cameraResponse = CameraDTO.infoResponse(result);
          let successResponse = new SuccessResponse(200, "Success", cameraResponse);
          return res.status(200).json(successResponse);
        } else {
          let error = new CustomizeError(TAG, 400, "there isn't camera found");
          next(error);
        }
      }).catch(error => {
        next(error);
      })
    }
  }
}
module.exports = CameraManagerController;
