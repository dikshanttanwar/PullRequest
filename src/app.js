const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  req.userType = "Admin";
  next();
});

app.use("/", (req, res, next) => {
  req.isVIP = true;
  next();
});

app.get("/user", (req, res, next) => {
  res.send(`Hello, ${req.isVIP ? req.userType : "User"}.`);
});

// app.use("/", (req, res, next) => {
//   res.send("MiddleWare 1");
//   next();
// });

// app.use("/", (req, res, next) => {
//   res.send("MiddleWare 2");
//   next();
// });

// app.get("/user", (req, res) => {
//   res.send("Hii user How are you!!!!");
// });

// app.get("/profile", (req, res) => {
//   res.send("Hii Profile!! How are you!!!!");
// });

// app.use("/", (req, res, next) => {
//   res.send("Hello from the / URL");
//   next();
// });

// app.get("/profile", (req, res) => {
//   res.send("Hello from the Profiles!!!");
// });

// app.use("/profile", (req, res) => {
//   res.send("Developer's Profiles Here");
// });

// app.use("/profileDevs", (req, res) => {
//   res.send("Get all the Profiles Here");
// });

// app.use("/test", (req, res) => {
//   res.send("Testing endpoint");
// });

// app.use("/", (req, res) => {
//   res.send("Welcome to the Developer's Tinder");
// });

app.listen(3000, () => {
  console.log("Listening on 3000......");
});
