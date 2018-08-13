const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class VideoService {

    create(newVideo) {
        return models.Video.create(newVideo);
    }

    update(obj, videoId) {
        return models.Video.findById(videoId).then(video => {
            return models.Video.update(obj, { where: { id: videoId } });
        })
    }

    findByUrl(url) {
        return models.Video.findOne({ where: { url: url } });
    }

    findByCameraId(cameraId) {
        return models.Video.findOne({ where: { camera_id: cameraId } });
    }

    findById(videoId) {
        return models.Video.findById(videoId);
    }

    findAll(params) {
        let created_type = params.created_type;
        let camera_id = params.camera_id;
        let searchText = params.searchText;
        let limit = params.limit;
        let offset = params.offset;

        let conditions = {};

        if (created_type) {
            conditions.created_type = { [Op.like]: "%" + created_type + "%" };
        }
        if (camera_id){
            conditions.camera_id = { [Op.like]: camera_id};
        }
        if (searchText){
            conditions.title = { [Op.like]: "%" + searchText + "%" };
        }

        return models.Video.findAndCountAll({ where: conditions, limit, offset });
    }
    delete(arrId) {
        return models.Video.destroy({ where: { id: arrId } });
    }
}

module.exports = VideoService;