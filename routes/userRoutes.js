const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//create user or signup
router.post("/signup", userController.createUser);

//get user
router.get("/user/:_id", userController.getUser);

//get all users
router.get("/users", userController.getAllUser);

//Update user
router.put("/updateuser/:_id", userController.updateUser);

//Login
router.get("/login", userController.loginUser);

//send OTP
router.get("/sendotp", userController.sendOtpMail);

//verify OTP
router.post("/verifyotp", userController.verifyOtp);

//forget password
router.put("/forgetpassword", userController.forgetpassword);

//delete user
router.delete("/deleteuser/:_id", userController.deleteUser);

module.exports = router;
