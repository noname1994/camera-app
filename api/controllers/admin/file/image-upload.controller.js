const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ImageUploadService = require("../../../service/file-upload/Image-upload.service");
const imageUploadService = new ImageUploadService();

const TAG = "File_UPLOAD_CONTROLLER";

class ImageUploadController {
  createFileUpload(req, res, next) {
    let arrFileUpload = req.body;
    if (arrFileUpload) {
      imageUploadService.createImageUpload(arrFileUpload)
        .then(
          result => {
            let response = {};
            response.total = result.length;
            response.list = result;
            res.status(200);
            let successResponse = new SuccessResponse(200, "SUCCESS", response);
            return res.json(successResponse);
          }
        ).catch(error => {
          next(error);
        });
    }
  }
}

module.exports = ImageUploadController;
