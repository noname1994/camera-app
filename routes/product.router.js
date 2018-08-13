const express = require("express");
const router = express.Router();

const validation = require("express-validation");
const entryDataValidate = require("./validation/entry.data.validate");

const ProductManagerController = require("../api/controllers/admin/product/product-manager.controller");
const productManagerController = new ProductManagerController();

// const ProductController = require("../api/controllers/product/product.controller");
// const productController = new ProductController();

const TypeManagerController = require("../api/controllers/admin/product/type-manager.controller");
const typeManagerController = new TypeManagerController();

const Auth = require("../api/controllers/auth/auth.controller");
const auth = new Auth();

router
  .post("/admin/product/create", auth.isAdmin, validation(entryDataValidate.createProduct), productManagerController.createProduct)
  .put("/admin/product/update", auth.isAdmin, validation(entryDataValidate.updateProduct), productManagerController.updateProduct)
  .delete("/admin/product/delete", auth.isAdmin, validation(entryDataValidate.deleteProduct), productManagerController.deleteProduct)
  .get("/admin/product/find/all/forDataTable", validation(entryDataValidate.findAllProductForDataTable), productManagerController.findAllForDataTable)
  .get("/product/find/all", validation(entryDataValidate.findAllProduct), productManagerController.findAll)
  .get("/product/detail", validation(entryDataValidate.getDetailProduct), productManagerController.getDetailProduct)
  // type of product
  .post("/admin/type/create", auth.isAdmin, validation(entryDataValidate.creatType), typeManagerController.createType)
  .post("/admin/type/update", auth.isAdmin, validation(entryDataValidate.updateType), typeManagerController.updateType)
module.exports = router;
