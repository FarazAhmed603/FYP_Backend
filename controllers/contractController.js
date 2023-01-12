const contract = require("../models/contract.model");
const User = require("../models/user.model");

//create contract
const createContract = async (req, res) => {
  try {
    const fetchuser = await User.findById(req.body.userid);
    if (!fetchuser) {
      return res.status(404).send({
        message: `Internal server error`,
        error: true,
      });
    }

    const newcontract = await contract.create({
      userid: req.body.userid,
      workerid: req.body.workerid,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      worktype: req.body.worktype,
      jobdate: req.body.jobdate,
      budget: req.body.budget,
      location: req.body.location,
    });
    res.status(200).send(newcontract);
  } catch (err) {
    res.status(400).send("data is not found " + err);
  }
};

//get Contract for user
const getContract = async (req, res) => {
  const { userid } = req.body;
  try {
    const fetchcontract = await contract.find({ where: { userid } });
    res.status(200).send(fetchcontract);
  } catch (err) {
    res.status(400).send("contract not found " + err);
  }
};

//get contract by id
const getSingleContract = async (req, res) => {
  const { userid } = req.body;
  try {
    const fetchcontract = await contract.findById(req.params._id);
    res.status(200).send(fetchcontract);
  } catch (err) {
    res.status(400).send("contract not found " + err);
  }
};

//update contarct
const updateContract = async (req, res) => {
  try {
    const fetchcontract = await contract.findById(req.params._id);
    if (!fetchcontract) {
      return res.status(404).send({
        message: `No contract found`,
        error: true,
      });
    }
    (fetchcontract.workerid = req.body.workerid),
      (fetchcontract.category = req.body.category),
      (fetchcontract.title = req.body.title),
      (fetchcontract.description = req.body.description),
      (fetchcontract.worktype = req.body.worktype),
      (fetchcontract.jobdate = req.body.jobdate),
      (fetchcontract.budget = req.body.budget),
      (fetchcontract.location = req.body.location),
      await fetchcontract.save();
    res.status(200).send(fetchcontract);
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

//delete contract
const deleteContract = async (req, res) => {
  try {
    const deleteContract = await contract.deleteOne({ _id: req.params._id });
    res.status(200).json({ Status: "successfull", message: "record deleted" });
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

module.exports = {
  createContract,
  getContract,
  getSingleContract,
  deleteContract,
  updateContract,
};


//node.js
// verify user for skill provider
// delete skill

//react.native
// forget pass
// 

//react.js
// view deatail ui