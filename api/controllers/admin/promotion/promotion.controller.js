const PromotionService = require("../../../service/promotion/promotion.service");
const promotionService = new PromotionService();

const CustomizeError = require("../../../exception/customize-error");

const constants = require("../../../common/constants");
const PromotionDTO = require("../../../dto/promotion/promotion.dto");
const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;

class PromotionController {
    createPromotion(req, res, next) {
        let _body = req.body;
        let newPromotion = PromotionDTO.infoCreate(_body);
    }

    updatePromotion(req, res, next) {

    }

    updateStatusPromotion(req, res, next) {

    }

    deletePromotion(req, res, next) {

    }
}

module.exports = PromotionController;
