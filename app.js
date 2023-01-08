const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const contractRoutes = require("./routes/contractRoutes");

mongoose.connect(
  process.env.DATABASE_STRING,
  (err) => {
    console.log("connected to mongodb");
    if (err) {
      console.log(err);
    }
  },
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());

app.use("/", userRoutes);
app.use("/", contractRoutes);

app.listen(process.env.PORT, function () {
  console.log("Server is running on Port: " + process.env.PORT);
});