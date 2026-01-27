const JWT = require("jsonwebtoken");
const Users = require("../models/users");

const userAuth = async (req, res, next) => {
  try {
    let cookies = req.cookies;
    let { token } = cookies;
    if (!token) {
      return res.status(404).send("Invalid Token!");
    }

    let decodedMessage = JWT.verify(token, "Dikshant@Tinder123");
    let { _id } = decodedMessage;

    let user = await Users.findById(_id).select("-password");
    if (!user) {
      return res.status(404).send("Invalid User!");
    }
    req.user = user;

    next();
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
};

module.exports = { userAuth };
