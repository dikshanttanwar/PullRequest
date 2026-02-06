const express = require("express");
const app = express();
const { connectDB } = require("./config/db_connect");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const auth = require("../src/routes/auth");
const requestAuth = require("../src/routes/requestAuth");
const profileAuth = require("../src/routes/profileAuth");
const userAuth = require("../src/routes/user");

app.use("/", auth);
app.use("/", requestAuth);
app.use("/", profileAuth);
app.use("/", userAuth);

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
