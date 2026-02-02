const express = require("express");
const requestAuth = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/users");
const requestConnection = require("../models/connectionRequest");

requestAuth.post(
  "/request/:status/:toUserID",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserID = req.user._id;
      const { toUserID, status } = req.params;

      // Check Allowed Status
      let ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Check User exist
      const isToUser = await User.findById(toUserID);
      if (!isToUser) {
        return res.status(400).json({ message: "User not Found!!" });
      }

      // Check Exising Connection Request
      const existingConnectionRequest = await requestConnection.findOne({
        $or: [
          {
            fromUserID,
            toUserID,
          },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exist!!" });
      }

      const newRequestConnection = await new requestConnection({
        fromUserID,
        toUserID,
        status,
      });

      let data = await newRequestConnection.save();

      res.json({
        message: `${status} Request sent successfully`,
        data,
      });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = requestAuth;
