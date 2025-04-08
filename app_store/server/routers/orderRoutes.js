const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");

orderRouter.get("/existingOrders/:admin_id", orderController.getPendingOrInProcessOrders);
orderRouter.patch("/:order_id/approve", orderController.approveOrderBySupplier);  
orderRouter.patch("/:order_id/confirm", orderController.confirmOrderByAdmin); 
orderRouter.get("/supplier_id/:supplier_id", orderController.getOrdersBySupplierId); 
orderRouter.get("/pending/:supplier_id", orderController.getPendingOrdersBySupplier);
orderRouter.post("/createOrder", orderController.createOrderByAdminAndSupplier);
orderRouter.get("/:admin_id", orderController.getOrdersByAdmin);

module.exports = orderRouter;

