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

//verify email
router.get("/verifyemail/:email", userController.verifyemail);

//Login
router.post("/login", userController.loginUser);

//logout
router.put("/logout/:email", userController.logout);

//send OTP
router.post("/sendotp", userController.sendOtpMail);

//verify OTP
router.put("/verifyotp", userController.verifyOtp);

//forget password
router.put("/forgetpassword", userController.forgetpassword);

//workerstatus
router.put("/userstatus", userController.userstatus)

//delete user
router.delete("/deleteuser/:_id", userController.deleteUser);

module.exports = router;
