const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class TypeService {
    create(newType) {
        return models.Type.create(newType);
    }

    update(newType) {
        return models.findById(newType.id).then((type) => {
            return type.update(newType);
        })
    }

    findByName(name) {
        return models.Type.findOne({ where: { name: name } });
    }

    findAll(params) {

        let pageNum = params.pageNum;
        let pageSize = params.pageSize;

        let limit = pageSize;
        let offset = pageNum * pageSize;

        return models.Type.findAll({ limit, offset });
    }
}

module.exports = TypeService;