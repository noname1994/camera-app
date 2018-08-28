const NewsService = require("../../../service/news/news.service");
const newsService = new NewsService();

const NewsDTO = require("../../../dto/news/news.dto");
const ImageUploadDTO = require("../../../dto/file/image-upload.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;

const CustomizeError = require("../../../exception/customize-error");

const constants = require("../../../common/constants");

const TAG = "NEWS-CONTROLLER";
class NewsController {
    createNews(req, res, next) {
        let _body = req.body;
        let newNews = NewsDTO.infoCreate(_body);
        let images = _body.images;

        Promise.all([newsService.create(newNews, images)]).then(result => {
            let successResponse = new SuccessResponse(200, "Success", result);
            res.status(200);
            return res.json(successResponse);
        }).catch(error => {
            next(error);
        })

    }

    updateNews(req, res, next) {
        let _body = req.body;
        let newNews = NewsDTO.infoUpdate(_body);
        let images = _body.images || [];

        if (!newNews.id) {
            let error = new CustomizeError(TAG, 400, "id of news must have");
            next(error);
        }

        // check name news
        newsService.findById(newNews.id).then(result => {
            if (result && result.id != newNews.id) {
                let error = new CustomizeError(TAG, 400, `id (${newNews.id}) is existed`);
                next(error);
            } else {
                newsService.update(newNews, images).then(result => {
                    let successResponse = new SuccessResponse(200, "Success", result);
                    res.status(200);
                    return res.json(successResponse);
                }).catch(error => {
                    next(error);
                })
            }
        }).catch(error => {
            next(error);
        })
    }

    deleteNews(req, res, next) {
        let arrId = req.query.arrId;
        console.log(arrId);
        if (!arrId) {
            let error = new CustomizeError(TAG, 400, "arrId of news must have");
            next(error);
        } else {
            newsService.delete(arrId).then(result => {
                if (result) {
                    let successReponse = new SuccessResponse(200, "Success", result);
                    return res.status(200).json(successReponse);
                } else {
                    let errorResponse = new ErrorResponse(400, "No news is deleted", null);
                    return res.status(200).json(errorResponse);
                }
            }).catch(error => {
                next(error);
            })
        }


    }

    getDetailNews(req, res, next) {
        let newsId = req.query.newsId;
        if (!newsId) {
            let error = new CustomizeError(TAG, 400, "id of news must have");
            next(error);
        }

        newsService.findById(newsId).then(result => {
            if (result) {
                let newsResponse = NewsDTO.infoResponse(result);
                let successReponse = new SuccessResponse(200, "Success", result);
                res.status(200);
                return res.json(successReponse);
            } else {
                let error = new CustomizeError(TAG, 400, "there isn't news found");
                next(error);
            }
        }).catch(error => {
            next(error);
        })

    }

    findAll(req, res, next) {
        let status = req.query.status;
        let pageNum = req.query.pageNum || constants.PAGENUM_DEFAULT;
        let pageSize = req.query.pageSize || constants.PAGESIZE_DEFAULT;

        let limit = pageSize;
        let offset = pageNum * pageSize;

        let params = { status, limit, offset };
        newsService.findAll(params).then(result => {

            let arr = [];
            let total = result.count || 0;
            let rows = result.rows || [];
            if (rows) {
                rows.forEach(el => {
                    arr.push(NewsDTO.infoResponse(el));
                });
            }
            let value = { total, arr };
            let successError = new SuccessResponse(200, "Success", value);
            res.status(200);
            return res.json(successError);
        }).catch(error => {
            next(error);
        })
    }

    findAllForDataTable(req, res, next) {
        let draw = req.query.draw;
        let offset = req.query.start || constants.OFFSET_DEFAULT; // default bootstrap start page offset at 0
        let pageSize = req.query.length || constants.PAGESIZE_DEFAULT;
        let limit = pageSize;
        let params = { limit, offset };

        newsService.findAll(params).then(result => {

            let arr = [];
            let total = result.count || 0;
            let rows = result.rows || [];
            if (rows) {
                rows.forEach(el => {
                    arr.push(NewsDTO.infoResponse(el));
                });
            }
            let value = { total, arr };
            let successResponse = new DataTableResponse(draw, total, arr);
            return res.status(200).json(successResponse);
        }).catch(error => {
            next(error);
        })
    }
}

module.exports = NewsController;
