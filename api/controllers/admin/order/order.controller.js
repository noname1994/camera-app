const OrderService = require("../../../service/order/order.service");
const orderService = new OrderService();

const CustomizeError = require("../../../exception/customize-error");

const constant = require("../../../common/constants");
const OrderDTO = require("../../../dto/order/order.dto");
const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;
const TAG = "ORDER-CONTROLLER";

class OrderController {

    createOrder(req, res, next) {
        let _body = req.body;
        let newOrder = OrderDTO.infoCreate(_body);

        orderService
            .create(newOrder)
            .then(result => {
                let orderResponse = OrderDTO.infoResponse(result);
                let successResponse = new SuccessResponse(200, "Success", orderResponse);
                res.status(200).json(successResponse);
            })
            .catch(error => {
                next(error);
            });
    }
    updateOrder(req, res, next) {
        let _body = req.body;
        let orderId = _body.id;
        if (!orderId) {
            let error = new CustomizeError(TAG, 400, "id of Order must have");
            next(error);
        }

        let newOrder = OrderDTO.infoUpdate(_body);
        Promise.all([orderService.findById(newOrder.id)]).then(value => {

            if (!value[0]) {
                let error = new CustomizeError(TAG, 400, `Id (${newOrder.id})  is not existed`);
                next(error);
                return;
            }

            orderService.update(newOrder, orderId).then(result => {
                let orderResponse = OrderDTO.infoResponse(result);
                let successResponse = new SuccessResponse(200, "Success", orderResponse);
                return res.status(200).json(successResponse);
            }, error => {
                next(error);
            })

        }).catch(error => {
            next(error);
        })
    }
    deleteOrder(req, res, next) {
        let arrId = req.query.arrId;
        if (!arrId) {
          let error = new CustomizeError(TAG, 400, "arrId of order must have");
          next(error);
        } else {
            orderService.delete(arrId).then(result => {
            if (result) {
              let successReponse = new SuccessResponse(200, "Success", result);
              return res.status(200).json(successReponse);
            } else {
              let errorResponse = new ErrorResponse(400, "No order is deleted", null);
              return res.status(200).json(errorResponse);
            }
          }).catch(error => {
            next(error);
          })
        }
    
    }
    updateStatusOrder(req, res, next) {

    }

    findAll(req, res, next) {
        let pageNum = req.query.pageNum || constant.PAGENUM_DEFAULT;
        let pageSize = req.query.pageSize || constant.PAGESIZE_DEFAULT;
        let limit = pageSize;
        let offset = pageNum * pageSize;
        let params = { limit, offset };

        orderService.findAll(params).then(result => {
            let total = result.count || 0;
            let rows = result.rows || [];

            let arr = [];
            rows.forEach(el => {
                arr.push(OrderDTO.infoResponse(el));
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

        orderService.findAll(params).then(result => {
            let total = result.count || 0;
            let rows = result.rows || [];

            let arr = [];
            rows.forEach(el => {
                arr.push(OrderDTO.infoResponse(el));
            });

            let value = { total, arr };
            let successResponse = new DataTableResponse(draw, total, arr);
            return res.status(200).json(successResponse);
        }).catch(error => {
            next(error);
        })
    }
}

module.exports = OrderController;