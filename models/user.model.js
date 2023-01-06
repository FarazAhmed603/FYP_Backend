const mongoose = require("mongoose");

//creating a schema for user

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    loaction: { type: String, required: false },
    skill: [{ type: String, required: false }],
    otp: { type: String, required: false },
    education: { type: String, required: false },
    profile: { type: String, required: false },
    description: { type: String, required: false },
    notification: [{ title: { type: String } }],
  },

  { collection: "users" }
);

//creating a model for user
const User = mongoose.model("User", userSchema);

//export the model
module.exports = User;
