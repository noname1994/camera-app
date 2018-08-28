const express = require("express");
const router = express.Router();

const NewsManagerController = require("../api/controllers/admin/news/news.controller");
const newsManagerController = new NewsManagerController();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();


router
  .post("/admin/news/create", auth.isAdmin, validation(entryDataValidate.createNews), newsManagerController.createNews)
  .put("/admin/news/update", auth.isAdmin, validation(entryDataValidate.updateNews), newsManagerController.updateNews)
  .delete("/admin/news/delete", auth.isAdmin, validation(entryDataValidate.deleteNews), newsManagerController.deleteNews)
  .get("/admin/news/find/all/forDataTable", validation(entryDataValidate.findAllNewsForDataTable), newsManagerController.findAllForDataTable)
  .get("/news/find/all", validation(entryDataValidate.findAllNews), newsManagerController.findAll)
  .get("/news/detail", validation(entryDataValidate.getDetailNews), newsManagerController.getDetailNews)
  
module.exports = router;