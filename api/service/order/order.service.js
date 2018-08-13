const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;
const Constant = require("../../common/constants");
var dateFormat = require('dateformat');


class OrderService {
    create(newOrder) {
        return sequelize.transaction(t => {
            return models.Order.create(newOrder, { transaction: t }).then(order0 => {
                let code = this.buildOrderCode(order0.id);
                return order0.update({ code: code }, { transaction: t }).then(order => {
                    if (newOrder.product_id) {
                        return models.Product.findById(newOrder.product_id, { transaction: t }).then(product => {
                            return order.setProducts(product, { transaction: t }).then(() => {
                                return order;
                            });
                        });
                    }
                    return order;
                });
            });
        });
    }

    update(obj, orderId) {
        return models.Order.findById(orderId).then(order => {
            return order.update(obj);
        })
    }

    delete(orderId) {
        return models.Order.destroy({ where: { id: orderId } });
    }

    findById(orderId) {
        return models.Order.findById(
            orderId,
            {
                include: [
                    {
                        model: models.User,
                        as: "customer"
                    },
                    {
                        model: models.Product,
                        as: "products"
                    }
                ]
            }
        );
    }

    findByOrderCode(code) {
        return models.Order.findOne({ where: { code: code } })
    }

    findAll(params) {
        let code = params.code;
        let limit = params.limit;
        let offset = params.offset;

        let conditions = {};

        if (code) {
            conditions.code = { [Op.like]: code };
        }

        return models.Order.findAndCountAll({
            where: conditions,
            include: [
                {
                    model: models.User,
                    as: "customer"
                },
                {
                    model: models.Product,
                    as: "products"
                }
            ], 
            limit, offset
        });
    }

    buildOrderCode(orderId) {
        var date = new Date();
        var stringDate = dateFormat(date, "yyyymmdd");
        var s = "0000000" + orderId;
        var leadingWithZeroId =  s.substr((orderId+"").length);
        var code = Constant.PREFIX_ORDER_CODE + stringDate.substr(2) + "_" + leadingWithZeroId;
        return code;
    }
}

module.exports = OrderService;