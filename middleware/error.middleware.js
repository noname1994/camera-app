const validation = require("express-validation");
const winston = require("../config/winston.config");

const ValidationError = validation.ValidationError;

const CustomizeError = require("../api/exception/customize-error");

module.exports = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);

  winston.error(
    `${err.status || 500} - ${err.message} -${err.stack}- ${req.originalUrl} - ${
    req.method
    } - ${req.ip}`
  );

  // console.log(`${err.status || 500} - ${err.message} -${err.stack} - ${req.originalUrl} - ${
  //   req.method
  //   } - ${req.ip}`);

  if (err instanceof ValidationError) {
    // customize error
    let status = err.status;
    let errors = err.errors;
    let msg = "";
    if (errors) {
      errors.forEach(el => {
        msg += el["messages"] + "\n";
      });
    }

    let objError = { result: status, message: msg };
    res.status(status);
    return res.json(objError);
  } else if (err instanceof CustomizeError) {
    res.status(err.status);
    return res.json({ result: err.status, message: err.message });
  }
  else {
    // catch error of multer
    if (err.code == "LIMIT_PART_COUNT" || err.code == "LIMIT_FILE_SIZE" || err.code == "LIMIT_FILE_COUNT" || err.code == "LIMIT_FIELD_KEY"
      || err.code == "LIMIT_FIELD_VALUE" || err.code == "LIMIT_FIELD_COUNT" || err.code == "LIMIT_UNEXPECTED_FILE") {
      return res.json({ result: err.status || 400, message: err.code });
    }

    //
    res.status(err.status || 500);
    return res.json({ error: err });
  }
};
