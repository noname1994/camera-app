const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;
const constants = require("../../common/constants");

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

    async findAll(params) {
        try{
            let pageNum = params.pageNum || constants.PAGENUM_DEFAULT;
            let pageSize = params.pageSize || constants.PAGESIZE_DEFAULT;
            let limit = pageSize;
            let offset = pageNum * pageSize;
            return await models.Type.findAndCountAll({ limit, offset })|| [] ;
        }catch(error){
            throw error;
        }
       
    }
}

module.exports = TypeService;