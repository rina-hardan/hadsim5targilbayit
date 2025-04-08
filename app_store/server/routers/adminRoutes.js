const express=require("express");
const adminRouter=express.Router();
const adminController=require("../controllers/adminController")
const validateLogin=require("../middlewares/validateLogin")

adminRouter.post("/login", validateLogin, adminController.login);
adminRouter.post("/register",adminController.addAdmin);

module.exports=adminRouter;
