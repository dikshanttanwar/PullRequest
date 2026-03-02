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

    const savedUser = await newUser.save();

    let token = await savedUser.getJWT();

    res.cookie("token", token, { httpOnly: true });

    delete savedUser.password;

    res.json({
      message : "User created successfully!!",
      data: savedUser
    })
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    let isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      let token = await user.getJWT();

      delete user.password;

      res.cookie("token", token, { httpOnly: true });
      res.json({
        message: `${user.firstName}, Logged In Successful`,
        user,
      });
    } else {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid Credentials!" });
  }
});

authRouter.post("/logout", userAuth, async (req, res, next) => {
  let user = req.user;
  res.clearCookie("token");
  res.send(user.firstName + " Logged Out successfully!!");
});

module.exports = authRouter;
