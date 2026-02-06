const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const requestConnection = require("../models/connectionRequest");
const User = require("../models/users");

userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    let loggedInUser = req.user;

    let connectionRequests = await requestConnection
      .find({
        toUserID: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserID", "firstName lastName");

    res.json({
      message: `${connectionRequests.length}, Request found!`,
      connectionRequests,
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    let loggedInUser = req.user;

    let connections = await requestConnection
      .find({
        $or: [
          { fromUserID: loggedInUser._id, status: "accepted" },
          { toUserID: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserID", "firstName lastName")
      .populate("toUserID", "firstName lastName");

    let data = connections.map((row) => {
      if (row.fromUserID._id.toString() === loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });

    res.json({
      message: `You have ${data.length} connections`,
      data,
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res, next) => {
  try {
    let loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    let connections = await requestConnection
      .find({
        $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
      })
      .select("fromUserID toUserID");

    let hideUserList = new Set();
    hideUserList.add(loggedInUser._id.toString());

    connections.forEach((req) => {
      hideUserList.add(req.fromUserID.toString());
      hideUserList.add(req.toUserID.toString());
    });

    let allUsers = await User.find({
      _id: { $nin: Array.from(hideUserList) },
    })
      .select("firstName lastName")
      .skip(skip)
      .limit(limit);

    res.json({ message: "All Users", allUsers });
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
