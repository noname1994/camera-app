const OrderService = require("../../../service/order/order.service");
const orderService = new OrderService();

const CustomizeError = require("../../../exception/customize-error");

const constants = require("../../../common/constants");
const OrderDTO = require("../../../dto/order/order.dto");
const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;

class OrderController {
    updateStatusOrder(req, res, next) { }
}

module.exports = OrderController;