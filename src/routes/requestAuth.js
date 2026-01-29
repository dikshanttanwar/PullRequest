const express = require("express");
const requestAuth = express.Router();
const { userAuth } = require("../middlewares/userAuth");
3
requestAuth.post("/sendConnetionRequest", userAuth, async (req, res, next) => {
  let { firstName } = req.user;
  console.log(req.user);
  res.send(firstName + " Send connection request!!");
});

module.exports = requestAuth;
