const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class PromotionService {

    create(newPromotion) {
        return models.Promotion.create(newPromotion);
    }

    update(newPromotion, promotionId) {
        return models.Promotion.update(newPromotion, { where: { id: promotionId } });
    }

    delete(arrId) {
        return models.Promotion.destroy({ where: { [Op.or]: arrId } });
    }

    findAll(params) {

        let limit = params.limit;
        let offset = params.offset;

        return models.Promotion.findAll({ limit, offset });
    }

    findById(promotionId) {
        return models.Promotion.findById(promotionId);
    }
}


module.exports = PromotionService;