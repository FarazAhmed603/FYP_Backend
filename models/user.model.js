const mongoose = require("mongoose");


//creating a schema for user

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    cnic: { type: String, required: false },
    location: { type: String, required: false },
    skill: [{ type: String, required: false }],
    otp: { type: String, required: false },
    education: { type: String, required: false },
    profile: { type: String, required: false },
    description: { type: String, required: false },
    notification: [{ title: { type: String } }],
    otpverify: { type: Boolean, required: false },
    userstatus: {
      type: String,
      enum: ["pending", "block", "verified"],
      required: false,
    },
  },

  { collection: "users" }
);


//creating a model for user
const User = mongoose.model("User", userSchema);

//export the model
module.exports = User;
