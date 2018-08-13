const express = require("express");
const router = express.Router();

const OrderManagerController = require("../api/controllers/admin/order/order.controller");
const orderManagerController = new OrderManagerController();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

router
  .post("/admin/order/create", auth.isAdmin, validation(entryDataValidate.createOrder), orderManagerController.createOrder)
  .put("/admin/order/update", auth.isAdmin, validation(entryDataValidate.updateOrder), orderManagerController.updateOrder)
  .get("/admin/order/find/all", auth.isAdmin, validation(entryDataValidate.findAllOrder), orderManagerController.findAll)
  .get("/admin/order/find/all/forDataTable", auth.isAdmin, validation(entryDataValidate.findAllOrderForDataTable), orderManagerController.findAllForDataTable)
  .delete("/admin/order/delete", auth.isAdmin, validation(entryDataValidate.deleteOrder), orderManagerController.deleteOrder)

module.exports = router;