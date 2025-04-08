const express = require("express");
const supplierRouter = express.Router();
const supplierController = require("../controllers/supplierController");

supplierRouter.post("/register", supplierController.addSupplier);
supplierRouter.post("/login", supplierController.login);
supplierRouter.get("/AllSuppliers", supplierController.getAllSuppliers);
supplierRouter.get("/:id", supplierController.getSupplierById);

module.exports = supplierRouter;
