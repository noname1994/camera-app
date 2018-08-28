const models = require("../../models/index");
const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

class NewsService {

    create(newNews, images) {
        return sequelize.transaction(t => {
            return models.News.create(newNews, { transaction: t }).then(news => {
                let arrPromise = [];
                if (images) {
                    images.forEach(image => {
                        arrPromise.push(models.ImageUpload.update({ priority: image.priority, news_id: news.id }, { where: { id: image.id }, transaction: t }));
                    });
                }
                return Promise.all(arrPromise).then(() => {
                    return news;
                })
            })
        })
    }

    update(newNews, images) {
        return sequelize.transaction(t => {
            return models.News.findById(newNews.id, { transaction: t }).then(news => {
                return news.update(newNews, { transaction: t }).then(() => {
                    let arrPromise = [];
                    let conditionImage = [];
                    // search images by array id 
                    images.forEach(image => {
                        conditionImage.push({ id: image.id });
                    })
                    return models.ImageUpload.findAll({ where: { [Op.or]: conditionImage }, transaction: t }).then(imageResult => {
                        //update news_id on all new images and  news_id = null in all old images 
                        if (imageResult) {
                            arrPromise.push(news.setImages(imageResult, { transaction: t }));
                        }
                        return Promise.all(arrPromise).then(() => {
                            return news;
                        })
                    });
                })
            })
        })
    }

    updateStatus(newsId, status) {
        return models.News.update({ status }, { where: { id: newsId } });
    }

    delete(arrId) {
        return models.News.destroy({ where: { id: arrId } });
    }

    findById(newsId) {
        return models.News.findById(newsId, {
            include: [
                {
                    model: models.ImageUpload,
                    as: "images"
                }
            ]
        });
    }


    findAll(params) {
        let status = params.status;
        let limit = params.limit;
        let offset = params.offset;

        let conditions = {};  // using for search by news 

        if (status) {
            conditions.status = { [Op.eq]: status };
        }

        return models.News.findAndCountAll(
            {
                distinct: true,
                where: conditions,
                limit,
                offset,
                include: [
                    {
                        model: models.ImageUpload,
                        as: "images"
                    }
                ]
            }
        )
    }
}

module.exports = NewsService;