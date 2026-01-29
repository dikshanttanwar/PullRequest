const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/users");

profileRouter.get("/profile", userAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

profileRouter.get("/feed", async (req, res, next) => {
  let data = await User.find({});
  res.send(data);
});

module.exports = profileRouter;
