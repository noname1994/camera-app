"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const UserService = require("../../../service/user/user.service");
const userService = new UserService();

const constants = require("../../../common/constants");
const SECRET = constants.SECRET;
const EXPIRES_IN = constants.EXPIRES_IN;

const UserDTO = require("../../../dto/user/user.dto");

const StandardResponse = require("../../../dto/res.dto");
const SuccessResponse = StandardResponse.SuccessResponse;
const ErrorResponse = StandardResponse.ErrorResponse;
const DataTableResponse = StandardResponse.DataTableResponse;

const CustomizeError = require("../../../exception/customize-error");

const TAG = "USER-CONTROLLER";

class UserController {
  createUser(req, res, next) {
    let _body = req.body;
  }

  updateUser(req, res, next) { }

  login(req, res, next) {
    let _body = req.body;

    let email = _body.email;
    let password = _body.password;

    userService.findByEmail(email)
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password, (error, result) => {
            if (error) {
              next(error);
            }

            // password is wrong
            if (!result) {
              let error = new CustomizeError(TAG, 400, "Password is wrong");
              next(error);
            } else {
              // format roles for each store
              const payload = {
                email: user.email,
                fullname: user.fullname,
                address: user.address,
                phone_number: user.phone_number,
                roles: user.roles || []
              };

              var token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
              let successError = new SuccessResponse(200, "Success", token);
              res.status(200);
              return res.json(successError);
            }
          });
        } else {
          let error = new CustomizeError(TAG,400, "Email is wrong");
          next(error);
        }
      })
      .catch(error => {
        next(error);
      })
  }

  changePassword(req, res, next) { }

  findAllForDataTable(req, res, next) {
    let draw = req.query.draw;
    let offset = req.query.start || constants.OFFSET_DEFAULT; // default bootstrap start page offset at 0
    let pageSize = req.query.length || constants.PAGESIZE_DEFAULT;
    let limit = pageSize;
    let params = { limit, offset };

    userService.findAll(params).then(result => {

      let arr = [];
      let total = result.count || 0;
      let rows = result.rows || [];
      if (rows) {
        rows.forEach(el => {
          arr.push(UserDTO.infoResponse(el));
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
module.exports = UserController;
