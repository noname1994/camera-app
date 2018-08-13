"use strict";
const ProductService = require("../../../service/product/product.service");
const productService = new ProductService();
const CameraService = require("../../../service/camera/camera.service");
const cameraService = new CameraService();
const ProductDTO = require("../../../dto/product/product.dto");
const ImageUploadDTO = require("../../../dto/file/image-upload.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;

const CustomizeError = require("../../../exception/customize-error");

const constants = require("../../../common/constants");

const TAG = "PRODUCT-CONTROLLER";

class ProductManagerController {
  createProduct(req, res, next) {
    let _body = req.body;
    let newProduct = ProductDTO.infoCreate(_body);
    let images = _body.images;
    let type = _body.type;
    let cameraId = newProduct.camera_id;
    if (!cameraId) {
      let error = new CustomizeError(TAG, 400, "id of camera must have");
      next(error);
    }
    Promise.all([productService.findByName(newProduct.name),
    cameraService.findById(cameraId)]).then(result => {
      if (result[0]) {
        let error = new CustomizeError(TAG, 400, `name (${newProduct.name}) is existed`);
        next(error);
      }
      if (!result[1]) {
        let error = new CustomizeError(TAG, 400, `camera id (${newProduct.camera_id}) is not existed`);
        next(error);
      }
      productService.create(newProduct, images, type).then(result => {
        let successResponse = new SuccessResponse(200, "Success", result);
        res.status(200);
        return res.json(successResponse);
      }).catch(error => {
        next(error);
      })
    }).catch(error => {
      next(error);
    })
  }

  updateProduct(req, res, next) {
    let _body = req.body;
    let newProduct = ProductDTO.infoUpdate(_body);
    let images = _body.images || [];
    let type = _body.type;
    let relatedVideos = _body.related_videos || [];

    if (!newProduct.id) {
      let error = new CustomizeError(TAG, 400, "id of product must have");
      next(error);
    }

    // check name product
    productService.findByName(newProduct.name).then(result => {
      console.log(JSON.stringify(result));
      if (result && result.id != newProduct.id) {
        let error = new CustomizeError(TAG, 400, `name (${newProduct.name}) is existed`);
        next(error);
      } else {
        productService.update(newProduct, images, type, relatedVideos).then(result => {
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

  updateStatus(req, res, next) {
    let _body = req.body;
    let status = _body.status;
    let id = _body.id;

    productService.updateStatus(id, status).then(result => {
      let successReponse = new SuccessResponse(200, "Success", result);
      res.status(200);
      return res.json(successReponse);
    }).catch(error => {
      next(error);
    })
  }

  deleteProduct(req, res, next) {
    let arrId = req.query.arrId;
    console.log(arrId);
    if (!arrId) {
      let error = new CustomizeError(TAG, 400, "arrId of product must have");
      next(error);
    } else {
      productService.delete(arrId).then(result => {
        if (result) {
          let successReponse = new SuccessResponse(200, "Success", result);
          return res.status(200).json(successReponse);
        } else {
          let errorResponse = new ErrorResponse(400, "No product is deleted", null);
          return res.status(200).json(errorResponse);
        }
      }).catch(error => {
        next(error);
      })
    }


  }

  getDetailProduct(req, res, next) {
    let productId = req.query.productId;
    if (!productId) {
      let error = new CustomizeError(TAG, 400, "id of product must have");
      next(error);
    }

    productService.findById(productId).then(result => {
      if (result) {
        let productResponse = ProductDTO.infoResponse(result);
        let successReponse = new SuccessResponse(200, "Success", result);
        res.status(200);
        return res.json(successReponse);
      } else {
        let error = new CustomizeError(TAG, 400, "there isn't product found");
        next(error);
      }
    }).catch(error => {
      next(error);
    })

  }

  findAll(req, res, next) {
    let name = req.query.name; // name product
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let status = req.query.status;
    let typeName = req.query.typeName;
    let pageNum = req.query.pageNum || constants.PAGENUM_DEFAULT;
    let pageSize = req.query.pageSize || constants.PAGESIZE_DEFAULT;

    let limit = pageSize;
    let offset = pageNum * pageSize;

    let params = { name, minPrice, maxPrice, status, typeName, limit, offset };
    productService.findAll(params).then(result => {

      let arr = [];
      let total = result.count || 0;
      let rows = result.rows || [];
      if (rows) {
        rows.forEach(el => {
          arr.push(ProductDTO.infoResponse(el));
        });
      }
      let value = { total, arr };
      let successError = new SuccessResponse(200, "Success", value);
      res.status(200);
      return res.json(successError);
    }).catch(error => {
      next(error);
    })
  }

  findAllForDataTable(req, res, next) {
    let draw = req.query.draw;
    let offset = req.query.start || constants.OFFSET_DEFAULT; // default bootstrap start page offset at 0
    let pageSize = req.query.length || constants.PAGESIZE_DEFAULT;
    let limit = pageSize;
    let params = { limit, offset };

    productService.findAll(params).then(result => {

      let arr = [];
      let total = result.count || 0;
      let rows = result.rows || [];
      if (rows) {
        rows.forEach(el => {
          arr.push(ProductDTO.infoResponse(el));
        });
      }
      let value = { total, arr };
      let successResponse = new DataTableResponse(draw, total, arr);
      return res.status(200).json(successResponse);
    }).catch(error => {
      next(error);
    })
  }
}

module.exports = ProductManagerController;
