const express = require("express");
const router = express.Router();

const OrderManagerController = require("../api/controllers/admin/order/order.controller");
const orderManagerController = new OrderManagerController();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

module.exports = router;