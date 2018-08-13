const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;
const Constant = require("../../common/constants");

class CameraService {
  create(obj) {
    return sequelize.transaction(t => {
      return models.Camera.create(obj, { transaction: t }).then(rs => {
        let namespace = Constant.PREFIX_NAMESPACE + rs.id;
        return rs.update({ namespace }, { transaction: t });
      });
    })
  }

  update(obj, cameraId) {
    return models.Camera.findById(cameraId).then(camera => {
      return camera.update(obj);
    })
  }

  delete(cameraId) {
    return models.Camera.destroy({ where: { id: cameraId } });
  }

  findById(cameraId) {
    return models.Camera.findById(
      cameraId,
      {
        include: [
          {
            model: models.Video,
            as: "videos"
          }
        ]
      }
    );
  }

  findByName(name) {
    return models.Camera.findOne({ where: { name: name } })
  }

  findByNamespace(namespace) {
    return models.Camera.findOne({ where: { namespace: namespace } });
  }

  findByUri(uri) {
    return models.Camera.findOne({ where: { uri: uri } });
  }

  findAll(params) {
    let name = params.name;
    let uri = params.uri;
    let location = params.location;
    let limit = params.limit;
    let offset = params.offset;

    let conditions = {};

    if (name) {
      conditions.name = { [Op.like]: "%" + name + "%" };
    }

    if (location) {
      conditions.location = { [Op.like]: "%" + location + "%" };
    }

    if (uri) {
      conditions.uri = { [Op.eq]: uri };
    }

    return models.Camera.findAndCountAll({ where: conditions, limit, offset });
  }
}

module.exports = CameraService;
