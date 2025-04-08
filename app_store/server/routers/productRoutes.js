const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");


productRouter.get("/:supplier_id",  productController.getProductById);
productRouter.post("/",  productController.addProduct);

module.exports = productRouter;
