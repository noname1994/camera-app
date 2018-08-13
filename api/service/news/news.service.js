const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class NewsService {

    create(newNews) {
        return models.News.create(newNews);
    }

    update(newNews, newsId) {
        return models.News.update(newNews, { where: { id: newsId } });
    }

    delete(arrId) {
        return models.News.destroy({ where: { [Op.or]: arrId } });
    }

    findAll(params) {
        let limit = params.limit;
        let offset = params.offset;
        return models.News.findAll({ limit, offset });
    }

    findById(newsId) {
        return models.News.findById(newsId);
    }
}