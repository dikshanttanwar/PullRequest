const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { signupValidation } = require("../utils/validation");
const User = require("../models/users");
const { userAuth } = require("../middlewares/userAuth");

authRouter.post("/signup", async (req, res, next) => {
  try {
    signupValidation(req);

    let { firstName, lastName, email, password } = req.body;

    let passwordHash = await bcrypt.hash(password, 10);

    let newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await newUser.save();
    res.send("User created successfully!!");
  } catch (err) {
    throw new Error("Error -:)" + err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    let isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      let token = await user.getJWT();

      res.cookie("token", token);
      res.send("Correct Password");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res, next) => {
  let user = req.user;
  res.clearCookie("token");
  res.send(user.firstName + " Logged Out successfully!!");
});

module.exports = authRouter;
