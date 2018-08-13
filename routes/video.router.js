const express = require("express");
const router = express.Router();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");


const VideoManagerController = require("../api/controllers/admin/camera/video.controller");
const videoManagerController = new VideoManagerController();

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

router
  .post("/admin/video/create", auth.isAdmin, validation(entryDataValidate.createVideo), videoManagerController.createVideo)
  .post("/admin/video/buildVideo", auth.isAdmin, validation(entryDataValidate.createVideo), videoManagerController.buildVideo)
  .put("/admin/video/update", auth.isAdmin, validation(entryDataValidate.updateVideo), videoManagerController.updateVideo)
  .get("/admin/video/find/all", auth.isAdmin, validation(entryDataValidate.findAllVideo), videoManagerController.findAll)
  .get("/admin/video/find/all/forDataTable", auth.isAdmin, validation(entryDataValidate.findAllVideoForDataTable), videoManagerController.findAllForDataTable)
  .delete("/admin/video/delete", auth.isAdmin, validation(entryDataValidate.deleteVideo), videoManagerController.deleteVideo)

module.exports = router;
