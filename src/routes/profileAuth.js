const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const {
  validateEditProfileData,
  validatePassword,
} = require("../utils/validation");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/multer");
const uploadToCloudinary = require("../utils/cloudinary");

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

profileRouter.patch( "/profile/edit", userAuth, upload.single("photoURL"), async (req, res, next) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid fields!!");
      }

      let loggedInUser = req.user;

      if (req.file) {
        console.log(
          "LOG: Received binary buffer. Initializing Cloudinary stream...",
        );
        const result = await uploadToCloudinary(req.file.buffer);
        loggedInUser.photoURL = result.secure_url;
        console.log(result.secure_url);
      }

      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );

      await loggedInUser.save();

      res.json({
        message: `${req.user.firstName}, Your profile is updated!`,
        user: loggedInUser,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },
);

profileRouter.patch("/profile/password", userAuth, async (req, res, next) => {
  try {
    if (!validatePassword(req)) {
      throw new Error("Password not valid!");
    }

    let loggedInUser = req.user;
    let userInputPassword = req.body.password;
    let user = await User.findById(loggedInUser._id).select("+password");

    let isPasswordsSame = await user.validatePassword(userInputPassword);

    if (isPasswordsSame) {
      throw new Error("Password cannot be same as old one!!");
    }

    loggedInUser.password = await bcrypt.hash(userInputPassword, 10);

    await loggedInUser.save();

    res.clearCookie("token");

    res.json({
      message: `${loggedInUser.firstName}, Your password has been updated! Please login again`,
      user: loggedInUser,
    });
  } catch (err) {
    throw new Error("Err : " + err.message);
  }
});

module.exports = profileRouter;
