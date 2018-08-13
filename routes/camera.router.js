const express = require("express");
const router = express.Router();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");


const CameraManagerController = require("../api/controllers/admin/camera/camera.controller");
const cameraManagerController = new CameraManagerController();

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

router
  .post("/admin/camera/create", auth.isAdmin, validation(entryDataValidate.createCamera), cameraManagerController.createCamera)
  .put("/admin/camera/update", auth.isAdmin, validation(entryDataValidate.updateCamera), cameraManagerController.updateCamera)
  .get("/admin/camera/find/all", auth.isAdmin, validation(entryDataValidate.findAllCamera), cameraManagerController.findAll)
  .get("/admin/camera/find/all/forDataTable", auth.isAdmin, validation(entryDataValidate.findAllCameraForDataTable), cameraManagerController.findAllForDataTable)
  .get("/admin/camera/detail", auth.isAdmin, validation(entryDataValidate.getDetailCamera), cameraManagerController.getDetailCamera);

module.exports = router;
