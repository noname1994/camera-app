const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class ImageUploadService {
  createImageUpload(obj) {
    return models.ImageUpload.bulkCreate(obj);
  }

  // updateIsUser(arrFilename) {
  //   return models.ImageUpload.update({ is_used: true }, { where: { [Op.or]: arrFilename } });
  // }
}

module.exports = ImageUploadService;
