const User = require("../models/user.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//Create user
const createUser = async (req, res) => {
  try {
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      location: req.body.location,
      skill: req.body.skill,
      otp: req.body.otp,
      education: req.body.education,
      profile: req.body.profile,
      description: req.body.description,
      notification: req.body.notification,
    });
    res.status(200).send(newuser);
  } catch (err) {
    res.status(400).send("data is not found " + err);
  }
};
//get all users
const getAllUser = async (req, res) => {
  try {
    const fetchuser = await User.find();
    res.status(200).send(fetchuser);
  } catch (err) {
    res.status(400).send("user not found " + err);
  }
};

//Get user
const getUser = async (req, res) => {
  try {
    const fetchuser = await User.findById(req.params._id);
    res.status(200).send(fetchuser);
  } catch (err) {
    res.status(400).send("user not found " + err);
  }
};

//Update user
const updateUser = async (req, res) => {
  try {
    const fetchuser = await User.findById(req.params._id);
    if (!fetchuser) {
      return res.status(404).send({
        message: `No user found`,
        error: true,
      });
    }
    (fetchuser.firstname = req.body.firstname),
      (fetchuser.lastname = req.body.lastname),
      (fetchuser.phone = req.body.phone),
      (fetchuser.location = req.body.location),
      (fetchuser.skill = req.body.skill),
      (fetchuser.education = req.body.education),
      (fetchuser.profile = req.body.profile),
      (fetchuser.description = req.body.description),
      (fetchuser.notification = req.body.notification),
      await fetchuser.save();
    res.status(200).send(fetchuser);
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const deleteuser = await User.deleteOne({ _id: req.params._id });
    res.status(200).json({ Status: "successfull", message: "record deleted" });
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

//Login user
const loginUser = async (req, res) => {
  try {
    const fetchuser = await User.findOne({ email: req.body.email });
    if (!fetchuser) {
      return res.status(404).send({
        message: `No user found`,
        error: true,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      fetchuser.password
    );
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials " + err);
    }

    const token = jwt.sign(
      {
        _id: fetchuser._id,
        firstname: fetchuser.firstname,
        lastname: fetchuser.lastname,
        email: fetchuser.email,
        phone: fetchuser.phone,
        location: fetchuser.loaction,
        skill: fetchuser.skill,
        education: fetchuser.education,
        profile: fetchuser.profile,
        description: fetchuser.description,
        notification: fetchuser.notification,
      },
      process.env.SECRET_KEY
    );

    res.status(200).json({ Status: "Logged IN", Token: token });
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

//forget password
const forgetpassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;
    const paramsToVerify = ["newPassword", "confirmNewPassword"];
    const areParamsMissing = verifyBodyParams(paramsToVerify, req.body);
    if (areParamsMissing.error) {
      return res.status(400).send(areParamsMissing);
    }
    if (newPassword != confirmNewPassword) {
      return res.status(400).send({
        message: `Passwords must match`,
        error: true,
      });
    }
    const isPwdValid = verifyPassword(newPassword);
    if (isPwdValid.error) {
      return res.status(400).send(isPwdValid);
    }
    const isCPwdValid = verifyPassword(confirmNewPassword);
    if (isCPwdValid.error) {
      return res.status(400).send(isCPwdValid);
    }
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        message: `No user with email found`,
        error: true,
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    return res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
};

//genrate OTP
const genrateOtp = () => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    return otp;
  } catch (err) {
    return err;
  }
};
//send OTP
const sendOtpMail = async (req, res, next) => {
  const email = req.body.email;
  const OTP = genrateOtp();
  const user = await User.findOne({ email: req.body.email });
  const MAIL_SETTINGS = {
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(MAIL_SETTINGS);
  try {
    if (!user) {
      return res.status(404).send({
        message: `No user with email found`,
        error: true,
      });
    }
    user.otp = OTP;
    await user.save();
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: req.body.email,
      subject: "OTP Verification",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to Invoswift.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Please denter the OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
     </div>
      `,
    });
    res.status(200).json({ Status: "successful", message: "OTP sent" });
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};
//verify OTP
const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        message: `No user with email found`,
        error: true,
      });
    }
    if (otp != user.otp) {
      return res.status(404).send({
        message: `Invalid OTP`,
        error: true,
      });
    }
    return res.status(200).send({
      message: `OTP verified successfully`,
    });
  } catch (err) {
    res.status(400).send("Internal server error " + err);
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  loginUser,
  sendOtpMail,
  verifyOtp,
  forgetpassword,
  getAllUser,
  deleteUser,
};
