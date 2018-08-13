const express = require("express");
const router = express.Router();

const ImageUploadController = require("../api/controllers/admin/file/image-upload.controller");
const imageUploadController = new ImageUploadController();

const FileController = require("../api/controllers/admin/file/file.controller");
const fileController = new FileController();

router
	.post("/file/upload", fileController.uploadFile, imageUploadController.createFileUpload)
	.get("/file/download", fileController.downloadFile);

module.exports = router;
