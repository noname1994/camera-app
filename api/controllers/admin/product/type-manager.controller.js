"use strict";
const TypeService = require("../../../service/product/type.service");
const typeService = new TypeService();

const TypeDTO = require("../../../dto/product/type.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;

const CustomizeError = require("../../../exception/customize-error");

const TAG = "Type-CONTROLLER";

class TypeManagerController {
    createType(req, res, next) {
        let _body = req.body;
        let newType = TypeDTO.infoCreate(_body);

        typeService.findByName(newType.name).then(result => {
            if (result) {
                let error = new CustomizeError(TAG, 400, `name (${newType.name}) is existed`);
                next(error);
            } else {
                typeService.create(newType).then(result => {
                    let typeResponse = TypeDTO.infoResponse(result);
                    let successResponse = new SuccessResponse(200, "Success", typeResponse);
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

    updateType(req, res, next) {
        let _body = req.body;
        let newType = TypeDTO.infoUpdate(_body);

        if (!newType.id) {
            let error = new CustomizeError(TAG, 400, "id of type must have");
            next(error);
        }
        typeService.findByName(newType.name).then(result => {
            if (result && result.id != newType.id) {
                let error = new CustomizeError(TAG, 400, `name (${newType.name}) is existed`);
                next(error);
            } else {
                typeService.update(newType).then(result => {
                    let typeResponse = TypeDTO.infoResponse(result);
                    let successResponse = new SuccessResponse(200, "Success", typeResponse);
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

    }

    deleteType(req, res, next) { }

    findTypeById(req, res, next) { }

    findAll(req, res, next) {

    }
}
module.exports = TypeManagerController;
