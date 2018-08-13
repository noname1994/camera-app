const express = require("express");
const router = express.Router();

const NewsManagerController = require("../api/controllers/admin/news/news.controller");
const newsManagerController = new NewsManagerController();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

module.exports = router;