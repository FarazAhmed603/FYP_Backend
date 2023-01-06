const express = require("express");
const router = express.Router();
const contractCotroller = require("../controllers/contractController");

//create contract
router.post("/newcontract", contractCotroller.createContract);

//get contract
router.get("/getcontract", contractCotroller.getContract);

//get single contract
router.get("/contract/:_id", contractCotroller.getSingleContract);

//delete contract
router.delete("/deletecontract/:_id", contractCotroller.deleteContract);

//update contract
router.put("/updatecontract/:_id", contractCotroller.updateContract);

module.exports = router;
