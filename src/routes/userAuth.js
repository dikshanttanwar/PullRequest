const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { signupValidation } = require("../utils/validation");
const User = require("../models/users");

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

authRouter.delete("/deleteUser/:id", async (req, res, next) => {
  let userId = req.params.id;
  try {
    let response = await User.findByIdAndDelete(userId);
    console.log(response);
    if (response) {
      res.status(201).send("User Deleted Successfully!");
    } else {
      throw new Error("Not Working properly!!!!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!!! " + err.message);
  }
});

authRouter.patch("/updateUser/:id", async (req, res, next) => {
  let userID = req.params.id;
  let data = req.body;

  let ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "about",
  ];

  try {
    let isUpdated = Object.keys(data).every((e) => ALLOWED_UPDATES.includes(e));

    if (!isUpdated) {
      throw new Error("Constraint won't allowed");
    }

    let response = await User.findByIdAndUpdate(userID, data, {
      returnDocument: false,
      runValidators: true,
    });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;
