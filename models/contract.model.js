const mongoose = require("mongoose");

//creating a schema for contract
const ContractSchema = new mongoose.Schema(
  {
    createdby: {
      type: String,
      enum: ["client", "skprovider"],
      required: true,
    },
    userid: { type: String, required: true },
    workerid: { type: String, required: false },
    category: { type: String, required: true },
    title: { type: String, required: false },
    description: { type: String, required: true },
    worktype: {
      type: String,
      enum: ["online", "physical"],
      required: false,
    },
    created: { type: Date, default: Date.now },
    jobdate: { type: String, require: false },
    budget: { type: String, required: false },
    location: { type: String, required: true },
    payment: { type: Boolean, required: false },
  },
  { collection: "contracts" }
);

//creating a model for contract
const Contract = mongoose.model("Contract", ContractSchema);

//export the model
module.exports = Contract;
