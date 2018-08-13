const multer = require("multer");
const path = require("path");
const constants = require("../../../common/constants");
const fs = require("fs");
const mime = require("mime");
const appRoot = require('app-root-path');

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;

const ImageUploadDTO = require("../../../dto/file/image-upload.dto");
const TAG = "FILE_CONTROLLER";

// create folder
fs.existsSync(path.join(appRoot.toString(), constants.IMAGE_PATH)) || fs.mkdirSync(path.join(appRoot.toString(), constants.IMAGE_PATH));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let mimetype = file.mimetype;
    if (
      mimetype == "image/gif" ||
      mimetype == "image/png" ||
      mimetype == "image/jpeg" ||
      mimetype == "image/bmp" ||
      mimetype == "image/webp"
    ) {
      callback(null, constants.IMAGE_PATH);
    } else {
      callback(null, constants.DOCUMENT_PATH);
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname);
  }
});

class FileController {
  uploadFile(req, res, next) {
    let upload = multer({
      storage: storage,
      fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, true);
      },
      limits: {
        fileSize: constants.LIMIT_SIZE_FILE_UPLOAD
      }
    }).array("file", constants.MAXIMUM_NUMBER_FILE_UPLOAD);

    upload(req, res, err => {
      if (err) {
        next(err);
      } else {
        let tmp = [];
        // node : if single type --> req.file : array --> req.files
        req.files.forEach(function (file) {
          let newImg = ImageUploadDTO.infoCreate(file);
          tmp.push(newImg);
        }, this);

        // tmp.url = req.file.path;
        if (tmp.length > 0) {
          // next  to middware --> save info file to database
          req.body = tmp;
          next();
        } else {
          let objecSuccess = new SuccessResponse(200, "NO_OBJECT", {});
          res.status(200);
          return res.json(objecSuccess);
        }
      }
    });
  }

  downloadFile(req, res, next) {
    let pathRequest = req.query.filePath.trim();
    let filePath = "public//" + pathRequest;
    // check file exist
    fs.exists(filePath, isExists => {
      if (isExists) {
        res.download(filePath);
      } else {
        let errorResponse = new ErrorResponse(400, `File path '${pathRequest}' not exist`, {});
        res.status(400);
        return res.json(errorResponse);
      }
    });
  }
}

module.exports = FileController;
