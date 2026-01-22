const express = require("express");
const app = express();
const { connectDB } = require("./config/db_connect");
// const { adminAuth, userAuth, rateLimiter } = require("./middlewares/auth");
const User = require("./models/users");
app.use(express.json());

app.get("/feed", async (req, res, next) => {
  let data = await User.find({});
  res.send(data);
});

app.post("/createUser", async (req, res, next) => {
  let data = req.body;
  let response = new User(data);
  let result = await response.save();
  res.send("User Addedd Successfully!!");
});

app.delete("/deleteUser", async (req, res, next) => {
  let response = await User.deleteMany({
    email: req.body.email,
  });

  if (response.deletedCount > 0) {
    res.send(`User Deleted Successfully!!!, ${response.deletedCount}`);
  } else {
    res.send(`No user found!!, ${response.deletedCount}`);
  }
});

app.patch("/updateUser/:id", async (req, res, next) => {
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

// ----------------------------------------------------------------------------------------------------------

app.use(/.*/, (req, res, next) => {
  res.status(404).send("Page Not Found!!!");
});

app.use((err, req, res, next) => {
  let statusCode = err.status || 404;
  res.status(statusCode).json({
    error: true,
    errorMessage: err.message || "User Not Found!!!",
  });
});

connectDB()
  .then(() => {
    console.log("Database Connected!!!");
    app.listen(3000, () => {
      console.log("App listening on server 3000.....");
    });
  })
  .catch((err) => {
    console.log("Error stuck :> ", err);
  })
  .finally(() => {
    console.log("Finally Runs!!!!!");
  });
