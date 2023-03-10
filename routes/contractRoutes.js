const express = require("express");
const router = express.Router();
const contractCotroller = require("../controllers/contractController");

//create contract
router.post("/newcontract", contractCotroller.createContract);

//get contracts
router.get("/getcontract", contractCotroller.Contracts);

//get Alocated contracts
router.get("/allocatedcontracts", contractCotroller.allocatedcontracts)

//get single contract
router.get("/contract/:_id", contractCotroller.getSingleContract);

//delete contract
router.delete("/deletecontract/:_id", contractCotroller.deleteContract);

//update contract
router.put("/updatecontract/:_id", contractCotroller.updateContract);

module.exports = router;
