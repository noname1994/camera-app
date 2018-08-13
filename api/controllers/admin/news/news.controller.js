const NewsService = require("../../../service/news/news.service");
const newsService = new NewsService();

const CustomizeError = require("../../../exception/customize-error");

const constants = require("../../../common/constants");
const NewsDTO = require("../../../dto/news/news.dto");
const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;

class NewsController {
    createNews(req, res, next) {

    }

    updateNews(req, res, next) {

    }

    deleteNews(req, res, next) {

    }

    updateStatusNews(req, res, next) {

    }
}

module.exports = NewsController;
