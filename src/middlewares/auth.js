const adminAuth = (req, res, next) => {
  let token = "abc";
  let isTokenValid = token === "abc";

  if (!isTokenValid) {
    res.status(401).send("Unauthorized Access!!!!");
  } else {
    console.log("Token is Valid!!");
    next();
  }
};

const userAuth = (req, res, next) => {
  let userName = req.query;
  console.log(userName.userID);
  if (userName.userID === "dikshanttanwar") {
    next();
  } else {
    res.status(401).send("Invalid User!!");
  }
};

const rateLimiter = (req, res, next) => {
  let key = req.query.key;
  if (key === "123") {
    next();
  } else {
    const err = new Error("Invalid Key");
    err.statusCode = 403;
    next(err);
  }
};

module.exports = { adminAuth, userAuth, rateLimiter };
